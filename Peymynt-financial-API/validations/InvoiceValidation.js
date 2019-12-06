import Joi from "joi";

export const InvoiceSchema = Joi.object().keys({
    name: Joi.string().optional().allow(""),
    invoiceLogo: Joi.string().optional().allow("", null),
    title: Joi.string().required(),
    subTitle: Joi.string().optional().allow(""),
    businessId: Joi.string().required(),
    isRecurring: Joi.boolean().required().default(false),
    invoiceNumber: Joi.number().required(),
    isReminder: Joi.boolean().required(),
    uuid: Joi.string().optional().allow(''),
    beforeThree: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional().allow(null),
            status: Joi.string().optional().allow(null)
        }).optional(),
    beforeSeven: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional().allow(null),
            status: Joi.string().optional().allow(null)
        }).optional(),
    beforeFourteen: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional().allow(null),
            status: Joi.string().optional().allow(null)
        }).optional(),
    onDueDate: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional().allow(null),
            status: Joi.string().optional().allow(null)
        }).optional(),
    afterThree: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional().allow(null),
            status: Joi.string().optional().allow(null)
        }).optional(),
    afterSeven: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional().allow(null),
            status: Joi.string().optional().allow(null)
        }).optional(),
    afterFourteen: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional().allow(null),
            status: Joi.string().optional().allow(null)
        }).optional(),
    purchaseOrder: Joi.string().optional().allow(""),
    invoiceDate: Joi.date().required(),
    dueDate: Joi.date().required(),
    sentDate: Joi.date().optional(),
    paidDate: Joi.date().optional(),
    postal: Joi.string().optional().allow(""),
    customer: Joi.string().required(),
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
            recurrenceUnit: Joi.string().optional(),
            recurrenceInterval: Joi.number().optional(),
            repeatOnDayOfMonth: Joi.number().optional(),
            maxInvoices: Joi.number().optional(),
            repeatOnDayOfWeek: Joi.number().optional(),
            timezoneId: Joi.string().optional(),
            startDate: Joi.date().optional(),
            endDate: Joi.date().optional()
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
            position: Joi.number().optional(),
            _id: Joi.string().optional().allow(""),
            item: Joi.string().optional().allow(""),
            column1: Joi.string(),
            column2: Joi.string().optional().allow(""),
            column3: Joi.number().min(1).integer().positive().max(99999999),
            column4: Joi.number().min(1).integer().positive().max(99999999),
            taxes: Joi.array().items(),
            incomeAccount: Joi.string(),
            amount: Joi.number().optional().allow(0)
        })
    ).optional().allow([]),
    exchangeRate: Joi.number().optional(),
    sentVia: Joi.string().optional().allow(""),
    lastSent: Joi.date().optional().allow(null),
    taxes: Joi.array().items(
        Joi.object().keys({
            name: Joi.string(),
            amount: Joi.number().optional().allow(0)
        })
    ),
    status: Joi.string()
        .optional()
        .allow("draft", "approved", "sent", "overdue", "paid", "cancelled"),
    skipped: Joi.boolean().default(false),
    skippedDate: Joi.date().optional().default(null),
    publicView: Joi.object().keys({
        id: Joi.string().optional(),
        status: Joi.boolean().optional().default(true),
        shareableLinkUrl: Joi.string().optional().allow("")
    }),
    onlinePayments: Joi.object().optional().keys({
        "modeCard": Joi.boolean(),
        "modeBank": Joi.boolean()
    })
});



export const ReminderSchema = Joi.object().keys({
    beforeThree: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional()
        }).optional(),
    beforeSeven: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional()
        }).optional(),
    beforeFourteen: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional()
        }).optional(),
    onDueDate: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional()
        }).optional(),
    afterThree: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional()
        }).optional(),
    afterSeven: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional()
        }).optional(),
    afterFourteen: Joi.object()
        .keys({
            enable: Joi.boolean().optional().default(false),
            notifyDate: Joi.date().optional()
        }).optional()
})