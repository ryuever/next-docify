require('babel-register')({
  babelrc: false,
  plugins: [
    // require('./server/translate-plugin.js'),
    'transform-class-properties',
    'transform-object-rest-spread',
  ],
  presets: ['react', 'env'],
});

const server = require('../server').default;

server();
