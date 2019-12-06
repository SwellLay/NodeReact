import Joi from "joi";

export const emailSchema = Joi.object().keys({
    to: Joi.array().items(Joi.string()).required(),
    message: Joi.string().optional().allow(""),
    self: Joi.boolean().optional().default(false)
});

export const emailInvoiceSchema = Joi.object().keys({
    from: Joi.string().optional().allow(""),
    to: Joi.array().items(Joi.string()).required(),
    subject: Joi.string().optional().allow(""),
    message: Joi.string().optional().allow(""),
    self: Joi.boolean().optional().default(false),
    isReminder: Joi.boolean().optional().default(false),
    attachPDF: Joi.boolean().optional().default(false),
});

export const emailEstimateSchema = Joi.object().keys({
    from: Joi.string().optional().allow(""),
    to: Joi.array().items(Joi.string()).required(),
    subject: Joi.string().optional().allow(""),
    message: Joi.string().optional().allow(""),
    self: Joi.boolean().optional().default(false),
    attachPDF: Joi.boolean().optional().default(false),
});

export const emailAccountStatementSchema = Joi.object().keys({
    from: Joi.string().optional().allow(""),
    to: Joi.array().items(Joi.string()).required(),
    subject: Joi.string().optional().allow(""),
    message: Joi.string().optional().allow(""),
    self: Joi.boolean().optional().default(false),
});