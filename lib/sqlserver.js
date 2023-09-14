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
}

module.exports = exports = SqlServer;