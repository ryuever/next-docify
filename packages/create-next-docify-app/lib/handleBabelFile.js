const fs = require('fs-extra');
const { join } = require('path');
const { moveSync, unlinkSync, appendFileSync, readFileSync } = fs;

module.exports = (context, appName) => {
  const appPath = join(context, appName);
  try {
    moveSync(join(appPath, 'babelrc'), join(appPath, '.babelrc'));
  } catch (err) {
    // Append if there's already a `.babelrc` file there
    if (err.code === 'EEXIST') {
      const data = readFileSync(join(appPath, 'babelrc'));
      appendFileSync(join(appPath, '.babelrc'), data);
      unlinkSync(join(appPath, 'babelrc'));
    } else {
      throw err;
    }
  }
};
