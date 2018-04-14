const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { resolve } = require('path');
const DynamicRuntimePlugin = require('./lib/webpack/plugins/dynamic-runtime-plugin');
const NormalizeContextMapKey = require('./lib/webpack/plugins/NormalizeContextMapKey');
const PrependChunkMap = require('./lib/webpack/plugins/PrependChunkMap');
const interpolateCommonsChunks = require('./lib/webpack/utils/interpolateCommonsChunks');

const { ANALYZE, env } = process.env;
const isDev = !env || (env && env.startsWith('dev'));

module.exports = {
  webpack: (config, { dev, isServer }) => {
    const extraResolver = [resolve(__dirname, 'lib')];

    const analyzer = new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerPort: isServer ? 8888 : 8889,
      openAnalyzer: true,
    });
    const extraPlugins = [
      ANALYZE ? analyzer : null,
      new NormalizeContextMapKey(),
      new PrependChunkMap(),
    ];
    if (!isServer) {
      config.plugins.unshift(new DynamicRuntimePlugin());
      config.plugins = interpolateCommonsChunks(config.plugins, { dev });
    }

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
    return config;
  },
};
