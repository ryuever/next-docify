const ContextModule = require('webpack/lib/ContextModule');

module.exports = mod => mod instanceof ContextModule;
