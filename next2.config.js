module.exports = {
  assetPrefix: process.env.NODE_ENV.startsWith('dev') ? '' : '/out',
  exportPathMap: () => ({
    '/': { page: '/' },
    '/docs': { page: '/docs'},
  })
}
