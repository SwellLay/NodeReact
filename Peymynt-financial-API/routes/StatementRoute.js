import express from "express";
import {
    fetchUnpaidStatement,
    fetchStatement,
    generateStatement,
    getPublicStatement
} from "../services/StatementService";
import { errorResponse } from "../util/HttpResponse";
import { ensureAuthenticated } from "../auth/JWTToken";
import { sendAccountStatementEmail } from "../util/mail";
import { validate, getFormattedError } from "../util/utils";
import { emailAccountStatementSchema } from '../validations/EmailValidation';
import Joi from "joi";

const router = express.Router();

router.post("/", ensureAuthenticated, async (req, res) => {
    console.log("body --------->", req.body);
    try {
        let { statementInput } = req.body;
        let { user, businessId } = req;
        if (!statementInput) {
            return res.status(400).json(errorResponse(400, "Please pass valid payload", true));
        }
        // try {
        //     let result = await Joi.validate(checkoutInput, CheckoutSchema);
        // } catch (validationError) {
        //     console.log("----validation error------------> ", validationError.details);
        //     validationError = errorResponse(500, null, validationError.details);
        //     return res.status(validationError.statusCode).json(validationError);
        // }
        let data;
        console.log('status', statementInput.scope)
        if (statementInput.scope == "unpaid")
            data = await fetchUnpaidStatement(businessId, statementInput.customerId, statementInput.startDate, statementInput.endDate);
        else
            data = await fetchStatement(businessId, statementInput.customerId, statementInput.startDate, statementInput.endDate);
        return res.status(data.statusCode).json(data);
    } catch (error) {
        console.log("e1 : " + error);
        return res.status(error.statusCode).json(error);
    }
});

router.post("/generate", ensureAuthenticated, async (req, res) => {
    console.log("body --------->", req.body);
    try {
        let { statementInput } = req.body;
        let { businessId } = req;
        if (!statementInput) {
            return res.status(400).json(errorResponse(400, "Please pass valid payload", true));
        }
        // try {
        //     let result = await Joi.validate(checkoutInput, CheckoutSchema);
        // } catch (validationError) {
        //     console.log("----validation error------------> ", validationError.details);
        //     validationError = errorResponse(500, null, validationError.details);
        //     return res.status(validationError.statusCode).json(validationError);
        // }
        const data = await generateStatement(businessId, statementInput);
        return res.status(data.statusCode).json(data);
    } catch (error) {
        console.log("e1 : " + error);
        return res.status(error.statusCode).json(error);
    }
});

// GET Public statement
router.get("/:uuid", async (req, res) => {
    try {
        let { uuid } = req.params;
        const data = await getPublicStatement(uuid);
        console.log("uuid : " + JSON.stringify(data));
        return res.status(data.statusCode).json(data);
    } catch (error) {
        console.log("e1 : " + error);
        return res.status(error.statusCode).json(error);
    }
});

//Send Account Statement Email
router.post('/:uuid/mail', ensureAuthenticated, async (req, res) => {
    try {
        let { emailInput } = req.body;
        let { uuid } = req.params;
        console.log(" --> sending an account statement email <--- " + uuid);

        if (!emailInput) {
            console.log(" INSIDE 1");
            let error = errorResponse(400, null, "Please provide emailInput");
            return res.status(error.statusCode).json(error);
        }

        let [err, message] = await validate(emailInput, emailAccountStatementSchema);
        if (err) {
            console.log(" --> sending an account statement email error <---");
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        
        const data = await getPublicStatement(uuid);
        const result = await sendAccountStatementEmail(emailInput, req.businessId, uuid, data);
        return res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

export default router;
