import Tokenizer from './Tokenizer';

export default class Parser {
  constructor(opts) {
    const { rawData } = opts;
    this.rawData = rawData;
    this.tokenizer = new Tokenizer({ rawData });
  }

  traverseUpAccumulated(accumulatedItems, token) {
    // find the first one depths less than cur;
    const { depth } = token;
    const len = accumulatedItems.length;
    let order = 0;
    let i = len - 1;

    if (accumulatedItems[i] && accumulatedItems[i].depth <= depth) {
      return [].concat(accumulatedItems, token);
    }

    for (; i >= 0; i--, order++) {
      const { depth: depthOnTesting } = accumulatedItems[i];

      if (depthOnTesting > depth) {
        accumulatedItems[i].order = order;
        token.children = token.children.concat(accumulatedItems[i]);
      } else {
        break;
      }
    }

    if (i === -1) return [token];

    const nextAccumulate = accumulatedItems.slice(0, i + 1);
    return [].concat(nextAccumulate, token);
  }

  parse() {
    const tokens = this.tokenizer.tokenize();
    tokens.reverse();

    const result = tokens.reduce((accumulated, token) => {
      const { value, depth } = token;
      const nextToken = {
        value,
        depth,
        order: 0,
        children: [],
      };
      return this.traverseUpAccumulated(accumulated, nextToken);
    }, []);
    result.reverse();

    return result.map((item, order) => {
      item.order = order;
      return item;
    });
  }
}
