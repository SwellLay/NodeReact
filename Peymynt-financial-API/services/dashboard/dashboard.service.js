import { okResponse, errorResponse } from "../../util/HttpResponse";

import moment from "moment";

import {
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_OK,
    OK,
    HTTP_NOT_FOUND,
    NULL,
    SUCCESS,
    DELETE_SUCCESS,
    FAILED,
    HTTP_CONFLICT,
    HTTP_BAD_REQUEST
} from "../../util/constant";
import { getFormattedError } from '../../util/utils';

export const getOverdueInvoices = async (businessId, filter) => {
    try {
        let { limit = getSize(1, 5) } = filter;
        let data = [
            {
                displayName: "Google",
                idToOpen: "5d4c0ea3f2e9b5131cdb54c0",
                amount: 4200,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "Microsoft",
                idToOpen: "5d4c0ea3f2e9b5131cdb54c0",
                amount: 3200,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "Amazon web services",
                idToOpen: "5d4c0ea3f2e9b5131cdb54c0",
                amount: 1200,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "IBM",
                idToOpen: "5d4c0ea3f2e9b5131cdb54c0",
                amount: 12000,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "Geeks Invention Pvt Ltd",
                idToOpen: "5d4c0ea3f2e9b5131cdb54c0",
                amount: 200,
                "currency": {
                    code: "INR",
                    displayName: "INR (₹) Indian rupee",
                    name: "Indian rupee",
                    symbol: "₹"
                },
            }
        ];
        return okResponse(HTTP_OK, data.slice(0, limit), "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

export const getOverdueBills = async (businessId, filter) => {
    try {
        let { limit = getSize(1, 5) } = filter;
        let data = [
            {
                displayName: "Hathway",
                idToOpen: "5d4d1fe1f2b74d74d69ed275",
                amount: 4400,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "Act Fibernet",
                idToOpen: "5d4d1fe1f2b74d74d69ed275",
                amount: 3700,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "Amazon web services",
                idToOpen: "5d4d1fe1f2b74d74d69ed275",
                amount: 1900,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "Azure Cloud",
                idToOpen: "5d4d1fe1f2b74d74d69ed275",
                amount: 13000,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "Geeks Invention Pvt Ltd",
                idToOpen: "5d4d1fe1f2b74d74d69ed275",
                amount: 700,
                "currency": {
                    code: "INR",
                    displayName: "INR (₹) Indian rupee",
                    name: "Indian rupee",
                    symbol: "₹"
                },
            }
        ];
        return okResponse(HTTP_OK, data.slice(0, limit), "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

export const getBankAccounts = async (businessId, filter) => {
    try {
        let { limit = getSize(0, 1) } = filter;
        let accounts = [
            {
                displayName: "Total Checking",
                amount: 4400,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "Chase College",
                amount: 3700,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            }
        ];

        let accountsBad = [
            {
                displayName: "Saving Account",
                amount: 1200,
                currency: currencyIndia
            },
            {
                displayName: "Current Account",
                amount: 12400,
                currency: currencyIndia
            }
        ];

        let bankHealthy = {
            displayName: "Chase (US)",
            lastUpdated: "2019-08-12T09:30:00.000+0000",
            connection: "connected",
            accounts: accounts
        }
        let bankBad = {
            displayName: "IDFC Bank (India)",
            lastUpdated: "2019-07-12T09:30:00.000+0000",
            connection: "failed",
            accounts: accountsBad
        }
        // if (limit == 0) {
        //     bank = null;
        // }
        return okResponse(HTTP_OK, [bankHealthy, bankBad].slice(0, limit), "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

let month = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
let year = ["17", "18", "19"];
let currency = {
    "code": "USD",
    "name": "U.S. dollar",
    "symbol": "$",
    "displayName": "USD ($) U.S. dollar"
};
let currencyIndia = {
    code: "INR",
    displayName: "INR (₹) Indian rupee",
    name: "Indian rupee",
    symbol: "₹"
};
export const getCashFlow = async (businessId, filter) => {
    try {
        let { limit = 12 } = filter;
        let data = [];
        let isZeroData = false;
        if (limit == 0) {
            isZeroData = true;
            limit = 12;
        }

        for (let i = 0; i < limit; i++) {
            const m = i > 11 ? month[i - 12] : month[i];
            const y = i > 16 ? year[2] : (i > 4 ? year[1] : year[0]);
            const inFlow = isZeroData ? 0 : getSize(500, 20000);
            const outFlow = isZeroData ? 0 : getSize(1500, 25000);
            data.push({
                displayName: `${m} ${y}`,
                inFlow: inFlow,
                outFlow: -1 * outFlow,
                netChange: inFlow - outFlow
            })
        }
        return okResponse(HTTP_OK, { duration: `${limit} months`, currency: currency, values: data }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

export const getProfitLoss = async (businessId, filter) => {
    try {
        let { limit = 12 } = filter;
        let data = [];
        let isZeroData = false;
        if (limit == 0) {
            isZeroData = true;
            limit = 12;
        }

        for (let i = 0; i < limit; i++) {
            const m = i > 11 ? month[i - 12] : month[i];
            const y = i > 16 ? year[2] : (i > 4 ? year[1] : year[0]);
            const inFlow = isZeroData ? 0 : getSize(5000, 80000);
            const outFlow = isZeroData ? 0 : getSize(1500, 70000);
            data.push({
                displayName: `${m} ${y}`,
                income: inFlow,
                expense: outFlow
            })
        }
        return okResponse(HTTP_OK, { duration: `${limit} months`, currency: currency, values: data }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

export const getPayable = async (businessId, filter) => {
    try {
        let { limit = 5 } = filter;
        let isZeroData = false;
        if (limit == 0)
            isZeroData = true;
        limit = 5;
        let data = [
            {
                displayName: "Coming Due",
                amount: isZeroData ? 0 : 1400,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "1-30 days overdue",
                amount: isZeroData ? 0 : 3400,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "31-60 days overdue",
                amount: isZeroData ? 0 : 1200,
                "currency": {
                    code: "INR",
                    displayName: "INR (₹) Indian rupee",
                    name: "Indian rupee",
                    symbol: "₹"
                },
            },
            {
                displayName: "61-90 days overdue",
                amount: isZeroData ? 0 : 3000,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "> 90 days overdue",
                amount: isZeroData ? 0 : 2700,
                "currency": {
                    code: "INR",
                    displayName: "INR (₹) Indian rupee",
                    name: "Indian rupee",
                    symbol: "₹"
                },
            }
        ];
        return okResponse(HTTP_OK, { data: data.slice(0, limit) }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

export const getOwing = async (businessId, filter) => {
    try {
        let { limit = 5 } = filter;
        let isZeroData = false;
        if (limit == 0)
            isZeroData = true;
        limit = 5;
        let data = [
            {
                displayName: "Coming Due",
                amount: isZeroData ? 0 : 3400,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "1-30 days overdue",
                amount: isZeroData ? 0 : 300,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "31-60 days overdue",
                amount: isZeroData ? 0 : 100,
                "currency": {
                    code: "INR",
                    displayName: "INR (₹) Indian rupee",
                    name: "Indian rupee",
                    symbol: "₹"
                },
            },
            {
                displayName: "61-90 days overdue",
                amount: isZeroData ? 0 : 300000,
                "currency": {
                    "code": "USD",
                    "name": "U.S. dollar",
                    "symbol": "$",
                    "displayName": "USD ($) U.S. dollar"
                },
            },
            {
                displayName: "> 90 days overdue",
                amount: isZeroData ? 0 : 2100,
                "currency": {
                    code: "INR",
                    displayName: "INR (₹) Indian rupee",
                    name: "Indian rupee",
                    symbol: "₹"
                },
            }
        ];
        return okResponse(HTTP_OK, { data: data.slice(0, limit) }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

export const getNetIncome = async (businessId) => {
    try {
        let data = [
            {
                displayName: "Income",
                column1: 32434,
                column2: 23213
            },
            {
                displayName: "Expense",
                column1: 324324,
                column2: 98798
            },
            {
                displayName: "Net Income",
                column1: 2432,
                column2: 3432432.43
            }
        ]
        const currentYear = moment().year();
        let heading = [
            "Fiscal Year",
            `${currentYear - 1}`,
            `${currentYear}`
        ]
        return okResponse(HTTP_OK, { tip: `Fiscal year start is Jan 01`, headings: heading, values: data }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

export const getExpenseCategory = async (businessId, filter) => {
    try {
        const { limit = 10 } = filter;
        let data = [
            {
                displayName: "Repairs & Maintenance",
                amount: 1200,
                percentage: 20
            },
            {
                displayName: "Meals & Entertainment",
                amount: 4500,
                percentage: 20
            },
            {
                displayName: "Accounting Fees",
                amount: 3000,
                percentage: 30
            },
            {
                displayName: "Computer - Internet",
                amount: 7500,
                percentage: 10
            },
            {
                displayName: "Utilities",
                amount: 200,
                percentage: 2
            },
            {
                displayName: "Other",
                amount: 3000,
                percentage: 18
            }

        ]
        return okResponse(HTTP_OK, { currency: currency, values: limit == 0 ? [] : data }, "success");
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_SERVER_ERROR, error, "Failed");
    }
}

function getSize(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
