var { toMoney, getDisplayDate, getPrivacyUrl, getTermsUrl, getInvoicePublicUrl, hexToRgb, getImage } = require('./../../util');
import { fs } from 'fs';
const path = require('path');
let pdf = false;
let pdfFor = 'invoice';

function getStart() {
    const baseCssPath = "https://cdn.peymynt.com/static/styles/modern/"
    const cssUrl = baseCssPath + (pdf ? 'print.css' : 'screen.css');
    return `<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Page Title</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <!-- stylesheet -->
    <link rel='stylesheet' type='text/css' media='screen,print' href='${cssUrl}'>
</head>

<body>
    <div class="container"
        style=" max-width: 820px; margin: 0px auto;width: 820px; position: relative;box-sizing: border-box;padding-bottom: 20px;color: #1c252c">`
}

function getHeaderSection(data, business) {
    const bigFont = pdf ? '20px' : '30px';
    const smallFont = pdf ? '10px' : '14px';
    const headerHeight = pdf ? '140px' : '170px';
    return `<div style=" max-width: 820px; margin:0;padding:0;width: 100%; position: relative;box-sizing: border-box; margin-top:-20px;">
    <div style=" display: flex;height: ${headerHeight};">
        <div
            style="float: left;-webkit-print-color-adjust: exact;background-color: rgb(237, 102, 61);color: rgb(255, 255, 255);padding-left: 30px;width: 60%;display: flex;align-items: center;font-size: ${bigFont};font-family: Helvetica Light,Arial,sans-serif;font-weight: 300;">
            <span>
                <div>INVOICE</div>
                <div style="font-size: ${smallFont};line-height: 16px;">sub heading will be here</div>
            </span>

        </div>
        <div
            style="float: right;-webkit-print-color-adjust: exact;background-color: rgb(190, 82, 49);color: rgb(255, 255, 255);text-align: center;width: 40%;justify-content: center;align-items: center;display:flex;flex-direction:column">
            <div
                style="text-align: center;justify-content: center;font-size: ${smallFont};margin: 0 0 0 0;font-family: Helvetica Light,Arial,sans-serif;">
                Amount Due (USD)</div>
            <div
                style="font-size: ${bigFont};font-family: Helvetica Light,Arial,sans-serif;font-weight: 300;text-align: center;justify-content: center;">
                $50,000,000.00</div>
        </div>
    </div>
</div>`
}

function getEnd() {
    return `
    
    </div>
</body>

</html>
    `
}

function getBody() {
    return `<div class="body-wrapper" style="width: 100%;">
    <div class="header"></div>
    <div class="invoice_metadata cf" style="margin: 30px 30px 0 30px;">
        <div class="metadata_customer cf" style="float: left;width: 50%;">
            <div class="metadata_customerbilling cf" style="float: left;">
                <div class="metadata__addressheader"
                    style="color: #8c959a;font-size: 14px;line-height: 16px;margin-bottom: 5px;">BILL TO
                </div>
                <strong class="wave_textstrong"
                    style="font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">Geeks
                    Invention</strong>
                <div class="address cf"
                    style="font-size: 14px;line-height: 16px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">
                    <div class="address_field">First Name Last Name</div>
                    <div class="address_field">Address line 1</div>
                    <div class="address_field">Address line 2</div>
                    <div class="address_field">City, Alabama 12345</div>
                    <div class="address_field">United States</div>
                    <div class="address_field">&nbsp;</div>
                    <div class="address_field">7000789789</div>
                    <div class="address_field">irfan@irinnovative.com</div>
                </div>
            </div>
            <div class="metadat_customershipping cf" style="float: left;padding: 0 0 0 10px;">
                <div class="metadata__addressheader"
                    style="color: #8c959a;font-size: 14px;line-height: 16px; margin-bottom: 5px;">SHIP
                    TO</div>
                <strong class="wave_textstrong"
                    style="font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">Shipping
                    contact</strong>
                <div class="address cf"
                    style="font-size: 14px;line-height: 16px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">
                    <div class="address_field">Shipping 1</div>
                    <div class="address_field">Shipping 2</div>
                    <div class="address_field">Ship, Assam 987765</div>
                    <div class="address_field">India</div>
                    <div class="address_field">&nbsp;</div>
                    <div class="address_field">8287766178</div>
                </div>
            </div>
        </div>
        <div class="metadata_detail cf" style="float: right;width: 50%;text-align: center;max-width: 350px;">
            <div class="invoice_table cf" style="float: left;width: 100%;">
                <div class="invoice_tabletext" style="float: left;width: 50%;padding: 0 10px 0 10px;">
                    <strong class="strong_text"
                        style="float: right;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">Invoice
                        Number :</strong></div>
                <div class="invoice_tableno" style="float: left;width: 50%;"><span class="span_value"
                        style="float: left;font-size: 14px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">22</span>
                </div>
            </div>
            <div class="invoice_table cf" style="float: left;width: 100%;">
                <div class="invoice_tabletext" style="float: left;width: 50%;padding: 0 10px 0 10px;">
                    <strong class="strong_text"
                        style="float: right;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">Invoice
                        Date :</strong></div>
                <div class="invoice_tableno" style="float: left;width: 50%;"><span class="span_value"
                        style="float: left;font-size: 14px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">April
                        10, 2019</span></div>
            </div>
            <div class="invoice_table cf" style="float: left;width: 100%;">
                <div class="invoice_tabletext" style="float: left;width: 50%;padding: 0 10px 0 10px;">
                    <strong class="strong_text"
                        style="float: right;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">Payment
                        Due :</strong></div>
                <div class="invoice_tableno" style="float: left;width: 50%;"><span class="span_value"
                        style="float: left;font-size: 14px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">April
                        10, 2019</span></div>
            </div>

        </div>
    </div>


    <div class="metadata_item cf">
        <div class="item_detail cf" style="border-bottom: 3px solid #dee1e2;">
            <div class="item_title cf"
                style="font-weight: bold;font-family: Helvetica,Arial,sans-serif;font-size: 14px;border-bottom: 3px solid #b2c2cd;line-height: 16px;padding-top: 20px;padding-bottom: 8px;">
                <div style="padding-left: 30px;float: left;width:50%;max-width: 50%;color: #1c252c;">
                    Items</div>
                <div style="float: left;width: 10%;text-align: center;color: #1c252c;">
                    Quantity</div>
                <div style="float: left;width: 15%;text-align: right;color: #1c252c;">
                    Price</div>
                <div style="float: right;width: 20%;text-align: right;color: #1c252c;margin: 0 30px 0 0;">
                    Amount</div>
            </div>

            ${[1,2,3,4,1,2,3,4].map(t=>{
            return `
            <div class="item_titledetail cf"
                style="color: #4c5357;font-size: 14px;font-family: Helvetica,Arial,sans-serif;padding: 12px 0px;line-height: 1.4;">
                <div style="padding-left: 30px;float: left;max-width: 50%;width:50%;color: #1c252c;">
                    <strong class="item_strong" style="color: #1c252c;">Emmys 2018</strong>
                    <p>Styling Actor Parker Bates "This is US" for red carpet</p>
                </div>
                <div style="float: left;width:10%;max-width: 10%;text-align: center;color: #1c252c;">1
                </div>
                <div style="float: left;width:15%;max-width: 15%;text-align: right;color: #1c252c;">
                    $50000000.00</div>
                <div style="float: right;width:20%;max-width: 20%;text-align: right;color: #1c252c;margin: 0 30px 0 0;">
                    $500000000000.00</div>
            </div>
            `
            }).join("")}
        </div>
    </div>
    <div class="metadata_itemtotal cf" style="margin: 25px 0;color: #1c252c;display: flex;">
        <div class="item_totalblank" style="flex-grow: 5;"></div>
        <div class="item_totalamount cf"
            style="display: flex;flex-direction: column;text-align: right;font-size: 14px;line-height: 24px;color: #1c252c;">
            <div class="item_subtotal">
                <div class="item_amountline cf"
                    style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                    <div class="item_amountlable"><strong class="amount_lable" style="color: #1c252c;">
                            Sub Total:</strong></div>
                    <div class="item_amountno"
                        style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                        $5000000000.00</div>
                </div>
                <div class="item_amountline cf"
                    style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                    <div class="item_amountlable">GST 18%:</div>
                    <div class="item_amountno"
                        style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                        $900000.00</div>
                </div>
                <div class="item_amountline cf"
                    style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                    <div class="item_amountlable">jalaj 80% (12345):</div>
                    <div class="item_amountno"
                        style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                        $40000000.00</div>
                </div>
                <div class="item_amountline cf"
                    style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                    <div class="item_amountlable">GST 18%:</div>
                    <div class="item_amountno"
                        style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                        $9000000.00</div>
                </div>
            </div>
            <div class="item_amountline borderline cf"
                style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                <div class="wv-divider"
                    style="display: block;height: 0;padding: 0;border: none;border-bottom: 1px solid #d4dde3;overflow: hidden;margin: 12px auto;width: 100%;">
                    &nbsp;</div>
            </div>
            <div class="item_amountline cf"
                style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                <div class="item_amountlable"><strong class="amount_lable">Total:</strong></div>
                <div class="item_amountno"
                    style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                    $500.00</div>
            </div>
            <div>
                <div class="item_amountline cf"
                    style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                    <div class="item_amountlable"><span class="amount_labletext">Payment on July 8, 2019
                            using case:</span></div>
                    <div class="item_amountno"
                        style="width: 145px;margin-left: 10px;min-width: 125px; text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                        $44.00</div>
                </div>
            </div>
            <div class="item_amountline cf"
                style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                <div class="item_amountlable">GST 18%:</div>
                <div class="item_amountno"
                    style="width: 145px;margin-left: 10px;min-width: 125px; text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                    $90.00</div>
            </div>
            <div class="item_amountline cf"
                style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                <div class="item_amountlable">jalaj 80% (12345):</div>
                <div class="item_amountno"
                    style="width: 145px;margin-left: 10px;min-width: 125px; text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                    $400.00</div>
            </div>
            <div class="item_amountline cf"
                style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                <div class="item_amountlable">GST 18%:</div>
                <div class="item_amountno"
                    style="width: 145px;margin-left: 10px;min-width: 125px; text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                    $90.00</div>
            </div>
            <div class="item_amountline cf"
                style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                <div class="item_amountlable"><span class="amount_lable">Payment on April 8, 2019
                        using<img src="assets/images/card.svg"
                            style="width: 38px;margin: 0 0px 0 5px;height: 24px;vertical-align: middle;">
                        a bank payment:
                    </span></div>
                <div class="item_amountno"
                    style="width: 145px;margin-left: 10px;min-width: 125px; text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                    $44.00</div>
            </div>
            <div class="item_amountborder"
                style="margin: 12px auto;display: block;height: 0;padding: 0;border: none;border-bottom: 3px solid #d4dde3;overflow: hidden;width: 95%;float: right;margin-right: 27px;">
            </div>
            <div>
                <div class="item_amountline cf"
                    style="margin-right: 30px;display: flex;justify-content: flex-end;align-items: center;">
                    <div class="item_amountlable"><strong class="amount_lable" style="color: #1c252c;">Amount
                            Due (USD):</strong></div>
                    <div class="item_amountno"
                        style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Georgia,Times,Times New Roman,serif;">
                        $456.00</div>
                </div>
            </div>

        </div>
    </div>
</div>`
}

function getNotes() {
    return `<div style="margin: 0 14px 35px;white-space: pre-line;word-wrap: break-word;page-break-inside:avoid">
    <span style="width: 100%;float: left;font-size: 14px;font-family: Helvetica,Arial,sans-serif;margin: 8px 0;"><strong
            class="wv-text--strong" style="color: #1c252c;">Notes</strong></span>
    <span
        style="width: 100%;float: left;font-size: 14px;font-family: Helvetica,Arial,sans-serif;margin: 8px 0;">sadasdasdsdasd
        dsd asd as dasd asdasd asd as d</span>
</div>`
}
function getUserFooter(data) {
    return `${data.footer ? `
    <div >
        <div style="width: 100%;">
            <div  style="margin: 0 14px 0px;height:auto;text-align: center;line-height: 16px;bottom: 0px;left: 0;right: 0;white-space: pre-wrap;font-size: 1px;font-family: Helvetica,Arial,sans-serif;color: #4d6575;">
                <span style="font-size:14px">${data.footer}</span>
            </div>
        </div>
    </div>`: ``}
    <div class="footer"></div>
    <div class="time"></div>
    `
}

function getFooter(data, companyLogo) {
    const fontSize = pdf ? '10px' : '14px';
    const lineHeight = pdf ? '12px' : '16px';
    return `<div
    style="width:100%;margin: 0;padding:0; box-sizing: border-box;padding-bottom: 0px;color: #1c252c;font-size: ${fontSize}">
    <div style="left: 0;right: 0;bottom: 0;">
        <!-- <div style="text-align: center;line-height: 16px;margin: -16px 10px;white-space: pre-wrap;font-family: Helvetica,Arial,sans-serif;font-size: 14px;color: #4d6575;">
                <span>thank you som much for invoice</span>
            </div>-->
        <div
            style="display: block;height: 0;padding: 0;border: none;border-bottom: 1px solid #d4dde3;-webkit-print-color-adjust: exact;overflow: hidden;margin: 16px auto;">
        </div>
        <div style="padding: 0 24px 24px;line-height: ${lineHeight};font-family: Helvetica,Arial,sans-serif;">
            <div style="float: left;width: 33%;max-width: 215px;"><img src=${companyLogo}
                    style="max-width: 200px;max-height: 80px;"></div>
            <div style="float: left;width: 33%;max-width: 305px;">
                <strong style="color: #1c252c;">Tunnel Artists</strong>
                <div>
                    <div>222 South Main Street</div>
                    <div>Suite 1612</div>
                    <div>Los Angeles, California 90007</div>
                    <div>United States</div>
                </div>
            </div>
            <div style="float: right;width: 33%;text-align: right;max-width: 251px;">
                <strong style="color: #1c252c;">Contact Information</strong>
                <div>
                    <div>Phone: 3109550124</div>
                    <div>Mobile: 7000628392</div>
                    <div>Toll free: 1800828773</div>
                    <div>www.tunnelartist.com</div>
                </div>
            </div>
        </div>
    </div>
    <div
        style="width: 100%;height:auto;display:flow-root;justify-content:center;text-align: center;line-height: 12px;bottom: 0px;left: 0;right: 0;font-family: Helvetica,Arial,sans-serif;color: #4d6575;">
        Page <span class='pageNumber'></span> of <span class='totalPages'></span>
        for ${pdfFor == 'invoice' ? `Invoice #${data.invoiceNumber}` : `Estimate #${data.estimateNumber}`}
    </div>
</div>`
}

async function renderInvoice(business, data, setting, user, payments, print = true) {
    pdf = print;
    let output = getStart();
    output += await getBody(data, business, setting, payments);
    output += getNotes(data);
    output += getUserFooter(data);
    output += getEnd();
    let companyLogo = await getImage(setting.companyLogo);
    return {
        header: getHeaderSection(data, business),
        body: output,
        footer: getFooter(data, companyLogo)
    };
}

async function renderEstimate(business, estimate, setting, user, print = true) {
    pdf = print;
    pdfFor = 'estimate';
    let data = getStart();
    data += await getBody(estimate, business, setting, null);
    data += getNotes(estimate);
    data += getUserFooter(estimate);
    data += getEnd();
    let companyLogo = await getImage(setting.companyLogo);
    return {
        header: getHeaderSection(estimate, business, companyLogo),
        body: data,
        footer: getFooter(estimate)
    };
}

module.exports = {
    renderInvoice: renderInvoice,
    renderEstimate: renderEstimate
}