//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger

//#endregion

const execute = (req, res, next) => {
    //res.send('Hello from SSL server')
    let obj = {
        value: 'not implements.'
    }
    res.json(obj)

    if (!next) next() // remove or comment out after write handler code.
}

const init_routes = (app) => {
    app.post('/api/secure/json', execute);
};

module.exports.init_routes = exports.init_routes = init_routes;
