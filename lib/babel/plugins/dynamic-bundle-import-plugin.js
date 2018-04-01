const template = require('babel-template');
const syntax = require('babel-plugin-syntax-dynamic-import');

const emulateImportCall = (source) => {
  return (`
    (
      new (require('next/dynamic').SameLoopPromise)((resolve, reject) => {
        const weakId = require.resolveWeak('${source}')
        try {
          const weakModule = __webpack_require__(weakId)
          return resolve(weakModule)
        } catch (err) {}
        require.ensure([], (require) => {
          try {
            let m = require('${source}')
            m.__webpackChunkName = '${source}'
            resolve(m)
          } catch(error) {
            reject(error)
          }
        }, 'chunks/${source}');
      })
    )
  `)
}

module.exports = ({ types: t }) => ({
  inherits: syntax,
  visitor: {
    ImportDeclaration(path) {
      const buildRequire = template(`
        var site = (values) => {
          const dynamic = require('next/dynamic').default
          return new Promise((resolve) => {
            const bundle = dynamic({
              modules: (values) => {
                const { root, path } = values;
                let refine;
                let postmeta;
                let dataSource;

                switch(root) {
                  case 'android-sdk':
                    refine = ${emulateImportCall('../docify/android-sdk/refine.js')}
                    postmeta = ${emulateImportCall('../docify/android-sdk/postmeta.js')}
                    break;
                  case 'ios-sdk':
                    refine = ${emulateImportCall('../docify/ios-sdk/refine.js')}
                    postmeta = ${emulateImportCall('../docify/ios-sdk/postmeta.js')}
                    break;
                }

                switch(path) {
                  case '/android-sdk/kai-fa-zhi-nan/chuang-jian-xiang-mu/kai-fa-zhu-yi-shi-xiang':
                    dataSource = ${emulateImportCall('../docs/android-sdk/开发指南/创建项目/开发注意事项.md')}
                    break;
                  case '/android-sdk/kai-fa-zhi-nan/dao-hang/shi-xian-shi-nei-dao-hang':
                    dataSource = ${emulateImportCall('../docs/android-sdk/开发指南/导航/实现室内导航.md')}
                    break;
                  case '/ios-sdk/gai-shu/gai-shu':
                    dataSource = ${emulateImportCall('../docs/ios-sdk/概述/概述.md')}
                    break;
                }

                const components = {
                  refine,
                  postmeta,
                  dataSource,
                };
                return components;
              },
              render: (values, components) => {
                resolve(components);
              }
            })
            new bundle(values);
          })
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


