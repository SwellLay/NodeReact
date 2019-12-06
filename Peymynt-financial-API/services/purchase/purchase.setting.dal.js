import { PurchaseSettingModel } from "../../models/setting/purchase.setting.model";
import { InvoiceModel } from "../../models/invoice.model";

export const createSetting = async (purchaseSettingInput, user, businessId) => {
    try {
        if (!purchaseSettingInput.businessId) {
            purchaseSettingInput.businessId = businessId;
        }

        if (!purchaseSettingInput.userId) {
            purchaseSettingInput.userId = user._id;
        }

        let purchaseSetting = new PurchaseSettingModel(purchaseSettingInput);
        purchaseSetting = await purchaseSetting.save();
        return purchaseSetting;
    } catch (error) {
        throw error;
    }
};

export const getSetting = async (businessId) => {
    try {
        console.log('---------- >', businessId)
        const setting = await PurchaseSettingModel.findOne({
            businessId
        });
        if (setting)
            return setting.toUserJson();
        else return null;
    } catch (error) {
        throw error;
    }
};

export const patchSetting = async (purchaseSettingInput, user, businessId) => {
    try {
        if (!purchaseSettingInput.businessId) {
            purchaseSettingInput.businessId = businessId;
        }

        if (!purchaseSettingInput.userId) {
            purchaseSettingInput.userId = user._id;
        }
        console.log("all invoiuce", purchaseSettingInput.allInvoices)
        if (purchaseSettingInput.allInvoices) {
            await InvoiceModel.updateMany({ businessId }, {
                onlinePayments: {
                    modeCard: purchaseSettingInput.accept_card,
                    modeBank: purchaseSettingInput.accept_bank
                }
            })
        }
        return await PurchaseSettingModel.updateOne({ businessId }, purchaseSettingInput, { upsert: true });

    } catch (error) {
        throw error;
    }
};