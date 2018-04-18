import { relative, sep } from 'path';
import Meta from './Meta';
import removeSuffix from '../utils/removeSuffix';
import siteConfig from '../siteConfig';
import toSlug from '../utils/toSlug';

const globalConfig = siteConfig.resolveGlobalConfig();

class PostMeta extends Meta {
  constructor(opts = {}) {
    super({
      cwd: opts.cwd,
      config: opts.config,
    });

    this._createdAt = opts.createdAt || '';
    this._updatedAt = opts.updatedAt || '';
    this.premalink = this.resolvePermalink(opts.cwd);

    this.meta = Object.assign(
      {},
      {
        title: removeSuffix(this.filename),
        author: globalConfig.author,
      },
      opts.meta
    );
    this.content = opts.content || '';
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
    const relativePath = `/${relative(context, cwd)}`;
    let permalink = toSlug(relativePath, {
      connector: '/',
      trimLeadingConnector: false,
    });
    return permalink;
  }
}

export default PostMeta;
