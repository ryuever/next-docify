const template = require('babel-template');
const syntax = require('babel-plugin-syntax-dynamic-import');

module.exports = ({ types: t }) => ({
  inherits: syntax,
  visitor: {
    ImportDeclaration(path) {
      const buildRequire = template(`
        var site = ({category, path}) => {
          let refine;
          let postmeta;
          let dataSource;

          switch(category) {
            case 'android-sdk':
              refine = require(ANDROIDREFINE)
              postmeta = require(ANDROIDPOSTMETA)
              break;
            case 'ios-sdk':
              refine = require(IOSREFINE)
              postmeta = require(IOSPOSTMETA)
              break;
          }

          switch(path) {
            case '/android-sdk/kai-fa-zhi-nan/chuang-jian-xiang-mu/kai-fa-zhu-yi-shi-xiang':
              dataSource = require(ANDROIDNOTES)
              break;
            case '/android-sdk/kai-fa-zhi-nan/dao-hang/shi-xian-shi-nei-dao-hang':
              dataSource = require(ANDROIDNAVI)
              break;
            case '/ios-sdk/gai-shu/gai-shu':
              dataSource = require(IOSGAISHU)
              break;
          }
          return {
            refine,
            postmeta,
            dataSource,
          }
        }
      `);

      const { node } = path;
      if (!node) return;
      const { value } = node.source;

      if (value !== 'next-docify/site') return;

      const ast = buildRequire({
        REFINE: t.identifier("refine"),
        POSTMETA: t.identifier("postmeta"),
        DATASOURCE: t.identifier('dataSource'),
        ANDROIDREFINE: t.stringLiteral('../docify/android-sdk/refine.js'),
        ANDROIDPOSTMETA: t.stringLiteral('../docify/android-sdk/postmeta.js'),
        ANDROIDNOTES: t.stringLiteral('../docs/android-sdk/开发指南/创建项目/开发注意事项.md'),
        ANDROIDNAVI: t.stringLiteral('../docs/android-sdk/开发指南/导航/实现室内导航.md'),

        IOSREFINE: t.stringLiteral('../docify/ios-sdk/refine.js'),
        IOSPOSTMETA: t.stringLiteral('../docify/ios-sdk/postmeta.js'),
        IOSGAISHU: t.stringLiteral('../docs/ios-sdk/概述/概述.md'),
      });

      path.replaceWith(ast);
    }
  }
})


