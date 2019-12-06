import express from "express";
import { ensureAuthenticated } from "../auth/JWTToken";
import { addProduct, deleteProduct, fetchProduct, fetchProducts, updateProduct } from "../services/ProductService";
import { errorResponse } from "../util/HttpResponse";
import { ProductSchema } from "../validations/ProductValidation";
import { validate } from "../util/utils";
import { HTTP_BAD_REQUEST } from "../util/constant";

const router = express.Router();

router.post("/", ensureAuthenticated, async (req, res) => {
    console.log("body --------->", req.body);
    try {
        let { productInput } = req.body;
        let { user, businessId } = req;
        if (!productInput) {
            return res
                .status(400)
                .json(errorResponse(400, "Please pass valid payload", true));
        }

        let [err, message] = await validate(productInput, ProductSchema);

        if (err) {
            const validationError = errorResponse(500, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let data = await addProduct(productInput, user, businessId);
        return res.status(data.statusCode).json(data);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

router.put("/:id", ensureAuthenticated, async (req, res) => {
    try {
        let { productInput } = req.body;
        let { id } = req.params;
        let { user, businessId } = req;
        if (!id || !productInput) {
            return res
                .status(HTTP_BAD_REQUEST)
                .json(errorResponse(HTTP_BAD_REQUEST, "Please pass valid payload", true));
        }

        let [err, message] = await validate(productInput, ProductSchema);

        if (err) {
            const validationError = errorResponse(HTTP_BAD_REQUEST, null, message);
            return res.status(validationError.statusCode).json(validationError);
        }
        let result = await updateProduct(id, productInput, user, businessId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
    try {
        console.log("----------------->", req.params);
        let result = await fetchProduct(req.params.id, req.businessId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(error.statusCode).json(result);
    }
});

router.get("/", ensureAuthenticated, async (req, res) => {
    console.log("--------get all--------->", req.businessId);
    let { itemType } = req.query;
    let result = await fetchProducts(req.businessId, itemType);
    res.status(result.statusCode).json(result);
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
    if (!req.params.id) {
        return res
            .status(400)
            .json(errorResponse(400, "Please pass valid ID", true));
    }
    let result = await deleteProduct(req.params.id);
    res.status(result.statusCode).json(result);
});

export default router;
