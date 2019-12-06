import mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';

function toLower(v) { return v.toLowerCase() };

const schema = Schema({
    name: {
        type: String,
        required: true
    },
    internalName: {
        type: String,
        set: toLower
    },
    description: {
        type: String
    },
    uuid: {
        type: String,
        default: uuidv4
    },
    price: {
        type: Number,
        default: 0.0
    },
    buy: {
        allowed: {
            type: Boolean,
            default: false
        },
        account: String
    },
    sell: {
        allowed: {
            type: Boolean,
            default: false
        },
        account: String
    },
    taxes: [{
        type: [Schema.Types.ObjectId],
        ref: "taxes"
    }],
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
    }
}, {
        timestamps: true
    });

schema.methods.toCustomerJson = function () {
    let data = {
        buy: this.buy,
        sell: this.sell,
        price: this.price,
        taxes: this.taxes,
        _id: this._id,
        name: this.name,
        description: this.description,
        uuid: this.uuid,
        createdAt: this.createdAt
    };
    return data;
}
export const ItemModel = mongoose.model('items', schema);
