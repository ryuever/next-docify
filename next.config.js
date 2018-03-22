const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { resolve } = require('path');

const { ANALYZE } = process.env
module.exports = {
  webpack: (config, { isServer }) => {
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

    const extraRuls = [{
      test: /\.md$/,
      include: resolve(__dirname, 'docs'),
      use: {
        loader: 'markdown-loader',
      }
    }, {
      test: /\.js$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }]

    const extraPlugins = [
      new webpack.DefinePlugin({
        'process.env.RUN_ENV': JSON.stringify(process.env.RUN_ENV)
      }),
      // new webpack.NormalModuleReplacementPlugin(/\.md$/, (context) => {
      //   console.log('context : ', context);
      //   // co.request = './a.json';
      // }),
      ANALYZE ? new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: isServer ? 8888 : 8889,
        openAnalyzer: true
      }) : null,
      // new webpack.ContextReplacementPlugin(/\/docs/, (context) => {
      //   // console.log('context : ', context);
      //   // console.log('context : ', context)
      // }),

      // new webpack.ContextReplacementPlugin(/\/docs/, '../docs', {
      //   "./开发指南/创建地图/显示地图.md": 'xianshi.md',
      // }),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ];

    const nextData = [{
      list: extraAlias,
      init: config.resolve || {},
      keyToModify: 'alias',
    }, {
      list: extraPlugins,
      init: config.plugins,
    }, {
      list: extraRuls,
      init: config.module.rules,
    }, {
      list: extraResolver,
      init: config.resolveLoader.modules,
    }];

    nextData.reduce((_, { list, init, keyToModify}) => {
      list.reduce((accum, cur) => {
        if (cur) {
          if (Array.isArray(accum)) accum.push(cur);
          else accum[keyToModify] = { ...accum[keyToModify], ...cur };
        }

        return accum;
      }, init)
    }, {})

    const fn = config.entry;

    config.entry = () => Promise.resolve(fn.call(null).then((entry) => {
      const nextEntry = {
        // 'kaifa.js': [resolve(__dirname, 'docs', 'Android-SDK', '开发指南', '创建项目', '开发注意事项.md')],
        ...entry,
      }
      return Promise.resolve(nextEntry);
    }))

    return config;
  },

  // assetPrefix: '/out',
  exportPathMap: () => ({
    '/': { page: '/' },
    '/docs': { page: '/docs' },
  })
};
