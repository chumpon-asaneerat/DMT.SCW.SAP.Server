const express = require('express')
const basicAuth = require('express-basic-auth')
const https = require('https')

const path = require('path');
//const find = require('find');
const fs = require('fs');
const helmet = require("helmet");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const bodyparser = require("body-parser");
const compression = require("compression");

// Create express app.
const app = express()

const rootPath = process.env['ROOT_PATHS'];

// ##--------------------
// ## init middlewares
// ##--------------------
// Init Basic Auth
app.use(basicAuth({
    users: { 'api_user': 'DMTinf#2023' },
    unauthorizedResponse: getUnauthorizedResponse
}))
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

function getUnauthorizedResponse(req, res) {
    return {
        msg: req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') : 'No credentials provided'
    }
    
}

app.use('/', (req, res, next) => { 
    res.send('Hello from SSL server')
})

const sslServer = https.createServer({
        key: fs.readFileSync(path.join(rootPath, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(rootPath, 'cert', 'cert.pem'))
    }, app)

sslServer.listen(3443, () => { 
    console.log('secure server on port 3443')
})