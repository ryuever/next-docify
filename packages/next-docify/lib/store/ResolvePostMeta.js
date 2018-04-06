import PostMeta from './PostMeta';
import Resolver from '../markdown-loader/Resolver';
import fs from '../fs';

class ResolvePostMeta {
  static parse(opts) {
    const { cwd } = opts;
    const source = fs.readFileSync(cwd, 'utf8');
    const { meta, content } = Resolver.parse(source);

    return new PostMeta({
      ...opts,
      content: content,
      meta,
    });
  }
}

export default ResolvePostMeta;
