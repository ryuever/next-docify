#!/usr/bin/env node

require('babel-register')({
  babelrc: false,
  plugins: ['transform-class-properties', 'transform-object-rest-spread'],
  ignore: /node_modules\/(?!next-docify)/,
  presets: ['react', 'env'],
});

process.env.NODE_ENV = 'development';

const server = require('../server').default;
server(3000);
