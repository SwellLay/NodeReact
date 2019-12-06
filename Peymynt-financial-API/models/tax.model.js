import mongoose, { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    abbreviation: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    taxNumber: String,
    other: {
        showTaxNumber: {
            type: Boolean,
            default: false
        },
        isRecoverable: {
            type: Boolean,
            default: false
        },
        isCompound: {
            type: Boolean,
            default: false
        },
    },
    uuid: {
        type: String,
        default: uuidv4
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
    }
}, {
        timestamps: true
    });
schema.methods.toUserJson = function () {
    return {
        _id: this._id,
        name: this.name,
        abbreviation: this.abbreviation,
        rate: this.rate,
        taxNumber: this.taxNumber,
        other: {
            showTaxNumber: this.other.showTaxNumber
        }
    }
}
export const TaxModel = mongoose.model('taxes', schema);