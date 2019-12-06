// import mailgun from 'mailgun.js';
// import moment from 'moment';
// let date = moment().format("YYYY-MM-DD");

// const mg = mailgun.client({
//     username: 'api',
//     key: process.env.MAILGUN_API_KEY,
//     public_key: process.env.MAILGUN_PUBLIC_KEY || 'pubkey-yourkeyhere'
// });
var Mailgun = require('mailgun-js');
var mailEngine = require('./tasks/mailer/invoice.send/sendInvoice.html');

const domain = "mailer.peymynt.com";
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



// sendEmail(["irfaan.aa@gmail.com"], "", "subject", body);
console.log("body ", mailEngine.render());