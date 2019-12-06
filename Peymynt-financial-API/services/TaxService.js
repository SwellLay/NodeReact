import { okResponse, errorResponse } from "../util/HttpResponse";
import { TaxModel } from "../models/tax.model";

export const addTax = async (taxInput, user, businessId) => {
    try {
        if (!taxInput.businessId) {
            taxInput.businessId = businessId;
        }

        if (!taxInput.userId) {
            taxInput.userId = user._id;
        }
        let tax = new TaxModel(taxInput);
        tax = await tax.save();
        return okResponse(201, { tax }, "Tax saved successfully!");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const fetchTaxes = async (user, businessId) => {
    try {
        const taxes = await TaxModel.find({
            isActive: true,
            isDeleted: false,
            businessId
        });
        return okResponse(200, { taxes: taxes.map(t => t.toUserJson()) }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(500, error, "failed");
    }
};

export const fetchTaxById = async (id, businessId) => {
    try {
        const tax = await TaxModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: id,
            businessId
        });
        if (!tax) {
            return okResponse(404, null, "No Tax found");
        }
        return okResponse(200, { tax }, "OK");
    } catch (error) {
        console.log(error);
        return errorResponse(500, error, "failed");
    }
};

export const updateTax = async (id, taxInput, businessId) => {
    try {
        let tax = await TaxModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: id,
            businessId
        });
        if (!tax) {
            return okResponse(404, null, "No Tax found");
        }
        await tax.updateOne(taxInput);
        tax = await TaxModel.findById(id);
        return okResponse(201, { tax }, "Tax updated successfully!");
    } catch (error) {
        return errorResponse(500, error, "Failed to update tax");
    }
};

export const deleteTax = async (id, businessId) => {
    try {
        let tax = await TaxModel.findOne({
            isDeleted: false,
            isActive: true,
            _id: id,
            businessId
        });
        if (!tax) {
            return errorResponse(400, undefined, "No Tax found");
        }
        await tax.updateOne({ isDeleted: true, isActive: false });

        return okResponse(200, { deleteTax: true }, "Tax deleted successfully");
    } catch (error) {
        console.log(`Error in tax deletion ${error}`);
        return errorResponse(500, error, "Unable to process request");
    }
};
