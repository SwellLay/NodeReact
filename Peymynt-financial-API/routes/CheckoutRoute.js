import express from "express";
import {
    fetchCheckouts,
    fetchCheckout,
    fetchPublicCheckout,
    deleteCheckout,
    addCheckout,
    updateCheckout
} from "../services/CheckoutService";
import { errorResponse } from "../util/HttpResponse";
import { ensureAuthenticated } from "../auth/JWTToken";
import Joi from "joi";
import { validate } from "../util/utils";
import { CheckoutSchema } from "../validations/CheckoutValidation";

const router = express.Router();

router.post("/", ensureAuthenticated, async (req, res) => {
    console.log("body --------->", req.body);
    try {
        let { checkoutInput } = req.body;
        let { user, businessId } = req;
        if (!checkoutInput) {
            return res
                .status(400)
                .json(errorResponse(400, "Please pass valid payload", true));
        }
        let [err, message] = await validate(checkoutInput, CheckoutSchema);
        if (err) {
            const validationError = errorResponse(500, err, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let data = await addCheckout(checkoutInput, user, businessId);
        return res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(data.statusCode).json(error);
    }
});

router.put("/:id", ensureAuthenticated, async (req, res) => {
    let { checkoutInput } = req.body;
    let { id } = req.params;
    let { user, businessId } = req;
    if (!id || !checkoutInput) {
        return res
            .status(400)
            .json(errorResponse(400, "Please pass valid payload", true));
    }

    let [err, message] = await validate(checkoutInput, CheckoutSchema);
    if (err) {
        const validationError = errorResponse(500, err, message);
        console.log("validationError ", validationError);
        return res.status(validationError.statusCode).json(validationError);
    }
    let result = await updateCheckout(id, checkoutInput, user, businessId);
    res.status(result.statusCode).json(result);
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
    try {
        console.log("----------------->", req.params);
        let result = await fetchCheckout(req.params.id, req.businessId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(error.statusCode).json(result);
    }
});

router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get all--------->", req.businessId);
    let result = await fetchCheckouts(req.businessId);
    res.status(result.statusCode).json(result);
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
    if (!req.params.id) {
        return res
            .status(400)
            .json(errorResponse(400, "Please pass valid ID", true));
    }
    let result = await deleteCheckout(req.params.id);
    res.status(result.statusCode).json(result);
});

router.get("/:uuid/public", async (req, res) => {
    try {
        console.log("----------------->", req.params);
        let result = await fetchPublicCheckout(req.params.uuid);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(error.statusCode).json(result);
    }
});

export default router;
