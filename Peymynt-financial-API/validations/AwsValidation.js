import Joi from "joi";

export const s3SignedUrlSchema = Joi.object().keys({
    contentType: Joi.string().required(),
    uploadType: Joi.string().required()
        .allow("logo", "receipt", "invoice", "estimate", "statement"),
    fileName: Joi.string().required(),
});
