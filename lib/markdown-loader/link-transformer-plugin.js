/**
 * image link format : ![alt text](<link> "title")
 * conver `link` starts with `./` with specified static assets serve location.
 * `./a.png` => `/static/docs/a.png`
 */

'use strict'

const linkTransfromerPlugin = function ({
  context,
  root,
  publishPath,
}) {
  return (md) => {
    const origin = md.renderer.rules.image;
    md.renderer.rules.image = (tokens, idx, options, env) => {
      let nextSrc;
      const src = nextSrc = tokens[0].src;

      if (src.startsWith('./') && context) {
        nextSrc = src.replace('.', context);
        nextSrc = nextSrc.replace(process.cwd(), '');
        nextSrc = nextSrc.replace(root, `${publishPath}/static/docs`);
      }

      const nextToken = [{
        ...tokens[0],
        src: nextSrc
      }]

      const ret = origin(nextToken, idx, options, env);

      return ret;
    }
  }
}

export default linkTransfromerPlugin;
