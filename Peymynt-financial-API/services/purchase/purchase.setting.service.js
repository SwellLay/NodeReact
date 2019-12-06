import { errorResponse, okResponse } from "../../util/HttpResponse";
import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR, HTTP_BAD_REQUEST } from "../../util/constant";
import { createSetting, getSetting, patchSetting } from "./purchase.setting.dal";

export const addPurchaseSetting = async (purchaseSettingInput, user, businessId) => {
    try {
        let purchaseSetting = await getSetting(businessId);
        if (!purchaseSetting) {
            purchaseSetting = await createSetting(purchaseSettingInput, user, businessId);
        } else {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Setting already exists");
        }
        return okResponse(HTTP_OK, { purchaseSetting }, "Settings saved successfully!");
    } catch (error) {
        console.log("==========================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchPurchaseSetting = async (businessId, user) => {
    try {
        let purchaseSetting = await getSetting(businessId);
        if (!purchaseSetting) {
            await createSetting({}, user, businessId);
            purchaseSetting = await getSetting(businessId);
        }

        return okResponse(HTTP_OK, { purchaseSetting }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const patchPurchaseSetting = async (purchaseSettingInput, user, businessId) => {
    try {

        let purchaseSetting = await getSetting(businessId);

        if (!purchaseSetting) {
            return errorResponse(HTTP_BAD_REQUEST, null, "No setting exists for this business");
        } else {
            await patchSetting(purchaseSettingInput, user, businessId);
            purchaseSetting = await getSetting(businessId);
        }
        return okResponse(HTTP_OK, { purchaseSetting }, "Settings saved successfully!");
    } catch (error) {
        console.log("==========================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};