import hljs from 'highlight.js';
import Remarkable from 'remarkable';

const md = new Remarkable({
  langPrefix: 'language-',  // CSS language prefix for fenced blocks
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

export default md;
