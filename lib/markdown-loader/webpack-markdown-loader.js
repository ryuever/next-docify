
const ResolvePostMeta = require('./ResolvePostMeta');
const parser = require('./parser');

module.exports = (data) => {
  const { meta, content } = ResolvePostMeta.parse(data);

  const nextContent = parser.render(content);
  return `module.exports = ${JSON.stringify({
    meta: meta,
    content: nextContent,
  })}`
}
