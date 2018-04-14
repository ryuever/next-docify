import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import glob from 'glob';
import { join } from 'path';

const files = glob.sync('**/*.js', { cwd: join(process.cwd(), 'src') });

const buildConfig = (filename, sourceDir, destDir, format) => ({
  input: `${sourceDir}/${filename}`,
  output: {
    file: `${destDir}/${filename}`,
    format,
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        [
          'env',
          {
            modules: false,
          },
        ],
      ],
      plugins: ['external-helpers'],
    }),
  ],
});

const configs = files.reduce((accum, file) => {
  accum.push(buildConfig(file, 'src', 'lib', 'cjs'));
  accum.push(buildConfig(file, 'src', 'es', 'es'));
  return accum;
}, []);

export default configs;
