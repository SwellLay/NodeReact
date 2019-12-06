import moment from 'moment';
import mongoose from "mongoose";
import uuidv4 from 'uuid/v4';
import {
    EstimateModel
} from '../models/estimate.model';
import {
    InvoiceModel
} from "../models/invoice.model";
import {
    OrganizationModel
} from "../models/organization.model";
import {
    LegalModel
} from '../models/legal.model';
import {
    addRecurrence
} from "./RecurringService";
import {
    FAILED,
    HTTP_BAD_REQUEST,
    HTTP_CONFLICT,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
    NULL,
    OK,
    PUBLIC_URL,
    SUCCESS,
    ERROR_NOT_FOUND
} from "../util/constant";
import {
    errorResponse,
    okResponse,
    getFormattedError
} from "../util/HttpResponse";
import {
    invoiceInput
} from "../util/InvoiceUtil";
import {
    currentExchangeRate
} from "../util/openexchange";
import {
    isValidNumber,
    isValidObjectId,
    getTemplateCode
} from "../util/utils";
import {
    recurringInput
} from '../util/recurringUtil';
import {
    addProduct
} from './ProductService';
import {
    SalesSettingModel
} from '../models/setting/sales.setting.model';
import {
    performManualPayment,
    getPaymentById,
    updatePaymentById,
    getPayments,
    deletePayment,
    payInvoiceByCard
} from "../services/PaymentService";
import {
    getAllRefund
} from "../services/RefundService";
import {
    PaymentModel
} from '../models/payment.model';
import {
    RefundModel
} from '../models/refund.model';
import {
    UserModel
} from '../models/user.model';
import {
    PaymentSettingModel
} from '../models/setting/payment.setting.model';
let pdfEngine = require('../tasks/pdfEngine');

const shouldEnableOnlinePayments = async (forCurrencyCode, businessId) => {
    let onlinePayments = {
        systemEnabled: false,
        businessEnabled: false,
        modeCard: false,
        modeBank: false,
    }
    const business = await LegalModel.findOne({
        businessId: businessId
    });
    if (!business || !business.isConnected) {
        onlinePayments.remarks = "Payment setup is not done for this business";
        return onlinePayments;
    }
    const setting = await PaymentSettingModel.findOne({
        businessId: businessId
    });
    if (!setting || !setting.enabled) {
        onlinePayments.remarks = "Payment setting doesn't allow online payment";
    } else {
        // If business currency is same as invoice then only enable online payments
        if (business.currency == forCurrencyCode) {
            onlinePayments = {
                systemEnabled: true,
                businessEnabled: true,
                modeCard: setting.accept_card,
                modeBank: setting.accept_bank,
            }
        } else {
            onlinePayments.remarks = `Online payments are turned off because the currency of this invoice (${forCurrencyCode}) does not match your business currency (${business.currency}).`;
        }
    }
    return onlinePayments;
}

export const addInvoice = async (invoiceInput, user, businessId) => {
    console.log("------------------invoiceInput--------------------------");
    try {
        invoiceInput.items = await buildProduct(invoiceInput, user, businessId);

        let invoice = await InvoiceModel.findOne({
            invoiceNumber: invoiceInput.invoiceNumber,
            isActive: true,
            isDeleted: false,
            businessId
        });
        if (invoice) {
            return errorResponse(HTTP_CONFLICT, null, "Invoice already exists with this number");
        }
        invoiceInput.onlinePayments = await shouldEnableOnlinePayments(invoiceInput.currency.code, businessId);
        invoiceInput.totalAmount = (parseFloat(invoiceInput.totalAmount)).toFixed(2);
        invoiceInput.dueAmount = invoiceInput.totalAmount;
        invoice = new InvoiceModel(invoiceInput);
        invoice = await invoice.save();
        invoice.publicView["shareableLinkUrl"] = PUBLIC_URL + "/public/invoice/" + invoice.uuid;
        invoice = await addShareableLink(invoice);
        return okResponse(HTTP_CREATED, {
            invoice
        }, "Invoice Added successfully");
    } catch (error) {
        console.error("add error invoice => ", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

async function buildProduct(invoiceInput, user, businessId) {
    let allItems = [];
    for (let i = 0; i < invoiceInput.items.length; i++) {
        let inputItem = invoiceInput.items[i];
        if (!inputItem.item) {
            let taxes = [];
            if (inputItem.taxes && inputItem.taxes.length) {
                taxes = inputItem.taxes.filter(t => t != null);
            }
            let productInput = {
                userId: user._id,
                businessId: businessId,
                name: (inputItem && inputItem.column1) || "",
                description: (inputItem && inputItem.column2) || "",
                price: (inputItem && inputItem.column4) || "",
                buy: {
                    allowed: false
                },
                sell: {
                    allowed: true
                },
                taxes: taxes
            }
            let productData = await addProduct(productInput, user, businessId);
            inputItem.column3 = parseInt(inputItem.column3);
            inputItem.column4 = parseFloat(inputItem.column4);
            inputItem.taxes = taxes;
            inputItem.item = productData.data.product._id;
        }
        allItems.push(inputItem);
    }
    return allItems;
}

// 1. Fetch invoice
// 2. Fetch payment of type manual. Only manual payment is allowed to be edited
// 3. update payment with new input provided
// 4. update invoice due amount and status
export const editInvoicePayment = async (paymentInput, user, businessId) => {
    try {
        // 1. Fetch invoice
        let invoice = await InvoiceModel.findOne({
            _id: paymentInput.invoiceId,
            isActive: true,
            isDeleted: false
        });
        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, ERROR_NOT_FOUND);
        }

        // 2. Fetch payment of type manual. Only manual payment is allowed to be edited
        let getPaymentResponse = await getPaymentById(businessId, paymentInput.paymentId);
        if (getPaymentResponse.statusCode != HTTP_OK) {
            return getPaymentResponse;
        }
        const payment = getPaymentResponse.data.payment;
        if (payment.invoiceId != paymentInput.invoiceId) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "This payment doesn't belong to provided invoice");
        }
        // if (payment.method != "manual") {
        //     return errorResponse(HTTP_BAD_REQUEST, NULL, "This payment can't be removed. Please initiate refund process for the same");
        // }

        // 3. update payment amount and date
        const paymentResponse = await updatePaymentById(paymentInput.paymentId, paymentInput);
        if (paymentResponse.statusCode != HTTP_OK) {
            return paymentResponse;
        }
        await invoice.updateOne(invoiceUpdate);

        // 4. update invoice due amount and status
        let paidAmount = parseFloat(paymentInput.amount) || 0;
        const newDueAmount = (payment.amount + invoice.dueAmount - paidAmount).toFixed(2);
        const newPaidAmount = (invoice.paidAmount - payment.amount + paidAmount).toFixed(2);
        let invoiceUpdate = {
            dueAmount: newDueAmount,
            paidAmount: newPaidAmount,
            lastPaidOn: moment.now()
        };
        if (invoiceUpdate.paidAmount >= invoice.totalAmount) {
            invoiceUpdate.status = "paid";
        } else if (invoice.totalAmount <= newDueAmount) {
            if (invoice.dueDate < new Date().setHours(0, 0, 0, 0)) {
                invoiceUpdate.status = "overdue";
            } else {
                invoiceUpdate.status = "sent";
            }
        } else if (invoice.totalAmount > newDueAmount) {
            if (invoice.dueDate < new Date().setHours(0, 0, 0, 0)) {
                invoiceUpdate.status = "overdue";
            } else {
                invoiceUpdate.status = "partial";
            }
        }
        await invoice.updateOne(invoiceUpdate);

        const payments = await getPayments(businessId, {
            invoiceId: paymentInput.invoiceId
        });
        return payments;
    } catch (error) {
        throw errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
}

// 1. Check if invoice exists
// 2. Pay for invoice by making entry on payment
// 3. Update invoice with new status and due amount
// 4. Generate receipt of the payment (and save it on payment)
export const paymentInvoice = async (paymentInput, user, businessId, invoiceId) => {
    try {
        // 1. Check if invoice exists
        let invoice = await InvoiceModel.findOne({
            _id: invoiceId,
            isActive: true,
            isDeleted: false,
            businessId
        });
        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, ERROR_NOT_FOUND);
        }

        // 2. Pay for invoice by making entry on payment
        let paidAmount = parseFloat(paymentInput.amount) || 0;
        paymentInput.amount = paidAmount;
        let paymentResult = {
            statusCode: HTTP_BAD_REQUEST
        };

        // Perform payment based on payment method
        if (paymentInput.method == 'manual') {
            paymentResult = await performManualPayment(invoice, paymentInput);
        } else if (paymentInput.method == 'card') {
            paymentResult = await payInvoiceByCard(invoice, paymentInput);
        } else if (paymentInput.method == 'bank') {
            paymentResult = await performBankPayment(invoice, paymentInput);
        } else {
            return errorResponse(HTTP_BAD_REQUEST, null, "Provided payment method is not supported");
        }
        if (paymentResult.statusCode != HTTP_OK) {
            return paymentResult;
        }
        const payment = paymentResult.data.payment;
        // 3. Update invoice with new status and due amount
        const payInvoiceResult = await updateInvoicePayment(invoiceId, paidAmount, payment.id);
        if (payInvoiceResult.statusCode != HTTP_OK) {
            return payInvoiceResult;
        }
        return okResponse(HTTP_CREATED, {
            payment
        }, "Payment Added Successfully");
    } catch (error) {
        throw errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
}

// 1. Fetch invoice
// 2. Fetch payment of type manual. Only manual payment is allowed to be removed
// 3. mark payment as cancelled and update its status to deleted
// 4. update invoice due amount and status
export const removePayment = async ({
    invoiceId,
    paymentId
}, businessId) => {
    try {
        // 1. Fetch invoice
        let invoice = await InvoiceModel.findOne({
            _id: invoiceId,
            isActive: true,
            isDeleted: false
        });
        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, ERROR_NOT_FOUND);
        }

        // 2. Fetch payment of type manual. Only manual payment is allowed to be removed
        let getPaymentResponse = await getPaymentById(businessId, paymentId);
        if (getPaymentResponse.statusCode != HTTP_OK) {
            return getPaymentResponse;
        }
        const payment = getPaymentResponse.data.payment;
        if (payment.invoiceId != invoiceId) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "This payment doesn't belong to provided invoice");
        }

        if (payment.method != "manual") {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "This payment can't be removed. Please initiate refund process for the same");
        }

        // 3. mark payment as cancelled and update its status to deleted
        const paymentResponse = await deletePayment(paymentId, "CANCELLED");
        if (paymentResponse.statusCode != HTTP_OK) {
            return paymentResponse;
        }

        // 4. update invoice due amount and status
        const newDueAmount = (payment.amount + invoice.dueAmount).toFixed(2);
        const newPaidAmount = (invoice.paidAmount - payment.amount).toFixed(2);
        let invoiceUpdate = {
            dueAmount: newDueAmount,
            paidAmount: newPaidAmount
        };
        if (invoice.totalAmount <= newDueAmount) {
            if (invoice.dueDate < new Date().setHours(0, 0, 0, 0)) {
                invoiceUpdate.status = "overdue";
            } else {
                invoiceUpdate.status = "sent";
            }
        } else if (invoice.totalAmount > newDueAmount) {
            if (invoice.dueDate < new Date().setHours(0, 0, 0, 0)) {
                invoiceUpdate.status = "overdue";
            } else {
                invoiceUpdate.status = "partial";
            }
        }
        await invoice.updateOne({
            $pull: {
                payments: paymentId
            }
        });
        await invoice.updateOne(invoiceUpdate);

        const payments = await getPayments(businessId, {
            invoiceId: invoiceId
        });
        return payments;

    } catch (error) {
        throw errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const fetchInvoices = async (businessId, {
    offset = 0,
    limit = 1000,
    status,
    customer,
    startDate,
    endDate,
    invoiceNumber,
    tab
}) => {
    try {
        let searchCondition = {
            isDeleted: false,
            businessId,
            isActive: true
        };

        if (tab) {
            switch (tab) {
                case "unpaid":
                    searchCondition.status = {
                        $in: ["saved", "sent", "viewed", "partial", "overdue"]
                    };
                    break;
                case "draft":
                    searchCondition.status = "draft";
                default:
                    break;
            }
        }

        if (status) {
            if (status === "unsent") {
                status = "saved";
            }
            switch (status) {
                case "unpaid":
                    searchCondition.status = {
                        $in: ["saved", "sent", "viewed", "partial", "overdue"]
                    };
                    break;
                case "draft":
                    searchCondition.status = "draft";
                default:
                    searchCondition.status = status;
                    break;
            }
        }

        if (customer) {
            searchCondition.customer = customer;
        }

        if (startDate && !endDate) {
            searchCondition.invoiceDate = {
                $gte: startDate
            }
        }

        if (endDate && !startDate) {
            searchCondition.invoiceDate = {
                $lte: endDate
            }
        }

        if (startDate && endDate) {
            searchCondition.invoiceDate = {
                $gte: startDate,
                $lte: endDate
            }
        }

        if (invoiceNumber && isValidNumber(invoiceNumber)) {
            searchCondition.invoiceNumber = invoiceNumber;
        }

        let invoices = await InvoiceModel.find(searchCondition).populate("businessId").populate("customer").populate("payments").populate("userId").skip(offset).limit(limit).sort({
            createdAt: -1
        });

        invoices = await checkOverdueInvoices(invoices);
        invoices = await checkInvoicesAction(invoices);
        return okResponse(HTTP_OK, {
            invoices: invoices.map(i => i.toUserJson())
        }, SUCCESS);
    } catch (error) {
        console.error("-----------------> ", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const checkOverdueInvoices = async (invoices) => {

    for (let i = 0; i < invoices.length; i++) {
        if ((invoices[i].status !== "overdue" && invoices[i].status !== 'draft' && invoices[i].status !== "paid") && (invoices[i].totalAmount > 0)) {
            if (invoices[i].dueDate < new Date().setHours(0, 0, 0, 0)) {
                invoices[i].status = "overdue";
                invoices[i].due = "Due 10 days ago";
                await invoices[i].updateOne({
                    status: "overdue"
                });
            }
        }
    }
    return invoices;
}

export const checkInvoicesAction = async (invoices) => {

    for (let i = 0; i < invoices.length; i++) {
        let action = "",
            row = invoices[i];
        if (row.status === "paid") {
            action = "View";
        }
        if (row.status === "saved") {
            action = "Send";
        }
        if (row.status === "draft") {
            action = "Approve";
        }
        if (row.status === "sent" || row.status === "viewed") {
            action = "Record a payment"
        }
        if (row.status === "overdue" && row.sentDate) {
            action = "Send a reminder";
        } else if (row.status === "overdue") {
            action = "Record a payment";
        }

        if (row.status === "partial") {
            action = "Record a payment";
        }
        if (action != row.action) {
            invoices[i].action = action;
            // await invoices[i].updateOne({ action });
        }
    }
    return invoices;
}


export const fetchInvoiceById = async (id, businessId) => {
    try {
        const validId = isValidObjectId(id);

        if (!validId) {
            return errorResponse(HTTP_BAD_REQUEST, {
                error: "Invalid ID passed"
            }, "Invalid ID passed");
        }

        let invoice = await InvoiceModel.findOne({
                _id: id,
                isActive: true,
                isDeleted: false,
                businessId
            })
            .populate("customer")
            .populate("business")
            .populate("payments")
            .populate("legal")
            .populate("amountBreakup.taxTotal.taxName");

        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, null, ERROR_NOT_FOUND);
        }
        const paymentDetail = await fetchInvoicePayments(invoice._id, invoice.businessId);
        let payments = [];
        if (paymentDetail && paymentDetail.statusCode == 200) {
            payments = paymentDetail.data && paymentDetail.data.payments ? paymentDetail.data.payments : [];
        }
        const salesSetting = await SalesSettingModel.findOne({
            businessId
        });
        const userInfo = await UserModel.findById(invoice.userId);
        return okResponse(HTTP_OK, {
            invoice: invoice.toUserJson(),
            payments: payments,
            salesSetting,
            userInfo: userInfo.toPublicJson()
        }, SUCCESS);
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const patchInvoice = async (invoiceId, invoiceInput, businessId) => {
    try {
        if (invoiceInput.onlinePayments) {
            invoiceInput.onlinePayments.businessEnabled = (invoiceInput.onlinePayments.modeCard || invoiceInput.onlinePayments.modeBank) ? true : false;
        }
        let invoice = await InvoiceModel.findOne({
            _id: invoiceId,
            isActive: true,
            isDeleted: false,
            businessId
        })
        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }

        if (!invoice.items || invoice.items.length <= 0) {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, {
                error: ""
            }, "A non draft invoice must have one or more items");
        }

        // Decide status
        invoiceInput.status = checkIfOverdue(invoiceInput.dueDate || invoice.dueDate, invoiceInput.status || invoice.status);
        if (invoice.status == 'paid') {
            invoiceInput.status = "paid";
        }

        await invoice.updateOne(invoiceInput);
        invoice = await InvoiceModel.findOne({
                _id: invoiceId,
                isActive: true,
                isDeleted: false,
                businessId
            })
            .populate("customer")
            .populate("business")
            .populate("payments")
            .populate("legal")
            .populate("amountBreakup.taxTotal.taxName");
        return okResponse(HTTP_OK, {
            invoice: invoice.toUserJson()
        }, SUCCESS);
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};
export const fetchStatusAmount = async businessId => {
    let business = await OrganizationModel.findById(businessId);
    let searchCondition = {
        businessId: new mongoose.Types.ObjectId(businessId),
        isDeleted: false,
        isActive: true
    };

    let currentDate = moment().format('YYYY-MM-DD');
    let afterOneMonthDate = moment().add(30, 'days').format('YYYY-MM-DD');

    let overDueInvoices = await InvoiceModel.aggregate([{
            $match: searchCondition
        },
        {
            $match: {
                status: "overdue" 
            }
        },
        {
            $group: {
                _id: "$status",
                totalAmount: {
                    $sum: "$totalAmountInHomeCurrency"
                },
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    //calculating dashboard total for over due invoices
    let overDue = 0
    if (overDueInvoices && overDueInvoices.length) {
        for (let i = 0; i < overDueInvoices.length; i++) {
            var homeCurr = parseFloat(overDueInvoices[i].totalAmountInHomeCurrency);
            if(homeCurr > 0) {
                overDue += homeCurr;
            } else {                
                overDue += parseFloat(overDueInvoices[i].totalAmount);
            }                   
        }
    }

    let dueInvoices = await InvoiceModel.aggregate([{
            $match: searchCondition
        },
        {
            $match: {
                dueDate: {
                    $gte: new Date(currentDate),
                    $lt: new Date(afterOneMonthDate)
                },
                status: {
                    $nin: ["paid", "draft"]
                }
            }
        },
        {
            $group: {
                _id: "$status",
                totalAmount: {
                    $sum: "$totalAmountInHomeCurrency"
                },
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    //calculating dashboard total for due invoices
    let due = 0
    if (dueInvoices && dueInvoices.length) {
        for (let i = 0; i < dueInvoices.length; i++) {
            var homeCurr = parseFloat(dueInvoices[i].totalAmountInHomeCurrency);
            if(homeCurr > 0) {
                due += homeCurr;
            } else {                
                due += parseFloat(dueInvoices[i].totalAmount);
            }                   
        }
    }

    let paidCondition = Object.assign({}, searchCondition);
    paidCondition.paidAmount = {
        $gt: 0
    };
    let paidInvoices = await InvoiceModel.find(paidCondition, {
        paidAmount: 1
    });
    const paidInvoiceIds = paidInvoices.map(i => i._id);
    const paidPayments = await PaymentModel.aggregate([{
            $match: {
                invoiceId: {
                    $in: paidInvoiceIds
                },
                status: "SUCCESS",
                isDeleted: false,

            }
        },
        {
            $group: {
                _id: "$status",
                totalAmount: {
                    $sum:  { 
                        "$multiply" : ["$amountInHomeCurrency", "$exchangeRate"]
                    }
                },
                count: {
                    $sum: 1
                }
             }
        }
    ]);
    let paid = 0
    if (paidPayments && paidPayments.length) {
        paid = paidPayments[0].totalAmount; 
    }

    let invoiceDashboardData = {
        currency: business.currency,
        overdue: getSafeAmount(overDue),
        paidThisMonth: getSafeAmount(paid),
        due: getSafeAmount(due)
    }
    return okResponse(HTTP_OK, {
        invoiceDashboardData
    }, SUCCESS);

}

const getSafeAmount = (number) => {
    return (parseFloat(number)).toFixed(2);
}
// Status matrix in descending order => paid -> overdue -> partial -> viewed -> sent/skipped-> unsent
// case |Back from overdue|   amount change   |   Status
//  1   |      no         |       no          |   same
//  2   |      no         |       yes         |   paidAmount>=totalAmount -> paid else partial ( if not overdue)
//  3   |      yes        |       no          |   follow status matrix to decide next status
//  4   |      yes        |       yes         |   status matrix result -> check if paidAmount>0 then override matrix result with paid else use status matrix result
export const updateInvoice = async (id, invoiceInput, user, businessId) => {
    try {
        let invoice = await InvoiceModel.findOne({
            _id: id,
            isActive: true,
            isDeleted: false,
            businessId
        }).populate("payments");
        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND);
        }

        // Check date
        invoiceInput = calculateNewStatus(invoiceInput, invoice);

        invoiceInput.items = await buildProduct(invoiceInput, user, businessId);
        await invoice.updateOne(invoiceInput);
        invoice = await InvoiceModel.findById(id);
        return okResponse(HTTP_OK, {
            invoice: invoice.toUserJson()
        }, SUCCESS);
    } catch (error) {
        return errorResponse(500, error, FAILED);
    }
};


export const updateReminder = async (id, reminderInput, user, businessId) => {
    try {
        let invoice = await InvoiceModel.findOne({
            _id: id,
            isActive: true,
            isDeleted: false,
            businessId,
            isRecurring: false,
        });
        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, NULL, FAILED);
        }
        reminderInput.isReminder = true;
        await invoice.updateOne(reminderInput);
        invoice = await InvoiceModel.findById(id);
        return okResponse(HTTP_OK, {
            invoice: invoice.toUserJson()
        }, SUCCESS);
    } catch (error) {
        return errorResponse(500, error, FAILED);
    }
}


export const deleteInvoice = async (id, user, businessId) => {
    try {
        let invoice = await InvoiceModel.findOne({
            _id: id,
            isActive: true,
            isDeleted: false,
            businessId,
            isRecurring: false
        });
        if (!invoice) {
            return errorResponse(400, invoice, FAILED);
        }
        await invoice.updateOne({
            isDeleted: true,
            isActive: false
        });

        return okResponse(HTTP_OK, {
            deleteInvoice: true
        }, SUCCESS);
    } catch (error) {
        return errorResponse(500, error, FAILED);
    }
};

export const fetchInvoiceCount = async (businessId, {
    status,
    customer,
    startDate,
    endDate,
    invoiceNumber,
    tab
}) => {
    try {
        let searchCondition = {
            isDeleted: false,
            businessId: new mongoose.Types.ObjectId(businessId),
            isActive: true
        };

        if (status) {
            if (status === "unsent") {
                status = "saved";
            }
            switch (status) {
                case "unpaid":
                    searchCondition.status = {
                        $in: ["saved", "sent", "viewed", "partial", "overdue"]
                    };
                    break;
                case "draft":
                    searchCondition.status = "draft";
                default:
                    searchCondition.status = status;
                    break;
            }
        }

        if (customer) {
            searchCondition.customer = new mongoose.Types.ObjectId(customer);
        }

        if (startDate && !endDate) {
            searchCondition.invoiceDate = {
                $gte: new Date(startDate)
            }
        }

        if (endDate && !startDate) {
            searchCondition.invoiceDate = {
                $lte: new Date(endDate)
            }
        }

        if (startDate && endDate) {
            searchCondition.invoiceDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }

        if (invoiceNumber && isValidNumber(invoiceNumber)) {
            searchCondition.invoiceNumber = invoiceNumber;
        }

        let invoiceCountData = await InvoiceModel.aggregate([{
            $match: searchCondition
        }, {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        }]);

        let draft = 0,
            unpaid = 0,
            total = 0,
            paid = 0,
            partial = 0,
            saved = 0;
        for (let i = 0; i < invoiceCountData.length; i++) {
            let invoiceObj = invoiceCountData[i];
            if (invoiceObj._id === 'draft') {
                draft = invoiceObj.count;
            } else if (invoiceObj._id === "paid") {
                paid = invoiceObj.count;
            } else if (invoiceObj._id === "partial") {
                partial = invoiceObj.count;
            } else if (invoiceObj._id === "saved") {
                saved = invoiceObj.count;
            }
            total += invoiceObj.count;
        }

        unpaid = total - (draft + paid);

        const invoiceCount = {
            draft,
            unpaid,
            total
        }
        return okResponse(HTTP_OK, {
            invoiceCount
        }, SUCCESS);
    } catch (error) {
        console.error(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const cloneInvoice = async (id, businessId, user) => {
    if (!id) {
        return okResponse(HTTP_OK, null, "Invoice ID not found");
    }
    try {
        let invoice = await InvoiceModel.findById(id);
        let clonedInvoice = invoiceInput(invoice); //getInvoiceObject(invoice);
        let invoiceNumber = await getLatestInvoiceNumber(businessId, user);
        clonedInvoice.invoiceNumber = invoiceNumber;
        clonedInvoice.uuid = uuidv4();
        clonedInvoice.createdFrom = "invoice";
        clonedInvoice.other = {
            clonedFromInvoiceId: id
        }
        if (!clonedInvoice.publicView) {
            clonedInvoice.publicView = {}
        }
        clonedInvoice.publicView["shareableLinkUrl"] = PUBLIC_URL + "/public/invoice/" + clonedInvoice.uuid;
        invoice = new InvoiceModel(clonedInvoice);
        invoice = await invoice.save();
        return okResponse(HTTP_CREATED, {
            invoice
        }, "success");
    } catch (error) {
        console.error(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
}

const getInvoiceObject = (invoiceObject) => {
    return {
        "amountBreakup": invoiceObject.amountBreakup,
        "invoice": invoiceObject.invoice,
        "status": "draft",
        "title": invoiceObject.title,
        "subTitle": invoiceObject.subTitle,
        "customer": invoiceObject.customer,
        "currency": invoiceObject.currency,
        "exchangeRate": invoiceObject.exchangeRate,
        "invoiceDate": invoiceObject.invoiceDate,
        "dueDate": invoiceObject.dueDate,
        "footer": invoiceObject.footer,
        "memo": invoiceObject.memo,
        "items": invoiceObject.items,
        "totalAmount": invoiceObject.totalAmount,
        "totalAmountInHomeCurrency": invoiceObject.totalAmountInHomeCurrency,
        "userId": invoiceObject.userId,
        "businessId": invoiceObject.businessId,
        "taxes": invoiceObject.taxes
    }
}

export const getLatestInvoiceNumber = async (businessId, user) => {
    try {
        let searchCondition = {
            businessId,
            userId: user._id,
            isRecurring: false
        };
        let invoices = await InvoiceModel.find(searchCondition).
        sort({
            createdAt: -1
        });
        if (invoices && invoices.length)
            return invoices[0].invoiceNumber + 1;
        return 1;
    } catch (error) {
        throw new Error("Cannot generate Invoice Number");
    }
}


export const createLatestInvoiceNumber = async (businessId, user) => {
    try {
        let searchCondition = {
            isDeleted: false,
            businessId,
            userId: user._id,
            isActive: true
        };
        let invoices = await InvoiceModel.find(searchCondition).
        sort({
            createdAt: -1
        });
        if (invoices[0]) {
            return okResponse(HTTP_OK, {
                invoiceNumber: invoices[0].invoiceNumber + 1
            }, "success");
        } else {
            return okResponse(HTTP_OK, {
                invoiceNumber: +1
            }, "success");
        }
    } catch (error) {
        console.error(error);
        return errorResponse(500, error, "error");
    }
}

export const fetchInvoiceByUUID = async (uuid, isInternal) => {
    try {
        let invoice = await InvoiceModel.findOne({
                uuid,
                isActive: true,
                isDeleted: false
            })
            .populate("customer")
            .populate("business")
            .populate({
                path: "legal",
                select: 'verification isConnected'
            })
            // .populate("payments")
            .populate("amountBreakup.taxTotal.taxName");
        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, null, "Seems this invoice doesn't exist");
        }
        const paymentDetail = await fetchInvoicePayments(invoice._id, invoice.businessId);
        let payments = [];
        if (paymentDetail && paymentDetail.statusCode == 200) {
            payments = paymentDetail.data && paymentDetail.data.payments ? paymentDetail.data.payments : [];
        }
        if (invoice.status != "draft" && !isInternal) {
            if (invoice.status != "overdue" && invoice.status != "paid" && invoice.status != "partial") {
                invoice.status = "viewed";
            }
            if (!invoice.report || !invoice.report.viewCount) {
                invoice.report = {
                    viewCount: 1,
                    lastViewedOn: new Date()
                };
            } else {
                invoice.report.lastViewedOn = new Date();
                invoice.report.viewCount = invoice.report.viewCount + 1;
            }
            await invoice.save();
        }
        const businessId = invoice.businessId._id;
        const salesSetting = await SalesSettingModel.findOne({
            businessId
        });
        const userInfo = await UserModel.findById(invoice.userId);
        return okResponse(HTTP_OK, {
            invoice: invoice.toPublicJson(),
            payments: payments,
            salesSetting,
            userInfo: userInfo.toPublicJson()
        }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

const addShareableLink = async (invoice) => {
    await invoice.updateOne(invoice);
    invoice = await InvoiceModel.findById(invoice._id).populate("customer").populate("businessId").populate("payments");
    return invoice;
}


export const convertInvoice = async (id, businessId, user) => {
    if (!id) {
        return okResponse(HTTP_OK, null, "Invoice ID not found");
    }
    try {
        let estimate = await InvoiceModel.findById(id);
        if (!estimate) {
            return errorResponse(HTTP_NOT_FOUND, error, "Invoice not found");
        }
        let input = recurringInput(estimate);
        let invoiceNumber = await getLatestInvoiceNumber(businessId, user);
        //TODO: Set the payload according to Invoice
        input.invoiceNumber = invoiceNumber;
        return addRecurrence(input, user, businessId);
    } catch (error) {
        console.log(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
}

export const fetchInvoicePayments = async (invoiceId, businessId) => {
    let payments = await PaymentModel.find({
        businessId: businessId,
        status: "SUCCESS",
        invoiceId,
        isDeleted: false
    });
    payments = payments.map(p => p.toInvoiceJson());

    let refunds = await RefundModel.find({
            businessId: businessId,
            status: "REFUNDED",
            invoiceId,
            isDeleted: false
        })
        .populate("paymentDetail");
    refunds = refunds.map(p => p.toInvoiceJson());

    let allData = [...payments, ...refunds];
    if (!allData || allData.length == 0) {
        return errorResponse(HTTP_OK, null, "No data found");
    }
    allData.sort(function compare(a, b) {
        var dateA = new Date(a.createdAt);
        var dateB = new Date(b.createdAt);
        return dateB - dateA;
    });
    return okResponse(HTTP_OK, {
        payments: allData
    }, SUCCESS);
}

export const exportInvoiceToPdf = async (invoiceUuid, businessId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let invoiceResp = await fetchInvoiceByUUID(invoiceUuid, true);
            if (invoiceResp.statusCode != HTTP_OK) {
                resolve(invoiceResp);
            } else {
                const templateCode = getTemplateCode("invoice", invoiceResp.data.salesSetting.template);
                let output = await pdfEngine.exportPdf(invoiceResp.data, templateCode);
                resolve(output);
            }
        } catch (e) {
            console.log("Error while getting output from pdf engine");
            reject(e);
        }
    })
}
// To be used internally
export const updateInvoicePayment = async (invoiceId, paidAmount, paymentId) => {
    try {
        let invoice = await InvoiceModel
            .findOne({
                _id: invoiceId,
                isActive: true,
                isDeleted: false
            });

        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }

        let payments = invoice.payments || [];

        if (invoice.status === 'sent' || invoice.status === 'saved' || invoice.status === 'viewed' || invoice.skipped === true || invoice.status === 'overdue' || invoice.status === 'partial') {
            let dueAmount = (invoice.dueAmount - paidAmount).toFixed(2);
            payments.push(paymentId);

            let invoiceInput = {
                payments,
                dueAmount
            };
            invoiceInput.paidAmount = getSafeAmount(parseFloat(invoice.paidAmount) + parseFloat(paidAmount));
            invoiceInput.lastPaidOn = moment.now();
            if (dueAmount <= 0) {
                invoiceInput.status = "paid";
                invoiceInput.isReminder = false;
                if (!invoice.lastSent || invoice.lastSent == null) {
                    // This invoice was never sent and has been paid directly. Mark it as skipped
                    invoiceInput.skipped = true;
                    invoiceInput.sentVia = "skipped";
                    invoiceInput.skippedDate = new Date();
                }
            } else if (dueAmount > 0 && invoice.status !== "overdue") {
                invoiceInput.status = "partial";
            }
            await invoice.updateOne(invoiceInput);
            return okResponse(HTTP_OK, {
                invoice: invoice.toUserJson()
            }, "Payment on invoice updated successfully");
        } else {
            return errorResponse(HTTP_BAD_REQUEST, NULL, "Payment is not allowed at this stage of the invoice");
        }
    } catch (error) {
        console.error("Error on updating payment on invoice => ", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), "Failed to update payment status on invoice");
    }
};

function checkIfOverdue(dueDate, status) {
    const today = moment({
        hour: 0,
        minute: 0,
        second: 0
    }).utc();
    if (moment(dueDate) < today) {
        return "overdue";
    } else
        return status;
}

const getInvoiceDataPostPayment = (paidAmount, invoice, invoiceInput) => {
    // Add completely - plus amount 
    // Remove completely- minus amount
    // Add partially - plus amount
    // Remove partially - minus amount
    invoiceInput.dueAmount = invoice.dueAmount - paidAmount;
    invoiceInput.paidAmount = invoice.paidAmount + paidAmount;

    if (invoiceInput.paidAmount >= invoice.totalAmount) {
        invoiceInput.status = 'paid';
        invoiceInput.isReminder = false;
    }
    // If status returning from paid then follow status matrix to decide new status
    else if (invoice.status == 'paid') {
        const today = moment({
            hour: 0,
            minute: 0,
            second: 0
        }).utc();
        if (moment(invoice.dueDate) < today)
            invoiceInput.status = "overdue";
        else if (invoiceInput.paidAmount > 0)
            invoiceInput.status = "partial";
        else if (invoice.report.lastViewedOn && invoice.report.lastViewedOn != null)
            invoiceInput.status = "viewed";
        else if (invoice.lastSent)
            invoiceInput.status = "sent";
        else
            invoiceInput.status = "saved";
    } else {
        // Leave status as is
        console.log("case 1 execution");
    }
}

function calculateNewStatus(invoiceInput, invoice) {
    const today = moment({
        hour: 0,
        minute: 0,
        second: 0
    }).utc();
    if (moment(invoiceInput.dueDate) < today) {
        invoiceInput.status = "overdue";
    } else if (invoice.status == 'overdue') {
        // Back from overdue spotted
        // case 3 execution
        if (invoice.paidAmount > 0)
            invoiceInput.status = "partial";
        else if (invoice.report.lastViewedOn && invoice.report.lastViewedOn != null)
            invoiceInput.status = "viewed";
        else if (invoice.lastSent)
            invoiceInput.status = "sent";
        else
            invoiceInput.status = "saved";
    } else {
        // case 1 execution
        console.log("case 1 execution");
    }
    if (invoice.totalAmount != invoiceInput.totalAmount) {
        // Amount change spotted
        // 1. calculate due amount
        // 2. calculate status
        invoiceInput.dueAmount = getSafeAmount(invoiceInput.totalAmount - invoice.paidAmount);
        // case 2 & case 4 execution
        if (invoice.paidAmount >= invoiceInput.totalAmount) {
            invoiceInput.status = "paid";
            invoiceInput.isReminder = false;
        } else if (invoiceInput.status != "overdue" && invoice.paidAmount > 0) {
            invoiceInput.status = "partial";
        }
    }
    return invoiceInput;
}