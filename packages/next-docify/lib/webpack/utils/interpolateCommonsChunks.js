const { sep, relative, join } = require('path');
const glob = require('glob');
const webpack = require('webpack');
const contextModule = require('webpack/lib/ContextModule');
const { DOCIFY_CHUNK_PREFIX, META_FILES } = require('../constants');
const siteConfig = require('../../site-config');

const { CommonsChunkPlugin } = webpack.optimize;
const { context, outputPath } = siteConfig.resolveGlobalConfig();

const findCommonChunk = (plugins, filenameTemplate) => {
  const len = plugins.length;
  for (let i = 0; i < len; i++) {
    if (plugins[i] instanceof CommonsChunkPlugin) {
      if (plugins[i].filenameTemplate === filenameTemplate) {
        return i;
      }
    }
  }
};

const resolveCommonsChunkIdent = path => {
  let relativePath = relative(context, path);
  // trim extension;
  relativePath = relativePath.replace(/\.[^/]*$/, '');
  return `${relativePath}`;
};

const resolveChunkConstraints = () => {
  const constraints = new Map();
  const configs = siteConfig.resolveSiteConfig();
  configs.forEach(config => {
    const { docPath } = config;
    const files = glob.sync('**/*.md', { cwd: docPath });
    files.forEach(file => {
      const path = join(docPath, file);
      const key = resolveCommonsChunkIdent(path);

      if (!constraints.has(key)) {
        constraints.set(key, path);
      }
    });

    META_FILES.forEach(meta => {
      const { docBaseName } = config;
      const path = join(outputPath, docBaseName, `${meta}.js`);
      const key = resolveCommonsChunkIdent(path);
      if (!constraints.has(key)) {
        constraints.set(key, path);
      }
    });
  });

  return constraints;
};

const resolveMainCommonChunk = () =>
  new CommonsChunkPlugin({
    name: 'main.js',
    // to fix 'While running in normal mode it's not allowed to use a non-entry chunk' issue.
    // refer to https://github.com/webpack/webpack/issues/1016
    children: true,
  });

const resolveStandaloneMdChunk = (chunkConstraints, { dev }) => {
  const keys = Array.from(chunkConstraints.keys());

  return keys.reduce(
    (accum, cur) => {
      const { merged } = accum;
      let prev = accum.prev;
      const name = `${DOCIFY_CHUNK_PREFIX}/${cur}`;

      merged.push(
        new CommonsChunkPlugin({
          name,
          filename: `${name}-[chunkhash].js`,
          minChunks: function(module, count, order) {
            const { resource } = module;
            if (prev && resource === prev) {
              return false;
            }

            if (resource && count > 0) {
              const reg = RegExp(`${sep}react${sep}|${sep}react-dom${sep}`);
              if (reg.test(resource)) return true;
            }

            if (resource && /\.md$/.test(resource)) {
              return true;
            }

            const metaFileReg = RegExp(
              `\\.docify.*${META_FILES.join('|')}\\.js$`
            );

            if (resource && metaFileReg.test(resource)) {
              return true;
            }

            if (!module.request && module instanceof contextModule) {
              return true;
            }

            if (dev) return false;

            // you should specify the first time check `count`, or it will cause error.
            if (order === 0) {
              return count > 2;
            }
          },
        })
      );

      return { prev: chunkConstraints.get(cur), merged };
    },
    {
      prev: '',
      merged: [],
    }
  );
};

const resolveContextChunk = path => {
  const name = `${DOCIFY_CHUNK_PREFIX}/context-chunk`;
  return new CommonsChunkPlugin({
    name,
    filename: `${name}-[chunkhash].js`,
    minChunks: module => {
      if (path === module.resource) {
        return false;
      }

      return true;
    },
  });
};

const resolveManifestCommonChunk = ({ dev }) =>
  new CommonsChunkPlugin({
    name: 'manifest',
    filename: 'manifest.js',
    minChunks(module) {
      // To emit context module as a single chunk

      if (dev) {
        return true;
      }
      return false;
      // if (!dev && !module.request && module instanceof contextModule) {
      //   return false;
      // }

      // return true;
    },
  });

const resolveManifestCommonChunk2 = ({ dev }) =>
  new CommonsChunkPlugin({
    name: 'manifest2',
    filename: 'manifest2.js',
    minChunks(module) {
      // To emit context module as a single chunk
      if (!dev && !module.request && module instanceof contextModule) {
        return false;
      }

      return true;
    },
  });
const interpolateCommonsChunks = (plugins, opts) => {
  const chunkConstraints = resolveChunkConstraints();
  if (chunkConstraints.size === 0) return plugins;

  const defaultManifestIndex = findCommonChunk(plugins, 'manifest.js');
  let nextPlugins = plugins.slice();

  if (defaultManifestIndex >= 0) {
    nextPlugins.splice(defaultManifestIndex, 1);
  }

  const mainCommonChunkIndex = findCommonChunk(nextPlugins, 'main.js');
  if (typeof mainCommonChunkIndex === 'undefined') return;
  const front = nextPlugins.slice(0, mainCommonChunkIndex - 1);
  const end = nextPlugins.slice(mainCommonChunkIndex + 1);
  const { prev, merged } = resolveStandaloneMdChunk(chunkConstraints, opts);

  let contextModule;
  if (chunkConstraints.size > 0) {
    contextModule = resolveContextChunk(prev, opts);
  }

  const manifestCommonChunk = resolveManifestCommonChunk(opts);
  const mainCommonChunk = resolveMainCommonChunk();
  const manifestCommonChunk2 = resolveManifestCommonChunk2(opts);

  if (process.env.NODE_ENV === 'development') {
    return []
      .concat(
        front,
        merged,
        contextModule,
        manifestCommonChunk,
        mainCommonChunk,
        end
      )
      .filter(val => val);
  }

  return []
    .concat(
      front,
      merged,
      contextModule,
      manifestCommonChunk2,
      manifestCommonChunk,
      mainCommonChunk,
      end
    )
    .filter(val => val);
};

module.exports = interpolateCommonsChunks;
