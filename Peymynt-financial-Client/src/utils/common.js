import moment from 'moment';
import React, { Fragment } from "react";
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const APP_BASE_URL = process.env.WEB_URL
const INVOICE_PUBLIC_URL = '/public/invoice/';
const INVOICE_PRIVATE_URL = '/app/invoices/view/';

const SHARE_LINK_BASE_URL = process.env.SHARE_LINK_BASE_URL;
const PUBLIC_STATEMENT_BASE_URL = process.env.PUBLIC_STATEMENT_BASE_URL;
const STRIPE_PK_KEY = process.env.STRIPE_PK_KEY;
const salt = 'strongsalt';

export const stringToSalt = (str) => {
    let textToChars = str => str.split('').map(c => c.charCodeAt(0))
    let byteHex = n => ("0" + Number(n).toString(36)).substr(-2)
    let applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code)


    str = str.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');

    return str;
}

export const saltToString = (str) => {
    let textToChars = str => str.split('').map(c => c.charCodeAt(0))
    let saltChars = textToChars(salt)
    let applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code)

    let encoded = str.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('')

    return encoded;
}


export const convertDate = (date) => {
    if (date) {
        return moment(date).format('LLL');
    } else {
        return date;
    }
}

export const getUniqueID = () => {
    return [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
}

export const getShareLink = (ID) => {
    const _UUID = getUniqueID();
    return APP_BASE_URL + getEncryptedString(ID);
}

export const getAppBaseURL = (ID) => {
    return APP_BASE_URL;
}

export const getInvoicePublicURL = (ID) => {
    return INVOICE_PUBLIC_URL + ID;
}

export const getInvoicePrivateURL = (ID) => {
    return INVOICE_PRIVATE_URL + ID;
}

export const getCheckoutShareBaseURL = (ID) => {
    return SHARE_LINK_BASE_URL;
}

export const getStatementShareBaseURL = (ID) => {
    return PUBLIC_STATEMENT_BASE_URL;
}

export const getEncryptedString = (str) => {
    let myCipher = stringToSalt(str);
    return myCipher;
}

export const getDecryptedString = (str) => {
    let myCipher = saltToString('2c7a2e2f2a2f7c7c2a7b2e7b2c282b7f7c212f2a2b287d21');
    return myCipher;
}

export const getStripeKey = () => {
    return STRIPE_PK_KEY;
}

export const getDateMMddyyyy = (date) => {
    let d = new Date(date);
    return monthsShort[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

export const getDateyyyymmdd = (date) => {
    let d = new Date(date);
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2);
}

export const getCommonFormatedDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
}

export const toDisplayDate = (date, showTime = false, format = "YYYY-MM-DD", showTz = false, tzFormat = "ha z") => {
    format = (showTime && format == "YYYY-MM-DD") ? "YYYY-MM-DD HH:mm" : format;
    let dateFinal = moment(date).format(format);
    // if(showTz){
    //     dateFinal.tz(tzFormat)
    // }
    return dateFinal;
}

export const getInvoiceFilterQuery = (customer, startDate, endDate, isShowUndepaid) => {
    return {
        "statementInput": {
            "customerId": customer,
            "startDate": getDateyyyymmdd(startDate),
            "endDate": getDateyyyymmdd(endDate),
            "scope": (isShowUndepaid == true) ? "unpaid" : "both"
        }
    }
}

export const toCommas = (value) => {
    if (!value) {
        return '0.00';
    }
    value = parseFloat(value).toFixed(2);
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const toDollar = (value) => {
    return '$' + toCommas(value);
}

export const getPrice = (str) => {
    str = str.substr(1);
    return str = str.replace(/,/g, "");
}

export const convertToPrice = (num) => {
    return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

export const isEmpty = (obj) => {
    for (var key in obj)
        if (obj.hasOwnProperty(key))
            return false;
    return true;
}
export const convertDateToYMD = (date) => {
    if (date) {
        return moment(date).format('MMMM DD, YYYY');
    } else {
        return date;
    }
}

export const getStatusClassName = (status, commonClasses) => {
    if (status === 'Online') {
        return (commonClasses + ' badge-success');
    } else if (status === 'Offline') {
        return (commonClasses + ' badge-off');
    } else if (status === 'Draft') {
        return (commonClasses + ' badge-gray');
    } else {
        return (commonClasses + ' badge-info');
    }
}

export const getCountryById = (id, countries) => {
    var result = countries.find((obj) => {
        return obj.id == id
    });
    return (result) ? { id: result.id, name: result.name } : { id: 101, name: 'India' };
}

export const getRegionById = (id, states) => {
    var result = states.find((obj) => {
        return obj.id == id
    });
    return (result) ? { id: result.id, name: result.name } : { id: -1, name: '' };
}

export const setCountries = countries => {
    return countries && countries.length ? (
        countries.map((item, i) => {
            return (
                <option key={i} value={item.id}>
                    {" "}
                    {item.name}
                </option>
            );
        })
    ) : (
            <option key={-1} value={0}>
                {" "}
                {"None"}
            </option>
        );
};

export const setCountryStates = countryStates => {
    return countryStates && countryStates.length > 0 ? (
        countryStates.map((item, i) => {
            return (
                <option key={i} value={item.id}>
                    {item.name}
                </option>
            );
        })
    ) : (
            <option key={-1} value={0} disabled>
                {"None"}
            </option>
        );
};



