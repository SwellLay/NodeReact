import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Primary", "Verified", "Unverified"],
        default: "Unverified"
    },
    connectedAccount: {
        type: Schema.Types.ObjectId,
        ref: "profile_accounts"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    isPrimary: {
        type: Boolean,
        default: false
    },
    primaryDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, {
        timestamps: true
    });
schema.methods.toUserJson = function () {
    return {
        email: this.email,
        status: this.status,
        connectedAccount: this.connectedAccount,
        id: this._id
    }
};
export const ProfileEmailModel = mongoose.model("profile_emails", schema);