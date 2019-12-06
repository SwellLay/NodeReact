var Mailgun = require('mailgun-js');
var mailEngine = require('../mailer/invoice.send/sendInvoice.html');
var invoiceContempEngine = require('../template/contemporary/index.html');
var fs = require('fs');
const domain = "mailer.peymynt.com";
const path = require('path');
// const mailgunJS = require("mailgun-js")({ apiKey: process.env.MAILGUN_API_KEY, domain });
var mailgun = new Mailgun({ apiKey: "43c74cd23122682a6ae3e89ebf50e3a7-4836d8f5-89f38845", domain: domain });

async function sendEmail(to, cc = [], subject, body) {
    try {
        // const result = await mg.messages.create(domain, {
        //     from: `Business <web@mailer.peymynt.com>`,
        //     to,
        //     subject: subject,
        //     html: body
        // });
        var data = {
            //Specify email data
            from: "irfan@irinnovative.com",
            //The email to contact
            to: to,
            //Subject and text data  
            subject: subject,
            html: body
        }
        //Invokes the method to send emails given the above data with the helper library
        mailgun.messages().send(data, function (err, body) {
            //If there is an error, render the error page
            if (err) {
                console.log("got an error: ", err);
            }
            //Else we can greet    and leave
            else {
                //Here "submitted.jade" is the view file for this landing page 
                //We pass the variable "email" from the url parameter in an object rendered by Jade
                console.log(body);
            }
        });

        console.log('Result : queued');
    }
    catch (error) {
        console.log(error);
    }
}

let engineOutput;
const mailerType = 'invoice.contemporary';
const shouldMail = false;
switch (mailerType) {
    case 'invoice.send': {
        let data = require("./invoice.send/data");
        let message = "User message &nbsp;&nbsp;&nbsp;goes<br><br> here";
        message = ""
        engineOutput = mailEngine.render(data.invoice.businessId, data.invoice, data.salesSetting, data.userInfo, message);
        break;
    }
    case 'invoice.contemporary': {
        let data = require("./template/invoice.contemp/data");
        let message = "User message &nbsp;&nbsp;&nbsp;goes<br><br> here";
        message = ""
        engineOutput = invoiceContempEngine.render(data.invoice.businessId, data.invoice, data.salesSetting, data.userInfo, message);
        break;
    }
}
let outputFile = path.join(__dirname, "output.html");
fs.writeFile(outputFile, engineOutput, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
    if (shouldMail) {
        sendEmail(["irfaan.aa@gmail.com"], "", "subject", engineOutput);
        console.log("Mail queued.");
    }
});

let dataToPrint = "File written";
console.log("body ", dataToPrint);