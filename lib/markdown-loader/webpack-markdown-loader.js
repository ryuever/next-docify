const ResolvePostMeta = require('./ResolvePostMeta');
const parser = require('./parser');
const loaderUtils = require('loader-utils');

module.exports = function(data) {
  const options = loaderUtils.getOptions(this) || {};
  const { root, publishPath } = options;
  const ctx = this.context;

  const { meta, content } = ResolvePostMeta.parse(data);
  const nextContent = parser.render(content, ctx, {
    publishPath,
    root,
  });
  return `module.exports = ${JSON.stringify({
    meta: meta,
    content: nextContent,
  })}`
}
