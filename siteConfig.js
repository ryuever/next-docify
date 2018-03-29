import fs from 'fs';
import { resolve } from 'path';

const defaultConfig = {
  outputPath: '.docify',
  docPath: 'docs',
  origin: 'default',
  context: process.cwd(),
};

let customizedSiteConfig = [];
const userDefinedSiteConfigPath = resolve(process.cwd(), 'site.config.js');
if (fs.existsSync(userDefinedSiteConfigPath)) {
  customizedSiteConfig = customizedSiteConfig.concat(require(userDefinedSiteConfigPath)());
} else {
  throw new Error('A `site.config.js` file is required to generate site config info');
}

const cached = new Map();

customizedSiteConfig.forEach((config) => {
  const preCached = {
    ...defaultConfig,
    ...config,
  };

  const {
    site,
    context,
    docPath,
    outputPath,
  } = preCached;

  const merged = {
    ...preCached,
    origin: 'site.config.js',
    outputPath: resolve(context, outputPath),
    docPath: resolve(context, docPath),
  };

  cached.set(site, merged);
})

export default cached.get("android-sdk");
