const chalk = require('chalk');
const { join } = require('path');
const resolveInstallCommand = require('./resolveInstallCommand');

module.exports = opts => {
  const { context, appName, templateName } = opts;
  const appPath = join(context, appName);
  const { cmd } = resolveInstallCommand();

  const buildCommand = (installCommand, execCommand) => {
    switch (execCommand) {
      case 'dev':
        return `${installCommand} dev`;
      case 'build':
      case 'out':
        if (cmd === 'yarn') return `${installCommand} ${execCommand}`;
        return `${installCommand} run ${execCommand}`;
    }
  };

  console.log();
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${buildCommand(cmd, 'dev')}`));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan(`  ${buildCommand(cmd, 'build')}`));
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${buildCommand(cmd, 'out')}`));
  console.log('    Bundles the app into static html files for deployment.');
  console.log();

  switch (templateName) {
    case 'default':
      console.log('Next, suggest you do as follows :');
      console.log();
      console.log(chalk.cyan('  cd'), appPath);
      console.log('    Go to app root path.');
      console.log();
      console.log(`  ${chalk.cyan(`${cmd} dev`)}`);
      console.log('    Starts the development server.');
      console.log();
      console.log(`  ${chalk.cyan(`http://localhost:3000`)}`);
      console.log('    To check homepage');
      console.log();
      console.log(`  ${chalk.cyan(`http://localhost:3000/docs`)}`);
      console.log('    To visit page with rendered markdown data');
      console.log();
      break;

    default:
    // ....
  }
};
