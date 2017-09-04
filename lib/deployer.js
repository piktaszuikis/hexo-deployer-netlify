'use strict';

let fs       = require('hexo-fs')
let path     = require('path')
let netlify  = require('netlify')
let archiver = require('archiver')

module.exports = (args , hexo ) =>
	new Promise( (resolve, reject) => {
		if(!args.token){
			reject( new Error( 'hexo-deployer-netlify: plugin is not configured, you need to set token.' ))
		}else if(!args.site_id){
			reject( new Error( 'hexo-deployer-netlify: plugin is not configured, you need to set site_id.' ))
		}else {
			let options = {
				'args'    : args ,
				'dir'     : path.resolve(hexo.public_dir,'../') ,
				'zipFile' : hexo.public_dir.replace( path.resolve(hexo.public_dir,'../') , "" ).replace(/\//g,"")
			}

			if( args.zip === true ){
				return zip( options ).then( deployer )
			}else{
				return deployer( options )
			}
		}
	})

let zip = ( res ) =>
  new Promise((resolve, reject) => {
    const archive = archiver('zip', {
        zlib: { level: 9 }
    })
    const output = fs.createWriteStream( path.resolve( res.dir , res.zipFile + '.zip' ))
    archive.pipe(output)
    archive.glob( res.zipFile + '/**')
    archive.finalize()

    output.on('close', () => resolve({
		'args' 		: res.args ,
		'dir'       : res.dir ,
		'zipFile'	: res.zipFile ,
		'archives' 	: archive
    }))
    output.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        // log warning
        console.log( err )
      } else {
        // throw error
        reject( new Error( err ))
      }
    })
    archive.on('error', (err) => reject( new Error( err )))
  })

let deployer = ( res ) =>
  new Promise( (resolve, reject) => {
  	let options = {
  		access_token: res.args.token ,
  		site_id: res.args.site_id
  	}

  	if(res.args.zip === true){
  		Object.assign( options , { zip: path.resolve( res.dir , res.zipFile + '.zip' ) })
  	}else{
  		Object.assign( options , { dir: path.resolve( res.dir , res.zipFile ) })
  	}

    netlify.deploy( options ).then( (deploy) => {
	  if(deploy.error_message){
	  	reject( new Error( 'hexo-deployer-netlify: Error while deploying: ', deploy.error_message ) )
	  }else{
	  	console.log("hexo-deployer-netlify: Deplpyed !")
	  	resolve()
	  }
	})
  })
