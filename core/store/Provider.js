import glob from 'glob';
import fs from 'fs';

import Output from './Output';
import ResolveCategory from './ResolveCategory';
import ResolvePostMeta from './ResolvePostMeta';
import ResolveStat from './ResolveStat';

class Provider {
  constructor(opts = {}) {
    const {
      outputPath, context
    } = opts;

    this.context = context || process.cwd();    // dir to resolve 'docs'
    Output.createSingleton({
      outputPath,
    })
  }

  resolveDocPath() {
    return `${this.context}/docs`;
  }

  tryCalNextOrder(prev, next) {
    const { parentSlug: prevParentSlug, order } = prev;
    const { parentSlug } = next;

    return prevParentSlug === parentSlug ? order + 1 : 0;
  }

  walk(pattern, opts) {
    return glob.sync(pattern, opts);
  }

  groupFilesByRootDir(paths) {
    // Path indicating a file will be ignored
    return paths.reduce((prev, path) => {
      const file = `${this.resolveDocPath()}/${path}`;
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
    const docsPath = this.resolveDocPath();
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
        const cwd = `${this.resolveDocPath()}/${file}`;

        const stat = ResolveStat.parse({
          cwd,
          rootDir,
        })
        prev.stats[stat.id] = stat.toJson();

        const postMeta = ResolvePostMeta.parse({
          cwd,
        });
        prev.postMetas[postMeta.id] = postMeta.toJson();
        return prev;
      }, {
        stats: {},
        postMetas: {},
      })

      const { stats, postMetas } = content;
      Output.getInstance().outputStats(rootDir, stats);
      Output.getInstance().outputPostMeta(rootDir, postMetas);
    }, null)
  }
}

export default Provider;
