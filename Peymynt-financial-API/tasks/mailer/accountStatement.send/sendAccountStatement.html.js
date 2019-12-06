var { toMoney, getDisplayDate, getPrivacyUrl, getTermsUrl, getAccountStatementPublicUrl } = require('../../util');
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
function getLogoSection(setting) {
    return `
    <tr>
            	<td align="center" valign="top" style="padding-top:30px; padding-bottom:25px;"><a target="_blank" href="#"><img src=${setting.companyLogo} width="auto" style="display:block; width:auto;max-width:180px;" border="0"></a></td>
            </tr>
    `
}
function getMessageSection(data) {
    return `
    <tr>
            	<td align="center" valign="top">
                	<table width="580" border="0" cellspacing="0" cellpadding="0" align="center" style="width:580px;" bgcolor="#edf2f7" class="wrapper">
                    	<tr>
                        	<td align="center" valign="top" style="color: #242729; font-family:Arial, sans-serif; font-size: 24px; line-height:25px; text-align: center; padding-top:30px; padding-bottom:5px; padding-left:14px; padding-right:14px;"><span  style="font-size:24px; font-weight:bold;">Statement of Account</span></td>
                        </tr>
                        <tr>
                        	<td align="center" valign="top" style="color: #242729; font-family:Arial, sans-serif; font-size: 18px; font-weight: bold; line-height:30px; text-align: center; padding-bottom:8px; padding-left:14px; padding-right:14px;">(${getDisplayDate(data.filter.startDate, "MMM DD, YYYY")} to ${getDisplayDate(data.filter.endDate, "MMM DD, YYYY")})</td>
                        </tr>
                        <tr>
                        	<td align="center" valign="top" style="color: #597588; font-family:Arial, sans-serif; font-size: 18px; font-weight: bold; line-height:22px; text-align: center; padding-bottom:30px; padding-left:14px; padding-right:14px;">for ${data.customer.customerName}</td>
                        </tr>
                    </table>
                </td>
            </tr>
    `
}
function getPaymentSection(data, statementUUId) {
    return `
    <tr>
            	<td align="center" valign="top">
                	<table width="494" border="0" cellspacing="0" cellpadding="0" align="center" style="width:494px;" class="wrapper">                    
                        <tr>
                        	<td align="center" valign="top" style="padding-bottom:25px; padding-top:40px;">
                                <table width="400px" border="0" cellspacing="0" cellpadding="0" align="center" style="width:400px; margin-bottom:10px;">
                                <tr>
                                    <td colspan="3" align="center" valign="top"
                                    style="font-family:Arial, sans-serif; font-size:18px; font-weight:bold; letter-spacing:1px; margin-bottom:10px;">
                                        Total USD due: $${toMoney(data.total.totalAmount)}
                                    </td>
                                </tr>
                                </table>
                                <table width="194" border="0" cellspacing="0" cellpadding="0" align="center" style="width:194px;">
                                <tr>
                                    <td align="left" valign="top" width="26" style="width:19px;"><img
                                    src="https://cdn.peymynt.com/static/mailer/left_curve.jpg" width="26" border="0"
                                                        style="display:block;"></td>
                                        <td width="179" height="58" align="center" valign="middle"
                                                    background="#9f55ff"
                                                    style="background-color:#9f55ff; color:#ffffff; font-family:Arial, sans-serif; font-size:18px; font-weight:bold; letter-spacing:1px;">
                                                    <a  target="_blank" href=${getAccountStatementPublicUrl(statementUUId)}
                                                        style="display:block; text-decoration:none; color:#ffffff; line-height:58px; height:58px;">View</a></td>
                                        <td align="left" valign="top" width="26" style="width:26px;"><img src="https://cdn.peymynt.com/static/mailer/right_curve.jpg" width="26" border="0" style="display:block;"></td>
                                </tr>
                                </table>
                            </td>
                        </tr>                  
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

function renderMailer(dataObj, setting, statementUUId,message) {
    console.log("******setting ", setting);
    let mail = getMailerStart();
    mail += getMailEnd();
    mail += getHeaderSection();
    mail += getLogoSection(setting);
    mail += getMessageSection(dataObj);
    mail += getPaymentSection(dataObj,statementUUId);
    if (message)
        mail += getUserMessageSection(message);
    mail += getRecurringSection();
    //mail += getBusinessSection(business, invoice, user);
    mail += getFooterSection();
    mail += getMailEnd();
    return mail;
}
module.exports = {
    render: renderMailer
}