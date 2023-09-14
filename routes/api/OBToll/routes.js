//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger

const jsonfile = require(path.join(rootPath, 'lib', 'jsonfile'))
const moment = require('moment')

//#endregion

const saveOBToll = (req, res, next) => {
    let fname = 'ob_toll.' + moment().format('YYYY.MM.DD.HH.mm.ss.SSSS') + '.json'
    let filename = path.join(rootPath, 'jsonfiles', 'ob_toll', fname)
    let value = req.body
    jsonfile.save(filename, value)

    let headers = value.Header
    let output = {
        Return: []
    }
    if (headers && headers.length > 0) {
        console.log('Header record count: ' + headers.length)
        let iCnt = 0
        for (header of headers) {
            let matSlip =  header.MAT_SLIP

            let items = header.Item
            if (items && items.length > 0) {
                let sInfo = `MAT_SLIP: ${matSlip} total items: ${items.length}`
                console.log(sInfo)
            }

            let bErr = ((iCnt % 2) == 0)
            let type = (bErr) ? "E" : "S"
            let msg = (bErr) ? "No material found" : "Successfull"
            let ret = {
                MAT_SLIP: matSlip,
                TYPE: type,
                MESSAGE: msg
            }
            // append to array
            output.Return.push(ret)
            // increase counter
            iCnt++
        }
        // send response back
        res.json(output)
    }
    else {
        //logger.info('Header is null or empty array.')
        console.log('Header is null or empty array.')
        if (!next) next() // remove or comment out after write handler code.
    }
}

const init_routes = (app) => {
    app.post('/api/secure/ob_toll/save', saveOBToll);
};

module.exports.init_routes = exports.init_routes = init_routes;
