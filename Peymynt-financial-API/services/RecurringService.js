import { RecurringModel } from "../models/recurring.model";
import { okResponse, errorResponse } from "../util/HttpResponse";
import { HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_NOT_FOUND, HTTP_BAD_REQUEST, OK, NULL, SUCCESS, FAILED, PUBLIC_URL, HTTP_CONFLICT } from "../util/constant";
import { InvoiceModel } from "../models/invoice.model";
import { PaymentModel } from '../models/payment.model';
import { EstimateModel } from '../models/estimate.model';
import { OrganizationModel } from "../models/organization.model";
import mongoose from "mongoose";
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import { isValidObjectId, isValidNumber } from "../util/utils";
import { invoiceInput } from "../util/InvoiceUtil";
import { currentExchangeRate } from "../util/openexchange";
import { addProduct } from './ProductService';
import { calculateNextRecurringInvoiceDate } from '../util/recurringUtil';

export const addRecurrence = async (invoiceInput, user, businessId) => {
    try {
        // let recurring = await RecurringModel.findOne({ invoiceNumber: invoiceInput.invoiceNumber, isActive: true, isDeleted: false, businessId });
        // if (recurring) {
        //     return errorResponse(HTTP_CONFLICT, null, "Recurring already exists with this number");
        // }
        // invoiceInput.totalAmount = (invoiceInput.totalAmount).toFixed(2);
        invoiceInput.items = await buildProduct(invoiceInput, user, businessId);
        invoiceInput.dueAmount = invoiceInput.totalAmount;
        let invoice = new RecurringModel(invoiceInput);
        invoice = await invoice.save();
        invoice.publicView["shareableLinkUrl"] = PUBLIC_URL + "/public/invoice/" + invoice.uuid;
        invoice = await addShareableLink(invoice);
        return okResponse(HTTP_CREATED, { invoice }, "Recurring Added successfully");
    } catch (error) {
        console.error("add error recurring => ", error);
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
                console.log("Taxes : " + JSON.stringify(taxes));
            }
            let productInput = {
                userId: user._id,
                businessId: businessId,
                name: (inputItem && inputItem.column1) || "",
                description: (inputItem && inputItem.column2) || "",
                price: (inputItem && inputItem.column4) || "",
                buy: { allowed: false },
                sell: { allowed: true },
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

export const fromEstimateToInvoice = async (estimateId, businessId, user) => {
    try {
        let estimateData = await EstimateModel.findOne({ _id: estimateId });
        console.log('Estimate data -------------------------->', estimateData);
        if (estimateData) {
            let estimateItem =  estimateItems(estimateData.items);
            let invoiceDatam = {
                name : estimateData.name,
                title : null,
                subTitle : null,
                invoiceNumber : "123",
                isRecurring : true,
                recurrence : {},
                exchangeRate : estimateData.exchangeRate,
                purchaseOrder : estimateData.purchaseOrder,
                invoiceDate :  Date.now() ,
                dueDate :  Date.now(),
                skipped : false,
                isReminder : false,
                beforeThree :{
                    enable: false,
                    notifyDate: null,
                },
                beforeSeven: {
                    enable: false,
                    notifyDate: null,
                },
                beforeFourteen: {
                    enable: false,
                    notifyDate: null,
                },
                onDueDate: {
                    enable: false,
                    notifyDate: null,
                },
                afterThree: {
                    enable: false,
                    notifyDate: null,
                },
                afterSeven: {
                    enable: false,
                    notifyDate: null,
                },
                afterFourteen: {
                    enable: false,
                    notifyDate: null
                },
                uuid : uuidv4,
                customer : estimateData.customer,
                currency : estimateData.currency,
                postal: estimateData.postal,
                footer : estimateData.footer,
                notes : null,
                amountBreakup : estimateData.amountBreakup,
                totalAmount : estimateData.totalAmount,
                dueAmount: 0,
                totalAmountInHomeCurrency :estimateData.totalAmountInHomeCurrency,
                publicView : estimateData.publicView,
                items : estimateItem,
                itemHeading :{
                    column1 : {
                        name: "name"
                    },
                    column2 : {
                        name: "description"
                    },
                    column3 : {
                        name: "quantity"
                    },
                    column4 : {
                        name: "price"
                    },
                    hideItem : false,
                    hideDescription : false,
                    hideQuantity : false,
                    hidePrice : false,
                    hideAmount : false,
                    savedForFuture : false

                } ,
                taxes : estimateData.taxes,
                status : "draft",
                estimate : {
                    estimate : estimateData._id,
                    estimateNo : estimateData.estimateNumber
                },
                userId : estimateData.userId,
                businessId : estimateData.businessId,
                isActive : true,
                isDeleted : false,
            }
            console.log('Invoice Data -----', invoiceDatam);
            let invoice = new RecurringModel(invoiceDatam);
            invoice = await invoice.save();
            invoice.publicView["shareableLinkUrl"] = PUBLIC_URL + "/public/invoice/" + invoice.uuid;
            invoice = await addShareableLink(invoice);
            return okResponse(HTTP_CREATED, { invoice }, "Invoice Added successfully");
        }

    } catch (error) {
        console.error("add error invoice => ", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
}

const estimateItems = (items) => {
    let invoiceItems = [];
    items.forEach(it => {
        let data = {
            column1: it.name,
            column2: it.description,
            column3: it.quantity,
            column4: it.price,
            taxes: it.taxes
        }
        invoiceItems.push(data);
    })
    return invoiceItems;
}

export const editInvoicePayment = async (paymentInput, user, businessId, { invoiceId, paymentId }) => {
    try {
        console.log('invoiceId---', invoiceId, '- pid --', paymentId)
        let paymentData = await PaymentModel.findOne({ _id: paymentId, isDeleted: false, businessId, invoiceId });
        let invoice = await RecurringModel.findOne({ _id: invoiceId, isActive: true, isDeleted: false, businessId });
        console.log('--------paymentData ----', paymentData);

        if (!paymentData || !invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }

        let paymentAmt = invoice.dueAmount + paymentData.amount;
        let dueAmount = paymentAmt - paymentInput.amount;
        await paymentData.updateOne(paymentInput);
        await invoice.updateOne({ dueAmount });
        return okResponse(HTTP_CREATED, "Payment Updated successfully");
    } catch (error) {
        console.error("add error invoice => ", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
}


export const paymentInvoice = async (paymentInput, user, businessId, invoiceid) => {
    try {
        let invoice = await RecurringModel.findOne({ _id: invoiceid, isActive: true, isDeleted: false, businessId }).populate("payments");
        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }

        let payments = invoice.payments || [];

        if (invoice.status === 'sent' || invoice.skipped === true || invoice.status === 'overdue' || invoice.status === 'partial') {

            let payment = new PaymentModel(paymentInput);

            payment = await payment.save(paymentInput);
            let paidAmount = parseFloat(paymentInput.amount) || 0;

            payments.map(payment => {
                try {
                    paidAmount += payment.amount;
                } catch (error) {
                    console.log("Error parsing amount", payment.amount);
                }
            });
            let dueAmount = (invoice.totalAmount - paidAmount).toFixed(2);
            payments = payments.map(payment => payment._id);
            payments.push(payment._id);

            let invoiceInput = { payments, dueAmount };

            if (dueAmount <= 0) {
                invoiceInput.status = "paid";
                invoiceInput.isReminder = false;
            } else if (dueAmount > 0 && invoice.status !== "overdue") {
                invoiceInput.status = "partial";
            }
            await invoice.updateOne(invoiceInput);
            return okResponse(HTTP_CREATED, { payment }, "Payment Added Successfully");
        }
        else {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }
    } catch (error) {
        console.error("add error invoice => ", error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
}

export const removePayment = async ({ invoiceId, paymentId }, businessId) => {
    try {
        let invoice = await RecurringModel.findById({
            _id: invoiceId, isActive: true, isDeleted: false, isRecurring: true
        }).populate("payments");
        let payment = await PaymentModel.findById({ _id: paymentId, isDeleted: false, businessId, invoiceId });
        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }
        if (invoice && invoice.payments.length > 0) {
            let amount = (payment.amount + invoice.dueAmount).toFixed(2);
            await invoice.updateOne({ $pull: { payments: paymentId } });
            let invoiceUpdate = { dueAmount: amount };
            if (invoice.totalAmount <= amount) {
                if (invoice.dueData >= new Date().setHours(0, 0, 0, 0)) {
                    invoiceUpdate.status = "overdue";
                } else {
                    invoiceUpdate.status = "sent";
                }
            } else if (invoice.totalAmount > amount) {
                if (invoice.dueData >= new Date().setHours(0, 0, 0, 0)) {
                    invoiceUpdate.status = "overdue";
                } else {
                    invoiceUpdate.status = "partial";
                }
            }
            await invoice.updateOne(invoiceUpdate);
            await PaymentModel.updateOne({ _id: paymentId }, { isDeleted: true });
        }
        invoice = await RecurringModel.findById(invoiceId).populate("customer").populate("businessId").populate("payments");

        return okResponse(200, { invoice }, SUCCESS);

    } catch (error) {
        console.error(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const fetchInvoices = async (businessId, { offset = 0, limit = 1000, status, customer, startDate, endDate, invoiceNumber, tab }) => {
    console.log("--------get recurring services--------->", businessId);
    try {
        let searchCondition = {
            isDeleted: false,
            businessId,
            isActive: true,
            isRecurring: true
        };

        if (tab) {
            switch (tab) {
                case "active":
                    searchCondition.status = "active";
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
                case "active":
                    searchCondition.status = { $in: ["saved", "sent", "viewed", "partial", "overdue"] };
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
            searchCondition.invoiceDate = { $gte: startDate }
        }

        if (endDate && !startDate) {
            searchCondition.invoiceDate = { $lte: endDate }
        }

        if (startDate && endDate) {
            searchCondition.invoiceDate = { $gte: startDate, $lte: endDate }
        }

        if (invoiceNumber && isValidNumber(invoiceNumber)) {
            searchCondition.invoiceNumber = invoiceNumber;
        }

        let invoices = await RecurringModel.find(searchCondition).populate("businessId").populate("customer").populate("payments").populate("userId").skip(offset).limit(limit).sort({ createdAt : -1 });;
        console.log("Invoices ----------------> ", invoices);
        // invoices = await checkOverdueInvoices(invoices);
        // invoices = await checkInvoicesAction(invoices);
        return okResponse(HTTP_OK, { invoices }, SUCCESS);
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
                await invoices[i].updateOne({ status: "overdue" });
            }
        }
    }
    return invoices;
}

export const checkInvoicesAction = async (invoices) => {

    for (let i = 0; i < invoices.length; i++) {
        let action = "", row = invoices[i];
        if (row.status === "paid") {
            action = "View";
        }
        if (row.status === "saved") {
            action = "Send";
        }
        if (row.status === "draft") {
            action = "Approve";
        }
        if (row.status === "sent") {
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


export const fetchRecurrenceById = async (id, businessId) => {
    try {
        const validId = isValidObjectId(id);

        if (!validId) {
            return errorResponse(HTTP_BAD_REQUEST, { error: "Invalid ID passed" }, "Invalid ID passed");
        }

        let invoice = await RecurringModel.findById({
            _id: id, isActive: true, 
            isDeleted: false, isRecurring: true, businessId
        }).populate("customer").populate("businessId").populate("userId").populate("amountBreakup.taxTotal.taxName");

        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, error, FAILED);
        }

        return okResponse(HTTP_OK, { invoice }, SUCCESS);
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};


export const fetchRecurringById = async (id, businessId) => {
    try {
        console.log('---------------- Recurrence Id -----------', id);
        const validId = isValidObjectId(id);

        if (!validId) {
            return errorResponse(HTTP_BAD_REQUEST, { error: "Recurring Invalid ID passed" }, "Recurring Invalid ID passed");
        }

        let invoice = await RecurringModel.findById({
            _id: id, isActive: true, 
            isDeleted: false, isRecurring: true, businessId
        }).populate("customer").populate("businessId").populate("userId").populate("amountBreakup.taxTotal.taxName");

        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, error, FAILED);
        }

        return okResponse(HTTP_OK, { invoice }, SUCCESS);
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const patchInvoice = async (invoiceId, invoiceInput, businessId) => {
    try {
        let invoice = await RecurringModel.findOne({ _id: invoiceId, isActive: true, isRecurring: true, isDeleted: false, businessId })
        if (!invoice) {
            return errorResponse(HTTP_BAD_REQUEST, NULL, OK);
        }

        if (!invoice.items || invoice.items.length <= 0) {
            return errorResponse(HTTP_INTERNAL_SERVER_ERROR, { error: "" }, "A non draft invoice must have one or more items");
        }

        console.log(invoice.dueDate)
        if (invoice.dueDate < new Date().setHours(0, 0, 0, 0)) {
            invoiceInput.status = "overdue";
        }

        await invoice.updateOne(invoiceInput);
        invoice = await RecurringModel.findById(invoiceId).populate("businessId").populate("payments").populate("customer");
        return okResponse(200, { invoice }, SUCCESS);
    }
    catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};

export const fetchStatusAmount = async businessId => {
    try {
        let business = await OrganizationModel.findById(businessId);
        let searchCondition = {
            businessId: new mongoose.Types.ObjectId(businessId),
            isDeleted: false,
            isActive: true,
            isRecurring: true
        };

        let currentDate = moment().format('YYYY-MM-DD');
        let afterOneMonthDate = moment().add(30, 'days').format('YYYY-MM-DD');
        const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

        let statusAmount = {};
        let draft, overdue, saved, approved, cancelled, viewed, sent, partial, paid;
        let amount = await RecurringModel.aggregate([
            { $match: searchCondition },
            {
                $group:
                {
                    _id: "$status",
                    totalAmount: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        for (let i = 0; i < amount.length; i++) {
            statusAmount[amount[i]._id] = amount[i].totalAmount;
        }
        if (statusAmount) {
            draft = (statusAmount && statusAmount.draft) || 0;
            saved = (statusAmount && statusAmount.unsent) || 0;
            approved = (statusAmount && statusAmount.approved) || 0;
            cancelled = (statusAmount && statusAmount.cancelled) || 0;
            viewed = (statusAmount && statusAmount.viewed) || 0;
            sent = (statusAmount && statusAmount.sent) || 0;
            partial = (statusAmount && statusAmount.partial) || 0;
            overdue = (statusAmount && statusAmount.overdue) || 0;
            paid = (statusAmount && statusAmount.paid) || 0;
        }

        let dueAmount = 0;
        let paidAmount = 0;
        if (statusAmount && statusAmount.sent) {
            let sentCondition = {
                status: { $in: ["saved", "sent", "partial"] },
                businessId: new mongoose.Types.ObjectId(businessId),
                isDeleted: false,
                isActive: true,
                isRecurring: true,
                dueDate: { $gte: currentDate, $lte: afterOneMonthDate }
            }
            let dueData = await RecurringModel.find(sentCondition);
            for (let i = 0; i < dueData.length; i++) {
                let data = dueData[i];
                if (data.currency && data.currency.code != business.currency.code) {
                    const result = await currentExchangeRate(data.currency.code, business.currency.code);
                    if (result && result.data && result.data.exchangeRate) {
                        data.dueAmount *= result.data.exchangeRate;
                    }
                }
                dueAmount += data.dueAmount;
            }
        }

        if (statusAmount && statusAmount.paid) {
            let paidAvgCondition = {
                businessId: new mongoose.Types.ObjectId(businessId),
                status: 'paid',
                isDeleted: false,
                isActive: true,
                isRecurring: true,
                paidDate: { $gte: startOfMonth, $lte: endOfMonth }
            }
            let paidData = await RecurringModel.find(paidAvgCondition).populate("payments");

            paidData.forEach(data => {
                data.payments.map(payment => {
                    paidAmount += payment.amount;
                })
            });
        }
        let total = draft + saved + approved + cancelled + viewed + partial;
        let invoiceDashboardData = {
            currency: business.currency || {},
            overdue: overdue.toFixed(2),
            due: dueAmount.toFixed(2),
            paidThisMonth: paidAmount.toFixed(2)
        }
        return okResponse(HTTP_OK, { invoiceDashboardData }, SUCCESS);
    } catch (error) {
        console.error(error);
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, FAILED);
    }
};


export const updateInvoice = async (id, invoiceInput, user, businessId) => {
    try {
        console.log("Invoice Input  ---", invoiceInput)
        let invoice = await RecurringModel.findOne({
            _id: id, isActive: true, isDeleted: false, businessId, isRecurring: true
        });
        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, NULL, FAILED);
        }

        // let payments = invoice.payments || []
        // let paidAmount = 0;
        // payments.map(payment => {
        //     try {
        //         paidAmount += parseFloat(payment.amount);
        //     } catch (error) {
        //         console.log("Error parsing amount", payment.amount);
        //     }
        // });
        // let dueAmount = (invoiceInput.totalAmount - paidAmount).toFixed(2);
        // invoiceInput.dueAmount = dueAmount;

        // if (invoice.status != "draft" && invoice.status !== "unsent") {
        //     if (dueAmount <= 0) {
        //         invoiceInput.status = "paid";
        //         invoiceInput.isReminder = false;
        //     } else if (dueAmount > 0 && invoice.status !== "overdue") {
        //         invoiceInput.status = "partial";
        //     }
        // }
        invoiceInput.nextInvoiceDate = calculateNextRecurringInvoiceDate(invoiceInput.recurrence);
        await invoice.updateOne(invoiceInput);
        invoice = await RecurringModel.findById(id);
        return okResponse(200, { invoice }, SUCCESS);
    } catch (error) {
        return errorResponse(500, error, FAILED);
    }
};


export const updateReminder = async (id, reminderInput, user, businessId) => {
    try {
        let invoice = await RecurringModel.findOne({
            _id: id, isActive: true, isDeleted: false, businessId, isRecurring: true,
        });
        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, NULL, FAILED);
        }
        // invoiceInput.isReminder = true;
        await invoice.updateOne(invoiceInput);
        invoice = await RecurringModel.findById(id);
        return okResponse(200, { invoice }, SUCCESS);
    }
    catch (error) {
        return errorResponse(500, error, FAILED);
    }
}


export const deleteInvoice = async (id, user, businessId) => {
    try {
        let invoice = await RecurringModel.findOne({
            _id: id, isActive: true, isDeleted: false, businessId, isRecurring: true
        });
        if (!invoice) {
            return errorResponse(400, invoice, FAILED);
        }
        await invoice.updateOne({ isDeleted: true, isActive: false });

        return okResponse(200, { deleteInvoice: true }, SUCCESS);
    } catch (error) {
        return errorResponse(500, error, FAILED);
    }
};

export const fetchInvoiceCount = async (businessId, { status, customer, startDate, endDate, invoiceNumber, tab }) => {
    console.log("--------get invoice services -------->", businessId);
    try {
        let searchCondition = {
            isDeleted: false,
            businessId: new mongoose.Types.ObjectId(businessId),
            isActive: true,
            isRecurring: true
        };

        if (status) {
            if (status === "unsent") {
                status = "saved";
            }
            switch (status) {
                case "active":
                    searchCondition.status = { $in: ["saved", "sent", "viewed", "partial", "overdue"] };
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
            searchCondition.invoiceDate = { $gte: new Date(startDate) }
        }

        if (endDate && !startDate) {
            searchCondition.invoiceDate = { $lte: new Date(endDate) }
        }

        if (startDate && endDate) {
            searchCondition.invoiceDate = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }

        if (invoiceNumber && isValidNumber(invoiceNumber)) {
            searchCondition.invoiceNumber = invoiceNumber;
        }

        let invoiceCountData = await RecurringModel.aggregate([{ $match: searchCondition }, {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }]);

        let draft = 0, active = 0, total = 0, paid = 0, partial = 0, saved = 0;
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

        active = total - (draft + paid);

        const invoiceCount = {
            draft,
            active,
            total
        }
        return okResponse(HTTP_OK, { invoiceCount }, SUCCESS);
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
        let invoice = await RecurringModel.findById(id);
        let clonedInvoice = invoiceInput(invoice); //getInvoiceObject(invoice);
        let invoiceNumber = await getLatestInvoiceNumber(businessId, user);
        clonedInvoice.invoiceNumber = invoiceNumber;
        clonedInvoice.uuid = uuidv4;
        if (!clonedInvoice.publicView) {
            clonedInvoice.publicView = {}
        }
        clonedInvoice.publicView["shareableLinkUrl"] = PUBLIC_URL + "/public/invoice/" + clonedInvoice.uuid;
        invoice = new RecurringModel(clonedInvoice);
        invoice = await invoice.save();
        return okResponse(HTTP_CREATED, { invoice }, "success");
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

const getLatestInvoiceNumber = async (businessId, user) => {
    try {
        let searchCondition = {
            isDeleted: false,
            businessId, userId: user._id,
            isActive: true,
            isRecurring: true
        };
        let invoices = await RecurringModel.find(searchCondition).
            sort({ createdAt: -1 });
        return invoices[0].invoiceNumber + 1;
    } catch (error) {
        return 0;
    }
}


export const createLatestInvoiceNumber = async (businessId, user) => {
    try {
        let searchCondition = {
            isDeleted: false,
            businessId, userId: user._id,
            isActive: true
        };
        let invoices = await RecurringModel.find(searchCondition).
            sort({ createdAt: -1 });
        if (invoices[0]) {
            return okResponse(200, { invoiceNumber: invoices[0].invoiceNumber + 1 }, "success");
        } else {
            return okResponse(200, { invoiceNumber: +1 }, "success");
        }
    } catch (error) {
        console.error(error);
        return errorResponse(500, error, "error");
    }
}

export const fetchInvoiceByUUID = async uuid => {
    try {
        let invoice = await RecurringModel.findOne({
            uuid,
            isActive: true,
            isDeleted: false
        })
            .populate("customer")
            .populate("business")
            .populate("amountBreakup.taxTotal.taxName")
            .populate({ path: "legal", select: 'verification isConnected' });
        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, error, "failed");
        }
        return okResponse(HTTP_OK, { invoice: invoice.toPublicJson() }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "failed");
    }
};

export const recordInvoicePayment = async (invoiceInput, user, businessId, id) => {
    try {
        let invoice = await RecurringModel.findOne({
            _id: id, isActive: true, isDeleted: false, businessId, isRecurring: true
        });

        if (!invoice) {
            return errorResponse(HTTP_NOT_FOUND, NULL, FAILED);
        }

        await invoice.updateOne(invoiceInput);
        invoice = await RecurringModel.findById(id);
        return okResponse(200, { invoice }, SUCCESS);
    } catch (error) {
        return errorResponse(500, error, FAILED);
    }
}

const addShareableLink = async (invoice) => {
    await invoice.updateOne(invoice);
    invoice = await RecurringModel.findById(invoice._id).populate("customer").populate("businessId").populate("payments");
    return invoice;
}



