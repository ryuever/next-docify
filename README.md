# next-palmap

The next breaking change of IPalmap platform.

## Todo

- On default, Don't save locale file as `manifest.js`, `postmeta.js` and `stats.js`. It will could multiple file reading and updating. If it is a virtual buffer or virtual memory with path, it will be much better

- try to `import` symlink

- webpack-loader to parse `markdown` file

- rewrite below coding

```js
import manifest from 'next-docify/manifest'
import stats from 'next-docify/stats'
import postmeta from 'next-docify/postmeta'
```

- support `next-docify init`

- support `next-docify export`

- support `next-docify dev`

- support `next-docify build meta`

- support `next-docify build summary`

- support `next-docify clear summary`

- support using file name as `title` if there is no meta config in doc

- import webpack `Tapable` module to control events.

- refactor data structure, use binary tree to store `meta` info instead of hash table.

- emulate `Mongodb` file store system. create a connection between `manifest.js` and `postmeta.js`

```shell
git submodule init && git submodule update
```

## markdown rules


