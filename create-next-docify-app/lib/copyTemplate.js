const fs = require('fs-extra');
const chalk = require('chalk');
const { join, resolve } = require('path');
const { existsSync, copySync, readdirSync, statSync } = fs;

const isDir = path => statSync(path).isDirectory();

module.exports = (opts) => {
  const { context, appName } = opts;
  const templateName = opts.templateName || 'default';
  const templateRepoPath = join(resolve(__dirname, '..'), 'template');
  const templatePath = join(templateRepoPath, templateName);
  const targetPath = join(context, appName);

  if (existsSync(templatePath)) {
    copySync(templatePath, targetPath);
    console.log();
    console.log(`${chalk.green('> Success!')} Created files for "${appName}" next-docify app`)

  } else {
    const files = readdirSync(templateRepoPath);
    const templateGallery = files.filter(isDir);

    console.error(`
      Could not locate supplied template: ${chalk.green(templatePath)};
      For recenlty, only has ${JSON.stringify(templateGallery)}
    `)
  }
}
