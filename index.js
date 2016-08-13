/* global hexo */
'use strict';

hexo.extend.deployer.register('netlify', require('./lib/deployer'));
