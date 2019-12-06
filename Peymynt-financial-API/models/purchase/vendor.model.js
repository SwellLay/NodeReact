import mongoose, { Schema } from "mongoose";
import uuidv4 from 'uuid/v4';
import CurrencyModel from "../common/currency.common";
import AddressModel from "../common/address.common";
import CommunicationModel from "../common/communication.common";
import BankModel from "../common/bank.common";

const schema = new Schema({
    vendorName: {
        type: String,
        required: true
    },
    vendorType: {
        type: String,
        enum: ["regular", "contractor"],
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    currency: CurrencyModel,
    communication: CommunicationModel,
    address: AddressModel,
    isAccountAdded: {
        type: Boolean,
        default: false
    },
    accountNumber: Number,
    account: BankModel,
    contractor: {
        contractorType: {
            type: String, enum: ["individual", "business"]
        },
        ssn: String,
        ein: Number
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
        businessId: this.businessId,
        vendorName: this.vendorName,
        vendorType: this.vendorType,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        currency: this.currency,
        communication: this.communication,
        address: this.address,
        accountNumber: this.accountNumber,
        contractor: this.contractor,
        createdAt: this.createdAt,
        id: this._id,
        isAccountAdded: this.isAccountAdded
    }
    return data;
}

schema.methods.toAccountJson = function () {
    return this.account;
}

export const VendorModel = mongoose.model("vendors", schema);
