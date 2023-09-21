//#region common requires

const path = require('path')
const fs = require('fs')

process.env['ROOT_PATHS'] = path.dirname(require.main.filename)
const rootPath = process.env['ROOT_PATHS'];

const logger = require(path.join(rootPath, 'lib', 'logger')).logger

const express = require('express')

const middlewares = require(path.join(rootPath, 'lib', 'middlewares'))
const routeManager = require(path.join(rootPath, 'lib', 'route-manager'))

const config = require(path.join(rootPath, 'lib', 'configs')).config

//#endregion

// write app version to log
let appname = `${config.app.name} v${config.app.version} build ${config.app.build}`
let port = config.webServer.port

logger.info(`start ${appname} listen on port: ${port}`);

// Create express app.
const app = express()
middlewares.init_middlewares(app)
routeManager.init_routes(app)

// create https server
/*
const https = require('https')

const sslServer = https.createServer({
        key: fs.readFileSync(path.join(rootPath, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(rootPath, 'cert', 'cert.pem'))
    }, app)

sslServer.listen(port, () => { 
    let msg = `${appname} listen on port: ${port}`
    console.log(msg)
    logger.info(msg);
})
*/

// create http server
const http = require('http')

const webServer = http.Server(app)

webServer.listen(port, () => { 
    let msg = `${appname} listen on port: ${port}`
    console.log(msg)
    logger.info(msg);
})

setInterval(() => {
    
}, 1000)