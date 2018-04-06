const execa = require('execa');

module.exports = () => {
  try {
    execa.shellSync('yarnpkg --version');
    return true;
  } catch (e) {
    return false;
  }
};
