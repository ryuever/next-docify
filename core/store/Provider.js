import glob from 'glob';
import Stat from './Stat';
import fs from 'fs';

import ResolveCategory from './ResolveCategory';
import ResolvePostMeta from './ResolvePostMeta';
import ResolveStat from './ResolveStat';

const statsMap = new Map();
const postMetasMap = new Map();

class Provider {

  static resolveDocPath() {
    const rootPath = process.cwd();
    return `${rootPath}/docs`;
  }

  static tryCalNextOrder(prev, next) {
    const { parentSlug: prevParentSlug, order } = prev;
    const { parentSlug } = next;

    return prevParentSlug === parentSlug ? order + 1 : 0;
  }

  static walk(pattern, opts) {
    return glob.sync(pattern, opts);
  }

  static resolveMeta() {
    // first resolve summary file first
    const docsPath = Provider.resolveDocPath();
    const globOpts = {
      cwd: docsPath,
    };

    const pattern1 = '*/';
    const directDirectories = Provider.walk(pattern1, globOpts);
    directDirectories.forEach(directory => {
      const cwd = `${docsPath}/${directory}`;
      ResolveCategory.parseSummary(cwd)
    })

    const pattern2 = '**/*.md';
    const files = Provider.walk(pattern2, globOpts);
    files.forEach(file => {
      console.log('file : ', file);
    });
  }

  static walk2() {
    const docsPath = Provider.resolveDocPath();
    const pattern = '**/*.md';
    const files = glob.sync(pattern, {
      cwd: docsPath,
    });

    let mapKey = null;

    const createMapKey = rootCategory => {
      return {
        category: rootCategory,
        order: 0,
      };
    };

    files.forEach(file => {
      const cwd = `${docsPath}/${file}`;
      const stat = new Stat({
        file,
        cwd,
      });

      const postMeta = ResolvePostMeta.parse(fs.readFileSync(cwd, 'utf8'));
      postMetasMap.set(cwd, postMeta);

      const rootCategory = stat.rootCategory;
      if (!mapKey || (mapKey.category !== rootCategory)) mapKey = createMapKey(rootCategory);
      if (!statsMap.get(mapKey)) statsMap.set(mapKey, []);

      const stats = statsMap.get(mapKey);
      const len = stats.length;

      if (!len) stat.order = 0
      else stat.order = Provider.tryCalNextOrder(stats[len -1], stat);

      stats.push(stat);
    });

    console.log('statsMap : ', statsMap);
    console.log('postMetasMap : ', postMetasMap);

    // Provider.outputPostMetas();
    // Provider.outputStats();
  }

  // toSlug(cwd) as key
  // descript file content info
  static outputPostMetas(category) {
    const data = Object.create(null);
    for (let key in this) {
      if (this.hasOwnProperty(key) && !key.startsWith('_')) {
        data[key] = this[key];
      }
    }

    fs.writeFileSync(
      process.cwd() + `/build/${category}/post-meta.js`,
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'module.exports = ' +
        JSON.stringify(data, null, 2) +
        ';\n'
    );
  }

  // descript file stat
  // toSlug(cwd) as key
  static outputStats(category) {
    const data = Object.create(null);

    fs.writeFileSync(
      process.cwd() + `/build/${category}/stats.js`,
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'module.exports = ' +
        JSON.stringify(data, null, 2) +
        ';\n'
    );
  }

  // descript category layout
  // should has tree structure
  static outputManifest(category) {
    const data = Object.create(null);

    fs.writeFileSync(
      process.cwd() + `/build/${category}/manifest.js`,
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'module.exports = ' +
        JSON.stringify(data, null, 2) +
        ';\n'
    );
  }
}

export default Provider;
