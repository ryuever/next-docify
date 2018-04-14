const withNextDocifyConfig = require('../../with-next-docify-config');

module.exports = withNextDocifyConfig({
  exportPathMap: () => ({
    '/': { page: '/' },
  }),
});
