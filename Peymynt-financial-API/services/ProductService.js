import { okResponse, errorResponse } from "../util/HttpResponse";
import { ItemModel } from "../models/item.model";
import mongoose from "mongoose";
import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR, HTTP_CREATED, HTTP_BAD_REQUEST } from "../util/constant";

export const addProduct = async (productInput, user, businessId) => {
    try {
        console.log("add product -------->", productInput);
        if (!productInput.buy.allowed && !productInput.sell.allowed) {
            return errorResponse(HTTP_BAD_REQUEST, null, "Product must be marked as Sell or Buy");
        }
        let product = new ItemModel(productInput);
        product = await product.save();
        return okResponse(HTTP_CREATED, { product }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchProducts = async (businessId, itemType) => {
    try {
        let query = ItemModel.find({
            isActive: true,
            isDeleted: false,
            businessId: new mongoose.Types.ObjectId(businessId)
        })
        switch (itemType) {
            case "buy":
                query.where("buy.allowed").equals(true);
                break;
            case "sell":
                query.where("sell.allowed").equals(true);
                break;
            default:
                break;
        }
        query
            .collation({ locale: "en" })
            .sort({ "name": 1 })
            .populate({ path: "taxes", select: "name rate abbreviation" })
        let products = await query.exec();
        console.log("Products : " + products);
        return okResponse(HTTP_OK, { products: products.map(p => p.toCustomerJson()) }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchProduct = async (id, businessId) => {
    try {
        let product = await ItemModel.findOne({
            _id: id,
            businessId,
            isActive: true,
            isDeleted: false
        })
        // .populate({ path: "taxes", select: "name rate abbreviation" });
        if (!product) {
            return errorResponse(404, undefined, "Product not found");
        }
        return okResponse(200, { product: product.toCustomerJson() }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const updateProduct = async (id, productInput, user, businessId) => {
    try {
        let product = await ItemModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });

        if (!product) {
            return errorResponse(404, error, "Not found");
        }

        await product.updateOne(productInput);
        product = await ItemModel.findById(id);
        return okResponse(200, { product }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const deleteProduct = async id => {
    try {
        let item = await ItemModel.findById(id);
        if (!item) {
            return errorResponse(404, _, "Product not found");
        }

        await item.updateOne({ isDeleted: true, isActive: false });
        return okResponse(200, { deleteProduct: true }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};
