const DynamicRuntimePlugin = require('./lib/webpack/plugins/dynamic-runtime-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { resolve } = require('path');
const interpolateCommonsChunks = require('./lib/webpack/utils/interpolateCommonsChunks');
const { ANALYZE } = process.env;

const env = process.env.NODE_ENV;
const isDev = !env || (env && env.startsWith('dev'));

module.exports = {
  webpack: (config, { dev, isServer }) => {
    const extraResolver = [resolve(__dirname, 'lib')];

    const extraPlugins = [
      ANALYZE
        ? new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: isServer ? 8888 : 8889,
            openAnalyzer: true,
          })
        : null,
    ];

    const extraRuls = [
      {
        test: /\.md$/,
        use: {
          loader: 'markdown-loader',
          options: {
            publishPath: isDev ? '' : '/out',
            root: '/docs',
          },
        },
      },
      // {
      //   test: /\.js$/,
      //   enforce: 'pre',
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      // },
    ];

    !isServer && config.plugins.unshift(new DynamicRuntimePlugin());
    !isServer &&
      (config.plugins = interpolateCommonsChunks(config.plugins, { dev }));

    const nextData = [
      {
        list: extraPlugins,
        init: config.plugins,
        method: 'unshift',
      },
      {
        list: extraRuls,
        init: config.module.rules,
      },
      {
        list: extraResolver,
        init: config.resolveLoader.modules,
      },
    ];

    nextData.reduce((_, { list, init, keyToModify, method = 'push' }) => {
      list.reduce((accum, cur) => {
        if (cur) {
          if (Array.isArray(accum)) accum[method](cur);
          else accum[keyToModify] = { ...accum[keyToModify], ...cur };
        }

        return accum;
      }, init);
    }, {});

    const fn = config.entry;

    config.entry = () =>
      new Promise((resolve, reject) => {
        fn.call(null).then(
          entries => {
            resolve(entries);
          },
          () => reject()
        );
      });

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
