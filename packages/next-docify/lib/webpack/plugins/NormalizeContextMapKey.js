const RawSource = require('webpack-sources').RawSource;
const { join, relative } = require('path');
const siteConfig = require('../../siteConfig');
const { DOCIFY_CHUNK_PREFIX } = require('../constants');

const globalConfig = siteConfig.resolveGlobalConfig();
const { context: appContext } = globalConfig;

class NormalizeContextMapKeyTemplate {
  apply(moduleTemplate) {
    moduleTemplate.plugin('render', (moduleSourcePostModule, module, chunk) => {
      // Each ContextModule will trigger one time `render`; but if has duplicate context, it will trigger only once.
      // Use `module` in case of `ContextModule` comes from same chunk, then get the `context` param will be a problem.
      if (chunk.name === `${DOCIFY_CHUNK_PREFIX}/context-chunk`) {
        const { context } = module;
        const rawSource = moduleSourcePostModule.source();
        let nextRawSource = rawSource;
        const matched = rawSource.match(/var map = ({[^}]*})/);

        if (matched) {
          const mapValues = JSON.parse(matched[1]);
          const keys = Object.keys(mapValues);

          keys.forEach(key => {
            const path = join(context, key);
            let relativePath = relative(appContext, path);
            relativePath = relativePath.replace(/\.[^.]*$/, '');
            nextRawSource = nextRawSource.replace(key, relativePath);
          });
          return new RawSource(nextRawSource);
        }
      }
      return moduleSourcePostModule;
    });
  }
}

class NormalizeContextMapKey {
  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.moduleTemplate.apply(new NormalizeContextMapKeyTemplate());
    });
  }
}

module.exports = NormalizeContextMapKey;
