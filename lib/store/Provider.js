import glob from 'glob';
import cp from 'recursive-copy';
import { join } from 'path';

import fs from '../fs';
import siteConfig from '../../siteConfig';
import Output from './Output';
import ResolveCategory from './ResolveCategory';
import ResolvePostMeta from './ResolvePostMeta';
import ResolveStat from './ResolveStat';
import toSlug from '../utils/toSlug';
import readJSON from '../utils/readJSON';

const { context, outputPath, docPath } = siteConfig;
let singleton = null;

class Provider {
  constructor() {

    Output.createSingleton({
      outputPath,
    })

    singleton = this;
  }

  static getInstance() {
    if (singleton) return singleton;
  }

  static createSingleton(opts) {
    if (singleton) return singleton;
    return new Provider(opts);
  }

  walk(pattern, opts) {
    return glob.sync(pattern, opts);
  }

  groupFilesByRootDir(paths) {
    // Path indicating a file will be ignored
    return paths.reduce((prev, path) => {
      const file = `${docPath}/${path}`;
      const stats = fs.statSync(file);
      const parts = path.split('/');
      if (parts.length === 1 && stats.isFile()) return prev;
      const key = parts[0];
      prev[key] = prev[key] ? prev[key].concat(path) : [path];
      return prev;
    }, Object.create(null));
  }

  resolveMeta() {
    // first resolve summary file first
    const docsPath = docPath;
    const globOpts = {
      cwd: docsPath,
    };

    const pattern1 = '*/';
    const directDirectories = this.walk(pattern1, globOpts);
    directDirectories.forEach(dir => {
      const cwd = `${docsPath}/${dir}`;
      ResolveCategory.parseSummary(cwd, dir)
    })

    const pattern2 = '**/*.md';
    const files = this.walk(pattern2, globOpts);
    const filesMap = this.groupFilesByRootDir(files);

    const rootDirs = Object.keys(filesMap);
    rootDirs.reduce((prev, rootDir) => {
      const files = filesMap[rootDir];
      const content = files.reduce((prev, file) => {
        const cwd = `${docPath}/${file}`;

        const stat = ResolveStat.parse({
          cwd,
          rootDir,
        })
        prev.stats[stat.id] = stat.toJson();

        const postMeta = ResolvePostMeta.parse({
          cwd,
        });
        prev.postmeta[postMeta.id] = postMeta.toJson();
        return prev;
      }, {
        stats: {},
        postmeta: {},
      })

      const { stats, postmeta } = content;

      const refineManifest = ResolveCategory.refineManifestAfterResolvePostMeta(docsPath, rootDir, postmeta);

      Output.getInstance().outputStats(rootDir, stats);
      Output.getInstance().outputPostMeta(rootDir, postmeta);
      Output.getInstance().outputRefineManifest(rootDir, refineManifest);
    }, null)
  }

  prepareDataSource(pathname) {
    const docPath = docPath;
    const subPathname = pathname.replace('/docs', '');
    const id = `${toSlug(docPath)}-${toSlug(subPathname)}`;

    if (pathname.startsWith('/docs/ios-sdk')) {
      cp(
        join(context, 'build', 'ios-sdk', 'refine.js'),
        join(docPath, 'refine.js'),
        { overwrite: true }
      )

      let stats = readJSON(join(context, 'build', 'ios-sdk', 'postmeta.js'));
      let info = stats[id];

      if (!info) {
        info = stats[`${id}-readme`];
      }

      fs.writeFileSync(
        join(docPath, 'postmeta.js'),
        '/**\n' +
          ' * @generated\n' +
          ' */\n' +
          'module.exports = ' +
          Output.formatContentBeforeOutput(info) +
          ';\n'
      );
    }

    if (pathname.startsWith('/docs/android-sdk')) {
      cp(
        join(context, 'build', 'android-sdk', 'refine.js'),
        join(docPath, 'refine.js'),
        { overwrite: true }
      )

      let stats = readJSON(join(context, 'build', 'android-sdk', 'postmeta.js'));
      let info = stats[id];

      if (!info) {
        info = stats[`${id}-readme`];
      }

      fs.writeFileSync(
        join(docPath, 'postmeta.js'),
        '/**\n' +
          ' * @generated\n' +
          ' */\n' +
          'module.exports = ' +
          Output.formatContentBeforeOutput(info) +
          ';\n'
      );
    }
  }
}

export default Provider;
