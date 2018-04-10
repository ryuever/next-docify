const MultiModule = require('webpack/lib/MultiModule');

module.exports = mod => mod instanceof MultiModule;
