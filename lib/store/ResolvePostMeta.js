import PostMeta from './PostMeta';
import Resolver from '../markdown-loader/Resolver';
import fs from '../fs';

class ResolvePostMeta {
  static parse(opts) {
    const { cwd } = opts;
    const source = fs.readFileSync(cwd, 'utf8');
    const { meta } = Resolver.parse(source);

    return new PostMeta({
      ...opts,
      headerMeta: meta,
    });
  }
}

export default ResolvePostMeta;
