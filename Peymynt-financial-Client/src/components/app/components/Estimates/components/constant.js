import { orderBy, uniqBy } from 'lodash';
import moment from 'moment';
import React from "react";
import CustomerServices from "../../../../../api/CustomerServices";
import { fetchCurrencies } from "../../../../../api/globalServices";
import ProductServices from "../../../../../api/ProductService";

export const HTTP_POST = "POST";
export const HTTP_GET = "GET";
export const HTTP_PUT = "PUT";
export const HTTP_DELETE = "DELETE";
export const HTTP_PATCH = "PATCH";

export const estimatePayload = (state, businessInfo, userSettings) => {
  let payload = {
    name: (state && state.name) || userSettings && userSettings.estimateSetting.defaultTitle || "Estimate",
    estimateNumber: (state && state.estimateNumber) || 0,
    customer: (state && state.customer) || undefined,
    currency: (state && state.currency) || (businessInfo && businessInfo.currency) || null,
    exchangeRate: (state && state.exchangeRate) || 1,
    estimateDate: (state && state.estimateDate) || new Date(),
    expiryDate: (state && state.expiryDate) || new Date(),
    subheading: (state && state.subheading) || userSettings && userSettings.estimateSetting.defaultSubTitle || "",
    footer: (state && state.footer) || userSettings && userSettings.estimateSetting.defaultFooter || "",
    memo: (state && state.memo) || userSettings && userSettings.estimateSetting.defaultMemo || "",
    amountBreakup: (state && state.amountBreakup) || {
      subTotal: 0,
      taxTotal: {
        abbreviation: "",
        description: "",
        name: "",
        other: { showTaxNumber: false, isRecoverable: false, isCompound: false },
        rate: 0,
        taxNumber: "",
        _id: ""
      },
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
    items: (state && state.items) || [estimateProductObject()],
    totalAmount: (state && state.totalAmount) || 0,
    totalAmountInHomeCurrency: (state && state.totalAmountInHomeCurrency) || 0,
    userId: (state && state.userId) || localStorage.getItem("user.id"),
    businessId:
      (state && state.businessId) || localStorage.getItem("businessId"),
    purchaseOrder: (state && state.purchaseOrder) || ""
  };
  return payload;
};

export const setCustomerList = list => {
  let custList = [];
  list.map(item => {
    item.value = item._id;
    item.label = item.customerName;
    item.username = `${item.firstName} ${item.lastName}`;
    custList.push(
      item
      //   {
      //   value: item._id,
      //   label: item.customerName,
      //   currency: item.currency,
      //   username: `${item.firstName} ${item.lastName}`,
      //   email: item.email
      // }
    );
    return item;
  });
  custList.unshift({
    _id: "Add new customer",
    customerName: (
      <a style={{fontSize: '14px'}}>
        <i className="py-icon pe pe-7s-plus" />{" "}
        Add new customer
      </a>
    )
  });
  return custList;
};


export const getSelectedCustomer = (list, value, businessInfo) => {
  let selectedCust = null;
  list.forEach(item => {
    if (item.value === value) {
      selectedCust = item
    }
  });
  return selectedCust

};

export const estimateProductObject = () => {
  const object = {
    item: "",
    description: "",
    quantity: 0,
    price: undefined,
    taxes: [],
    amount: 0
  };
  return object;
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
      name: item.name,
      description: item.description,
      quantity: 1,
      price: item.price,
      taxes: item.taxes
    });
    return item;
  });
  prodList.unshift({
    item: "Add new product",
    name: (
      <a style={{fontSize: '13px', verticalAlign: 'middle', color: '#9F55FF'}}>
        <i className="py-icon pe pe-7s-plus" style={{color: '#9F55FF', verticalAlign: 'middle'}} />{" "}
        Add new Item
      </a>
    )
  });
  return prodList;
};


export const setCurrencyList = list => {
  let countries = list;
  let currencies = countries.map(country => { return country.currencies[0] });
  currencies = orderBy(uniqBy(currencies, "code"), "code", "asc");
  return currencies;
};

export const getSelectedCurrency = (list, currency) => {
  let selectedValue = null;
  list.forEach(item => {
    if (currency && (item.code === currency.code)) {
      selectedValue = item
    }
  });
  return selectedValue
};

function log(message, data) {
  // console.log(message + " : " + JSON.stringify(data, null, 2));
}
export const calculateTaxes = async (list, response) => {
  log("items", list);
  let taxsTotal = [];
  let subTotal = 0;
  let amount = 0;
  let sumAmount = 0;
  list.map(data => {
    subTotal = data.quantity * data.price;
    sumAmount += data.quantity * data.price;
    if (data.taxes.length > 0) {
      data.taxes.map(tax => {
        response.map(item => {
          if (typeof tax === 'object') {
            if (item._id === tax._id) {
              taxsTotal.push({
                taxName: item,
                rate: item.rate,
                amount: calculatePercent(subTotal, item.rate)
              });
              amount += calculatePercent(subTotal, item.rate);
            }
          } else if (item._id === tax) {
            taxsTotal.push({
              taxName: item,
              rate: item.rate,
              amount: calculatePercent(subTotal, item.rate)
            });
            amount += calculatePercent(subTotal, item.rate);
          }
        });
      });

    }
    amount += subTotal
  });
  let taxArrayObject = _.groupBy(taxsTotal, 'taxName._id');
  let newArryaObj = _.uniqBy(taxsTotal, 'taxName');
  taxsTotal = newArryaObj.map(item => {
    item.amount = _.sumBy(taxArrayObject[item.taxName._id], 'amount');
    return item
  });
  return {
    sumAmount: sumAmount,
    taxsTotal: taxsTotal,
    amount: amount
  };
};

const calculatePercent = (total, per) => {
  return (total / 100) * per;
};

export const mailMessage = (data, via, businessInfo) => {
  console.log("data", data, via, businessInfo);
  let to = `${data.customer.email}`;
  let subject = `${data.name}\ #${data.estimateNumber} from ${businessInfo.organizationName}`;
  let message = `
  Below please find a link to ${data.name}\ #${data.estimateNumber}. \

  Amount due: ${(data.currency && data.currency.symbol) || ""}${data.totalAmount} \

  Expires on: ${moment(data.expiryDate).format('YYYY-MM-DD')} \
  
  To view this estimate online, please visit: ${process.env.WEB_URL}/public/estimate/${data.uuid}
  `;
  if (via === 'gmail') {
    return `https://mail.google.com/mail/u/0/?view=cm&&tf=0&&to=${escape(to)}&&su=${escape(subject)}&&body=${escape(message)}`
  } else if (via === 'yahoo') {
    return `http://compose.mail.yahoo.com/?to=${escape(to)}&&subj=${escape(subject)}&&body=${escape(message)}`
  } else {
    return `https://outlook.live.com/owa/?path=/mail/action/compose&to=${escape(to)}&subject=${escape(subject)}&body=${escape(message)}`
  }
};
