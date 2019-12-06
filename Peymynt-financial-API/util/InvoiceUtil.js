
export const invoiceInput = (state, settings) => {
  return {
    title: (state && state.title) || (settings && settings.title) || "Invoice",
    subTitle: (state && state.subTitle) || (settings && settings.subTitle) || "",
    invoiceNumber: (state && state.invoiceNumber) || 0,
    customer: (state && typeof state.customer === "object" ? state.customer._id : state.customer) || "",
    isReminder: (state && state.isReminder) || false,
    currency: state && state.currency,
    dueDate: new Date(),
    invoiceDate: new Date(),
    footer: (state && state.footer) ||  (settings && settings.footer) || "",
    notes: (state && state.notes) || (settings && settings.notes) || "",
    amountBreakup: (state && state.amountBreakup) || {
      subTotal: 0,
      taxTotal: [
        {
          taxName: "",
          rate: 0,
          amount: 0
        }
      ],
      total: 0
    },
    itemHeading: (settings && settings.itemHeading) || {
      column1: {
        name: "Items",
        shouldShow: true
      },
      column2: {
        name: "Quantity",
        shouldShow: true
      },
      column3: {
        name: "Price",
        shouldShow: true
      },
      column4: {
        name: "Amount",
        shouldShow: true
      }
    },
    exchangeRate: (state && state.exchangeRate) || 0,
    items: (state && state.items) || [],
    totalAmount: (state && state.totalAmount) || 0,
    totalAmountInHomeCurrency: (state && state.totalAmountInHomeCurrency) || 0,
    dueAmount: (state && state.totalAmount) || 0,
    userId: state && state.userId,
    businessId: state && state.businessId,
    postal: (state && state.postal) || "",
    lastSent: undefined,
    isRecurring: (state && state.isRecurring) || false,
    purchaseOrder: state.purchaseOrder,
    sentDate: undefined,
    paidDate: undefined,
    status: "draft",
    skipped: false,
    sentVia: "",
    beforeFourteen: defaultReminder,
    beforeSeven: defaultReminder,
    beforeThree: defaultReminder,
    onDueDate: defaultReminder,
    afterThree: defaultReminder,
    afterSeven: defaultReminder,
    afterFourteen: defaultReminder,
    publicView: (state && state.publicView) || {}
  };
};

const defaultReminder = {
  enable: false,
  notifyDate: null
};
