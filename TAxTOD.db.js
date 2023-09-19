//#region common requires

const path = require('path');
const fs = require('fs');

const rootPath = process.env['ROOT_PATHS'];

// required to manual set require path for nlib-mssql.
const SqlServer = require(path.join(rootPath, 'lib', 'SqlServer'))

//#endregion

const TAxTOD = class extends SqlServer {
    //#region TestSP

    async TestSP(pObj) {
        let name = 'TestSP'
        let inputs = [
            { "name": "p1", "type": "int" },
            { "name": "p2", "type": "datetime" }
        ]
        let outputs = [
            { "name": "ErrNum", "type": "int" },
            { "name": "ErrMsg", "type": "varchar(max)" }
        ]
        return await this.execute(name, pObj, inputs, outputs);
    }

    //#endregion
}

module.exports = exports = TAxTOD;