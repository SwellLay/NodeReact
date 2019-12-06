import { CardModel } from "../../models/card.model";
import { getToday } from "../../util/utils";
import StripeService from "./../common/stripe.dal";
import CustomerModel from "./../../models/customer.model";
const stripeService = new StripeService();

export const addCard = async (customerId, stripeCustomerId, businessId, cardInput) => {
    let paymentMethod;
    try {

        paymentMethod = await stripeService.attachCardToCustomer(stripeCustomerId, cardInput.paymentMethodId);

        let cards = await findCards({
            customerId,
            "stripe.fingerprint": paymentMethod.card.fingerprint
        })
        // If card is already there then return null
        let card = null;
        if (!cards || cards.length < 1) {
            console.log("Creating new card detail");
            let cardDetail = {
                cardHolderName: cardInput.cardHolderName,
                brand: paymentMethod.card.brand,
                cardNumber: paymentMethod.card.last4,
                expiryMonth: paymentMethod.card.exp_month,
                expiryYear: paymentMethod.card.exp_year,
                postal: cardInput.postal,
                stripe: {
                    paymentMethodId: paymentMethod.id,
                    rawResponse: JSON.stringify(paymentMethod),
                    lastUpdatedOn: new Date(),
                    fingerprint: paymentMethod.card.fingerprint,
                },
                customerId: customerId,
                businessId: businessId
            }
            card = new CardModel(cardDetail);
            card = await card.save();
            card = card.toUserJson();
        }

        return card;
    } catch (error) {
        // Rollback
        if (paymentMethod && paymentMethod.id) {
            let detachResponse = await stripeService.detachCardFromCustomer(paymentMethod.id);
            console.log("card detached from customer due to error ", detachResponse);

            // Delete cards from db
            await CardModel.remove({ "stripe.paymentMethodId": paymentMethod.id })
            console.log("Card removed from db as well");
        }

        throw error;
    }
};

export const getCard = async (cardId, query, isInternal = false) => {
    try {
        let searchQuery = {
            ...query,
            ...{
                _id: cardId,
                isActive: true,
                isDeleted: false
            }
        }
        const card = await CardModel.findOne(searchQuery);
        if (card) {
            return isInternal ? card.toInternalJson() : card.toUserJson();
        }
        else return null;
    } catch (error) {
        throw error;
    }
};

export const findCards = async (query) => {
    try {
        let searchQuery = {
            ...query,
            ...{
                isActive: true,
                isDeleted: false
            }
        }
        const cards = await CardModel.find(searchQuery);
        if (cards && cards.length)
            return cards.map(c => c.toUserJson());
        else return null;
    } catch (error) {
        throw error;
    }
};

export const getCards = async (customerId, businessId) => {
    try {
        let cards = await CardModel.find({
            customerId,
            businessId,
            isActive: true,
            isDeleted: false
        });
        if (cards && cards.length)
            return cards.map(c => c.toUserJson());
        else return null;
    } catch (error) {
        throw error;
    }
};

// To be used internally
const updateCard = async (cardId, customerId, cardInput) => {
    try {
        let card = await CardModel.findOneAndUpdate({
            _id: cardId,
            customerId,
            isActive: true,
            isDeleted: false
        }, cardInput, { new: true })
        console.log('card update', card);
        return card;
    } catch (error) {
        throw error;
    }
};

export const removeCard = async (cardId, customerId) => {
    try {
        let card = await getCard(cardId, {}, true);
        console.log("card to be removed : ", card);

        if (card) {
            let detachResponse = await stripeService.detachCardFromCustomer(card.stripe.paymentMethodId);
            if (!detachResponse) {
                throw ({ message: "This card seems not associated with any account", detail: detachResponse });
            }
            const cardInput = {
                isActive: false,
                isDeleted: true,
                deletedAt: getToday(),
                "stripe.fingerprint": `xx-${card.stripe.fingerprint}`
            }
            card = await updateCard(cardId, customerId, cardInput);
            return card.toUserJson();
        }
        return null;
    } catch (error) {
        throw error;
    }
};