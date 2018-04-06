const { parse, resolve } = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const shouldUseYarn = require('./shouldUseYarn');
const installPackages = require('./installPackages');
const validateAppName = require('./validateAppName');
const copyTemplate = require('./copyTemplate');
const updatePackageFile = require('./updatePackageFile');
const handleGitignore = require('./handleGitignore');
const handleBabelFile = require('./handleBabelFile');
const finishInitializeApp = require('./finishInitializeApp');

let useYarn = shouldUseYarn();
let context;

function createApp({ name, verbose, templateName }) {
  const resolvedPath = resolve(name);
  const parsed = parse(resolvedPath);
  const { dir, base } = parsed;
  context = dir;
  const appName = base;

  const dependencies = ['react', 'react-dom', 'next', 'next-docify'];

  validateAppName(appName, dependencies);
  fs.ensureDirSync(resolvedPath);

  copyTemplate({
    context,
    templateName,
    appName,
  });

  updatePackageFile(context, appName);
  handleGitignore(context, appName);
  handleBabelFile(context, appName);

  installPackages(context, appName, useYarn, dependencies, verbose)
    .then(() => {
      finishInitializeApp({
        context,
        appName,
        useYarn,
      });
    })
    .catch(reason => {
      console.log();
      console.log('Aborting installation.');
      if (reason.command) {
        console.log(`  ${chalk.cyan(reason.command)} has failed.`);
      } else {
        console.log(chalk.red('Unexpected error. Please report it as a bug:'));
        console.log(reason);
      }
      console.log();
    });
}

module.exports = createApp;
