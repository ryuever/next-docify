require('babel-register')({
  babelrc: false,
  plugins: [
    'transform-class-properties',
    'transform-object-rest-spread',
  ],
  presets: ['react', 'env'],
});

const server = require('../server').default;

server();
