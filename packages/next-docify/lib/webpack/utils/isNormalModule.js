const NormalModule = require('webpack/lib/NormalModule');

module.exports = mod => mod instanceof NormalModule;
