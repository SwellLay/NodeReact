import { errorResponse, okResponse } from "../../util/HttpResponse";
import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR, HTTP_BAD_REQUEST } from "../../util/constant";
import { createSetting, getSetting, patchSetting } from "./payment.setting.dal";

export const addPaymentSetting = async (paymentSettingInput, user, businessId) => {
    try {
        let paymentSetting = await getSetting(businessId);
        if (!paymentSetting) {
            paymentSetting = await createSetting(paymentSettingInput, user, businessId);
        } else {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Setting already exists");
        }
        return okResponse(HTTP_OK, { paymentSetting }, "Settings saved successfully!");
    } catch (error) {
        console.log("==========================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchPaymentSetting = async (businessId, user) => {
    try {
        let paymentSetting = await getSetting(businessId); 
        console.log('my payment setting', paymentSetting)
        if (!paymentSetting) {
            await createSetting({}, user, businessId);
            paymentSetting = await getSetting(businessId);
        }

        return okResponse(HTTP_OK, { paymentSetting }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const patchPaymentSetting = async (paymentSettingInput, user, businessId) => {
    try {

        let paymentSetting = await getSetting(businessId);

        if (!paymentSetting) {
            return errorResponse(HTTP_BAD_REQUEST, null, "No setting exists for this business");
        } else {
            await patchSetting(paymentSettingInput, user, businessId);
            paymentSetting = await getSetting(businessId);
        }
        return okResponse(HTTP_OK, { paymentSetting }, "Settings saved successfully!");
    } catch (error) {
        console.log("==========================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};