import mongoose, {
    Schema
} from 'mongoose';
import uuidv4 from 'uuid/v4';
import AddressModel from "./common/address.common";
import {
    getPaymentMethodIcon
} from './common/util';

// Changes 
// invoice -> invoiceId
// checkout -> checkoutId
// account (object) -> old* account (string)
// amount -> amountBreakup
const schema = Schema({
    paymentType: {
        type: String,
        enum: ["Invoice", "Checkout"],
        required: true
    },
    status: {
        type: String,
        enum: ["SUCCESS", "DECLINED", "FAILED", "WAITING", "REFUNDED", "CANCELLED"],
        required: true,
    },
    remarks: String,
    account: String,
    manual: {
        type: {
            type: String
        }
    },
    card: {
        type: {
            type: String
        },
        number: {
            type: String
        },
        cardHolderName: String,
        expiryMonth: Number,
        expiryYear: Number,
        cardId: {
            type: Schema.Types.ObjectId,
            ref: "cards"
        }
    },
    bank: {
        name: String,
        number: String,
        type: {
            type: String
        },
        subType: String,
        accountId: String,
        publicToken: String
    },
    memo: String,
    amount: {
        type: Number,
        required: true
    },
    amountBreakup: {
        total: {
            type: Number,
            required: true
        },
        fee: {
            type: Number,
            required: true
        },
        net: {
            type: Number,
            required: true
        },
        feeStructure: Object
    },
    amountInHomeCurrency: Number,
    exchangeRate: Number,
    method: {
        type: String,
        enum: ["manual", "card", "bank"],
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    customer: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String,
        phone: String,
        email: String
    },
    address: AddressModel,
    invoiceId: {
        type: Schema.Types.ObjectId,
        ref: "invoices"
    },
    checkoutId: {
        type: Schema.Types.ObjectId,
        ref: "checkouts"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "organizations"
    },
    refund: {
        isApplicable: {
            type: Boolean,
            default: false
        },
        isRefunded: {
            type: Boolean,
            default: false
        },
        details: [{
            type: Schema.Types.ObjectId,
            ref: "refunds"
        }]
    },

    payout: {
        isApplicable: {
            type: Boolean,
            default: false
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["Queue", "Initiated", "Progress", "Paid", "Failed"]
        },
        date: Date,
        id: {
            type: Schema.Types.ObjectId,
            ref: "payouts"
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }, //By default true means Active
    isDeleted: {
        type: Boolean,
        default: false
    },
    rawElementResponse: String,
    rawLinkResponse: String,
    rawChargeResponse: String,
    currency: {
        code: String,
        name: String,
        symbol: String,
        displayName: String
    },
    other: Object,
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

schema.virtual("refunds", {
    ref: 'refunds',
    localField: 'refund.details',
    foreignField: '_id',
    justOne: false
});

schema.index({
    "customer.firstName": 'text',
    "customer.lastName": 'text',
    "customer.phone": 'text',
    "customer.email": 'text',
    "other.invoiceNo": 'text'
})

schema.methods.toUserJson = function () {
    let data = {
        paymentType: this.paymentType,
        status: this.status,
        remarks: this.remarks,
        paymentDate: this.paymentDate,
        uuid: this.uuid,
        customer: this.customer,
        address: this.address,
        amount: this.amount,
        method: this.method,
        refund: {
            isRefunded: this.refund.isRefunded,
            details: []
        },
        payout: this.payout,
        invoiceId: this.invoiceId,
        checkout: this.checkoutId,
        checkoutId: this.checkoutId,
        id: this.id,
        _id: this._id,
        manual: this.manual
    }
    data.currency = this.currency
    data.other = this.other;
    data.amountBreakup = this.amountBreakup;

    if (this.card && this.card.type) {
        const icon = getPaymentMethodIcon(this.card.type);
        data.card = {
            type: icon,
            number: this.card.number,
            cardHolderName: this.card.cardHolderName,
            expiryMonth: this.card.expiryMonth,
            expiryYear: this.card.expiryYear
        }
        data.paymentIcon = icon;
    } else if (this.bank) {
        data.paymentIcon = 'bank';
        data.bank = this.bank ? this.bank : {
            name: "JP MORGAN CHASE",
            number: "434"
        };
    }
    if (this.legal && this.legal.account) {
        data.ownAccount = {
            "accountNumber": this.legal.account.accountNumber,
            "bankName": this.legal.account.bankName,
            "accountName": this.legal.account.accountName,
        }
    }

    if (this.refunds) {
        let refundAmount = 0;
        data.refund.details = this.refunds.map(r => {
            refundAmount += r.amount;
            return {
                "id": r._id,
                "amount": `$${r.amount}`
            };
        })
        data.refund.totalAmount = refundAmount;
    }

    return data;
};

schema.methods.toUserJsonDetail = function () {
    let data = {
        paymentType: this.paymentType,
        status: this.status,
        remarks: this.remarks,
        paymentDate: this.paymentDate,
        uuid: this.uuid,
        customer: this.customer,
        address: this.address,
        amount: this.amount,
        method: this.method,
        refund: {
            isRefunded: this.refund.isRefunded,
            details: []
        },
        payout: this.payout,
        invoiceId: this.invoiceId,
        checkoutId: this.checkoutId,
        id: this.id,
        _id: this._id,
        manual: this.manual
    }
    if (this.card && this.card.type) {
        const icon = getPaymentMethodIcon(this.card.type);
        data.card = {
            type: icon,
            number: this.card.number,
            cardHolderName: this.card.cardHolderName,
            expiryMonth: this.card.expiryMonth,
            expiryYear: this.card.expiryYear
        }
        data.paymentIcon = icon;
    } else if (this.bank) {
        data.paymentIcon = 'bank';
        data.bank = this.bank ? this.bank : {
            name: "JP MORGAN CHASE",
            number: "434"
        };
    }
    if (this.legal && this.legal.account) {
        data.ownAccount = {
            "accountNumber": this.legal.account.accountNumber,
            "bankName": this.legal.account.bankName,
            "accountName": this.legal.account.accountName,
        }
    }

    if (this.refunds) {
        let refundAmount = 0;
        data.refund.details = this.refunds.map(r => {
            refundAmount += r.amount;
            return {
                "id": r._id,
                "amount": `$${r.amount}`
            };
        })
        data.refund.totalAmount = refundAmount;
    }
    return data;
};

schema.methods.toInvoiceJson = function () {
    let data = {
        type: "payment",
        paymentType: this.paymentType,
        status: this.status,
        paymentDate: this.paymentDate,
        amount: this.amount,
        method: this.method,
        exchangeRate: this.exchangeRate,
        // remarks: this.remarks,
        card: this.card,
        bank: this.bank,
        id: this.id,
        _id: this._id,
        account: this.account,
        createdAt: this.createdAt,
        memo: this.memo,
        amountInHomeCurrency: this.amountInHomeCurrency,
        manual: this.manual
    }
    data.methodToDisplay = this.method;
    if (this.method == 'manual') {
        data.methodToDisplay = this.manual.type;
    }
    if (this.card && this.card.type) {
        data.card = {
            type: getPaymentMethodIcon(this.card.type),
            number: this.card.number,
            cardHolderName: this.card.cardHolderName,
            expiryMonth: this.card.expiryMonth,
            expiryYear: this.card.expiryYear
        }
    } else if (this.bank) {
        data.paymentIcon = 'bank';
        data.bank = this.bank ? this.bank : {
            name: "JP MORGAN CHASE",
            number: "434"
        };
    }
    return data;
};

export const PaymentModel = mongoose.model('payments', schema);