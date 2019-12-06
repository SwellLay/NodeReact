import { orderBy, uniqBy } from 'lodash';
import React from "react";
import { fetchCurrencies } from "../../../../../../../api/globalServices";
import ProductServices from "../../../../../../../api/ProductService";
import VendorServices from "../../../../../../../api/vendorsService";

export const HTTP_POST = "POST";
export const HTTP_GET = "GET";
export const HTTP_PUT = "PUT";
export const HTTP_DELETE = "DELETE";
export const HTTP_PATCH = "PATCH";

export const billPayload = (state, businessInfo, vendorId) => {
  const payload = {
    billNumber: (state && state.billNumber) || "",
    vendor: (state && state.vendor) || vendorId,
    currency: (state && state.currency) || (businessInfo && businessInfo.currency) || null,
    exchangeRate: (state && state.exchangeRate) || 1,
    billDate: (state && state.billDate) || new Date(),
    expiryDate: (state && state.expiryDate) || new Date(),
    notes: (state && state.notes) || "",
    amountBreakup: (state && state.amountBreakup) || {
      subTotal: 0,
      taxes: {
        abbreviation: "",
        description: "",
        name: "",
        other: { showTaxNumber: false, isRecoverable: false, isCompound: false },
        rate: 0,
        taxNumber: "",
        id: ""
      },
      total: 0
    },
    items: (state && state.items) || [billProductObject()],
    totalAmount: (state && state.totalAmount) || 0,
    totalAmountInHomeCurrency: (state && state.totalAmountInHomeCurrency) || 0,
    purchaseOrder: (state && state.purchaseOrder) || '',
  };
  return payload;
};

export const setVendorList = list => {
  let custList = [];
  list.map(item => {
    item.value = item.id;
    item.label = item.vendorName;
    item.username = `${item.firstName} ${item.lastName}`;
    custList.push(
      item
      //   {
      //   value: item._id,
      //   label: item.vendorName,
      //   currency: item.currency,
      //   username: `${item.firstName} ${item.lastName}`,
      //   email: item.email
      // }
    );
    return item;
  });
  custList.unshift({
    id: "Add new vendor",
    vendorName: (
      <a className="select-add-new-option">
        <i className="py-icon pe pe-7s-plus" />
        <span className="text">&nbsp;Add new vendor</span>
      </a>
    )
  });
  return custList;
};


export const getSelectedVendor = (list, value, businessInfo) => {
  return list.find(r => r.id === value || r.id === value.id || r.id === value._id);
};

export const billProductObject = () => {
  return {
    item: "",
    category: "",
    description: "",
    quantity: 0,
    price: undefined,
    taxes: [],
    amount: 0
  };
};

export const setFormData = async (stateData, type) => {
  let currenciesResponse;
  let productResponse;
  let vendorResponse;
  let currencyList = stateData.currencies;
  let vendorList = stateData.vendors;
  let productList = stateData.products;
  switch (type) {
    default:
      currenciesResponse = await fetchCurrencies();
      productResponse = (await ProductServices.fetchProducts('buy')).data.products;
      vendorResponse = (await VendorServices.fetchAllVendors()).data
        .vendors;
      currencyList = await setCurrencyList(currenciesResponse);
      productList = await setProductList(productResponse);
      vendorList = await setVendorList(vendorResponse);
      break;
    case "ProductPopup":
      productResponse = (await ProductServices.fetchProducts('buy')).data.products;
      productList = await setProductList(productResponse);
      break;
    case "VendorPopup":
      vendorResponse = (await VendorServices.fetchAllVendors()).data
        .vendors;
      vendorList = await setVendorList(vendorResponse);
      break;
    case "Currency":
      currenciesResponse = await fetchCurrencies();
      currencyList = await setCurrencyList(currenciesResponse);
      break;
  }
  const data = {
    currencies: currencyList,
    vendors: vendorList,
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
      <a style={{ fontSize: '13px', verticalAlign: 'middle', color: '#9F55FF' }}>
        <i className="py-icon pe pe-7s-plus" style={{ color: '#9F55FF', verticalAlign: 'middle' }} />{" "}
        Add new Item
      </a>
    )
  });
  return prodList;
};


export const setCurrencyList = list => {
  let countries = list;
  let currencies = countries.map(country => {
    return country.currencies[0]
  });
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

export const calculateTaxes = async (list, response) => {
  let taxesTotal = [];
  let subTotal = 0;
  let amount = 0;
  let sumAmount = 0;
  list.map(data => {
    subTotal = (data.quantity || 0) * (data.price || 0);
    sumAmount += subTotal;
    if (data.taxes.length > 0) {
      data.taxes.forEach((tax, index) => {
        const item = response.find(r => r._id === tax);
          const override = (data.taxOverrides || []).find(r => r.id === tax);

        const taxName = item;
        const rate = item.rate;
        let effectiveRate = rate;

        if (override && override.type === 'percent') {
          effectiveRate = override.value !== '' ? override.value : rate;
        }

        let taxAmount = calculatePercent(subTotal, effectiveRate);

        if (override && override.type === 'fixed') {
          taxAmount = override.value !== '' ? override.value : taxAmount;
        }

        taxesTotal.push({
          taxName,
          rate,
          amount: taxAmount,
        });

        amount += taxAmount;
      });
    }
    amount += subTotal
  });
  let taxArrayObject = _.groupBy(taxesTotal, 'taxName._id');
  let newArryaObj = _.uniqBy(taxesTotal, 'taxName');
  taxesTotal = newArryaObj.map(item => {
    item.amount = _.sumBy(taxArrayObject[item.taxName._id], 'amount');
    return item
  });
  return {
    sumAmount: sumAmount,
    taxesTotal: taxesTotal,
    amount: amount
  };
};

const calculatePercent = (total, per) => {
  return (total / 100) * per;
};
