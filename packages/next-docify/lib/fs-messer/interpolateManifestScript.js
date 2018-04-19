const glob = require('glob');
const { join } = require('path');
const fs = require('fs');
const replaceStream = require('replacestream');

module.exports = path => {
  const files = glob.sync('**/*.html', { cwd: path });
  files.forEach(file => {
    const filePath = join(path, file);
    const tempPath = `${filePath}.temp`;
    const linkReg = /(<link.*\/>)(<link[^<]*main\.js[^>]*>)/;
    const scriptReg = /(<script[^<]*main\.js[^>]*(async=[^> ]*)><\/script>)/;
    fs
      .createReadStream(filePath)
      .pipe(
        replaceStream(linkReg, (_, s2, s3) => {
          const manifest = s3.replace('main.js', 'manifest.js');
          const reactDOM = s3.replace('main.js', 'react-dom.production.min.js');
          const manifest2 = s3.replace('main.js', 'manifest2.js');
          return `${manifest}${reactDOM}${s2}${manifest2}${s3}`;
        })
      )
      .pipe(
        replaceStream(scriptReg, (_, s2, s3) => {
          const main = s2.replace(s3, 'defer');
          const reactDOM = main.replace(
            'main.js',
            'react-dom.production.min.js'
          );
          const manifest = main.replace('main.js', 'manifest.js');
          const manifest2 = main.replace('main.js', 'manifest2.js');
          return `${manifest}${reactDOM}${manifest2}${main}`;
        })
      )
      .pipe(fs.createWriteStream(tempPath))
      .on('finish', () => {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
      });
  });
};
