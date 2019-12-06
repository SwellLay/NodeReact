import express from "express";
import { ensureAuthenticated } from "../../auth/JWTToken";
import { addVendor, deleteVendor, insertVendors, fetchVendorById, fetchVendors, updateVendor, fetchVendorAccount, updateVendorAccount } from "../../services/purchase/vendor.service";
import { errorResponse, okResponse } from "../../util/HttpResponse";
import { validate } from "../../util/utils";
import { VendorSchema, VendorAccountSchema } from "../../validations/purchase/vendor.validation";
const router = express.Router();

/* POST Creating Vendor. */
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        let { vendorInput } = req.body;
        let { user, businessId } = req;
        // console.log("--------add vendors services--------->" + JSON.stringify(vendorInput, null, 2));
        let [err, message] = await validate(vendorInput, VendorSchema);
        if (err) {
            const validationError = errorResponse(500, err, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        vendorInput.userId = user._id;
        vendorInput.businessId = businessId;
        let data = await addVendor(vendorInput);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});

// Import vendors
router.post("/import", ensureAuthenticated, async (req, res) => {
    try {
        let { vendorImport } = req.body;
        let { user, businessId } = req;
        let data = await insertVendors(vendorImport, user, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});


/* PUT Updating Vendor. */
router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { vendorInput } = req.body;
        let { user, businessId } = req;

        let [err, message] = await validate(vendorInput, VendorSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }

        let result = await updateVendor(
            req.params.id,
            vendorInput,
            businessId
        );
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }

});

/* DELETE Deleting Vendor. */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { businessId } = req;
        let result = await deleteVendor(req.params.id, businessId);
        console.log("==> result < ", result);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

/* GET Get all Vendors. */
router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get vendors--------->", req.businessId);
    let result = await fetchVendors(req.businessId);
    res.status(result.statusCode).json(result);
});

/* GET/:id Getting one Vendor. */
router.get("/:id", ensureAuthenticated, async (req, res) => {
    let result = await fetchVendorById(req.params.id);
    res.status(result.statusCode).json(result);
});

// Get account
router.get("/:id/accounts", ensureAuthenticated, async (req, res) => {
    let result = await fetchVendorAccount(req.params.id);
    res.status(result.statusCode).json(result);
});

// Add/update account
router.put("/:id/accounts", ensureAuthenticated, async (req, res) => {
    try {
        let { accountInput } = req.body;
        let { businessId } = req;
        let [err, message] = await validate(accountInput, VendorAccountSchema);
        if (err) {
            const validationError = errorResponse(500, err, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let data = await updateVendorAccount(accountInput, req.params.id, businessId);
        res.status(data.statusCode).json(data);
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json(error);
    }
});




module.exports = router;
