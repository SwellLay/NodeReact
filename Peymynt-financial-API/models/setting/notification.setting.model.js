import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    notify_accounting: {
        type: Boolean,
        default: true
    },
    notify_sales: {
        type: Boolean,
        default: true
    },
    notify_payroll: {
        type: Boolean,
        default: true
    },
    notify_payment: {
        type: Boolean,
        default: true
    },
    notify_purchase: {
        type: Boolean,
        default: true
    },
    notify_banking: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
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
schema.methods.toUserJson = function () {
    return {
        notify_accounting: this.notify_accounting,
        notify_sales: this.notify_sales,
        notify_payroll: this.notify_payroll,
        notify_payment: this.notify_payment,
        notify_purchase: this.notify_purchase,
        notify_banking: this.notify_banking
    }
};
export const NotificationSettingModel = mongoose.model("profile_notification", schema);