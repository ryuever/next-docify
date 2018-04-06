const nextDocifyConfig = require('../next-docify.config');
const compose = require('../utils/compose');

module.exports = (nextConfig) => {
  let docifyWebpackConfig = nextDocifyConfig.webpack;
  const {
    webpack: nextWebpackConfig,
    ...rest
  } = nextConfig;

  if (nextConfig.webpack) {
    docifyWebpackConfig = compose(nextWebpackConfig, docifyWebpackConfig);
  }

  return {
    webpack: docifyWebpackConfig,
    ...rest,
  }
}
