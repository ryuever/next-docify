import PostMeta from './PostMeta';
import Resolver from '../markdown-loader/Resolver';
import fs from '../utils/fs';

class ResolvePostMeta {
  static parse(opts) {
    const { cwd } = opts;
    const source = fs.readFileSync(cwd, 'utf8');
    const { meta, content } = Resolver.parse(source);

    return new PostMeta(
      Object.assign({}, opts, {
        content,
        meta,
      })
    );
  }
}

export default ResolvePostMeta;
