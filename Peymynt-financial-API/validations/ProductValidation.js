import Joi from "joi";

export const ProductSchema = Joi.object().keys({
    name: Joi.string()
        .min(1)
        .max(300)
        .required(),
    description: Joi.string()
        .min(0)
        .max(300)
        .optional()
        .allow(""),
    userId: Joi.string().required(),
    businessId: Joi.string().required(),
    price: Joi.number().optional().allow(0),
    sell: Joi.object().keys({
        allowed: Joi.boolean(),
        account: Joi.string().allow("")
    }),
    buy: Joi.object().keys({
        allowed: Joi.boolean(),
        account: Joi.string().allow("")
    }),
    taxes: Joi.array().items(Joi.string().allow(""))
});