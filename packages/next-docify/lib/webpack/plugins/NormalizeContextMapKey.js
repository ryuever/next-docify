const { join, relative } = require('path');
const escapeStringRegexp = require('escape-string-regexp');
const RawSource = require('webpack-sources').RawSource;

const siteConfig = require('../../site-config');
const { DOCIFY_CHUNK_PREFIX, META_FILES } = require('../constants');
const toSlug = require('../../utils/toSlug').default;

const globalConfig = siteConfig.resolveGlobalConfig();
const { context: appContext, outputPathShort } = globalConfig;

const isMetaFiles = str =>
  RegExp(
    `${escapeStringRegexp(outputPathShort)}/.*/${META_FILES.join('$|')}$`
  ).test(str);

class NormalizeContextMapKeyTemplate {
  apply(moduleTemplate) {
    moduleTemplate.plugin('render', (moduleSourcePostModule, module, chunk) => {
      // Each ContextModule will trigger one time `render`; but if has duplicate context, it will trigger only once.
      // Use `module` in case of `ContextModule` comes from same chunk, then get the `context` param will be a problem.
      const shouldUpdateMapKey = () => {
        // on dev mode, `context` map will be bundled into `manifest` file.
        if (process.env.NODE_ENV === 'development') {
          if (chunk.name === 'manifest') return true;
        } else if (chunk.name === `${DOCIFY_CHUNK_PREFIX}/context-chunk`) {
          return true;
        }
      };

      if (shouldUpdateMapKey()) {
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
            // const nextValue = isMetaFiles(relativePath) ? relativePath : toSlug(relativePath, {
            //   connector: '/',
            // });
            const nextValue = toSlug(relativePath, {
              connector: '/',
            });
            nextRawSource = nextRawSource.replace(key, nextValue);
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
