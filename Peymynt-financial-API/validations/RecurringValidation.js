import Joi from "joi";

export const RecurringSchema = Joi.object().keys({
    name: Joi.string().optional().allow(""),
    invoiceLogo: Joi.string().optional().allow("", null),
    title: Joi.string().required(),
    subTitle: Joi.string().optional().allow(""),
    businessId: Joi.string().required(),
    isRecurring: Joi.boolean().required().default(false),
    invoiceNumber: Joi.number().required(),
    isReminder: Joi.boolean().optional(),
    uuid: Joi.string().optional().allow(''),
    notifyStatus : Joi.object().keys({
        key : Joi.string().optional().allow("on", "7", "14", "30","45","60","90"),
        value : Joi.string().optional().allow("On Receipt", "Within 7 Days", "Within 14 Days", "Within 30 Days", "Within 45 Days", "Within 60 Days", "Within 90 Days"),
    }).optional(),
    purchaseOrder: Joi.string().optional().allow(""),
    invoiceDate: Joi.date().optional().allow(""),
    dueDate: Joi.date().optional().allow(""),
    nextInvoiceDate: Joi.date().optional().allow(""),
    previousInvoiceDate: Joi.date().optional().allow(""),
    sentDate: Joi.date().optional(),
    paidDate: Joi.date().optional(),
    postal: Joi.string().optional().allow(""),
    customer: Joi.string().required(),
    paymentDue : Joi.string().optional().allow(0),
    // payment: Joi.object()
    //     .keys({
    //         amount: Joi.number().required(),
    //         memo: Joi.string().optional().allow(""),
    //         account: Joi.string().optional().allow(""),
    //         paymentDate: Joi.date().optional(),
    //         dueDate: Joi.date().required(),
    //         method: Joi.string().required()
    //     }).optional(),
     recurrence: Joi.object()
        .keys({
            isSchedule: Joi.boolean().default(false),
            unit: Joi.string().default("daily", "weekly", "monthly", "yearly", "custom").optional(),
            subUnit : Joi.string().default("daily", "weekly", "monthly", "yearly").optional().allow(""),
            interval: Joi.number().optional().allow(0),
            type: Joi.string().default("after", "on","never").optional(),
            startDate: Joi.date().optional().default(null),
            endDate: Joi.date().optional().default(null),
            timezone: Joi.object().keys({
                name: Joi.string().optional().allow(""),
                offSet: Joi.number().optional().allow(0),
                zoneAbbr: Joi.string().optional().allow("")
            }).optional(),
            maxInvoices: Joi.number().optional().allow(0),
            dayofMonth : Joi.string().optional().allow(""),
            monthOfYear : Joi.string().optional().default("January", "February", "March", "April",  "May", "June", "July","August","September", "October","November", "December"),
            dayOfWeek : Joi.string().optional().default("Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"),
            // repeatOnMonth : Joi.string().default("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"),
        }).optional(), 
    sendMail : Joi.object()
    .keys({
        isSent: Joi.boolean().default(false),
        attachPdf : Joi.boolean().optional().default(false),
        copyMyself :  Joi.boolean().optional().default(false),
        autoSendEnabled  : Joi.boolean().optional().allow(null),
        message:  Joi.string().optional().allow(""),
        from : Joi.string().optional().allow(""),
        to : Joi.array().items(
            Joi.string().optional().allow(""),
        ).optional().allow([]),
        skipWeekends  : Joi.boolean().optional()
    }).optional(),
    currency: Joi.object()
        .keys({
            code: Joi.string().optional(),
            name: Joi.string().optional(),
            symbol: Joi.string().optional(),
            displayName: Joi.string().optional()
        }).required(),
    footer: Joi.string().optional().allow(""),
    notes: Joi.string().optional().allow(""),
    amountBreakup: Joi.object().keys({
        subTotal: Joi.number()
            .optional()
            .allow(0),
        taxTotal: Joi.array()
            .optional()
            .allow(0),
        total: Joi.number()
            .optional()
            .allow(0)
    }),
    userId: Joi.string().required(),
    totalAmountInHomeCurrency: Joi.number().optional().allow(0),
    totalAmount: Joi.number().optional().allow(0),
    dueAmount: Joi.number().optional().allow(0),
    itemHeading: Joi.object().keys({
        column1: Joi.object().keys({
            name: Joi.string(),
            shouldShow: Joi.boolean().default(true),
        }),
        column2: Joi.object().keys({
            name: Joi.string(),
            shouldShow: Joi.boolean().default(true),
        }),
        column3: Joi.object().keys({
            name: Joi.string(),
            shouldShow: Joi.boolean().default(true),
        }),
        column4: Joi.object().keys({
            name: Joi.string(),
            shouldShow: Joi.boolean().default(true),
        }),
        hideItem: Joi.boolean().default(false),
        hideDescription: Joi.boolean().default(false),
        hideQuantity: Joi.boolean().default(false),
        hidePrice: Joi.boolean().default(false),
        hideAmount: Joi.boolean().default(false),
        savedForFuture: Joi.boolean().default(false)
    }),
    isActive: Joi.boolean().default(true),
    isDeleted: Joi.boolean().default(false),
    items: Joi.array().items(
        Joi.object().keys({
            _id: Joi.string().optional().allow(""),
            item: Joi.string().optional().allow(""),
            column1: Joi.string(),
            column2: Joi.string().optional().allow(""),
            column3: Joi.number(),
            column4: Joi.number(),
            taxes: Joi.array().items(),
            incomeAccount: Joi.string(),
            amount: Joi.number().optional().allow(0)
        })
    ).optional().allow([]),
    invoiceCount :  Joi.number().optional().allow(0),
    exchangeRate: Joi.number().optional(),
    sentVia: Joi.string().optional().allow(""),
    lastSent: Joi.date().optional().allow(null),
    taxes: Joi.array().items(
        Joi.object().keys({
            name: Joi.string(),
            amount: Joi.number().optional().allow(0)
        })
    ),
    paid: Joi.object().keys({
        isPaid: Joi.boolean().default(false),
        manualPayment: Joi.boolean().default(false),
        cardPayment: Joi.boolean().default(false)
    }).optional(),
    status: Joi.string()
        .optional()
        .allow("draft", "approved", "sent", "overdue", "paid", "cancelled"),
    skipped: Joi.boolean().default(false),
    skippedDate: Joi.date().optional().default(null),
    publicView: Joi.object().keys({
        id: Joi.string().optional(),
        status: Joi.boolean().optional().default(true),
        shareableLinkUrl: Joi.string().optional().allow("")
    })
});



export const ReminderSchema = Joi.object().keys({
    recurrence: Joi.object()
        .keys({
            isSchedule: Joi.boolean().default(false),
            unit: Joi.string().default("daily", "weekly", "monthly", "yearly", "custom").optional(),
            subUnit : Joi.string().default("daily", "weekly", "monthly", "yearly").optional().allow(""),
            interval: Joi.number().optional().allow(0),
            type: Joi.string().default("after", "on","never").optional(),
            startDate: Joi.date().optional().default(null),
            endDate: Joi.date().optional().default(null),
            timezone: Joi.object().keys({
                name: Joi.string().optional().allow(""),
                offSet: Joi.number().optional().allow(0),
                zoneAbbr: Joi.string().optional().allow("")
            }).optional(),
            maxInvoices: Joi.number().optional().allow(0),
            dayofMonth : Joi.number().optional().allow(0),
            monthOfYear : Joi.string().optional().default("January", "February", "March", "April",  "May", "June", "July","August","September", "October","November", "December"),
            dayOfWeek : Joi.string().optional().default("Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"),
            // repeatOnMonth : Joi.string().default("January", "February", "March", "April",  "May", "June", "July","August","September", "October","November", "December"),
        }).optional(), 
})

