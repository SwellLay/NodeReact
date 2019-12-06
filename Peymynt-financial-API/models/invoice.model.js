import mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';
import { getPaymentMethodIcon } from './common/util';
import formatDate from './common/date_formatter.middleware';
const itemSchema = mongoose.Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: "items"
    },
    column1: String,
    column2: String,
    column3: Number,
    column4: Number,
    taxes: [{
        type: Schema.Types.ObjectId,
        ref: "taxes"
    }],
    incomeAccount: {
        type: Schema.Types.ObjectId,
        ref: "accounts"
    },
    amount: Number,
    position: { type: Number, required: true, default: 0 }
}, { _id: false });

const schema = Schema({
    createdFrom: {
        type: String,
        enum: ['estimate', 'invoice', 'recurring', ''],
        default: ""
    },
    name: {
        type: String
    },
    invoiceLogo: {
        type: String,
        required: false
    },
    title: {
        type: String
    },
    subTitle: {
        type: String
    },
    invoiceNumber: {
        type: Number
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    payments: [{
        type: Schema.Types.ObjectId,
        ref: "payments",
        required: true
    }],
    recurrence: {
        recurrenceUnit: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly']
        },
        recurrenceInterval: Number,
        repeatOnDayOfMonth: Number,
        repeatOnDayOfWeek: Number,
        maxInvoices: Number,
        timezoneId: String,
        startDate: { type: Date, set: formatDate },
        endDate: { type: Date, set: formatDate }
    },
    exchangeRate: Number,
    purchaseOrder: String,
    invoiceDate: { type: Date, set: formatDate },
    dueDate: { type: Date, set: formatDate },
    sentDate: Date,
    skipped: {
        type: Boolean,
        default: false
    },
    skippedDate: Date,
    isReminder: Boolean,
    beforeThree: {
        enable: Boolean,
        notifyDate: { type: Date, set: formatDate },
        status: String
    },
    beforeSeven: {
        enable: Boolean,
        notifyDate: { type: Date, set: formatDate },
        status: String
    },
    beforeFourteen: {
        enable: Boolean,
        notifyDate: { type: Date, set: formatDate },
        status: String
    },
    onDueDate: {
        enable: Boolean,
        notifyDate: { type: Date, set: formatDate },
        status: String
    },
    afterThree: {
        enable: Boolean,
        notifyDate: { type: Date, set: formatDate },
        status: String
    },
    afterSeven: {
        enable: Boolean,
        notifyDate: { type: Date, set: formatDate },
        status: String
    },
    afterFourteen: {
        enable: Boolean,
        notifyDate: { type: Date, set: formatDate }
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "customers",
        required: true
    },
    currency: {
        code: String,
        name: String,
        symbol: String,
        displayName: String
    },
    postal: {
        type: String
    },
    footer: String,
    notes: String,
    amountBreakup: {
        subTotal: Number,
        taxTotal: [{
            taxName: {
                type: Schema.Types.ObjectId,
                ref: "taxes"
            },
            rate: Number,
            amount: Number
        }],
        total: Number
    },
    totalAmount: {
        type: Number,
        min: [1, "Total amount must be greater than 0"]
    },
    dueAmount: {
        type: Number,
        default: 0,
        validate: {
            validator: function (v) {
                console.log("v", v);
                console.log("v", Math.ceil(this.totalAmount));
                return v <= Math.ceil(this.totalAmount);
            },
            message: props => `Due amount can not be larger than total amount`
        }
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: [0, "Paid amount can't be negative"]
    },
    lastPaidOn: { type: Date, set: formatDate },
    totalAmountInHomeCurrency: Number,
    itemHeading: {
        column1: {
            name: {
                type: String,
                default: "Items"
            },
            shouldShow: {
                type: Boolean,
                default: true
            }
        },
        column2: {
            name: {
                type: String,
                default: "Quantity"
            },
            shouldShow: {
                type: Boolean,
                default: true
            }
        },
        column3: {
            name: {
                type: String,
                default: "Price"
            },
            shouldShow: {
                type: Boolean,
                default: true
            }
        },
        column4: {
            name: {
                type: String,
                default: "Amount"
            },
            shouldShow: {
                type: Boolean,
                default: true
            }
        },
        hideItem: {
            type: Boolean,
            default: false
        },
        hideDescription: {
            type: Boolean,
            default: false
        },
        hideQuantity: {
            type: Boolean,
            default: false
        },
        hidePrice: {
            type: Boolean,
            default: false
        },
        hideAmount: {
            type: Boolean,
            default: false
        },
        savedForFuture: {
            type: Boolean,
            default: false
        }
    },
    publicView: {
        id: {
            type: String,
            default: uuidv4
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        },
        shareableLinkUrl: {
            type: String,
            required: false
        }
    },
    items: [itemSchema],
    taxes: [
        {
            name: String,
            amount: Number
        }
    ],
    status: {
        type: String,
        enum: ["draft", "approved", "cancelled", "sent", "saved", "overdue", "paid", "partial", "unsent", "viewed"]
    },
    action: {
        type: String,
        enum: ["Approve", "View", "Send", "Resend", "Record a payment", "Send a reminder"]
    },
    url: {
        shortUrl: String,
        customerUrl: String
    },
    estimate: {
        estimate: {
            type: Schema.Types.ObjectId,
            ref: "estimates"
        },
        estimateNo: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "organizations",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }, //By default true means Active
    isDeleted: {
        type: Boolean,
        default: false
    },
    lastSent: {
        type: Date,
        required: false
    },
    sentVia: {
        type: String,
        required: false
    },
    deletedAt: {
        type: Date,
        required: false
    },
    onlinePayments: {
        businessEnabled: {
            type: Boolean,
            default: false
        },
        modeCard: {
            type: Boolean,
            default: false
        },
        modeBank: {
            type: Boolean,
            default: false
        },
        remarks: String,
        updatedAt: Date
    },
    report: {
        viewCount: Number,
        lastViewedOn: Date
    },
    other: Object
}, {
        timestamps: true
    });

schema.virtual("business", {
    ref: 'organizations',
    localField: 'businessId',
    foreignField: '_id',
    justOne: true
});

schema.virtual("legal", {
    ref: 'legals',
    localField: 'businessId',
    foreignField: 'businessId',
    justOne: true
});

schema.methods.toPublicJson = function () {
    let data = {
        createdFrom: this.createdFrom,
        onlinePayments: this.onlinePayments,
        createdAt: this.createdAt,
        uuid: this.uuid,
        status: this.status,
        purchaseOrder: this.purchaseOrder,
        postal: this.postal,
        skipped: this.skipped,
        userId: this.userId,
        totalAmount: this.totalAmount,
        totalAmountInHomeCurrency: this.totalAmountInHomeCurrency,
        exchangeRate: this.exchangeRate,
        items: this.items,
        notes: this.notes,
        footer: this.footer,
        invoiceDate: this.invoiceDate,
        dueDate: this.dueDate,
        lastSent: this.lastSent,
        sentVia: this.sentVia,
        isReminder: this.isReminder,
        invoiceNumber: this.invoiceNumber,
        subTitle: this.subTitle,
        title: this.title,
        name: this.name,
        _id: this._id,
        dueAmount: this.dueAmount,
        payments: this.payments,
        isRecurring: this.isRecurring,
        publicView: this.publicView,
        itemHeading: this.itemHeading,
        amountBreakup: this.amountBreakup,
        currency: this.currency,
        items: this.items
    };
    if (this.business) {
        data.businessId = {
            address: this.business.address,
            communication: this.business.communication,
            country: this.business.country,
            currency: this.business.currency,
            isActive: this.business.isActive,
            organizationName: this.business.organizationName,
            organizationType: this.business.organizationType,
            uuid: this.business.uuid,
            _id: this.business._id
        }
    }

    if (this.customer) {
        data.customer = {
            currency: this.customer.currency,
            communication: this.customer.communication,
            addressBilling: this.customer.addressBilling,
            addressShipping: this.customer.addressShipping,
            email: this.customer.email,
            customerName: this.customer.customerName,
            firstName: this.customer.firstName,
            lastName: this.customer.lastName,
            userId: this.customer.userId,
            isActive: this.customer.isActive,
            id: this.customer._id,
            _id: this.customer._id,
            other: this.other,
            isShipping: this.customer.isShipping
        }
    }

    data.onlinePayments = getOnlinePaymentStatus(this.legal, this.onlinePayments, this.business.currency.code, this.currency.code);

    if (this.payments && this.payments.length) {
        data.payments = this.payments.map(p => {
            let d = {
                manual: p.manual,
                _id: p._id,
                bank: p.bank,
                status: p.status,
                account: p.account,
                memo: p.memo,
                amount: p.amount,
                amountInHomeCurrency: p.amountInHomeCurrency,
                exchangeRate: p.exchangeRate,
                method: p.method,
                paymentDate: p.paymentDate,
                other: p.other,
                createdAt: p.createdAt
            }
            if (p.card && p.card.type) {
                d.card = {
                    type: getPaymentMethodIcon(p.card.type),
                    number: p.card.number,
                    cardHolderName: p.card.cardHolderName,
                    expiryMonth: p.card.expiryMonth,
                    expiryYear: p.card.expiryYear
                }
            }
            d.methodToDisplay = p.method;
            if (p.method == 'manual') {
                d.methodToDisplay = p.manual.type;
            }
            return d;
        })
    }
    return data;
}

function getOnlinePaymentStatus(legal, onlinePayments, businessCurrency, invoiceCurrency) {
    console.log(`invoiceCurrency ${invoiceCurrency}, businessCurrency ${businessCurrency} `)
    let onlinePaymentsToReturn = {
        systemEnabled: false,
        businessEnabled: false,
        modeCard: false,
        modeBank: false
    }
    let remarks;
    if (legal) {
        if (legal.isConnected) {
            if (legal.verification && legal.verification.isVerified) {
                if (businessCurrency == invoiceCurrency) {
                    onlinePaymentsToReturn.systemEnabled = true;
                    onlinePaymentsToReturn.modeCard = onlinePayments.modeCard;
                    onlinePaymentsToReturn.modeBank = onlinePayments.modeBank;
                    if (onlinePayments.businessEnabled) {
                        onlinePaymentsToReturn.businessEnabled = onlinePayments.modeCard || onlinePayments.modeBank ? true : false;
                    } else {
                        onlinePaymentsToReturn.businessEnabled = false;
                        remarks = "Online payment is disabled for this invoice";
                    }
                } else {
                    remarks = `Online payment is disabled for this invoice as the currency of this invoice '${invoiceCurrency}' is not supported`;
                }
            } else {
                remarks = "Some background verification is pending for this business";
            }
        } else {
            remarks = "Payment setup is not done for this business";
        }
    }
    onlinePaymentsToReturn.remarks = remarks;
    return onlinePaymentsToReturn;
}
schema.methods.toUserJson = function () {
    let data = {
        createdFrom: this.createdFrom,
        onlinePayments: this.onlinePayments,
        createdAt: this.createdAt,
        uuid: this.uuid,
        status: this.status,
        purchaseOrder: this.purchaseOrder,
        postal: this.postal,
        userId: this.userId,
        totalAmount: this.totalAmount,
        items: this.items,
        action: this.action,
        notes: this.notes,
        lastSent: this.lastSent,
        totalAmountInHomeCurrency: this.totalAmountInHomeCurrency,
        exchangeRate: this.exchangeRate,
        sentVia: this.sentVia,
        footer: this.footer,
        invoiceDate: this.invoiceDate,
        dueDate: this.dueDate,
        isReminder: this.isReminder,
        skipped: this.skipped,
        invoiceNumber: this.invoiceNumber,
        subTitle: this.subTitle,
        title: this.title,
        name: this.name,
        _id: this._id,
        dueAmount: this.dueAmount,
        payments: this.payments,
        isRecurring: this.isRecurring,
        publicView: this.publicView,
        itemHeading: this.itemHeading,
        amountBreakup: this.amountBreakup,
        currency: this.currency,
        items: this.items
    };
    if (this.business) {
        data.businessId = {
            address: this.business.address,
            communication: this.business.communication,
            country: this.business.country,
            currency: this.business.currency,
            isActive: this.business.isActive,
            organizationName: this.business.organizationName,
            organizationType: this.business.organizationType,
            uuid: this.business.uuid,
            _id: this.business._id
        }
    }

    if (this.customer) {
        data.customer = {
            currency: this.customer.currency,
            communication: this.customer.communication,
            addressBilling: this.customer.addressBilling,
            addressShipping: this.customer.addressShipping,
            email: this.customer.email,
            customerName: this.customer.customerName,
            firstName: this.customer.firstName,
            lastName: this.customer.lastName,
            userId: this.customer.userId,
            isActive: this.customer.isActive,
            id: this.customer._id,
            _id: this.customer._id,
            other: this.other,
            isShipping: this.customer.isShipping
        }
    }
    if (this.business && this.business.currency && this.legal)
        data.onlinePayments = getOnlinePaymentStatus(this.legal, this.onlinePayments, this.business.currency.code, this.currency.code);
    if (this.payments && this.payments.length) {
        data.payments = this.payments.map(p => {
            let d = {
                manual: p.manual,
                _id: p._id,
                bank: p.bank,
                status: p.status,
                account: p.account,
                memo: p.memo,
                amount: p.amount,
                amountInHomeCurrency: p.amountInHomeCurrency,
                exchangeRate: p.exchangeRate,
                method: p.method,
                paymentDate: p.paymentDate,
                other: p.other,
                createdAt: p.createdAt
            }
            if (p.card && p.card.type) {
                d.card = {
                    type: getPaymentMethodIcon(p.card.type),
                    number: p.card.number,
                    cardHolderName: p.card.cardHolderName,
                    expiryMonth: p.card.expiryMonth,
                    expiryYear: p.card.expiryYear
                }
            }
            d.methodToDisplay = p.method;
            if (p.method == 'manual') {
                d.methodToDisplay = p.manual.type;
            }
            return d;
        })
    }
    if (this.report) {
        data.lastViewedOn = this.report.lastViewedOn;
    }
    data.beforeThree = this.beforeThree;
    data.beforeSeven = this.beforeSeven;
    data.beforeFourteen = this.beforeFourteen;
    data.onDueDate = this.onDueDate;
    data.afterThree = this.afterThree;
    data.afterSeven = this.afterSeven;
    data.afterFourteen = this.afterFourteen;
    return data;
}

export const InvoiceModel = mongoose.model('invoices', schema);
