//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger
const config = require(path.join(rootPath, 'lib', 'configs')).config

//#endregion

const execute = (req, res, next) => {
    let obj = {
        name: config.app.name,
        version: config.app.version,
        build: config.app.build,
        update: config.app.update
    }
    res.json(obj)
}

const init_routes = (app) => {
    app.all('/api/public/version', execute);
};

module.exports.init_routes = exports.init_routes = init_routes;
