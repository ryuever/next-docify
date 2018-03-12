export default (str, publishPath = '/', withIndex) => {

  if (!withIndex) {
    if (!str) return publishPath;
  } else {
    if (!str) str = 'index.html';
    if (!str.endsWith('.html')) str=`${str}/index.html`;
  }

  if (str.startsWith('/')) return str;
  if (str.startsWith('http')) return str;
  if (str.startsWith('.')) {
    const startWithSlash = str.match(/\/(.*)/);

    if (!startWithSlash) {
      return publishPath;
    }

    if (!publishPath.startsWith('/')) {
      return `/${startWithSlash[1]}`;
    }

    if (publishPath.endsWith('/')) {
      return `${publishPath}${startWithSlash[1]}`;
    } else {
      return `${publishPath}/${startWithSlash[1]}`;
    }
  }

  return '/';
}
