import { okResponse, errorResponse } from "../util/HttpResponse";
import { PaymentSettingModel } from '../models/setting/payment.setting.model';
import {UserModel} from '../models/user.model';
import moment from "moment";
var ObjectId = require('mongodb').ObjectId
let stripe = require("stripe")(process.env.STRIPE_KEY);
const plaid = require('plaid');
const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    process.env.PLAID_ENV != 'production' ? plaid.environments.sandbox : plaid.environments.production,
    {
        version: process.env.PLAID_VERSION,
        PLAID_COUNTRY_CODES: 'US,UK, CA, GB, FR, ES'
    });

import {
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_OK,
    OK,
    HTTP_NOT_FOUND,
    NULL,
    SUCCESS,
    DELETE_SUCCESS,
    FAILED,
    HTTP_CONFLICT,
    HTTP_BAD_REQUEST
} from "../util/constant";
import { getFormattedError, getEndDateWithTime } from '../util/utils';
import { fetchCustomerById } from "../services/CustomerService";

export const getPaymentSettings = async (userId) => {
    try {
        let setting = PaymentSettingModel.findOne({ userId: userId });
        return setting;
    } catch (error) {
        console.log(error)
    }
}

export const updatePaymentSettings = async (data) => {
    try {
        // let udpatedSettings = await UserModel.findOne({_id: data.userId});
        let udpatedSettings = await PaymentSettingModel.findOneAndUpdate({userId: data.userId, businessId: data.businessId}, {$setOnInsert: data}, { returnOriginal: false, upsert: true });
        return udpatedSettings;
    } catch (error){
        console.log(error)
    }
}