import fs from 'fs';
import { ensureAuthenticated } from "../auth/JWTToken";
import { sendEmail } from '../util/mail';
import { currentExchangeRate } from '../util/openexchange';
import { emailSchema } from '../validations/EmailValidation';
const json2csv = require('json2csv').parse;
import Joi from "joi";
import { UserModel } from '../models/user.model';
const express = require('express');
const router = express.Router();
// let countryCurrency = fs.readFileSync("./raw_data/country-currency.json");
// try {
//     countryCurrency = JSON.parse(countryCurrency);
// } catch (error) {
//     console.log(error);
//     process.exit(1);
// }

router.get("/countries", async (req, res) => {
    console.log("=======countries routing=> ");
    // let result = await fetchCountries();
    let filePath = req.basePath + "/raw_data/country-by-code.json";
    const countries = fs.readFileSync(filePath, "UTF-8");
    //countryCurrency
    res.status(200).json({ countries: JSON.parse(countries) });
});

router.get("/currencies", async (req, res) => {
    console.log("=======countries routing=> ")
    // let result = await fetchCountries();
    let filePath = req.basePath + "/raw_data/country.json";
    const countries = fs.readFileSync(filePath, "UTF-8");
    res.status(200).json(JSON.parse(countries));
});

router.get("/countries/:id", async (req, res) => {
    console.log("=======countries by id routing=> ", req.params.id);
    let countryCode = req.params.id;
    if (countryCode) {
        let filePath = req.basePath + "/raw_data/country-states.json";
        const countries = fs.readFileSync(filePath, "UTF-8");
        const countryStates = JSON.parse(countries);
        return res.status(200).json({ states: countryStates[countryCode] });
    } else {
        return res.status(400).json({ message: "Please provide country_id" });
    }
});

router.get("/downloadtemplate", async (req, res) => {
    // const fields = {
    //     customerName: '',
    //     firstName: '',
    //     lastName: '',
    //     currency: '',
    //     accountNumber: '',
    //     phone: '',
    //     fax: '',
    //     mobile: '',
    //     tollFree: '',
    //     website: '',
    //     country: '',
    //     state: '',
    //     city: '',
    //     postal: '',
    //     addressLine1: '',
    //     addressLine2: '',
    //     contactPerson: '',
    //     phone: '',
    //     country: '',
    //     state: '', city: '',
    //     postal: '',
    //     addressLine1: '',
    //     addressLine2: '',
    //     deliveryNotes: ''    
    // }
    // try {
    //     var csv = await json2csv(fields);
    //     res.set("Content-Disposition", "attachment;filename=customer.csv");
    //     res.set("Content-Type", "application/octet-stream");
    //     res.send(csv);
    try {
        res.download(req.basePath + '/raw_data/customer.csv');
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/exchangerate", ensureAuthenticated, async (req, res) => {
    try {
        let { base, current } = req.query;
        let data = await currentExchangeRate(base, current);
        return res.status(data.statusCode).json(data);
    } catch (error) {
        console.log("In error");
        return res.status(error.statusCode).json(error);
    }
});

router.post("/fax-webhook", async (req, res) => {
    console.log("Fax webhook received", req);
    fs.writeFileSync('./tmp/webhook.req.json', JSON.stringify(req.body, null, 2));
    res.setHeader('Content-type', 'text/plain');
    res.status(200)
    res.send();
})

module.exports = router;
