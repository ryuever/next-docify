const Remarkable = require('remarkable');
const hljs = require('highlight.js');
const linkTransformerPlugin = require('./link-transformer-plugin');

const parser = new Remarkable({
  langPrefix: 'hljs css',  // CSS language prefix for fenced blocks
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        console.error(err);
      }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {
      console.error(err)
    }

    return ''; // use external default escaping
  }
});

module.exports = {
  render: (content, ctx) => {
    parser.use(new linkTransformerPlugin({
      context: ctx,
      root: 'docs',
    }))
    return parser.render.call(parser, content)
  }
};
