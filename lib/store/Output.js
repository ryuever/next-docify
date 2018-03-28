import rimraf from 'rimraf';
import mkdirp from '../mkdirp';
import fs from '../fs';
import siteConfig from '../../siteConfig';

const { outputPath } = siteConfig;
let singleton = null;

class Output {
  constructor() {
    if (singleton) return singleton;
    this.resetOutputPath();
    this.outputPath = outputPath;
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
    rimraf.sync(outputPath);
    mkdirp(outputPath);
  }

  outputPostMeta(rootDir, content) {
    const destDir = `${outputPath}/${rootDir}`;
    mkdirp(destDir);

    fs.writeFileSync(
      destDir + '/postmeta.js',
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'export default ' +
        Output.formatContentBeforeOutput(content) +
        ';\n'
    );
  }

  // descript file stat
  // toSlug(cwd) as key
  outputStats(rootDir, content) {
    const destDir = `${outputPath}/${rootDir}`;
    mkdirp(destDir);

    fs.writeFileSync(
      destDir + '/stats.js',
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'export default ' +
        Output.formatContentBeforeOutput(content) +
        ';\n'
    );
  }

  // descript category layout
  // should has tree structure
  outputManifest(rootDir, content) {
    const destDir = `${outputPath}/${rootDir}`;
    mkdirp(destDir);

    fs.writeFileSync(
      destDir + 'manifest.js',
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'export default ' +
        Output.formatContentBeforeOutput(content) +
        ';\n'
    );
  }

  outputRefineManifest(rootDir, content) {
    const destDir = `${outputPath}/${rootDir}`;
    mkdirp(destDir);

    fs.writeFileSync(
      destDir + '/refine.js',
      '/**\n' +
        ' * @generated\n' +
        ' */\n' +
        'export default ' +
        Output.formatContentBeforeOutput(content) +
        ';\n'
    );
  }
}

export default Output;
