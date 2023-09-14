const path = require('path')
const fs = require('fs')

// setup root path. only call once when module load (require).
const rootPath = process.env['ROOT_PATHS']

const jsonfile = require(path.join(rootPath, 'lib', 'jsonfile'))

const defaultConfig = {
    app : {
        name: 'TA-SAP-SCW Server',
        version: '1.0.0',
        build: 383,
        port: 3443,
        update: '2023-09-20T06:00:35.000+07:00'
    },
    webServer: {
        basicAuth : {
            user: 'api_user',
            password: 'DMTinf#2023'
        }
    },
    sqlServer: {
        server: 'localhost',
        database: 'TAxTOD',
        user: 'sa',
        password: 'winnt123',
        pool: {
            max: 10,
            min: 0,
            timeout: 1000
        }
    }
}

const filename = path.join(rootPath, 'app.config.json')
let config = null

const InitConfig = () => {
    if (null != config) return // already create.

    if (!jsonfile.exists(filename)) {
        // set default
        config = defaultConfig
        jsonfile.save(filename, config) // save log config
    }
    config = jsonfile.load(filename) // load log config.
}

InitConfig()

module.exports.config = exports.config = config
