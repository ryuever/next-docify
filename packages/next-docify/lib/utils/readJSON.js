import fs from '../fs';

export default cwd => {
  let data = fs.readFileSync(cwd, 'utf-8');
  data = data.replace(/^[^{[]*/, '');
  data = data.replace(/[^}\]]*$/, '');

  return JSON.parse(data);
};
