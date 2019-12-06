import Joi from "joi";

export const UserSchema = Joi.object().keys({
    email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
    firstName: Joi.string()
        .min(1)
        .max(50)
        .required(),
    lastName: Joi.string()
        .min(1)
        .max(50)
        .required(),
    password: Joi.string()
        .min(1)
        .required()
});

export const UserPatchSchema = Joi.object().keys({
    firstName: Joi.string()
        .min(1)
        .max(50),
    lastName: Joi.string()
        .min(1)
        .max(50),
    dateOfBirth: Joi.date(),
    address: Joi.object(),
    primaryBusiness: Joi.string()
});
