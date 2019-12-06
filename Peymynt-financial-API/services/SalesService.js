import { SalesSettingModel } from "../models/setting/sales.setting.model";
import { errorResponse, okResponse } from "../util/HttpResponse";
import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR } from "../util/constant";

export const addSalesSetting = async (salesSettingInput, user, businessId) => {
    try {
        if (!salesSettingInput.businessId) {
            salesSettingInput.businessId = businessId;
        }

        if (!salesSettingInput.userId) {
            salesSettingInput.userId = user._id;
        }

        let salesSetting = await SalesSettingModel.findOne({
            isActive: true,
            isDeleted: false,
            businessId
        });

        if (!salesSetting) {
            salesSetting = new SalesSettingModel(salesSettingInput);
            salesSetting = await salesSetting.save();
        } else {
            await salesSetting.updateOne(salesSettingInput);
            salesSetting = await SalesSettingModel.findOne({
                isActive: true,
                isDeleted: false,
                businessId
            })
        }
        return okResponse(HTTP_OK, { salesSetting }, "Settings saved successfully!");
    } catch (error) {
        console.log("==========================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchSalesSetting = async (businessId) => {
    try {
        console.log('---------- >', businessId)
        const salesSetting = await SalesSettingModel.findOne({
            isActive: true,
            isDeleted: false,
            businessId
        });

        return okResponse(200, { salesSetting }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(500, error, "failed");
    }
};

export const patchSalesSetting = async (salesSettingInput, user, businessId) => {
    try {
        if (!salesSettingInput.businessId) {
            salesSettingInput.businessId = businessId;
        }

        if (!salesSettingInput.userId) {
            salesSettingInput.userId = user._id;
        }

        let salesSetting = await SalesSettingModel.findOne({
            isActive: true,
            isDeleted: false,
            businessId
        });

        if (!salesSetting) {
            salesSetting = new SalesSettingModel(salesSettingInput);
            salesSetting = await salesSetting.save();
        } else {
            await salesSetting.updateOne(salesSettingInput);
            salesSetting = await SalesSettingModel.findOne({
                isActive: true,
                isDeleted: false,
                businessId
            })
        }
        return okResponse(HTTP_OK, { salesSetting }, "Settings saved successfully!");
    } catch (error) {
        console.log("==========================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const updateSalesSetting = async (id, salesInput, businessId) => {
    try {
        console.log('--------- id-------', id, salesInput.companyLogo)

        var query = { _id: id, businessId: businessId },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the document
        let data = await SalesSettingModel.findOneAndUpdate(query, salesInput, options, function (error, result) {
            if (error) return;
            console.log('result ------------', result)
        });

        return okResponse(201, { data }, "Setting updated successfully!");
    } catch (error) {
        return errorResponse(500, error, "Failed to update setting");
    }
};