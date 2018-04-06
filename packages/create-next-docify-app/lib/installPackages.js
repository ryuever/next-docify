const spawn = require('cross-spawn');
const { join } = require('path');
const { loading } = require('./utils/spinner');

module.exports = (context, appName, useYarn, dependencies, verbose) => {
  return new Promise((resolve, reject) => {
    let cmd;
    let args;
    const appPath = join(context, appName);

    if (useYarn) {
      cmd = 'yarn';
      args = [].concat(
        'add',
        '--exact',
        '--exact',
        dependencies,
        '--cwd',
        appPath
      );
    } else {
      cmd = 'npm';
      args = [].concat('install', '--save', '--save-exact');
      verbose && args.push('--verbose');
      [].push.apply(args, dependencies);
    }

    process.chdir(appPath);

    const terminator = loading('Installing dependency packages');
    const child = spawn(cmd, args, { studio: 'inherit' });
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
