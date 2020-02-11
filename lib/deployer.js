'use strict';

let fs       = require('hexo-fs')
let path     = require('path')
let Netlify  = require('netlify')

let deployer = (args, dir) =>
	new Netlify(args.token).deploy(args.site_id, dir)
		.then(() => console.log("hexo-deployer-netlify: Deployed!"))
		.catch(err => console.error(`hexo-deployer-netlify: Error while deploying: ${err}`));

module.exports = (args, hexo) =>
	new Promise((resolve, reject) => {
		if(!args.token){
			reject(new Error('hexo-deployer-netlify: plugin is not configured, you need to set token.'))
		}else if(!args.site_id){
			reject(new Error('hexo-deployer-netlify: plugin is not configured, you need to set site_id.'))
		}else{
			return deployer(args, path.resolve(hexo.public_dir));
		}
	})
