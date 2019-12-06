import express from "express";
import { ensureAuthenticated } from "../auth/JWTToken";
import {
    addCustomer, insertCustomers, deleteCustomer, fetchCustomerById,
    fetchCustomers, updateCustomer, getCardById, getCardsOfCustomer,
    removeCardFromCustomer, addCardToCustomer, initiateCardAddition,
    createPayment
} from "../services/CustomerService";
import { errorResponse, okResponse } from "../util/HttpResponse";
import { validate } from "../util/utils";
import { CustomerSchema } from "../validations/CustomerValidation";
const router = express.Router();

/* POST Creating Customer. */
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        let { customerInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(customerInput, CustomerSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let data = await addCustomer(customerInput, user, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.post("/import", ensureAuthenticated, async (req, res) => {
    try {
        let { customerImport } = req.body;
        let { user, businessId } = req;
        let data = await insertCustomers(customerImport, user, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* PUT Updating Customer. */
router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { customerInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(customerInput, CustomerSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await updateCustomer(
            req.params.id,
            customerInput,
            user,
            businessId
        );
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }

});

/* DELETE Deleting Customer. */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { user, businessId } = req;
        let result = await deleteCustomer(req.params.id, user, businessId);
        console.log("==> result < ", result);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* GET Get all Customers. */
router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get customers--------->", req.businessId);
    let result = await fetchCustomers(req.businessId);
    res.status(result.statusCode).json(result);
});

/* GET/:id Getting one Customer. */
router.get("/:id", ensureAuthenticated, async (req, res) => {
    let result = await fetchCustomerById(req.params.id);
    res.status(result.statusCode).json(result);
});

router.get("/:id/cards", ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await getCardsOfCustomer(req.params.id, businessId);
    res.status(result.statusCode).json(result);
});

router.get("/:id/cards/:cardId", ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await getCardById(req.params.id, req.params.cardId, businessId);
    res.status(result.statusCode).json(result);
});

router.delete("/:id/cards/:cardId", ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await removeCardFromCustomer(req.params.id, req.params.cardId, businessId);
    res.status(result.statusCode).json(result);
});

router.post("/:id/cards", ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await addCardToCustomer(req.params.id, req.body.cardInput, businessId);
    res.status(result.statusCode).json(result);
});

router.post("/:id/cards/initiate", ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await initiateCardAddition(req.params.id, businessId);
    res.status(result.statusCode).json(result);
});

router.post("/:id/cards/initiate2", ensureAuthenticated, async (req, res) => {
    let { user, businessId } = req;
    let result = await createPayment(req.params.id, businessId, req.body.paymentInput);
    res.status(result.statusCode).json(result);
});



module.exports = router;
