const ConcatSource = require('webpack-sources').ConcatSource;
const flattenArray = require('../../utils/flattenArray');
const { DOCIFY_CHUNK_PREFIX } = require('../constants');

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
            this.updateAffectedChunkLocals(affectedChunks, {
              [chunk.name]: chunk.id,
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
                const data2 = flattenArray(docifyChunksMapping.get(key));
                const state2 = `var docifyChunksMapping = ${JSON.stringify(
                  data2
                )}\n`;
                return `${p1}${state1}${state2}`;
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
