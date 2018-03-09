const path = require('path');

module.exports = {
  webpack: (config) => {
    config.module.rules.unshift({
      test: /\.js$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader',
    });

    config.resolve.alias = {
      config: path.resolve(__dirname, 'config'),
    };

    return config;
  },

  exportPathMap: () => ({
    '/': { page: '/' },
  })
};
