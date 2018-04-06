const ora = require('ora');
const chalk = require('chalk');

exports.loading = message => {
  const spinner = ora(chalk.green(message));
  spinner.color = 'gray';
  spinner.start();
  return () => {
    spinner.stop();
  };
};
