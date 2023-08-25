const express = require('express')
const basicAuth = require('express-basic-auth')
const https = require('https')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(basicAuth({
    users: { 'api_user': 'DMTinf#2023' },
    unauthorizedResponse: getUnauthorizedResponse
}))

function getUnauthorizedResponse(req, res) {
    return {
        msg: req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') : 'No credentials provided'
    }
    
}

app.use('/', (req, res, next) => { 
    res.send('Hello from SSL server')
})

const sslServer = https.createServer({
        key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    }, app)

sslServer.listen(3443, () => { 
    console.log('secure server on port 3443')
})