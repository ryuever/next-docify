/**
 * args[0] will be the return value of last function's executation.
 * args[1] will remain the same and passed the next function's arguments.
 */

import reduce from './utils/reduce';
import composeArgn from './composeArgn';

export default (...funcs) => composeArgn(1, ...funcs);

// export default (...funcs) => {
// if (funcs.length === 0) {
//   return args => args;
// }

// if (funcs.length === 1) {
//   return funcs[0];
// }

// return reduce(funcs, (accum, cur) => (...args) => cur(accum(...args), ...args.slice(1)));
// };
