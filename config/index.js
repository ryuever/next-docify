import common from './default';
import prod from './prod';
import dev from './dev';

const env =  process.env.NODE_ENV;

function copy() {
  const args = Array.prototype.slice.call(arguments);

  const ret = {};

  args.forEach((arg) => {
    for (let key in arg) {
      if (arg.hasOwnProperty(key)) {
        ret[key] = arg[key];
      }
    }
  })

  return ret;
}

let config = {};

if (env.indexOf('prod') === 0) {
  config = copy(common, prod);
}

if (env.indexOf('dev') === 0 || !env) {
  config = copy(common, dev);
}

export default config;
