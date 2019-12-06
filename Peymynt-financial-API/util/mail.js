import mailgun from 'mailgun.js';
import fs from "fs";
const pdf = require('html-pdf');
const path = require("path");
import { find } from 'lodash';
import { okResponse, errorResponse } from '../util/HttpResponse';
import { fetchEstimateById } from '../services/EstimateService';
import { OrganizationModel } from '../models/organization.model';
import { UserModel } from '../models/user.model';
import { encode } from "../auth/codec";
import { EstimateModel } from '../models/estimate.model';
import { convertDate, getDisplayDate } from './utils';
import { fetchInvoiceById, exportInvoiceToPdf } from '../services/InvoiceService';
import { exportEstimateToPdf } from '../services/EstimateService';
import { InvoiceModel } from '../models/invoice.model';
import { SalesSettingModel } from '../models/setting/sales.setting.model';
import { contemparyTemplateHTML } from './template/contemparyTemplateHTML';
import { classicTemplateHTML } from './template/classicTemplateHTML';
import { modernTemplateHTML } from './template/modernTemplateHTML';
import { fetchRecurringById } from '../services/RecurringService';
import { RecurringModel } from '../models/recurring.model';
import moment from 'moment';
let date = moment().format("YYYY-MM-DD");

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
    public_key: process.env.MAILGUN_PUBLIC_KEY || 'pubkey-yourkeyhere'
});
const domain = process.env.MAILGUN_DOMAIN;
const mailgunJS = require("mailgun-js")({ apiKey: process.env.MAILGUN_API_KEY, domain });

export const sendEmail = async ({ to = [], message, self, subject = `Peymynt Estimate` }, user, businessId, estimateId, attachPDF = true) => {
    try {
        let attachment = undefined;
        let estimate = await EstimateModel.findById(estimateId)
            .populate("business")
            .populate("customer");
        let business = await OrganizationModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: businessId
        })

        let userInfo = await UserModel.findOne({
            _id: estimate.userId
        });

        if (!estimate || !userInfo || !business) {
            return errorResponse(500, undefined, 'email sending failed due to estimate data not found');
        }
        userInfo = userInfo.toUserJson()
        business = business.toUserJson()

        if (self) {
            to.push(user.email);
        }

        let templateType = await SalesSettingModel.findOne({ businessId: businessId });
        if (attachPDF) {
            attachment = await fetchEstimatePdf(estimate);
        }
        const engineOutput = await getHtmlWithEstimatValues(estimate, user, business, unescape(message), templateType)
        let mailResult = await mailWrapper(getFrom(business.organizationName), to, subject, engineOutput, attachment);

        await EstimateModel.updateOne({ _id: estimateId }, { status: "sent" });
        estimate = await EstimateModel.findById(estimateId);

        console.log("--> success <---", mailResult);
        return okResponse(200, { estimate }, 'email sent successfully..');
    }
    catch (error) {
        console.log(error);
        return errorResponse(500, error, 'email sending failed..');
    }
}

export const sendInvoiceReminderEmail = async ({ to = [], message, self, subject = "Reminder Peymynt Invoice", from = "Peymynt <web@mailer.peymynt.com>" }, user, businessId, invoiceId) => {
    try {
        let invoice = await fetchInvoiceById(invoiceId, businessId);
        const business = await OrganizationModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: businessId
        });
        let invoiceHtml;

        if (!invoice) {
            return errorResponse(500, undefined, 'email sending failed due to Invoice not found');
        }

        if (self) {
            to.push(user.email);
        }

        invoiceHtml = await getHtmlWithInvoiceReminder(invoice, user, business, unescape(message));
        const result = await mg.messages.create(domain, {
            from,
            to,
            subject,
            text: unescape(message),
            html: invoiceHtml
        });

        await InvoiceModel.updateOne({ _id: invoiceId }, { lastSent: new Date() });
        invoice = await InvoiceModel.findById(invoiceId);

        console.log("--> success <---", result);
        return okResponse(200, { invoice }, 'email sent successfully...');
    }
    catch (error) {
        console.log(error);
        return errorResponse(500, error, 'email sending failed..');
    }
}

export const sendInvoiceReceipt = async ({ to = [], message, self, subject = "Invoice Payment Receipt", from = "Peymynt <web@mailer.peymynt.com>" }, user, businessId, { invoiceId, paymentId }) => {
    try {
        let invoice = await fetchInvoiceById(invoiceId, businessId);
        let payments = invoice.data.invoice.payments;
        let attachment = undefined;
        let paymentData = payments.find(p => p._id == paymentId);
        const business = await OrganizationModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: businessId
        });
        let invoiceHtml;

        if (!invoice) {
            return errorResponse(500, undefined, 'email sending failed due to Invoice not found');
        }

        if (self) {
            to.push(user.email);
        }

        if (invoice && invoice.data.invoice.status === 'sent' || invoice.data.invoice.status === 'paid' || invoice.data.invoice.status === 'saved' || invoice.data.invoice.status === 'overdue' || invoice.data.invoice.status === 'partial') {
            invoiceHtml = await getHtmlWithInvoiceReceiptValues(invoice, paymentData, user, business, unescape(message));
        }
        else {
            return errorResponse(500, undefined, 'Email sending Failed...');
        }

        const result = await mailWrapper(getFrom(business.organizationName), to, subject, invoiceHtml, attachment);
        await InvoiceModel.updateOne({ _id: invoiceId }, { sentDate: new Date(), lastSent: new Date() });
        invoice = await InvoiceModel.findById(invoiceId);
        return okResponse(200, 'email sent successfully...');
    }
    catch (error) {
        console.log(error);
        return errorResponse(500, error, 'email sending failed..');
    }
}

export const sendEstimateEmail = async ({from, to = [], message, self, subject = "Peymynt Estimate", attachPDF = false }, user, businessId, estimateId) => {
    try {
        let attachment = undefined;
        let estimate = await EstimateModel.findById(estimateId)
            .populate("business")
            .populate("legal");
        let business = await OrganizationModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: businessId
        })

        let userInfo = await UserModel.findOne({
            _id: estimate.userId
        });

        if (!estimate || !userInfo || !business) {
            return errorResponse(500, undefined, 'Seems this estimate not found');
        }

        userInfo = userInfo.toUserJson();
        business = business.toUserJson();
        let templateType = await SalesSettingModel.findOne({ businessId: businessId });

        if (self) {
            to.push(user.email);
        }

        let estimateHtml = await getHtmlWithEstimatValues(estimate, userInfo, business, unescape(message), templateType);
        let result = await mailWrapper(from, to, subject, estimateHtml, attachment);
        await EstimateModel.updateOne({ _id: estimateId }, { sentDate: new Date(), lastSent: new Date() });
        estimate = await EstimateModel.findById(estimateId);
        console.log("--> success <---", result);
        return okResponse(200, 'email sent successfully...');    
    }
    catch (error) {
        console.log(error);
        return errorResponse(500, error, 'email sending failed..');
    }
}

export const sendInvoiceEmail = async ({ to = [], message, self, subject = "Peymynt Invoice", attachPDF = false }, user, businessId, invoiceId) => {
    try {
        console.log("Invoice Id in send invoice email ------", invoiceId);
        let attachment = undefined;
        let invoice = await InvoiceModel.findById(invoiceId)
            .populate("business")
            .populate("legal");
        let business = await OrganizationModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: businessId
        })

        let userInfo = await UserModel.findOne({
            _id: invoice.userId
        });

        if (!invoice || !userInfo || !business) {
            return errorResponse(500, undefined, 'email sending failed due to Invoice not found');
        }
        invoice = invoice.toUserJson()
        userInfo = userInfo.toUserJson()
        business = business.toUserJson()

        if (self) {
            to.push(user.email);
        }
        
        let templateType = await SalesSettingModel.findOne({ businessId: businessId });

        if (attachPDF) {
            attachment = await fetchInvoicePdf(invoice);
        }

        let htmlEngine = require('./../tasks/mailer/invoice.send/sendInvoice.html');
        const engineOutput = htmlEngine.render(business, invoice, templateType, userInfo, unescape(message));
        let fromMail = getFrom(business.organizationName);
        console.log("fromMail", fromMail);
        let mailResult = await mailWrapper(getFrom(business.organizationName), to, subject, engineOutput, attachment);
        let invoiceData = invoice ? invoice : {};
        let invoiceUpdate = { lastSent: new Date(), sentVia: "peymynt_email" };
        if (invoiceData.status !== "paid" && invoiceData.status !== "partial" && invoiceData.status !== "overdue") {
            invoiceUpdate.status = "sent";
            invoiceUpdate.sentDate = new Date();
        }
        await InvoiceModel.updateOne({ _id: invoiceId }, invoiceUpdate);
        invoice = await InvoiceModel.findById(invoiceId);

        console.log("--> success <---", mailResult);
        return okResponse(200, { invoice }, 'email sent successfully...');
    }
    catch (error) {
        console.log(error);
        return errorResponse(500, error, 'email sending failed..');
    }
}

export const sendAccountStatementEmail = async ({ to = [], message, self, subject = "" }, businessId, statementUUId, data) => {
    try {
        let dataObj = data.data.statement;
        let attachment = undefined;  
        let templateType = await SalesSettingModel.findOne({ businessId: businessId });
        let htmlEngine = require('./../tasks/mailer/accountStatement.send/sendAccountStatement.html');
        const engineOutput = htmlEngine.render(dataObj, templateType, statementUUId,unescape(message));
        let fromMail = getFrom(dataObj.business.organizationName);
        subject = "Statement of Account from " + dataObj.business.organizationName;
        let mailResult = await mailWrapper(getFrom(dataObj.business.organizationName), to, subject, engineOutput, attachment);
        return okResponse(200, { data }, 'email sent successfully...');
    }
    catch (error) {
        console.log(error);
        return errorResponse(500, error, 'email sending failed..');
    }
}


function getFrom(name) {
    return `${name} <mailer@peymynt.com>`;
}

const mailWrapper = async (from, to, subject, html, attachment) => {
    to = to.filter(t => t != "");
    const data = {
        from,
        to,
        subject,
        html
    };
    if (attachment)
        data.attachment = attachment;

    const result = await mailgunJS.messages().send(data);
    console.log("Result of mail=>", result);
    return result;
}

export const sendRecurringEmail = async ({ to = [], message, self, subject = "Peymynt Invoice", from = "Peymynt <web@mailer.peymynt.com>", attachPDF = false }, user, businessId, invoiceId) => {
    try {
        let attachment = undefined;
        let invoice = await fetchRecurringById(invoiceId, user, businessId);
        const business = await OrganizationModel.findOne({
            isActive: true,
            isDeleted: false,
            _id: businessId
        });

        if (!invoice) {
            return errorResponse(500, undefined, 'email sending failed due to Recurring Invoice not found');
        }

        if (self) {
            to.push(user.email);
        }

        if (attachPDF) {
            let templateType = await SalesSettingModel.findOne({ businessId: businessId });
            attachment = await fetchAttachmentData(invoice, user, business, message, templateType);
        }

        const data = {
            from,
            to,
            subject,
            text: unescape(message),
            html: await getHtmlWithInvoiceValues(invoice, user, business, unescape(message)),
            attachment
        };

        const result = await mailgunJS.messages().send(data);
        // let invoiceData = invoice.data ? invoice.data.invoice : {};
        // let invoiceUpdate = { lastSent: new Date(), sentVia: "peymynt_email" };
        // if (invoiceData.status !== "paid" && invoiceData.status !== "partial" && invoiceData.status !== "overdue") {
        //     invoiceUpdate.status = "sent";
        //     invoiceUpdate.sentDate = new Date();
        // }
        // await InvoiceModel.updateOne({ _id: invoiceId }, invoiceUpdate);
        // invoice = await RecurringModel.findById(invoiceId);

        console.log("--> Recurring sent email success <---", result);
        return okResponse(200, { invoice }, 'email sent successfully...');
    }
    catch (error) {
        console.log(error);
        return errorResponse(500, error, 'Recurring email sending failed..');
    }
}

export const sendResetEmail = async (email, publicToken) => {
    try {
        console.log("==================> ", email);
        let mailEngine = require('./../tasks/mailer/auth.reset/index.html.js');
        const engineOutput = mailEngine.render(publicToken);
        let mailResult = await mailWrapper("The Peymynt Team <welcome@peymynt.com>", [email], "[Peymynt] Password reset", engineOutput);
        return okResponse(200, mailResult, "Mail sent");
    }
    catch (error) {
        console.log(error);
        return errorResponse(500, error, 'Mail sending failed');
    }
}


const getHtmlWithEstimatValues = async (estimate, user, business, message, setting) => {
    let { currency, uuid, name, estimateNumber, amountBreakup, estimateDate, expiryDate, publicView, customer } = estimate;
    const { customerName, firstName, lastName } = customer;
    const { email } = user;
    let estimateName = name + " #" + estimateNumber;
    let fullName = `${firstName} ${lastName}`;
    let from = business.organizationName || "Peymynt";
    let grandTotal = `${currency.symbol} ${amountBreakup ? amountBreakup.total : "0 "} ${currency.code}`;
    estimateDate = convertDate(estimateDate);
    expiryDate = convertDate(expiryDate);
    console.log(`${process.env.BASE_URL}/estimatesharelink/${uuid}`);
    let publicViewUrl = publicView.shareableLinkUrl || `${process.env.BASE_URL}/public/estimate/${uuid}`;
    const html = `<!DOCTYPE html> 
    <html>
    <head>
    <title>Peymynt</title>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
    </head>
        <body style="background-color:#f1f1f1;color: #8C959A;font-size:14px;font-family: 'Poppins';">
            <div style="text-align:center">
            <div style="width:80%;margin:0 auto;background-color:#eee;border:1px solid #ddd;text-align:center;padding-bottom: 30px;border-bottom-left-radius:10px;border-bottom-right-radius:10px;">
                <div style="background:#fff;">
                <div style="border-bottom:1px solid #ddd;padding-bottom:30px;margin-bottom:30px;">
                    <div style="padding:40px 0px 40px">
                        <span style="color: #9F55FF"></span><span style="color:#333"> </span>
                    </div>
                    <img src=${setting.companyLogo} height="180px" width="250px"/>
                    <h1 style="color:#333;font-size: 2.2em;margin:0px;"><strong> ${estimateName} </strong></h1>
                    <div>
                        <p style="line-height:22px;margin-top:0px"> for ${customerName} <br/>
                         issued on ${estimateDate} <br/> from <strong> ${from} </strong></p>
                        <p> ${message}</p>
                    </div>
                </div>
                <div style="border-bottom:1px solid #ddd;">
                    <div style="margin:0px 30px 30px 30px;border-top:1px solid #ddd;border-bottom:1px solid #ddd;padding:10px 0px;">
                        <span style="font-size:16px;font-weight:600;">Grand Total: <strong style="color:#333"> ${grandTotal} </strong></span>
                    </div>
                    <div style="margin-bottom:30px;">
                        <a href=${publicViewUrl} style="background-color:#9F55FF;border:1px solid #9F55FF;color:#fff;padding: 10px 40px;border-radius: 50px;cursor:pointer;text-decoration:none;font-weight:bold;display: inline-block;" target="_blank">View in Browser</a>
                        <div style="margin-top:8px;">
                            <span>Expires on: <strong style="color:#333"> ${expiryDate} </strong></span>
                        </div>
                    </div>
                </div>
                <div style="background-color:#f1f1f1;padding:20px 0px;border-bottom:1px solid #ddd;">
                    <div style="line-height:20px">
                        Thanks for your business. If this estimate was sent in error,<br/>
                        please contact  <a href="#" style="color: #9F55FF;font-weight:600;">${email}</a>
                    </div>
                </div>
                </div>
            </div>
            <div style="margin:20px 0px;display: inline-flex;font-weight:600">Powered by Peymynt <a href="#" style="margin-left:5px;"><img src="http://peymynt.com/assets/images/logo.png" style="width:30px;"/></a></div>
        </div>
        </body>
    </html>`

    return html;
}

const getHtmlWithInvoiceReminder = async (invoice, user, business, message = "") => {
    let { currency, uuid, name, invoiceNumber, dueAmount, amountBreakup, invoiceDate, dueDate, publicView, customer } = invoice.data ? invoice.data.invoice : {};
    let { addressLine1 = "", addressLine2 = "", country = "", state = "", city = "", postal = "" } = (business && business.address) || {};
    let { phone = "", fax = "", mobile = "", tollFree = "", website = "" } = (business && business.communication) || {};
    const { customerName, firstName, lastName } = customer;
    const { email } = user;
    let invoiceName = name + " #" + invoiceNumber;
    let fullName = `${firstName} ${lastName}`;
    let from = business.organizationName || "Peymynt";
    let amountDue = `${currency.symbol} ${dueAmount}`;
    let grandTotal = `${currency.symbol} ${amountBreakup ? amountBreakup.total : "0 "} ${currency.code}`;
    invoiceDate = convertDate(invoiceDate);
    dueDate = convertDate(dueDate);
    console.log(`${process.env.BASE_URL}/public/invoice/${uuid}`);
    let publicViewUrl = publicView.shareableLinkUrl || `${process.env.BASE_URL}/public/invoice/${uuid}`;
    const html = `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Reminder Email</title>
        <style type="text/css">
            body{
                backgroud-color:#f8f8f8;
            }
        </style>
    </head>
    <body>
        <table width="460" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="center" style="border:1px solid #e1e1e1;margin-top:50px;font-family: Helvetica,Arial,sans-serif;border-radius:10px;">
            <tr>
                <td style="color: #2f2f36;font-size: 32px;line-height: 32px;text-align: center;padding:60px 0 0">
                    Reminder for
                </td>
            </tr>
            <tr>
                <td style="color:#2f2f36;font-weight:bold;font-size:32px;line-height:32px;text-align: center;padding-bottom:60px;">
                    ${invoiceName}<br/>
                    <span style="font-size: 16px;color:#a0a0a5;font-weight: normal;text-align:center;
                    font-family: Helvetica,Arial,sans-serif;vertical-align:top;text-align: center;">
                    Due on ${dueDate}</span>
                </td>
            </tr>
            <tr>
                <td style="text-align:center;position:relative; border-top:1px solid #e1e1e1;"> 
                    <span style="position:absolute;position: absolute;top: -8px;width: 50px;text-align:center;background:#fff;    right:0;left:0;margin:0 auto;"> 
                    <img src="image/check_icon.jpg"></span> 
                </td>
            </tr>
            <tr>
                <td style="font-size: 14px;color: #a0a0a5;font-weight: normal;text-align: center;font-family: Helvetica,Arial,sans-serif;line-height: 24px;vertical-align: top;padding:40px 15px;">
                        <p>${customer.customerName},</p>
                        <p> Just a friendly reminder that payment on an invoice issued on ${invoiceDate} is overdue. This invoice was due on Feb 25, 2019. Please submit payment for this invoice as soon as possible.</p>
                        <p>Thanks, <br/>${from}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p style="font-size: 16px;border-top: 1px solid #e1e1e1;padding-top: 20px;padding-bottom: 5px;
                    text-align: center; margin: 0;">Amount Due: <strong>${amountDue}</strong></p>
                        <p style="font-size: 16px;border-bottom: 1px solid #e1e1e1;padding-top:5px;padding-bottom:20px;
                    text-align: center; margin: 0;">Due: <strong>${dueDate}</strong></p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center;padding-bottom: 55px;"> 
                    <p style="padding: 25px 0 0 0;">  
                    <img src="image/overdue.png"> 
                    </p>
                    <a href=${publicViewUrl} style="background-color:#9F55FF;border:1px solid #9F55FF;color:#fff;padding: 10px 40px;border-radius: 50px;cursor:pointer;text-decoration:none;font-weight:bold;display: inline-block;" target="_blank">View Online</a>
                </td>
            </tr>

            <tr> 
                <td style="font-size: 14px;color: #959599;font-weight: normal;font-family: Helvetica,Arial,sans-serif;
                line-height: 20px;text-align: center;padding: 30px 15px;border-top:1px solid #e1e1e1;"> Thanks for your business. If this invoice was sent in error, please contact <a href="#" style="text-decoration: none;color: #1673de;font-weight: bold;"> ${user.email}</a></td>
            </tr>
        </table>
        <table width="460" border="0" cellpadding="0" cellspacing="0" align="center" style="font-family: Helvetica,Arial,sans-serif;">
            <tbody><tr>
            <td height="20"></td>
            </tr>
            <tr>
            <td style="text-align:center">
            <div style="margin:20px 0px;display: inline-flex;font-weight:600">Powered by Peymynt <a href="#" style="margin-left:5px;"><img src="http://peymynt.com/assets/images/logo.png" style="width:30px;"/></a></div>
            </td>
            </tr>
            <tr>
            <td height="40" style="line-height:1px"></td>
            </tr>
        </tbody>
        </table>
    </body>
    </html>
    `
    return html;
}

const getHtmlWithInvoiceReceiptValues = async (invoice, paymentData, user, business, message = "") => {
    let { currency, uuid, name, invoiceNumber, amountBreakup, invoiceDate, dueDate, publicView, customer } = invoice.data ? invoice.data.invoice : {};
    let { addressLine1 = "", addressLine2 = "", country = "", state = "", city = "", postal = "" } = (business && business.address) || {};
    let { phone = "", fax = "", mobile = "", tollFree = "", website = "" } = (business && business.communication) || {};
    const { customerName, firstName, lastName } = customer;
    const { email } = user;
    let invoiceName = name + " #" + invoiceNumber;
    let payment = paymentData.amount;
    let fullName = `${firstName} ${lastName}`;
    let from = business.organizationName || "Peymynt";
    let grandTotal = `${currency.symbol} ${amountBreakup ? amountBreakup.total : "0 "} ${currency.code}`;
    invoiceDate = convertDate(invoiceDate);
    dueDate = convertDate(dueDate);
    console.log(`${process.env.BASE_URL}/public/invoice/${uuid}`);
    let publicViewUrl = publicView.shareableLinkUrl || `${process.env.BASE_URL}/public/invoice/${uuid}`;
    const html = `<!DOCTYPE html> 
    <html>
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Receipt Email</title>
         <style type="text/css">
              body{
                 backgroud-color:#f8f8f8;
              }
         </style>
      </head>
       <body>
           <table width="460" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="center" style="border:1px solid #e1e1e1;margin-top:50px;font-family: Helvetica,Arial,sans-serif;border-radius:10px;">
               <tr>
                   <td style="color: #2f2f36;font-size:36px;font-weight:bold;line-height: 32px;text-align: center;padding:30px 0 0">
                      Payment receipt
                   </td>
               </tr>
               <tr>
                   <td style="color:#2f2f36;font-weight:bold;font-size:16px;line-height:32px;text-align: center;padding-bottom:30px;">
                       ${invoiceName}<br/>
                      <span style="font-size: 16px;color:#a0a0a5;font-weight: normal;text-align:center;
                      font-family: Helvetica,Arial,sans-serif;vertical-align:top;text-align: center;">
                      for ${fullName}  <br/>Paid ${invoiceDate}</span>
                   </td>
               </tr>
               <tr>
                  <td style="text-align:center;padding-bottom: 35px;">
                      <span style="font-weight:bold;font-size:12px;line-height:12px;color:#a0a0a5;">
                          ${from}<br>                    
                          ${addressLine1}<br>
                          ${city ? city : ""}
                          ${state ? state : ""} ${postal ? postal : ""}<br>
                          ${country ? country : ""}<br><br>
                          ${phone}<br>
                          ${fax}<br>
                          ${mobile}<br>
                          ${tollFree}<br>
                          <span >
                            <a href="#" target="_blank">${user.email}</a>
                            <br>
                          </span>
                      </span>                 
                  </td>
               </tr>
               <tr>
                  <td style="text-align:center;position:relative; border-top:1px solid #e1e1e1;"> 
                    <span style="position:absolute;position: absolute;top: -8px;width: 50px;text-align:center;background:#fff;    right:0;left:0;margin:0 auto;"> 
                      <img src="image/check_icon.jpg"></span> 
                  </td>
               </tr>
               <tr>
                   <td style="font-size:14px;color:#444;font-weight:normal;text-align:left;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top;padding:50px 30px">
                    Hi ${fullName},<br><br>
                    Here's your payment receipt for Invoice
                    #${invoiceNumber}, for ${currency.symbol}${payment} ${currency.code}.<br><br>
                    You can always view your receipt online,
                    at:<br>
                    <a href={${publicView ? publicView.shareableLinkUrl : ""}}>${publicView ? publicView.shareableLinkUrl : ""}</a>
                    <br><br>
                    If you have any questions, please let us know.
                    <br><br>
                    Thanks,
                    <br>${from}
              </td>
               </tr>
               <tr>
                   <td>                 
                        <p style="font-size: 16px;border-bottom: 1px solid #e1e1e1;border-top: 1px solid #e1e1e1; padding-top:15px;padding-bottom:15px;text-align: center; margin: 0;">Payment Amount:<strong style="font-size:18px;">${currency.symbol}${payment} ${currency.code}</strong></p>
                   </td>
               </tr>
               <tr>
                  <td style="text-align: center;padding-bottom:25px;"> 
                     <p style="font-size:12px;text-align:center;padding:25px 0 30px; margin: 0;">  
                      <strong> PAYMENT METHOD</strong>: ${(paymentData.methodToDisplay =='bank') ? "BANK PAYMENT" : paymentData.methodToDisplay.toUpperCase()}
                    </p>
                     <a href=${publicViewUrl} style="background-color:#9F55FF;border:1px solid #9F55FF;color:#fff;padding: 10px 40px;border-radius: 50px;cursor:pointer;text-decoration:none;font-weight:bold;display: inline-block;" target="_blank">View Online</a>
    
                     <p style="font-size:14px;color:#444;font-weight:normal;text-align:center;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top;margin-top:5px;">Or<a href=${publicViewUrl} style="text-decoration:none;
                      color: #1673de;font-weight: bold;">View receipt on web</a> </p>
                  </td>
               </tr>
    
               <tr> 
                 <td style="font-size: 14px;color: #959599;font-weight: normal;font-family: Helvetica,Arial,sans-serif;
                 line-height: 20px;text-align: center;padding: 30px 15px;border-top:1px solid #e1e1e1;"> Thanks for your business. If this invoice was sent in error, please contact <a href="#" style="text-decoration: none;color: #1673de;font-weight: bold;"> ${user.email}</a></td>
               </tr>
           </table>
           <table width="460" border="0" cellpadding="0" cellspacing="0" align="center" style="font-family: Helvetica,Arial,sans-serif;">
            <tbody><tr>
              <td height="20"></td>
            </tr>
            <tr>
              <td style="text-align:center">
              <div style="margin:20px 0px;display: inline-flex;font-weight:600">Powered by Peymynt <a href="#" style="margin-left:5px;"><img src="http://peymynt.com/assets/images/logo.png" style="width:30px;"/></a></div>
              </td>
            </tr>
            <tr>
              <td height="40" style="line-height:1px"></td>
            </tr>
          </tbody>
        </table>
       </body>
    </html>
    `

    return html;
}

const getHtmlWithInvoiceValues = async (invoice, user, business, message = "") => {
    let { currency, uuid, name, invoiceNumber, amountBreakup, invoiceDate, dueDate, publicView, customer } = invoice.data ? invoice.data.invoice : {};
    console.log("customer", customer);
    let { addressLine1 = "", addressLine2 = "", country = "", state = "", city = "", postal = "" } = (business && business.address) || {};
    let { phone = "", fax = "", mobile = "", tollFree = "", website = "" } = (business && business.communication) || {};
    const { customerName, firstName, lastName } = customer;
    const { email } = user;
    let invoiceName = name + " #" + invoiceNumber;
    let fullName = `${firstName} ${lastName}`;
    let from = business.organizationName || "Peymynt";
    let grandTotal = `${currency.symbol} ${amountBreakup ? amountBreakup.total : "0 "} ${currency.code}`;
    invoiceDate = convertDate(invoiceDate);
    dueDate = convertDate(dueDate);
    console.log(`${process.env.BASE_URL}/public/invoice/${uuid}`);
    let publicViewUrl = publicView.shareableLinkUrl || `${process.env.BASE_URL}/public/invoice/${uuid}`;
    const html = `<!DOCTYPE html> 
    <html>
    <head>
    <title>Peymynt</title>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
    </head>
        <body style="background-color:#f1f1f1;color: #8C959A;font-size:14px;font-family: 'Poppins';">
            <table align="center" border="0" style="width:600px;background:#fff;padding:10px">
                <tr>
                    <td>
                        <table style="width:100%; background:#EDF2F7">
                           <tr>
                               <td style="color: #242729;font-family: Arial;font-size: 18px;line-height: 1.5;text-align: center;padding:15px;">
                                   <span style="font-weight: bold;font-size:18px;">${from}</span> has sent you an invoice for
                               </td>
                           </tr>
                           <tr>
                               <td style="color: #242729;font-family: Arial;font-size: 24px;font-weight: bold;line-height: 1.21;text-align: center;padding:10px;">${grandTotal}</td>                            
                           </tr>
                           <tr>
                               <td style="color: #597588;font-family: Arial;font-size: 16px;font-weight: bold;line-height: 22px;text-align: center;padding-bottom:15px;"> Due on ${dueDate} </td>
                           </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:30px;text-align:center;border-bottom: 1px solid #e4e7eb;"> <a  href=${publicViewUrl} style="width: 173px;height: 22px;text-align: center;background: #9f55ff;color: #fff;padding: 15px;display: inline-block;border-radius: 52px;text-decoration: none;font-size: 18px;line-height: 21px;">
                        View Online</a> </td>
                </tr>
                <tr>
                    <td style="padding:15px ;;border-bottom:1px solid #e4e7eb;"> ${message}</td>
                </tr>
                <tr>
                    <td> 
                        <table style="width:100%; text-align:center;"> 
                            <tr>
                                <td style="color:#03393c;font-family:Arial;font-size:16px;line-height:22px;text-align: center;padding-top:20px;">
                                    <span style="display:block;"> questions about this invoice, please contact </span>
                                    <span style="display:block;"> <a href="#"> ${email}</a>  </span>
                                </td>
                            </tr>
                            <tr>
                                <td style="color:#03393c;font-family:Arial;font-size:16px;line-height:22px;text-align: center;padding:30px 0">
                                    <span style="display:block;font-weight:600;"> ${from} </span>
                                    ${addressLine1 ? `<span style="display:block;"> ${addressLine1} ${addressLine2} </span>` : ""}
                                    <span style="display:block;">${city ? `${city},` : ""} ${state ? state.name : ""} ${postal ? postal : ""}</span>
                                    ${country ? `<span style="display:block;">${country && country.name}</span>` : ""}
                                </td>
                            </tr>
                            <tr>
                                <td style="color:#03393c;font-family:Arial;font-size:16px;line-height:22px;text-align:center;padding-bottom:20px;">
                                    ${ phone ? `<span style="display:block;"> Phone: ${phone}</span>` : ''}
                                    ${ fax ? `<span style="display:block;">Fax: ${fax}</span>` : ""}
                                    ${ mobile ? `<span style="display:block;">Mobile: ${mobile}</span>` : ""}
                                    ${ tollFree ? `<span style="display:block;">Toll free: ${tollFree}</span>` : ""}
                                    ${ website ? `<span style="display:block;"><a href="#">${website} </a> </span>` : ""}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <table align="center" border="0" style="width:600px;padding:10px;margin-top:15px;">
               <tr>
               <td style="text-align:center">
               <div style="margin:20px 0px;display: inline-flex;font-weight:600">Powered by Peymynt <a href="#" style="margin-left:5px;"><img src="http://peymynt.com/assets/images/logo.png" style="width:30px;"/></a></div>
               </td>
               </tr>
               <tr>
                   <td colspan="2" style="font-size: 11px;text-align: center;">
                        © 2019 Peymynt Financial Inc. All Rights Reserved.<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span> <a href="#" style="color: #8C959A;">Privacy Policy</a><span>&nbsp;&nbsp;•&nbsp;&nbsp;</span><a href="#" style="color: #8C959A;">Terms of Use </a>

                   </td>
               </tr>
            </table>
        </body>
    </html>`

    return html;
}

const fetchInvoicePdf = async (invoice) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pdfBuffer = await exportInvoiceToPdf(invoice.uuid);
            let attachment = new mailgunJS.Attachment({ data: pdfBuffer, filename: `Invoice_${invoice.invoiceNumber}_${getDisplayDate(invoice.dueDate)}.pdf`, contentType: 'application/pdf' });
            resolve(attachment);
        } catch (e) {
            console.log("Failed to build pdf file, ", e);
            reject(e);
        }
    })
}

const fetchEstimatePdf = async (estimate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pdfBuffer = await exportEstimateToPdf(estimate.uuid);
            let attachment = new mailgunJS.Attachment({ data: pdfBuffer, filename: `Estimate_${estimate.estimateNumber}_${getDisplayDate(estimate.expiryDate)}.pdf`, contentType: 'application/pdf' });
            resolve(attachment);
        } catch (e) {
            console.log("Failed to build pdf file, ", e);
            reject(e);
        }
    })
}

const fetchAttachmentData = async (invoice, user, business, message, templateType) => {
    try {
        let pdfHTML;
        const filepath = path.join(__dirname, 'businesscard.pdf');
        if (templateType.template === 'contemporary') {
            console.log('============= Contempary html -------------')
            pdfHTML = await contemparyTemplateHTML(invoice, user, business, templateType, unescape(message));
        }
        if (templateType.template === 'classic') {
            console.log('============= Classic html -------------')
            pdfHTML = await classicTemplateHTML(invoice, user, business, templateType, unescape(message));
        }
        if (templateType.template === 'modern') {
            console.log('============= Modern html -------------')
            pdfHTML = await modernTemplateHTML(invoice, user, business, templateType, unescape(message));
        }
        const options = {
            // "height": "305mm",        // allowed units: mm, cm, in, px
            // "width": "297mm",
            format: 'Letter'
        };
        console.log('Pdf ===============================', pdfHTML)
        return new Promise(function (resolve, reject) {
            pdf.create(pdfHTML, options).toFile(filepath, function (err, res) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                const file = fs.readFileSync(filepath);

                let attachment = new mailgunJS.Attachment({ data: file, filename: `Invoice_${date}.pdf`, contentType: 'application/pdf' });
                return resolve(attachment);
            })
        })
    } catch (error) {
        console.log(error);
    }
}


