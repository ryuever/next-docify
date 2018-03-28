export default str => {
  const nextStr = str.replace(/^\?/, '');
  const parts = nextStr.split('&');
  const options = {};

  parts.forEach(part => {
    const [key, value] = part.split('=');
    options[key] = value;
  })

  return options;
}
