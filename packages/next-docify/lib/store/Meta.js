import { sep } from 'path';
import escapeStringRegexp from 'escape-string-regexp';
import toSlug from '../utils/toSlug';
import removeSuffix from '../utils/removeSuffix';

class Meta {
  constructor(opts) {
    this.cwd = opts.cwd;
    this.config = opts.config;
    if (!this._cwd) throw new Error('`cwd` to indicate a path is required');

    this.resolveId();
  }

  set cwd(value) {
    this._cwd = value;
    this.filename = value.split('/').pop();
  }

  get cwd() {
    return this._cwd;
  }

  set config(value) {
    this._config = value;
  }

  get config() {
    return this._config;
  }

  set filename(value) {
    this._filename = value;
  }

  get filename() {
    return this._filename;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  resolveId() {
    const { relativeDocPath } = this.config;

    const reg = RegExp(`.*(?=${escapeStringRegexp(relativeDocPath)})`);
    const relativeFile = this.cwd.replace(reg, '');
    this.id = toSlug(removeSuffix(relativeFile));
  }

  toJson(omitKeys = []) {
    const json = {};
    for (const key in this) {
      if (
        !key.startsWith('_') &&
        this.hasOwnProperty(key) &&
        !omitKeys.includes(key)
      ) {
        json[key] = this[key];
      }
    }

    return json;
  }
}

export default Meta;
