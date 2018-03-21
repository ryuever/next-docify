// import glob from 'glob';

// const result = {
//   '/docs/': 'cwd',
// };

// const nextDocifyEntries = () => {

// }

// pages :  { 'bundles/pages/_document.js': [ './pages/_document.js' ],
//   'bundles/pages/docs.js': [ './pages/docs.js' ],
//   'bundles/pages/index.js': [ './pages/index.js' ],
//   'bundles/pages/_error.js':
//    [ '/Users/ryuyutyo/Documents/git/palmap/next-palmap/node_modules/next/dist/pages/_error.js' ] }

const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { resolve } = require('path');

const { ANALYZE } = process.env
module.exports = {
  webpack: (config) => {
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

    config.resolveLoader.modules = config.resolveLoader.modules.concat([
      resolve(__dirname, 'lib')
    ])

    const extraRuls = [{
      test: /\.md$/,
      include: resolve(__dirname, 'docs'),
      use: {
        loader: 'markdown-loader',
      }
    }]

    extraRuls.reduce((accum, rule) => {
      accum.push(rule)
      return accum;
    }, config.module.rules)

    const extraPlugins = [
      new webpack.DefinePlugin({
        'process.env.RUN_ENV': JSON.stringify(process.env.RUN_ENV)
      }),
      new webpack.NormalModuleReplacementPlugin(/refactor/, (resource) => {
        resource.request = './a.json';
      }),
      // ANALYZE ? new BundleAnalyzerPlugin({
      //   analyzerMode: 'server',
      //   analyzerPort: isServer ? 8888 : 8889,
      //   openAnalyzer: true
      // }) : null
    ];

    extraPlugins.reduce((accum, plugin) => {
      accum.push(plugin);
      return accum;
    }, config.plugins);

    return config;
  },

  // assetPrefix: '/out',
  exportPathMap: () => ({
    '/': { page: '/' },
    '/docs': { page: '/docs' },
  })
};
