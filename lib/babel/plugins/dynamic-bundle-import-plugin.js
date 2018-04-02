/**
 * the result chunk name will be `[parentAccessPath]-[accessPath]-[toSlug(filename)]`
 */

const template = require('babel-template');
const syntax = require('babel-plugin-syntax-dynamic-import');
const siteConfig = require('../../siteConfig');
const { resolve } = require('path');

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

const checkIfHasDataSource = (requestFile) => {
  const trimExtension = str => str.replace(/\.[^./]*$/, '');
  const siteMap = siteConfig.siteMap;

  const keys = Array.from(siteMap.keys());
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    if (trimExtension(key) === trimExtension(requestFile)) {
      return siteMap.get(key);
    }
  }

  throw new Error(
    'You should add an site item for module \'' +
    requestFile +
    '\' in `site.config.js` before ' +
    'you could use `import site from \'next-docify/site\'` syntax'
  )
}

const buildImportMetaTemplate = (config) => {
  const { outputPath } = siteConfig.resolveGlobalConfig();
  const { accessPath, docBaseName } = config;
  const metaDataDir = resolve(outputPath, docBaseName);

  return (`
    case '${accessPath}':
      refine = ${emulateImportCall(resolve(metaDataDir, 'refine.js'))}
      postmeta = ${emulateImportCall(resolve(metaDataDir, 'postmeta.js'))}
      break;
  `)
}

const buildMetaSwitchImport = (configs) => {
  const cases = configs.map(config => buildImportMetaTemplate(config));

  return (`
    switch(accessPath) {
      ${cases.join('\n')}
    }
  `)
}

const buildImportDataSourceTemplate = (config) => {
  const { outputPath } = siteConfig.resolveGlobalConfig();
  const { docBaseName } = config;
  const refinePath = resolve(outputPath, docBaseName, 'refine.js');
  const refineData = require(refinePath);

  let pathToConfigMap = '';

  const applyCaseTemplate = (info) => {
    const { cwd, permalink, isFile, children } = info;

    if (permalink) {
      pathToConfigMap = `
        '${permalink}': '${config.accessPath}',
        ${pathToConfigMap}
      `
    }

    let concatChildrenSources = '';

    if (children.length > 0) {
      const childrenSources = children.map((info) => applyCaseTemplate(info));
      if (childrenSources.length > 0) {
        concatChildrenSources = childrenSources.join('\n');
      }
    }

    if (!isFile) return concatChildrenSources;

    return (`
      case '${permalink}':
        dataSource = ${emulateImportCall(cwd)}
        break;
      ${concatChildrenSources}
    `)
  }

  const sources = refineData.map((refine) => applyCaseTemplate(refine));

  const concatSource = sources.reduce((concatenation, cur) => {
    if (cur) return `${concatenation}\n${cur}`;
    return concatenation;
  }, '')

  return {
    caseSources: concatSource,
    pathToConfigMap: pathToConfigMap,
  }
}

const buildDataSourceSwithImport = (configs) => {
  const cases = configs.map(config => buildImportDataSourceTemplate(config))

  const { pathToConfigMap, caseSources } = cases.reduce((merged, cur) => {
    const {
      pathToConfigMap: mergedMap,
      caseSources: mergedSources,
    } = merged;

    const { pathToConfigMap, caseSources } = cur;

    return {
      pathToConfigMap: mergedMap ? `${mergedMap}\n${pathToConfigMap}` : pathToConfigMap,
      caseSources: mergedSources ? `${mergedSources}\n${caseSources}` : caseSources,
    }
  }, {})

  return (`
    pathMap = {${pathToConfigMap}}
    switch(path) {
      ${caseSources}
    }
  `)
}

const buildImport = (configs) => {
  const source = (`
    var site = (options) => {
      const dynamic = require('next/dynamic').default
      return new Promise((resolve) => {
        const bundle = dynamic({
          modules: (options) => {
            const { path } = options;
            let refine;
            let postmeta;
            let dataSource;
            let pathMap;
            ${buildDataSourceSwithImport(configs)}

            const accessPath = pathMap[path];

            ${buildMetaSwitchImport(configs)}
            const components = {
              refine,
              postmeta,
              dataSource,
            };

            return components;
          },
          render: (options, components) => {
            resolve(components);
          }
        })
        new bundle(options);
      })
    }
  `);

  return template(source)();
}

module.exports = ({ types: t }) => ({
  inherits: syntax,
  visitor: {
    ImportDeclaration(path, state) {
      const { node } = path;
      if (!node) return;
      const { value } = node.source;

      if (value !== 'next-docify/site') return;

      const requestFile = state.file.opts.filename;
      const configs = checkIfHasDataSource(requestFile);
      const ast = buildImport(configs);
      path.replaceWith(ast);
    }
  }
})
