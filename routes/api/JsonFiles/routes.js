//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
const rootPath = process.env['ROOT_PATHS'];

// init logger
const logger = require(path.join(rootPath, 'lib', 'logger')).logger

const jsonfile = require(path.join(rootPath, 'lib', 'jsonfile'))
const moment = require('moment')

//#endregion

const saveJsonFile = (req, res, next) => {
    let fname = 'req.' + moment().format('YYYY.MM.DD.HH.mm.ss.SSSS') + '.json'
    let filename = path.join(rootPath, 'jsonfiles', fname)
    let value = req.body
    jsonfile.save(filename, value)

    let obj = {
        value: 'not implements.',
        headers: req.headers
    }
    res.json(obj)

    if (!next) next() // remove or comment out after write handler code.
}

const init_routes = (app) => {
    app.post('/api/secure/json/save', saveJsonFile);
};

module.exports.init_routes = exports.init_routes = init_routes;
