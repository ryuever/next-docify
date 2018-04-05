const fs = require('fs-extra');
const { join } = require('path');
const { moveSync, unlinkSync, appendFileSync, readFileSync } = fs;

module.exports = (context, appName) => {
  const appPath = join(context, appName);
  try {
    moveSync(
      join(appPath, 'gitignore'),
      join(appPath, '.gitignore'),
    );
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = readFileSync(join(appPath, 'gitignore'));
      appendFileSync(join(appPath, '.gitignore'), data);
      unlinkSync(join(appPath, 'gitignore'));
    } else {
      throw err;
    }
  }
}
