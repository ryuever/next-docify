const fs = require('fs');
const withDefaultConfig = require('./withDefaultConfig');
const { resolve } = require('path');

class ResolveSiteConfig {
  constructor() {
    this._siteConfig = null;
    this._siteGlobalConfig = null;
    this._gatewayRoutes = new Set();
    this.siteMap = new Map();

    this.checkConfigFileExist();
    this.resolveSiteMap();
    this.resolveGatewayRoutes();
  }

  get filterRoutes() {
    return Array.from(this._gatewayRoutes);
  }

  resolveSiteConfigPath() {
    return resolve(process.cwd(), 'site.config.js');
  }

  resolveGlobalConfig() {
    if (this._siteGlobalConfig) return this._siteGlobalConfig;
    const { siteGlobalConfig } = withDefaultConfig(require(this.resolveSiteConfigPath()));
    return this._siteGlobalConfig = siteGlobalConfig;
  }

  resolveSiteConfig() {
    if (this._siteConfig) return this._siteConfig;
    const { siteConfig } = withDefaultConfig(require(this.resolveSiteConfigPath()));
    return this._siteConfig = siteConfig;
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
        this.siteMap.set(component, [].concat(this.siteMap.get(component), config));
      else this.siteMap.set(component, [config])
    });
  }

  resolveGatewayRoutes() {
    const siteConfig = this.resolveSiteConfig();
    siteConfig.forEach(({ parentAccessPath, accessPath }) => {
      const gateway = parentAccessPath || accessPath;
      this._gatewayRoutes.add(gateway);
    })
  }
}

module.exports = ResolveSiteConfig;
