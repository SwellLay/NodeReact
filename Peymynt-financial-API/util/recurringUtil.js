import uuidv4 from "uuid/v4";
import { start } from "repl";
import formatDate from "../models/common/date_formatter.middleware";

export const recurringInput = (state, settings) => {
    return {
        title: (state && state.title) || (settings && settings.title) || "Recurring",
        subTitle: (state && state.subTitle) || (settings && settings.subTitle) || "",
        postal: (state && state.postal) || "",
        businessId: state && state.businessId,
        purchaseOrder: "",
        dueAmount: (state && state.totalAmount) || 0,
        paymentDue: 0,
        invoiceNumber: (state && state.invoiceNumber) || 0,
        isRecurring: (state && state.isRecurring) || true,
        uuid: uuidv4(),
        customer: (state && typeof state.customer === "object" ? state.customer._id : state.customer) || "",
        currency: state && state.currency,
        paid: undefined,
        previousInvoiceDate : undefined,
        nextInvoiceDate : undefined,
        recurrence: {
          isSchedule: false,
          unit: "daily",
          interval: 1,
          type: "after",
          startDate: undefined,
          endDate: undefined,
          maxInvoices: 0,
          dayofMonth: undefined,
          dayOfWeek: "Sunday",
          monthOfYear: "January"
        },

        footer: (state && state.footer) ||  (settings && settings.footer) || "",
        notes: (state && state.notes) || (settings && settings.notes) || "",
        amountBreakup: (state && state.amountBreakup) || {
            subTotal: 0,
            taxTotal: [
            {
                taxName: "",
                rate: 0,
                amount: 0
            }
            ],
            total: 0
         },
        totalAmount: (state && state.totalAmount) || 0,
        totalAmountInHomeCurrency: (state && state.totalAmountInHomeCurrency) || 0,
        itemHeading: (settings && settings.itemHeading) || {
    column1: {
      name: "Items",
      shouldShow: true
    },
    column2: {
      name: "Quantity",
      shouldShow: true
    },
    column3: {
      name: "Price",
      shouldShow: true
    },
    column4: {
      name: "Amount",
      shouldShow: true
    }
        },
        publicView: (state && state.publicView) || {},
        items: (state && state.items) || [],
        taxes: (state && state.taxes) || [],
        status: "draft",
        userId: state && state.userId
  };
};
const defaultReminder = {
  enable: false,
  notifyDate: null
};
 
//Function to calculate the next invoice date. 
//Runs when creating the recurring invoice.
//This function also needs to be called again when cron job runs
//for sending the recurring invoice
export const calculateNextRecurringInvoiceDate = (recurrenceObj) => {
  var  nextInvoiceDate = formatDate(recurrenceObj.startDate);
  var currDate = new Date();

  if(!(nextInvoiceDate > currDate)) {
    switch (unit) {
      case "daily":
        var nextInvoiceDate = currDate.setDate(currDate.getDate()+recurrenceObj.Interval);
        break;

      case "weekly":
        var nextInvoiceDate = currDate.setDate(currDate.getDate()+(recurrenceObj.Interval*7));
        break;

      case "monthly":
        var nextInvoiceDate = currDate.setMonth(currDate.getMonth()+recurrenceObj.Interval);
        break;

      case "yearly":
        var nextInvoiceDate = currDate.setYear(currDate.getYear()+recurrenceObj.Interval);
        break;

      case "custom":
        switch (recurrenceObj.subUnit){
          case "Day(s)":
            var nextInvoiceDate = currDate.setDate(currDate.getDate()+(1*recurrenceObj.Interval));
            break;
          case "Week(s)":
            var nextInvoiceDate = currDate.setDate(currDate.getDate()+(recurrenceObj.Interval*7));
            break;
          case "Month(s)":
            var nextInvoiceDate = currDate.setMonth(currDate.getMonth()+recurrenceObj.Interval);
            break;
          case "Year(s)":
            var nextInvoiceDate = currDate.setYear(currDate.getYear()+recurrenceObj.Interval);
            break;
        }
        break;

      default:
    }
  }
  return formatDate(nextInvoiceDate);
}; 