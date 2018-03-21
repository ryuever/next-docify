const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { resolve } = require('path');

const { ANALYZE } = process.env
module.exports = {
  webpack: (config, { isServer }) => {
    // config.module.rules.unshift({
    //   test: /\.js$/,
    //   enforce: 'pre',
    //   exclude: /node_modules/,
    //   loader: 'eslint-loader',
    // });

    // config.resolve.alias = {
    //   config: path.resolve(__dirname, 'config'),
    //   components: path.resolve(__dirname, 'components'),
    //   dataSource: path.resolve(__dirname, 'dataSource'),
    //   utils: path.resolve(__dirname, 'utils'),
    //   fs: path.resolve(__dirname, 'core', 'fs')
    // };

    const extraResolver = [
      resolve(__dirname, 'lib')
    ];

    const extraRuls = [{
      test: /\.md$/,
      include: resolve(__dirname, 'docs'),
      use: {
        loader: 'markdown-loader',
      }
    }]

    const extraPlugins = [
      new webpack.DefinePlugin({
        'process.env.RUN_ENV': JSON.stringify(process.env.RUN_ENV)
      }),
      new webpack.NormalModuleReplacementPlugin(/refactor/, (resource) => {
        resource.request = './a.json';
      }),
      ANALYZE ? new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: isServer ? 8888 : 8889,
        openAnalyzer: true
      }) : null
    ];

    const nextData = [{
      list: extraPlugins,
      init: config.plugins,
    }, {
      list: extraRuls,
      init: config.module.rules,
    }, {
      list: extraResolver,
      init: config.resolveLoader.modules,
    }];

    nextData.reduce((_, { list, init}) => {
      list.reduce((accum, cur) => {
        if (cur) accum.push(cur);
        return accum;
      }, init)
    }, {})

    return config;
  },

  // assetPrefix: '/out',
  exportPathMap: () => ({
    '/': { page: '/' },
    '/docs': { page: '/docs' },
  })
};
