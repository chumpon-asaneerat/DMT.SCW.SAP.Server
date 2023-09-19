//#region common requires

const path = require('path');
const fs = require('fs');

const rootPath = process.env['ROOT_PATHS'];

// required to manual set require path for nlib-mssql.
const SqlServer = require(path.join(rootPath, 'lib', 'SqlServer'))

//#endregion

const TAxTOD = class extends SqlServer {
    //#region SaveCouponReservation

    async SaveCouponReservation(pObj) {
        let name = 'SaveCouponReservation'        
        let inputs = [
            { "name": "postingdate", "type": "char(8)" },
            { "name": "mat_slip", "type": "char(16)" },
            { "name": "headertext", "type": "char(25)" },
            { "name": "itemnumber", "type": "char(4)" },
            { "name": "materialnum", "type": "char(10)" },
            { "name": "quantity", "type": "int" },
            { "name": "unit", "type": "char(4)" },
            { "name": "plant", "type": "char(4)" },
            { "name": "location", "type": "char(4)" },
            { "name": "goodsrecipient", "type": "char(12)" },
            { "name": "matdescription", "type": "nchar(40)" }
        ]
        let outputs = [
            { "name": "errNum", "type": "int" },
            { "name": "errMsg", "type": "nvarchar(max)" }
        ]
        return await this.execute(name, pObj, inputs, outputs);
    }

    //#endregion

    //#region SaveReceivedCoupon

    async SaveReceivedCoupon(pObj) {
        let name = 'SaveReceivedCoupon'
        let inputs = [
            { "name": "materialnum", "type": "nvarchar(10)" },
            { "name": "location", "type": "nvarchar(5)" },
            { "name": "SerialNo", "type": "nvarchar(7)" },
            { "name": "mat_slip", "type": "nvarchar(12)" },
            { "name": "matdescription", "type": "nvarchar(20)" }
        ]
        let outputs = [
            { "name": "errNum", "type": "int" },
            { "name": "errMsg", "type": "nvarchar(max)" }
        ]
        return await this.execute(name, pObj, inputs, outputs);
    }

    //#endregion
}

module.exports = exports = TAxTOD;