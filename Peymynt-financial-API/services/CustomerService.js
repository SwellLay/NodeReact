import { CustomerModel } from "../models/customer.model";
import StripeService from "./common/stripe.dal";
import { okResponse, errorResponse } from "../util/HttpResponse";
import { addCard, removeCard, getCard, getCards } from "./sales/card.dal";
import { HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_NOT_FOUND, NULL, HTTP_BAD_REQUEST } from "../util/constant";

const stripeService = new StripeService();

export const addCustomer = async (customerInput, user, businessId) => {
    let customer = new CustomerModel(customerInput);
    try {
        customer = await customer.save();
        return okResponse(HTTP_CREATED, { customer }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchCustomers = async businessId => {
    console.log("--------get customers services--------->", businessId);
    try {
        let customers = await CustomerModel.find({
            isActive: true,
            isDeleted: false,
            businessId: businessId
        })
            .populate("cards")
            .collation({ locale: "en" })
            .sort({ "customerName": 1 })
        return okResponse(HTTP_OK, { customers: customers.map(c => c.toUserJson()) }, "success");
    } catch (error) {
        console.log("====================================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchCustomerById = async id => {
    try {
        let customer = await CustomerModel.findById({ _id: id, isActive: true, isDeleted: false });
        if (!customer) {
            return errorResponse(HTTP_NOT_FOUND, error, "failed");
        }
        return okResponse(HTTP_OK, { customer: customer.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const updateCustomer = async (id, customerInput, user, businessId) => {
    try {
        let customer = await CustomerModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        if (!customer) {
            return errorResponse(HTTP_NOT_FOUND, NULL, "failed");
        }

        await customer.updateOne(customerInput);
        customer = await CustomerModel.findById(id);
        return okResponse(200, { customer: customer.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const deleteCustomer = async (id, user, businessId) => {
    try {
        let customer = await CustomerModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        if (!customer) {
            return errorResponse(500, true, "Customer not found to Delete");
        }
        await customer.updateOne({ isDeleted: true, isActive: false });

        return okResponse(200, { deleteCustomer: true }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

// Import customer from json array
export const insertCustomers = async (customers, userId, businessId) => {
    if (customers.length >= 1) {
        for (let customer of customers) {
            let customerObject = {
                customerName: customer.customerName,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                currency: customer.currency,
                communication: {
                    accountNumber: customer.accountNumber,
                    phone: customer.phone,
                    fax: customer.fax,
                    mobile: customer.mobile,
                    tollFree: customer.tollFree,
                    website: customer.website
                },
                addressBilling: {
                    country: customer.country,
                    state: customer.state,
                    city: customer.city,
                    postal: customer.postal,
                    addressLine1: customer.addressLine1,
                    addressLine2: customer.addressLine2
                },
                isShipping: false,
                userId: userId,
                businessId: businessId
            };
            let c = new CustomerModel(customerObject);
            await c.save();
        }
        return okResponse(200, null, 'Customer data imported successfully');
    } else {
        return errorResponse(500, null, 'There is no data to import');
    }
}

// Customer card specific code
export const initiateCardAddition = async (customerId, businessId) => {
    try {
        const setupIntent = await stripeService.createToken();
        if (setupIntent && setupIntent.client_secret)
            return okResponse(HTTP_OK, { initiateResponse: { clientSecret: setupIntent.client_secret, status: setupIntent.status } }, "Success");
        else
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, setupIntent, "Failed to establish secure connection");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const addCardToCustomer = async (customerId, cardInput, businessId) => {
    try {
        let customer = await CustomerModel.findById(customerId);
        if (!customer) {
            throw ("Failed to identify customer");
        }
        if (!customer.isActive) {
            throw ("Seems this customer is not active");
        }
        if (!customer.stripe || !customer.stripe.isConnected) {
            // Lets create stripe customer first
            console.log("Creating stripe customer first");
            customer = await stripeService.createCustomer(customer)
        }
        let card = await addCard(customerId, customer.stripe.customerId, businessId, cardInput);
        if (card == null) {
            return errorResponse(HTTP_BAD_REQUEST, null, "This card is already added to this customer");
        }
        console.log("card : ", card);
        customer.cardIds = customer.cardIds || customer.cardIds.length ? customer.cardIds : [];
        customer.cardIds.push(card.id);
        await customer.save();
        return okResponse(HTTP_CREATED, { card }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const removeCardFromCustomer = async (customerId, cardId, businessId) => {
    try {
        let card = await removeCard(cardId, customerId, businessId);
        if (card == null) {
            return okResponse(HTTP_BAD_REQUEST, null, "Seems this card doesn't exist");
        }
        await CustomerModel.findByIdAndUpdate(customerId, {
            $pull: { cardIds: cardId }
        })
        return okResponse(HTTP_OK, null, "Card removed successfully");

    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const getCardById = async (customerId, cardId, businessId) => {
    try {
        let card = await getCard(cardId, { businessId, customerId });
        if (card == null) {
            return okResponse(HTTP_BAD_REQUEST, null, "Seems this card doesn't exist");
        }
        return okResponse(HTTP_OK, { card }, "success");

    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const getCardsOfCustomer = async (customerId, businessId) => {
    try {
        let cards = await getCards(customerId, businessId);
        if (cards == null) {
            return okResponse(HTTP_OK, null, "No card available for this customer");
        }
        return okResponse(HTTP_OK, { cards }, "success");

    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const createPayment = async (customerId, businessId, paymentInput) => {
    try {
        const paymentIntent = await stripeService.createTokenWithPayment(paymentInput.amount, 'usd', paymentInput.saveCard)
        if (paymentIntent && paymentIntent.client_secret)
            return okResponse(HTTP_OK, { initiateResponse: { clientSecret: paymentIntent.client_secret, status: paymentIntent.status } }, "Success");
        else
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, setupIntent, "Failed to establish secure connection");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};