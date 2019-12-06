import mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';
import AddressModel from "./common/address.common";

const refundDetailSchema = mongoose.Schema({
    amount: String,
    requestedBy: {
        type: String,
        enum: ["User", "System", "Admin"],
        default: "User"
    },
    date: Date,
    id: {
        type: Schema.Types.ObjectId,
        ref: "refunds"
    }
}, { _id: false })
const schema = mongoose.Schema({
    paymentType: {
        type: String,
        enum: ["Invoice", "Checkout"],
        required: true
    },
    status: {
        type: String,
        enum: ["SUCCESS", "DECLINED", "REFUNDED", "FAILED", "WAITING"],
        required: true
    },
    paymentDate: {
        successDate: Date,
        declineDate: Date,
        refundDate: Date,
        failedDate: Date,
        waitingDate: Date
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    account: {
        type: {
            type: String,
            // enum: ["american_express", "visa", "master", "bank"],
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },

    customer: {
        firstName: { type: String, required: true },
        lastName: String,
        phone: String,
        address: String,
        email: String
    },
    address: AddressModel,
    invoice: {
        type: Schema.Types.ObjectId,
        ref: "invoices"
    },
    checkout: {
        type: Schema.Types.ObjectId,
        ref: "checkouts"
    },
    amount: {
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
        }
    },

    refund: {
        isRefunded: {
            type: Boolean,
            default: false
        },
        details:
            [{
                type: Schema.Types.ObjectId,
                ref: "refunds"
            }]
    },

    payout: {
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

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "organizations"
    },
    rawElementResponse: Object,
    rawChargeResponse: Object,
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

schema.methods.toUserJson = function () {
    let data = {
        paymentType: this.paymentType,
        status: this.status,
        paymentDate: this.paymentDate,
        uuid: this.uuid,
        customer: this.customer,
        address: this.address,
        amount: this.amount,
        refund: {
            isRefunded: this.refund.isRefunded,
            details: []
        },
        payout: this.payout,
        invoice: this.invoice,
        checkout: this.checkout,
        id: this.id

    }
    if (this.currency && this.currency.code) {
        data.currency = this.currency
    } else {
        data.currency = {
            "code": "USD",
            "name": "U.S. dollar",
            "symbol": "$",
            "displayName": "USD ($) U.S. dollar"
        }
    }
    if (this.other) {
        data.other = this.other;
    } else {
        data.other = {
            "invoiceNo": "154"
        }
    }
    if (this.account && this.account.type) {
        let paymentMethod = 'bank';
        switch (this.account.type) {
            case 'Visa':
                paymentMethod = 'visa';
                break;
            case 'MasterCard':
                paymentMethod = 'mastercard';
                break;
            case 'American Express':
                paymentMethod = 'amex';
                break;
            case 'Diners Club':
                paymentMethod = 'diners';
                break;
            default:
                paymentMethod = this.account.type.toLowerCase();
                break;
        }
        data.account = {
            type: paymentMethod,
            number: this.account.number
        }
    }
    if (this.legal && this.legal.account) {
        data.ownAccount = {
            "accountNumber": this.legal.account.accountNumber,
            "bankName": this.legal.account.bankName,
            "accountName": this.legal.account.accountName,
        }
    }

    if (this.refunds) {
        data.refund.details = this.refunds.map(r => {
            return { "id": r._id, "amount": `$${r.amount}` };
        })
    }

    return data;
};

schema.methods.toUserJsonDetail = function () {
    let data = {
        paymentType: this.paymentType,
        status: this.status,
        paymentDate: this.paymentDate,
        uuid: this.uuid,
        account: this.account,
        customer: this.customer,
        address: this.address,
        amount: this.amount,
        refund: {
            isRefunded: this.refund.isRefunded,
            details: []
        },
        payout: this.payout,
        invoice: this.invoice,
        checkout: this.checkout,
        id: this.id
    }
    if (this.checkout) {
        data.checkout = {
            status: this.checkout.status,
            itemName: this.checkout.itemName,
            price: this.checkout.price,
            total: this.checkout.total,
            uuid: this.checkout.uuid,
            taxes: this.checkout.taxes
        }
    }
    if (this.legal && this.legal.account) {
        data.ownAccount = {
            "accountNumber": this.legal.account.accountNumber,
            "bankName": this.legal.account.bankName,
            "accountName": this.legal.account.accountName,
        }
    }

    if (this.refunds) {
        data.refund.details = this.refunds.map(r => {
            return { "id": r._id, "amount": `$${r.amount}` };
        })
    }
    return data;
};

export const PaymentModel = mongoose.model('payments1', schema);