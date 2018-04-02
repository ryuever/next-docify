import glob from 'glob';
import { resolve } from 'path';
import siteConfig from '../siteConfig';
import Output from './Output';
import ResolveCategory from './ResolveCategory';
import ResolvePostMeta from './ResolvePostMeta';
import ResolveStat from './ResolveStat';

const { outputPath } = siteConfig.resolveGlobalConfig();
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

  resolveMetas() {
    const configs = siteConfig.resolveSiteConfig();
    configs.forEach(config => {
      const { docPath, docBaseName } = config;
      this.resolveMeta(docPath, docBaseName);
    })
  }

  resolveMeta(docPath, docBaseName) {
    // first resolve summary file first
    const globOpts = {
      cwd: docPath,
    };

    ResolveCategory.parseSummary(docPath, docBaseName)

    const pattern = '**/*.md';
    const files = this.walk(pattern, globOpts);

    const content = files.reduce((prev, file) => {
      const cwd = resolve(docPath, file);

      const stat = ResolveStat.parse({
        cwd,
        docBaseName,
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

    const refineManifest = ResolveCategory.refineManifestAfterResolvePostMeta(
      docPath, docBaseName, postmeta
    );

    Output.getInstance().outputStats(docBaseName, stats);
    Output.getInstance().outputPostMeta(docBaseName, postmeta);
    Output.getInstance().outputRefineManifest(docBaseName, refineManifest);
  }
}

export default Provider;
