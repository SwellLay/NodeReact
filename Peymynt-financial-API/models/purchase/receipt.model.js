import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";
import CurrencyModel from "../common/currency.common";
import TaxModel from "../common/tax.common";
import formatDate from "../common/date_formatter.middleware";

const schema = Schema({
    ocr: {
        token: {
            type: String,
            required: true
        },
        rawQueueResponse: {
            type: String,
            required: true
        },
        rawOcrResponse: String
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    merchant: String,
    currency: CurrencyModel,
    receiptDate: { type: Date, set: formatDate },
    notes: String,
    address: String,
    amountBreakup: {
        subTotal: Number,
        taxes: [TaxModel],
        total: Number
    },
    items: [],
    paymentMethod: String,
    file: Object,
    totalAmount: Number,
    discount: Number,
    phoneNumber: String,
    url: String,
    status: {
        type: String,
        enum: ["Draft", "Processing", "Ready", "Done"],
        default: "Draft",
        required: true
    },
    fileUrl: String,
    source: {
        type: String,
        enum: ["Web", "Mobile", "Email", "Manual"],
        default: "Web"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
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
    }
},
    {
        timestamps: true
    }
);

schema.methods.toUserJson = function () {
    return {
        id: this._id,
        uuid: this.uuid,
        merchant: this.merchant,
        currency: this.currency,
        receiptDate: this.receiptDate,
        notes: this.notes,
        totalAmount: this.totalAmount,
        status: this.status,
        fileUrl: this.fileUrl,
        amountBreakup: this.amountBreakup,
        source: this.source,
        previewUrl: "https://wave-prod-recpt.s3.amazonaws.com/media/receipt_images/23890200/d19d3850-eaa0-4209-8b67-db269e1cd819.pdf.400x0_q85.jpg",
        createdAt: this.createdAt
    }
}
export const ReceiptModel = mongoose.model("receipts", schema);
