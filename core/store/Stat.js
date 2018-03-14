import path from 'path';
import Meta from './Meta';
import toSlug from '../utils/toSlug';

class Stat extends Meta {
  constructor(opts) {
    super({
      cwd: opts.cwd,
    });

    const { file, source, cwd } = opts;
    if (!file) throw new Error('`file` is require');

    this.file = file;
    this.source = source;
    this.cwd = cwd;
    this.slug = '';
    this.parentSlug = '';
    this.id = '';
    this.title = '';
    this.fileName = '';
    this.rootCategory = '';
    this.category = '';
    this.order = null;

    this.initSlugs();
    this.initRootCategory();
    this.initParentSlugWithoutRootCategory();
  }

  static getFileId(fileName) {
    return toSlug(fileName);
  }

  static getFileName(file) {
    return path.parse(file).name;
  }

  static getParts(file) {
    return file.split('/');
  }

  initSlugs() {
    const parts = Stat.getParts(this.file);
    const len = parts.length;
    const fileName = Stat.getFileName(parts[len -1]);

    this.id = this.slug = Stat.getFileId(fileName);
    parts.pop();

    this.parentSlug = parts.reduce((prev, cur) => `${prev}/${toSlug(cur)}`, '');
  }

  initRootCategory() {
    const parts = Stat.getParts(this.file);
    this.rootCategory = parts.shift();
  }

  initParentSlugWithoutRootCategory() {
    // only match startsWith `this.rootCategory` and followd by `/`
    const reg = RegExp(`^/?${this.rootCategory}(?=/)`, 'i');
    this.parentSlugSlim = this.parentSlug.replace(reg, '');
  }

  toJson() {
    const json = {};
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        json[key] = this[key];
      }
    }

    return json;
  }
}

export default Stat;
