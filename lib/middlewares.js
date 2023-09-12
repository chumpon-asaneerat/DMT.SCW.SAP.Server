//#region common requires

const path = require('path')
const fs = require('fs')

const basicAuth = require("express-basic-auth")
//const find = require('find');
const helmet = require("helmet");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const bodyparser = require("body-parser");
const compression = require("compression");

// setup root path. only call once when module load (require).
process.env['ROOT_PATHS'] = path.dirname(require.main.filename)
const rootPath = process.env['ROOT_PATHS']

const logger = require(path.join(rootPath, 'lib', 'logger')).logger // require
const jsonfile = require(path.join(rootPath, 'lib', 'jsonfile'))

//#endregion

//#region HTTP Error Simulate methods

const inject_http_code = (req, res, next) => {
    let url = req.originalUrl
    let needSave = false        
    let pObj = { enabled: false, routes: [] }
    
    let jsonFileName = path.join(rootPath, 'routes_http_error_inject.config.json')
    if (!jsonfile.exists(jsonFileName))
        needSave = true
    else pObj = jsonfile.load(jsonFileName)

    if (!pObj) {
        pObj = { enabled: false, routes: [] }
        needSave = true
    }
    if (!pObj.routes) {
        pObj.routes = []
        needSave = true
    }
    if (!pObj.enabled) 
    {
        if (needSave) jsonfile.save(jsonFileName, pObj)
        next() 
    }
    else {
        let match = pObj.routes.find(el => { return el.url.toLowerCase() == url.toLowerCase() })
        if (!match) {
            match = { url: url.toLowerCase(), statusCode: 200 }
            pObj.routes.push(match)
            needSave = true
        }
        if (needSave) jsonfile.save(jsonFileName, pObj)

        if (match.statusCode !== undefined && match.statusCode !== null && match.statusCode !== 200) 
            res.status(match.statusCode).end()
        else next()
    }
}

//#endregion

function getUnauthorizedResponse(req, res) {
    return {
        msg: req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') : 'No credentials provided'
    }
}

// ##--------------------
// ## init middlewares
// ##--------------------

const init_middlewares = (app) => {
    // Init Helmet
    app.use(helmet());
    // Init Logger
    app.enable("trust proxy");
    app.use(morgan("short", { stream: logger.stream }));
    // Init Cookie Parser
    let secret = 'YOUR_SECURE_KEY@123'
    app.use(cookieparser(secret));
    // Init Body Parser
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    // Init Compression
    app.use(compression())
    // Init Basic Auth
    app.use('api', basicAuth({
        users: { 'api_user': 'DMTinf#2023' },
        unauthorizedResponse: getUnauthorizedResponse
    }))
    // Init HTTP Error Simulate method
    app.use(inject_http_code)
}

module.exports.init_middlewares = exports.init_middlewares = init_middlewares