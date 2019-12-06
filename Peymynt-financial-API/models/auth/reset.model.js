import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";

function toLower(v) { return v.toLowerCase() };

var schema = Schema({
    email: {
        type: String,
        index: true,
        required: true,
        set: toLower
    },
    publicToken: {
        type: String,
        default: uuidv4
    },
    privateToken: {
        type: String,
        default: uuidv4
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isConsumed: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date,
        required: false
    },
    consumedAt: {
        type: Date,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    expiredAt: {
        type: Date,
        required: true
    },
    hitCount: { type: Number, default: 0 },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
        timestamps: true
    });

schema.methods.toPublicJson = function () {
    let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
    }
    return data;
}

schema.path("email").validate((email) => {
    console.log("email ------------> ", email);
    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, "The e-mail field cannot be empty.");


export const ResetHistoryModel = mongoose.model("reset_history", schema);
