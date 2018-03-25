const ResolvePostMeta = require('./ResolvePostMeta');
const parser = require('./parser');
// const loaderUtils = require('loader-utils');

module.exports = function(data) {
  // loaderUtils.getOptions(this) || {};
  const ctx = this.context;

  const { meta, content } = ResolvePostMeta.parse(data);
  const nextContent = parser.render(content, ctx);
  return `module.exports = ${JSON.stringify({
    meta: meta,
    content: nextContent,
  })}`
}
