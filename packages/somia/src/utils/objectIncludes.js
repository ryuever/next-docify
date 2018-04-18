export default (target, source) => {
  const keys = Object.keys(source);

  for (let key in source) {
    if (
      source.hasOwnProperty(key) &&
      target.hasOwnProperty(key) &&
      source[key] === target[key]
    ) {
      continue;
    }
    return false;
  }

  return true;
};
