import limax from 'limax';
import { sep } from 'path';

export default (str, opts = {}) => {
  const {
    seperator = sep,
    trimLeadingConnector = true,
    trimTrailingConnector = true,
    connector = '-',
  } = opts;

  const parts = str.split(seperator);

  const sluggedParts = parts.reduce((accum, cur) => {
    const options = {};
    if (/[\u4e00-\u9fa5]+/.test(cur)) {
      options.tone = false;
    }
    return accum.concat(limax(cur, options));
  }, []);

  let nextStr = sluggedParts.join(connector);

  if (trimLeadingConnector) {
    nextStr = nextStr.replace(RegExp(`^${connector}`), '');
  }

  if (trimTrailingConnector) {
    nextStr = nextStr.replace(RegExp(`${connector}$`), '');
  }

  return nextStr;
};
