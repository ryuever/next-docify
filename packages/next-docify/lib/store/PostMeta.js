import { relative, sep } from 'path';
import Meta from './Meta';
import removeSuffix from './utils/removeSuffix';
import siteConfig from '../siteConfig';
import toSlug from '../utils/toSlug';

class PostMeta extends Meta {
  constructor(opts = {}) {
    super({
      cwd: opts.cwd,
    });

    this.meta = Object.assign({}, opts.meta, {
      title: opts.meta.title || removeSuffix(this.filename),
    });
    this.author = opts.author || '';
    this._createdAt = opts.createdAt || '';
    this._updatedAt = opts.updatedAt || '';
    this.content = opts.content || '';
    this.premalink = this.resolvePermalink(opts.cwd);
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    if (!value) this._createdAt = new Date().toLocaleString();
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(value) {
    if (!value) this._updatedAt = new Date().toLocaleDateString();
  }

  resolvePermalink(cwd) {
    const siteGlobalConfig = siteConfig.resolveGlobalConfig();
    const { context } = siteGlobalConfig;
    const relativePath = relative(context, cwd);
    let permalink = toSlug(relativePath, {
      connector: '/',
      trimLeadingConnector: false,
    });
    return permalink;
    // return permalink.replace(/^([^/])/, '/$1');
  }
}

export default PostMeta;
