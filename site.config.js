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
  customizedSiteConfig = customizedSiteConfig.concat(require(userDefinedSiteConfigPath));
  customizedSiteConfig.origin = 'site.config.js';
} else {
  throw new Error('A `site.config.js` file is required to generate site config info');
}

const preCached = {
  ...defaultConfig,
  ...customizedSiteConfig,
};

const { context, docPath, outputPath } = preCached;

const cached = {
  ...preCached,
  outputPath: resolve(context, outputPath),
  docPath: resolve(context, docPath),
};

export default cached;
