import limax from 'limax';

const slug = str => {
  const strWithoutSuffix = str => str.replace(/\.[^/]+$/, '');
  const strWithoutPrefix = str => str.replace(/^\//, '');

  const next = [strWithoutSuffix, strWithoutPrefix].reduce((str, cur) => {
    return cur(str)
  }, str);
  const parts = next.split('/');

  return parts.reduce((prev, cur) => {
    const options = {};
    if (/[\u4e00-\u9fa5]+/.test(cur)) {
      options.tone = false;
    }
    return prev.concat(limax(cur, options));
  }, []).join('-');
}

export default slug;
