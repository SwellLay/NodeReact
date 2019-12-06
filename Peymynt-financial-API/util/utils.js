import moment from "moment";
import mongoose from "mongoose";
import { errorResponse } from "./HttpResponse";
import Joi from "joi";
import uuidv4 from "uuid/v4";
import { HTTP_INTERNAL_SERVER_ERROR } from "./constant";

export const isValidObjectId = value => {
    return mongoose.Types.ObjectId.isValid(value);
};

export const getS3BucketKey = (businessId, uploadType, fileName) => {
    let key = `business-public/${businessId}/${uploadType}/${uuidv4()}-${fileName}`;
    key = key.replace(/\s/g, "");
    console.log("key", key);
    return key;
}

export const convertDate = (dateDBFormate) => {
    return moment(dateDBFormate).format('MMM DD, YYYY');
}

export const prettyLog = (input, shouldLog = true) => {
    if (shouldLog)
        return console.log(JSON.stringify(input, null, 2));
    else
        return JSON.stringify(input, null, 2);
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

export const isValidNumber = (invoiceNumber) => {
    return !isNaN(invoiceNumber);
}

export const validate = async (input, schema) => {
    try {
        let message = await Joi.validate(input, schema);
        return [false, message];
    } catch (validationError) {
        // console.log("----validation error------------> ", validationError);
        const { details } = validationError;
        if (details) {
            const message = details.map(i => i.message).join(',');
            console.log(" -----------------> ", message);
            // validationError = errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, message);
            console.log(validationError, " valid");
            // throw Error(validationError);
            return [true, message];
        } else {
            return [validationError, validationError.name];
        }
    }
}

export const getDateOnly = (date) => {
    return moment(date);
}

export const getToday = () => {
    return moment();
}
export const getSafeAmount = (number) => {
    return (parseFloat(number)).toFixed(2);
}
export const getDisplayDate = (date, format) => {
    if (format)
        return moment(date).format(format);
    else return moment(date).format('MMM DD, YYYY');
}
export const getTemplateCode = (templateFor, templateName) => {
    console.log('template code ', templateFor, templateName);
    templateName = templateName == 'classic' ? 'modern' : templateName;
    return `${templateFor.toLowerCase()}.${templateName}`;
}

export const getEndDateWithTime = (endDate) => {
    endDate = moment(endDate);
    let endDateFormatted = endDate.clone();
    endDateFormatted.utc();
    // Creating total new date with same date values and time set to end of day
    endDateFormatted.date(endDate.date());
    endDateFormatted.month(endDate.month());
    endDateFormatted.year(endDate.year());
    endDateFormatted.hours(23);
    endDateFormatted.minutes(59);
    endDateFormatted.seconds(59);
    return endDateFormatted;
}