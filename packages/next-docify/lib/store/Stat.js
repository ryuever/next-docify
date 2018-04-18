import path from 'path';
import Meta from './Meta';
import fs from '../utils/fs';

import toSlug from '../utils/toSlug';

class Stat extends Meta {
  constructor(opts) {
    super({
      cwd: opts.cwd,
      config: opts.config,
    });

    const { rootDir } = opts;

    // Indicating the direct child of `docs` folder it belongs to.
    this.rootDir = rootDir;

    this.slug = '';
    this.parentSlug = '';
    this.category = '';
    this.order = null;

    this.initFileStat();
    // this.initSlugs();
    // this.initParentSlugWithoutRootCategory();
  }

  static getFileId(fileName) {
    return toSlug(fileName);
  }

  static getFileName(file) {
    return path.parse(file).name;
  }

  initSlugs() {
    this.parentSlug = toSlug(this.cwd);
  }

  initParentSlugWithoutRootCategory() {
    // only match startsWith `this.rootDir` and followd by `/`
    const reg = RegExp(`^/?${this.rootDir}(?=/)`, 'i');
    this.parentSlugSlim = this.parentSlug.replace(reg, '');
  }

  initFileStat() {
    const stats = fs.statSync(this.cwd);
    const { birthtime, mtime } = stats;
    this.isDir = stats.isDirectory();
    this.createdAt = new Date(birthtime).toLocaleString();
    this.updatedAt = new Date(mtime).toLocaleString();
  }
}

export default Stat;
