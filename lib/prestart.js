import { join, parse } from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import nodeFs from 'fs';
import fs, { isMemoryFs } from './fs';
import mkdirp from './mkdirp';
import siteConfig from './siteConfig';

// This is only for using `memory-fs`
export function preCacheSourceFiles() {
  if (!isMemoryFs) {
    return
  }

  const copyFileForMemoryFsUsage = (docPath) => {
    const files = glob.sync('**/*.md', {
      cwd: docPath,
    });

    files.forEach(file => {
      const dest = join(docPath, file);
      const { dir } = parse(dest);
      mkdirp(dir);
      fs.writeFileSync(dest, nodeFs.readFileSync(dest));
    })
  }

  const configs = siteConfig.resolveSiteConfig();
  configs.forEach(config => copyFileForMemoryFsUsage(config.docPath))
}

export function initOutputFolder() {
  const { outputPath }  = siteConfig.resolveGlobalConfig();
  rimraf.sync(outputPath);
  mkdirp(outputPath);
}
