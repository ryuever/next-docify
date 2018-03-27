const webpack = require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { resolve, sep } = require('path');
const glob = require('glob');
const { ANALYZE } = process.env

module.exports = {
  webpack: (config, { dev, isServer }) => {
    const extraAlias = [
      { config: resolve(__dirname, 'config') },
      { components: resolve(__dirname, 'components') },
      { dataSource: resolve(__dirname, 'dataSource') },
      { utils: resolve(__dirname, 'utils') },
      { docs: resolve(__dirname, 'docs') },
      { lib: resolve(__dirname, 'lib') },
    ];

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
      include: resolve(__dirname, 'docs'),
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

    !isServer && (function() {
      const prev = [];

      let plugins = config.plugins.slice(0, -3);

      !isServer && plugins.push(new webpack.optimize.CommonsChunkPlugin({
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
      })),

      !isServer && plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'android-sdk/README',
        filename: 'android-sdk/README.js',
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

          if (RegExp('android-sdk/README.md').test(module.resource)) {
            prev.push('android-sdk/README');
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
      }))

      !isServer && plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'android-sdk/Summary',
        filename: 'android-sdk/Summary.js',
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

          if (RegExp('android-sdk/Summary.md').test(module.resource)) {
            prev.push('android-sdk/Summary');

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
      }))

      !isServer && plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'android-sdk/开发指南/创建项目/Android Studio配置',
        filename: 'android-sdk/开发指南/创建项目/Android Studio配置.js',
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

          if (RegExp('android-sdk/开发指南/创建项目/Android Studio配置.md').test(module.resource)) {
            prev.push('android-sdk/开发指南/创建项目/Android Studio配置');
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
      }))

      !isServer && plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'android-sdk/开发指南/创建项目/Hello PalMap',
        filename: 'android-sdk/开发指南/创建项目/Hello PalMap.js',
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

          if (RegExp('android-sdk/开发指南/创建项目/Hello PalMap.md').test(module.resource)) {
            prev.push('android-sdk/开发指南/创建项目/Hello PalMap');
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
      }))

      !isServer && plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'android-sdk/开发指南/创建项目/开发注意事项',
        filename: 'android-sdk/开发指南/创建项目/开发注意事项.js',
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

          if (RegExp('android-sdk/开发指南/创建项目/开发注意事项.md').test(module.resource)) {
            prev.push('android-sdk/开发指南/创建项目/开发注意事项');
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
      }))

      !isServer && plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'android-sdk/开发指南/创建项目/室内导航',
        filename: 'android-sdk/开发指南/创建项目/室内导航.js',
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

          if (RegExp('android-sdk/开发指南/创建项目/室内导航.md').test(module.resource)) {
            prev.push('android-sdk/开发指南/创建项目/室内导航');
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
      }))

      plugins = plugins.concat(config.plugins.slice(-2));
      config.plugins = plugins;
    })()

    const nextData = [{
      list: extraAlias,
      init: config.resolve || {},
      keyToModify: 'alias',
    }, {
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

    config.entry = () => Promise.resolve(fn.call(null).then((entry) => {
      const nextEntry = {
        ...entry,
      }

      return Promise.resolve(nextEntry);
    }))

    return config;
  },
};
