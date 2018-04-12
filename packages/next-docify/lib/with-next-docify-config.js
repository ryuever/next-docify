const compose = require('snaker/lib/compose');
const composeResultAssemble = require('snaker/lib/composeResultAssemble');
const nextDocifyConfig = require('../next-docify.config');
const siteConfig = require('./siteConfig');
const routeGateWay = siteConfig.resolveGatewayRoutes();

const createGatewayExportMap = () => {
  const routing = {};
  for (var [key, value] of routeGateWay.entries()) {
    routing[key] = { page: value };
  }
  return routing;
};

module.exports = (nextConfig = {}) => {
  let docifyWebpackConfig = nextDocifyConfig.webpack;
  const { webpack: nextWebpackConfig, exportPathMap, ...rest } = nextConfig;

  let nextPathMap = exportPathMap || (() => ({}));
  if (routeGateWay.size > 0) {
    nextPathMap = composeResultAssemble(
      nextPathMap,
      createGatewayExportMap,
      results => Object.assign({}, ...results)
    );
  }

  if (nextConfig.webpack) {
    docifyWebpackConfig = compose(nextWebpackConfig, docifyWebpackConfig);
  }

  return Object.assign(
    {},
    {
      webpack: docifyWebpackConfig,
      exportPathMap: nextPathMap,
    },
    rest
  );
};
