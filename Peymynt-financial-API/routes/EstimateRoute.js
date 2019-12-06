import express from "express";
import pdf from "html-pdf";
import { ensureAuthenticated } from "../auth/JWTToken";
import { addEstimate, exportEstimateToPdf, checkEstimateNumberExist, cloneEstimate, convertEstimate, createLatestEstimateNumber, createShareableLink, deleteEstimate, fetchEstimateById, fetchEstimateByUUID, fetchEstimates, updateEstimate } from "../services/EstimateService";
import { errorResponse } from "../util/HttpResponse";
import { sendEstimateEmail } from "../util/mail";
import { validate, getFormattedError } from "../util/utils";
import { emailInvoiceSchema } from '../validations/EmailValidation';
import { Estimateschema } from "../validations/EstimateValidation";
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR } from "../util/constant";
const router = express.Router();

router.put('/cloneestimate/:id', ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await cloneEstimate(req.params.id, businessId, user);
    return res.status(result.statusCode).json(result);
});

router.get('/createestimatenumber', ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await createLatestEstimateNumber(businessId, user);
    return res.status(result.statusCode).json(result);
});

router.get('/share/:uuid', async (req, res) => {
    let { uuid } = req.params;
    let result = await fetchEstimateByUUID(uuid);
    return res.status(result.statusCode).json(result);
});

router.get('/checkestimatenumber/:number', ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await checkEstimateNumberExist(req.params.number, businessId, user);
    return res.status(result.statusCode).json(result);
});

router.get('/share/:uuid/export', async (req, res) => {
    let { uuid } = req.params;
    console.log("hitting");
    exportEstimateToPdf(uuid)
        .then(pdf => {
            res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
            res.send(pdf);
        })
        .catch(e => {
            res.status(500).json(e);
        })
});

router.get("/craetelink/:id", ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await createShareableLink(req.params.id);
    return res.status(result.statusCode).json(result);
});

/* POST Creating Estimate. */
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        let { estimateInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(estimateInput, Estimateschema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let data = await addEstimate(estimateInput, user, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log("error -------------------################# ", error);
        return res.status(error.statusCode).json(error);
    }
});

/* PUT Updating Estimate. */
router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { estimateInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(estimateInput, Estimateschema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await updateEstimate(
            req.params.id,
            estimateInput,
            user,
            businessId
        );
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* DELETE Deleting Estimate. */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let result = await deleteEstimate(req.params.id, req.user, req.businessId);
        console.log("==> result < ", result);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


/* GET Get all Estimates. */
router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get estimates--------->", req.businessId);
    let { offset = 0, limit = 100, status, customer, startDate, endDate } = req.query;

    let result = await fetchEstimates(req.businessId, offset, limit, { status, customer, startDate, endDate });
    res.status(result.statusCode).json(result);
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await fetchEstimateById(req.params.id, user, businessId);
    res.status(result.statusCode).json(result);
});

router.post("/:estimateId/convert", ensureAuthenticated, async (req, res) => {
    let { estimateId } = req.params;
    let { businessId, user } = req;
    const result = await convertEstimate(estimateId, businessId, user);
    console.log("Resuult");
    console.log(result);
    res.status(result.statusCode).json(result);
})

router.post('/:estimateId/mail', ensureAuthenticated, async (req, res) => {
    try {
        let { emailInput } = req.body;
        if (!emailInput) {
            let error = errorResponse(HTTP_BAD_REQUEST, null, "Please provide emailInput");
            return res.status(error.statusCode).json(error);
        }

        let [err, message] = await validate(emailInput, emailInvoiceSchema);

        if (err) {
            const validationError = errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        const result = await sendEstimateEmail(emailInput, req.user, req.businessId, req.params.estimateId);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.log('error',error);
        return getFormattedError(res, error);
    }
});

module.exports = router;
