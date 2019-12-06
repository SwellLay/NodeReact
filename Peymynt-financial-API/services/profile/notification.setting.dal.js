import { NotificationSettingModel } from "../../models/setting/notification.setting.model";

export const createSetting = async (notificationSettingInput, userId) => {
    try {
        if (!notificationSettingInput.userId) {
            notificationSettingInput.userId = userId;
        }

        let notificationSetting = new NotificationSettingModel(notificationSettingInput);
        notificationSetting = await notificationSetting.save();
        return notificationSetting;
    } catch (error) {
        throw error;
    }
};

export const getSetting = async (userId) => {
    try {
        const setting = await NotificationSettingModel.findOne({
            userId
        });
        if (setting)
            return setting.toUserJson();
        else return null;
    } catch (error) {
        throw error;
    }
};

export const patchSetting = async (notificationSettingInput, userId) => {
    try {
        if (!notificationSettingInput.userId) {
            notificationSettingInput.userId = userId;
        }

        let notificationSetting = await NotificationSettingModel.findOne({
            userId: userId
        });

        return await notificationSetting.updateOne(notificationSettingInput);
    } catch (error) {
        throw error;
    }
};