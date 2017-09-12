'use strict';

let fs       = require('hexo-fs')
let path     = require('path')
let netlify  = require('netlify')
let archiver = require('archiver')

let clean_zip = (res) =>
	new Promise((resolve, reject) => {
		fs.access(res.zipFile , (err) => {
	        if(!err){
	        	fs.unlink(res.zipFile , (e) => {
	            	if (e) reject(new Error(e))
	            	else {
		              	resolve( res )
	            	}
	          })
	        }
	        else resolve( res )
	    })
	})

let zip = (res) =>
	 new Promise((resolve, reject) => {
		const archive = archiver('zip', {
			zlib: { level: 9 }
		})
		const output = fs.createWriteStream(res.zipFile)
		archive.pipe(output)
		archive.glob(`${path.basename(res.dir)}/**`, {
			'root' : path.resolve(res.dir,'../')
		})
		archive.finalize()

		output.on('close', () => resolve(res))

		output.on('warning', (err) => {
		  if (err.code === 'ENOENT'){
			console.log(err)
		  }else{
			reject(new Error(err))
		  }
		})

		archive.on('error', (err) => reject(new Error(err)))
	})

let deployer = (res) =>
	new Promise((resolve, reject) => {
		let options = {
			access_token: res.args.token,
			site_id: res.args.site_id
		}

		if(res.args.zip){
			options.zip = res.zipFile
		}else{
			options.dir = res.dir
		}

		netlify.deploy(options).then((deploy) => {
		  if(deploy.error_message){
			reject(new Error(`hexo-deployer-netlify: Error while deploying: ${deploy.error_message}`))
		  }else{
			console.log("hexo-deployer-netlify: Deployed!")
			resolve(res)
		  }
		})
	})

module.exports = (args, hexo) =>
	new Promise((resolve, reject) => {
		if(!args.token){
			reject(new Error('hexo-deployer-netlify: plugin is not configured, you need to set token.'))
		}else if(!args.site_id){
			reject(new Error('hexo-deployer-netlify: plugin is not configured, you need to set site_id.'))
		}else{

			let options = {
				'args'    : args,
				'dir'     : path.resolve(hexo.public_dir),
				'zipFile' : path.resolve(hexo.public_dir, '..', path.basename(hexo.public_dir) + '.zip')
			}

			if(args.zip){
				return zip(options).then(deployer).then(clean_zip)
			}else{
				return deployer(options)
			}
		}
	})
