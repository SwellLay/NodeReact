import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";
import formatDate from "./common/date_formatter.middleware";

const schema = mongoose.Schema(
  {
    title: {
      type: String
    },
    subTitle: {
      type: String
    },
    postal: {
      type: String
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
      required: true
    },
    purchaseOrder: String,
    dueDate: { type: Date, set: formatDate },
    nextInvoiceDate: { type: Date, set: formatDate },
    previousInvoiceDate: { type: Date, set: formatDate },
    dueAmount: {
      type: Number,
      default: 0
    },
    paymentDue: Number,
    invoiceNumber: Number,
    isRecurring: {
      type: Boolean,
      default: true
    },
    isReminder: {
      type: Boolean,
      default: true
    },
    invoiceDate: { type: Date, set: formatDate },
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
    invoiceCount: {
      type: Number,
      default: 0
    },
    recurrence: {
      isSchedule: {
        type: Boolean,
        default: false
      },
      unit: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly", "custom"]
      },
      subUnit: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"]
      },
      interval: {
        type: Number,
        default: 1
      },
      type: {
        type: String,
        enum: ["after", "on", "never"]
      },
      startDate: { type: Date, set: formatDate },
      endDate: { type: Date, set: formatDate },
      timezone: {
        name: String,
        offSet: Number,
        zoneAbbr: String
      },
      maxInvoices: Number,
      dayofMonth: String,
      dayOfWeek: {
        type: String,
        enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"]
      },
      monthOfYear: {
        type: String,
        enum: ["January", "February", "March", "April", "May", "June", "July", "August",
          "September", "October", "November", "December"
        ]
      },
    },
    paid: {
      isPaid: {
        type: Boolean,
        default: false
      },
      manualPayment: {
        type: Boolean,
        default: false
      },
      cardPayment: {
        type: Boolean,
        default: false
      }
    },
    sendMail: {
      isSent: {
        type: Boolean,
        default: false
      },
      attachPdf: {
        type: Boolean,
        default: false
      },
      copyMyself: {
        type: Boolean,
        default: false
      },
      autoSendEnabled: {
        type: Boolean,
        default: null
      },
      message: String,
      from: String,
      to: [String],
      skipWeekends: Boolean
    },
    footer: String,
    notes: String,
    amountBreakup: {
      subTotal: Number,
      taxTotal: [
        {
          taxName: {
            type: Schema.Types.ObjectId,
            ref: "taxes"
          },
          rate: Number,
          amount: Number
        }
      ],
      total: Number
    },
    totalAmount: Number,
    totalAmountInHomeCurrency: Number,
    itemHeading: {
      column1: {
        name: String,
        shouldShow: {
          type: Boolean,
          default: true
        }
      },
      column2: {
        name: String,
        shouldShow: {
          type: Boolean,
          default: true
        }
      },
      column3: {
        name: String,
        shouldShow: {
          type: Boolean,
          default: true
        }
      },
      column4: {
        name: String,
        shouldShow: {
          type: Boolean,
          default: true
        }
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
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "items"
        },
        column1: String,
        column2: String,
        column3: Number,
        column4: Number,
        taxes: [
          {
            type: Schema.Types.ObjectId,
            ref: "taxes"
          }
        ],
        incomeAccount: {
          type: Schema.Types.ObjectId,
          ref: "accounts"
        }
      }
    ],
    taxes: [
      {
        name: String,
        amount: Number
      }
    ],
    status: {
      type: String,
      enum: ["draft", "active", "end", "completed"]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    notifyStatus: {
      key: {
        type: String,
        enum: ["on", "7", "14", "30", "45", "60", "90"]
      },
      value: {
        type: String,
        enum: ["On Receipt", "Within 7 Days", "Within 14 Days", "Within 30 Days", "Within 45 Days", "Within 60 Days", "Within 90 Days"]
      },
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

export const RecurringModel = mongoose.model("recurring", schema);
