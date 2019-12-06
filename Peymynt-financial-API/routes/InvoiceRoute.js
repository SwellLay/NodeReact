import express from "express";
import { ensureAuthenticated } from "../auth/JWTToken";
import { addInvoice, cloneInvoice, exportInvoiceToPdf, convertInvoice, createLatestInvoiceNumber, deleteInvoice, editInvoicePayment, fetchInvoiceById, fetchInvoiceByUUID, fetchInvoiceCount, fetchInvoices, fetchStatusAmount, patchInvoice, paymentInvoice, removePayment, updateInvoice, updateReminder, fetchInvoicePayments } from "../services/InvoiceService";
import { errorResponse, errorFormatter } from "../util/HttpResponse";
import { sendInvoiceEmail, sendInvoiceReceipt, sendInvoiceReminderEmail } from "../util/mail";
import { validate, getFormattedError } from "../util/utils";
import { emailInvoiceSchema } from '../validations/EmailValidation';
import { InvoiceSchema, ReminderSchema } from "../validations/InvoiceValidation";
import { PaymentByCashSchema, PaymentByCardSchema } from '../validations/PaymentValidation';
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR } from "../util/constant";
var _ = require('lodash/core');
const router = express.Router();


/* GET latest invoice incremental number */
router.get('/createinvoicenumber', ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await createLatestInvoiceNumber(businessId, user);
    return res.status(result.statusCode).json(result);
});

/* GET/count/:status Getting Invoices count. */
router.get("/count", ensureAuthenticated, async (req, res) => {
    console.log("--------get invoice count--------->", req.query.status);
    let result = await fetchInvoiceCount(req.businessId, req.query);
    res.status(result.statusCode).json(result);
});


/* POST Creating Invoice. */
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        let { invoiceInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(invoiceInput, InvoiceSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let data = await addInvoice(invoiceInput, user, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

// Get all invoice payments (with refunds merged into it)
router.get("/:id/payments", ensureAuthenticated, async (req, res) => {
    let { businessId } = req;
    let result = await fetchInvoicePayments(req.params.id, businessId);
    res.status(result.statusCode).json(result);
});
router.post("/:id/payment", ensureAuthenticated, async (req, res) => {
    try {
        let { paymentInput } = req.body;
        let { user, businessId } = req;
        let { id } = req.params;

        let err; let message;
        if (paymentInput.method == 'manual') {
            [err, message] = await validate(paymentInput, PaymentByCashSchema);
        } else if (paymentInput.method == 'card') {
            [err, message] = await validate(paymentInput, PaymentByCardSchema);
        } else if (paymentInput.method == 'bank') {
            [err, message] = await validate(paymentInput, PaymentByBankSchema);
        } else {
            return errorResponse(HTTP_BAD_REQUEST, null, "Provided payment method is not supported");
        }

        if (err) {
            const validationError = errorResponse(HTTP_BAD_REQUEST, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        paymentInput.businessId = businessId;
        paymentInput.invoiceId = id;
        paymentInput.userId = user;
        let data = await paymentInvoice(paymentInput, user, businessId, id);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return errorFormatter(res, error);
    }
});

// Deprecated. Only being used by recurring which doesn't make sense
router.put("/:invoiceId/editPayment/:paymentId", ensureAuthenticated, async (req, res) => {
    try {
        let { paymentInput } = req.body;
        let { user, businessId } = req;
        let { invoiceId, paymentId } = req.params;

        let [err, message] = await validate(paymentInput, PaymentByCashSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let data = await editInvoicePayment(paymentInput, user, businessId, { invoiceId, paymentId });
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.put("/:invoiceId/payments/:paymentId", ensureAuthenticated, async (req, res) => {
    try {
        let { paymentInput } = req.body;
        let { user, businessId } = req;
        let { invoiceId, paymentId } = req.params;

        let [err, message] = await validate(paymentInput, PaymentByCashSchema);

        if (err) {
            const validationError = errorResponse(HTTP_BAD_REQUEST, err, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        paymentInput.businessId = businessId;
        paymentInput.userId = user;
        paymentInput.invoiceId = invoiceId;
        paymentInput.paymentId = paymentId;
        let data = await editInvoicePayment(paymentInput, user, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return getFormattedError(res, error);
    }
});


/* PUT Updating Invoice. */
router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { invoiceInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(invoiceInput, InvoiceSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
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

/* SET REMINDER Invoice. */
router.patch("/reminder/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { reminderInput } = req.body;
        let { user, businessId } = req;
        let [err, message] = await validate(reminderInput, ReminderSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await updateReminder(
            req.params.id,
            reminderInput,
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
        if (invoiceInput.onlinePayments) {
            if (invoiceInput.onlinePayments.systemEnabled || invoiceInput.onlinePayments.businessEnabled) {
                const validationError = errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "systemEnabled & businessEnabled are system flags and can't be updated");
                return res.status(validationError.statusCode).json(validationError);
            }
        }
        let invoice = await patchInvoice(req.params.id, invoiceInput, businessId);
        return res.status(invoice.statusCode).json(invoice)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})


/* DELETE Deleting Invoice. */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let result = await deleteInvoice(req.params.id, null, req.businessId);
        console.log("==> result < ", result);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* GET/:id Getting one Invoice. */
router.get("/:id", ensureAuthenticated, async (req, res) => {
    let { businessId } = req;
    let result = await fetchInvoiceById(req.params.id, businessId);
    res.status(result.statusCode).json(result);
});


/* GET Get all Invoice. */
router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get invoice--------->", req.businessId);
    let result = await fetchInvoices(req.businessId, req.query);
    res.status(result.statusCode).json(result);
});

/* GET Get all Invoice status count */
router.get("/dashboard/statusCount", ensureAuthenticated, async (req, res) => {
    console.log("-------- get invoice status amount --------->", req.businessId);
    let result = await fetchStatusAmount(req.businessId);
    res.status(result.statusCode).json(result);
});

/* Remove Invoice Peymynt */
router.delete("/:invoiceId/payment/:paymentId", ensureAuthenticated, async (req, res) => {
    console.log("-------- Remove invoice Peymynt-------->");
    let inputId = {
        paymentId: req.params.paymentId,
        invoiceId: req.params.invoiceId
    }
    try {
        let result = await removePayment(inputId, req.businessId);
        res.status(result.statusCode).json(result);
    } catch (e) {
        return getFormattedError(res, e);
    }
});

router.post('/:invoiceId/mail', ensureAuthenticated, async (req, res) => {
    try {
        console.log(" --> sending an invoice email <---");
        let { emailInput } = req.body;
        if (!emailInput) {
            let error = errorResponse(400, null, "Please provide emailInput");
            return res.status(error.statusCode).json(error);
        }

        let [err, message] = await validate(emailInput, emailInvoiceSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        const result = await sendInvoiceEmail(emailInput, req.user, req.businessId, req.params.invoiceId);
        console.log("--result ", result.statusCode);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


router.post('/:invoiceId/reminder', ensureAuthenticated, async (req, res) => {
    try {
        console.log(" --> sending an invoice reminder email <---");
        let { emailInput } = req.body;
        if (!emailInput) {
            let error = errorResponse(400, null, "Please provide emailInput");
            return res.status(error.statusCode).json(error);
        }

        let [err, message] = await validate(emailInput, emailInvoiceSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
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
        console.log(" --> Sending an invoice receipt <---");
        let { emailInput } = req.body;
        let { invoiceId, paymentId } = req.params;
        if (!emailInput) {
            let error = errorResponse(400, null, "Please provide emailInput");
            return res.status(error.statusCode).json(error);
        }

        let [err, message] = await validate(emailInput, emailInvoiceSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        const result = await sendInvoiceReceipt(emailInput, req.user, req.businessId, { invoiceId, paymentId });
        console.log("--result --> ", result.statusCode);
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

router.post("/:estimateId/convert", ensureAuthenticated, async (req, res) => {
    console.log("convert Invoice to recurring --->")
    let { estimateId } = req.params;
    let { businessId, user } = req;
    const result = await convertInvoice(estimateId, businessId, user);
    console.log("Result of invoice to rercurring ---->", result.data);
    res.status(result.statusCode).json(result);
})

// For public view. No auth needed
router.get('/share/:uuid', async (req, res) => {
    let { uuid } = req.params;
    let result = await fetchInvoiceByUUID(uuid);
    return res.status(result.statusCode).json(result);
});

router.get('/share/:uuid/export', async (req, res) => {
    let { uuid } = req.params;
    console.log("hitting");
    exportInvoiceToPdf(uuid)
        .then(pdf => {
            res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
            res.send(pdf);
        })
        .catch(e => {
            res.status(500).json(e);
        })
});


module.exports = router;
