const { sep, relative, join } = require('path');
const glob = require('glob');
const siteConfig = require('../../siteConfig');

const { context } = siteConfig.resolveGlobalConfig();

const webpack = require('webpack');
const contextModule = require('webpack/lib/ContextModule');
const { CommonsChunkPlugin } = webpack.optimize;

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
  relativePath = relativePath.replace(/\.[^/]*/, '');
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
  });

  return constraints;
};

const resolveNextMainCommonChunkOnBuild = () =>
  new CommonsChunkPlugin({
    name: 'main.js',
    // to fix 'While running in normal mode it's not allowed to use a non-entry chunk' issue.
    // refer to https://github.com/webpack/webpack/issues/1016
    children: true,
  });

// const resolveNextMainCommonChunk = () =>
//   new CommonsChunkPlugin({
//     name: `main.js`,
//     filename: 'main.js',
//     minChunks(module) {
//       const { request } = module;
//       if (!request && module instanceof contextModule) {
//         return false;
//       }

//       return true;
//     }
//   });

const resolveStandaloneMdChunk = (chunkConstraints, { dev }) => {
  const keys = Array.from(chunkConstraints.keys());

  return keys.reduce(
    (accum, cur) => {
      const { merged } = accum;
      let prev = accum.prev;

      merged.push(
        new CommonsChunkPlugin({
          name: cur,
          filename: cur,
          minChunks: function(module, count) {
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

            if (!module.request && module instanceof contextModule) {
              return true;
            }

            if (dev) return false;

            if (
              resource ===
              '/Users/ryuyutyo/Documents/git/verdaccio/modules/next-docify/node_modules/next/dist/client/next.js'
            )
              return true;

            return count > 2;
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

const resolveContextChunk = path =>
  new CommonsChunkPlugin({
    name: 'context-chunk',
    filename: 'context-chunk',
    minChunks: module => {
      if (path === module.resource) {
        return false;
      }
      return true;
    },
  });

// const resolveManifestCommonChunk = () =>
//   new CommonsChunkPlugin({
//     name: 'manifest',
//     filename: 'manifest.js',
//   });

const resolveManifestCommonChunkOnBuild = () =>
  new CommonsChunkPlugin({
    name: 'manifest',
    filename: 'manifest.js',
    minChunks(module) {
      // To emit context module as a single chunk
      if (!module.request && module instanceof contextModule) {
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

  const mainCommonChunk = resolveNextMainCommonChunkOnBuild();
  const manifestCommonChunk = resolveManifestCommonChunkOnBuild();

  if (opts.dev) {
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

  // Because Next.js will not bundle a `manifest` chunk on build. no need to delete `manifest` chunk
  // manually.
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
};

module.exports = interpolateCommonsChunks;
