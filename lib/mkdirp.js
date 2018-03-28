import fs, { isMemoryFs } from './fs';
import nmp from 'mkdirp';

const mkdirp = (path) => {
  if (isMemoryFs) {
    fs.mkdirpSync(path);
  } else {
    nmp(path);
  }
}

export default mkdirp;
