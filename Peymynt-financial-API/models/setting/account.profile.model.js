import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true,
        enum: ["google", "yahoo"]
    },
    isLoginAllowed: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
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
        provider: this.provider,
        name: this.name,
        isLoginAllowed: this.isLoginAllowed,
        id: this._id
    }
};
export const ProfileAccountModel = mongoose.model("profile_accounts", schema);