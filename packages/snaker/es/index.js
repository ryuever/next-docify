'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _composeArg = require('./composeArg1');

var _composeArg2 = _interopRequireDefault(_composeArg);

var _composeArgn = require('./composeArgn');

var _composeArgn2 = _interopRequireDefault(_composeArgn);

var _composeResult = require('./composeResult');

var _composeResult2 = _interopRequireDefault(_composeResult);

var _composeResultAssemble = require('./composeResultAssemble');

var _composeResultAssemble2 = _interopRequireDefault(_composeResultAssemble);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = {
  compose: _compose2.default,
  composeArg1: _composeArg2.default,
  composeArgn: _composeArgn2.default,
  composeResult: _composeResult2.default,
  composeResultAssemble: _composeResultAssemble2.default,
};
