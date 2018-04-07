import { join, parse, relative } from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import chokidar from 'chokidar';
import { copySync, readFileSync, statSync } from 'fs-extra';
import fs, { isMemoryFs } from './fs';
import mkdirp from 'mkdirp';
import siteConfig from './siteConfig';
import notWithSuffix from './regs/notWithSuffix';

// This is only for using `memory-fs`
export function preCacheSourceFiles() {
  if (!isMemoryFs) {
    return;
  }

  const copyFileForMemoryFsUsage = docPath => {
    const files = glob.sync('**/*.md', {
      cwd: docPath,
    });

    files.forEach(file => {
      const dest = join(docPath, file);
      const { dir } = parse(dest);
      mkdirp(dir);
      fs.writeFileSync(dest, readFileSync(dest));
    });
  };

  const configs = siteConfig.resolveSiteConfig();
  configs.forEach(config => copyFileForMemoryFsUsage(config.docPath));
}

export function initOutputFolder() {
  const { outputPath } = siteConfig.resolveGlobalConfig();
  rimraf.sync(outputPath);
  mkdirp(outputPath);
}

function copyFileToStaticIfNecessary(sourceFile) {
  const { context } = siteConfig.resolveGlobalConfig();
  const { dir, base } = parse(sourceFile);
  const relativePath = relative(context, dir);
  const targetPath = join(context, 'static', relativePath);
  const targetFile = join(targetPath, base);

  // if file has the same mtime and filename, it will be considered as the same file.
  // no need to `unlink` and `add` file.
  if (fs.existsSync(targetFile)) {
    const { mtimeMs: sourceFileMtime } = statSync(sourceFile);
    const { mtimeMs: targetFileMtime } = statSync(targetFile);

    if (targetFileMtime !== sourceFileMtime) {
      rimraf.sync(targetFile);
    } else {
      return;
    }
  }

  mkdirp.sync(targetPath);
  copySync(sourceFile, targetFile);
}

function deleteFileFromStatic(sourceFile) {
  const { context } = siteConfig.resolveGlobalConfig();
  const { dir, base } = parse(sourceFile);
  const relativePath = relative(context, dir);
  const targetPath = join(context, 'static', relativePath);
  const targetFile = join(targetPath, base);

  if (fs.existsSync(targetFile)) {
    rimraf.sync(targetFile);
  }
}

function copyGlobDocAssetsToStatic(pattern) {
  const copyAssetsIfNecessary = docPath => {
    const files = glob.sync(pattern, {
      cwd: docPath,
    });

    files.forEach(file => {
      const sourceFile = join(docPath, file);
      copyFileToStaticIfNecessary(sourceFile);
    });
  };

  const configs = siteConfig.resolveSiteConfig();
  configs.forEach(config => {
    copyAssetsIfNecessary(config.docPath);
    watchAssetsFile(config.docPath, notWithSuffix(['png', 'jpg', 'jpeg']));
  });
}

// rename file name will trigger 'unlink' => 'add';
// replace file with a same file name will trigger 'change'
const watchAssetsFile = (path, ignore) => {
  const watcher = chokidar.watch(path, {
    persistent: true,
    ignored: ignore,
  });

  watcher
    .on('add', path => {
      copyFileToStaticIfNecessary(path);
    })
    .on('change', path => {
      copyFileToStaticIfNecessary(path);
    })
    .on('unlink', path => {
      deleteFileFromStatic(path);
    });
};

export function copyImageFileToStatic() {
  copyGlobDocAssetsToStatic('**/*.+(png|jpg|jpeg)');
}
