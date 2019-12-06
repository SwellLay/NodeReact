import lodash from 'lodash';
import { InvoiceModel } from './models/invoice.model';
import moment from 'moment';
let currentDate = moment().format('YYYY-MM-DD');
console.log('current date ---', currentDate)

export const cronSchedularMonthly = async () => {
    // cron.schedule("5 4 * * *", () => {
    let searchCondition = {
        isDeleted: false,
        isActive: true,
        isRecurring: true,
        "recurrence.recurrenceUnit": 'weekly'
    }
    let invoices = await InvoiceModel.find(searchCondition);
    // console.log('invoices ===============---', invoices.length)
    // });
}

export const cronSchedularDaily = async () => {
    // cron.schedule("5 4 * * *", () => {
   /*  let searchCondition = {
        isDeleted: false,
        isActive: true,
        isRecurring: true,
        "recurrence.recurrenceUnit": 'daily'
    }

    let invoices = await InvoiceModel.find(searchCondition);
    invoices.map(invoice => {
        // console.log('invoices ===>', invoice.recurrence)
        let invoiceDate = (invoice.recurrence.startDate).subtract(1, "days")
        console.log('invoice date ---', invoiceDate)
        if((moment(invoice.recurrence.startDate).subtract(1, "days")).format('YYYY-MM-DD')=== (moment().format('YYYY-MM-DD'))){
            console.log('invoice ----------------------->', invoice.recurrence)
            // if(invoice.recurr)
        }
        if (invoice.maxInvoices) {
            console.log('')
        }
    // })
    }); */
}

export const cronSchedularYearly = async () => {
    // let searchCondition = {
    //     isDeleted: false,
    //     isActive: true,
    //     isRecurring: true,
    //     "recurrence.recurrenceUnit": 'yearly'
    // }
    // let invoices = await InvoiceModel.find(searchCondition);
    // console.log('invoices ===============---', invoices.length)
}