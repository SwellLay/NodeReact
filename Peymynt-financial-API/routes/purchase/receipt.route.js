import express from "express";
import { ensureAuthenticated } from "../../auth/JWTToken";
import { uploadReceipt, addReceipt, deleteReceipt, fetchReceiptById, fetchReceipts, updateReceipt, moveReceipt, patchReceipt } from "../../services/purchase/receipt.service";
import { errorResponse, okResponse } from "../../util/HttpResponse";
import { validate } from "../../util/utils";
import { ReceiptSchema } from "../../validations/purchase/receipt.validation";
import { HTTP_INTERNAL_SERVER_ERROR } from "../../util/constant";
const router = express.Router();

router.post("/upload", ensureAuthenticated, async (req, res) => {
    try {
        // let { receiptInput } = req.body;
        let { user, businessId } = req;
        // // console.log("--------add receipt services--------->" + JSON.stringify(receiptInput, null, 2));
        // let [err, message] = await validate(receiptInput, ReceiptSchema);
        // if (err) {
        //     const validationError = errorResponse(500, err, message);
        //     return res.status(validationError.statusCode).json(validationError);
        // }
        const receiptInput = {
            userId: user._id,
            businessId: businessId
        }
        let data = await uploadReceipt(req, res, receiptInput);
        // console.log("UPload receipt ok resp ", data);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log("UPload receipt error resp ", error);
        if (!error || !error.statusCode) {
            error = {
                statusCode: HTTP_INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
        }
        return res.status(error.statusCode).json(error);
    }
});

/* POST Creating Receipt. */
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        let { receiptInput } = req.body;
        let { user, businessId } = req;
        // console.log("--------add receipt services--------->" + JSON.stringify(receiptInput, null, 2));
        let [err, message] = await validate(receiptInput, ReceiptSchema);
        if (err) {
            const validationError = errorResponse(500, err, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        receiptInput.userId = user._id;
        receiptInput.businessId = businessId;
        let data = await addReceipt(receiptInput);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* PUT Updating Receipt. */
router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { receiptInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(receiptInput, ReceiptSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await updateReceipt(
            req.params.id,
            receiptInput,
            businessId
        );
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }

});

router.patch("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { receiptInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(receiptInput, ReceiptSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await patchReceipt(
            req.params.id,
            receiptInput,
            businessId
        );
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }

});

/* DELETE Deleting Receipt. */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { businessId } = req;
        let result = await deleteReceipt(req.params.id, businessId);
        console.log("==> result < ", result);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* GET Get all Receipt. */
router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get receipt--------->", req.businessId);
    let result = await fetchReceipts(req.businessId, req.query);
    res.status(result.statusCode).json(result);
});

/* GET/:id Getting one Receipt. */
router.get("/:id", ensureAuthenticated, async (req, res) => {
    let result = await fetchReceiptById(req.params.id);
    res.status(result.statusCode).json(result);
});

// Move receipt to other business
router.put("/:receiptId/move/businesses/:newBusinessId", ensureAuthenticated, async (req, res) => {
    try {
        let { businessId } = req;
        let { receiptId, newBusinessId } = req.params;
        let data = await moveReceipt(receiptId, businessId, newBusinessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});
module.exports = router;
