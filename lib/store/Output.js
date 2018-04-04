import mkdirp from 'mkdirp';
import fs from '../fs';
import { join } from 'path';

let singleton = null;

class Output {
  constructor(opts) {
    if (singleton) return singleton;
    this.outputPath = opts.outputPath;
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

  outputPostMeta(docBaseName, content) {
    const destDir = join(this.outputPath, docBaseName);
    mkdirp.sync(destDir)
    fs.writeFileSync(
      join(destDir, 'postmeta.js'),
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
  outputStats(docBaseName, content) {
    const destDir = join(this.outputPath, docBaseName);
    mkdirp.sync(destDir)

    fs.writeFileSync(
      join(destDir, 'stats.js'),
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
  outputManifest(docBaseName, content) {
    const destDir = join(this.outputPath, docBaseName);
    mkdirp.sync(destDir);
    fs.writeFileSync(
      join(destDir, 'manifest.js'),
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
