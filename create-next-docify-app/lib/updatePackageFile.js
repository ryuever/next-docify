const { writeFileSync } = require('fs-extra');
const { join } = require('path');
const { EOL } = require('os');

module.exports = (context, appName) => {
  const appPath = join(context, appName);
  const pkg = require(join(appPath, 'package.json'));
  pkg.name = appName;
  writeFileSync(
    join(appPath, 'package.json'),
    JSON.stringify(pkg, null, 2) + EOL
  );
}
