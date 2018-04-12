'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _composeResult = require('./composeResult');

var _composeResult2 = _interopRequireDefault(_composeResult);

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

  var assembleFn = funcs.pop();
  return function() {
    for (
      var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2];
    }

    var result = _composeResult2.default
      .apply(undefined, funcs)
      .apply(null, args);
    return assembleFn(result);
  };
};
