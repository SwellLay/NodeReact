import Joi from "joi";
import { join } from "path";

export const BillSchema = Joi.object().keys({
    billNumber: Joi.string()
        .optional().allow(""),
    vendor: Joi.string()
        .required(),
    exchangeRate: Joi.number()
        .required(),
    billDate: Joi.date()
        .required(),
    expiryDate: Joi.date()
        .required(),
    currency: Joi.object()
        .keys({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
            symbol: Joi.string().optional(),
            displayName: Joi.string().optional()
        })
        .required(),
    purchaseOrder: Joi.string().optional().allow(""),
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
    items: Joi.array().items(
        Joi.object().keys({
            _id: Joi.string().optional().allow(""),
            item: Joi.string().optional().allow(""),
            name: Joi.string(),
            description: Joi.string().optional().allow(""),
            quantity: Joi.number(),
            price: Joi.number(),
            taxes: Joi.array().items(),
            taxOverrides: Joi.array().items(),
            amount: Joi.number().optional().allow(0)
        })
    ).optional().allow([]),
    totalAmount: Joi.number().required(),
    totalAmountInHomeCurrency: Joi.number().required(),
    status: Joi.string().optional().valid(["paid", "unpaid"])
});

export const BillPaymentSchema = Joi.object().keys({
    paymentMethod: Joi.string()
        .valid(["bank_payment", "check", "cash", "credit_card", "paypal", "other"])
        .required(),
    amount: Joi.number()
        .required(),
    exchangeRate: Joi.number()
        .required(),
    amountInHomeCurrency: Joi.number()
        .required(),
    paymentDate: Joi.date()
        .required(),
    memo: Joi.string().optional().allow(""),
    paymentAccount: Joi.string().optional()
});