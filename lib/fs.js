import fs from 'fs';
import MemoryFileSystem from 'memory-fs';

let outputFileSystem = null;
let isMemoryFs = false;

if (process.env.NODE_ENV === 'development') {
  outputFileSystem = new MemoryFileSystem();
  isMemoryFs = true;
} else {
  outputFileSystem = fs;
}

export { isMemoryFs };
export default outputFileSystem;
