const { resolve } = require('path');

const defaultGlobalConfig = {
  outputPath: '.docify',
  context: process.cwd(),
};

const defaultConfig = {
  origin: 'default',
};

module.exports = (siteConfig) => {
  let nextSiteConfig = [].concat(siteConfig);
  const merged = {};

  merged.siteConfig = nextSiteConfig.map((config) => {
    const preCached = {
      ...defaultConfig,
      ...config,
    };
    const { context } = defaultGlobalConfig;
    const { docDirName, docBaseName } = preCached;

    return {
      ...preCached,
      origin: 'site.config.js',
      docPath: resolve(context, docDirName, docBaseName),
    }
  })

  const { context, outputPath } = defaultGlobalConfig;
  merged.siteGlobalConfig = {
    ...defaultGlobalConfig,
    outputPath: resolve(context, outputPath),
  };

  return merged;
}
