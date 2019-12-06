import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";
import AddressModel from "./common/address.common";
import { encode } from "../auth/codec";
import formatDate from "./common/date_formatter.middleware";

function toLower(v) { return v.toLowerCase() };

var schema = Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        set: toLower
    },
    googleUser: {
        type: Object,
        required: false
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    countryCode: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    address: AddressModel,
    dateOfBirth: { type: Date, set: formatDate },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    securityCheck: {
        emailVerified: {
            type: Boolean,
            default: false
        },
        mobileVerified: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    businesses: [{
        type: Schema.Types.ObjectId,
        ref: "organizations"
    }],
    primaryBusiness: {
        type: Schema.Types.ObjectId,
        ref: "organizations"
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
        type: Date,
        required: false
    },
    sharableLinkExpireTime: {
        type: Number,
        required: false
    }
}, {
        timestamps: true
    });

schema.methods.toUserJson = function () {
    let data = {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        uuid: this.uuid,
        updatedAt: this.updatedAt,
        address: this.address,
        dateOfBirth: this.dateOfBirth,
        primaryBusiness: this.primaryBusiness
    }

    if (this.googleUser) {
        data.googleUser = {
            googleId: this.googleUser.googleId,
            imageUrl: this.googleUser.imageUrl
        }
    }

    if (this.businesses) {
        data.businesses = this.businesses;
    }
    return data;
}

schema.methods.toPublicJson = function () {
    let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
    }
    return data;
}

schema.methods.toTokenJson = function () {
    let data = {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        uuid: this.uuid,
        primaryBusiness: this.primaryBusiness
    }

    if (this.googleUser) {
        data.googleUser = {
            googleId: this.googleUser.googleId,
            imageUrl: this.googleUser.imageUrl
        }
    }
    return data;
}

schema.path("email").validate((email) => {
    console.log("email ------------> ", email);
    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, "The e-mail field cannot be empty.");

schema.pre("save", function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    this.password = encode(this.password);
    next();
})



export const UserModel = mongoose.model("users", schema);
