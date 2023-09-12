const path = require('path')
const fs = require('fs')

// setup root path. only call once when module load (require).
const rootPath = process.env['ROOT_PATHS']

const logger = require(path.join(rootPath, 'lib', 'logger')).logger

const exists = (filename) => { return fs.existsSync(filename) }
const save = (filename, jsonObj) => {
    try
    {
        fs.writeFileSync(filename, JSON.stringify(jsonObj, null, 4), 'utf8');
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

module.exports.load = exports.load = load
module.exports.exists = exports.exist = exists
module.exports.save = exports.save = save