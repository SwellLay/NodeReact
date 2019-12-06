import { okResponse, errorResponse } from "../util/HttpResponse";
import { LegalModel } from '../models/legal.model';
import { OrganizationModel } from '../models/organization.model';
import { CheckoutModel } from '../models/checkout.model';
import { InvoiceModel } from '../models/invoice.model';
import { PaymentModel } from '../models/payment.model';
import { updateInvoicePayment } from '../services/InvoiceService';
import { performRefund } from '../services/RefundService';
import { getCard } from "./sales/card.dal";
import moment from "moment";

let stripe = require("stripe")(process.env.STRIPE_KEY);
const plaid = require('plaid');
const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    process.env.PLAID_ENV != 'production' ? plaid.environments.sandbox : plaid.environments.production,
    {
        version: process.env.PLAID_VERSION,
        PLAID_COUNTRY_CODES: 'US,UK, CA, GB, FR, ES'
    });

import {
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_OK,
    OK,
    HTTP_NOT_FOUND,
    NULL,
    SUCCESS,
    DELETE_SUCCESS,
    FAILED,
    HTTP_CONFLICT,
    HTTP_BAD_REQUEST
} from "../util/constant";
import { getFormattedError, getEndDateWithTime } from '../util/utils';
import { fetchCustomerById } from "../services/CustomerService";
import { RefundModel } from '../models/refund.model';

export const patchBusiness = async (businessInput, businessId) => {
    try {
        let legal = await LegalModel.findOne({ businessId: businessId });
        if (!legal) {
            // Lets create one
            let business = await OrganizationModel.findOne({ _id: businessId, isActive: true, isDeleted: false });
            if (!business) {
                return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
            }
            // TODO Need to maintain country shorthand on model during creation of business. 
            // In order to handle this country hard coded value
            legal = new LegalModel({
                businessId: business._id,
                address: business.address,
                currency: business.currency.code,
                country: "US"
            })
            await legal.save();
        }
        // Clear owner if business type changes
        console.log("legal.businessType", legal.businessType)
        console.log("businessInput.businessType", businessInput.businessType);
        if (legal.businessType !== businessInput.businessType) {
            console.log("business type changed");
            businessInput.owners = [];
        }
        await legal.updateOne(businessInput);
        legal = await LegalModel.findOne({ businessId: businessId });
        return okResponse(HTTP_OK, { business: legal.toUserJson() }, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const verifyBusiness = async (businessInput, businessId) => {
    try {
        let business = await LegalModel.findOne({ businessId: businessId });
        if (!business) {
            return errorResponse(204, NULL, "Seems this data is not available");
        }
        // if (business.isConnected) {
        //     return errorResponse(HTTP_INTERNAL_SERVER_ERROR, NULL, "You have enabled payments already");
        // }
        business.tosAcceptance = businessInput.tosAcceptance;
        let stripeInput = business.toStripeJson();
        return stripe.accounts.create(stripeInput)
            .then(async account => {
                console.log("Account created on stripe : " + JSON.stringify(account));
                business.stripe = {
                    verification: account.verification,
                    payout_schedule: account.payout_schedule,
                    payouts_enabled: account.payouts_enabled,
                    keys: account.keys,
                    id: account.id
                }
                business.verification = {
                    isVerified: true,
                    firstVerifiedOn: moment.now()
                }
                business.isConnected = true;
                business = await business.save({ new: true });
                return okResponse(HTTP_OK, { business: business.toUserJson() }, SUCCESS);
            }).catch(error => {
                // console.log("Ac creation error : " + JSON.stringify(error));
                error = getFormattedError(error);
                return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, error.message);
            });
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const getLegalBusiness = async (businessId) => {
    try {
        let legal = await LegalModel.findOne({ businessId: businessId });
        if (!legal) {
            return okResponse(204, null, "Seems this data doesn't exist");
        }
        return okResponse(HTTP_OK, { business: legal.toUserJson() }, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const getAllOnlinePayments = async (businessId, filter) => {
    try {
        const legalBusiness = await LegalModel.findOne({ businessId: businessId });
        if (!legalBusiness || !legalBusiness.isConnected) {
            return errorResponse(351, legalBusiness, "Payment setup is not done for this business. Please finish setup first");
        }
        filter.onlinePaymentsOnly = true;

        let payments = await getPayments(businessId, filter);
        return payments;
    }
    catch (error) {
        console.log("Error : " + error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }

};

export const getPayments = async (businessId, filter) => {
    try {
        let { text, offset = 0, limit = 10, checkoutId, status, customer, startDate, endDate, shouldPopulate = true, onlinePaymentsOnly = false } = filter;
        offset = parseInt(offset);
        limit = parseInt(limit);

        let query = PaymentModel.find({ businessId: businessId, isDeleted: false });
        if (startDate) {
            query.where("paymentDate").gte(startDate);
        }

        if (endDate) {
            query.where("paymentDate").lte(getEndDateWithTime(endDate));
        }

        if (status) {
            query.where("status").equals(status);
        }
        if (onlinePaymentsOnly) {
            query.where("method").ne("manual");
        }
        if (text) {
            query.where({ $text: { $search: text, $caseSensitive: false } })
        }
        if (checkoutId) {
            query.where("checkoutId").equals(checkoutId);
        }
        query.skip(offset);
        query.limit(limit);
        query.sort({ "paymentDate": -1 });
        if (shouldPopulate) {
            query
                .populate({
                    path: "legal",
                    select: "account"
                })
                .populate({
                    path: "refunds",
                    select: "amount currency"
                });
        }
        const payments = await query.exec();
        if (!payments || !payments.length) {
            return okResponse(HTTP_OK, null, "No payment data available");
        }
        return okResponse(HTTP_OK, { payments: payments.map(p => p.toUserJson()) }, SUCCESS);
    }
    catch (error) {
        console.log("Error : " + error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }

};

export const getPaymentById = async (businessId, paymentId) => {
    try {
        let payment = await PaymentModel.findById(paymentId)
            .populate('checkout')
            .populate('invoice')
            .populate({
                path: "legal",
                select: "account"
            })
            .populate({
                path: "refunds",
                select: "amount currency"
            });
        if (!payment) {
            return okResponse(HTTP_BAD_REQUEST, null, "No payment data available");
        }
        return okResponse(HTTP_OK, { payment: payment.toUserJson() }, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const updatePaymentById = async (paymentId, paymentInput) => {
    try {
        let payment = await PaymentModel.findOne({
            _id: paymentId, isDeleted: false
        });
        if (!payment) {
            return okResponse(HTTP_BAD_REQUEST, null, "Requested payment data is not available");
        }
        const amountBreakup = getAmountBreakup(paymentInput.amount, paymentInput.method);
        // 1. For manual payment, all fields are allowed to be edited
        // 2. For card and bank payments, allow updating the memo only
        if (paymentInput.method == 'manual') {
            payment = await payment.updateOne({
                account: paymentInput.account,
                memo: paymentInput.memo,
                manual: { type: paymentInput.manualMethod },
                amount: amountBreakup.total,
                amountBreakup: amountBreakup,
                amountInHomeCurrency: paymentInput.amountInHomeCurrency || paymentInput.amount,
                exchangeRate: paymentInput.exchangeRate,
                paymentDate: paymentInput.paymentDate
            });
        } else {
            payment = await payment.updateOne({
                memo: paymentInput.memo
            });
        }
        console.log("payment", payment);
        return okResponse(HTTP_OK, null, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const deletePayment = async (paymentId, status) => {
    try {
        let paymentResponse = await PaymentModel.findOneAndUpdate({ _id: paymentId }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                isActive: false,
                status: status
            }
        })
        console.log("paymentResponse pay", paymentResponse);
        if (!paymentResponse) {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, paymentResponse, "Failed to remove payment");
        }
        return okResponse(HTTP_OK, paymentResponse, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const deleteLegalBusiness = async (businessId) => {
    try {
        let legal = await LegalModel.findOne({ businessId: businessId });
        if (!legal) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }
        await legal.remove();
        return okResponse(HTTP_OK, null, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

const getAmountBreakup = (amount, method) => {
    const paymentFeeJson = "./../config/payment_fee.json";
    const paymentFee = require(paymentFeeJson);
    const feeStructure = paymentFee.find(f => f.type == method);
    if (!feeStructure)
        return null;
    const total = parseFloat(amount).toFixed(2);
    const fee = ((total * feeStructure.fee.dynamic) + feeStructure.fee.fixed).toFixed(2);
    const net = (total - fee).toFixed(2);
    return {
        total,
        fee,
        net,
        feeStructure: feeStructure.fee
    }
}

export const performManualPayment = async (invoice, paymentInput) => {
    const customerResponse = await fetchCustomerById(invoice.customer);
    if (customerResponse.statusCode != HTTP_OK) {
        return customerResponse;
    }

    const amountBreakup = getAmountBreakup(paymentInput.amount, "manual");
    if (amountBreakup == null) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Seems this payment method is not supported");
    }
    const customer = customerResponse.data.customer;
    try {
        let payment = new PaymentModel({
            paymentType: "Invoice",
            status: "SUCCESS",
            account: paymentInput.account,
            manual: { type: paymentInput.manualMethod },
            memo: paymentInput.memo,
            amount: amountBreakup.total,
            amountBreakup: amountBreakup,
            amountInHomeCurrency: paymentInput.amountInHomeCurrency || paymentInput.amount,
            exchangeRate: paymentInput.exchangeRate,
            method: "manual",
            paymentDate: paymentInput.paymentDate,
            customer: {
                firstName: customer.customerName || customer.firstName,
                lastName: customer.lastName,
                phone: customer.communication.phone,
                email: customer.email,
            },
            address: customer.addressBilling,
            invoiceId: invoice._id,
            userId: paymentInput.userId,
            businessId: paymentInput.businessId,
            currency: invoice.currency,
            other: {
                invoiceNo: invoice.invoiceNumber
            }
        });
        payment = await payment.save(paymentInput);
        return okResponse(HTTP_OK, { payment: payment.toInvoiceJson() }, "Cash payment added successfully");
    } catch (e) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, e, FAILED);
    }
}

export const chargeCheckout = async (checkoutInput) => {
    console.log("checkoutInput ", checkoutInput)
    try {
        let checkout = await CheckoutModel.findOne({ uuid: checkoutInput.uuid });
        if (!checkout) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }

        if (checkout.status != 'Online') {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "Seems this checkout is not available at the moment. Please contact business owner.");
        }
        const business = await LegalModel.findOne({ businessId: checkout.businessId });
        console.log("business : " + JSON.stringify(business));
        if (!business || !business.isConnected) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "Seems this business doesn't accept payments online");
        }

        if (!business.stripe.id) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "Please setup the payment for this business again");
        }

        const token = checkoutInput.stripeToken;
        const stripeResponse = JSON.parse(checkoutInput.rawElementResponse);
        if (!stripeResponse || !stripeResponse.card) {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Please pass stripe response in string json");
        }
        const amountBreakup = getAmountBreakup(checkout.total, "card");
        // Stripe counts last 2 digits as decimal
        const charge = await stripe.charges.create({
            amount: parseInt(amountBreakup.total * 100),
            currency: 'usd',
            description: 'Checkout charge : ' + JSON.stringify(checkout.toPublicJson()),
            source: token,
            transfer_data: {
                amount: parseInt(amountBreakup.net * 100),
                destination: business.stripe.id,
            }
        });
        console.log("Charge response: " + JSON.stringify(charge));
        const paidDate = moment.now();
        // Update count for reporting
        checkout.report.paymentCount++;
        checkout.report.lastPaymentOn = paidDate;
        await checkout.save();

        // Make entry on payment
        let payment = new PaymentModel({
            paymentType: "Checkout",
            status: "SUCCESS",
            paymentDate: paidDate,
            card: {
                type: stripeResponse.card.brand,
                number: stripeResponse.card.last4,
                expiryMonth: stripeResponse.card.exp_month,
                expiryYear: stripeResponse.card.exp_year,
                cardHolderName: checkoutInput.cardHolderName
            },
            method: checkoutInput.method,
            customer: checkoutInput.customer,
            address: checkoutInput.address,
            checkoutId: checkout._id,
            amount: amountBreakup.total,
            amountBreakup: amountBreakup,
            userId: checkout.userId,
            businessId: checkout.businessId,
            currency: checkout.currency,
            rawElementResponse: JSON.stringify(stripeResponse),
            rawChargeResponse: JSON.stringify(charge),
            refund: {
                isApplicable: true
            },
            payout: {
                isApplicable: true
            },
            other: {
                checkoutName: checkout.itemName
            }
        })
        const paymentResponse = await payment.save();
        return okResponse(HTTP_OK, { paymentResponse }, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message);
    }
};

export const prePaymentProcessing = async (paymentInput, amountBreakup) => {
    let payment = new PaymentModel({
        paymentType: paymentInput.paymentType,
        status: "WAITING",
        method: paymentInput.method,
        paymentDate: moment.now(),
        customer: paymentInput.customer,
        address: paymentInput.address,
        account: paymentInput.account,
        memo: paymentInput.memo,
        invoiceId: paymentInput.invoiceId,
        checkoutId: paymentInput.checkoutId,
        amount: amountBreakup.total,
        amountBreakup: amountBreakup,
        currency: paymentInput.currency,
        userId: paymentInput.userId,
        businessId: paymentInput.businessId
    })
    if (paymentInput.method == 'card') {
        payment.card = {
            type: paymentInput.rawElementResponse.card.brand,
            number: paymentInput.rawElementResponse.card.last4,
            expiryMonth: paymentInput.rawElementResponse.card.exp_month,
            expiryYear: paymentInput.rawElementResponse.card.exp_year,
            cardHolderName: paymentInput.cardHolderName,
            cardId: paymentInput.cardId
        }
        payment.rawElementResponse = JSON.stringify(paymentInput.rawElementResponse);
    } else if (paymentInput.method == 'bank') {
        try {
            const accounts = paymentInput.rawLinkResponse.accounts;
            console.log("accounts", accounts);
            const accountToDebit = accounts.find(a => a.id == paymentInput.accountId);
            console.log("accountToDebit", accountToDebit);
            payment.bank = {
                name: paymentInput.rawLinkResponse.institution.name,
                number: accountToDebit.mask,
                type: accountToDebit.type,
                subType: accountToDebit.subtype,
                accountId: paymentInput.accountId,
                publicToken: paymentInput.publicToken,
                // requestId:,
            }
            payment.rawLinkResponse = JSON.stringify(paymentInput.rawLinkResponse);
        } catch (e) {
            throw (e);
        }
    }
    console.log("************** Invoice number : ", paymentInput);
    if (paymentInput.paymentType == 'Invoice') {
        payment.other = {
            invoiceNo: paymentInput.invoiceNumber
        }
    }
    console.log("************** Invoice number after : ", paymentInput);
    return await payment.save();
}

export const postPaymentProcessing = async (paymentId, status, gatewayResponse, message) => {
    let payment = await PaymentModel.findOne({
        _id: paymentId,
        status: "WAITING"
    })
    if (!payment) {
        return null;
    } else {
        payment.status = status;
        payment.rawChargeResponse = JSON.stringify(gatewayResponse);
        payment.remarks = message || gatewayResponse.message;
        return await payment.save();
    }
}

const performCardPaymentThroughStripe = async (paymentId, amountBreakup, currencyCode, publicUrl, stripeData) => {
    let { chargeResponse, status } = {};
    let message;
    try {
        chargeResponse = await stripe.charges.create({
            amount: parseInt(amountBreakup.total * 100),
            currency: currencyCode,
            description: `Payment Id : ${paymentId} for public url ${publicUrl}`,
            source: stripeData.token,
            transfer_data: {
                amount: parseInt(amountBreakup.net * 100),
                destination: stripeData.destinationBusinessStripeId,
            }
        });
        console.log("Charge response (success): ", chargeResponse);
        status = "SUCCESS";
        message = `Payment Id : ${paymentId} for public url ${publicUrl}`;
    } catch (e) {
        console.log("Charge response e: ", e);
        chargeResponse = e.raw;
        console.log("Charge response (decline): ", chargeResponse);
        message = getFriendlyStripeError(chargeResponse.code);
        console.log("Charge response (decline): message : ", message);
        status = "DECLINED"
    }
    const paymentResponse = await postPaymentProcessing(paymentId, status, chargeResponse, message);
    console.log("Post paymentResponse: ", paymentResponse);
    return { status, paymentResponse, message };
}

const performSavedCardPaymentThroughStripe = async (paymentId, amountBreakup, currencyCode, publicUrl, stripeData) => {
    let { chargeResponse, status } = {};
    console.log("stripeDAta", stripeData);
    let message;
    try {
        const chargeResponse = await stripe.paymentIntents.create({
            amount: parseInt(amountBreakup.total * 100),
            currency: currencyCode,
            description: `Payment Id : ${paymentId} for public url ${publicUrl}`,
            payment_method_types: ['card'],
            customer: stripeData.customerId,
            payment_method: stripeData.paymentMethodId,
            off_session: true,
            confirm: true,
            transfer_data: {
                amount: parseInt(amountBreakup.net * 100),
                destination: stripeData.destinationBusinessStripeId,
            }
        });

        console.log("Charge response (success): ", chargeResponse);
        status = "SUCCESS";
        message = `Payment Id : ${paymentId} for public url ${publicUrl}`;
    } catch (e) {
        console.log("Charge response e: ", e);
        chargeResponse = e.raw;
        console.log("Charge response (decline): ", chargeResponse);
        message = getFriendlyStripeError(chargeResponse.code);
        console.log("Charge response (decline): message : ", message);
        status = "DECLINED"
    }
    const paymentResponse = await postPaymentProcessing(paymentId, status, chargeResponse, message);
    console.log("Post paymentResponse: ", paymentResponse);
    return { status, paymentResponse, message };
}

const getFriendlyStripeError = (code) => {
    let message = "Failed to process payment"
    switch (code) {
        case 'account_country_invalid_address':
            message = "Card account must belong to the same country of address";
            break;
        case 'account_number_invalid':
            message = "The bank account number provided is invalid";
            break;
        case 'alipay_upgrade_required':
            message = "This method for creating Alipay payments is not supported anymore";
            break;
        case 'balance_insufficient':
            message = "Payment can not be processed due to insufficient balance";
            break;
        case 'api_key_expired':
            message = "Failed to process payments. Please connect with support team.";
            break;
        case 'amount_too_large':
            message = "Payment amount is too large to process. Please try with smaller amount";
            break;
        case 'amount_too_small':
            message = "Payment amount is too small to process. Please try with larger amount";
            break;
        case 'bank_account_unusable':
            message = "This bank account is disabled for payments. Please use different account";
            break;
        case 'bank_account_unverified':
            message = "Selected bank account requires verification to complete the payment";
            break;

        case 'routing_number_invalid':
            message = "Selected bank account routing number is invalid";
            break;
        case 'card_declined':
            message = "Payment for this card has been declined by payment provider";
            break;
        case 'country_unsupported':
            message = "Payment can not be processed as provided country is not supported";
            break;

        case 'email_invalid':
            message = "The email address provided is not valid";
            break;
        case 'expired_card':
            message = "Payment can not be processed as card has been expired";
            break;
        case 'incorrect_address':
            message = "Payment can not be processed as provided address doesn't match with card address";
            break;

        case 'invalid_cvc':
        case 'incorrect_cvc':
            message = "Payment can not be processed as card cvc is incorrect";
            break;

        case 'invalid_expiry_month':
        case 'invalid_expiry_year':
            message = "Payment can not be processed as card expiry month or year is incorrect";
            break;
        case 'invalid_number':
        case 'incorrect_number':
            message = "Payment can not be processed as card number is incorrect";
            break;
        case 'incorrect_zip':
            message = "Payment can not be processed as provided zip code doesn't match with card zip code";
            break;

        case 'invalid_card_type':
            message = "Payment can not be processed as this card type is not supported";
            break;
        case 'invalid_charge_amount':
            message = "Payment can not be processed as the amount specified is invalid";
            break;

        case 'postal_code_invalid':
        case 'incorrect_zip':
            message = "Payment can not be processed as provided zip code doesn't match with card zip code";
            break;
        case 'processing_error':
            message = "Failed to process payment, please check your card details and try again";
            break;
    }
    return message;
}
// Fetch invoice
// Fetch customer
// Check if online payment is allowed
// Verify input and stored data together or BGC
// Calculate amount and fee
// Create payment with waiting status
// Perform transaction (stripe, manual, plaid) (Create customer if needed)
// Update payment with payment status
// Update invoice with payment detail if payment succeed
// Perform refund if invoice update failed
// 
export const payInvoicePublic = async (paymentInput) => {
    try {
        let invoice = await InvoiceModel.findOne({ uuid: paymentInput.uuid })
            .populate("customer");
        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }
        if (invoice.status == 'paid') {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "This invoice has been paid already");
        }

        const business = await LegalModel.findOne({ businessId: invoice.businessId });
        console.log("business : " + JSON.stringify(business));
        if (!business || !business.isConnected) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "Seems this business doesn't accept payments online");
        }

        let stripeResponse = {};
        let plaidResponse;
        // Stripe is common for both methods
        paymentInput.stripe = {
            id: business.stripe.id,
            token: paymentInput.stripeToken
        }
        if (paymentInput.method == 'card') {
            if (!paymentInput.cardId) {
                stripeResponse = JSON.parse(paymentInput.rawElementResponse);
                if (!stripeResponse || !stripeResponse.card) {
                    return errorResponse(HTTP_BAD_REQUEST, null, "Please pass stripe response in string json");
                }
            } else {
                if (invoice.customer.stripe && invoice.customer.stripe.isConnected)
                    paymentInput.stripe.customerId = invoice.customer.stripe.customerId;
                else
                    return errorResponse(HTTP_BAD_REQUEST, NULL, "Auto payment for this customer has been disabled");

                const cardDetail = await getCard(paymentInput.cardId, {}, true);
                if (!cardDetail) {
                    return errorResponse(HTTP_BAD_REQUEST, null, "This card is invalid");
                }
                console.log("cardDetail", cardDetail);
                // Simulating rawElement response
                stripeResponse = {
                    cardId: paymentInput.cardId,
                    card: {
                        brand: cardDetail.brand,
                        last4: cardDetail.cardNumber,
                        exp_month: cardDetail.expiryMonth,
                        exp_year: cardDetail.expiryYear,
                    }
                }
                paymentInput.cardHolderName = cardDetail.cardHolderName;
                paymentInput.stripe.token = cardDetail.stripe.paymentMethodId;
            }
        } else if (paymentInput.method == 'bank') {
            plaidResponse = JSON.parse(paymentInput.rawLinkResponse);
            if (!plaidResponse) {
                return errorResponse(HTTP_BAD_REQUEST, null, "Please pass plaid response in string json");
            }
            paymentInput.plaid = {
                publicToken: paymentInput.plaidToken,
                accountId: paymentInput.accountId
            }
        }
        console.log("paymentInput.amount : " + paymentInput.amount);
        if (paymentInput.amount < parseFloat(1)) {
            return errorResponse(HTTP_BAD_REQUEST, null, "Online payment supports amount between 1 and 999,999");
        }
        // if (paymentInput.amount > invoice.dueAmount) {
        //     return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Paid amount can not be larger than due amount");
        // }

        const amountBreakup = getAmountBreakup(paymentInput.amount, paymentInput.method);
        if (amountBreakup == null) {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Seems this payment method is not supported");
        }

        let customer = invoice.customer;
        customer.firstName = customer.customerName || customer.firstName;
        paymentInput = {
            ...paymentInput, ...{
                paymentType: "Invoice",
                customer: customer,
                address: invoice.address,
                account: paymentInput.method == 'card' ? 'credit_card' : 'bank',
                memo: `Payment for Invoice #${invoice.invoiceNumber}`,
                invoiceNumber: invoice.invoiceNumber,
                invoiceId: invoice._id,
                currency: invoice.currency,
                userId: invoice.userId,
                businessId: invoice.businessId,
                rawElementResponse: stripeResponse,
                rawLinkResponse: plaidResponse
            }
        }
        console.log("final paymentInput", paymentInput);
        return await performPayment(invoice, paymentInput, amountBreakup);
    } catch (error) {
        console.log("payInvoicePublic error *********************", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message);
    }
}
export const performPayment = async (invoice, paymentInput, amountBreakup) => {
    try {
        const prePaymentResponse = await prePaymentProcessing(paymentInput, amountBreakup);
        console.log("prePaymentResponse", prePaymentResponse);
        if (!prePaymentResponse) {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Failed to initiate payment");
        }
        const paymentId = prePaymentResponse._id;
        console.log("%%%%%%%%%%%%% paymentId %%%%%%%%%%% ", paymentId);
        let chargeResponse;
        if (paymentInput.method == 'card') {
            if (paymentInput.cardId)
                chargeResponse = await performSavedCardPaymentThroughStripe(paymentId, amountBreakup, invoice.currency.code, invoice.publicView, { destinationBusinessStripeId: paymentInput.stripe.id, paymentMethodId: paymentInput.stripe.token, customerId: paymentInput.stripe.customerId });
            else
                chargeResponse = await performCardPaymentThroughStripe(paymentId, amountBreakup, invoice.currency.code, invoice.publicView, { destinationBusinessStripeId: paymentInput.stripe.id, token: paymentInput.stripeToken });
        } else if (paymentInput.method == 'bank') {
            console.log("paymentInput paymentInput", paymentInput);
            chargeResponse = await performBankPaymentThroughPlaid(paymentId, amountBreakup, invoice.currency.code, invoice.publicView, paymentInput.stripe.id, paymentInput.plaid);
        } else {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Invalid payment method");
        }
        console.log("chargeResponse", chargeResponse);
        if (chargeResponse && chargeResponse.status == 'SUCCESS') {
            const invoiceResponse = await updateInvoicePayment(invoice._id, amountBreakup.total, paymentId);
            console.log("invoiceResponse : " + JSON.stringify(invoiceResponse));
            if (invoiceResponse.statusCode != HTTP_OK) {
                // Start refund process
                await performRefund({
                    "paymentId": paymentId,
                    "refundAmount": amountBreakup.total,
                    "reason": invoiceResponse.message || "Failed to update payment status on invoice",
                }, invoice.businessId)
                const paymentResponse = await PaymentModel.findById(paymentId);
                return errorResponse(HTTP_INTERNAL_SERVER_ERROR, { paymentResponse: paymentResponse.toInvoiceJson() }, "Failed to process payment. Any charge levied will be refunded in 3-5 business days");
            } else {
                return okResponse(HTTP_OK, { "paymentResponse": chargeResponse.paymentResponse.toInvoiceJson() }, SUCCESS);
            }
        } else {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, { "paymentResponse": chargeResponse.paymentResponse.toInvoiceJson() }, chargeResponse.message || "Failed to process payment");
        }
    }
    catch (error) {
        console.log("performPayment error *********************", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message);
    }
};

export const performBankPaymentThroughPlaid = async (paymentId, amountBreakup, currencyCode, publicUrl, destinationBusinessStripeId, plaidData) => {
    try {
        const exchangeResponse = await plaidClient.exchangePublicToken(plaidData.publicToken);
        console.log("exchangeResponse", exchangeResponse);
        const accessToken = exchangeResponse.access_token;
        plaidData.accessToken = accessToken;
        const plaidWithStripeResponse = await plaidClient.createStripeToken(accessToken, plaidData.accountId);
        console.log("stripe token ", plaidWithStripeResponse);
        if (plaidWithStripeResponse.status_code == 200) {
            const stripeToken = plaidWithStripeResponse.stripe_bank_account_token;
            plaidData.stripeToken = stripeToken;
            return await performCardPaymentThroughStripe(paymentId, amountBreakup, currencyCode, publicUrl, { destinationBusinessStripeId: destinationBusinessStripeId, token: stripeToken });
        } else {
            const status = "DECLINED";
            const paymentResponse = await postPaymentProcessing(paymentId, status, plaidWithStripeResponse);
            console.log("Post paymentResponse: ", paymentResponse);
            return { status, paymentResponse };
        }
    } catch (error) {
        console.error("Error on paying invoice through bank=> ", error);
        const status = "DECLINED";
        const paymentResponse = await postPaymentProcessing(paymentId, status, error);
        console.log("Post paymentResponse: ", paymentResponse);
        return { status, paymentResponse };
    }
}

export const getAccountBalance = async (publicToken, institutionId) => {
    try {
        const plaid = require('plaid');
        console.log("process.env.PLAID_ENV : " + process.env.PLAID_ENV);
        const plaidClient = new plaid.Client(
            process.env.PLAID_CLIENT_ID,
            process.env.PLAID_SECRET,
            process.env.PLAID_PUBLIC_KEY,
            process.env.PLAID_ENV != 'production' ? plaid.environments.sandbox : plaid.environments.production,
            { version: process.env.PLAID_VERSION });
        const exchangeResponse = await plaidClient.exchangePublicToken(publicToken);
        console.log("exchangeResponse", exchangeResponse);
        const accessToken = exchangeResponse.access_token;
        let institutionResponse = await plaidClient.getInstitutionById(institutionId, { include_optional_metadata: true })
        let accountResponse = await plaidClient.getBalance(accessToken)
        if (accountResponse.status_code == HTTP_OK) {
            const accounts = accountResponse.accounts.filter(a => a.type == 'depository');
            let institution = null;
            if (institutionResponse.status_code == HTTP_OK) {
                let i = institutionResponse.institution;
                institution = {
                    logo: i.logo,
                    primaryColor: i.primary_color,
                    name: i.name,
                    url: i.url
                };
            }
            return okResponse(HTTP_OK, { accounts: accounts, institution: institution }, SUCCESS);
        } else {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, { "accountResponse": null }, "Failed to get balance");
        }

    } catch (error) {
        console.error("Error on getting account balance=> ", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, { "accountResponse": error }, "Failed to get balance");
    }
}

export const getListOfBanks = async () => {
    try {
        return new Promise(function (resolve, reject) {
            plaidClient.getInstitutions(50, 0, (err, result) => {
                resolve(result.institutions);
            });
        })
    } catch (error) {
        throw(error)
    }

}
