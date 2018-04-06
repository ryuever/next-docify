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

    this.meta = {
      ...opts.meta,
      title: opts.meta.title || removeSuffix(this.filename),
    };
    this.author = opts.author || '';
    this._createdAt = opts.createdAt || '';
    this._updatedAt = opts.updatedAt || '';
    this.content = opts.content || '';
    this.premalink = this.resolvePermalink(opts.cwd);
  }

  set _createdAt(value) {
    if (!value) this.createdAt = new Date().toLocaleString();
  }

  set _updatedAt(value) {
    if (!value) this.updatedAt = new Date().toLocaleDateString();
  }

  resolvePermalink(cwd) {
    const siteGlobalConfig = siteConfig.resolveGlobalConfig();
    const { context } = siteGlobalConfig;
    const relativePath = relative(context, cwd);
    const parts = relativePath.split(sep);
    let permalink = parts.map(part => (part ? toSlug(part) : '')).join('/');
    return permalink.replace(/^([^/])/, '/$1');
  }
}

export default PostMeta;
