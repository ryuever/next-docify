export default (str, publishPath = '/', withIndex) => {
  const resolvePath = (str, publishPath) => {
    if (str === '/') return publishPath;
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

  if (str === '#') return str;
  const resolvedPath = resolvePath(str, publishPath);

  if (!withIndex) {
    return resolvedPath;
  } else {
    if (resolvedPath === '/') return '/index.html';
    if (!resolvedPath.endsWith('.html')) return `${resolvedPath}/index.html`;
  }
}
