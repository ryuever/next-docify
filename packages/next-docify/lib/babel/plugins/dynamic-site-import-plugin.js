/**
 * the result chunk name will be `[parentAccessPath]-[accessPath]-[toSlug(filename)]`
 */

const template = require('babel-template');
const syntax = require('babel-plugin-syntax-dynamic-import');
const siteConfig = require('../../siteConfig');
const { relative, sep, normalize, parse } = require('path');
const toSlug = require('../../utils/toSlug').default;
const { context, outputPath } = siteConfig.resolveGlobalConfig();
const accessPathToDocMapping = siteConfig.resolveAccesPathToDocMapping();

let filename = '';

const normalizeChunkNameAndSourcePath = source => {
  const relativePath = relative(context, source);

  const parts = relativePath.split(sep);

  const trim = str => str.replace(/^\.*/, '').replace(/\.[^./]*$/, '');

  const chunkName = parts.reduce((concat, cur) => {
    const str = toSlug(trim(cur));
    if (str) return concat ? `${concat}.${str}` : str;
    return concat;
  }, '');

  let nextSource = source;

  if (process.platform === 'win32') {
    nextSource = source.replace(/\\/g, '\\\\');
  }

  return {
    chunkName,
    source: nextSource,
  };
};

/**
 * `accessPath` is used to fetch the its relative `docBaseName`; In `site.config.js`, `accessPath` is the primary key.
 * Each `accessPath` should has a `doc` folder to provide the data source.
 *
 * For my processing, every injected page will has a `pathToDoc` variable to maintain this mapping. `accessPath` as key,
 * In order to matched exactly, `normalizeAccessPath` will ensure your `accessPath` is start with `/`, or cause an error.
 *
 * var pathToDoc = {
 *   "/docs/tutorial": 'tutorial'
 * }
 */
const normalizeAccessPath = accessPath => {
  if (/^\//.test(accessPath)) return accessPath;

  throw new Error(
    '`accessPath` should start with `/`, make sure its value is exactly match in `site.config.js`'
  );
};

const resolveRelativePath = docPath => {
  const dir = parse(filename).dir;
  const relativePath = relative(dir, docPath);
  return relativePath;
};

const CONTEXT_VARIABLE = 'DC';

const resolveContextDefinition = configs => {
  const variables = [];

  const variableDefinitions = configs.reduce((accum, config, key) => {
    const { docPath, includeSubdirs, filter } = config;
    const relativePath = resolveRelativePath(docPath);
    const variable = `${CONTEXT_VARIABLE}${key}`;
    variables.push(variable);
    const cur = `var ${variable} = require.context('${relativePath}', ${includeSubdirs}, ${filter});`;
    return accum ? `${accum}\n${cur}` : cur;
  }, '');

  const vState = `var contextVariables = [${variables.join(', ')}]`;

  const joined = `${variableDefinitions}\n${vState}\n`;
  return joined;
};

const META_CONTEXT_VARIABLE = 'MC';

const resolveMetaFileImport = configs => {
  const variables = [];

  const variableDefinitions = configs.reduce((accum, config, key) => {
    const { docBaseName } = config;
    const relativePath = resolveRelativePath(outputPath);
    const filter = /\/postmeta|manifest\.js$/;
    const variable = `${META_CONTEXT_VARIABLE}${key}`;
    variables.push(variable);
    const cur = `var ${variable} = require.context('${relativePath}/${docBaseName}', false, ${filter});`;
    return accum ? `${accum}\n${cur}` : cur;
  }, '');

  const vState = `var contextMetaVariables = [${variables.join(', ')}]`;

  const joined = `${variableDefinitions}\n${vState}\n`;
  return joined;
};

/**
 * check if `requestFile` has specified dataSource, then return including dataSource
 * config or return false
 * @param {string} requestFile
 *
 */
const getMandatorySiteConfigs = requestFile => {
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

const buildRemoveLeadingSlashBlock = `
  (path) => {
    const removeLeadingSlash = str => str.replace(/^\\//, '');
    return removeLeadingSlash(path);
  }
`;

const buildResolveDocChunkId = `
  (path) => {
    const nextPath = DOCIFY_CHUNK_PREFIX + '/' + path;
    return docifyChunksMapping[nextPath];
  }
`;

const buildResolveMetaChunkIds = `
  (accessPath) => {
    const docBaseName = pathToDoc[normalizeAccessPath(accessPath)];
    const nextPath = DOCIFY_CHUNK_PREFIX + '/' + DOCIFY_OUTPUTPATH + '/' + docBaseName;
    const postmetaKey = nextPath + '/' + 'postmeta';
    const manifestKey = nextPath + '/' + 'manifest';
    const keys = [{
      chunk: 'postmeta',
      key: postmetaKey,
    }, {
      chunk: 'manifest',
      key: manifestKey,
    }];

    return keys.reduce((merged, item) => {
      const { chunk, key } = item;
      merged.push({
        chunk,
        id: docifyChunksMapping[key],
      })
      return merged;
    }, []);
  }
`;

const resolveDataSourceModule = `
  (path) => {
    var len = contextVariables.length;
    for (var i = 0; i < len; i++) {
      const mod = contextVariables[i](path);

      if (mod) {
        return { dataSource: mod };
      }
    }
  }
`;

const resolveMetaModule = `
  (accessPath) => {
    var len = contextMetaVariables.length;
    for (var i = 0; i < len; i++) {
      const docBaseName = pathToDoc[normalizeAccessPath(accessPath)];
      const path = DOCIFY_OUTPUTPATH + '/' + docBaseName;
      const postmetaPath = path + '/' + 'postmeta';
      const manifestPath = path + '/' + 'manifest';

      const modMap = contextMetaVariables[i];
      const postmeta = modMap(postmetaPath);
      const manifest = modMap(manifestPath);

      if (postmeta && manifest) {
        return { postmeta, manifest };
      }
    }
  }
`;

const buildImportBody = configs => `
  const pathToDoc = ${JSON.stringify(accessPathToDocMapping)};
  const normalizeAccessPath = ${normalizeAccessPath};
  ${resolveContextDefinition(configs)}
  ${resolveMetaFileImport(configs)}
  const resolveDataSourceModule = ${resolveDataSourceModule};
  const resolveMetaModule = ${resolveMetaModule};
  const shortenPath = ${buildRemoveLeadingSlashBlock};
  const { path, accessPath } = options;
  const shortPath = path ? shortenPath(path) : '';

  const jobs = [];

  if (path) {
    const resolveDocChunkId = ${buildResolveDocChunkId};
    jobs.push(__webpack_require__.e(resolveDocChunkId(shortPath)));
  }

  if (accessPath) {
    const resolveMetaChunkIds = ${buildResolveMetaChunkIds};
    const pendingMetas = resolveMetaChunkIds(accessPath);
    const len = pendingMetas.length;
    for (var i = 0; i < len; i++) {
      jobs.push(__webpack_require__.e(pendingMetas[i].id));
    }
  }

  Promise.all(jobs).then(() => {
    let postmeta = [];
    let manifest = [];
    const data = {};

    if (path) data.dataSource = resolveDataSourceModule(shortPath);
    if (accessPath) {
      const result = resolveMetaModule(accessPath);
      data.postmeta = result.postmeta;
      data.manifest = result.manifest;
    }

    resolve(data);
  })
`;

let buildImport = configs => {
  const source = `
    var MODULENAME = (options) => {
      return new Promise((resolve, reject) => {
        ${buildImportBody(configs)}
      })
    }
  `;

  return template(source);
};

/**
 * On production, the `context` map has been extract to a standalone file.
 * So the dependency file should be fetch first through Jsonp.
 */
if (process.env.NODE_ENV !== 'development') {
  buildImport = configs => {
    const source = `
      var MODULENAME = (options) => {
        const chunkId = docifyChunksMapping[DOCIFY_CHUNK_PREFIX + '/context-chunk'];

        return new Promise((resolve, reject) => {
          __webpack_require__.e(chunkId).then(() => {
            ${buildImportBody(configs)}
          })
        })
      }
    `;

    return template(source);
  };
}

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

module.exports = ({ types: t }) => ({
  inherits: syntax,
  visitor: {
    ImportDeclaration(path, state) {
      filename = state.file.opts.filename;
      const { node } = path;
      if (!node) return;
      const { value } = node.source;

      if (!value.startsWith('next-docify/site')) return;
      const requestFile = state.file.opts.filename;
      const configs = getMandatorySiteConfigs(requestFile);
      const name = node.specifiers[0].local.name;

      let ast = null;
      const { type } = parseImportBody(value);

      if (type === 'default') {
        ast = buildImport(configs)({
          MODULENAME: t.identifier(name),
        });
      } else {
        // do something else
      }

      path.replaceWith(ast);
    },
  },
});
