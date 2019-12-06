import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";
import CurrencyModel from "../common/currency.common";
import TaxModel from "../common/tax.common";
import TaxOverrideModel from "../common/tax_override.common";
import formatDate from "../common/date_formatter.middleware";
const schema = Schema({
    billNumber: {
        type: String,
        required: false
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: "vendors",
        required: true
    },
    currency: CurrencyModel,
    exchangeRate: {
        type: Number
    },
    billDate: { type: Date, set: formatDate },
    expiryDate: { type: Date, set: formatDate },
    purchaseOrder: String,
    notes: String,
    amountBreakup: {
        subTotal: Number,
        taxes: [TaxModel],
        total: Number
    },
    totalAmount: Number,
    dueAmount: {
        type: Number
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    totalAmountInHomeCurrency: Number,
    items: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: "items"
            },
            name: {
                type: String,
                required: true
            },
            description: String,
            quantity: Number,
            price: Number,
            taxes: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "taxes"
                }
            ],
            amount: Number,
            taxOverrides: [TaxOverrideModel]
        }
    ],
    status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
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
        billNumber: this.billNumber,
        uuid: this.uuid,
        vendor: this.vendor,
        currency: this.currency,
        exchangeRate: this.exchangeRate,
        billDate: this.billDate,
        expiryDate: this.expiryDate,
        purchaseOrder: this.purchaseOrder,
        notes: this.notes,
        amountBreakup: this.amountBreakup,
        totalAmount: this.totalAmount,
        totalAmountInHomeCurrency: this.totalAmountInHomeCurrency,
        items: this.items,
        status: this.status,
        createdAt: this.createdAt,
        dueAmount: this.dueAmount,
        paidAmount: this.paidAmount
    }

    return data;
}

export const BillModel = mongoose.model("bills", schema);
