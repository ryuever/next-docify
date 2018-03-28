import fs from './fs';
import { resolve, sep } from 'path';

const mkdirp = (path) => {
  const parentParts = path.split(sep);
  parentParts.pop();
  parentParts.shift();
  const parentPath = resolve('/', ...parentParts);

  try {
    fs.statSync(parentPath);
    return;
  } catch(err) {
    try {
      fs.mkdirpSync(parentPath)
    } catch(err) {
      mkdirp(parentPath)
    }
  }
}

export default mkdirp;
