import { orderBy, uniqBy } from "lodash";
import moment from "moment";
import React from "react";
import CustomerServices from "../../../../../api/CustomerServices";
import { fetchCurrencies } from "../../../../../api/globalServices";
import ProductServices from "../../../../../api/ProductService";
import { changePriceFormat, privacyPolicy, terms, _setCurrency } from "../../../../../utils/GlobalFunctions";
import { currencyObject } from "../../sales/components/customer/customerSupportFile/constant";

export const invoiceInput = (state, businessInfo, userSettings) => {
  let payload = {
    _id: (state && state._id) || undefined,
    uuid: (state && state.uuid) || undefined,
    amountBreakup: (state && state.amountBreakup) || {
      subTotal: 0,
      taxTotal: [],
      total: 0
    },
    createdAt: (state && state.createdAt) || new Date(),
    name: (state && state.name) || userSettings && userSettings.invoiceSetting.defaultTitle || "Invoice",
    invoiceLogo: invoiceLogo(state, userSettings),
    title: (state && state.title) || userSettings && userSettings.invoiceSetting.defaultTitle || "Invoice",
    subTitle: (state && state.subTitle) || userSettings && userSettings.invoiceSetting.defaultSubTitle || "",
    invoiceNumber: (state && state.invoiceNumber) || 0,
    customer: (state && state.customer) || "",
    isReminder: (state && state.isReminder) || false,
    currency: _setCurrency(state && state.currency, businessInfo && businessInfo.currency),
    dueDate: (state && state.dueDate) || userSettings && dueDateWithin(userSettings) || moment().format('YYYY-MM-DD'),
    invoiceDate: (state && state.invoiceDate) || moment().format('YYYY-MM-DD'),
    footer: (state && state.footer) || userSettings && userSettings.invoiceSetting.defaultFooter || "",
    notes: (state && state.notes) || userSettings && userSettings.invoiceSetting.defaultMemo || "",
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
    lastViewedOn: (state && state.lastViewedOn) || undefined,
    isRecurring: (state && state.isRecurring) || false,
    onlinePayments : (state && state.onlinePayments) || {
      enabled: false,
      modeBank: false,
      modeCard: false,
      onlinePaymentAllowed: false,
    },
    purchaseOrder: (state && state.purchaseOrder) || "",
    payments: (state && state.payments) || null,
    sentDate: (state && state.sentDate) || undefined,
    paidDate: (state && state.paidDate) || undefined,
    status: (state && state.status) || "draft",
    skipped: (state && state.skipped) || false,
    sentVia: (state && state.sentVia) || "",
    beforeFourteen: (state && state.beforeFourteen) || defaultReminder,
    beforeSeven: (state && state.beforeSeven) || defaultReminder,
    beforeThree: (state && state.beforeThree) || defaultReminder,
    onDueDate: (state && state.onDueDate) || defaultReminder,
    afterThree: (state && state.afterThree) || defaultReminder,
    afterSeven: (state && state.afterSeven) || defaultReminder,
    afterFourteen: (state && state.afterFourteen) || defaultReminder,
    publicView: (state && state.publicView) || {}
  };
  // savedForFuture:false,
  payload.itemHeading["savedForFuture"] = state && state.itemHeading.savedForFuture || false;
  return payload
};

export const invoiceLogo = (state, settings) => {
  let invoiceImage = undefined;
  if (state && state.invoiceLogo) {
    invoiceImage = state.invoiceLogo
  } else if (settings && settings.displayLogo) {
    invoiceImage = settings.companyLogo
  }
  return invoiceImage
};

const defaultReminder = {
  enable: false,
  notifyDate: null
};

const dueDateWithin = (settings) => {
  let dueDate = moment().format('YYYY-MM-DD');
  const dueDateOn = settings.invoiceSetting.defaultPaymentTerm.key;
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
};

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
  let selectedCust = value;
  list.forEach(item => {
    if (item._id === value) {
      selectedCust = item;
    }
  });
  return selectedCust;
};

export const INVOICE_ITEM = {
  item: undefined,
  column1: "",
  column2: "",
  column3: 0,
  column4: '',
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
      productResponse = (await ProductServices.fetchProducts('sales')).data.products;
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
    item: "Add new item",
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
          if(typeof tax === 'object' && tax.hasOwnProperty('_id')){
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

export const calculatePercent = (total, per) => {
  return (total / 100) * per;
};

export const mailMessage = (data, via, businessInfo) => {
  console.log('data', data);
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
    return `https://mail.google.com/mail/u/0/?view=cm&&to=${escape(data.customer && data.customer.email)}
    &&su=${escape(
      subject
    )}&&body=${escape(message)}`;
  } else if (via === "yahoo") {
    return `http://compose.mail.yahoo.com/?to=${escape(data.customer && data.customer.email)}&&subj=${escape(
      subject
    )}&&body=${escape(message)}`;
  } else if (via === "outlook") {
    return `https://outlook.live.com/owa/?path=/mail/action/compose&&to=${escape(data.customer && data.customer.email)}&subject=${escape(
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

export const InvoiceItems = props => {
  return (
    <div className="contemporary-template__items">
      <table className="table">
        <InvoiceItemsHeader
          invoiceInfo={props.invoiceInfo}
          userSettings={props.userSettings}
        />
        <RenderInvoiceItems
          invoiceInfo={props.invoiceInfo}
          invoiceItems={props.invoiceItems}
          sign={props.sign}
        />
      </table>
    </div>
  );
};

export const InvoiceItemsHeader = (props) => {
  const { itemHeading } = props.invoiceInfo;
  const borderColour = props.userSettings ? props.userSettings.accentColour : "#000";
  return (
    <thead>
      <tr>
        <th style={{ backgroundColor: borderColour }} width="300">{itemHeading.column1.name}</th>
        {!itemHeading.hideQuantity && <th style={{ backgroundColor: borderColour }} width="200">{itemHeading.column2.name}</th>}
        {!itemHeading.hidePrice && <th style={{ backgroundColor: borderColour }} width="200">{itemHeading.column3.name}</th>}
        {!itemHeading.hideAmount && <th style={{ backgroundColor: borderColour }} width="200">{itemHeading.column4.name}</th>}
      </tr>
    </thead>
  );
};

export const RenderInvoiceItems = props => {
  const { sign, invoiceItems, invoiceInfo } = props;
  const { itemHeading } = invoiceInfo;
  return (
    <tbody>
      {invoiceItems.map((item, key) => {
        return (
          <tr key={key} className="bodr_btm" >
            <td width="300">
              {!itemHeading.hideItem && <span className="text-strong">{item.column1}</span>}
              {!itemHeading.hideDescription && <p className="invoice-product-description">{item.column2}</p>}
            </td>
            {!itemHeading.hideQuantity && <td width="200">
              <span>{item.column3}</span>
            </td>}
            {!itemHeading.hidePrice && <td width="200">
              <span>{`${sign}${changePriceFormat(item.column4, 2)}`}</span>
            </td>}
            {!itemHeading.hideAmount &&
              <td width="200">
                <span>{`${sign}${changePriceFormat((item.column3 * item.column4), 2)}`}</span>
              </td>}
          </tr>
        );
      })}
    </tbody>
  );
};

export const renderPaymentDetails = data => {
  return null;
};

export const _institutionLists = [
  {
    name: 'Chase',
    img: '/assets/chase.svg'
  },
  {
    name: 'Bank of America',
    img: '/assets/boi.svg'
  },
  {
    name: 'Wells Fargo',
    img: '/assets/wells.svg'
  },
  {
    name: 'USAA',
    img: '/assets/usaa.svg'
  },
  {
    name: 'HSBC',
    img: '/assets/hsbc.png'
  },
  {
    name: 'Lloyds Banking',
    img: '/assets/lloyd.png'
  },
  {
    name: 'Royal Bank of Scotland',
    img: '/assets/rbs.png'
  },
  {
    name: 'Barclays',
    img: '/assets/barclays.png'
  },
];

export const PoweredByBank = () => {
  return (
    <div className="public-payment-footer">
      <span>Powered by <img src="/assets/images/logo.png"/> <span className="py-text--strong">Peymynt</span></span>
      <br/>
      <ul className="public-payment-footer-links">
        <li><a className="py-text--strong py-text--link" href="javascript:void(0)" onClick={() => terms()}>Terms of use</a></li>
        <li><a className="py-text--strong py-text--link" href="javascript:void(0)" onClick={() => privacyPolicy()}>Privacy policy</a></li>
        <li><a className="py-text--strong py-text--link" href="javascript:void(0)" onClick={() => terms()}>Security</a></li>
      </ul>
    </div>
  )
};

export const PoweredByReciept = () => {
  return (
    <div className="public-payment-footer">
      <span>Powered by <img src="/assets/images/logo.png" style={{height: '16px'}} /> <span className="py-text--strong">Peymynt</span></span>
    </div>
  )
};
