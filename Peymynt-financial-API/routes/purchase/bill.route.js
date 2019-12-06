import express from "express";
import { ensureAuthenticated } from "../../auth/JWTToken";
import { addBill, deleteBill, fetchBillById, fetchBills, updateBill, duplicateBill, fetchBillPayment, recordBillPayment, deleteBillPayment } from "../../services/purchase/bill.service";
import { errorResponse, okResponse } from "../../util/HttpResponse";
import { validate } from "../../util/utils";
import { BillSchema, BillPaymentSchema } from "../../validations/purchase/bill.validation";
const router = express.Router();

/* POST Creating Bill. */
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        let { billInput } = req.body;
        let { user, businessId } = req;
        // console.log("--------add bills services--------->" + JSON.stringify(billInput, null, 2));
        let [err, message] = await validate(billInput, BillSchema);
        if (err) {
            const validationError = errorResponse(500, err, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        billInput.userId = user._id;
        billInput.businessId = businessId;
        let data = await addBill(billInput);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* PUT Updating Bill. */
router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { billInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(billInput, BillSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await updateBill(
            req.params.id,
            billInput,
            businessId
        );
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }

});

/* DELETE Deleting Bill. */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { businessId } = req;
        let result = await deleteBill(req.params.id, businessId);
        console.log("==> result < ", result);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* GET Get all Bills. */
router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get bills--------->", req.businessId);
    let result = await fetchBills(req.businessId, req.query);
    res.status(result.statusCode).json(result);
});

/* GET/:id Getting one Bill. */
router.get("/:id", ensureAuthenticated, async (req, res) => {
    let result = await fetchBillById(req.params.id);
    res.status(result.statusCode).json(result);
});

// Get payments
router.get("/:id/payments", ensureAuthenticated, async (req, res) => {
    let result = await fetchBillPayment(req.params.id);
    res.status(result.statusCode).json(result);
});

// Add/update payment
router.put("/:id/payments", ensureAuthenticated, async (req, res) => {
    try {
        let { paymentInput } = req.body;
        let { businessId } = req;
        let [err, message] = await validate(paymentInput, BillPaymentSchema);
        if (err) {
            const validationError = errorResponse(500, err, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let data = await recordBillPayment(paymentInput, req.params.id, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.delete("/:id/payments", ensureAuthenticated, async (req, res) => {
    let result = await deleteBillPayment(req.params.id);
    res.status(result.statusCode).json(result);
});

router.get("/:id/duplicate", ensureAuthenticated, async (req, res) => {
    let { businessId } = req;
    let result = await duplicateBill(req.params.id, businessId);
    res.status(result.statusCode).json(result);
});




module.exports = router;
