import Joi from "joi";

export const SalesSettingSchema = Joi.object().keys({
    template: Joi.string().required().allow("contemporary", "classic", "modern"),
    companyLogo: Joi.string().optional().allow(""),
    displayLogo: Joi.boolean().optional(),
    accentColour: Joi.string().optional().allow(""),
    invoiceSetting: Joi.object().keys({
        defaultPaymentTerm: Joi.object().keys({
            key: Joi.string().optional().allow("dueOnReceipt", "dueWithin15", "dueWithin30", "dueWithin45", "dueWithin60", "dueWithin90"),
            value: Joi.string().optional().allow("Due upon receipt", "Due Within 15 days", "Due Within 30 days", "Due Within 45 days", "Due Within 60 days", "Due Within 90 days")
        }).optional(),
        defaultTitle: Joi.string().optional(),
        defaultSubTitle: Joi.string().optional().allow(""),
        defaultFooter: Joi.string().optional().allow(""),
        defaultMemo: Joi.string().optional().allow("")
    }),
    estimateSetting: Joi.object().keys({
        defaultTitle: Joi.string().optional(),
        defaultSubTitle: Joi.string().optional().allow(""),
        defaultFooter: Joi.string().optional().allow(""),
        defaultMemo: Joi.string().optional().allow("")
    }).optional(),
    itemHeading: Joi.object().keys({
        column1: Joi.object().keys({
            name: Joi.string(),
            shouldShow: Joi.boolean().default(true),
        }),
        column2: Joi.object().keys({
            name: Joi.string(),
            shouldShow: Joi.boolean().default(true),
        }),
        column3: Joi.object().keys({
            name: Joi.string(),
            shouldShow: Joi.boolean().default(true),
        }),
        column4: Joi.object().keys({
            name: Joi.string(),
            shouldShow: Joi.boolean().default(true),
        }),
        hideItem: Joi.boolean().allow(false),
        hideDescription: Joi.boolean().allow(false),
        hideQuantity: Joi.boolean().allow(false),
        hidePrice: Joi.boolean().allow(false),
        hideAmount: Joi.boolean().allow(false),
    }),
    isActive: Joi.boolean().allow(true, false),
    isDeleted: Joi.boolean().allow(true, false),
    businessId: Joi.string().required(),
    userId: Joi.string().optional()
});
