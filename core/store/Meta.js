import resolveId from './utils/resolveId';

class Meta {
  constructor(opts) {
    this._cwd = opts.cwd;
    if (!this._cwd) throw new Error('`cwd` to indicate a path is required');
  }

  set _cwd(value) {
    this.cwd = value;
    this.id = resolveId(value);
    this.filename = value.split('/').pop();
  }

  get _cwd()  {
    return this.cwd;
  }
}

export default Meta;
