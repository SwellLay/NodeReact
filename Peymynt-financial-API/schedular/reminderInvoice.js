import cron from 'node-cron';
import moment from 'moment';
import { sendInvoiceReminderEmail } from '../util/mail';

const today = moment().startOf('day');
console.log('Today Date ---', today.toDate(), '===>', moment(today).endOf('day').toDate());

import { InvoiceModel } from '../models/invoice.model';

// export const cronJobForReminderInvoice = async () => {
    cron.schedule("15 * * * *", async () => {
        let searchCondition = {
            isDeleted: false,
            isActive: true,
            isRecurring: false,
            isReminder: true,
            $or: [{ "beforeThree.enable": true }, { "beforeSeven.enable": true }, { "beforeFourteen.enable": true }, { "onDueDate.enable": true }, { "afterThree.enable": true }, { "afterSeven.enable": true }, { "afterFourteen.enable": true }],
            $or: [
                {
                    "beforeThree.notifyDate": {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                }, {
                    "beforeSeven.notifyDate": {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                }, {
                    "beforeFourteen.notifyDate": {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                }, {
                    "onDueDate.notifyDate": {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                }, {

                    "afterThree.notifyDate": {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                }, {
                    "afterSeven.notifyDate": {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    },
                }, {
                    "afterFourteen.notifyDate": {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                }
            ]
        }

        let invoices = await InvoiceModel.find(searchCondition).populate("customer").populate("businessId").populate("userId");
        // console.log('Invoices schedular ============>', invoices);
        for (let i = 0; i < invoices.length; i++) {
            let invoice = invoices[i];
            console.log("invoice.customer.email", invoice.customer.email);
            let emailInput = {
                to: [invoice.customer.email], message,
                self: false,
                subject: "Reminder Peymynt Invoice",
                from: invoice.userId.email
            }
            let message = 'Reminder mail for Invoice';
            await sendInvoiceReminderEmail(emailInput, invoice.userId, invoice.businessId._id, invoice._id);
        }
    });
// }