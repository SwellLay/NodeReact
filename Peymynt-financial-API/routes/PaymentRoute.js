import express from "express";
import {
    patchBusiness,
    getLegalBusiness,
    deleteLegalBusiness,
    chargeCheckout,
    verifyBusiness,
    getAllOnlinePayments,
    getPaymentById,
    payInvoicePublic,
    getAccountBalance,
    payByBank,
    getListOfBanks
} from "../services/PaymentService";
import { refund } from "../services/RefundService";
import { getPaymentSettings, updatePaymentSettings } from '../services/paymentSettings';
import { errorResponse } from "../util/HttpResponse";
import { ensureAuthenticated } from "../auth/JWTToken";
import Joi from "joi";
import { validate } from "../util/utils";
import { CheckoutChargeSchema } from "../validations/CheckoutValidation";
import { PaymentByCardPublicSchema, PaymentByBankPublicSchema, PaymentBySavedCardPublicSchema, paymentTosSchema } from "../validations/PaymentValidation";
import { HTTP_BAD_REQUEST } from "../util/constant";

const router = express.Router();

router.post("/verify", ensureAuthenticated, async (req, res) => {
    const input = req.body.paymentInput;
    let { businessId } = req;
    try {
        if (input.tosAcceptance) {
            await Joi.validate(input.tosAcceptance, paymentTosSchema);
        } else {
            let validationError = errorResponse(HTTP_BAD_REQUEST, null, "Input request not well formatted");
            return res.status(validationError.statusCode).json(validationError);
        }
        let businessOutput = await verifyBusiness(input, businessId);
        console.log('businessOutput : ' + JSON.stringify(businessOutput));
        return res.status(businessOutput.statusCode).json(businessOutput)
    } catch (validationError) {
        console.log("Error : " + validationError);
        let message = "Failed to verify account. If problem persists, contact support";
        if (validationError.type == 'StripeInvalidRequestError') {
            message = validationError.message;
        }
        validationError = errorResponse(HTTP_BAD_REQUEST, validationError, message);
        return res.status(validationError.statusCode).json(validationError);
    }

});

router.post("/checkout/charge", async (req, res) => {
    try {
        let { checkoutInput } = req.body;
        let [err, message] = await validate(checkoutInput, CheckoutChargeSchema);

        if (err) {
            const validationError = errorResponse(HTTP_BAD_REQUEST, err, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let checkoutResponse = await chargeCheckout(checkoutInput);
        return res.status(checkoutResponse.statusCode).json(checkoutResponse)
    } catch (error) {
        console.log("error", error);
        return res.status(error.statusCode).json(error);
    }

});

router.patch("/onboarding", ensureAuthenticated, async (req, res) => {
    try {
        let { businessInput } = req.body;
        let { businessId } = req;
        let business = await patchBusiness(businessInput, businessId);
        return res.status(business.statusCode).json(business)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})

router.get("/onboarding", ensureAuthenticated, async (req, res) => {
    try {
        let { businessId } = req;
        let business = await getLegalBusiness(businessId);
        return res.status(business.statusCode).json(business)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})

router.get("/", ensureAuthenticated, async (req, res) => {
    try {
        let { businessId } = req;
        let payments = await getAllOnlinePayments(businessId, req.query);
        return res.status(payments.statusCode).json(payments)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})

router.get("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { id } = req.params;
        let { businessId } = req;
        let payment = await getPaymentById(businessId, id);
        return res.status(payment.statusCode).json(payment)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})

router.delete("/onboarding", ensureAuthenticated, async (req, res) => {
    try {
        let { businessId } = req;
        let business = await deleteLegalBusiness(businessId);
        return res.status(business.statusCode).json(business)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})

router.post("/invoice/charge", async (req, res) => {
    try {
        let { paymentInput } = req.body;
        switch (paymentInput.method) {
            case "card":
                const cardSchemaToValidate = paymentInput.cardId ? PaymentBySavedCardPublicSchema : PaymentByCardPublicSchema;
                let [err, message] = await validate(paymentInput, cardSchemaToValidate);
                if (err) {
                    const validationError = errorResponse(HTTP_BAD_REQUEST, err, message);
                    return res.status(validationError.statusCode).json(validationError);
                }
                break;
            case "bank":
                let [bankErr, bankMessage] = await validate(paymentInput, PaymentByBankPublicSchema);
                if (bankErr) {
                    const validationError = errorResponse(HTTP_BAD_REQUEST, bankErr, bankMessage);
                    return res.status(validationError.statusCode).json(validationError);
                }
                break;
            default:
                invoiceResponse.statusCode(HTTP_BAD_REQUEST);
                invoiceResponse.json({ "message": "Invalid payment method" });
        }
        const invoiceResponse = await payInvoicePublic(paymentInput);
        return res.status(invoiceResponse.statusCode).json(invoiceResponse)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }

});

router.post("/accounts/balance", async (req, res) => {
    try {
        let { accountInput } = req.body;
        let accounts = await getAccountBalance(accountInput.publicToken, accountInput.institutionId);
        return res.status(accounts.statusCode).json(accounts)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})

router.get("/banks/getListOfBanks", async (req, res) => {
    try {
        let banks = await getListOfBanks();
        console.log("banks", banks)
        return res.status(200).json(banks)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})

router.post('/paymentSettings', async (req, res) => {
    try {
        let settings = await getPaymentSettings(req.body.userId);
        res.status(200).json(settings);
    } catch (error){
        console.log(error)
    }
})

router.post('/paymentSettings/update', async (req, res) => {
    try {
        let settings = await updatePaymentSettings(req.body);
        res.status(200).json(settings);
    } catch (error){
        console.log(error)
    }
})

export default router;
