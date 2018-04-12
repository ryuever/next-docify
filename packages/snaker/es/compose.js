'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _reduce = require('../utils/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = function() {
  for (
    var _len = arguments.length, funcs = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function(args) {
      return args;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return (0, _reduce2.default)(funcs, function(accum, cur) {
    return function() {
      return cur(accum.apply(undefined, arguments));
    };
  });
}; // It basically a copy of redux `compose` function. However, its run order here is left to right.
