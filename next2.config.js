// const config = require('./config').default;

module.exports = {
  assetPrefix: process.env.NODE_ENV.startsWith('dev') ? '' : '/out',
  exportPathMap: () => ({
    '/': { page: '/' },
    '/docs/ios-sdk': { page: '/docs/ios-sdk' },
    '/docs/android-sdk': { page: '/docs/android-sdk' },
  })
}
