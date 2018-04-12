'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _reduce = require('../utils/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _composeArgn = require('./composeArgn');

var _composeArgn2 = _interopRequireDefault(_composeArgn);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * args[0] will be the return value of last function's executation.
 * args[1] will remain the same and passed the next function's arguments.
 */

exports.default = function() {
  for (
    var _len = arguments.length, funcs = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    funcs[_key] = arguments[_key];
  }

  return _composeArgn2.default.apply(undefined, [1].concat(funcs));
};

// export default (...funcs) => {
// if (funcs.length === 0) {
//   return args => args;
// }

// if (funcs.length === 1) {
//   return funcs[0];
// }

// return reduce(funcs, (accum, cur) => (...args) => cur(accum(...args), ...args.slice(1)));
// };
