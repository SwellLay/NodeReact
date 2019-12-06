import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        customerName: {
            type: String,
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
        cardIds: [{
            type: Schema.Types.ObjectId,
            ref: "cards"
        }],
        currency: {
            code: String,
            name: String,
            symbol: String,
            displayName: String
        },
        communication: {
            accountNumber: String,
            phone: String,
            fax: String,
            mobile: String,
            tollFree: String,
            website: String
        },
        addressBilling: {
            country: {
                id: Number,
                name: String,
                sortname: String
            },
            state: {
                id: String,
                name: String,
                country_id: String
            },
            city: String,
            postal: String,
            addressLine1: String,
            addressLine2: String
        },
        addressShipping: {
            contactPerson: String,
            phone: String,
            country: {
                id: Number,
                name: String,
                sortname: String
            },
            state: {
                id: String,
                name: String,
                country_id: String
            },
            city: String,
            postal: String,
            addressLine1: String,
            addressLine2: String,
            deliveryNotes: String
        },
        isShipping: {
            type: Boolean,
            required: true,
            default: false
        },
        internalNotes: String,
        stripe: {
            isConnected: {
                type: Boolean,
                default: false,
                required: true
            },
            customerId: String,
            rawResponse: String,
            createdOn: Date
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
    },
    {
        timestamps: true
    }
);

schema.virtual("cards", {
    ref: 'cards',
    localField: 'cardIds',
    foreignField: '_id',
    justOne: false
});

schema.methods.toUserJson = function () {
    let data = {
        _id: this._id,
        customerName: this.customerName,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        currency: this.currency,
        communication: this.communication,
        addressBilling: this.addressBilling,
        addressShipping: this.addressShipping,
        isShipping: this.isShipping,
        internalNotes: this.internalNotes,
        businessId: this.businessId,
        createdAt: this.createdAt
    };
    // data.cards = this.cards;
    if (this.cards && this.cards.length) {
        data.cards = this.cards.map(c => {
            return {
                brand: c.brand,
                cardNumber: c.cardNumber,
                expiryMonth: c.expiryMonth,
                expiryYear: c.expiryYear,
                id: c._id
            }
        })
    }
    return data;
}

export const CustomerModel = mongoose.model("customers", schema);
