var { toMoney, getDisplayDate, getPrivacyUrl, getTermsUrl, getInvoicePublicUrl } = require('./../../util');
var fs = require('fs');
const path = require('path');

function getMailerStart() {
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta content="telephone=no" name="format-detection" />
<title></title>
<style type="text/css">
body { -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; -webkit-font-smoothing: antialiased !important; }
img { border: 0 !important; outline: none !important; }
p { Margin: 0px !important; Padding: 0px !important; }
table { border-collapse: collapse; mso-table-lspace: 0px; mso-table-rspace: 0px; }
td, a, span { border-collapse: collapse; mso-line-height-rule: exactly; }
.ExternalClass * { line-height: 100%; }
span.MsoHyperlink { mso-style-priority: 99; color: inherit; }
span.MsoHyperlinkFollowed { mso-style-priority: 99; color: inherit; }
@media only screen and (min-width:481px) and (max-width:599px) {
.wrapper { width: 100% !important; }
.hide { display: none !important; }
.full_img { width: 100% !important; height: auto !important; }
span[class=em_divhide] { display: none !important; }
}
@media only screen and (max-width:480px) {
.wrapper { width: 100% !important; }
.hide { display: none !important; }
.full_img { width: 100% !important; height: auto !important; }
span[class=em_divhide] { display: none !important; }

}
</style>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
 </o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>
`;
}

function getHeaderSection() {
    return `
<body style="margin:0px; padding:0px;" bgcolor="#f4f5f5">
<!--Full width table start-->
<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#f4f5f5">
<tr>
	<td align="center" valign="top">
        <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="width:600px;" bgcolor="#ffffff" class="wrapper">
        `;
}
function getLogoSection(setting, invoice) {
    return `
    <tr>
            	<td align="center" valign="top" style="padding-top:30px; padding-bottom:25px;"><a target="_blank" href=${getInvoicePublicUrl(invoice.uuid)}><img src=${setting.companyLogo} width="auto" style="display:block; width:auto;max-width:180px;" border="0"></a></td>
            </tr>
    `
}
function getMessageSection(business, invoice) {
    return `
    <tr>
            	<td align="center" valign="top">
                	<table width="580" border="0" cellspacing="0" cellpadding="0" align="center" style="width:580px;" bgcolor="#edf2f7" class="wrapper">
                    	<tr>
                        	<td align="center" valign="top" style="color: #242729; font-family:Arial, sans-serif; font-size: 18px; line-height:25px; text-align: center; padding-top:30px; padding-bottom:30px; padding-left:14px; padding-right:14px;"><span  style="font-size:18px; font-weight:bold;">${business.organizationName}</span> has sent you a payment request${invoice.isRecurring ? ' for a recurring invoice' : ''}. </td>
                        </tr>
                        <tr>
                        	<td align="center" valign="top" style="color: #242729; font-family:Arial, sans-serif; font-size: 24px; font-weight: bold; line-height:30px; text-align: center; padding-bottom:8px; padding-left:14px; padding-right:14px;">${invoice.currency.symbol}${toMoney(invoice.totalAmount - invoice.paidAmount)}</td>
                        </tr>
                        <tr>
                        	<td align="center" valign="top" style="color: #597588; font-family:Arial, sans-serif; font-size: 16px; font-weight: bold; line-height:22px; text-align: center; padding-bottom:30px; padding-left:14px; padding-right:14px;">Due on ${getDisplayDate(invoice.dueDate, "MMM DD, YYYY")}</td>
                        </tr>
                    </table>
                </td>
            </tr>
    `
}
function getPaymentSection(invoice) {
    return `
    <tr>
            	<td align="center" valign="top">
                	<table width="494" border="0" cellspacing="0" cellpadding="0" align="center" style="width:494px;" class="wrapper">
                    ${!invoice.isRecurring && (invoice.onlinePayments.systemEnabled && invoice.onlinePayments.businessEnabled) ? `    
                    <tr>
                        	<td align="center" valign="top" style="color: #082c2e; font-family:Arial, sans-serif; font-size: 18px; font-weight: bold; line-height:22px; text-align: center; padding-top:30px; padding-bottom:20px; padding-left:14px; padding-right:14px;">Two ways to pay online:</td>
                        </tr>
                        <!--Payment card/options table section start here-->
                        <tr>
                        	<td align="center" valign="top">
                                <table width="494" border="0" cellspacing="0" cellpadding="0" align="center" style="width:494px;" class="wrapper">
                                	<tr>
                                        <td valign="top">
                                            <table width="194" border="0" cellspacing="0" cellpadding="0" align="left" style="width:194px;" class="wrapper">
                                                <!--Payment card section start here-->
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <table width="194" border="0" cellspacing="0" cellpadding="0" align="center" style="width:194px;">
                                                            <!--Payment card section start here-->
                                                            <tr>
                                                                <td align="center" valign="top">
                                                                <!--Cards Image box start here-->
                                                                    <table width="168" border="0" cellspacing="0" cellpadding="0" align="center" style="width:168px;">
                                                                        <tr>
                                                                            <td align="left" valign="top" style="padding-right:6px;"><a href="#"><img src="https://cdn.peymynt.com/static/cards/card_visa.png" width="38" alt="visa" style="display:block;" border="0"></a></td>
                                                                            <td align="left" valign="top" style="padding-right:5px;"><a href="#"><img src="https://cdn.peymynt.com/static/cards/card_master.png" width="38" alt="master" style="display:block;" border="0"></a></td>
                                                                            <td align="left" valign="top" style="padding-right:5px;"><a href="#"><img src="https://cdn.peymynt.com/static/cards/card_mx.png" width="38" alt="mx" style="display:block;" border="0"></a></td>
                                                                            <td align="left" valign="top"><a href="#"><img src="https://cdn.peymynt.com/static/cards/card_discover.png" width="38" alt="discover" style="display:block;" border="0"></a></td>
                                                                        </tr>
                                                                    </table>
                                                                <!--Cards Image box end here-->
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                            	<td align="center" valign="top" style="color: #5f7c91; font-family:Arial, sans-serif; font-size: 12px; line-height:15px; text-align: center; padding-top:3px; padding-bottom:8px;">Credit, Debit and Prepaid Cards</td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" valign="top" style="padding-bottom:20px;">
                                                                    <table width="194" border="0" cellspacing="0" cellpadding="0" align="center" style="width:194px;">
                                                                        <tr>
                                                                            <td align="left" valign="top" width="19" style="width:19px;"><img src="https://cdn.peymynt.com/static/mailer/left_curve.jpg" width="19" border="0" style="display:block;"></td>
                                                                            <td width="156" height="42"
                                                                                        align="center" valign="middle"
                                                                                        background="#9f55ff"
                                                                                        style="background-color:#9f55ff; color:#ffffff; font-family:Arial, sans-serif; font-size:13px; font-weight:bold; letter-spacing:1px;">
                                                                                        <a  target="_blank" href=${getInvoicePublicUrl(invoice.uuid)}
                                                                                            style="display:block; text-decoration:none; color:#ffffff; line-height:42px; height:42px;">Pay
                                                                                            with card</a></td>
                                                                            <td align="left" valign="top" width="19" style="width:19px;"><img src="https://cdn.peymynt.com/static/mailer/right_curve.jpg" width="19" border="0" style="display:block;"></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <!--Payment card section end here-->
                                                        </table>                                                        
                                                    </td>
                                                </tr>
                                                <!--Payment card section end here-->
                                            </table>
                                            <table width="194" border="0" cellspacing="0" cellpadding="0" align="right" style="width:194px;" class="wrapper">
                                                <!--Payment card section start here-->
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <table width="194" border="0" cellspacing="0" cellpadding="0" align="center" style="width:194px;">
                                                            <!--Payment card section start here-->
                                                            <tr>
                                                                <td align="center" valign="top">
                                                                <!--Cards Image box start here-->
                                                                    <table width="130" border="0" cellspacing="0" cellpadding="0" align="center" style="width:130px;">
                                                                        <tr>
                                                                            <td align="left" valign="top" width="52" style="padding-right:6px;"><a href="#"><img src="https://cdn.peymynt.com/static/banks/bank_us.jpg" width="45" alt="visa" style="display:block;" border="0"></a></td>
                                                                            <td align="left" valign="top" width="26" style="padding-right:13px;"><a href="#"><img src="https://cdn.peymynt.com/static/banks/bank_chase.jpg" width="26" alt="Chase Bank" style="display:block;" border="0"></a></td>
                                                                            <td align="left" valign="top" width="33"><a href="#"><img src="https://cdn.peymynt.com/static/banks/bank_wells.jpg" width="33" alt="Well bank" style="display:block;" border="0"></a></td>                                                                            
                                                                        </tr>
                                                                    </table>
                                                                <!--Cards Image box end here-->
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                            	<td align="center" valign="top" style="color: #5f7c91; font-family:Arial, sans-serif; font-size: 12px; line-height:15px; text-align: center; padding-top:3px; padding-bottom:8px;">and 2,400+ others</td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" valign="top" style="padding-bottom:20px;">
                                                                    <table width="194" border="0" cellspacing="0" cellpadding="0" align="center" style="width:194px;">
                                                                        <tr>
                                                                            <td align="left" valign="top" width="19" style="width:19px;"><img src="https://cdn.peymynt.com/static/mailer/left_curve.jpg" width="19" border="0" style="display:block;"></td>
                                                                            <td width="156" height="42"
                                                                                        align="center" valign="middle"
                                                                                        background="#9f55ff"
                                                                                        style="background-color:#9f55ff; color:#ffffff; font-family:Arial, sans-serif; font-size:13px; font-weight:bold; letter-spacing: 0.5px;">
                                                                                        <a  target="_blank" href=${getInvoicePublicUrl(invoice.uuid)}
                                                                                            style="display:block; text-decoration:none; color:#ffffff; line-height:42px; height:42px;">Pay
                                                                                            through your bank</a></td>
                                                                            <td align="left" valign="top" width="19" style="width:19px;"><img src="https://cdn.peymynt.com/static/mailer/right_curve.jpg" width="19" border="0" style="display:block;"></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <!--Payment card section end here-->
                                                        </table>                                                        
                                                    </td>
                                                </tr>
                                                <!--Payment card section end here-->
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        `: ''}
                        ${invoice.isRecurring || !(invoice.onlinePayments.systemEnabled && invoice.onlinePayments.businessEnabled) ? `
                        <tr>
                        	<td align="center" valign="top" style="padding-bottom:25px; padding-top:40px;">
                                <table width="194" border="0" cellspacing="0" cellpadding="0" align="center" style="width:194px;">
                                    <tr>
                                    <td align="left" valign="top" width="26" style="width:19px;"><img
                                    src="https://cdn.peymynt.com/static/mailer/left_curve.jpg" width="26" border="0"
                                                        style="display:block;"></td>
                                        <td width="179" height="58" align="center" valign="middle"
                                                    background="#9f55ff"
                                                    style="background-color:#9f55ff; color:#ffffff; font-family:Arial, sans-serif; font-size:18px; font-weight:bold; letter-spacing:1px;">
                                                    <a  target="_blank" href=${getInvoicePublicUrl(invoice.uuid)}
                                                        style="display:block; text-decoration:none; color:#ffffff; line-height:58px; height:58px;">${!(invoice.onlinePayments.systemEnabled && invoice.onlinePayments.businessEnabled) ? 'View Invoice' : 'Pay Invoice'}</a></td>
                                        <td align="left" valign="top" width="26" style="width:26px;"><img src="https://cdn.peymynt.com/static/mailer/right_curve.jpg" width="26" border="0" style="display:block;"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>`: ''}                        
                        <!--Invoice button start here-->
                    </table>
                </td>
            </tr>
    `
}
function getUserMessageSection(message) {
    return `
    <tr>
                <td height="1" style="line-height:1px; font-size:1px; background-color:#e4e7eb; height:1px;" background="#e4e7eb">&nbsp;</td>
            </tr>
            <!--Free space content section start here-->
            <tr>
            	<td align="center" valign="top" style="padding-left:14px; padding-right:14px;">
                	<table width="520" border="0" cellspacing="0" cellpadding="0" align="center" style="width:520px;" class="wrapper">
                    	<tr>
                        	<td align="left" valign="top" style="color: #03393c; font-family:Arial, sans-serif; font-size: 16px; line-height:22px; padding-top:20px; padding-bottom:20px;">${message}</td>
                        </tr>                       
                    </table>
                </td>
            </tr>
    `
}
function getRecurringSection() {
    return `
    <tr>
                <td height="1" style="line-height:1px; font-size:1px; background-color:#e4e7eb; height:1px;" background="#e4e7eb">&nbsp;</td>
            </tr>
    <tr>
            	<td align="center" valign="top" style="padding-left:14px; padding-right:14px;">
                	<table width="540" border="0" cellspacing="0" cellpadding="0" align="center" style="width:540px;" class="wrapper">
                    	<tr>
                            <td valign="top" style="padding-top:30px; padding-bottom:25px;"><img src="https://cdn.peymynt.com/static/mailer/watch_img.jpg" width="42" style="display:block; width:42px;" border="0"></td>
                            <td align="left" style=" color: #4d6575; font-family:Arial, sans-serif; font-size: 14px; line-height:22px; padding-left:20px;">Save time and avoid overdue fees with auto-payment. Once authorized, your credit card will be automatically charged and you'll get an email receipt for future payments. </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <!--Time watch content section End here-->
            <tr>
                <td height="1" style="line-height:1px; font-size:1px; background-color:#e4e7eb; height:1px;" background="#e4e7eb">&nbsp;</td>
            </tr>
    `
}
function getBusinessSection(business, invoice, user) {
    return `
    <tr>
            	<td align="center" valign="top" style="text-align: center; font-size: 16px; color: #9f55ff; font-family:Arial, sans-serif; line-height:22px; padding-top:25px;"><a  target="_blank" href=${getInvoicePublicUrl(invoice.uuid)} style="color:#9f55ff;text-decoration:underline;">View Invoice #${invoice.invoiceNumber}</a></td>
            </tr>
            <tr>
            	<td align="center" valign="top" style="text-align: center; font-size: 16px; color: #03393c; font-family:Arial, sans-serif; line-height:22px; padding-top:25px; padding-bottom:55px;">For questions about this invoice, please contact
                <br/><a href="mailto:${user.email}" style="color:#9f55ff; text-decoration:underline;">${user.email}</a>
                <br/><br/><strong>${business.organizationName}</strong>
                ${business.address.addressLine1 ? `<br/>${business.address.addressLine1}` : ''}
                ${business.address.addressLine2 ? `<br/>${business.address.addressLine2}` : ''}
                <br/>${business.address.city ? `${business.address.city},` : ''} ${business.address.state && business.address.state.name ? business.address.state.name : ''} ${business.address.postal ? business.address.postal : ''}
                <br/>
                ${business.communication.phone ? `<br/>Phone: <a href="tel:${business.communication.phone}" target="_blank" style="color:#03393c; text-decoration:none;">${business.communication.phone}</a>` : ''}
                ${business.communication.fax ? `<br/>Fax: <a href="tel:${business.communication.fax}" target="_blank" style="color:#03393c; text-decoration:none;">${business.communication.fax}</a>` : ''}
                ${business.communication.mobile ? `<br/>Mobile: <a href="tel:${business.communication.mobile}" target="_blank" style="color:#03393c; text-decoration:none;">${business.communication.mobile}</a>` : ''}
                ${business.communication.tollFree ? `<br/>Toll free: <a href="tel:${business.communication.tollFree}" target="_blank" style="color:#03393c; text-decoration:none;">${business.communication.tollFree}</a>` : ''}
                ${business.communication.website ? `<br/><a href=${business.communication.website} target="_blank" style="color:#222222; text-decoration:underline;">${business.communication.website}</a></td>` : ''}
            </tr>
    `
}
let poweredBySection = ``;
function getFooterSection() {
    return `
    </table>
    </td>
</tr>
<tr>
	<td align="center" valign="top" style="padding-left:14px; padding-right:14px;">
    	<table width="500" border="0" cellspacing="0" cellpadding="0" align="center" style="width:500px;" class="wrapper">
        	<tr>
            	<td align="center" valign="top" style="color: #082c2e; font-family:Arial,sans-serif;font-size:12px; text-align: center; padding-top:10px; ">Powered By <strong>Peymynt</strong></td>
            </tr>
            <tr>
            	<td align="center" valign="top" style="text-align: center; font-size: 12px; color: #4d6575; font-family:Arial, sans-serif; line-height:22px; padding-top:5px; padding-bottom:35px;">&copy; 2010-2019 Peymynt Financial Inc. All Rights Reserved.  •  <a href="${getPrivacyUrl()}" target="_blank" style=" text-decoration:none; color:#222222;">Privacy Policy</a>  •  <a href="${getTermsUrl()}" target="_blank" style=" text-decoration:none; color:#222222;">Terms of Use</a></td>
            </tr>
        </table>
    </td>
</tr>
</table>
`};
function getMailEnd() {
    return `<div style="white-space:nowrap;font:20px courier;color:#f4f5f5; font-size:0px; line-height:0px;"><span
class="em_divhide">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
&nbsp;</span> &nbsp;</div>
<!--Full width table end-->
</body>
</html>`;
}

function renderMailer(business, invoice, setting, user, message) {
    // console.log("******invoice ", invoice);
    console.log("******setting ", setting);
    // console.log("******user ", user);
    // console.log("******business ", business);
    let mail = getMailerStart();
    mail += getMailEnd();
    mail += getHeaderSection();
    mail += getLogoSection(setting, invoice);
    mail += getMessageSection(business, invoice);
    mail += getPaymentSection(invoice);
    if (message)
        mail += getUserMessageSection(message);
    mail += getRecurringSection();
    mail += getBusinessSection(business, invoice, user);
    mail += getFooterSection();
    mail += getMailEnd();

    // let outputFile = path.join(__dirname, "output.html");
    // fs.writeFile(outputFile, mail, (err) => {
    //     if (err) console.log(err);
    //     console.log("Successfully Written to File.");
    // });
    return mail;
}
module.exports = {
    render: renderMailer
}