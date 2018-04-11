const fs = require('fs');
const withDefaultConfig = require('./withDefaultConfig');
const { join, relative } = require('path');

class ResolveSiteConfig {
  constructor() {
    this._siteConfig = null;
    this._siteGlobalConfig = null;
    this._gatewayRoutes = null;
    this.siteMap = new Map();

    this.checkConfigFileExist();
    this.resolveSiteMap();
    this.resolveGatewayRoutes();
  }

  get filterRoutes() {
    return Array.from(this._gatewayRoutes);
  }

  resolveSiteConfigPath() {
    return join(process.cwd(), 'site.config.js');
  }

  resolveGlobalConfig() {
    if (this._siteGlobalConfig) return this._siteGlobalConfig;
    const { siteGlobalConfig } = withDefaultConfig(
      require(this.resolveSiteConfigPath())
    );
    return (this._siteGlobalConfig = siteGlobalConfig);
  }

  resolveSiteConfig() {
    if (this._siteConfig) return this._siteConfig;
    const { siteConfig } = withDefaultConfig(
      require(this.resolveSiteConfigPath())
    );
    return (this._siteConfig = siteConfig);
  }

  checkConfigFileExist() {
    const path = this.resolveSiteConfigPath();
    if (!fs.existsSync(path)) {
      throw new Error('`site.config.js` is required to manage you site');
    }
  }

  resolveSiteMap() {
    const siteConfig = this.resolveSiteConfig();

    siteConfig.forEach(config => {
      const { component } = config;
      if (this.siteMap.has(component))
        this.siteMap.set(
          component,
          [].concat(this.siteMap.get(component), config)
        );
      else this.siteMap.set(component, [config]);
    });
  }

  resolveGatewayRoutes() {
    if (this._gatewayRoutes) return this._gatewayRoutes;
    this._gatewayRoutes = new Map();

    const siteConfig = this.resolveSiteConfig();
    siteConfig.forEach(({ accessPath, component }) => {
      if (this._gatewayRoutes.has(accessPath)) {
        throw new Error(
          `accessPath ${accessPath} could not be shared by different site`
        );
      }

      const pageRelative = relative('./pages', component);
      this._gatewayRoutes.set(accessPath, `/${pageRelative}`);
    });

    return this._gatewayRoutes;
  }

  resolveAccesPathToDocMapping() {
    const siteConfig = this.resolveSiteConfig();
    return siteConfig.reduce((merged, config) => {
      const { accessPath, docBaseName } = config;
      return {
        ...merged,
        [accessPath]: docBaseName,
      };
    }, {});
  }
}

module.exports = ResolveSiteConfig;
