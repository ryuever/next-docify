const { join, relative } = require('path');

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
  const { docs, ...rest } = siteConfig;
  let nextSiteConfig = docs;
  const merged = {};

  merged.siteConfig = nextSiteConfig.map(config => {
    const preCached = Object.assign({}, defaultConfig, config);
    const { context } = defaultGlobalConfig;
    const { docDirName, docBaseName, component, extension } = preCached;

    const appendSuffixIfNecessary = str =>
      RegExp(`\\.${extension}$`).test(str) ? str : `${str}.js`;

    const docPath = join(context, docDirName, docBaseName);

    return Object.assign({}, preCached, {
      origin: 'site.config.js',
      docPath,
      // has no leading slash
      relativeDocPath: relative(context, docPath),
      fullComponent: appendSuffixIfNecessary(join(context, component)),
      component: join(context, component),
    });
  });

  const { context, outputPath } = defaultGlobalConfig;
  merged.siteGlobalConfig = Object.assign({}, rest, defaultGlobalConfig, {
    outputPath: join(context, outputPath),
    outputPathShort: outputPath,
  });

  return merged;
};
