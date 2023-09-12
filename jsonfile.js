const path = require('path')
const fs = require('fs')
const logger = require('./logger').logger

// setup root path. only call once when module load (require).
process.env['ROOT_PATHS'] = path.dirname(require.main.filename)
const rootPath = process.env['ROOT_PATHS']

const exist = (filename) => { return fs.existsSync(filename) }
const save = (filename, jsonObj) => {
    try
    {
        fs.writeFileSync(cfgFile, JSON.stringify(jsonObj, null, 4), 'utf8');
    }
    catch (err)
    {
        logger.error(err.message);
    }
}
const load = (filename) => {
    let obj = null
    let sJson = fs.readFileSync(filename, 'utf8');
    try 
    { 
        obj = JSON.parse(sJson) 
    }
    catch (err) 
    { 
        obj = null
        logger.error(err.message)
    }
    return obj
}
