import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";

const schema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "customers",
        required: true
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "organizations",
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    brand: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    expiryMonth: {
        type: Number
    },
    expiryYear: {
        type: Number
    },
    postal: {
        type: Number
    },
    stripe: {
        paymentMethodId: {
            type: String,
            required: true
        },
        rawResponse: String,
        lastUpdatedOn: Date,
        fingerprint: {
            type: String,
            required: true
        },
    },
    lastUsedOn: Date,
    isActive: {
        type: Boolean,
        default: true
    },
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

schema.methods.toUserJson = function () {
    let data = {
        customerId: this.customerId,
        businessId: this.businessId,
        cardHolderName: this.cardHolderName,
        uuid: this.uuid,
        brand: this.brand,
        cardNumber: this.cardNumber,
        expiryMonth: this.expiryMonth,
        expiryYear: this.expiryYear,
        postal: this.postal,
        isActive: this.isActive,
        createdAt: this.createdAt,
        lastUsedOn: this.lastUsedOn,
        id: this._id
    }
    return data;
}

schema.methods.toInternalJson = function () {
    let data = {
        customerId: this.customerId,
        businessId: this.businessId,
        stripe: this.stripe,
        isActive: this.isActive,
        cardHolderName: this.cardHolderName,
        createdAt: this.createdAt,
        lastUsedOn: this.lastUsedOn,
        brand: this.brand,
        cardNumber: this.cardNumber,
        expiryMonth: this.expiryMonth,
        expiryYear: this.expiryYear,
        id: this._id
    }
    return data;
}
export const CardModel = mongoose.model("cards", schema);
