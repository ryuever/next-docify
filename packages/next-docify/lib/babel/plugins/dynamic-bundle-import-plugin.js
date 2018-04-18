/**
 * the result chunk name will be `[parentAccessPath]-[accessPath]-[toSlug(filename)]`
 */

const template = require('babel-template');
const syntax = require('babel-plugin-syntax-dynamic-import');
const siteConfig = require('../../site-config');
const { relative, sep, normalize, join } = require('path');
const os = require('os');
const toSlug = require('../../utils/toSlug').default;

const normalizeChunkNameAndSourcePath = source => {
  const { context } = siteConfig.resolveGlobalConfig();
  const relativePath = relative(context, source);

  const parts = relativePath.split(sep);

  const trim = str => str.replace(/^\.*/, '').replace(/\.[^./]*$/, '');

  const chunkName = parts.reduce((concat, cur) => {
    const str = toSlug(trim(cur));
    if (str) return concat ? `${concat}.${str}` : str;
    return concat;
  }, '');

  let nextSource = source;

  if (os.platform() === 'win32') {
    nextSource = source.replace(/\\/g, '\\\\');
  }

  return {
    chunkName,
    source: nextSource,
  };
};

const emulateImportCall = source => {
  const { chunkName, source: nextSource } = normalizeChunkNameAndSourcePath(
    source
  );

  return `
    (
      new (require('next/dynamic').SameLoopPromise)((resolve, reject) => {
        const weakId = require.resolveWeak('${nextSource}')
        try {
          const weakModule = __webpack_require__(weakId)
          return resolve(weakModule)
        } catch (err) {}
        require.ensure([], (require) => {
          try {
            let m = require('${nextSource}')
            m.__webpackChunkName = '${chunkName}'
            resolve(m)
          } catch(error) {
            reject(error)
          }
        }, 'chunk/${chunkName}');
      })
    )
  `;
};

// const emulateImportContextCall = (docPath) => {
//   const { chunkName, source: nextDocPath } = normalizeChunkNameAndSourcePath(docPath);

//   return (`
//     (
//       new (require('next/dynamic').SameLoopPromise)((resolve, reject) => {
//         require.ensure([], (require) => {
//           try {
//             let m = require.context('${nextDocPath}', true, /\\.md$/)
//             m.__webpackChunkName = '${chunkName}'
//             resolve(m)
//           } catch(error) {
//             reject(error)
//           }
//         }, 'chunk/${chunkName}');
//       })
//     )
//   `)
// }

const emulateImportContextCall = docPath => {
  const { chunkName, source: nextDocPath } = normalizeChunkNameAndSourcePath(
    docPath
  );

  return `
    (
      new (require('next/dynamic').SameLoopPromise)((resolve, reject) => {
        try {
          let m = require.context('${nextDocPath}', true, /\\.md$/)
          m.__webpackChunkName = '${chunkName}'
          resolve(m)
        } catch(error) {
          reject(error)
        }
      })
    )
  `;
};
/**
 * check if `requestFile` has specified dataSource, then return including dataSource
 * config or return false
 * @param {string} requestFile
 *
 */
const checkIfHasDataSource = requestFile => {
  const trimExtension = str => str.replace(/\.[^./]*$/, '');
  const siteMap = siteConfig.siteMap;

  const keys = Array.from(siteMap.keys());
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    if (trimExtension(key) === normalize(trimExtension(requestFile))) {
      return siteMap.get(key);
    }
  }

  throw new Error(
    "You should add an site item for module '" +
      requestFile +
      "' in `site.config.js` before " +
      "you could use `import site from 'next-docify/site'` syntax"
  );
};

/**
 *
 * @param {object} config
 */
const buildImportMetaTemplate = config => {
  const { outputPath } = siteConfig.resolveGlobalConfig();
  const { accessPath, docBaseName } = config;
  const metaDataDir = join(outputPath, docBaseName);

  return `
    case '${accessPath}':
      manifest = ${emulateImportCall(join(metaDataDir, 'manifest.js'))}
      postmeta = ${emulateImportCall(join(metaDataDir, 'postmeta.js'))}
      break;
  `;
};

const buildMetaSwitchImport = configs => {
  const cases = configs.map(config => buildImportMetaTemplate(config));

  return `
    switch(accessPath) {
      ${cases.join('\n')}
    }
  `;
};

const buildImportDataSourceTemplate = config => {
  const { outputPath } = siteConfig.resolveGlobalConfig();
  const { docBaseName } = config;
  let manifestPath = join(outputPath, docBaseName, 'manifest.js');
  if (os.platform() === 'win32') {
    manifestPath = manifestPath.replace(/\\/g, '\\\\');
  }
  const manifestData = require(manifestPath);

  let pathToConfigMap = '';

  const applyCaseTemplate = info => {
    const { cwd, permalink, isFile, children } = info;

    if (permalink) {
      pathToConfigMap = `
        '${permalink}': '${config.accessPath}',
        ${pathToConfigMap}
      `;
    }

    let concatChildrenSources = '';

    if (children.length > 0) {
      const childrenSources = children.map(info => applyCaseTemplate(info));
      if (childrenSources.length > 0) {
        concatChildrenSources = childrenSources.join('\n');
      }
    }

    if (!isFile) return concatChildrenSources;

    return `
      case '${permalink}':
        dataSource = ${emulateImportCall(cwd)}
        break;
      ${concatChildrenSources}
    `;
  };

  const sources = manifestData.map(manifest => applyCaseTemplate(manifest));

  const concatSource = sources.reduce((concatenation, cur) => {
    if (cur) return `${concatenation}\n${cur}`;
    return concatenation;
  }, '');

  return {
    caseSources: concatSource,
    pathToConfigMap: pathToConfigMap,
  };
};

const buildDataSourceSwithImport = configs => {
  const cases = configs.map(config => buildImportDataSourceTemplate(config));

  const { pathToConfigMap, caseSources } = cases.reduce((merged, cur) => {
    const { pathToConfigMap: mergedMap, caseSources: mergedSources } = merged;

    const { pathToConfigMap, caseSources } = cur;

    return {
      pathToConfigMap: mergedMap
        ? `${mergedMap}\n${pathToConfigMap}`
        : pathToConfigMap,
      caseSources: mergedSources
        ? `${mergedSources}\n${caseSources}`
        : caseSources,
    };
  }, {});

  return `
    pathMap = {${pathToConfigMap}}
    switch(path) {
      ${caseSources}
    }
  `;
};

/**
 * 'next-docify/site!all?postmeta&manifest' => {
 *    type: 'all',
 *    query: Set(2) {"postmeta", "manifest"}
 * }
 */

const parseImportBody = str => {
  const strWithoutHeading = str.replace(/^next-docify\/site/, '');
  const reg = /([!?][^!?]+)/g;
  let matched = null;
  const patterns = [];

  while ((matched = reg.exec(strWithoutHeading)) !== null) {
    patterns.push(matched[1]);
  }

  const defaultOptions = {
    type: 'default',
    query: new Set(['manifest', 'postmeta', 'dataSource']),
  };

  const options = {};
  patterns.forEach(pattern => {
    if (pattern.startsWith('!')) {
      options.type = pattern.slice(1);
    }

    if (pattern.startsWith('?')) {
      const items = pattern.slice(1);
      const parts = items.split('&');

      parts.forEach(part => {
        if (defaultOptions.query.has(part)) {
          if (!options.query) options.query = new Set();
          options.query.add(part);
        }
      });
    }
  });

  return {
    ...defaultOptions,
    ...options,
  };
};

const buildImport = configs => {
  const source = `
    var MODULENAME = (options) => {
      const dynamic = require('next/dynamic').default
      return new Promise((resolve) => {
        const bundle = dynamic({
          modules: (options) => {
            const { path } = options;
            let manifest;
            let postmeta;
            let dataSource;
            let pathMap;
            ${buildDataSourceSwithImport(configs)}

            const accessPath = pathMap[path];

            ${buildMetaSwitchImport(configs)}
            const components = {
              manifest,
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
  `;

  return template(source);
};

const buildContextImportCases = config => {
  const { docPath } = config;

  return `
    dataSource = ${emulateImportContextCall(docPath)};
  `;
};

const buildContextImport = configs => {
  const cases = configs.map(config => buildContextImportCases(config));

  return `
    ${cases.join('\n')}
  `;
};

const builContextdImportMetaTemplate = config => {
  const { outputPath } = siteConfig.resolveGlobalConfig();
  const { docBaseName, docDirName } = config;
  const metaDataDir = join(outputPath, docBaseName);

  const accessPath = `/${docDirName}/${docBaseName}`;

  return `
    case '${accessPath}':
      manifest = ${emulateImportCall(join(metaDataDir, 'manifest.js'))}
      postmeta = ${emulateImportCall(join(metaDataDir, 'postmeta.js'))}
      break;
  `;
};

const buildContextMetaSwitchImport = configs => {
  const cases = configs.map(config => builContextdImportMetaTemplate(config));

  return `
    switch(accessPath) {
      ${cases.join('\n')}
    }
  `;
};

const buildImportAll = configs => {
  const source = `
    var MODULENAME = (options) => {
      const dynamic = require('next/dynamic').default
      return new Promise((resolve) => {
        const bundle = dynamic({
          modules: (options) => {
            const { path } = options;
            let manifest;
            let postmeta;
            let dataSource;

            ${buildContextImport(configs)}
            const accessPath = path;
            ${buildContextMetaSwitchImport(configs)}

            const components = {
              manifest,
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
  `;

  return template(source);
};

module.exports = ({ types: t }) => ({
  inherits: syntax,
  visitor: {
    ImportDeclaration(path, state) {
      const { node } = path;
      if (!node) return;
      const { value } = node.source;

      if (!value.startsWith('next-docify/site')) return;
      const requestFile = state.file.opts.filename;
      const configs = checkIfHasDataSource(requestFile);
      const name = node.specifiers[0].local.name;

      let ast = null;
      const { type } = parseImportBody(value);

      if (type === 'default') {
        ast = buildImport(configs)({
          MODULENAME: t.identifier(name),
        });
      } else {
        ast = buildImportAll(configs)({
          MODULENAME: t.identifier(name),
        });
      }

      path.replaceWith(ast);
    },
  },
});
