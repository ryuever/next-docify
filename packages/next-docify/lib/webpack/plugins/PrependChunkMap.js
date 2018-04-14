const ConcatSource = require('webpack-sources').ConcatSource;
const flattenArray = require('../../utils/flattenArray');
const { DOCIFY_CHUNK_PREFIX } = require('../constants');
const siteConfig = require('../../siteConfig');
const toSlug = require('../../utils/toSlug').default;

const { outputPathShort } = siteConfig.resolveGlobalConfig();
const docifyChunksMapping = new Map();

class PrependChunkMap {
  getIssuerOnModule(mod) {
    const reasons = mod.reasons;
    let issuers = [];

    if (reasons.length === 0) {
      const rootChunks = mod.mapChunks(chunk => {
        return {
          chunkId: chunk.id,
          chunkName: chunk.name,
        };
      });
      issuers = issuers.concat(rootChunks);
    } else {
      const childrenReasons = reasons.reduce((merged, reason) => {
        const child = this.getIssuerOnModule(reason.module);
        return merged.concat(child);
      }, []);
      issuers = issuers.concat(childrenReasons);
    }

    return issuers;
  }

  getAffectedChunk(chunk) {
    const modules = Array.from(chunk.getModules());
    return modules.reduce((merged, mod) => {
      const issuers = this.getIssuerOnModule(mod);
      return merged.concat(issuers);
    }, []);
  }

  updateAffectedChunkLocals(affectedChunks, keyValue) {
    affectedChunks.forEach(affected => {
      const key = JSON.stringify(affected);
      if (!docifyChunksMapping.has(key)) {
        docifyChunksMapping.set(key, []);
      }
      docifyChunksMapping.get(key).push(keyValue);
    });
  }

  generateChunkMappingKey({ chunkId, chunkName }) {
    return JSON.stringify({ chunkId, chunkName });
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('additional-chunk-assets', chunks => {
        chunks.forEach(chunk => {
          if (RegExp(`${DOCIFY_CHUNK_PREFIX}/`).test(chunk.name)) {
            const affectedChunks = this.getAffectedChunk(chunk);
            const key = toSlug(chunk.name, { connector: '/' });
            this.updateAffectedChunkLocals(affectedChunks, {
              [key]: chunk.id,
            });
          }
        });

        chunks.forEach(chunk => {
          const { id, name } = chunk;
          const key = this.generateChunkMappingKey({
            chunkId: id,
            chunkName: name,
          });

          if (docifyChunksMapping.has(key)) {
            const filename = chunk.files[0];
            let source = compilation.assets[filename].source();

            source = source.replace(
              /(__NEXT_REGISTER_PAGE\('[^']*', function\(\) \{)/,
              (match, p1) => {
                const state1 = `\nvar DOCIFY_CHUNK_PREFIX = '${DOCIFY_CHUNK_PREFIX}';\n`;
                const state2 = `\nvar DOCIFY_OUTPUTPATH = '${outputPathShort}';\n`;
                const data3 = flattenArray(docifyChunksMapping.get(key));
                const state3 = `var docifyChunksMapping = ${JSON.stringify(
                  data3
                )}\n`;
                return `${p1}${state1}${state2}${state3}`;
              }
            );
            compilation.assets[filename] = new ConcatSource(source);
          }
        });
      });
    });
  }
}

module.exports = PrependChunkMap;
