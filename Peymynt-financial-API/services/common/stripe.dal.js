// import { PurchaseSettingModel } from "../../models/setting/purchase.setting.model";
let stripe;
import { CustomerModel } from '../../models/customer.model';
import {
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_OK,
    HTTP_NOT_FOUND,
    NULL,
    SUCCESS,
    OK,
    DELETE_SUCCESS,
    FAILED,
    HTTP_CONFLICT,
    HTTP_BAD_REQUEST
} from "../../util/constant";
import { CardModel } from "../../models/card.model";

class StripeService {

    constructor() {
        if (!stripe) {
            console.log("Initialising stripe");
            stripe = require("stripe")(process.env.STRIPE_KEY);
        } else {
            console.log("Using existing instance stripe");
        }
    }

    async createToken() {
        try {
            const setupIntent = await stripe.setupIntents.create({
                usage: 'off_session'
            })
            return setupIntent;
        } catch (error) {
            throw error;
        }
    };

    async createTokenWithPayment(amount, currency, saveCard) {
        try {
            let stripeObject = {
                amount: parseInt(amount * 100),
                currency: currency.toLowerCase(),
                setup_future_usage: saveCard ? 'off_session' : 'on_session'
            }
            const paymentIntent = await stripe.paymentIntents.create(stripeObject)
            console.log("paymentIntent", paymentIntent);
            return paymentIntent;
        } catch (error) {
            throw error;
        }
    };

    async attachCardToCustomer(stripeCustomerId, paymentMethodId) {
        try {
            const paymentMethod = await stripe.paymentMethods.attach(
                paymentMethodId,
                {
                    customer: stripeCustomerId,
                }
            );
            console.log('paymentMethod', paymentMethod);
            return paymentMethod;
        } catch (error) {
            throw error;
        }
    };

    async detachCardFromCustomer(paymentMethodId) {
        try {
            const paymentMethod = await stripe.paymentMethods.detach(
                paymentMethodId
            );
            console.log('paymentMethod detached', paymentMethod);
            return paymentMethod;
        } catch (error) {
            throw error;
        }
    };

    async chargeCardDirectly(amount, currency, customerId, cardId, isOffSession) {
        try {
            const customer = await CustomerModel.findById(customerId);
            const card = await CustomerModel.findOne({ customerId, _id: cardId });
            let stripeObject = {
                amount: parseInt(amount * 100),
                currency: currency.toLowerCase(),
                customer: customer.stripe.customerId,
                payment_method: card.stripe.paymentMethodId
            }
            if (isOffSession) {
                stripeObject.off_session = true;
                stripeObject.confirm = true;
                stripeObject.payment_method_types = ['card']
            }
            const paymentIntents = await stripe.paymentIntents.create(stripeObject)
            return paymentIntents;
        } catch (error) {
            throw error;
        }
    };

    async createCustomer(customer) {
        try {
            // Create new stripe account for this customer
            const stripeCustomer = await stripe.customers.create({
                email: customer.email,
                name: customer.customerName,
                phone: customer.phone
            });

            customer.stripe = {
                isConnected: true,
                customerId: stripeCustomer.id,
                rawResponse: JSON.stringify(stripeCustomer),
                createdOn: new Date()
            }
            await customer.save();
            return customer;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = StripeService;