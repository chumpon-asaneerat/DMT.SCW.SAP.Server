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


const schedule = require('node-schedule')

// The cron format consists of:
//
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)


// const job = schedule.scheduleJob('*/5 * * * * *', () => {
//     // run every 5 s.
//     console.log('The answer to life, the universe, and everything!')
// })


// Use Recurrence Rule - every 2 second
const rule = new schedule.RecurrenceRule()
let times = []
for (let i = 1; i < 60; i++) { 
    if ((i % 2) == 0) times.push(i)
}
rule.second = times

const job = schedule.scheduleJob(rule, () => {
    console.log('The answer to life, the universe, and everything!')
});

// gracefully shutdown jobs when a system interrupt occurs.
process.on('SIGINT', () => { 
    schedule.gracefulShutdown().then(() => process.exit(0))
})