const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: (config) => {
    // config.module.rules.unshift({
    //   test: /\.js$/,
    //   enforce: 'pre',
    //   exclude: /node_modules/,
    //   loader: 'eslint-loader',
    // });

    config.resolve.alias = {
      config: path.resolve(__dirname, 'config'),
      components: path.resolve(__dirname, 'components'),
      dataSource: path.resolve(__dirname, 'dataSource'),
      utils: path.resolve(__dirname, 'utils')
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.RUN_ENV': JSON.stringify(process.env.RUN_ENV)
      }),
    )

    return config;
  },

  // assetPrefix: '/out',
  exportPathMap: () => ({
    '/': { page: '/' },
    '/template': { page: '/template'}
  })
};
