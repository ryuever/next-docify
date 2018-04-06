/**
 * function to modify the first arguments and pass to the next(the left value will passed to right as its first arguments)
 */

function compose(...funcs) {
  if (funcs.length === 0) {
    return args => args;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((accum, cur) => (...args) =>
    cur(accum(...args), ...args.slice(1))
  );
}

module.exports = compose;
