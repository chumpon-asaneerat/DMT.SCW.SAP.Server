const path = require('path')
const fs = require('fs')

process.env['ROOT_PATHS'] = path.dirname(require.main.filename)
const rootPath = process.env['ROOT_PATHS'];

const logger = require(path.join(rootPath, 'lib', 'logger')).logger

const express = require('express')
const https = require('https')

const middlewares = require(path.join(rootPath, 'lib', 'middlewares'))
const routeManager = require(path.join(rootPath, 'lib', 'route-manager'))

// write app version to log
logger.info('start TA-SAP-SCW Server v1.0.0 build 383 update 2023-09-20 06:00');

// Create express app.
const app = express()
middlewares.init_middlewares(app)
routeManager.init_routes(app)

/*
app.use('/', (req, res, next) => { 
    res.send('Hello from SSL server')
})
*/

// create http server
const sslServer = https.createServer({
        key: fs.readFileSync(path.join(rootPath, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(rootPath, 'cert', 'cert.pem'))
    }, app)

let appname = 'TA-SAP-SCW Server v1.0.0 build 383'    
let port = 3443

sslServer.listen(port, () => { 
    let msg = `${appname} listen on port: ${port}`
    console.log(msg)
    logger.info(msg);
})