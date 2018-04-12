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

  return function() {
    for (
      var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2];
    }

    return (0, _reduce2.default)(
      funcs,
      function(accum, func) {
        accum.push(func.apply(null, args));
        return accum;
      },
      []
    );
  };
};
