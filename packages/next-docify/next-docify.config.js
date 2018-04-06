const webpack = require('webpack');
const path = require('path');
const DynamicRuntimePlugin = require('./lib/webpack/plugins/dynamic-runtime-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { resolve, sep } = require('path');
const glob = require('glob');
const { ANALYZE } = process.env

module.exports = {
  webpack: (config, { dev, isServer }) => {
    const extraResolver = [
      resolve(__dirname, 'lib'),
    ];

    const extraPlugins = [
      ANALYZE ? new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: isServer ? 8888 : 8889,
        openAnalyzer: true
      }) : null,
    ];

    const extraRuls = [{
      test: /\.md$/,
      use: {
        loader: 'markdown-loader',
        options: {
          publishPath: process.env.NODE_ENV.startsWith('dev') ? '' : '/out',
          root: '/docs',
        }
      }
    }, {
      test: /\.js$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }];

    const globOpts = {
      cwd: resolve(__dirname, 'docs'),
    };

    const files = glob.sync('**/*.md', globOpts);
    const entries = {};

    files.forEach(file => {
      const parsed = path.parse(file);
      const { name, dir } = parsed;
      entries[`${dir}/${name}.js`] = [resolve(__dirname, 'docs', file)];
    });

    !isServer && config.plugins.unshift(new DynamicRuntimePlugin());

    false && !isServer && (function() {
      const prev = [];

      let plugins = config.plugins.slice(0, -3);

      plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: `commons`,
        filename: `commons.js`,
        minChunks (module, count) {
          // We need to move react-dom explicitly into common chunks.
          // Otherwise, if some other page or module uses it, it might
          // included in that bundle too.
          if (module.context && module.context.indexOf(`${sep}react${sep}`) >= 0) {
            return true
          }

          if (module.context && module.context.indexOf(`${sep}react-dom${sep}`) >= 0) {
            return true
          }

          if (module.resource && module.resource.endsWith('.md')) {
            return true;
          }

          // In the dev we use on-demand-entries.
          // So, it makes no sense to use commonChunks based on the minChunks count.
          // Instead, we move all the code in node_modules into each of the pages.
          if (dev) {
            return false
          }

          // If there are one or two pages, only move modules to common if they are
          // used in all of the pages. Otherwise, move modules used in at-least
          // 1/2 of the total pages into commons.

          // if (totalPages <= 2) {
          //   return count >= totalPages
          // }
          // return count >= totalPages * 0.5
          return count > 2;
        }
      }));

      const commonsChunkTemplate = key => new webpack.optimize.CommonsChunkPlugin({
        name: `${key}`,
        filename: `${key}.js`,
        minChunks: function(module, count) {
          if (dev) {
            return false
          }

          if (module.resource && module.resource.includes(`${sep}react-dom${sep}`) && count >= 0) {
            return true
          }

          if (module.resource && module.resource.includes(`${sep}react${sep}`) && count >= 0) {
            return true
          }

          if (RegExp(`${key}.md`).test(module.resource)) {
            prev.push(`${key}`);
            return true;
          }

          for(let i = 0; i < prev.length; i++) {
            if (RegExp(`${prev[i]}.md`).test(module.resource)) {
              return false;
            }
          }
          if (module.resource && module.resource.endsWith('.md')) {
            return true;
          }
          return false;
        },
      });

      const keys = Object.keys(entries);

      keys && keys.length > 0 && keys.forEach(key => {
        const keyWithoutExtension = key.replace(/\.[^.]*/, '');
        plugins.push(commonsChunkTemplate(keyWithoutExtension));
      })

      plugins = plugins.concat(config.plugins.slice(-2));
      config.plugins = plugins;
    })()

    const nextData = [{
      list: extraPlugins,
      init: config.plugins,
      method: 'unshift'
    }, {
      list: extraRuls,
      init: config.module.rules,
    }, {
      list: extraResolver,
      init: config.resolveLoader.modules,
    }];

    nextData.reduce((_, { list, init, keyToModify, method = 'push'}) => {
      list.reduce((accum, cur) => {
        if (cur) {
          if (Array.isArray(accum)) accum[method](cur);
          else accum[keyToModify] = { ...accum[keyToModify], ...cur };
        }

        return accum;
      }, init)
    }, {})

    const fn = config.entry;

    config.entry = () => new Promise((resolve, reject) => {
      fn.call(null).then(entries => {
        resolve(entries);
      }, () => reject());
    })

    // config.entry = () => Promise.resolve(fn.call(null).then((entry) => {
    //   // interpolate entry with path relative process.cwd();

    //   const nextEntry = {};

    //   for (let key in entry) {
    //     const items = entry[key];

    //     if (Array.isArray(items)) {
    //       nextEntry[key] = items.map((item) => {
    //         return item.replace(/^.*(?=next-docify\/node_modules)next-docify/, resolve(process.cwd()));
    //       })
    //     } else {
    //       return nextEntry[key] = items.replace(/^(?=next-docify\/node_modules)next-docify/, resolve(process.cwd()));
    //     }
    //   }
    //   return Promise.resolve(nextEntry);
    // }))

    return config;
  },
};
