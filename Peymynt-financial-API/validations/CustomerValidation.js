import Joi from "joi";

export const CustomerSchema = Joi.object().keys({
    customerName: Joi.string()
        .min(1)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .optional()
        .allow(""),
    firstName: Joi.string()
        .min(1)
        .max(30)
        .allow(""),
    lastName: Joi.string()
        .min(1)
        .max(30)
        .allow(""),
    currency: Joi.object()
        .keys({
            code: Joi.string().optional().allow(""),
            name: Joi.string().optional().allow(""),
            symbol: Joi.string().optional().allow(""),
            displayName: Joi.string().optional().allow("")
        })
        .optional(),
    communication: Joi.object().keys({
        accountNumber: Joi.string().allow(""),
        phone: Joi.string().allow(""),
        fax: Joi.string().allow(""),
        mobile: Joi.string().allow(""),
        tollFree: Joi.string().allow(""),
        website: Joi.string().allow("")
    }),
    addressBilling: {
        country: Joi.object().keys({
            id: Joi.number().optional().allow(""),
            name: Joi.string().allow(""),
            sortname: Joi.string().allow("")
        }),
        state: Joi.object().keys({
            id: Joi.string().optional().allow(""),
            name: Joi.string().allow(""),
            country_id: Joi.string().allow("")
        }),
        city: Joi.string().allow(""),
        postal: Joi.string()
            .optional()
            .allow(null, ""),
        addressLine1: Joi.string().allow(""),
        addressLine2: Joi.string().allow("")
    },
    addressShipping: {
        contactPerson: Joi.string().allow(""),
        phone: Joi.string().allow(""),
        country: Joi.object().keys({
            id: Joi.number().optional().allow(""),
            name: Joi.string().allow(""),
            sortname: Joi.string().allow("")
        }),
        state: Joi.object().keys({
            id: Joi.string().optional().allow(""),
            name: Joi.string().allow(""),
            country_id: Joi.string().allow("")
        }),
        city: Joi.string().allow(""),
        postal: Joi.string()
            .optional()
            .allow(null, ""),
        addressLine1: Joi.string().allow(""),
        addressLine2: Joi.string().allow(""),
        deliveryNotes: Joi.string().allow("")
    },
    isShipping: Joi.boolean()
        .optional()
        .default(false),
    userId: Joi.string().required(),
    businessId: Joi.string().required(),
    internalNotes: Joi.string().allow("")
});