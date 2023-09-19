//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger
const moment = require('moment');
const webUtils = require(path.join(rootPath, 'lib', 'express-utils'))
const sqldb = require(path.join(rootPath, 'TAxTOD.db'))

//#endregion

const Process = async (params) => {
    let headers = params.Header
    let output = await ProcessHeaders(headers)
    return output
}

const createOutput = () => {
    let output = {
        Return: [],
        errors: {
            hasError: false,
            errNum: 0,
            errMsg: ''
        }
    }
    return output
}

const CreateResult = (dbRet, header) => {
    let type = (dbRet.out.errNum == 0) ? 'S' : 'E'
    let msg = (dbRet.out.errNum == 0) ? 'Successfull' : dbRet.out.errMsg
    let ret = {
        MAT_SLIP: header.MAT_SLIP,
        TYPE: type,
        MESSAGE: msg
    }
    return ret
}

const CreateCouponReservationParam = (header) => {
    let pObj = {
        postingdate: header.POSTING_DATE,
        mat_slip: header.MAT_SLIP,
        headertext: header.HEADER_TXT,
        itemnumber: null,
        materialnum: null,
        quantity: null,
        unit: null,
        plant: null,
        location: null,
        goodsrecipient: null,
        matdescription: null
    }

    return pObj
}

const ProcessHeaders = async (headers) => {
    let output = createOutput()
    
    let iCnt = 0
    if (headers) {
        for (let header of headers) {
            let success = await ProcessHeader(header, output)
            if (success) iCnt++
        }
    }
    console.log(`Total Process MAT_SLIPS: ${iCnt}`)

    return output;
}
const ProcessHeader = async (header, output) => {
    let ret = false
    if (header) {
        let matSlip =  header.MAT_SLIP
        let items = header.Item    
        let itemCnt = 0
        let successCnt = 0
        if (items) {
            itemCnt = items.length
            successCnt = await ProcessItems(header, items, output)
        }
        let sp_param = CreateCouponReservationParam(header)
        let dbRet = await SaveCouponReservation(sp_param)
        console.log(dbRet)
        // create item result
        let ret = CreateResult(dbRet, header)
        // append to array
        output.Return.push(ret)

        console.log(`Process MAT_SLIP = ${matSlip}, Total items: ${itemCnt}, Success: ${successCnt}`)
        ret = true
    }
    return ret
}
const ProcessItems = async (header, items, output) => {
    let iCnt = 0
    if (items) {
        for (let item of items) {
            let success = await ProcessItem(header, item, output)
            if (success) iCnt++
        }
    }
    console.log(`Total Process MAT_SLIPS: ${iCnt}`)
    return iCnt;
}
const ProcessItem = async (header, item, output) => {
    let ret = false
    if (item) {
        ret = true
    }
    return ret
}
const SaveCouponReservation = async (pObj) => {
    let ret = {}
    let db = new sqldb()
    let connected = await db.connect()
    if (connected) {
        ret = await db.SaveCouponReservation(pObj) 
        if (ret) {
            console.log(ret)
        }
        await db.disconnect()
    }
    return ret
}
const SaveReceivedCoupon = async (pObj) => {
    let ret = {}
    let db = new sqldb()
    let connected = await db.connect()
    if (connected) {
        ret = await db.SaveReceivedCoupon(pObj) 
        if (ret) {
            console.log(ret)
        }
        await db.disconnect()
    }
    return ret
}

const saveOBToll = (req, res, next) => {
    let params = webUtils.parseReq(req).data
    
    Process(params).then(output => {
        res.json(output)
    })
    /*
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
    }
    else {
        //logger.info('Header is null or empty array.')
        console.log('Header is null or empty array.')
    }
    // send response back
    res.json(output)

    let params = webUtils.parseReq(req).data;

    executeSP(params).then(data => {
        let output = data
        // send response back
        res.json(output)
    })
    */
}

const init_routes = (app) => {
    app.post('/api/secure/ob_toll/save', saveOBToll);
};

module.exports.init_routes = exports.init_routes = init_routes;
