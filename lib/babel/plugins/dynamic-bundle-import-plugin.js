/**
 * the result chunk name will be `[parentAccessPath]-[accessPath]-[toSlug(filename)]`
 */

const template = require('babel-template');
const syntax = require('babel-plugin-syntax-dynamic-import');
const siteConfig = require('../../siteConfig');
const { relative, sep, normalize, join } = require('path');
const os = require('os');
const toSlug = require('../../utils/toSlug').default;

const emulateImportCall = (source) => {
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

  if (os.platform === 'win32') {
    nextSource = source.replace(/\\/g, '\\\\');
  }

  return (`
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
  `)
}

const checkIfHasDataSource = (requestFile) => {
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
    'You should add an site item for module \'' +
    requestFile +
    '\' in `site.config.js` before ' +
    'you could use `import site from \'next-docify/site\'` syntax'
  )
}

const buildImportMetaTemplate = (config) => {
  const { outputPath } = siteConfig.resolveGlobalConfig();
  const { accessPath, docBaseName } = config;
  const metaDataDir = join(outputPath, docBaseName);

  return (`
    case '${accessPath}':
      manifest = ${emulateImportCall(join(metaDataDir, 'manifest.js'))}
      postmeta = ${emulateImportCall(join(metaDataDir, 'postmeta.js'))}
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
  let manifestPath = join(outputPath, docBaseName, 'manifest.js');
  if (os.platform === 'win32') {
    manifestPath = manifestPath.replace(/\\/g, '\\\\');
  }
  const manifestData = require(manifestPath);

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

  const sources = manifestData.map((manifest) => applyCaseTemplate(manifest));

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
