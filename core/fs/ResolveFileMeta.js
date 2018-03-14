import glob from 'glob';
import Stat from './Stat';

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

  static walk() {
    const docsPath = ResolveFileMeta.getDocPath();
    const pattern = '**/*.md';
    const files = glob.sync(pattern, {
      cwd: docsPath,
    });

    const docsStatMap = new Map();
    let mapKey = null;

    const createMapKey = rootCategory => {
      return {
        category: rootCategory,
        order: 0,
      };
    };

    files.forEach(file => {
      const stat = new Stat({
        file,
        cwd: `${docsPath}/${file}`
      });
      const rootCategory = stat.rootCategory;
      if (!mapKey || (mapKey.category !== rootCategory)) mapKey = createMapKey(rootCategory);
      if (!docsStatMap.get(mapKey)) docsStatMap.set(mapKey, []);

      const stats = docsStatMap.get(mapKey);
      const len = stats.length;

      if (!len) stat.order = 0
      else stat.order = ResolveFileMeta.tryCalNextOrder(stats[len -1], stat);

      stats.push(stat);
    });

    // for (var key of docsStatMap.keys()) {
    //   console.log('key : ', key);
    //   console.log('value : ', docsStatMap.get(key));
    // }

    return docsStatMap;
  }
}

export default ResolveFileMeta;
