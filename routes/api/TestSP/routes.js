//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger

const jsonfile = require(path.join(rootPath, 'lib', 'jsonfile'))
const moment = require('moment');
const sqlserver = require('../../../lib/sqlserver');

const sqldb = require(path.join(rootPath, 'lib', 'SqlServer'))

//#endregion

const testSP = (req, res, next) => {
    /*
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
    }
    else {
        //logger.info('Header is null or empty array.')
        console.log('Header is null or empty array.')
    }
    */
    
    let db = new sqldb()
    let fn = async () => 
    { 
        let connected = await db.connect();
        if (connected)
        {
            let params = {
                p1: 1,
                p2: new moment()
            }
            ret = await db.TestSP(params) 
            if (ret) {
                console.log(ret)
            }
            await db.disconnect();
        }
        else {
            ret = null
        }
    }

    fn().then(data => {
        let output = data
        // send response back
        res.json(output)
    })

}

const init_routes = (app) => {
    app.post('/api/secure/test_sp/gets', testSP);
};

module.exports.init_routes = exports.init_routes = init_routes;
