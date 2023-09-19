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
    let spParams = await CouponReservationParams(headers)
    let output = await SaveCouponReservations(spParams)
    return output
}

const CouponReservationParams = async (headers) => {
    let iSlipCnt = 0
    let iItemCnt = 0
    let results = []
    if (headers) {
        for (let header of headers) {
            if (header) {
                let items = header.Item
                for (let item of items) {
                    if (item) {
                        let pObj = {
                            postingdate: header.POSTING_DATE,
                            mat_slip: header.MAT_SLIP,
                            headertext: header.HEADER_TXT,
                            itemnumber: item.ITEM_NUMBER,
                            materialnum: item.MATERIAL_NUM,
                            quantity: item.QUANTITY,
                            unit: item.UNIT_OF_MEASURE,
                            plant: item.PLANT,
                            location: item.STORAGE_LOCATION,
                            goodsrecipient: item.GOODS_RECIPIENT,
                            matdescription: item.MATERIAL_DESCRIPTION,
                            books: []
                        }
                        results.push(pObj)
                        // increase item count
                        iItemCnt++
                    }
                }
                // increase slip count
                iSlipCnt++
            }
        }
    }
    console.log(`Total Process MAT_SLIPS: ${iSlipCnt}, TOTAL ITEMS: ${iItemCnt}`)

    return results
}

async function* getParams(spParams) {
    yield 1;
    yield 2;
}

const SaveCouponReservations = async (spParams) => {
    const output = {
        Return: []
    }
    for await (const spParam of spParams) {
        // save to db
        const dbResult = await SaveCouponReservation(spParam)
        let slipId = spParam.mat_slip
        let map = output.Return.map(slip => slip['MAT_SLIP'])
        let idx = map.indexOf(slipId)

        let type = (dbResult.out.errNum == 0) ? 'S' : 'E'
        let msg = (dbResult.out.errNum == 0) ? 'Successfull' : dbResult.out.errMsg
        let ret;

        if (idx === -1) {
            ret = {
                MAT_SLIP: slipId,
                TYPE: type,
                MESSAGE: msg
            }
            output.Return.push(ret)
        }
        else {
            ret = output.Return[idx]
        }
    }
    return output
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
}

const init_routes = (app) => {
    app.post('/api/secure/ob_toll/save', saveOBToll);
};

module.exports.init_routes = exports.init_routes = init_routes;
