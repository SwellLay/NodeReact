import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    isActive: {
        type: Boolean,
        default: true
    }, //By default true means Active
    isDeleted: {
        type: Boolean,
        default: false
    }, createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
        type: Date,
        required: false
    },
    deletedAt: {
        type: Date,
        required: false
    }
}, {
        timestamps: true
    });

export const InvoiceSettingModel = mongoose.model("invoice_setting", schema);