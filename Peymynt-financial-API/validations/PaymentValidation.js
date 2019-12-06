import Joi from "joi";

export const paymentTosSchema = Joi.object().keys({
    date: Joi.number().required(),
    ip: Joi.string().ip().required(),
    userAgent: Joi.string().required()
});
export const PaymentByCashSchema = Joi.object().keys({
    account: Joi.string().optional().optional(),
    memo: Joi.string().optional().allow("" || null),
    method: Joi.string().required().equal("manual"),
    amount: Joi.number().required().min(1).positive(),
    amountInHomeCurrency: Joi.number().optional().allow(null || 0),
    exchangeRate: Joi.number().optional().allow(null || 0),
    isDeleted: Joi.string().optional().allow(false),
    manualMethod: Joi.string().required(),
    paymentDate: Joi.date().required()
});
export const PaymentByCardSchema = Joi.object().keys({
    stripeToken: Joi.string().optional().allow(""),
    method: Joi.string().required().equal("card"),
    amount: Joi.number().required().min(1).positive(),
    cardHolderName: Joi.string().required(),
    rawElementResponse: Joi.string().required(),
    saveCard: Joi.boolean().required()
});

export const PaymentByCardPublicSchema = Joi.object().keys({
    uuid: Joi.string().required(),
    stripeToken: Joi.string().optional().allow(""),
    method: Joi.string().required().equal("card"),
    amount: Joi.number().required(),
    cardHolderName: Joi.string().required(),
    rawElementResponse: Joi.string().required(),
    saveCard: Joi.boolean().required()
});

export const PaymentBySavedCardPublicSchema = Joi.object().keys({
    uuid: Joi.string().required(),
    method: Joi.string().required().equal("card"),
    amount: Joi.number().required(),
    cardId: Joi.string().required()
});

export const PaymentByBankPublicSchema = Joi.object().keys({
    uuid: Joi.string().required(),
    plaidToken: Joi.string().optional().allow(""),
    method: Joi.string().required().equal("bank"),
    amount: Joi.number().required(),
    accountId: Joi.string().required(),
    signature: Joi.string().required(),
    rawLinkResponse: Joi.string().required()
});

