const fs = require('fs-extra');
const chalk = require('chalk');
const { join, resolve } = require('path');
const { loading } = require('./utils/spinner');
const { existsSync, copySync, readdirSync, statSync } = fs;

const isDir = path => statSync(path).isDirectory();

module.exports = (opts) => {
  const { context, appName } = opts;
  const templateName = opts.templateName || 'default';
  const templateRepoPath = join(resolve(__dirname, '..'), 'template');
  const templatePath = join(templateRepoPath, templateName);
  const targetPath = join(context, appName);

  const spinner = loading('start to copy template');
  if (existsSync(templatePath)) {
    copySync(templatePath, targetPath);

    spinner();

  } else {
    const files = readdirSync(templateRepoPath);
    const templateGallery = files.filter(isDir);

    spinner();

    console.error(`
      Could not locate supplied template: ${chalk.green(templatePath)};
      For recenlty, only has ${JSON.stringify(templateGallery)}
    `)
  }
}
