const { ConcatSource } = require('webpack-sources');

const isDocifyChunk = str => /^next-docify\//.test(str);

class DynamicRuntimeTemplatePlugin {
  apply (chunkTemplate) {
    chunkTemplate.plugin('render', function (modules, chunk) {

      if (!isDocifyChunk(chunk.name)) {
        return modules
      }

      const chunkName = chunk.name;
      const source = new ConcatSource()

      source.add(`
        __NEXT_REGISTER_CHUNK('${chunkName}', function() {
      `)
      source.add(modules)
      source.add(`
        })
      `)

      return source
    })
  }
}

module.exports = class DynamicRuntimePlugin {
  apply (compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.chunkTemplate.apply(new DynamicRuntimeTemplatePlugin())

      compilation.plugin('additional-chunk-assets', (chunks) => {
        chunks = chunks.filter(chunk => {
          if (isDocifyChunk(chunk.name)) {
            // ....
          }
          // isMarkdownChunk.test(chunk.name) && compilation.assets[chunk.name]
        })

        // chunks.forEach((chunk) => {
        //   // This is to support, webpack dynamic import support with HMR
        //   const copyFilename = `chunks/${chunk.name}`
        //   compilation.additionalChunkAssets.push(copyFilename)
        //   compilation.assets[copyFilename] = compilation.assets[chunk.name]
        // })
      })
    })
  }
}
