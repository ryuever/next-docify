const ResolvePostMeta = require('./ResolvePostMeta');
const parser = require('./parser');
const loaderUtils = require('loader-utils');

export default function(data) {
  const options = loaderUtils.getOptions(this) || {};
  const { root, publishPath } = options;
  const ctx = this.context;

  const { meta, content } = ResolvePostMeta.parse(data);
  const nextContent = parser.render(content, ctx, {
    publishPath,
    root,
  });
  return `export default ${JSON.stringify({
    meta: meta,
    content: nextContent,
  })}`
}
