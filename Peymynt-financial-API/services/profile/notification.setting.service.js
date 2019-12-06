import { errorResponse, okResponse } from "../../util/HttpResponse";
import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR, HTTP_BAD_REQUEST } from "../../util/constant";
import { createSetting, getSetting, patchSetting } from "./notification.setting.dal";

export const addNotificationSetting = async (notificationSettingInput, user) => {
    try {
        let notificationSetting = await getSetting(user._id);
        if (!notificationSetting) {
            notificationSetting = await createSetting(notificationSettingInput, user);
        } else {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Setting already exists");
        }
        return okResponse(HTTP_OK, { notificationSetting }, "Settings saved successfully!");
    } catch (error) {
        console.log("==========================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchNotificationSetting = async (userId) => {
    try {
        let notificationSetting = await getSetting(userId);
        if (!notificationSetting) {
            await createSetting({}, userId);
            notificationSetting = await getSetting(userId);
        }

        return okResponse(HTTP_OK, { notificationSetting }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const patchNotificationSetting = async (notificationSettingInput, userId) => {
    try {

        let notificationSetting = await getSetting(userId);

        if (!notificationSetting) {
            return errorResponse(HTTP_BAD_REQUEST, null, "No setting exists for this business");
        } else {
            await patchSetting(notificationSettingInput, userId);
            notificationSetting = await getSetting(userId);
        }
        return okResponse(HTTP_OK, { notificationSetting }, "Settings saved successfully!");
    } catch (error) {
        console.log("==========================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};