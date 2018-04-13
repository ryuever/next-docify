const glob = require('glob');
const { join } = require('path');
const fs = require('fs');
const replaceStream = require('replacestream');

module.exports = path => {
  const files = glob.sync('**/*.html', { cwd: path });
  files.forEach(file => {
    const filePath = join(path, file);
    const tempPath = `${filePath}.temp`;
    fs
      .createReadStream(filePath)
      .pipe(
        replaceStream(/(<link.*(main.js)[^>]*>)/, function(_, p1) {
          const next = p1.replace('main.js', 'manifest.js');
          return `${next}${p1}`;
        })
      )
      .pipe(
        replaceStream(/(<script[^<]*main\.js[^>]*><\/script>)/, function(
          _,
          p1
        ) {
          const next = p1.replace('main.js', 'manifest.js');
          return `${next}${p1}`;
        })
      )
      .pipe(fs.createWriteStream(tempPath))
      .on('finish', () => {
        console.log('trigger');
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
      });
  });
};
