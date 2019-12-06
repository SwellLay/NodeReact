import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    accept_card: {
        type: Boolean,
        default: false
    },
    accept_bank: {
        type: Boolean,
        default: false
    },
    preferred_mode: {
        type: String,
        enum: ["card", "bank"],
        default: "card"
    },
    enabled: {
        type: Boolean,
        default: false
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
    isActive: {
        type: Boolean,
        default: true
    }, //By default true means Active
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
        timestamps: true
    });
schema.methods.toUserJson = async function () {
    return {
        accept_card: this.accept_card,
        accept_bank: this.accept_bank,
        preferred_mode:this.preferred_mode,
        enabled:this.enabled,
        businessId: this.businessId
    }
};
export const PaymentSettingModel = mongoose.model("payment_setting", schema);