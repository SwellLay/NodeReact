import { PaymentSettingModel } from "../../models/setting/payment.setting.model";
import { InvoiceModel } from "../../models/invoice.model";

export const createSetting = async (paymentSettingInput, user, businessId) => {
    try {
        if (!paymentSettingInput.businessId) {
            paymentSettingInput.businessId = businessId;
        }

        if (!paymentSettingInput.userId) {
            paymentSettingInput.userId = user._id;
        }

        let paymentSetting = new PaymentSettingModel(paymentSettingInput);
        paymentSetting = await paymentSetting.save();
        return paymentSetting;
    } catch (error) {
        throw error;
    }
};

export const getSetting = async (businessId) => {
    try {
        console.log('---------- >', businessId)
        const setting = await PaymentSettingModel.findOne({
            businessId
        });
        if (setting)
            return setting.toUserJson();
        else return null;
    } catch (error) {
        throw error;
    }
};

export const patchSetting = async (paymentSettingInput, user, businessId) => {
    try {
        if (!paymentSettingInput.businessId) {
            paymentSettingInput.businessId = businessId;
        }

        if (!paymentSettingInput.userId) {
            paymentSettingInput.userId = user._id;
        }

        if (paymentSettingInput.allInvoices) {
            await InvoiceModel.updateMany({ businessId }, {
                onlinePayments: {
                    modeCard: paymentSettingInput.accept_card,
                    modeBank: paymentSettingInput.accept_bank
                }
            })
        }
        return await PaymentSettingModel.updateOne({ businessId }, paymentSettingInput, { upsert: true });
        // let paymentSetting = await PaymentSettingModel.findOne({
        //     businessId
        // });

        // return await paymentSetting.updateOne(paymentSettingInput);
    } catch (error) {
        throw error;
    }
};