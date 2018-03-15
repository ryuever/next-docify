import PostMeta from './PostMeta';
import fs from 'fs';

class ResolvePostMeta {
  static resolveParts(source) {
    let header = null;
    let content = source;

    if (source.startsWith('---')) {
      const matched = source.match(/^---\n([^]+(?=\n---\n)\n)([^]+)/);

      if (matched) {
        header = matched[1];
        content = matched[2];
      }
    }

    return [header, content];
  }

  static parseHeader(header) {
    if (!header) return {};

    const reg = /\n?([^\n]+)\n/g;

    let match = null;

    const meta = Object.create(null);

    while((match = reg.exec(header)) !== null) {
      const data = match[1];
      const parts = data.split(':');

      const key = parts[0].trim();
      const value = parts[1].trim();

      meta[key] = value;
    }

    return meta;
  }

  static parse(opts) {
    const { cwd } = opts;
    const source = fs.readFileSync(cwd, 'utf8');

    const [header, content] = ResolvePostMeta.resolveParts(source)
    const headerMeta = ResolvePostMeta.parseHeader(header);

    return new PostMeta({
      ...opts,
      ...headerMeta,
      content,
    });
  }
}

export default ResolvePostMeta;
