// fn(['js', 'jsx']) => /\.(?!js$|jsx$)/
// fn(['js', 'jsx']).test('t.js') => false
// fn(['js', 'jsx']).test('t.jsx') => false
// fn(['js', 'jsx']).test('t.jst') => true

export default arr => {
  if (!Array.isArray(arr))
    throw new TypeError(
      `Invalid type of ${typeof arr}, which should be an array`
    );

  const holder = arr.reduce((concatenate, cur) => {
    const next = `${cur}$`;
    if (!concatenate) return next;
    return `${concatenate}|${next}`;
  }, '');
  return RegExp(`\\.(?!${holder})`);
};
