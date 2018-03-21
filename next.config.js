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
const regeneratorRuntime = require("regenerator-runtime");

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

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.RUN_ENV': JSON.stringify(process.env.RUN_ENV)
      }),
    )

    // config.plugins.push(
    //   new webpack.NormalModuleReplacementPlugin(/refactor/, (resource) => {
    //     console.log('resource : ', resource);
    //     resource.request = './a.json';
    //   })
    // )

    config.plugins.push(
      new webpack.ContextReplacementPlugin(/.*/, (context) => {
        console.log('context : ', context);
        console.log('context dependencies : ', context.dependencies);
      }),
    )

    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: isServer ? 8888 : 8889,
        openAnalyzer: true
      }))
    }

    // config.entry = async () => {
    //   const result = await config.entry;
    //   return {
    //     ...result,
    //     'a': ['./a.json']
    //   }
    // }

    return config;
  },

  // assetPrefix: '/out',
  exportPathMap: () => ({
    '/': { page: '/' },
    '/docs': { page: '/docs' },
  })
};
