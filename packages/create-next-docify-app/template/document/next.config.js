const withNextDocifyConfig = require('next-docify/with-next-docify-config');

module.exports = withNextDocifyConfig({
  exportPathMap: () => ({
    '/': { page: '/' },
    '/docs': { page: '/docs' },
  }),
});
