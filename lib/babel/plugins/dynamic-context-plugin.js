const template = require('babel-template');
const syntax = require('babel-plugin-syntax-dynamic-import');

module.exports = ({ types: t }) => ({
  inherits: syntax,
  visitor: {
    ImportDeclaration(path) {
      const buildRequire = template(`
        var site = ({category, path}) => {
          let refine = null;
          let postmeta = null;

          switch(category) {
            case 'android-sdk':
              REFINE=require(ANDROIDREFINE)
              POSTMETA=require(ANDROIDPOSTMETA)
              break;
            case 'ios-sdk':
              REFINE=require(IOSREFINE)
              POSTMETA=require(IOSPOSTMETA)
              break;
          }
          return {
            REFINE,
            POSTMETA
          }
        }
      `);

      const { node } = path;
      if (!node) return;
      const { value } = node.source;
      if (value !== 'site') return;

      const ast = buildRequire({
        REFINE: t.identifier("refine"),
        POSTMETA: t.identifier("postmeta"),
        ANDROIDREFINE: t.stringLiteral('../docify/android-sdk/refine.js'),
        ANDROIDPOSTMETA: t.stringLiteral('../docify/android-sdk/postmeta.js'),
        IOSREFINE: t.stringLiteral('../docify/ios-sdk/refine.js'),
        IOSPOSTMETA: t.stringLiteral('../docify/ios-sdk/postmeta.js'),
      });

      path.replaceWith(ast);
    }
  }
})


