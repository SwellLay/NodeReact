import mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';
import { fetchSalesSetting } from '../services/SalesService';

const schema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    taxes: [{
        type: Object
    }],
    uuid: {
        type: String,
        default: uuidv4
    },
    currency: {
        code: String,
        name: String,
        symbol: String,
        displayName: String
    },
    total: {
        type: Number,
        required: true
    },
    account: {
        type: String
    },
    fields: {
        phone: {
            type: Boolean,
            default: false
        },
        address: {
            type: Boolean,
            default: false
        },
        email: {
            type: Boolean,
            default: false
        }
    },
    message: {
        success: String,
        failure: String
    },
    status: {
        type: String,
        required: true,
        enum: ["Draft", "Online", "Offline", "Archived", "Deleted"],
        default: "Draft"
    },
    count: {
        view: Number,
        success: Number,
        failure: Number
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
    },
    deletedAt: {
        type: Date,
        required: false
    },
    report: {
        viewCount: { type: Number, default: 0 },
        paymentCount: { type: Number, default: 0 },
        lastViewedOn: { type: Date },
        lastPaymentOn: { type: Date }
    }
}, {
        timestamps: true
    });

schema.methods.toPublicJson = async function () {
    const data = {
        uuid: this.uuid,
        fields: this.fields,
        message: this.message,
        taxes: this.taxes,
        itemName: this.itemName,
        price: this.price,
        total: this.total,
        status: this.status
    };
    if (this.businessId && this.businessId._id) {
        const setting = await fetchSalesSetting(this.businessId);
        let businessSetting
        if (setting.statusCode == 200 && setting.data)
            businessSetting = setting.data.salesSetting;
        data.business = {
            organizationName: this.businessId.organizationName,
            organizationType: this.businessId.organizationType,
            address: this.businessId.address,
            communication: this.businessId.communication,
            timezone: this.businessId.timezone,
            country: this.businessId.country,
            currency: this.businessId.currency,
            businessLogo: businessSetting ? businessSetting.companyLogo : ""
        }
    }
    if (this.currency && this.currency.code) {
        data.currency = this.currency
    } else {
        data.currency = {
            "code": "USD",
            "name": "U.S. dollar",
            "symbol": "$",
            "displayName": "USD ($) U.S. dollar"
        }
    }
    return data;
}

schema.methods.toCustomerJson = async function () {
    const data = {
        _id: this._id,
        uuid: this.uuid,
        fields: this.fields,
        message: this.message,
        taxes: this.taxes,
        itemName: this.itemName,
        price: this.price,
        total: this.total,
        status: this.status,
        createdAt: this.createdAt,
        report: this.report
    };
    if (this.businessId && this.businessId._id) {
        const setting = await fetchSalesSetting(this.businessId);
        let businessSetting
        if (setting.statusCode == 200 && setting.data)
            businessSetting = setting.data.salesSetting;
        data.business = {
            organizationName: this.businessId.organizationName,
            organizationType: this.businessId.organizationType,
            address: this.businessId.address,
            communication: this.businessId.communication,
            timezone: this.businessId.timezone,
            country: this.businessId.country,
            currency: this.businessId.currency,
            businessLogo: businessSetting ? businessSetting.companyLogo : ""
        }
    }
    if (this.currency && this.currency.code) {
        data.currency = this.currency
    } else {
        data.currency = {
            "code": "USD",
            "name": "U.S. dollar",
            "symbol": "$",
            "displayName": "USD ($) U.S. dollar"
        }
    }
    return data;
}

schema.methods.toList = function () {
    const data = {
        _id: this._id,
        uuid: this.uuid,
        fields: this.fields,
        message: this.message,
        taxes: this.taxes,
        itemName: this.itemName,
        price: this.price,
        total: this.total,
        status: this.status,
        createdAt: this.createdAt,
        report: this.report
    };
    if (this.currency && this.currency.code) {
        data.currency = this.currency
    } else {
        data.currency = {
            "code": "USD",
            "name": "U.S. dollar",
            "symbol": "$",
            "displayName": "USD ($) U.S. dollar"
        }
    }
    return data;
}

export const CheckoutModel = mongoose.model("checkouts", schema);