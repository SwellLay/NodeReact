import axios from "axios";
import { okResponse, errorResponse } from "./HttpResponse";
import { FAILED } from "./constant";

export const currentExchangeRate = async (base = "USD", current = "INR") => {
    const APP_ID = process.env.OPEN_EXCHANGE_APP_ID;
    const BASE_URI=`https://openexchangerates.org/api/latest.json?app_id=${APP_ID}&base=${base}`;
    let data = await axios.get(BASE_URI)
    .then((response) => {
        console.log("Got the response");
        let rates = response.data && response.data.rates ? response.data.rates: {};
        let exchangeRate = rates[current];
        return okResponse(200, { exchangeRate }, "Exchange data");
    }).catch(error => {
        console.log(error);
        return errorResponse(200, undefined, FAILED);
    });

    console.log("finally", data);
    return data;

}