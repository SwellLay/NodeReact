import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";
import CurrencyModel from "../common/currency.common";
import formatDate from "../common/date_formatter.middleware";

const schema = Schema({
    paymentMethod: {
        type: String,
        enum: ["bank_payment", "check", "cash", "credit_card", "paypal", "other"],
        required: true
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    amount: {
        type: Number,
        required: true
    },
    exchangeRate: {
        type: Number,
        required: true
    },
    amountInHomeCurrency: {
        type: Number,
        required: true
    },
    currency: CurrencyModel,
    paymentDate: { type: Date, required: true, set: formatDate },
    paymentAccount: String,
    memo: String,
    billId: {
        type: Schema.Types.ObjectId,
        ref: "bills"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "organizations"
    },
    isActive: {
        type: Boolean,
        default: true
    }, //By default true means Active
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

schema.methods.toUserJson = function () {
    let data = {
        id: this._id,
        paymentMethod: this.paymentMethod,
        uuid: this.uuid,
        amount: this.amount,
        currency: this.currency,
        exchangeRate: this.exchangeRate,
        amountInHomeCurrency: this.amountInHomeCurrency,
        paymentDate: this.paymentDate,
        paymentAccount: this.paymentAccount,
        memo: this.memo,
        billId: this.billId,
        createdAt: this.createdAt
    }

    return data;
}

export const BillPaymentModel = mongoose.model("bill_payments", schema);
