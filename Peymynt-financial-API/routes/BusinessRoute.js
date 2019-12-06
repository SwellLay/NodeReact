import express from "express";
import { ensureAuthenticated } from "../auth/JWTToken";
import { addBusiness, restoreBusiness, fetchArchivedBusiness, businessCountries, deleteBusiness, fetchBusinessById, fetchBusinesses, patchBusiness, updateBusiness } from "../services/BusinessService";
import { errorResponse } from "../util/HttpResponse";
import { validate } from "../util/utils";
import { BusinessSchema } from "../validations/BusinessValidation";
const router = express.Router();

/* POST Creating Business. */
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        const { businessInput } = req.body;
        const { user } = req;
        if (!businessInput) {
            console.log(`Business input not provided`);
            return res
                .status(400)
                .json(errorResponse(400, undefined, "Please provide businessInput | Bad request"));
        }

        let [err, message] = await validate(businessInput, BusinessSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await addBusiness(businessInput, user);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* PUT Updating Business. */
router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        const { businessInput } = req.body;
        const { user } = req;
        if (!businessInput) {
            console.log(`Business input not provided`);
            return res
                .status(400)
                .json(errorResponse(400, undefined, "Please provide businessInput | Bad request"));
        }

        let [err, message] = await validate(businessInput, BusinessSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await updateBusiness(req.params.id, businessInput, user);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* DELETE Deleting Business. */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            console.log(`Business id not provided`);
            return res
                .status(400)
                .json(errorResponse(400, _, "Please provide business ID | Bad request"));
        }

        let result = await deleteBusiness(id);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* GET Get all Businesss. */
router.get("/", ensureAuthenticated, async (req, res) => {
    try {
        const { user } = req;
        console.log(" -------- User in get --------");
        let result = await fetchBusinesses(user);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.get("/countries", ensureAuthenticated, async (req, res) => {
    try {
        const data = await businessCountries();
        return res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

/* GET/:id Getting one Business. */
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            console.log(`Business ID not provided`);
            return res
                .status(400)
                .json(errorResponse(400, _, "Please provide business ID | Bad request"));
        }

        let result = await fetchBusinessById(id);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});


router.patch("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { businessInput } = req.body;
        let businessId = req.params.id;
        let business = await patchBusiness(businessInput, businessId);
        return res.status(business.statusCode).json(business)
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
})

/* GET Get all archived business. */
router.get("/list/archived", ensureAuthenticated, async (req, res) => {
    try {
        const { user } = req;
        let result = await fetchArchivedBusiness(user);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

router.patch("/:id/restore", ensureAuthenticated, async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;
        let result = await restoreBusiness(id, user);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

module.exports = router;
