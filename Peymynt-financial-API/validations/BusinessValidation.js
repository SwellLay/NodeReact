import Joi from "joi";

export const BusinessSchema = Joi.object().keys({
    organizationName: Joi.string()
        .min(0)
        .max(300)
        .required(),
    organizationType: Joi.string().required(),
    businessType: Joi.string().required(),
    businessSubType: Joi.string().required(),
    country: Joi.object().keys({
        name: Joi.string().required(),
        id: Joi.any().required()
    }),
    address: Joi.object().keys({
        country: Joi.object().keys({
            id: Joi.number()
                .optional()
                .allow(""),
            name: Joi.string().allow(""),
            sortname: Joi.string().allow("")
        }),
        state: Joi.object().keys({
            id: Joi.string()
                .optional()
                .allow(""),
            name: Joi.string().allow(""),
            country_id: Joi.string().allow("")
        }),
        city: Joi.string().allow(""),
        postal: Joi.number()
            .optional()
            .allow(null),
        addressLine1: Joi.string().allow(""),
        addressLine2: Joi.string().allow("")
    }),
    communication: Joi.object().keys({
        phone: Joi.string()
            .optional()
            .allow(""),
        fax: Joi.string()
            .optional()
            .allow(""),
        mobile: Joi.string()
            .optional()
            .allow(""),
        tollFree: Joi.string()
            .optional()
            .allow(""),
        website: Joi.string()
            .optional()
            .allow("")
    }),
    currency: Joi.object()
        .keys({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
            symbol: Joi.string().optional(),
            displayName: Joi.string().optional()
        })
        .optional(),
    timezone: Joi.object()
        .keys({
            timeZoneName: Joi.string().optional().allow(""),
            displayName: Joi.string().optional().allow(""),
            offset: Joi.string().optional().allow(""),
            timeZoneShortName: Joi.string().optional().allow("")
        }).optional(),
    securityCheck: Joi.object().keys({
        isClosed: Joi.boolean()
            .optional()
            .allow(false),
        isBlocked: Joi.boolean()
            .optional()
            .allow(false)
    })
});
