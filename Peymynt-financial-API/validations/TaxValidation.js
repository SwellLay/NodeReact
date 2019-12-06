import Joi from "joi";

export const TaxSchema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string()
        .optional()
        .allow(""),
    abbreviation: Joi.string().required(),
    rate: Joi.number().min(0).max(100).required(),
    taxNumber: Joi.string().alphanum().optional().allow(""),
    userId: Joi.string().required(),
    businessId: Joi.string().required(),
    other: Joi.object().keys({
        showTaxNumber: Joi.boolean().optional().allow(false),
        isRecoverable: Joi.boolean().optional().allow(false),
        isCompound: Joi.boolean().optional().allow(false)
    })
});
