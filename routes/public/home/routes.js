//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger

//#endregion

const execute = (req, res, next) => {
    res.sendFile(req, res, __dirname, 'index.html');
    if (!next) next()
}

const init_routes = (app) => {
    app.get('/about', execute);
};

module.exports.init_routes = exports.init_routes = init_routes