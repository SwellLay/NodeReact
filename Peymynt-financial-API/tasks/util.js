let moment = require('moment');
var base64Img = require('base64-img');

function toMoney(price, addComma = true) {
    if (typeof price === 'string') {
        price = parseFloat(price)
    }
    price = price || 0;
    if (addComma) {
        return price.toMoney1(2, '.', ',')
    } else return price.toMoney1(2, '.', '')
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

function getDisplayDate(date, format) {
    if (format)
        return moment(date).format(format);
    else return moment(date).format('MMM DD, YYYY');
}

function getTermsUrl(env = 'dev') {
    return getBaseUrl(env) + "/assets/pages/termsofuse.html";
}
function getPrivacyUrl(env = 'dev') {
    return getBaseUrl(env) + "/assets/pages/privacypolicy.html";
}
function getInvoicePublicUrl(invoiceUuid, env = 'dev') {
    return getBaseUrl(env) + "/public/invoice/" + invoiceUuid;
}

function getAccountStatementPublicUrl(statementUuid, env = 'dev') {
    return getBaseUrl(env) + "/public/statements/preview/" + statementUuid;
}

function getBaseUrl(env) {
    let baseUrl = "https://";
    switch (env) {
        case 'dev':
            baseUrl += "dev.";
            break;
        case 'pre':
            baseUrl += "pre.";
            break;
        case 'beta':
            baseUrl += "beta.";
            break;
    }
    baseUrl += "peymynt.com";
    return baseUrl;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getImage(url) {
    console.log("Fetching image for ", url);
    return new Promise((resolve, reject) => {
        if (url) {
            base64Img.requestBase64(url, function (err, res, body) {
                if (err) {
                    console.log("Error while fetching image for ", url);
                    console.error(err);
                    reject("");
                } else {
                    body = body.replace("data:application/x-www-form-urlencoded", "data:image/png");
                    resolve(body);
                }
            });
        } else
            resolve("")
    })
}

module.exports = {
    toMoney: toMoney,
    getDisplayDate: getDisplayDate,
    getTermsUrl: getTermsUrl,
    getPrivacyUrl: getPrivacyUrl,
    getInvoicePublicUrl: getInvoicePublicUrl,
    getAccountStatementPublicUrl: getAccountStatementPublicUrl,
    hexToRgb: hexToRgb,
    getImage: getImage
}