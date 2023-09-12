const path = require('path')
const fs = require('fs')

const logger = require('./logger').logger // require
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

// ##--------------------
// ## init middlewares
// ##--------------------

function getUnauthorizedResponse(req, res) {
    return {
        msg: req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') : 'No credentials provided'
    }
}

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
    app.use(basicAuth({
        users: { 'api_user': 'DMTinf#2023' },
        unauthorizedResponse: getUnauthorizedResponse
    }))
}

module.exports.init_middlewares = exports.init_middlewares = init_middlewares