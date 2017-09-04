'use strict';

let deployer = require('./lib/deployer')
hexo.extend.deployer.register('netlify', module.exports = (args) => deployer( args , hexo ) )
