import fs from 'fs';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

let singleton = null;

class Output {
  constructor(opts) {
    if (singleton) return singleton;

    const {
      outputPath,
    } = opts;

    this.outputPath = outputPath || `${process.cwd()}/build`;
    this.resetOutputPath();
    singleton = this;
  }

  static getInstance() {
    if (singleton) return singleton;
  }

  static createSingleton(opts) {
    if (singleton) return singleton;
    return new Output(opts);
  }

  static formatContentBeforeOutput(content) {
    if (typeof content === 'string') return content;
    return JSON.stringify(content, null, 2);
  }

  resetOutputPath() {
    rimraf.sync(this.outputPath);
    mkdirp(this.outputPath);
  }

  outputPostMeta(rootDir, content) {
    const destDir = `${this.outputPath}/${rootDir}`;
    mkdirp.sync(destDir);

    fs.writeFileSync(
      destDir + '/postmeta.js',
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'module.exports = ' +
        Output.formatContentBeforeOutput(content) +
        ';\n'
    );
  }

  // descript file stat
  // toSlug(cwd) as key
  outputStats(rootDir, content) {
    const destDir = `${this.outputPath}/${rootDir}`;
    mkdirp.sync(destDir);

    fs.writeFileSync(
      destDir + '/stats.js',
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'module.exports = ' +
        Output.formatContentBeforeOutput(content) +
        ';\n'
    );
  }

  // descript category layout
  // should has tree structure
  outputManifest(rootDir, content) {
    const destDir = `${this.outputPath}/${rootDir}`;
    mkdirp.sync(destDir);

    fs.writeFileSync(
      destDir + 'manifest.js',
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'module.exports = ' +
        Output.formatContentBeforeOutput(content) +
        ';\n'
    );
  }

  outputRefineManifest(rootDir, content) {
    const destDir = `${this.outputPath}/${rootDir}`;
    mkdirp.sync(destDir);

    fs.writeFileSync(
      destDir + '/refine.js',
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'module.exports = ' +
        Output.formatContentBeforeOutput(content) +
        ';\n'
    );
  }
}

export default Output;
