const CONSTANTS = require('./constants');
const moment = require("moment");


const resultDb = (statusCode, data = null) => {
    return {
        statusCode: statusCode,
        data: data
    };
}

const apiSuccessRes = (req, res, message = CONSTANTS.DATA_NULL, data = CONSTANTS.DATA_NULL, code = CONSTANTS.ERROR_CODE_ZERO, error = CONSTANTS.ERROR_FALSE, token, currentDate) => {
    return res.status(200).json({
        message: message,
        code: code,
        error: error,
        data: data,
        token: token,
        currentDate
    });
}

const apiErrorRes = (req, res, message = CONSTANTS.DATA_NULL, data = CONSTANTS.DATA_NULL, code = CONSTANTS.ERROR_CODE_ONE, error = CONSTANTS.ERROR_TRUE) => {
    return res.status(200).json({
        message: message,
        code: code,
        error: error,
        data: data
    });
}

function generateKey(length = CONSTANTS.VERIFICATION_TOKEN_LENGTH) {
    var key = "";
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < length; i++) {
        key += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return key;
}
function generateOTP(length = CONSTANTS.OTP_LENGTH) {
    var key = "";
    var possible = "0123456789";
    for (var i = 0; i < length; i++) {
        key += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return key;
}



module.exports = {
    resultDb,
    generateOTP,
    apiSuccessRes,
    apiErrorRes,
    generateKey
};