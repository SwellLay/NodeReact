import { orderBy, uniqBy, lowerCase } from "lodash";
import moment from "moment";
import React from "react";
import CustomerServices from "../../../../../api/CustomerServices";
import { fetchCurrencies } from "../../../../../api/globalServices";
import ProductServices from "../../../../../api/ProductService";
import { changePriceFormat, _setCurrency } from "../../../../../utils/GlobalFunctions";
import { WEEKLY_LIST } from "../../../../../constants/recurringConst";

export const invoiceInput = (state, businessInfo, userSettings) => {
  let payload = {
    _id: (state && state._id) || undefined,
    uuid: (state && state.uuid) || undefined,
    name: (state && state.name) || userSettings && userSettings.invoiceSetting.defaultTitle || "Invoice",
    invoiceLogo: invoiceLogo(state, userSettings),
    title: (state && state.title) || userSettings && userSettings.invoiceSetting.defaultTitle || "Invoice",
    subTitle: (state && state.subTitle) || userSettings && userSettings.invoiceSetting.defaultSubTitle || "",
    invoiceNumber: (state && state.invoiceNumber) || 0,
    customer: (state && state.customer) || undefined,
    isReminder: (state && state.isReminder) || false,
    currency: _setCurrency((state && state.currency), (businessInfo && businessInfo.currency)),
    notifyStatus: (state && state.notifyStatus) || { key: 'on', value: 'On Receipt' },
    invoiceDate: (state && state.invoiceDate) || new Date(),
    footer: (state && state.footer) || userSettings && userSettings.invoiceSetting.defaultFooter || "",
    notes: (state && state.notes) || userSettings && userSettings.invoiceSetting.defaultMemo || "",
    amountBreakup: (state && state.amountBreakup) || {
      subTotal: 0,
      taxTotal: [
        {
          taxName: {
            abbreviation: "",
            description: "",
            name: "",
            other: { showTaxNumber: false, isRecoverable: false, isCompound: false },
            rate: 0,
            taxNumber: "",
            _id: ""
          },
          rate: 0,
          amount: 0
        }
      ],
      total: 0
    },
    itemHeading: (state && state.itemHeading) || userSettings && userSettings.itemHeading || {
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
      hideAmount: false,
      hideDescription: false,
      hideItem: false,
      hidePrice: false,
      hideQuantity: false,
    },
    paid: state && state.paid || {
      isPaid: false,
      manualPayment: false,
      cardPayment: false
    },
    recurrence: state && state.recurrence || {
      isSchedule: false,
      type: "never",
      unit: "monthly",
      subUnit: undefined,
      interval: 1,
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      timezone: {
        name: '',
        offSet: 0,
        zoneAbbr: ''
        // name: moment.tz.names()[0],
        // offSet: moment.tz(new Date, '').format('Z'),
        // zoneAbbr: moment.tz(new Date, '').format('z')
      },
      maxInvoices: 0,
      dayofMonth: "1",
      dayOfWeek: "Monday",
      monthOfYear: 'January'
    },
    exchangeRate: (state && state.exchangeRate) || 1,
    items: (state && state.items) || [],
    totalAmount: (state && state.totalAmount) || 0,
    totalAmountInHomeCurrency: (state && state.totalAmountInHomeCurrency) || 0,
    dueAmount: (state && state.dueAmount) || 0,
    userId: localStorage.getItem("user.id"),
    businessId:
      (state && state.businessId) || localStorage.getItem("businessId"),
    postal: (state && state.postal) || "",
    lastSent: (state && state.lastSent) || undefined,
    isRecurring: (state && state.isRecurring) || true,
    purchaseOrder: (state && state.purchaseOrder) || "",
    sentDate: (state && state.sentDate) || undefined,
    paidDate: (state && state.paidDate) || undefined,
    status: (state && state.status) || "draft",
    skipped: (state && state.skipped) || false,
    sentVia: (state && state.sentVia) || "",
    publicView: (state && state.publicView) || {},
    sendMail: state && state.sendMail || {
      isSent: false,
      attachPdf: false,
      autoSendEnabled: null,
      copyMyself: false,
      message: "",
      to: [],
      from: localStorage.getItem('user.email'),
      skipWeekends: false,
    }
  };
  if (payload.sendMail.to.length === 0 || payload.sendMail.to[0] === "") {
    const defaultEmail = state && state.customer ? [state.customer.email] : ['']
    payload.sendMail.to = defaultEmail
  }
  payload.itemHeading["savedForFuture"] = state && state.itemHeading.savedForFuture || false
  return payload
};

export const invoiceLogo = (state, settings) => {
  let invoiceImage = undefined
  if (state && state.invoiceLogo) {
    invoiceImage = state.invoiceLogo
  } else if (settings && settings.displayLogo) {
    invoiceImage = settings.companyLogo
  }
  return invoiceImage
}

const dueDateWithin = (settings) => {
  let dueDate = moment().format('YYYY-MM-DD');
  const dueDateOn = settings.invoiceSetting.defaultPaymentTerm.key
  switch (dueDateOn) {
    case "dueWithin15":
      dueDate = moment(moment().add(15, "d")).format("YYYY-MM-DD");
      break;
    case "dueWithin30":
      dueDate = moment(moment().add(30, "d")).format("YYYY-MM-DD");
      break;
    case "dueWithin45":
      dueDate = moment(moment().add(45, "d")).format("YYYY-MM-DD");
      break;
    case "dueWithin60":
      dueDate = moment(moment().add(60, "d")).format("YYYY-MM-DD");
      break;
    case "dueWithin90":
      dueDate = moment(moment().add(90, "d")).format("YYYY-MM-DD");
      break;
    default:
      dueDate = moment().format('YYYY-MM-DD');
  }
  return dueDate
}

export const setCustomerList = list => {
  let custList = list;
  custList.unshift({
    _id: "Add new customer",
    customerName: (
      <a>
        {" "}
        <i className="py-icon pe pe-7s-plus" />
        Add new customer
      </a>
    )
  });
  return custList;
};

export const getSelectedCustomer = (list, value, businessInfo) => {
  let selectedCust = undefined;
  list.forEach(item => {
    if(typeof value === 'object'){
      if(item._id === value._id){
        selectedCust = item;
      }
    }else{
      if (item._id === value) {
        selectedCust = item;
      }
    }
  });
  return selectedCust;
};

export const INVOICE_ITEM = {
  item: undefined,
  column1: "",
  column2: "",
  column3: 0,
  column4: 0,
  taxes: [],
  amount: 0
};

export const setFormData = async (stateData, type) => {
  let currenciesResponse;
  let productResponse;
  let customerResponse;
  let currencyList = stateData.currencies;
  let customerList = stateData.customers;
  let productList = stateData.products;
  switch (type) {
    default:
      currenciesResponse = await fetchCurrencies();
      productResponse = (await ProductServices.fetchProducts('sell')).data.products;
      customerResponse = (await CustomerServices.fetchCustomers()).data
        .customers;
      currencyList = await setCurrencyList(currenciesResponse);
      productList = await setProductList(productResponse);
      customerList = await setCustomerList(customerResponse);
      break;
    case "ProductPopup":
      productResponse = (await ProductServices.fetchProducts('sell')).data.products;
      productList = await setProductList(productResponse);
      break;
    case "CustomerPopup":
      customerResponse = (await CustomerServices.fetchCustomers()).data
        .customers;
      customerList = await setCustomerList(customerResponse);
      break;
    case "Currency":
      currenciesResponse = await fetchCurrencies();
      currencyList = await setCurrencyList(currenciesResponse);
      break;
  }
  const data = {
    currencies: currencyList,
    customers: customerList,
    products: productList
  };
  return data;
};

export const setProductList = list => {
  let prodList = [];
  list.map(item => {
    prodList.push({
      item: item._id,
      column1: item.name,
      column2: item.description,
      column3: 1,
      column4: item.price,
      taxes: item.taxes
    });
    return item;
  });
  prodList.unshift({
    item: "Add new product",
    column1: (
      <a>
        {" "}
        <i className="py-icon pe pe-7s-plus" />
        Add new item
      </a>
    )
  });
  return prodList;
};

export const setCurrencyList = list => {
  let countries = list;
  let currencies = countries.map(country => {
    return country.currencies[0];
  });
  currencies = orderBy(uniqBy(currencies, "code"), "code", "asc");
  return currencies;
};

export const getSelectedCurrency = (list, currency) => {
  let selectedValue = null;
  list.forEach(item => {
    if (currency && item.code === currency.code) {
      selectedValue = item;
    }
  });
  return selectedValue;
};

export const calculateTaxes = async (list, response) => {
  // let response = (await taxServices.fetchTaxes()).data.taxes;
  let taxsTotal = [];
  let subTotal = 0;
  let amount = 0;
  let sumAmount = 0;
  list.map(data => {
    subTotal = data.column3 * data.column4;
    sumAmount += data.column3 * data.column4;
    if (data.taxes.length > 0) {
      data.taxes.map(tax => {
        response.map(item => {
          if(typeof tax === 'object'){
            if (item._id === tax._id) {
              taxsTotal.push({
                taxName: item,
                rate: item.rate,
                amount: calculatePercent(subTotal, item.rate)
              });
              amount += calculatePercent(subTotal, item.rate);
            }
          }else{
            if (item._id === tax) {
              taxsTotal.push({
                taxName: item,
                rate: item.rate,
                amount: calculatePercent(subTotal, item.rate)
              });
              amount += calculatePercent(subTotal, item.rate);
            }
          }
        });
      });
    }
    amount += subTotal;
  });

  let taxArrayObject = _.groupBy(taxsTotal, 'taxName._id')
  let newArryaObj = _.uniqBy(taxsTotal, 'taxName')
  taxsTotal = newArryaObj.map(item => {
    item.amount = _.sumBy(taxArrayObject[item.taxName._id], 'amount')
    return item
  })
  return {
    sumAmount: sumAmount,
    taxsTotal: taxsTotal,
    amount: amount
  };
};

export const calculatePercent = (total, per) => {
  return (total / 100) * per;
};

export const mailMessage = (data, via, businessInfo) => {
  let subject = `${data.name}\ #${data.invoiceNumber} from ${
    businessInfo.organizationName
    }`;
  let message = `
  Below please find a link to ${data.name}\ #${data.invoiceNumber}.

  Amount due: ${(data.currency && data.currency.symbol) || ""}${
    data.dueAmount
    }

  Expires on: ${moment(data.expiryDate).format("YYYY-MM-DD")}
  
  To view this invoice online, please visit: ${
    process.env.WEB_URL
    }/public/invoice/${data.uuid}
  `;
  if (via === "gmail") {
    return `https://mail.google.com/mail/u/0/?view=cm&&su=${escape(
      subject
    )}&&body=${escape(message)}`;
  } else if (via === "yahoo") {
    return `http://compose.mail.yahoo.com/?&&subj=${escape(
      subject
    )}&&body=${escape(message)}`;
  } else if (via === "outlook") {
    return `https://outlook.live.com/owa/?path=/mail/action/compose&subject=${escape(
      subject
    )}&body=${escape(message)}`;
  }
};

export const checkDue = dueDate => {
  let a = moment(dueDate);
  let b = moment(new Date());
  let diff = b.diff(a, "days"); // 1
  if (diff > 30) {
    return `${diff / 30} Months ago`;
  } else {
    return `${diff} Days ago`;
  }
};

export const setStartDate = (value, unit) => {
  switch (unit) {
    case 'monthly':
      if (lowerCase(value) === 'first') {
        if (moment().startOf("month") < moment()) {
          return moment().startOf("month").add(1, 'M').format('YYYY-MM-DD')
        } else {
          return moment().startOf("month").format('YYYY-MM-DD')
        }
      } else if (lowerCase(value) === 'last' || parseInt(value) >= moment().endOf("month").date()) {
        return moment().endOf("month").format('YYYY-MM-DD')
      } else {
        const increaceBy = parseInt(value) - 1
        return moment().startOf("month").add(increaceBy, 'd').format('YYYY-MM-DD')
      }
    case 'weekly':
      let startDate = moment().format('YYYY-MM-DD')
      WEEKLY_LIST.find((day, i) => {
        if (value === day.value) {
          startDate = moment().add(i + 1, 'd').format('YYYY-MM-DD')
        }
      })
      return startDate
    default: return moment().format('YYYY-MM-DD')
  }
}