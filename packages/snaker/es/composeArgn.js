'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };

var _reduce = require('../utils/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

exports.default = function() {
  for (
    var _len = arguments.length, funcs = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    funcs[_key] = arguments[_key];
  }

  var count = Number(funcs.shift());

  if (!Number.isInteger(count)) {
    throw new TypeError(
      "Invalid first funcs's type " +
        (typeof count === 'undefined' ? 'undefined' : _typeof(count)) +
        ', which should be Number casting'
    );
  }

  if (funcs.length === 0) {
    return function(funcs) {
      return args;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return (0, _reduce2.default)(funcs, function(accum, cur) {
    return function() {
      for (
        var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        args[_key2] = arguments[_key2];
      }

      if (args.length < count) {
        throw new Error(
          'Maybe you should reconsider the retainning args count,' +
            ("on which, args'length " +
              args.length +
              ' should be bigger than ' +
              count)
        );
      }

      var baseArray = new Array(count);
      var nextArgs = []
        .concat(accum.apply(undefined, args), baseArray)
        .slice(0, count);
      return cur.apply(
        undefined,
        _toConsumableArray(nextArgs).concat(
          _toConsumableArray(args.slice(count))
        )
      );
    };
  });
};
