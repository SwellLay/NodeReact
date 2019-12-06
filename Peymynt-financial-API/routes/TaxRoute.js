import express from "express";
import { addTax, fetchTaxes, fetchTaxById } from "../services/TaxService";
import { TaxSchema } from '../validations/TaxValidation';
import { errorResponse } from "../util/HttpResponse";
import Joi from "joi";
import { ensureAuthenticated } from "../auth/JWTToken";
const router = express.Router();

router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        const { taxInput } = req.body;
        let { user, businessId } = req;
        if (!taxInput) {
            return res.status(400).json(errorResponse(400, undefined, "Please provide tax input"));
        }
        try {
            await Joi.validate(taxInput, TaxSchema);
        } catch (validationError) {
            console.log("----validation error-Tax POST-----------> ", validationError);
            validationError = errorResponse(500, undefined, validationError);
            return res.status(validationError.statusCode).json(validationError);
        }

        const tax = await addTax(taxInput, user, businessId);
        return res.status(tax.statusCode).json(tax);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* PUT Updating Tax. */
router.put("/", ensureAuthenticated, async (req, res) => {
    try {
        const { taxInput } = req.body;
        if (!taxInput) {
            return res.status(400).json(errorResponse(400, _, "Please provide tax input"));
        }
        try {
            await Joi.validate(taxInput, TaxSchema);
        } catch (validationError) {
            validationError = errorResponse(500, _, validationError);
            return res.status(validationError.statusCode).json(validationError);
        }

        const tax = await addTax(taxInput);
        return res.status(tax.statusCode).json(tax);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* DELETE Deleting Tax. */
router.delete("/", ensureAuthenticated, async (req, res) => {
    try {
        let { businessId } = req;
        res.send("DELETE :respond with a tax");
    } catch(error) {

    }
});

/* GET Get all Taxes. */
router.get("/", ensureAuthenticated, async (req, res) => {
    let {user , businessId} = req;
    let result = await fetchTaxes(user, businessId);
    res.status(result.statusCode).json(result);
});

/* GET/:id Getting one Tax. */
router.get("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { id } = req.params;
        if(!id) {
        }
        let tax = await fetchTaxById()
        res.send("GET :respond with a tax");
    } catch(error) {
        return res.status(error.statusCode).json(error);
    }
});

module.exports = router;
