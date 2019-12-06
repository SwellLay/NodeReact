import {
    okResponse,
    errorResponse
} from "../util/HttpResponse";
import {
    LegalModel
} from '../models/legal.model';
import {
    OrganizationModel
} from '../models/organization.model';
import {
    CheckoutModel
} from '../models/checkout.model';
import {
    InvoiceModel
} from '../models/invoice.model';
import {
    PaymentModel
} from '../models/payment.model';
import moment from "moment";
let stripe = require("stripe")(process.env.STRIPE_KEY);
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

import {
    getFormattedError
} from '../util/utils';
import {
    RefundModel
} from "../models/refund.model";

export const performRefund = async (refundInput, businessId) => {
    let payment = await PaymentModel.findOne({
        _id: refundInput.paymentId,
        businessId
    });
    if (!payment) {
        return errorResponse(HTTP_BAD_REQUEST, NULL, "The refund request for the provided payment is not valid");
    }
    if (payment.status != 'SUCCESS') {
        return errorResponse(HTTP_BAD_REQUEST, NULL, "This payment is not eligible for refund");
    }
    console.log("payment ", payment);
    if (!payment.rawChargeResponse || payment.rawChargeResponse == "") {
        return errorResponse(HTTP_BAD_REQUEST, NULL, "Refund can not be performed on this payment");
    }
    let rawChargeResponse;
    try {
        rawChargeResponse = JSON.parse(payment.rawChargeResponse);
    } catch (e) {
        return errorResponse(HTTP_BAD_REQUEST, {
            message: "rawChargeResponse is not parsable"
        }, "Refund can not be performed on this payment");
    }
    if (!rawChargeResponse || !rawChargeResponse.id) {
        return errorResponse(HTTP_BAD_REQUEST, {
            message: "rawChargeResponse id is not available"
        }, "Refund can not be performed on this payment");
    }
    const refundStripeResponse = await refundWithStripe(rawChargeResponse.id, refundInput.refundAmount, businessId);

    try {
        if (refundStripeResponse.statusCode == HTTP_OK) {
            const refundDate = new Date();
            let refund = new RefundModel({
                paymentType: payment.paymentType,
                status: "REFUNDED",
                refundDate: refundDate,
                account: payment.account,
                customer: payment.customer,
                reason: refundInput.reason,
                invoiceId: payment.invoiceId,
                currency: payment.currency,
                checkoutId: payment.checkoutId,
                amount: refundInput.refundAmount,
                userId: payment.userId,
                businessId: payment.businessId,
                payment: {
                    type: "Partial",
                    date: payment.paymentDate,
                    id: payment._id
                },
                other: payment.other,
                rawRefundResponse: JSON.stringify(refundStripeResponse.data)
            });
            if (refundInput.refundAmount >= payment.amount.total) {
                refund.payment.type = "Full";
            }
            const refundResponse = await refund.save();
            payment.refund.details = payment.refund.details || [];
            payment.refund.isRefunded = true;
            payment.refund.details.push(refundResponse._id);
            if (refund.amount >= payment.amount)
                payment.status = "REFUNDED";
            payment.remarks = refundInput.reason;
            // payment.refund.details.push({
            //     amount: `$${refundInput.refundAmount}`,
            //     date: refundDate,
            //     id: refundResponse._id
            // })
            await payment.save();
            return okResponse(HTTP_OK, {
                "refund": refundResponse.toUserJson()
            }, SUCCESS);
        } else {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, refundStripeResponse.data, refundStripeResponse.message);
        }
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message);
    }
};

export const getAllRefund = async (businessId, filter) => {
    try {
        let {
            offset = 0, limit = 10, status, invoiceId, customer, startDate, endDate, shouldPopulate = true
        } = filter;
        offset = parseInt(offset);
        limit = parseInt(limit);

        let query = RefundModel
            .find({
                businessId: businessId,
                isDeleted: false
            })
            .sort({
                createdAt: -1
            });

        if (invoiceId) {
            query.where("invoiceId").equals(invoiceId);
            limit = 1000;
        }
        if (status) {
            query.where("status").equals(status);
        }
        query.skip(offset);
        query.limit(limit);
        if (shouldPopulate) {
            query.populate("legal")
                .populate({
                    path: "paymentDetail",
                    select: {
                        card: 1,
                        bank: 1,
                        amountInHomeCurrency: 1,
                        method: 1,
                        exchangeRate: 1,
                        other: 1
                    }
                })
        }
        let refunds = await query.exec();
        if (!refunds || !refunds.length) {
            return okResponse(200, null, "No refunds data available");
        }
        return okResponse(200, {
            refunds: refunds.map(p => p.toUserJson())
        }, SUCCESS);
    } catch (error) {
        console.log("Error : " + error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message || error);
    }
}

export const getRefundById = async (refundId, businessId) => {
    try {
        let refund = await RefundModel.findOne({
            _id: refundId,
            businessId: businessId,
            isDeleted: false
        }).populate("legal");
        if (!refund) {
            return okResponse(HTTP_BAD_REQUEST, null, "This data doesn't exist");
        }
        return okResponse(200, {
            refund: refund.toUserJson()
        }, SUCCESS);
    } catch (error) {
        console.log("Error : " + error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message || error);
    }
}

export const getRefundByPaymentId = async (paymentId, businessId) => {
    try {
        let refunds = await RefundModel.find({
                "payment.id": paymentId,
                businessId: businessId,
                isDeleted: false
            })
            .populate("legal")
            .populate({
                path: "paymentDetail",
                select: {
                    card: 1,
                    bank: 1,
                    amountInHomeCurrency: 1,
                    method: 1,
                    exchangeRate: 1,
                    other: 1
                }
            });
        if (!refunds || !refunds.length) {
            return okResponse(HTTP_BAD_REQUEST, null, "No data available");
        }
        return okResponse(200, {
            refunds: refunds.map(p => p.toUserJson())
        }, SUCCESS);
    } catch (error) {
        console.log("Error : " + error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message || error);
    }
}

async function refundWithStripe(chargeKey, refundAmount, businessId) {
    try {
        // Stripe counts last 2 digits as decimal
        refundAmount = parseFloat(refundAmount);
        const refundResponse = await stripe.refunds.create({
            charge: chargeKey,
            amount: parseInt(refundAmount * 100)
        });

        console.log("Refund response: " + JSON.stringify(refundResponse));

        // const paymentResponse = await payment.save();
        return okResponse(HTTP_OK, refundResponse, SUCCESS);
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message);
    }
};