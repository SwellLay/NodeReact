import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        template: {
            type: String,
            enum: ["contemporary", "classic", "modern"],
            default: "contemporary",
            required: true
        },
        companyLogo: {
            type: String,
            required: false
        },
        displayLogo: {
            type: Boolean,
            default: false
        },
        accentColour: {
            type: String,
            default: ""
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        businessId: {
            type: Schema.Types.ObjectId,
            ref: "organizations",
            required: true
        },
        invoiceSetting: {
            defaultPaymentTerm: {
                key: {
                    type: String,
                    enum: [
                        "dueOnReceipt",
                        "dueWithin15",
                        "dueWithin30",
                        "dueWithin45",
                        "dueWithin60",
                        "dueWithin90"
                    ]
                },
                value: {
                    type: String,
                    enum: [
                        "Due upon receipt",
                        "Due Within 15 days",
                        "Due Within 30 days",
                        "Due Within 45 days",
                        "Due Within 60 days",
                        "Due Within 90 days"
                    ]
                },
            },
            defaultTitle: {
                type: String,
                default: "Invoice"
            },
            defaultSubTitle: {
                type: String,
                default: ""
            },
            defaultFooter: {
                type: String,
                default: ""
            },
            defaultMemo: {
                type: String,
                default: ""
            }
        },
        estimateSetting: {
            defaultTitle: {
                type: String,
                default: "Estimate"
            },
            defaultSubTitle: {
                type: String,
                default: ""
            },
            defaultFooter: {
                type: String,
                default: ""
            },
            defaultMemo: {
                type: String,
                default: ""
            }
        },
        itemHeading: {
            column1: {
                name: {
                    type: String,
                    default: "Items"
                },
                shouldShow: {
                    type: Boolean,
                    default: true
                }
            },
            column2: {
                name: {
                    type: String,
                    default: "Quantity"
                },
                shouldShow: {
                    type: Boolean,
                    default: true
                }
            },
            column3: {
                name: {
                    type: String,
                    default: "Price"
                },
                shouldShow: {
                    type: Boolean,
                    default: true
                }
            },
            column4: {
                name: {
                    type: String,
                    default: "Amount"
                },
                shouldShow: {
                    type: Boolean,
                    default: true
                }
            },
            hideItem: {
                type: Boolean,
                default: false
            },
            hideDescription: {
                type: Boolean,
                default: false
            },
            hideQuantity: {
                type: Boolean,
                default: false
            },
            hidePrice: {
                type: Boolean,
                default: false
            },
            hideAmount: {
                type: Boolean,
                default: false
            }
        },
        isActive: {
            type: Boolean,
            default: true
        }, //By default true means Active
        isDeleted: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            required: false
        },
        updatedAt: {
            type: Date,
            required: false
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

export const SalesSettingModel = mongoose.model("sales_setting", schema);
