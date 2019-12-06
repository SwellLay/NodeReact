import express from "express";
import { performRefund, getAllRefund, getRefundById, getRefundByPaymentId } from "../services/RefundService";
import { errorResponse } from "../util/HttpResponse";
import { ensureAuthenticated } from "../auth/JWTToken";
import Joi from "joi";

const router = express.Router();

router.post("/", ensureAuthenticated, async (req, res) => {
    const input = req.body.refundInput;
    let { businessId } = req;
    try {
        let refundResponse = await performRefund(input, businessId);
        return res.status(refundResponse.statusCode).json(refundResponse)
    } catch (error) {
        console.log("Error : " + error);
        return res.status(error.statusCode).json(error);
    }

});

router.get("/", ensureAuthenticated, async (req, res) => {
    let { businessId } = req;
    try {
        let refundResponse = await getAllRefund(businessId, req.query);
        return res.status(refundResponse.statusCode).json(refundResponse)
    } catch (error) {
        console.log("Error : " + error);
        return res.status(error.statusCode).json(error);
    }

});

router.get("/:id", ensureAuthenticated, async (req, res) => {
    let { businessId } = req;
    let id = req.params.id;
    try {
        let refundResponse = await getRefundById(id, businessId);
        return res.status(refundResponse.statusCode).json(refundResponse)
    } catch (error) {
        console.log("Error : " + error);
        return res.status(error.statusCode).json(error);
    }
});

router.get("/payments/:id", ensureAuthenticated, async (req, res) => {
    let { businessId } = req;
    let id = req.params.id;
    try {
        let refundResponse = await getRefundByPaymentId(id, businessId);
        return res.status(refundResponse.statusCode).json(refundResponse)
    } catch (error) {
        console.log("Error : " + error);
        return res.status(error.statusCode).json(error);
    }
});

export default router;
