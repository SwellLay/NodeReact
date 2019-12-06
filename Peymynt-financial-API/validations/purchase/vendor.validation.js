import Joi from "joi";

export const VendorSchema = Joi.object().keys({
    vendorName: Joi.string()
        .min(1)
        .max(30)
        .required(),
    vendorType: Joi.string()
        .lowercase()
        .valid(["regular", "contractor"])
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
    accountNumber: Joi.number()
        .optional()
        .allow(""),
    currency: Joi.object()
        .keys({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
            symbol: Joi.string().optional(),
            displayName: Joi.string().optional()
        })
        .optional(),
    communication: Joi.object().keys({
        phone: Joi.string().allow(""),
        fax: Joi.string().allow(""),
        mobile: Joi.string().allow(""),
        tollFree: Joi.string().allow(""),
        website: Joi.string().allow("")
    }),
    address: {
        country: Joi.object().keys({
            id: Joi.number().optional().allow(""),
            name: Joi.string().allow(""),
            shortName: Joi.string().allow("")
        }),
        state: Joi.object().keys({
            id: Joi.string().optional().allow(""),
            name: Joi.string().allow(""),
            countryId: Joi.number().allow("")
        }),
        city: Joi.string().allow(""),
        postal: Joi.string()
            .optional()
            .allow(null, ""),
        addressLine1: Joi.string().allow(""),
        addressLine2: Joi.string().allow("")
    },
    contractor: {
        contractorType: Joi.string().valid(["individual", "business"]),
        ssn: Joi.string().allow(""),
        ein: Joi.number().allow("")
    }
});

export const VendorAccountSchema = Joi.object().keys({
    accountNumber: Joi.number().required(),
    displayName: Joi.string().allow(""),
    routingNumber: Joi.number().required(),
    bankName: Joi.string().allow(""),
    accountType: Joi.string().required().valid(["checking", "saving", "current"])
})