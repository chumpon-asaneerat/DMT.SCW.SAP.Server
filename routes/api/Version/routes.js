//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger

//#endregion

const execute = (req, res, next) => {
    let obj = {
        name: 'TA-SAP-SCW Web Server',
        version: '1.0.0',
        build: 383,
        update: new Date('2023-09-20T06:00:35.000+07:00')
    }
    res.json(obj)
}

const init_routes = (app) => {
    app.all('/api/public/version', execute);
};

module.exports.init_routes = exports.init_routes = init_routes;
