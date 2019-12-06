import { okResponse, errorResponse } from "../util/HttpResponse";
import { CheckoutModel } from '../models/checkout.model';
import { TaxModel } from '../models/tax.model';
import { getLegalBusiness } from '../services/PaymentService';

export const addCheckout = async (checkoutInput, user, businessId) => {
    try {
        if (checkoutInput.userId != null && checkoutInput.userId !== user._id) {
            return errorResponse(
                400,
                undefined,
                "Make sure you are passing correct User"
            );
        }
        //  Calculate total
        checkoutInput.total = checkoutInput.price;
        if (checkoutInput.taxes && checkoutInput.taxes.length) {
            const taxData = await TaxModel.find({
                _id: { $in: checkoutInput.taxes }
            })
            checkoutInput.taxes = taxData.map(t => {
                const taxCalculated = checkoutInput.price * t.rate / 100;
                checkoutInput.total += taxCalculated;
                return {
                    "id": t._id,
                    "name": t.name,
                    "abbreviation": t.abbreviation,
                    "rate": t.rate,
                    "taxCalculated": taxCalculated
                }
            })
        }
        console.log("taxData checkoutInput" + JSON.stringify(checkoutInput));
        let checkout = new CheckoutModel(checkoutInput);
        checkout = await checkout.save();
        return okResponse(201, { checkout }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const fetchCheckouts = async businessId => {
    try {
        const legalDetail = await getLegalBusiness(businessId);
        console.log("legalDetail : " + JSON.stringify(legalDetail));
        if (!legalDetail || legalDetail.statusCode != 200) {
            return errorResponse(351, null, "Seems payment is not enabled for this account");
        } else if (!legalDetail.data || !legalDetail.data.business || !legalDetail.data.business.isConnected) {
            return errorResponse(351, null, "Seems payment setup is not finished for this account");
        }
        let checkouts = await CheckoutModel.find({
            isDeleted: false,
            isActive: true,
            status: { $ne: 'Deleted' },
            businessId
        }).sort({ createdAt: -1 });
        return okResponse(200, { checkouts: checkouts.map(c => c.toList()) }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const fetchCheckout = async (id, businessId) => {
    try {
        let checkout = await CheckoutModel.findOne({
            _id: id,
            businessId,
            isActive: true,
            isDeleted: false
        })
            .populate({ path: 'businessId' });
        if (!checkout) {
            return errorResponse(404, undefined, "Checkout not found");
        }
        return okResponse(200, { checkout: await checkout.toCustomerJson() }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const fetchPublicCheckout = async (uuid) => {
    try {
        let checkout = await CheckoutModel.findOne({
            uuid: uuid,
        })
            .populate('businessId');
        if (!checkout) {
            return errorResponse(404, undefined, "Checkout not found");
        } else if (checkout.status != 'Online') {
            let publicCheckout = await checkout.toPublicJson();
            let formattedCheckout = {
                uuid: publicCheckout.uuid,
                business: publicCheckout.business,
                status: publicCheckout.status
            }
            return okResponse(200, { 'checkout': formattedCheckout }, "success");
        }
        console.log("public : " + JSON.stringify(checkout));
        return okResponse(200, { 'checkout': await checkout.toPublicJson() }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const updateCheckout = async (id, checkoutInput, user, businessId) => {
    try {
        let checkout = await CheckoutModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });

        if (!checkout) {
            return errorResponse(404, error, "Not found");
        }
        //  Calculate total
        checkoutInput.total = checkoutInput.price;
        if (checkoutInput.taxes && checkoutInput.taxes.length) {
            const taxData = await TaxModel.find({
                _id: { $in: checkoutInput.taxes }
            })
            checkoutInput.taxes = taxData.map(t => {
                const taxCalculated = checkoutInput.price * t.rate / 100;
                checkoutInput.total += taxCalculated;
                return {
                    "id": t._id,
                    "name": t.name,
                    "abbreviation": t.abbreviation,
                    "rate": t.rate,
                    "taxCalculated": taxCalculated
                }
            })
        }
        console.log("taxData checkoutInput" + JSON.stringify(checkoutInput));
        await checkout.updateOne(checkoutInput);
        checkout = await CheckoutModel.findById(id);
        return okResponse(200, { checkout }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const deleteCheckout = async id => {
    try {
        let item = await CheckoutModel.findById(id);
        if (!item) {
            return errorResponse(404, _, "Checkout not found");
        }

        await item.updateOne({ isDeleted: true, isActive: false });
        return okResponse(200, { deleteCheckout: true }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};
