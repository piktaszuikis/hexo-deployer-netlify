'use strict';

var fs = require('hexo-fs');
var netlify = require("netlify");

module.exports = function(args) {
	if(!args.token){
		console.error('netlify: plugin is not configured, you need to set token.');
		return false;
	}
	
	if(!args.site_id){
		console.error('netlify: plugin is not configured, you need to set site_id.');
		return false;
	}

	return netlify.deploy({access_token: args.token, site_id: args.site_id, dir: this.public_dir}).then(function(deploy) {
		if(deploy.error_message)
			console.error('netlify: Error while deploying: ', deploy.error_message);
		else
			console.log("netlify: New deploy is live");
	});
};
