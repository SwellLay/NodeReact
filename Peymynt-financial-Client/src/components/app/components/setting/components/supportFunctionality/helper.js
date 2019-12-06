export const paymentTerms = [
  {
    key: "dueOnReceipt",
    value: "Due upon receipt"
  },
  {
    key: "dueWithin15",
    value: "Due Within 15 days"
  },
  {
    key: "dueWithin30",
    value: "Due Within 30 days"
  },
  {
    key: "dueWithin45",
    value: "Due Within 45 days"
  },
  {
    key: "dueWithin60",
    value: "Due Within 60 days"
  },
  {
    key: "dueWithin90",
    value: "Due Within 90 days"
  }
]

export const invoiceSettingPayload = () => {
  const payload = {
    businessId: localStorage.getItem("businessId"),
    template: "contemporary",
    companyLogo: undefined,
    displayLogo: false,
    accentColour: "#FF0000",
    invoiceSetting: {
      defaultPaymentTerm: {
        key: "dueOnReceipt",
        value: "Due upon receipt"
      },
      defaultTitle: "Invoice",
      defaultSubTitle: "",
      defaultFooter: "",
      defaultMemo: ""
    },
    estimateSetting: {
      defaultTitle: "Estimate",
      defaultSubTitle: "",
      defaultFooter: "",
      defaultMemo: ""
    },
    itemHeading: {
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
      },
      hideItem: false,
      hideDescription: false,
      hideQuantity: false,
      hidePrice: false,
      hideAmount: false
    }
  };
  return payload;
};
export const receiptsSettingPayload = () => {
  return  {
    businessId: localStorage.getItem("businessId"),
    emailUpload: false,
    autoCapture: false,
  };
};
