const spawn = require('cross-spawn');
const { join } = require('path');
const chalk = require('chalk');
const { loading } = require('./utils/spinner');
const resolveInstallCommand = require('./resolveInstallCommand');

module.exports = (context, appName, dependencies, verbose) => {
  return new Promise((resolve, reject) => {
    const { cmd } = resolveInstallCommand();
    let args;
    const appPath = join(context, appName);

    switch (cmd) {
      case 'yarn':
        args = [].concat('add', dependencies, '--cwd', appPath);
        break;
      case 'npm':
      case 'cnpm':
        args = [].concat(
          'install',
          '--save',
          '--save-exact',
          '--loglevel',
          'error'
        );
        verbose && args.push('--verbose');
        [].push.apply(args, dependencies);
        break;
    }

    process.chdir(appPath);

    const len = dependencies.length;
    const packagesLog = dependencies.reduce((joined, cur, key) => {
      let nextCur = chalk.cyan(cur);
      if (key === len - 1) {
        nextCur = `${nextCur}...`;
        if (len > 1) nextCur = `and ${nextCur}`;
      }

      return joined ? `${joined}, ${nextCur}` : nextCur;
    }, '');

    console.log();
    const terminator = loading(`Installing ${packagesLog}`);
    const child = spawn(cmd, args, { stdio: 'ignore' });
    child.on('close', code => {
      terminator();
      if (code !== 0) {
        reject({
          command: `${cmd} ${args.join(' ')}`,
        });
        return;
      }

      resolve();
    });
  });
};
