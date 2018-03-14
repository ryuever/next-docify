import Meta from './Meta';

class PostMeta extends Meta {
  constructor(opts = {}) {
    super({
      cwd: opts.cwd,
    });

    this.title = opts.title || '';
    this.author = opts.author || '';
    this._createdAt = opts.createdAt || '';
    this._updatedAt = opts.updatedAt || '';
    this.content = opts.content || '';
  }

  set _createdAt(value) {
    if (!value) this.createdAt = new Date().toLocaleString();
  }

  set _updatedAt(value) {
    if (!value) this.updatedAt = new Date().toLocaleDateString();
  }
}

export default PostMeta;
