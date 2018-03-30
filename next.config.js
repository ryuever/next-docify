const fs = require('fs-extra');
const { resolve } = require('path');
const docifyConfig = require('./next-docify.config');
const compose = require('./utils/compose');

const userConfigNextFilePath = resolve(process.cwd(), 'next.config.js');

let useDefinedNextConfig = {};
if (fs.pathExistsSync(userConfigNextFilePath)) {
  useDefinedNextConfig = require(userConfigNextFilePath);
}

let webpackConfig = docifyConfig.webpack;
const {
  webpack: useDefinedWebpack,
  ...rest
} = useDefinedNextConfig;

if (useDefinedNextConfig.webpack) {
  webpackConfig = compose(useDefinedWebpack, webpackConfig);
}

module.exports = {
  webpack: webpackConfig,
  ...rest,
  // distDir: './website/.next',
}
