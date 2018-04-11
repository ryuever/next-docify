/**
 * the result chunk name will be `[parentAccessPath]-[accessPath]-[toSlug(filename)]`
 */

const template = require('babel-template');
const syntax = require('babel-plugin-syntax-dynamic-import');
const siteConfig = require('../../siteConfig');
const { relative, sep, normalize } = require('path');
const toSlug = require('../../utils/toSlug').default;
const { context } = siteConfig.resolveGlobalConfig();
const accessPathToDocMapping = siteConfig.resolveAccesPathToDocMapping();

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

const CONTEXT_VARIABLE = 'DC';

const resolveContextDefinition = configs => {
  const variables = [];

  const variableDefinitions = configs.reduce((accum, config, key) => {
    const { docPath, includeSubdirs, filter } = config;
    const relativePath = relative(context, docPath);
    const variable = `${CONTEXT_VARIABLE}${key}`;
    variables.push(variable);
    const cur = `var ${variable} = require.context('../${relativePath}', ${includeSubdirs}, ${filter});`;
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
    const filter = /\/postmeta|manifest\.js$/;
    const variable = `${META_CONTEXT_VARIABLE}${key}`;
    variables.push(variable);
    const cur = `var ${variable} = require.context('../.docify/${docBaseName}', false, ${filter});`;
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
    const nextPath = DOCIFY_CHUNK_PREFIX + '/' + DOCIFY_OUTPUTPATH + '/' + pathToDoc['/' + accessPath];
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
      const path = DOCIFY_OUTPUTPATH + '/' + pathToDoc['/' + accessPath];
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

const buildImport = configs => {
  const source = `
    var MODULENAME = (options) => {
      ${resolveContextDefinition(configs)}
      ${resolveMetaFileImport(configs)}
      const resolveDataSourceModule = ${resolveDataSourceModule};
      const resolveMetaModule = ${resolveMetaModule};
      const shortenPath = ${buildRemoveLeadingSlashBlock};
      const pathToDoc = ${JSON.stringify(accessPathToDocMapping)};
      const { path, accessPath } = options;
      const shortPath = shortenPath(path);
      const shortAccessPath = shortenPath(accessPath);

      return new Promise((resolve, reject) => {
        const jobs = [];

        const resolveDocChunkId = ${buildResolveDocChunkId};
        jobs.push(__webpack_require__.e(resolveDocChunkId(shortPath)));
        const resolveMetaChunkIds = ${buildResolveMetaChunkIds};
        const pendingMetas = resolveMetaChunkIds(shortAccessPath);

        const len = pendingMetas.length;
        for (var i = 0; i < len; i++) {
          jobs.push(__webpack_require__.e(pendingMetas[i].id));
        }

        Promise.all(jobs).then(() => {
          const data = Object.assign(
            {},
            resolveDataSourceModule(shortPath),
            resolveMetaModule(shortAccessPath),
          );
          resolve(data);
        })
      })
    }
  `;

  return template(source);
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

module.exports = ({ types: t }) => ({
  inherits: syntax,
  visitor: {
    ImportDeclaration(path, state) {
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
