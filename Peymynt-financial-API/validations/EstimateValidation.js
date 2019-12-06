import Joi from "joi";

export const Estimateschema = Joi.object().keys({
    name: Joi.string().required(),
    estimateNumber: Joi.number().required(),
    customer: Joi.string().required(),
    currency: Joi.object()
        .keys({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
            symbol: Joi.string().optional(),
            displayName: Joi.string().optional()
        })
        .required(),
    purchaseOrder: Joi.string()
        .optional()
        .allow(""),
    exchangeRate: Joi.number()
        .optional()
        .allow(0),
    estimateDate: Joi.date().required(),
    expiryDate: Joi.date().required(),
    subheading: Joi.string()
        .optional()
        .allow(""),
    footer: Joi.string()
        .optional()
        .allow(""),
    memo: Joi.string()
        .optional()
        .allow(""),
    amountBreakup: Joi.object().keys({
        subTotal: Joi.number()
            .optional()
            .allow(0),
        taxTotal: Joi.array()
            .optional()
            .allow(0),
        total: Joi.number()
            .optional()
            .allow(0)
    }),
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
        hideItem: Joi.boolean().default(false),
        hideDescription: Joi.boolean().default(false),
        hideQuantity: Joi.boolean().default(false),
        hidePrice: Joi.boolean().default(false),
        hideAmount: Joi.boolean().default(false),
        savedForFuture: Joi.boolean().default(false)
    }),
    items: Joi.array()
        .items(
            Joi.object().keys({
                item: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string()
                    .optional()
                    .allow(""),
                quantity: Joi.number()
                    .optional()
                    .allow(0),
                price: Joi.number()
                    .optional()
                    .allow(0),
                taxes: Joi.array().items(),
                amount: Joi.number()
                    .optional()
                    .allow(0),
                id: Joi.string().optional(),
                _id: Joi.string().optional()
            })
        )
        .required(),
    totalAmount: Joi.number()
        .optional()
        .allow(0),
    totalAmountInHomeCurrency: Joi.number().optional().allow(0),
    userId: Joi.string().required(),
    businessId: Joi.string().required(),
    status: Joi.string()
        .optional()
        .allow("viewed", "sent", "saved", "expired")
});
