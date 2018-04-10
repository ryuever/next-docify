module.exports = arr => {
  if (!Array.isArray(arr))
    throw new TypeError(
      'Invalid type param applied to function `flatternArray`'
    );

  return arr.reduce((flattened, cur) => {
    if (typeof cur === 'object') {
      return { ...flattened, ...cur };
    }
    return flattened;
  }, {});
};
