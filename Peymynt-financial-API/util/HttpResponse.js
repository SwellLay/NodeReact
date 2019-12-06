let _ = require('lodash/core');
import { prettyLog } from "../util/utils";
export const okResponse = (statusCode, data, message) => {
    return {
        statusCode: statusCode,
        message: message,
        error: false,
        data: data ? data : null
    }
}

export const getFormattedError = error => {
    console.log(`Common error : error : ${JSON.stringify(error)}`);
    if (error) {
        console.log("Error : " + prettyLog(error, false))
        if (error.type == 'StripeInvalidRequestError') {
            error = {
                message: error.message,
                code: error.code,
                rawType: error.rawType,
                param: error.param
            }
        }
    } else {
        error = {
            message: "Unknown error. Please contact support if problem persists",
            code: "error.unknown",
            rawType: "Unknown error"
        }
    }
    return error;
}

export const errorResponse = (statusCode, data, message) => {
    console.log("errorResponse : " + message);
    console.log("errorResponse data: " + data);
    // Check if its mongoose error
    if (data && data.name == 'ValidationError') {
        console.log("Validation error");
        statusCode = 400;
        for (let field in data.errors) {
            console.log("field", JSON.stringify(data.errors[field]));
            message = `Error : ${data.errors[field].message}`;
            break;
        }
    }
    return {
        statusCode: statusCode,
        message,
        error: true,
        data: data ? data : null
    }
}

export const errorFormatter = (res, error) => {
    const statusCode = error.statusCode || 500;
    let errorBody = error.data;
    if (_.isEmpty(errorBody)) {
        errorBody = {
            message: error.data + ""
        }
        error.data = errorBody;
    }
    return res.status(statusCode).json(error);
}