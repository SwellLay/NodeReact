import momnet from 'moment';
const moment = require('moment');
console.log(new Date().getTime() / 1000);
let formatedDate = moment('2016-07-02T19:27:28.000+0000').format('DD/MM/YY');
console.log("--> new date ", formatedDate);
let estimate = {
    "amountBreakup":
        { "subTotal": 123, "taxTotal": 0, "total": 125.46 },
    "invoice": { "isConverted": false },
    "publicView":
    {
        "status": true,
        "id": "8654e632-ae7d-4cf0-aa41-f348ab4f7382",
        "shareableLinkUrl": "http://localhost:5060/estimatesharelink/728ab539-8d21-49de-864f-6c86734a2ab7"
    },
    "status": "saved",
    "isActive": true,
    "isDeleted": false,
    "_id": "5c3b7e75ad82a5111eed8952",
    "name": "Estimate",
    "estimateNumber": 1,
    "customer": "5c27a9ea74932477ca3c31a9",
    "currency": "INR",
    "exchangeRate": 0,
    "estimateDate": "2019-01-13T18:07:37.753Z",
    "expiryDate": "2019-01-13T18:07:37.753Z",
    "subheading": "", "footer": "",
    "memo": "",
    "items": [{
        "taxes": ["5c27bb0c20cb3608cd441507"],
        "_id": "5c3b7e75ad82a5111eed8953",
        "item": "5c27bb0d20cb3608cd441508",
        "name": "bread",
        "description": "adf",
        "quantity": 1, "price": 123
    }],
    "totalAmount": 0,
    "totalAmountInHomeCurrency": 0,
    "userId": "5c27a82474932477ca3c31a5",
    "businessId": "5c27a84e74932477ca3c31a6",
    "uuid": "728ab539-8d21-49de-864f-6c86734a2ab7",
    "taxes": [],
    "createdAt": "2019-01-13T18:07:50.022Z",
    "updatedAt": "2019-01-13T18:48:24.401Z", "__v": 7
};

//DD-MM-YY
delete estimate._id;
delete estimate.taxes;
delete estimate.createdAt;
delete estimate.updatedAt;
delete estimate.amountBreakup;
// console.log(estimate);

// add share link -> done
// create clone (duplicate) of estimte 
// api for estimate increment count  -> done
// api for check estimate increment count  -> done

// done--> estimate filters estimate name , status ,duplicate  
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
                               <span style="font-weight: bold;font-size:18px;">Sample</span> has sent you an invoice for
                           </td>
                       </tr>
                       <tr>
                           <td style="color: #242729;font-family: Arial;font-size: 24px;font-weight: bold;line-height: 1.21;text-align: center;padding:10px;"> $13,300.00</td>                            
                       </tr>
                       <tr>
                           <td style="color: #597588;font-family: Arial;font-size: 16px;font-weight: bold;line-height: 22px;text-align: center;padding-bottom:15px;"> Due on Jan 28, 2019</td>
                       </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:30px;text-align:center;border-bottom: 1px solid #e4e7eb;"> <a  href="#" style="width: 173px;height: 22px;text-align: center;background: #9f55ff;color: #fff;padding: 15px;display: inline-block;border-radius: 52px;text-decoration: none;font-size: 18px;line-height: 21px;
                ">View Online</a> </td>
            </tr>
            <tr>
                <td style="padding:15px ;;border-bottom:1px solid #e4e7eb;"> Your Message goes here</td>
            </tr>
            <tr>
                <td> 
                    <table style="width:100%; text-align:center;"> 
                        <tr>
                            <td style="color:#03393c;font-family:Arial;font-size:16px;line-height:22px;text-align: center;padding-top:20px;">
                                <span style="display:block;"> questions about this invoice, please contact </span>
                                <span style="display:block;"> <a href="#"> john.r@irinnovative.com</a>  </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="color:#03393c;font-family:Arial;font-size:16px;line-height:22px;text-align: center;padding:30px 0">
                                <span style="display:block;font-weight:600;"> sample </span>
                                <span style="display:block;"> Cl-21 sukhliya  </span>
                                <span style="display:block;">indore, Madhya Pradesh 452001</span>
                                <span style="display:block;">India</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="color:#03393c;font-family:Arial;font-size:16px;line-height:22px;text-align:center;padding-bottom:20px;">
                                <span style="display:block;"> Phone: 8982635001 </span>
                                <span style="display:block;">Fax: 123456789  </span>
                                <span style="display:block;">Mobile: 9753169171</span>
                                <span style="display:block;">Toll free: 1400-00-88-666</span>
                                <span style="display:block;"><a href="#"> www.example.com </a> </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <table align="center" border="0" style="width:600px;padding:10px;margin-top:15px;">
           <tr>
               <td style="text-align:right;color:#03393c;padding-right:9px;"> Powered by </td>
               <td> <img src="https://ci6.googleusercontent.com/proxy/SjR4zMG9C2GqLf8vM_JdEpDE8RiuMLNj0xdNDw74j_M14ARTv3rJijKYab_7GQBNg8p6hJtqB2Q4C6c5z9dZTxeDN1n0uhV0zWsvlrg-4SaOdTTYS3ITZbW-WsCl=s0-d-e1-ft#https://s3.amazonaws.com/wave-buoyant/public/wave-ripple/wave-logo-new.png" style="width:100px;"></td>
           </tr>
           <tr>
               <td colspan="2" style="font-size: 11px;text-align: center;">
                    © 2019 Peymynt Financial Inc. All Rights Reserved.<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span> <a href="#" style="color: #8C959A;">Privacy Policy</a><span>&nbsp;&nbsp;•&nbsp;&nbsp;</span><a href="#" style="color: #8C959A;">Terms of Use </a>

               </td>
           </tr>
        </table>
    </body>`;

var fs = require("fs");
var pdf = require('html-pdf');
var options = { format: 'Letter' };

pdf.create(html, options).toFile('./businesscard.pdf', function (err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
    var path = require("path");
    // fs.writeFileSync("businesscard.pdf", new Buffer(html));
    var filepath = path.join(__dirname, 'businesscard.pdf');
    var file = fs.readFileSync(filepath);

    // var file = new Buffer(html);
    var mailgun = require('mailgun-js')({ apiKey: "43c74cd23122682a6ae3e89ebf50e3a7-4836d8f5-89f38845", domain: "mailer.peymynt.com" });
    var attachment = new mailgun.Attachment({ data: file, filename: "Invoice.pdf", contentType: 'application/pdf' });

    var data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: ["vsharan.elex@gmail.com", "priyanka199391@gmail.com"],
        subject: 'Hello',
        text: 'Testing some Mailgun awesomeness!',
        html,
        attachment
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
});