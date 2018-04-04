/**
 * image link format : ![alt text](<link> "title")
 * conver `link` starts with `./` with specified static assets serve location.
 * `./a.png` => `/static/docs/a.png`
 */

'use strict'
const { join, relative } = require('path');

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
        const rootPath = join(process.cwd(), root);
        const relativePath = relative(rootPath, context);
        const targetPath = join(process.cwd(), publishPath, 'static', 'docs', relativePath);
        const targetFilePath = join(targetPath, src);
        nextSrc = targetFilePath.replace(process.cwd(), '');
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

module.exports = linkTransfromerPlugin;
