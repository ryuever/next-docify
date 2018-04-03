// const buildRequire = template(`
//   var site = (values) => {
//     const dynamic = require('next/dynamic').default
//     return new Promise((resolve) => {
//       const bundle = dynamic({
//         modules: (values) => {
//           const { root, path } = values;
//           let refine;
//           let postmeta;
//           let dataSource;

//           switch(root) {
//             case 'android-sdk':
//               refine = ${emulateImportCall('../docify/android-sdk/refine.js')}
//               postmeta = ${emulateImportCall('../docify/android-sdk/postmeta.js')}
//               break;
//             case 'ios-sdk':
//               refine = ${emulateImportCall('../docify/ios-sdk/refine.js')}
//               postmeta = ${emulateImportCall('../docify/ios-sdk/postmeta.js')}
//               break;
//           }

//           switch(path) {
//             case '/android-sdk/kai-fa-zhi-nan/chuang-jian-xiang-mu/kai-fa-zhu-yi-shi-xiang':
//               dataSource = ${emulateImportCall('../docs/android-sdk/开发指南/创建项目/开发注意事项.md')}
//               break;
//             case '/android-sdk/kai-fa-zhi-nan/dao-hang/shi-xian-shi-nei-dao-hang':
//               dataSource = ${emulateImportCall('../docs/android-sdk/开发指南/导航/实现室内导航.md')}
//               break;
//             case '/ios-sdk/gai-shu/gai-shu':
//               dataSource = ${emulateImportCall('../docs/ios-sdk/概述/概述.md')}
//               break;
//           }

//           const components = {
//             refine,
//             postmeta,
//             dataSource,
//           };
//           return components;
//         },
//         render: (values, components) => {
//           resolve(components);
//         }
//       })
//       new bundle(values);
//     })
//   }
// `);
