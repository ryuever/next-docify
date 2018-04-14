import limax from 'limax';
import { sep, parse, join } from 'path';

export default (str, opts = {}) => {
  const {
    seperator = sep,
    trimLeadingConnector = true,
    trimTrailingConnector = true,
    connector = '-',
  } = opts;

  var trimExtension = str => {
    const reg = RegExp(`\\.[^.${sep}]*$`);
    return str.replace(reg, '');
  };

  const assemble = trimExtension(str);
  const parts = assemble.split(seperator);

  const sluggedParts = parts.reduce((accum, cur) => {
    const options = { custom: { '.': '.' } };
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
