import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";
import formatDate from "./common/date_formatter.middleware";

const schema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    estimateNumber: {
      type: Number,
      required: true
    },
    uuid: {
      type: String,
      default: uuidv4
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true
    },
    currency: {
      code: String,
      name: String,
      symbol: String,
      displayName: String
    },
    exchangeRate: {
      type: Number
    },
    estimateDate: { type: Date, set: formatDate },
    expiryDate: { type: Date, set: formatDate },
    purchaseOrder: String,
    subheading: String,
    footer: String,
    memo: { type: String },
    amountBreakup: {
      subTotal: Number,
      taxTotal: [{
        taxName: {
          type: Schema.Types.ObjectId,
          ref: "taxes"
        },
        rate: Number,
        amount: Number
      }],
      total: Number
    },
    totalAmount: Number,
    totalAmountInHomeCurrency: Number,
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "items"
        },
        name: {
          type: String,
          required: true
        },
        description: String,
        quantity: Number,
        price: Number,
        taxes: [
          {
            type: Schema.Types.ObjectId,
            ref: "taxes"
          }
        ],
        amount: Number
      }
    ],
    status: {
      type: String,
      enum: ["viewed", "sent", "saved", "expired"],
      default: "saved"
    },
    url: {
      shortUrl: String,
      customerUrl: String
    },
    invoice: {
      isConverted: {
        type: Boolean,
        default: false
      },
      invoice: {
        type: Schema.Types.ObjectId,
        ref: "invoices"
      },
      invoiceNo: String
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
      },
      savedForFuture: {
        type: Boolean,
        default: false
      }
    },
    publicView: {
      id: {
        type: String,
        default: uuidv4
      },
      status: {
        type: Boolean,
        required: true,
        default: true
      },
      shareableLinkUrl: {
        type: String,
        required: false
      }
    },
    deletedAt: {
      type: Date,
      required: false
    },
    report: {
      viewCount: Number,
      lastViewedOn: Date
    }
  },
  {
    timestamps: true
  }
);

export const EstimateModel = mongoose.model("estimates", schema);
