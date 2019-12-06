const express = require("express");
const router = express.Router();
import { generateUrl } from "../util/aws";
import { okResponse, errorResponse } from "../util/HttpResponse";
import { ensureAuthenticated } from "../auth/JWTToken";
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_BAD_REQUEST } from "../util/constant";
import { validate } from "../util/utils";
import { s3SignedUrlSchema } from "../validations/AwsValidation";

router.post("/signedurl", ensureAuthenticated, async (req, res) => {
  try {
    let { s3Input } = req.body;
    let [err, message] = await validate(s3Input, s3SignedUrlSchema);
    if (err) {
      const validationError = errorResponse(HTTP_BAD_REQUEST, err, message);
      return res.status(validationError.statusCode).json(validationError);
    }
    let { businessId } = req;

    let s3Response = await generateUrl(businessId, s3Input);
    let result = await okResponse(HTTP_OK, { signedUrl: s3Response }, "Successful");
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.log(`Error occurred during signed url ${error}`);
    let result = await errorResponse(HTTP_INTERNAL_SERVER_ERROR, true, "Failed");
    return res.status(result.statusCode).json(result);
  }
});

module.exports = router;
