import * as PaymentIcon from 'global/PaymentIcon';
import moment from 'moment'
import React from 'react';
import TimeAgo from 'react-timeago'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { downloadPdf } from '../api/InvoiceService';
import stringsDue from '../components/app/components/invoice/helpers/InvoiceDueFormatter';
import stringsSend from '../components/app/components/invoice/helpers/SendBlockFormatter';
import strings from '../components/app/components/invoice/helpers/ViewedDateFormatter';
import { convertDateToYMD, toDisplayDate } from './common';
import history from '../customHistory';

const formatter = buildFormatter(strings);
const formatterSend = buildFormatter(stringsSend);
const formatterDue = buildFormatter(stringsDue);

export function changePhoneFormate(phoneNumber) {
  if (phoneNumber) {
    let r = phoneNumber.replace(/\D/g, '');
    r = r.replace(/^0/, '');
    return r.replace(/^(\d\d\d)(\d{3})(\d{4}).*/, '($1) $2-$3')
  } else {

  }
}

export function changeZipFormate(zipNumber) {
  if (zipNumber) {
    let r = zipNumber.replace(/\D/g, '');
    r = r.replace(/^0/, '');
    return (r = r.replace(/^(\d{5})(\d{4}).*/, '$1$2'))
  } else {
    return ''
  }
}

// Convert Number type value to money
Number.prototype.toMoney1 = function (decimals, decimal_sep, thousands_sep) {
  var n = this;

  var c = isNaN(decimals) ? 2 : Math.abs(decimals);
  // if decimal is zero we must take it, it means user does not want to show any decimal

  var d = decimal_sep || '.';
  // if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)
  /*
    according to [https://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
    the fastest way to check for not defined parameter is to use typeof value === 'undefined'
    rather than doing value === undefined.
    */

  var t = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
  // if you don't want to use a thousands separator you can pass empty string as thousands_sep value

  var sign = n < 0 ? '-' : '';

  // extracting the absolute value of the integer part of the number and converting to string

  var i = parseInt((n = Math.abs(n).toFixed(c))) + '';

  var j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    sign +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
      Math.abs(n - i)
        .toFixed(c)
        .slice(2)
      : '')
  )
};

export function toMoney(price, addComma = true) {
  if (typeof price === 'string') {
    price = parseFloat(price)
  }
  price = price || 0;
  if (addComma) {
    return price.toMoney1(2, '.', ',')
  } else return price.toMoney1(2, '.', '')
}

// Convert String type value to money
String.prototype.toMoney = function () {
  let price = parseFloat(this) || 0;
  return `${price.toMoney1()}`
};

export function changePriceFormat(price, fixed = 2) {
  if (typeof price === 'string') {
    price = parseFloat(price)
  }
  price = price || 0;
  return Number(price)
}

export const sortData = (value1, value2, order) => {
  if (order === 'asc') {
    return value2 - value1
  }
  return value1 - value2 // desc
};

export function privacyPolicy() {
  window.open(`${process.env.WEB_URL}/policy`)
}

export function terms() {
  window.open(`${process.env.WEB_URL}/terms`)
}

export function security() {
  window.open(`${process.env.WEB_URL}/security`)
}

export function getstarted() {
  window.open(`${process.env.WEB_URL}/register`)
}

// Converts any color into darker shade shadeColor("#63C6FF",-40);
// Converts any color into ligher shade shadeColor("#63C6FF",40);
export function shadeColor(color, percent = -20) {
  if (isDarkColor(color)) {
    percent = 40;
  } else {
    percent = -20;
  }
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);
  if (R == 0)
    R = 32;
  if (G == 0)
    G = 32;
  if (B == 0)
    B = 32;
  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);
  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;
  var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);
  return '#' + RR + GG + BB
}

// Function tells whether provided color is bright or dark
function isDarkColor(color) {

  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {

    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

    r = color[1];
    g = color[2];
    b = color[3];
  } else {

    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'));

    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return false;
  } else {
    return true;
  }
}

export const _prettyDate = (date) => {
  if (Math.abs(moment(date).diff(moment())) < 1000) { // 1000 milliseconds
    return 'just a moment ago';
  }
  return moment().fromNow(date);
};

export const _prettyDateTime = (date, showTime, format, showTz, tzFormat) => {
  if ((moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days')) >= 0 && (moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days')) <= 6) {
    return <TimeAgo date={moment(date).add(1, 'days').startOf('day').format('ll')} formatter={formatter} />
  } else if (moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days') < 0 && moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days') >= -6) {
    return <TimeAgo date={moment(date).startOf('day').format('ll')} formatter={formatterDue} />
  } else {
    return toDisplayDate(date, showTime, format, showTz, tzFormat)
  }
};

export const _dueText = (date) => {
  let txt = "Due";
  if ((moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days')) > 0 && (moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days')) <= 6) {
    if ((moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days')) <= 1) {
      txt = 'Due'
    } else
      txt = "Due in"
  } else if ((moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days')) <= 0 && (moment(date).startOf('day').diff(moment(new Date()).startOf('day'), 'days')) >= -6) {
    txt = "Due"
  } else {
    txt = "Due on"
  }
  return txt;
};

export const _calculateTotalPaid = data => {
  let total = 0;
  if (!!data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      total = total + data[i].amount
    }
  }
  return total;
};

export const _documentTitle = (businessInfo, title) => {
  const parts = ['Peymynt'];
  if (businessInfo && businessInfo.organizationName) {
    parts.push(businessInfo.organizationName);
  }
  if (title) {
    parts.push(title);
  }
  document.title = parts.join(' - ');
};

export const _paymentMethodDisplay = (method) => {
  let txt = "";
  if (!!method) {
    switch (method.toLowerCase()) {
      case "bank":
        txt = ` using a bank payment`;
        break;
      case "cash":
        txt = ' using cash';
        break;
      case "cheque":
        txt = " using a check";
        break;
      case "card":
        txt = " using a credit card";
        break;
      case "paypal":
        txt = ' using PayPal';
        break;
      case "other":
        txt = "";
        break;
      default:
        txt = ""
    }
  }
  return txt;
};

export const _paymentMethodIcons = (method) => {
  let icon = PaymentIcon[method];
  return icon;
};

export const _showPaymentText = (date, currency, type, amount) => {
  let text = `${convertDateToYMD(date)} - A payment for <strong>${type === 'refund' ? `(${getAmountToDisplay(currency, amount)})` : getAmountToDisplay(currency, amount)}</strong>`;
  return text;
};

export const getAmountToDisplay = (currency, amount) => {
  const symbol = currency ? currency.symbol : "";
  amount = amount < 0 ? `(${symbol}${toMoney((amount * -1))})` : `${symbol}${toMoney(amount)}`;
  return `${amount}`;
};

export const _showExchangeRate = (businessCurrency, matchCurrency) => {
  if(!!matchCurrency && !!matchCurrency.code){
    if (((businessCurrency && businessCurrency.code) !== (matchCurrency && matchCurrency.code))) {
      return true
    } else {
      return false
    }
  }else{
    return false
  }
};

export const _calculateExchangeRate = (exchangeRate, amount) => {
  const total = exchangeRate * amount;
  return total;
};

export const _showAmount = (symbol, amount) => {
  const totalAmount = `${symbol}${toMoney(amount)}`;
  return totalAmount;
};


export const _exportPDF = async (data, type) => {
  // const { data } = this.state;
  const date = moment().format("YYYY-MM-DD");
  try {
    let pdfLink = await downloadPdf(data.uuid, type);
    if (!!pdfLink) {
      const blob = new Blob([pdfLink], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${type.toUpperCase()}_${data.invoiceNumber}_${date}.pdf`;
      link.click();
      // if (this.props.location.search.includes('download=true')) {
      //   window.close()
      // }
    }
  } catch (err) {
    console.error("Error in PDF download", err)
  }
  // window.open(`${process.env.WEB_URL}/public/invoice/${this.state.data.uuid}?download=true`)

};

export const _setCurrency = (currentCurrency, businessCurrency) => {
  let currency = {
    symbol: '$',
    code: 'USD',
    displayName: "USD ($)-US Dollar",
    name: "US Dollar",
  }
  if(!!currentCurrency){
    if(!!currentCurrency.code && !!currentCurrency.symbol){
      currency = {
        symbol: currentCurrency.symbol,
        code: currentCurrency.code,
        displayName: currentCurrency.displayName,
        name: currentCurrency.name
      }
    }
  }else if(!!businessCurrency){
    if(!!businessCurrency.code && !!businessCurrency.symbol){
      currency = {
        symbol: businessCurrency.symbol,
        code: businessCurrency.code,
        displayName: businessCurrency.displayName,
        name: businessCurrency.name
      }
    }
  }
  return currency;
}

export const _downloadPDF = async(data, from) => {
  let link;
  try{
    let pdfLink = await downloadPdf(data.uuid, from);
    console.log("pdfLink" ,pdfLink)
    if(!!pdfLink){
      const blob = new Blob([pdfLink], {type: 'application/pdf'})
      link = document.createElement('a');
      link.href=window.URL.createObjectURL(blob);
    }
    return link;
  }catch(err){
    console.error("Error in PDF download", err)
    return false;
  }
};

export const isEmail= (value)=>{
  const regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return regex.test(value)
};