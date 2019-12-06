// Publishable : pk_test_hB4oc9Ca1piotRvS6zlcsrno
// Secret : sk_test_YdBs9Bd2xkvcPNb9qrsEDE75

// var stripe = require("stripe")("sk_test_YdBs9Bd2xkvcPNb9qrsEDE75");

// stripe.charges.retrieve("acct_1DxyqSGpDInODXjN", {
//     api_key: "sk_test_YdBs9Bd2xkvcPNb9qrsEDE75"
//   });


// stripe.account.retrieve(function (error, response) {
//     console.log("=========",response);
// });

// stripe.invoiceItems.list(function(error, response) {
//     console.log("invoiceItems ===",response);
// });

// stripe.invoiceItems.retrieve(<invoiceItem_id>, function(error, response) {
//     console.log(response);
// });


// stripe.invoiceItems.create(
//     {
//         customer: <customer_id>,
//         amount: 100,
//         currency: 'usd'
//     },
//     function(error, response) {
//         console.log(response);
//     }
// );


// stripe.customers.create(
//     {
//         id : '2',
//         email : 'riya@gmail.com',
//         description: 'New customer Riya'
//     },
//     function(error, response) {
//         console.log("create customer -----------",  response);
//     }
// );

// stripe.customers.retrieve('riya@gmail.com', function(error, response) {
//     console.log('retrieve users ====',response);
// });

// function getUser(customer_id) {
//     stripe.customers.retrieve(customer_id, function (error, response) {
//         if(error){
//             console.log('error========', error)
//         }
//         console.log('------=====', response)
//     });
// }
// getUser("1")

// function updateUser(customer_id, data, cb) {
//     stripe.customers.update(customer_id, data, function (err, response) {
//         console.log('response for update users ======>>', response);
//         return cb(null, response)
//     });
// }

// updateUser("1", { account_balance: 500 }, function(err, response){
//     console.log('response =======', response)
// });


//==========================================================
// import { CustomerModel } from './models/customer.model';
// const express = require("express");
// const router = express.Router();
// var stripe = require("stripe")("sk_test_YdBs9Bd2xkvcPNb9qrsEDE75");

// router.post("/", async (req, res) => {
//     console.log('request stripe ------', req.body);
//     let email = req.body.email;
//     let input = req.body;

//     let customerData = await CustomerModel.findOne({ email })
//     console.log('customer data ---->', customerData)
//     if (!customerData) {
//         createStripeUser("1", input, function (err, response) {
//             if(err){
//                 console.log('error ===>>', err)
//             }
//             input.id = response.id
//             console.log('response =======', response)
//             let user = await CustomerModel(input)
//             user = await user.save();
//         });
//     }
// })

// function createStripeUser(id, userData, cb) {
//     userData.id = id;
//     stripe.customers.create(userData, function (err, response) {
//         if (err) {
//             console.log("create customer err -----------", err);
//             return cb(err);
//         }
//         console.log("create customer -----------", response);
//         return cb(null, response)
//     })
// }
// module.exports = router;



// ====================================
let moment = require('moment');
var startdate = moment("2019-02-01T18:30:00.000")//moment();
console.log('start dtae ====', startdate)
startdate = startdate.subtract(1, "days");
startdate = startdate.format("YYYY-MM-DD");
console.log('start dtae ====', startdate)