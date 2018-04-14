import reduce from './utils/reduce';

export default (...funcs) => {
  const count = Number(funcs.shift());

  if (!Number.isInteger(count)) {
    throw new TypeError(
      `Invalid first funcs's type ${typeof count}, which should be Number casting`
    );
  }

  if (funcs.length === 0) {
    return funcs => args;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return reduce(funcs, (accum, cur) => (...args) => {
    if (args.length < count) {
      throw new Error(
        'Maybe you should reconsider the retainning args count,' +
          `on which, args'length ${args.length} should be bigger than ${count}`
      );
    }

    const baseArray = new Array(count);
    const nextArgs = [].concat(accum(...args), baseArray).slice(0, count);
    return cur(...nextArgs, ...args.slice(count));
  });
};
