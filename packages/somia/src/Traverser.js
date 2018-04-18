import objectIncludes from './utils/objectIncludes';

export default class Traverser {
  constructor(opts) {
    this.data = opts.data;
    this.meta = null;
    this.primaryKey = opts.primaryKey || 'id';
    this.containerName = opts.containerName || 'children';
  }

  resolveMeta(records = this.data, parentKey = '') {
    if (!this.meta) this.meta = {};

    records.forEach(data => {
      const key = data[this.primaryKey];
      const children = data[this.containerName];

      const current = (this.meta[key] = {
        parent: [],
      });
      const parent = this.meta[parentKey];

      if (parent) {
        current.parent = [].concat(parent.parent, parentKey);
      }

      if (children && children.length > 0) {
        this.resolveMeta(children, key);
      }
    });

    return this.meta;
  }

  resolveParentKeys(key) {
    if (!this.meta) this.resolveMeta();
    const obj = this.meta[key];
    if (!obj) throw new Error(`Invalid key value : ${key}`);
    return obj.parent;
  }

  // Ancestor
  retrieveUp(key) {
    if (!this.meta) this.resolveMeta();
    const keys = this.meta[key].parent;

    const filterChildren = (data, ids) => {
      let result = [];
      const id = ids.shift();

      if (!data) return [];

      data.forEach(item => {
        const key = item[this.primaryKey];
        if (typeof id === 'undefined') return;
        if (id && key === id) {
          const children = item[this.containerName];
          result[0] = Object.assign({}, item);
          result[0].children = filterChildren(children, ids);
        }
      });

      return result;
    };
    const data = filterChildren(this.data, keys);
    return data[0];
  }

  retrieve(id) {
    if (!this.meta) this.resolveMeta();
    const keys = [].concat(this.meta[id].parent, id);
    const keyLength = keys.length;
    return keys.reduce((next, cur, count) => {
      const len = next.length;
      for (let i = 0; i < len; i++) {
        const item = next[i];
        const key = item[this.primaryKey];

        if (key === cur) {
          if (count === keyLength - 1) {
            return item;
          }

          return item[this.containerName];
        }
      }
    }, this.data);
  }

  query(queries) {
    if (!this.meta) this.resolveMeta();

    const find = data => {
      let ret = [];
      data.forEach(item => {
        const { children } = item;
        if (objectIncludes(item, queries)) {
          ret.push(item);
        } else if (children && children.length > 0) {
          ret = ret.concat(find(children));
        }
      });

      return ret;
    };

    return find(this.data);
  }
}
