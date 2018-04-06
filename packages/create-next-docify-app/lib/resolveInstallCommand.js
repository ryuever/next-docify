const execa = require('execa');

module.exports = () => {
  const info = {
    cmd: '',
    useYarn: false,
  };

  try {
    execa.shellSync('yarnpkg --version');
    info.cmd = 'yarn';
    info.useYarn = true;
  } catch (e) {
    try {
      execa.shellSync('cnpm --version');
      info.cmd = 'cnpm';
    } catch (err) {
      info.cmd = 'npm';
    }
  }

  return info;
};
