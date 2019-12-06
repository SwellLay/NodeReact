import express from "express";
import { ensureAuthenticated } from "../../auth/JWTToken";
import { getOverdueInvoices, getOverdueBills, getBankAccounts, getCashFlow, getProfitLoss, getOwing, getPayable, getNetIncome, getExpenseCategory } from "../../services/dashboard/dashboard.service";
const router = express.Router();

// Get overdue invoices
router.get("/overdue/invoices", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getOverdueInvoices(businessId, req.query);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

// Get overdue bills
router.get("/overdue/bills", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getOverdueBills(businessId, req.query);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


// Get bank accounts
router.get("/bank/accounts", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getBankAccounts(businessId, req.query);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


// Get cash flow
router.get("/cashflow", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getCashFlow(businessId, req.query);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


// Get profit loss
router.get("/profit", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getProfitLoss(businessId, req.query);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

// Get payable invoice
router.get("/payable/invoices", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getPayable(businessId, req.query);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

// Get owing bills
router.get("/owing/bills", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getOwing(businessId, req.query);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

// Get net income
router.get("/income", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getNetIncome(businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

// Get expense category
router.get("/expense/category", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let data = await getExpenseCategory(businessId, req.query);
        res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});


module.exports = router;
