import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    upload_via_mail: {
        type: Boolean,
        default: false
    },
    capture_automatically: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "organizations",
        required: true,
        unique: true
    },
    invoiceId: {
        type: Schema.Types.ObjectId,
        ref: "invoices",
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

schema.methods.toUserJson = async function () {
    return {
        upload_via_mail: this.upload_via_mail,
        capture_automatically: this.capture_automatically,
        businessId: this.businessId
    }
};
export const PurchaseSettingModel = mongoose.model("purchase_setting", schema);