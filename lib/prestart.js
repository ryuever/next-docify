import { resolve, parse } from 'path';
import glob from 'glob';
import nodeFs from 'fs';
import fs, { isMemoryFs } from './fs';
import mkdirp from './mkdirp';
import siteConfig from '../siteConfig';

const { docPath, outputPath, context } = siteConfig;

export function preCacheSourceFiles() {
  if (!isMemoryFs) {
    return
  }

  const files = glob.sync('**/*.md', {
    cwd: docPath,
  });

  files.forEach(file => {
    const dest = resolve(docPath, file);
    const { dir } = parse(dest);
    mkdirp(dir);
    fs.writeFileSync(dest, nodeFs.readFileSync(dest));
  })
}

export function preMakeBuildFolder() {
  const path = resolve(context, outputPath);
  mkdirp(path);
}
