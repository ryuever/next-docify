const chalk = require('chalk');
const { join } = require('path');

module.exports = (opts) => {
  const { context, appName, useYarn } = opts;
  const appPath = join(context, appName);
  const cmd = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${cmd} dev`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${cmd} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(
    chalk.cyan(`  ${cmd} ${useYarn ? '' : 'run '}out`)
  );
  console.log('    Bundles the app into static html files for deployment.');
  console.log();

  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), appPath);
  console.log(`  ${chalk.cyan(`${cmd} dev`)}`);
}
