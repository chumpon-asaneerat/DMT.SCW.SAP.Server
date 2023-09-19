//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger

const config = require(path.join(rootPath, 'lib', 'configs')).config
const mssql = require('mssql');
const moment = require('moment')

//#endregion

const SqlServer = class {
    /**
     * Create new instance of Microsoft Sql Server data access.
     */
    constructor() {
        // init local variables.
        /** The mssql connection. */
        this.connection = null;
    }

    /**
     * Connect to database.
     * 
     * @return {Boolean} Return true if database server is connected.
     */
    async connect() {
        let ret;
        if (!mssql) ret = false;
        let cfg = config.SqlServer

        this.connection = new mssql.ConnectionPool(cfg);
        try {
            await this.connection.connect();
        }
        catch (err) {
            //console.log(err)
            logger.error(err.message);
            this.connection = null;
        }
        
        ret = this.connected;
        if (ret) {
            logger.info('database is connected.');
        }
        return ret;
    }
    /**
     * Disconnect from database.
     */
    async disconnect() {
        if (this.connected) {
            await this.connection.close();
            this.connection = null;
            //console.log('database is disconnected.');
            logger.info('database is disconnected.');
        }
    }
    /**
     * Checks is connected to target database server.
     */
    get connected() {
        return (mssql && this.connection && this.connection.connected);
    }
    async execute(name, pObj, inputs, outputs) {
        let ret = createResult();
        if (this.connected) {
            logger.info('execute command: ' + name)
            let req = new mssql.Request(this.connection);

            let o = clone(pObj);
            prepare(req, o, inputs, outputs);

            try {
                let dbResult = await req.execute(name);
                updateResult(ret, dbResult);
                ret.out = readOutputs(req, outputs, dbResult);
            }
            catch (err) {
                ret.errors.hasError = true;
                ret.errors.errNum = errorCodes.EXECUTE_ERROR;
                ret.errors.errMsg = err.message;
                logger.error(err.message);
            }
        }

        return ret;
    }



    async SPName(pObj) {
        let name = 'SPName';
        let proc = schema[name];
        let inputs = [
            { "name": "param1", "type": "nvarchar(5)" }, 
            { "name": "param2", "type": "datetime" } 
        ]
        let outputs = [
            { "name": "ErrMsg", "type": "varchar(200)" },
            { "name": "ErrNum", "type": "int" },
            { "name": "ReturnType", "type": "int" }
        ]
        return await this.execute(name, pObj, inputs, outputs);
    }
}

module.exports = exports = SqlServer;