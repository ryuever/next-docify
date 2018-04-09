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

const resolveNextMainCommonChunk = ({ dev }) =>
  new CommonsChunkPlugin({
    name: `main.js`,
    filename: `main.js`,
    minChunks(module, count) {
      // We need to move react-dom explicitly into common chunks.
      // Otherwise, if some other page or module uses it, it might
      // included in that bundle too.
      const { resource } = module;

      if (resource && count > 0) {
        const reg = RegExp(`${sep}react${sep}|${sep}react-dom${sep}`);

        if (reg.test(resource)) {
          return true;
        }
      }

      if (/\.md$/.test(resource)) {
        return true;
      }

      // if (dev && count > 2) return true;

      if (!module.request && module instanceof contextModule) {
        return true;
      }

      if (dev) {
        return false;
      }

      return count > 2;
    },
  });

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
              if (reg.test(resource)) return false;
            }

            if (resource && /\.md$/.test(resource)) {
              return true;
            }

            if (!module.request && module instanceof contextModule) {
              return true;
            }
            return false;
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

const resolveContextChunk = (path, { dev }) =>
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

const resolveManifestCommonChunk = () =>
  new CommonsChunkPlugin({
    name: 'manifest',
    filename: 'manifest.js',
    minChunks: module => {
      if (!module.request) {
        return false;
      }
      return true;
    },
  });

const interpolateCommonsChunks = (plugins, opts) => {
  const chunkConstraints = resolveChunkConstraints();
  if (chunkConstraints.size === 0) return plugins;

  const { dev } = opts;

  if (dev) {
    const manifestCommonChunkIndex = findCommonChunk(plugins, 'manifest.js');
    const nextManifestCommonChunk = resolveManifestCommonChunk();
    plugins.splice(manifestCommonChunkIndex, 1);
    plugins.splice(manifestCommonChunkIndex, 0, nextManifestCommonChunk);
  }

  const mainCommonChunkIndex = findCommonChunk(plugins, 'main.js');
  if (typeof mainCommonChunkIndex === 'undefined') return;
  const front = plugins.slice(0, mainCommonChunkIndex);
  const end = plugins.slice(mainCommonChunkIndex + 1);
  const mainCommonChunk = resolveNextMainCommonChunk(opts);
  const { prev, merged } = resolveStandaloneMdChunk(chunkConstraints, opts);

  let contextModule;
  if (chunkConstraints.size > 0) {
    contextModule = resolveContextChunk(prev, opts);
  }

  return []
    .concat(front, mainCommonChunk, merged, contextModule, end)
    .filter(val => val);
};

module.exports = interpolateCommonsChunks;
