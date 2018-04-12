// It basically a copy of redux `compose` function. However, its run order here is left to right.

import reduce from '../utils/reduce';

export default (...funcs) => {
  if (funcs.length === 0) {
    return args => args;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return reduce(funcs, (accum, cur) => (...args) => cur(accum(...args)));
};
