var { toMoney, getDisplayDate, getPrivacyUrl, getTermsUrl, getInvoicePublicUrl, hexToRgb, getImage } = require('./../../util');
// var fs = require('fs');
import { fs } from 'fs';
const path = require('path');
let pdf = false;
let pdfFor = 'invoice';

function getStart() {
    const baseCss = "https://cdn.peymynt.com/static/styles/contemp/"
    const cssUrl = baseCss + (pdf ? 'print.css' : 'screen.css');
    return `
    <!DOCTYPE html>
    <html>
    
    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <title>Page Title</title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <!-- google fonts-->
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
        <!-- stylesheet -->
        <!--<link rel='stylesheet' type='text/css' media='screen,print' href=${cssUrl}>-->
        <style>
        *{padding:0;margin:0;-webkit-font-smoothing:antialiased;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}a,abbr,acronym,address,applet,big,blockquote,body,caption,cite,code,dd,del,dfn,div,dl,dt,em,fieldset,font,form,h1,h2,h3,h4,h5,h6,html,iframe,img,input,ins,kbd,label,legend,li,object,ol,option,p,pre,q,s,samp,select,small,span,strike,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,tt,ul,var{margin:0;padding:0;border:0;outline:0;font-size:100%}article,aside,details,figcaption,figure,footer,header,hgroup,nav,section,summary{display:block}audio,canvas,video{display:inline-block}audio:not([controls]){display:none;height:0}pre{white-space:pre;white-space:pre-wrap;word-wrap:break-word}q{quotes:none}q:after,q:before{content:'';content:none}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}nav ol,nav ul{list-style:none;list-style-image:none}button,input,select,textarea{font-size:100%;margin:0;vertical-align:baseline;font-family:'Open Sans',sans-serif}textarea{overflow:auto;vertical-align:top}table{border-collapse:collapse;border-spacing:0}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:none;cursor:pointer}:focus{outline:0}ul{list-style:none}ul li{list-style:none}table{border-collapse:separate;border-spacing:0}caption,td,th{text-align:left;font-weight:400}a{text-decoration:none}blockquote:after,blockquote:before,q:after,q:before{content:""}blockquote,q{quotes:"" ""}table{border:0 none;border-collapse:collapse;border-spacing:0}td{vertical-align:top}img{border:0 none;max-width:100%}a{outline:0;cursor:pointer}.none{display:none}article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}.clear{clear:both}img{max-width:100%}.cf:after,.cf:before{content:"";display:table}.cf:after{clear:both}button::-moz-focus-inner,input[type=button]::-moz-focus-inner,input[type=file]>input[type=button]::-moz-focus-inner,input[type=reset]::-moz-focus-inner,input[type=submit]::-moz-focus-inner{border:1px dotted transparent}footer,header,section{margin:0}.preloader{display:none}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}a{transition:.5s;-webkit-transition:.5s;-moz-transition:.5s}body,html{height:100%}body{margin:0;padding:0;font-family:Roboto,sans-serif;background-color:#fff;color:#424242;font-size:16px}.body-wrapper{width:100%}.container{margin:0 auto;width:820px;position:relative}.container:after,.container:before{display:table;content:" "}.container:after{clear:both}strong{color:#1c252c}.header-wrapper{width:100%;padding:0 0}.invoice_metadata{margin:20px 14px 10px;height:173px}.metadata_customer{float:left;width:63%;max-width:410px}.metadata__addressheader{color:#8c959a;font-size:14px;line-height:16px;font-family:Helvetica,Arial,sans-serif}.metadata_customerbilling{float:left}.metadat_customershipping{float:left;padding:0 0 0 20px}.invoice_tabletext{float:left;width:63%;padding:0 10px 0 0}.invoice_tableno{float:left;width:37%}.invoice_tabletext strong.strong_text{float:right;font-size:14px;line-height:16px;font-family:Helvetica,Arial,sans-serif;font-weight:700}.invoice_tableno span.span_value{float:left;font-size:14px;font-weight:400;font-family:Helvetica,Arial,sans-serif}.metadata_detail{float:right;width:40%;text-align:center;max-width:312px;margin:0 -30px}.invoice_table{float:left;width:100%}.metadata_customerbilling strong.wave_textstrong{font-size:14px;line-height:16px;font-family:Helvetica,Arial,sans-serif;font-weight:700}.metadat_customershipping strong.wave_textstrong{font-size:14px;line-height:16px;font-family:Helvetica,Arial,sans-serif;font-weight:700}.metadata_item{margin-top:26px;margin-right:-16px;margin-left:-16px}.address{font-size:14px;line-height:16px;font-weight:400;font-family:Helvetica,Arial,sans-serif;margin-top:10px}.item_title{font-weight:600;font-family:Helvetica,Arial,sans-serif;font-size:14px;border-collapse:collapse;line-height:16px;padding-top:15px;padding-bottom:15px;background-color:#ed663d;width:100%;padding-left:15px;color:#fff;padding-right:15px}.item{padding-left:15px;float:left;width:50%;color:#1c252c;word-break:break-all}.quantity{float:left;width:10%;text-align:center;color:#1c252c}.price{float:left;width:15%;text-align:right;color:#1c252c}.amount{float:right;width:20%;text-align:right;color:#1c252c;margin:0 20px 0 0}.item_titledetail{background-color:#fff;color:#4c5357;font-size:14px;font-family:Helvetica,Arial,sans-serif;padding:12px 15px;line-height:1.4}.item_titledetail:hover{background:#e6f1ff;border-color:#d4dde3}.metadata_itemtotal{margin:25px 0;color:#1c252c;display:flex}.item_totalblank{flex-grow:5}.item_totalamount{display:flex;flex-direction:column;text-align:right;font-size:14px;line-height:24px;color:#1c252c}.item_amountno{width:145px;margin-left:10px;min-width:125px;text-align:right;font-family:Georgia,Times,Times New Roman,serif}.item_amountline{margin-right:20px;display:flex;justify-content:flex-end;align-items:center}.item_amountborder{margin:12px auto;display:block;height:0;padding:0;border:none;border-bottom:3px solid #d4dde3;overflow:hidden;width:98%;float:right;margin-right:10px}.item_detail{border-bottom:3px solid #d4dde3}.amount_lable img{width:38px;margin:0 0 0 5px;height:24px;vertical-align:middle}.metadata_footerlogo{float:left;width:33%;max-width:215px}.metadata_footerlogo img{max-width:200px;max-height:80px}.metadata_footeradd{float:left;width:33%;max-width:305px}.metadata_contact{float:right;width:33%;text-align:right;max-width:251px}.sticky_border{display:block;height:0;padding:0;border:none;border-bottom:1px solid #d4dde3;overflow:hidden;margin:24px auto}.metadata_stickybottom{position:absolute;left:0;right:0;bottom:0}.metadata_businessinfo{padding:0 24px 24px;font-size:14px;line-height:16px;font-family:Helvetica,Arial,sans-serif}hr{border:none;border-top:medium double #dee1e2;width:65%;margin:12px 15px 12px 0;float:right}.wave_add{font-size:14px;line-height:16px;margin-top:10px}.invoice_table_amount{float:left;width:100%}.invoice_table_tabletext_amount{padding:5px 0;border:1px solid #f4f5f5;margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:16px;background:#f4f5f5;float:left;width:100%}.contemporary-template__divider--full-width .wv-divider{margin-left:-16px;margin-right:-16px}.wv-divider,.wv-divider--whitespace{display:block;height:0;padding:0;border:none;border-bottom:1px solid #d4dde3;overflow:hidden;margin:24px auto}.item_detail.no_quantity .item_title .quantity{display:none}.item_detail.no_quantity .item_title .item{padding-left:15px;float:left;width:54%;max-width:415px}.item_detail.no_quantity .item_title .price{float:left;width:28%;text-align:right}.item_detail.no_price .item_title .price{display:none}.item_detail.no_price .item_title .item{padding-left:15px;float:left;width:54%;max-width:415px}.item_detail.no_price .item_title .quantity{float:left;width:28%;text-align:center}.item_detail.no_amount .item_title .amount{display:none}.item_detail.no_amount .item_title .item{padding-left:15px;float:left;width:54%;max-width:415px}.item_detail.no_amount .item_title .quantity{float:left;width:28%;text-align:center}.item_detail.no_amount .item_title .price{float:left;width:15%;text-align:right;color:#1c252c}.item_detail.no_quantity.no_price .item_title .quantity .price{display:none}.item_detail.no_quantity.no_price .item_title .amount{float:left;width:43%;text-align:right}.item_detail.no_price.no_amount .item_title .price .amount{display:none}.item_detail.no_price.no_amount .item_title .quantity{float:left;width:43%;text-align:right}.item_detail.no_quantity.no_amount .item_title .quantity .amount{display:none}.item_detail.no_quantity.no_amount .item_title .price{float:left;width:43%}.item_detail.no_quantity.no_price.no_amount .quantity .price .amount{display:none}.wv-heading--subtitle{font-size:14px;font-family:Helvetica,Arial,sans-serif;line-height:16px;margin:10px 0 16px 0;color:gray}.footer_wrapper{width:100%;height:130px}.classic-template .wv-heading--subtitle{word-wrap:break-word;color:gray;font-size:14px;margin-top:0;line-height:16px;font-family:Helvetica,Arial,sans-serif}.classic-template__memo{margin:0 14px 70px;white-space:pre-line;word-wrap:break-word}span.wv-text.wv-text--small{width:100%;float:left;font-size:14px;font-family:Helvetica,Arial,sans-serif;margin:8px 0}.classic-template__footer{margin:0 14px 0;text-align:center;line-height:16px;position:absolute;bottom:0;left:0;right:0;white-space:pre-wrap;font-size:14px;font-family:Helvetica,Arial,sans-serif;color:#4d6575}.item_totalamount .wv-divider{display:block;height:0;padding:0;border:none;border-bottom:1px solid #d4dde3;overflow:hidden;margin:12px auto;width:100%}
        </style>
    </head>
    
    <body>
        <section class="body-wrapper">
            <div class="container">
    `
}

function getHeaderSection(data, business, companyLogo) {
    const baseFontSize = pdf ? '10px' : '14px';
    const logoWidth = pdf ? '200px' : '300px';
    const headerHeight = pdf ? '170px' : '220px';
    const lineHeight = pdf ? '12px' : '16px';
    return `<div style="width: 100%;padding: 0px 0;    -webkit-box-sizing: border-box;">
    <div>
        <div style="height: ${headerHeight};flex-wrap: wrap;margin: 15px ${pdf ? `20px` : `11px`} 0;">
            <div style="float: left;width: auto;display: flex;align-items: center;">
                ${companyLogo ? `<img src="${companyLogo}" style="max-height: 150px;max-width: ${logoWidth};">` : `&nbsp;`}
            </div>
            <div style="float: right;width: auto;text-align: right;font-family: Helvetica,Arial,sans-serif;">
                <div
                    style="margin-top: 0;margin-bottom: 0;font-size: 30px;font-weight: 300;font-family: Helvetica,Arial,sans-serif;color: #1c252c;">
                    ${pdfFor == 'invoice' ? `${data.title}` : `${data.name}`}</div>
                <div>
                    ${pdfFor == 'invoice' ? `
                    ${data.subTitle ? `<div style='font-size: ${baseFontSize}'>
                        <div>${data.subTitle}</div>
                    </div>`: ``}
                    `: `
                    ${data.subheading ? `<div style='font-size: ${baseFontSize}'>
                        <div>${data.subheading}</div>
                    </div>`: ``}
                    `}
                </div>
                <strong style="color: #1c252c;font-size: ${baseFontSize}">${business.organizationName}</strong>
                ${business.address ? `<div
                    style="font-size: ${baseFontSize};line-height: ${lineHeight};margin-top: 10px;">
                    ${business.address.addressLine1 ? `<div>${business.address.addressLine1}</div>` : ``}
                    ${business.address.addressLine2 ? `<div>${business.address.addressLine2}</div>` : ``}
                    ${business.address.city ? `<div>${business.address.city},${business.address.state ? ` ${business.address.state.name}` : ``}${business.address.postal ? ` ${business.address.postal}` : ``}</div>` : ``}
                    ${business.address.country ? `<div>${business.address.country.name}</div>` : ``}
                </div>`: ``}
                <!-- <br> -->
                ${business.communication ? `<div style="font-size: ${baseFontSize};line-height: ${lineHeight};margin-top: 10px;">
                    ${business.communication.phone ? `<div>Phone: ${business.communication.phone}</div>` : ``}
                    ${business.communication.fax ? `<div>Fax: ${business.communication.fax}</div>` : ``}
                    ${business.communication.mobile ? `<div>Mobile: ${business.communication.mobile}</div>` : ``}
                    ${business.communication.tollFree ? `<div>Toll free: ${business.communication.tollFree}</div>` : ``}
                    ${business.communication.website ? `<div>${business.communication.website}</div>` : ``}
                </div>`: ``}
            </div>
        </div>
        <div class="contemporary-template__divider--full-width">
            <div class="wv-divider"
                style="margin-left: -16px;margin-right: -16px;display: block;height: 0;padding: 0;border: none;border-bottom: 1px solid #d4dde3;overflow: hidden;margin: 24px auto;">
            </div>
        </div>
    </div>
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
function getEnd() {
    return `
        </div>
        </section>
    </body>
    </html>
    `
}
function getFooter(data) {
    return `<div
        style="width: 100%;height:auto;margin: 0 14px 0px;text-align: center;line-height: 12px;bottom: 0px;left: 0;right: 0;font-size: 10px;font-family: Helvetica,Arial,sans-serif;color: #4d6575;">
        Page <span class='pageNumber'></span> of <span class='totalPages'></span>
        for ${pdfFor == 'invoice' ? `Invoice #${data.invoiceNumber}` : `Estimate #${data.estimateNumber}`} 
</div>`
}
function getNotes(data) {
    return `${(data.notes || data.memo) ? `<div style="width: 100%;height: auto;">
    <div style="margin: 0 14px 70px;white-space: pre-line;word-wrap: break-word;page-break-inside:avoid">
        <span
            style="width: 100%;float: left;font-size: 14px;font-family: Helvetica,Arial,sans-serif;margin: 8px 0;"><strong
                style="color: #1c252c;">Notes</strong></span>
        <span
            style="width: 100%;float: left;font-size: 14px;font-family: Helvetica,Arial,sans-serif;margin: 8px 0;">${pdfFor == 'invoice' ? `${data.notes}` : `${data.memo}`}</span>
    </div>
</div>`: ``}`
}
function getBillingSection(customer) {
    return `<div class="metadata_customerbilling cf" style="float: left;">
    <div class="metadata__addressheader"
        style="color: #8c959a;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;">
        BILL TO</div>
    <strong class="wave_textstrong"
        style="font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">${customer.customerName}</strong>
    <div class="address cf"
        style="font-size: 14px;line-height: 16px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;margin-top: 10px;">
        <div class="address_field">${customer.firstName ? ` ${customer.firstName}` : ``}${customer.lastName ? `
            ${customer.lastName}` : ``}
        </div>
        ${customer.addressBilling ? `
        ${customer.addressBilling.addressLine1 ? `<div class="address_field">${customer.addressBilling.addressLine1}
        </div>
        `: ``}
        ${customer.addressBilling.addressLine2 ? `<div class="address_field">${customer.addressBilling.addressLine2}
        </div>
        `: ``}
        ${customer.addressBilling.city || customer.addressBilling.state ? `<div class="address_field">
            ${customer.addressBilling.city ? `${customer.addressBilling.city},` : ``}
            ${customer.addressBilling.state ? ` ${customer.addressBilling.state.name}` : ``}
            ${customer.addressBilling.postal ? ` ${customer.addressBilling.postal}` : ``}
        </div>`: ``}
        ${customer.addressBilling.country ? `<div class="address_field">${customer.addressBilling.country.name}</div>
        `: ``}
        <div class="address_field">&nbsp;</div>
        ${customer.communication ? `
        ${customer.communication.phone ? `<div class="address_field">${customer.communication.phone}</div>` : ``}
        ${customer.email ? `<div class="address_field">${customer.email}</div>` : ``}
        `: ``}
        `: ``}
    </div>
</div>`
}
function getShippingSection(customer) {
    return `${customer.addressShipping && customer.addressShipping.contactPerson ? `<div class="metadat_customershipping cf" style="float: left;padding: 0 0 0 20px;">
    <div class="metadata__addressheader"
        style="color: #8c959a;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;">
        SHIP TO</div>
        <strong class="wave_textstrong"
        style="font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">${customer.addressShipping.contactPerson}</strong>
    <div class="address cf"
        style="font-size: 14px;line-height: 16px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;margin-top: 10px;">
        ${customer.addressShipping.addressLine1 ? `<div class="address_field">${customer.addressShipping.addressLine1}
        </div>
        `: ``}
        ${customer.addressShipping.addressLine2 ? `<div class="address_field">${customer.addressShipping.addressLine2}
        </div>
        `: ``}
        ${customer.addressShipping.city || customer.addressShipping.state ? `<div class="address_field">
            ${customer.addressShipping.city ? `${customer.addressShipping.city},` : ``}
            ${customer.addressShipping.state ? ` ${customer.addressShipping.state.name}` : ``}
            ${customer.addressShipping.postal ? ` ${customer.addressShipping.postal}` : ``}
        </div>`: ``}
        ${customer.addressShipping.country ? `<div class="address_field">${customer.addressShipping.country.name}</div>
        `: ``}
        <div class="address_field">&nbsp;</div>
        ${customer.addressShipping.phone ? `<div class="address_field">${customer.addressShipping.phone}</div>` : ``}
        ${customer.addressShipping.email ? `<div class="address_field">${customer.addressShipping.email}</div>` : ``}
        
    </div>
</div>`: ``}`
}
function getInvoiceMetaSection(data) {
    return `<div class="metadata_detail cf" style="float: right;width: 45%;text-align: center;max-width: 350px;margin: 0 -30px;">
    <div class="invoice_table cf" style="line-height:19px; float: left;width: 100%;">
        <div class="invoice_tabletext" style="float: left;width: 50%;padding: 0 15px 0 0px;">
            <strong class="strong_text"
                style="float: right;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">
                ${pdfFor == 'invoice' ? `Invoice Number` : `Estimate Number`}:</strong></div>
        <div class="invoice_tableno" style="float: left;width: 50%;"><span class="span_value"
                style="float: left;font-size: 14px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">
                ${pdfFor == 'invoice' ? `${data.invoiceNumber}` : `${data.estimateNumber}`}
                </span>
        </div>
    </div>
    ${data.purchaseOrder ? `<div class="invoice_table cf" style="line-height:19px; float: left;width: 100%;">
        <div class="invoice_tabletext" style="float: left;width: 50%;padding: 0 15px 0 0px;">
            <strong class="strong_text"
                style="float: right;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">P.O./S.O. Number:</strong></div>
        <div class="invoice_tableno" style="float: left;width: 50%;"><span class="span_value"
                style="float: left;font-size: 14px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">${data.purchaseOrder}</span>
        </div>
    </div>`: ``}
    <div class="invoice_table cf" style="line-height:19px; float: left;width: 100%;">
        <div class="invoice_tabletext" style="float: left;width: 50%;padding: 0 15px 0 0px;">
            <strong class="strong_text"
                style="float: right;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">
                ${pdfFor == 'invoice' ? `Invoice` : `Estimate`} Date:</strong></div>
        <div class="invoice_tableno" style="float: left;width: 50%;"><span class="span_value"
                style="float: left;font-size: 14px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">
                ${pdfFor == 'invoice' ? `${getDisplayDate(data.invoiceDate, "MMMM D, YYYY")}` : `${getDisplayDate(data.estimateDate, "MMMM D, YYYY")}`}</span></div>
    </div>
    <div class="invoice_table cf" style="line-height:19px; float: left;width: 100%;">
        <div class="invoice_tabletext" style="float: left;width: 50%;padding: 0 15px 0 0px;">
            <strong class="strong_text"
                style="float: right;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;color: #1c252c;">
                ${pdfFor == 'invoice' ? `Payment Due` : `Expires On`}:</strong></div>
        <div class="invoice_tableno" style="float: left;width: 50%;"><span class="span_value"
                style="float: left;font-size: 14px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;">
                ${pdfFor == 'invoice' ? `${getDisplayDate(data.dueDate, "MMMM D, YYYY")}` : `${getDisplayDate(data.expiryDate, "MMMM D, YYYY")}`}</span></div>
    </div>
    <div class="invoice_table_tabletext_amount cf"
        style="padding: 5px 0px;border: 1px solid #f4f5f5;margin: 0px 0 0 0;font-family: Helvetica,Arial,sans-serif;font-size: 14px;line-height: 16px;background: #f4f5f5;float: left;width: 100%;">
        <div class="invoice_tabletext" style="float: left;width: 50%;padding: 0 15px 0 0px;">
            <strong class="strong_text"
                style="float: right;font-size: 14px;line-height: 16px;font-family: Helvetica,Arial,sans-serif;font-weight: bold;">
                ${pdfFor == 'invoice' ? `Amount Due` : `Grand Total`} (${data.currency.code}):</strong></div>
        <div class="invoice_tableno" style="float: left;width: 50%;"><span class="span_value"
                style="float: left;font-size: 14px;font-weight: normal;font-family: Helvetica,Arial,sans-serif;"><strong
                    style="color: #1c252c;">${data.currency.symbol}${toMoney(data.totalAmount)}</strong></span>
        </div>
    </div>
</div>
</div>`
}
function getItemTableSection(data, accentColor) {
    console.log("accentColor", accentColor);
    const headerColor = '#ffffff';
    return `<div class="metadata_item cf" style="margin-top: 26px;margin-right: -16px;margin-left: -16px;">
    <div class="item_detail cf" style="border-bottom: 3px solid #d4dde3;">
        <div class="item_title cf"
            style="font-weight: 600;font-family: Helvetica,Arial,sans-serif;font-size: 14px;border-collapse: collapse;line-height: 16px;padding-top: 15px;padding-bottom: 15px;background-color: rgb(${accentColor.r}, ${accentColor.g}, ${accentColor.b});width: 100%;padding-left: 15px;color: rgb(255, 255, 255);padding-right: 15px;">
            ${!data.itemHeading.hideItem ? `
            <div class="item"
                style="color: ${headerColor};">
                Items</div>
            `: ``}
            ${!data.itemHeading.hideQuantity ? `
            <div class="quantity" style="color: ${headerColor};">
                Quantity
            </div> `: ``}
            ${!data.itemHeading.hidePrice ? `
            <div class="price" style="color: ${headerColor};">Price
            </div>
            `: ``}
            ${!data.itemHeading.hideAmount ? `
            <div class="amount"
                style="color: ${headerColor};">
                Amount</div>
            `: ``}
        </div>
        ${data.items.map(i => {
        return `<div class="item_titledetail cf"
            style="background-color: white;color: #4c5357;font-size: 14px;font-family: Helvetica,Arial,sans-serif;padding: 12px 15px;line-height: 1.4;page-break-inside:avoid">
            <div class="item">
                ${!data.itemHeading.hideItem ? `<strong class="item_strong"
                    style="color: #1c252c;">${pdfFor == 'invoice' ? `${i.column1}` : `${i.name}`}</strong>` : ``}
                ${!data.itemHeading.hideDescription ? `<p>${pdfFor == 'invoice' ? `${i.column2}` : `${i.description}`}</p>` : ``}
            </div>
            ${!data.itemHeading.hideQuantity ? `<div class="quantity">${pdfFor == 'invoice' ? `${i.column3}` : `${i.quantity}`}</div>` : ``}
            ${!data.itemHeading.hidePrice ? `<div class="price">
                ${data.currency.symbol}${pdfFor == 'invoice' ? `${toMoney(i.column4)}` : `${toMoney(i.price)}`}
            </div>`: ``}
            ${!data.itemHeading.hideAmount ? `<div class="amount">
                ${data.currency.symbol}${toMoney(i.amount)}</div>` : ``}
        </div>`
    }).join('')}
    </div>
</div>`
}
async function getTotalSection(currency, amountBreakup, amountToDisplay, payments) {
    return `<div class="metadata_itemtotal cf" style="margin: 25px 0; color: #1c252c; display: flex;page-break-inside:avoid">
    <div class="item_totalblank" style="flex-grow: 5;"></div>
    <div class="item_totalamount cf"
        style="display: flex;flex-direction: column;text-align: right;font-size: 14px;line-height: 24px;color: #1c252c;">
        <div class="item_subtotal">
            <div class="item_amountline cf">
                <div class="item_amountlable"><strong class="amount_lable" style="color: #1c252c;">
                        Subtotal:</strong></div>
                <div class="item_amountno"
                    style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Helvetica,Arial,sans-serif;">
                    ${currency.symbol}${toMoney(amountBreakup.subTotal)}</div>
            </div>
            ${amountBreakup.taxTotal && amountBreakup.taxTotal.length ? `${amountBreakup.taxTotal.map(t => {
        return `
            <div class="item_amountline cf">
                <div class="item_amountlable">${t.taxName.abbreviation}
                    ${t.taxName.rate}%${t.taxName.other.showTaxNumber ? ` (${t.taxName.taxNumber})` : ``}:</div>
                <div class="item_amountno"
                    style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Helvetica,Arial,sans-serif;">
                    ${currency.symbol}${toMoney(t.amount)}</div>
            </div>
            `;
    }).join('')}` : ``}
        </div>
        <div class="item_amountline borderline cf">
            <div class="wv-divider"
                style="display: block;height: 0;padding: 0;border: none;border-bottom: 1px solid #d4dde3;overflow: hidden; margin: 12px auto 8px auto;width: 100%;">
                &nbsp;</div>
        </div>
        <div class="item_amountline cf">
            <div class="item_amountlable"><strong class="amount_lable" style="color: #1c252c;">Total:</strong></div>
            <div class="item_amountno"
                style="    width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Helvetica,Arial,sans-serif;">
                ${currency.symbol}${toMoney(amountBreakup.total)}</div>
        </div>
        ${pdfFor == 'invoice' && payments && payments.length ? `<div style='font-family:Helvetica,Arial,sans-serif'>${await getPaymentSection(payments, currency)}</div>` : ``}
        <div class="item_amountborder"
            style="margin: 8px auto 12px auto;display: block;height: 0;padding: 0;border: none; border-bottom: 3px solid #d4dde3; overflow: hidden;width: 98%;float: right;margin-right: 10px;">
        </div>
        <div>
            <div class="item_amountline cf">
                <div class="item_amountlable"><strong class="amount_lable" style="color: #1c252c;">
                ${pdfFor == 'invoice' ? `Amount Due` : `Grand Total`}
                        (${currency.code}):</strong></div>
                <div class="item_amountno"
                    style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right;font-family: Helvetica,Arial,sans-serif;">
                    <strong>${currency.symbol}${toMoney(amountToDisplay)}</strong></div>
            </div>
        </div>
    </div>
</div>`
}
async function getPaymentSection(payments, currency) {
    let paymentRows = ""
    for (let i = 0; i < payments.length; i++) {
        let p = payments[i];
        paymentRows += `<div class="item_amountline cf">
        <div class="item_amountlable"><span class="amount_lable">Payment on ${getDisplayDate(p.paymentDate,
            "MMMM DD, YYYY")}${await getPaymentRow(p)}</span></div>
        <div class="item_amountno"
            style="width: 145px;margin-left: 10px;min-width: 125px;text-align: right; font-family: Helvetica,Arial,sans-serif;">
            ${p.type == 'refund' ? `(` : ``}${currency.symbol}${toMoney(p.amount)}${p.type == 'refund' ? `)` : ``}</div>
    </div>`
    }
    return paymentRows;
}

async function getPaymentRow(p) {
    let row = " using"
    const baseUrl = 'https://cdn.peymynt.com/static/cards/';
    switch (p.methodToDisplay) {
        case "other": {
            row = "";
            break;
        }
        case "paypal": {
            row += " PayPal";
            break;
        }
        case "card": {
            if (p.method === 'card') {
                const cardBase64 = await getImage(`${baseUrl}/${p.card.type}.svg`);
                row += ` <img src=${cardBase64}
                style="width: 38px;margin: 0 3px -2px 3px;height: 24px;vertical-align: baseline;"></img> ending in ${p.card.number}`
            } else
                row += " a credit card";
            break;
        }
        case "cheque": {
            row += " a check";
            break;
        }
        case "cash": {
            row += " cash";
            break;
        }
        case "bank": {
            if (p.method === 'bank') {
                const cardBase64 = await getImage(`${baseUrl}/bank.svg`);
                row += ` <img src=${cardBase64}
                style="width: 38px;margin: 0 3px -2px 3px;height: 24px;vertical-align: baseline;"></img> from ${p.bank.name.toUpperCase()}, account ending in ${p.bank.number}`
            } else
                row += " a bank payment";
            break;
        }
    }
    // console.log(`method ${p.methodToDisplay}->start${row}:end`)
    return `${row}:`;
}

async function getBody(data, business, setting, payments) {
    const amountToDisplay = pdfFor == 'invoice' ? data.dueAmount : data.totalAmount;
    return `<div class="body-wrapper" style="width: 100%;">
    <div class="header"></div>
    <div class="invoice_metadata cf" style="margin: 20px 14px 10px;height: auto;">
        <div class="metadata_customer cf" style="float: left;width: 63%;max-width: 410px;">
            ${getBillingSection(data.customer)}
            ${getShippingSection(data.customer)}
        </div>

        ${getInvoiceMetaSection(data)}
        ${getItemTableSection(data, hexToRgb(setting.accentColour))}
        ${await getTotalSection(data.currency, data.amountBreakup, amountToDisplay, payments)}
    </div>`
}
async function renderInvoice(business, data, setting, user, payments, print = true) {
    pdf = print;
    pdfFor = 'invoice';
    let output = getStart();
    output += await getBody(data, business, setting, payments);
    output += getNotes(data);
    output += getUserFooter(data);
    output += getEnd();
    let companyLogo = await getImage(setting.companyLogo);
    return {
        header: getHeaderSection(data, business, companyLogo),
        body: output,
        footer: getFooter(data)
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