export default arr => {
  if (!Array.isArray(arr))
    throw new TypeError(
      `Invalid type of ${typeof arr}, which should be an array`
    );
  const holder = arr.join('|');
  return RegExp(`\\.${holder}$`);
};
