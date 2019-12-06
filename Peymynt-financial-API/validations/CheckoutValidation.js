import Joi from "joi";

export const CheckoutSchema = Joi.object().keys({
    itemName: Joi.string()
        .min(1)
        .max(300)
        .required(),
    userId: Joi.string().required(),
    message: Joi.optional(),
    status: Joi.required(),
    fields: Joi.optional(),
    businessId: Joi.string().required(),
    price: Joi.number().required(),
    taxes: Joi.array().items(Joi.string().allow("")),
    currency: Joi.object()
        .keys({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
            symbol: Joi.string().optional(),
            displayName: Joi.string().optional()
        })
        .required(),
});

export const CheckoutChargeSchema = Joi.object().keys({
    uuid: Joi.string()
        .required(),
    stripeToken: Joi.string().required(),
    method: Joi.string().equal("card").required(),
    cardHolderName:Joi.string().required(),
    address: Joi.object().keys({
        country: Joi.object().keys({
            id: Joi.number()
                .optional()
                .allow(""),
            name: Joi.string().allow("")
        }),
        state: Joi.object().keys({
            id: Joi.string()
                .optional()
                .allow(""),
            name: Joi.string().allow("")
        }),
        city: Joi.string().allow(""),
        postal: Joi.number()
            .required(),
        addressLine1: Joi.string().allow(""),
        addressLine2: Joi.string().allow("")
    }),
    customer: Joi.object().optional(),
    saveCard: Joi.boolean().required(),
    rawElementResponse: Joi.strict().required(),
});