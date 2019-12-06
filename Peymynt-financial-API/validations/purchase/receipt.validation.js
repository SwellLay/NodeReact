import Joi from "joi";

export const ReceiptSchema = Joi.object().keys({
    merchant: Joi.string()
        .required(),
    receiptDate: Joi.string()
        .required(),
    currency: Joi.object()
        .keys({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
            symbol: Joi.string().optional(),
            displayName: Joi.string().optional()
        })
        .required(),
    notes: Joi.string().optional().allow(""),
    amountBreakup: Joi.object().keys({
        subTotal: Joi.number()
            .optional()
            .allow(0),
        taxes: Joi.array()
            .optional()
            .allow(0),
        total: Joi.number()
            .optional()
            .allow(0)
    }),
    totalAmount: Joi.number().required(),
});