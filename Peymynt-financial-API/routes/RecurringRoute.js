
import express from "express";
import Joi from "joi";
const router = express.Router();
import { ensureAuthenticated } from "../auth/JWTToken";
import { addRecurrence, updateInvoice, createLatestInvoiceNumber, removePayment, editInvoicePayment, updateReminder, deleteInvoice, fetchInvoices, patchInvoice, fetchStatusAmount, fetchRecurrenceById , fetchInvoiceCount, fromEstimateToInvoice, cloneInvoice, fetchInvoiceByUUID, paymentInvoice } from "../services/RecurringService";
import { RecurringSchema, ReminderSchema } from "../validations/RecurringValidation";
import { emailInvoiceSchema } from '../validations/EmailValidation';
import { PaymentSchema } from '../validations/PaymentValidation';
import { sendRecurringEmail, sendInvoiceReminderEmail, sendInvoiceReceipt } from "../util/mail";
import { errorResponse } from "../util/HttpResponse";
import { validate } from "../util/utils";

// /* POST Creating Recurring */
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        let { invoiceInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(invoiceInput, RecurringSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let data = await addRecurrence(invoiceInput, user, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* GET latestRecurringincremental number */
router.get('/createinvoicenumber', ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await createLatestInvoiceNumber(businessId, user);
    return res.status(result.statusCode).json(result);
});

/* GET/count/:status Getting Invoices count. */
router.get("/count", ensureAuthenticated, async (req, res) => {
    console.log("--------getRecurringcount--------->", req.query.status);
    let result = await fetchInvoiceCount(req.businessId, req.query);
    res.status(result.statusCode).json(result);
});

// For public view. No auth needed
router.get('/share/:uuid', async (req, res) => {
    let { uuid } = req.params;
    let result = await fetchInvoiceByUUID(uuid);
    return res.status(result.statusCode).json(result);
});

router.post("/:id/payment", ensureAuthenticated, async (req, res) => {
    try {
        let { paymentInput } = req.body;
        let { user, businessId } = req;
        let { id } = req.params;
        try {
            await Joi.validate(paymentInput, PaymentSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let [err, message] = await validate(productInput, ProductSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let data = await paymentInvoice(paymentInput, user, businessId, id);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.put("/:invoiceId/editPayment/:paymentId", ensureAuthenticated, async (req, res) => {
    try {
        let { paymentInput } = req.body;
        let { user, businessId } = req;
        let { invoiceId, paymentId } = req.params;
        try {
            await Joi.validate(paymentInput, PaymentSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            console.log(" -----------------> ", message);
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let data = await editInvoicePayment(paymentInput, user, businessId, { invoiceId, paymentId });
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});


/* PUT Updating Recurring */
router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { invoiceInput } = req.body;
        let { user, businessId } = req;
        try {
            await Joi.validate(invoiceInput, RecurringSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let result = await updateInvoice(
            req.params.id,
            invoiceInput,
            user,
            businessId
        );
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* SET REMINDER Recurring */
router.patch("/reminder/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { invoiceInput } = req.body;
        let { user, businessId } = req;
        try {
            await Joi.validate(invoiceInput, RecurringSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            console.log(" -----------------> ", message);
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let result = await updateReminder(
            req.params.id,
            invoiceInput,
            user,
            businessId
        );
        console.log("==> Update reminder result <=== ", result.statusCode);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

router.patch("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { invoiceInput } = req.body;
        let { businessId } = req;
        letRecurring= await patchInvoice(req.params.id, invoiceInput, businessId);
        return res.status(invoice.statusCode).json(invoice)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})


/* DELETE Deleting Recurring */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let result = await deleteInvoice(req.params.id, null, req.businessId);
        console.log("==> result < ", result);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* GET/:id Getting one Recurring */
router.get("/:id", ensureAuthenticated, async (req, res) => {
    let { businessId } = req;
    let result = await fetchRecurrenceById(req.params.id, businessId);
    res.status(result.statusCode).json(result);
});


/* GET Get all Recurring */
router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get recurring--------->", req.businessId);
    let result = await fetchInvoices(req.businessId, req.query);
    res.status(result.statusCode).json(result);
});

/* GET Get allRecurringstatus count */
router.get("/dashboard/statusCount", ensureAuthenticated, async (req, res) => {
    console.log("-------- getRecurringstatus amount --------->", req.businessId);
    let result = await fetchStatusAmount(req.businessId);
    res.status(result.statusCode).json(result);
});

/* RemoveRecurringPeymynt */
router.delete("/:invoiceId/payment/:paymentId", ensureAuthenticated, async (req, res) => {
    console.log("-------- RemoveRecurringPeymynt-------->");
    let inputId = {
        paymentId: req.params.paymentId,
        invoiceId: req.params.invoiceId
    }
    let result = await removePayment(inputId, req.businessId);
    res.status(result.statusCode).json(result);
});

router.post('/mail/:invoiceId', ensureAuthenticated, async (req, res) => {
    try {
        console.log(" --> sending an Recurringemail <---");
        let { emailInput } = req.body;
        if (!emailInput) {
            let error = errorResponse(400, null, "Please provide emailInput");
            return res.status(error.statusCode).json(error);
        }
        try {
            await Joi.validate(emailInput, emailInvoiceSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        const result = await sendRecurringEmail(emailInput, req.user, req.businessId, req.params.invoiceId);
        console.log("--result ", result.statusCode);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


router.post('/:invoiceId/reminder', ensureAuthenticated, async (req, res) => {
    try {
        console.log(" --> sending an Recurring reminder email <---");
        let { emailInput } = req.body;
        if (!emailInput) {
            let error = errorResponse(400, null, "Please provide emailInput");
            return res.status(error.statusCode).json(error);
        }
        try {
            await Joi.validate(emailInput, emailInvoiceSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        const result = await sendInvoiceReminderEmail(emailInput, req.user, req.businessId, req.params.invoiceId);
        console.log("--result --> ", result.statusCode);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

router.post('/:invoiceId/receipt/:paymentId', ensureAuthenticated, async (req, res) => {
    try {
        console.log(" --> Sending anRecurringreceipt <---");
        let { emailInput } = req.body;
        let { invoiceId, paymentId } = req.params;
        if (!emailInput) {
            let error = errorResponse(400, null, "Please provide emailInput");
            return res.status(error.statusCode).json(error);
        }
        try {
            await Joi.validate(emailInput, emailInvoiceSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        const result = await sendInvoiceReceipt(emailInput, req.user, req.businessId, { invoiceId, paymentId });
        console.log("--result --> ", result.statusCode);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


router.post('/payment/:invoiceId', ensureAuthenticated, async (req, res) => {
    try {
        console.log(" --> sending anRecurringpayment <---");
        let { invoiceInput } = req.body;
        if (!invoiceInput) {
            let error = errorResponse(400, null, "Please provide invoiceInput");
            return res.status(error.statusCode).json(error);
        }
        try {
            await Joi.validate(invoiceInput, RecurringSchema);
        } catch (validationError) {
            console.log("----validation error------------> ", validationError);
            const { details } = validationError;
            const message = details.map(i => i.message).join(',');
            validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        const result = await recordInvoicePayment(invoiceInput, req.user, req.businessId, req.params.invoiceId);
        console.log("--result ", result.statusCode);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


router.put('/clone/:id', ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await cloneInvoice(req.params.id, businessId, user);
    return res.status(result.statusCode).json(result);
});


module.exports = router;
