import { BillModel } from "../../models/purchase/bill.model";
import { BillPaymentModel } from "../../models/purchase/bill_payment.model";
import { okResponse, errorResponse } from "../../util/HttpResponse";
import { getSafeAmount, getToday } from "./../../util/utils";
import { HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND } from "../../util/constant";

export const addBill = async (billInput) => {
    let bill = new BillModel(billInput);
    bill.dueAmount = billInput.totalAmount;
    bill.totalAmountInHomeCurrency = getSafeAmount(billInput.exchangeRate * billInput.totalAmount);
    console.log('bill.paidAmount ', bill.paidAmount);
    console.log('bill.totalAmount ', bill.totalAmount);
    bill.status = bill.paidAmount >= bill.totalAmount ? 'paid' : 'unpaid';
    try {
        bill = await bill.save();
        return okResponse(HTTP_CREATED, { bill: bill.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchBills = async (businessId, filter) => {
    console.log("--------get bills services--------->", businessId);
    let { vendorId, startDate, endDate } = filter;
    try {
        let query = BillModel.find({
            isActive: true,
            isDeleted: false,
            businessId
        })
        if (vendorId) {
            query.where("vendor").equals(vendorId);
        }
        if (startDate) {
            query.where("billDate").gte(startDate);
        }
        if (endDate) {
            query.where("billDate").lte(endDate);
        }
        query.sort({ billDate: -1 })
        query.populate({ path: 'vendor', select: "vendorName vendorType firstName lastName" })
        let bills = await query.exec();
        return okResponse(HTTP_OK, { bills: bills.map(v => v.toUserJson()) }, "success");
    } catch (error) {
        console.log("====================================", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchBillById = async id => {
    try {
        let bill = await BillModel.findOne({ _id: id, isActive: true, isDeleted: false })
            .populate({ path: 'vendor' });
        if (!bill) {
            return errorResponse(HTTP_NOT_FOUND, null, ERROR_NOT_FOUND);
        }
        return okResponse(HTTP_OK, { bill: bill.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const updateBill = async (id, billInput, businessId) => {
    try {
        let bill = await BillModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        billInput.totalAmountInHomeCurrency = getSafeAmount(billInput.exchangeRate * billInput.totalAmount);
        billInput.dueAmount = getSafeAmount(billInput.totalAmount - bill.paidAmount);
        billInput.status = billInput.totalAmount > bill.paidAmount ? 'unpaid' : 'paid';
        if (!bill) {
            return errorResponse(HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND);
        }

        await bill.updateOne(billInput);
        bill = await BillModel.findById(id);
        return okResponse(200, { bill: bill.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const deleteBill = async (id, businessId) => {
    try {
        let bill = await BillModel.findOne({ _id: id, isActive: true, isDeleted: false, businessId });
        if (!bill) {
            return errorResponse(HTTP_NOT_FOUND, true, ERROR_NOT_FOUND);
        }
        await bill.updateOne({ isDeleted: true, isActive: false });

        return okResponse(200, { deleteBill: true }, "success");
    } catch (error) {
        return errorResponse(500, error, "failed");
    }
};

export const duplicateBill = async (billId, businessId) => {
    try {
        let bill = await BillModel.findOne({ _id: billId, isActive: true, isDeleted: false, businessId });
        if (!bill) {
            return errorResponse(HTTP_NOT_FOUND, NULL, ERROR_NOT_FOUND);
        }
        let newBill = {
            billNumber: (bill.billNumber || "") + "-copy",
            vendor: bill.vendor,
            currency: bill.currency,
            exchangeRate: bill.exchangeRate,
            billDate: getToday(),
            expiryDate: getToday(),
            purchaseOrder: bill.purchaseOrder,
            notes: bill.notes,
            amountBreakup: bill.amountBreakup,
            totalAmount: bill.totalAmount,
            dueAmount: bill.dueAmount,
            paidAmount: bill.paidAmount,
            totalAmountInHomeCurrency: bill.totalAmountInHomeCurrency,
            items: bill.items,
            status: "unpaid",
            userId: bill.userId,
            businessId: bill.businessId
        }
        newBill = new BillModel(newBill);
        newBill = await newBill.save();
        return okResponse(HTTP_OK, { bill: newBill.toUserJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const fetchBillPayment = async id => {
    try {
        let payments = await BillPaymentModel.find({ billId: id, isActive: true, isDeleted: false });
        return okResponse(HTTP_OK, { payments: payments.map(p => p.toUserJson()) }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const recordBillPayment = async (paymentInput, billId, businessId) => {
    try {
        let bill = await BillModel.findOne({ _id: billId, isActive: true, isDeleted: false, businessId });
        if (!bill) {
            return errorResponse(HTTP_NOT_FOUND, null, ERROR_NOT_FOUND);
        }
        console.log("bill.paidAmount + paymentInput.amount", (bill.paidAmount + paymentInput.amount));
        console.log("bill total ", bill.totalAmount);
        let billPaymentStatus = 'unpaid';
        if ((bill.paidAmount + paymentInput.amount) >= bill.totalAmount) {
            billPaymentStatus = 'paid';
        }
        paymentInput.billId = billId;
        paymentInput.currency = bill.currency;
        let payment = new BillPaymentModel(paymentInput);
        payment = await payment.save();
        if (payment._id) {
            await BillModel.findByIdAndUpdate(billId, {
                $inc: {
                    paidAmount: paymentInput.amount,
                    dueAmount: -1 * paymentInput.amount
                },
                $set: {
                    status: billPaymentStatus
                }
            })
            return okResponse(HTTP_OK, { payment: payment.toUserJson() }, "success");
        } else {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, null, "Failed to record payment for this bill");
        }
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }

};
export const deleteBillPayment = async id => {
    try {
        let payment = await BillPaymentModel.findOne({ _id: id, isActive: true, isDeleted: false });
        if (!payment) {
            return errorResponse(HTTP_NOT_FOUND, null, ERROR_NOT_FOUND);
        }
        await payment.updateOne({ isDeleted: true, isActive: false });

        let bill = await BillModel.findOne({ _id: payment.billId });
        if (!bill) {
            console.log('bill not found for payment ', payment.toUserJson());
        } else {
            bill.paidAmount = getSafeAmount(bill.paidAmount - payment.amount);
            console.log('bill.totalAmount - bill.paidAmount', getSafeAmount(bill.totalAmount - bill.paidAmount));
            bill.dueAmount = getSafeAmount(bill.totalAmount - bill.paidAmount);
            console.log('due ', bill.dueAmount);
            bill.status = bill.totalAmount > bill.paidAmount ? 'unpaid' : 'paid';
            await bill.save();
        }

        return okResponse(200, { deletePayment: true }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};