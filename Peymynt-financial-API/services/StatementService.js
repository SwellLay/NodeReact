import { okResponse, errorResponse } from "../util/HttpResponse";
import moment from "moment";
import { InvoiceModel } from '../models/invoice.model';
import { OrganizationModel } from '../models/organization.model';
import { CustomerModel } from '../models/customer.model';
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
import { getFormattedError } from '../util/utils';
import { PaymentModel } from '../models/payment1.model';
import { RefundModel } from '../models/refund.model';
import { StatementModel } from '../models/statement.model';

export const fetchUnpaidStatement = async (businessId, customerId, startDate, endDate) => {
    let statement = {};
    try {
        const business = await OrganizationModel.findById(businessId).populate('setting');
        const customer = await CustomerModel.findById(customerId);
        statement.business = business.toUserJson();
        statement.customer = customer;
        statement.filter = {
            "customerId": customerId,
            "startDate": startDate,
            "endDate": endDate,
            "scope": "unpaid"
        };

        let invoices = await InvoiceModel.find({
            isDeleted: false,
            isActive: true,
            customer: customerId,
            status: { $nin: ['draft', 'cancelled', 'paid'] },
            invoiceDate: { $gte: startDate },
            invoiceDate: { $lte: endDate },
            businessId
        }).sort({ createdAt: -1 });

        let totalAmountDue = 0;
        let totalAmount = 0;
        let totalAmountPaid = 0;
        let totalAmountInHomeCurrency = 0;
        var summary = {
            "overdue30": 0,
            "overdue60": 0,
            "overdue90": 0,
            "overdueAbove": 0
        };
        console.log('summary', JSON.stringify(summary))
        statement.details = invoices.map(i => {
            totalAmountDue += i.dueAmount;
            totalAmount += i.totalAmount;
            totalAmountPaid += 0;
            totalAmountInHomeCurrency += i.totalAmountInHomeCurrency;

            // calculating summary
            let firstDate = moment(endDate);
            let secondDate = moment(i.invoiceDate);
            let diff = firstDate.diff(secondDate, 'days');
            if (diff <= 30) {
                summary.overdue30 += i.dueAmount
            } else if (diff <= 60) {
                summary.overdue60 += i.dueAmount
            } else if (diff <= 90) {
                summary.overdue90 += i.dueAmount
            } else if (diff > 90) {
                summary.overdueAbove += i.dueAmount
            }
            return {
                _id: i._id,
                date: i.invoiceDate,
                dueDate: i.dueDate,
                invoiceNo: i.invoiceNumber,
                amount: i.totalAmount,
                amountPaid: 0,
                amountDue: i.dueAmount,
                totalAmountInHomeCurrency: i.totalAmountInHomeCurrency
            }
        })
        statement.total = {
            totalAmount,
            totalAmountPaid,
            totalAmountDue,
            totalAmountInHomeCurrency
        }
        // TODO Mocking summary
        statement.summary = [
            {
                label: 'Not yet due',
                value: "$" + statement.total.totalAmountPaid
            },
            {
                label: "1-30 days overdue",
                value: "$" + summary.overdue30
            },
            {
                label: "31-60 days overdue",
                value: "$" + summary.overdue60
            },
            {
                label: "61-90 days overdue",
                value: "$" + summary.overdue90
            },
            {
                label: ">90 days overdue",
                value: "$" + summary.overdueAbove
            },
            {
                label: "Total due",
                value: "$" + (parseFloat(summary.overdue30) + parseFloat(summary.overdue60) + parseFloat(summary.overdue90) + parseFloat(summary.overdueAbove))
            },
        ];
        return okResponse(200, { statement }, "success");
    } catch (error) {
        console.log("e2 : " + error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message);
    }
};

export const fetchStatement = async (businessId, customerId, startDate, endDate) => {
    console.log("Input : " + businessId);
    let statement = {};
    try {
        const business = await OrganizationModel.findById(businessId).populate('setting');
        const customer = await CustomerModel.findById(customerId);
        statement.business = business.toUserJson();
        statement.customer = customer;
        statement.filter = {
            "customerId": customerId,
            "startDate": startDate,
            "endDate": endDate,
            "scope": "both"
        };

        let invoices = await InvoiceModel.find({
            isDeleted: false,
            isActive: true,
            customer: customerId,
            status: { $nin: ['draft', 'cancelled', 'paid'] },
            createdAt: { $gte: startDate },
            createdAt: { $lte: endDate },
            businessId
        }).sort({ createdAt: -1 });

        // TODO Put customer check
        let payments = await PaymentModel.find({
            "status": "SUCCESS",
            "refund.isRefunded": false,
            "paymentType": "Invoice",
            // customer: customerId,
            createdAt: { $gte: startDate },
            createdAt: { $lte: endDate },
            businessId
        }).sort({ createdAt: -1 });

        let refunds = await RefundModel.find({
            "status": "REFUNDED",
            "paymentType": "Invoice",
            // customer: customerId,
            createdAt: { $gte: startDate },
            createdAt: { $lte: endDate },
            businessId
        }).sort({ createdAt: -1 });

        let totalBalance = 0;
        let totalInvoiced = 0;
        const processedInvoices = invoices.map(i => {
            totalInvoiced += i.totalAmount;
            return {
                _id: i._id,
                date: i.createdAt,
                dueDate: i.dueDate,
                invoiceNo: i.invoiceNumber,
                amount: i.totalAmount,
                type: "invoice"
            }
        })
        let totalPayments = 0;
        const processedPayments = payments.map(i => {
            totalPayments += i.amount.total
            return {
                date: i.createdAt,
                invoiceNo: "10",
                amount: i.amount.total,
                type: "payment",
                _id: "5c83cce60369f8315c0c68ce"
            }
        })
        let totalRefund = 0;
        const processedRefunds = refunds.map(i => {
            totalRefund += i.amount;
            return {
                date: i.createdAt,
                invoiceNo: "10",
                amount: i.amount,
                type: "refund",
                _id: "5c83cce60369f8315c0c68ce"
            }
        })

        let processedStatement = [...processedInvoices, ...processedPayments, ...processedRefunds];
        processedStatement.sort((a, b) => a.date - b.date);
        processedStatement = processedStatement.map(s => {
            if (s.type == 'invoice') {
                s.balance = totalBalance += s.amount;
            }
            else if (s.type == 'refund') {
                s.balance = totalBalance += (2 * s.amount)
            }
            else if (s.type == 'payment') {
                s.balance = totalBalance -= s.amount
            }
            return s;
        })
        // Append extra items balance
        const beginBalance = [{
            date: startDate,
            invoiceNo: "0",
            amount: 0.00,
            description: 'Beginning balance',
            type: "start"
        }];
        const endBalance = [{
            date: endDate,
            invoiceNo: "0",
            amount: totalBalance,
            description: 'Ending balance',
            type: "end"
        }];
        statement.details = [...beginBalance, ...processedStatement, ...endBalance];

        statement.total = {
            totalBalance
        }
        // TODO Mocking summary
        statement.summary = [
            {
                label: `Beginning balance ${moment(startDate).format("MMM DD, YYYY")}`,
                value: "$" + beginBalance.amount
            },
            {
                label: "Invoiced",
                value: "$" + totalInvoiced
            },
            {
                label: "Payments",
                value: "($" + totalPayments + ")"
            },
            {
                label: "Refunds",
                value: "$" + totalRefund
            },
            {
                label: `Ending balance ${moment(endDate).format("MMM DD, 2019")}`,
                value: "$" + totalBalance
            }
        ];
        return okResponse(200, { statement }, "success");
    } catch (error) {
        console.log("e2 : " + error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, getFormattedError(error), error.message);
    }
};

export const generateStatement = async (businessId, statementInput) => {
    try {
        statementInput.businessId = businessId;
        let statement = new StatementModel(statementInput);
        statement = await statement.save();
        return okResponse(201, { statement }, "success");
    } catch (error) {
        return errorResponse(500, error, error.message);
    }
};

export const getPublicStatement = async (statementUuid) => {
    try {
        let statement = await StatementModel.findOne({ uuid: statementUuid });
        if (!statement) {
            return errorResponse(404, undefined, "This statement is not available");
        }
        let data;
        if (statement.scope == "unpaid")
            data = await fetchUnpaidStatement(statement.businessId, statement.customerId, statement.startDate, statement.endDate);
        else
            data = await fetchStatement(statement.businessId, statement.customerId, statement.startDate, statement.endDate);
        if (data.statusCode == 200)
            return okResponse(200, data.data, "success");
        else
            return errorResponse(500, data.data, data.message);
    } catch (error) {
        return errorResponse(500, error, error.message);
    }
};
