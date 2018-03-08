module.exports = {
  webpack: (config, { dev, isServer }) => {
    config.module.rules.unshift({
      test: /\.js$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader',
    });

    return config;
  },
};
