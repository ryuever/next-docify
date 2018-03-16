export default str => {
  const parts = str.split('&');
  const options = {};

  parts.forEach(part => {
    const [key, value] = part.split('=');
    options[key] = value;
  })

  return options;
}
