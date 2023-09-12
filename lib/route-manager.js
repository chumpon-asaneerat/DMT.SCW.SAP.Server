//#region common requires

const path = require('path');
const find = require('find');
const fs = require('fs');
// init logger
const logger = require('./logger').logger

const rootPath = process.env['ROOT_PATHS'];

//#endregion

const init_routes_js = (svr, parentPath) => {
    find.fileSync(parentPath).forEach(file => {
        if (path.basename(file).toLowerCase() === 'routes.js') {
            try {
                console.log('  + setup route(s) in :', path.dirname(file));
                require(file).init_routes(svr);
            }
            catch (ex) {
                console.error('Cannot init route in file: ' + file);
                console.error(ex);
            }
        }
    });
}
/**
 * auto mount routes.
 */
const init_routes = (app) => {
    console.log('init routes....');
    init_routes_js(app, path.join(rootPath, 'routes'));
}

module.exports.init_routes = exports.init_routes = init_routes