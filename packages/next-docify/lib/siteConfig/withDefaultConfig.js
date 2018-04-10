const { join } = require('path');

const defaultGlobalConfig = {
  outputPath: '.docify',
  context: process.cwd(),
};

const defaultConfig = {
  origin: 'default',
  extension: 'js',
  includeSubdirs: true,
  filter: /\.md$/,
};

module.exports = siteConfig => {
  let nextSiteConfig = [].concat(siteConfig);
  const merged = {};

  merged.siteConfig = nextSiteConfig.map(config => {
    const preCached = {
      ...defaultConfig,
      ...config,
    };
    const { context } = defaultGlobalConfig;
    const { docDirName, docBaseName, component, extension } = preCached;

    const appendSuffixIfNecessary = str =>
      RegExp(`\\.${extension}$`).test(str) ? str : `${str}.js`;
    return {
      ...preCached,
      origin: 'site.config.js',
      docPath: join(context, docDirName, docBaseName),
      fullComponent: appendSuffixIfNecessary(join(context, component)),
      component: join(context, component),
    };
  });

  const { context, outputPath } = defaultGlobalConfig;
  merged.siteGlobalConfig = {
    ...defaultGlobalConfig,
    outputPath: join(context, outputPath),
  };

  return merged;
};
