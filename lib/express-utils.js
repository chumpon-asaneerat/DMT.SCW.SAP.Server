//#region NResult

/**
 * The NResult class. Provide Result Object creation related functions.
 */
const NResult = class {
    //#region static public methods

    /**
     * Create empty result object.
     */
    static empty() {
        let ret = {
            data: null,
            errors: {
                hasError: false,
                errNum: 0,
                errMsg: ''
            }
        }
        return ret;
    }
    /**
     * Create result object with data.
     * 
     * @param {Object} obj The objet to attach to result object.
     */
    static data(obj) {
        let ret = NResult.empty();
        ret.data = obj;
        return ret;
    }
    /**
     * Create result object with error number and error message.
     * 
     * @param {Number} errNum The error number.
     * @param {String} errMsg The error message.
     */
    static error(errNum, errMsg) {
        let ret = NResult.empty();
        ret.errors.hasError = true;
        ret.errors.errNum = errNum;
        ret.errors.errMsg = errMsg;
        return ret;
    }

    //#endregion
}

//#endregion

//#region Request/Response helper methods

const parseGETReq = (req) => {
    let result = null;
    if (req.query) {
        result = {};
        // Each parameter.
        for (let key in req.query) {
            // Add Property to objct with set value.
            result[key] = (req.query[key]) ? req.query[key] : null;
        }
    }
    return NResult.data(result);
}

const parsePOSTReq = (req) => {
    let result = null;
    // Check is Query object is null.
    if (req.body) {
        result = req.body;
    }
    return NResult.data(result);
}

const webUtils = class {

    static parseReq(req) {
        let ret;
        if (req.method === 'GET') {
            ret = parseGETReq(req);
        }
        else if (req.method === 'POST') {
            ret = parsePOSTReq(req);
        }
        else {
            let errCode = -201; // Not supports.
            ret = NResult.error(errCode, 'Not Supports Operation other than GET or POST.');
        }
        return ret;
    }
}

//#endregion

module.exports = exports = webUtils;