const express = require('express');
const router = express.Router();
import Joi from "joi";
import { errorResponse } from "../util/HttpResponse";
import { fetchSalesSetting, addSalesSetting, updateSalesSetting, patchSalesSetting } from "../services/SalesService";
import { fetchPurchaseSetting, patchPurchaseSetting } from "../services/purchase/purchase.setting.service";
import { fetchPaymentSetting, patchPaymentSetting } from "../services/sales/payment.setting.service";
import { SalesSettingSchema } from '../validations/SalesSettingValidation';
import { ensureAuthenticated } from "../auth/JWTToken";

router.get("/sales", ensureAuthenticated, async (req, res) => {
    console.log("=======sales get routing ==> ");
    const result = await fetchSalesSetting(req.businessId);
    res.status(result.statusCode).json(result);
});

router.post("/sales", ensureAuthenticated, async (req, res) => {
    try {
        console.log("======= Create Sales ===> ");
        let { salesSettingInput } = req.body;
        try {
            await Joi.validate(salesSettingInput, SalesSettingSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        const result = await addSalesSetting(salesSettingInput, req.user, req.businessId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.patch("/sales", ensureAuthenticated, async (req, res) => {
    try {
        console.log("======= Patch Sales ===> ");
        let { salesSettingInput } = req.body;
        // try {
        //     await Joi.validate(salesSettingInput, SalesSettingSchema);
        // } catch (validationError) {
        //     console.log("----validation error------------> ", validationError);
        //     const { details } = validationError;
        //     const message = details.map(i => i.message).join(',');
        //     validationError = errorResponse(500, null, message);
        //     return res.status(validationError.statusCode).json(validationError);
        // }

        const result = await patchSalesSetting(salesSettingInput, req.user, req.businessId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.put("/sales/:id", ensureAuthenticated, async (req, res) => {
    console.log("=======countries routing=> ");
    let { salesSettingInput } = req.body;
    const result = await updateSalesSetting(req.params.id, req.body, req.businessId);
    res.status(result.statusCode).json(result);
});


// Purchase 
router.get("/purchase", ensureAuthenticated, async (req, res) => {
    console.log("=======purchase get routing ==> ");
    const result = await fetchPurchaseSetting(req.businessId, req.user);
    res.status(result.statusCode).json(result);
});

router.patch("/purchase", ensureAuthenticated, async (req, res) => {
    try {
        console.log("======= Patch Purchase ===> ");
        let { purchaseSettingInput } = req.body;
        const result = await patchPurchaseSetting(purchaseSettingInput, req.user, req.businessId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

// Payment
router.get("/payment", ensureAuthenticated, async (req, res) => {
    const result = await fetchPaymentSetting(req.businessId, req.user);
    res.status(result.statusCode).json(result);
});

router.patch("/payment", ensureAuthenticated, async (req, res) => {
    try {
        let { paymentSettingInput } = req.body;
        const result = await patchPaymentSetting(paymentSettingInput, req.user, req.businessId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});
module.exports = router;
