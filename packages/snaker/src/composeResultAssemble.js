import composeResult from './composeResult';

export default (...funcs) => {
  const assembleFn = funcs.pop();
  return (...args) => {
    const result = composeResult(...funcs).apply(null, args);
    return assembleFn(result);
  };
};
