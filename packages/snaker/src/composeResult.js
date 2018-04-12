import reduce from '../utils/reduce';

export default (...funcs) => {
  return (...args) => {
    return reduce(
      funcs,
      (accum, func) => {
        accum.push(func.apply(null, args));
        return accum;
      },
      []
    );
  };
};
