import mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';
import { getPaymentMethodIcon } from './common/util';

const schema = mongoose.Schema({
    paymentType: {
        type: String,
        enum: ["Invoice", "Checkout"],
        required: true
    },
    status: {
        type: String,
        enum: ["REFUNDED", "INITIATED"],
        required: true
    },
    currency: {
        code: String,
        name: String,
        symbol: String,
        displayName: String
    },
    refundDate: {
        type: Date,
        required: true
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    customer: {
        firstName: { type: String, required: true },
        lastName: String,
        phone: String,
        address: String,
        email: String
    },
    reason: String,
    remarks: String,
    invoiceId: {
        type: Schema.Types.ObjectId,
        ref: "invoices"
    },
    checkoutId: {
        type: Schema.Types.ObjectId,
        ref: "checkouts"
    },
    amount: {
        type: Number,
        required: true
    },

    payment: {
        type: {
            type: String,
            enum: ["Partial", "Full", "Null"]
        },
        date: Date,
        id: {
            type: Schema.Types.ObjectId,
            ref: "payments"
        }
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "organizations"
    },
    rawRefundResponse: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        required: false
    }
}, {
        timestamps: true
    });

schema.virtual("legal", {
    ref: 'legals',
    localField: 'businessId',
    foreignField: 'businessId',
    justOne: true
});

schema.virtual("invoice", {
    ref: 'invoices',
    localField: 'invoiceId',
    foreignField: '_id',
    justOne: true
});

schema.virtual("paymentDetail", {
    ref: 'payments',
    localField: 'payment.id',
    foreignField: '_id',
    justOne: true
});

schema.methods.toUserJson = function () {
    console.log("paymentDetail", this.paymentDetail);
    let data = {
        "id": this._id,
        "paymentType": this.paymentType,
        "status": this.status,
        "refundDate": this.refundDate,
        "customer": this.customer,
        "invoiceId": this.invoiceId,
        "checkoutId": this.checkoutId,
        "amount": this.amount,
        "userId": this.userId,
        "businessId": this.businessId,
        "payment": this.payment,
        "uuid": this.uuid,
        "reason": this.reason,
        "createdAt": this.createdAt
    }
    if (this.paymentDetail) {
        data.method = this.paymentDetail.method;
        data.other = this.paymentDetail.other;
        if (this.paymentDetail.card && this.paymentDetail.card.type) {
            const icon = getPaymentMethodIcon(this.paymentDetail.card.type);
            data.card = {
                type: icon,
                number: this.paymentDetail.card.number,
                cardHolderName: this.paymentDetail.card.cardHolderName,
                expiryMonth: this.paymentDetail.card.expiryMonth,
                expiryYear: this.paymentDetail.card.expiryYear
            }
            data.paymentIcon = icon;
        } else if (this.paymentDetail.bank) {
            data.paymentIcon = 'bank';
            data.bank = {
                type: 'bank',
                name: this.paymentDetail.bank.name,
                number: this.paymentDetail.bank.number
            }
        }
    }

    data.currency = this.currency
    if (this.legal && this.legal.account) {
        data.ownAccount = {
            "accountNumber": this.legal.account.accountNumber,
            "bankName": this.legal.account.bankName,
            "accountName": this.legal.account.accountName,
        }
    }
    return data;
}

schema.methods.toInvoiceJson = function () {
    let data = {
        type: "refund",
        paymentType: this.paymentType,
        status: this.status,
        paymentDate: this.refundDate,
        amount: this.amount,
        // exchangeRate: this.exchangeRate,
        remarks: this.remarks,
        id: this.id,
        _id: this._id,
        createdAt: this.createdAt,
        memo: this.memo,
        // amountInHomeCurrency: this.amountInHomeCurrency,
    }

    if (this.paymentDetail) {
        data.method = this.paymentDetail.method;
        data.amountInHomeCurrency = this.paymentDetail.amountInHomeCurrency;
        data.exchangeRate = this.paymentDetail.exchangeRate;
        data.methodToDisplay = this.paymentDetail.method;

        if (this.paymentDetail.method == 'manual') {
            data.methodToDisplay = this.paymentDetail.manual.type;
            data.manual = this.paymentDetail.manual;
        } else if (this.paymentDetail.method == 'card') {
            data.card = {
                type: getPaymentMethodIcon(this.paymentDetail.card.type),
                number: this.paymentDetail.card.number,
                cardHolderName: this.paymentDetail.card.cardHolderName,
                expiryMonth: this.paymentDetail.card.expiryMonth,
                expiryYear: this.paymentDetail.card.expiryYear
            }
        } else if (this.paymentDetail.method == 'bank') {
            // data.bank = this.paymentDetail.bank;
            data.bank = this.paymentDetail.bank ? this.paymentDetail.bank : {
                name: "JP MORGAN CHASE",
                number: "434"
            };
        }
    }
    return data;
};

export const RefundModel = mongoose.model('refunds', schema);