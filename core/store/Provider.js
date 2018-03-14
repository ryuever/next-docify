import glob from 'glob';
import Stat from './Stat';
import ResolvePostMeta from './ResolvePostMeta';
import fs from 'fs';

const statsMap = new Map();
const postMetasMap = new Map();

class ResolveFileMeta {

  static getDocPath() {
    const rootPath = process.cwd();
    return `${rootPath}/docs`;
  }

  static tryCalNextOrder(prev, next) {
    const { parentSlug: prevParentSlug, order } = prev;
    const { parentSlug } = next;

    return prevParentSlug === parentSlug ? order + 1 : 0;
  }

  static resolveCategories(stats) {

  }

  static walk() {
    const docsPath = ResolveFileMeta.getDocPath();
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
      else stat.order = ResolveFileMeta.tryCalNextOrder(stats[len -1], stat);

      stats.push(stat);
    });

    console.log('statsMap : ', statsMap);
    console.log('postMetasMap : ', postMetasMap);

    // ResolveFileMeta.outputPostMetas();
    // ResolveFileMeta.outputStats();
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

export default ResolveFileMeta;
