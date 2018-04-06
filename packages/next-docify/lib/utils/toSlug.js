import limax from 'limax';
import { sep } from 'path';

const slug = (str, separator = '-') => {
  const strWithoutSuffix = str => str.replace(/\.[^/]+$/, '');
  const strWithoutPrefix = str => str.replace(/^([^/]*\/)/, '');

  const next = [strWithoutSuffix, strWithoutPrefix].reduce((str, cur) => {
    return cur(str)
  }, str);
  const parts = next.split(sep);

  return parts.reduce((prev, cur) => {
    const options = {};
    if (/[\u4e00-\u9fa5]+/.test(cur)) {
      options.tone = false;
    }
    return prev.concat(limax(cur, options));
  }, []).join(separator);
}

export default slug;
