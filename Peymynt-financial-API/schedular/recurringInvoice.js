import moment from "moment";
import cron from "node-cron";
import { RecurringModel } from "../models/recurring.model";
import { InvoiceModel } from "../models/invoice.model";
import { addInvoice, getLatestInvoiceNumber } from "../services/InvoiceService";
import { sendInvoiceEmail } from "../util/mail";

const today = moment().format("YYYY-MM-DD");
let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

console.log("Today Date ==", today, "2019-04-15" >= today);
console.log("next -----", moment().add(1,'days').format('DD-MM-YYYY'))

//Todo : Daily Job ------------
cron.schedule("0 0 * * *", async () => {
  console.log("Daily recurrencec job --->");
  let searchCondition = {
    isDeleted: false,
    isActive: true,
    status: "active",
    isRecurring: true,
    "recurrence.unit": "daily",
    "recurrence.startDate": {
      $gte: today
    },
    // invoiceCount: { $gte: 0 }
  };
  let recurring = await RecurringModel.find(searchCondition).populate("userId");
  console.log(" Daily Recurring length ----->", recurring.length);
  for (let i = 0; i < recurring.length; i++) {
    let invoice = recurring[i];
    console.log(" Daily Recurring =====================================================================", recurring[i].nextInvoiceDate, "---", recurring[i].previousInvoiceDate);
    console.log("Recurring Id -------->", invoice.recurrence);


    if(invoice.sendMail.to.length > 0){
      console.log("No email found for sending recurring daily invoice --->");
    }
    else {
    if (invoice && invoice.recurrence) {
      let newInvoice = await createInvoiceFromRecurring(invoice);

      let emailInput = {
        to:  [invoice.sendMail.to],// ["priyanka199391@gmail.com", "vsharan.elex@gmail.com", "raza@gmail.com"]
        message: invoice.sendMail.message,
        self: invoice.sendMail.copyMyself,
        subject: "Recurring Peymynt Invoice",
        from: "raza@gmail.com"
      };

      if (invoice.notifyStatus.value !== "on") {
        let a = invoice.notifyStatus.key;
        invoice.dueDate = moment().add(a, "days");
        newInvoice.dueDate = moment().format();
      } else {
        invoice.dueDate = moment().format();
        newInvoice.dueDate = moment().format();
      }

      console.log("invoice.recurrence.endDate --", invoice.recurrence.endDate, today)
      if (invoice.recurrence.type === "after" && invoice.recurrence.maxInvoices > 0) {
        console.log("Recurence aftrer -------------------");
        invoice.invoiceCount = invoice.invoiceCount + 1;
        invoice.previousInvoiceDate = invoice.nextInvoiceDate;
        invoice.nextInvoiceDate = moment().add(1,'days').format('YYYY-MM-DD');

        if (invoice.invoiceCount === invoice.recurrence.maxInvoices) {
          console.log("Sent ---------", invoice.invoiceCount,"===",invoice.recurrence.maxInvoices);
          invoice.status = "sent";
       }
      }

      if (invoice.recurrence.type === "on" && invoice.recurrence.endDate >= today ) {
        console.log("On type ------------------------------");
        invoice.invoiceCount = invoice.invoiceCount + 1;
        invoice.previousInvoiceDate = invoice.nextInvoiceDate;
        invoice.nextInvoiceDate = moment().add(1,'days').format('YYYY-MM-DD');

        if (invoice.recurrence.endDate === today) {
          console.log("Sent ---------", );
          invoice.status = "sent";
       }
      }

      if (invoice.recurrence.type === "never") {
        console.log("Never type -----------------------------");
        invoice.invoiceCount = invoice.invoiceCount + 1;
        invoice.previousInvoiceDate = invoice.nextInvoiceDate;
        invoice.nextInvoiceDate = moment().add(1,'days').format('YYYY-MM-DD');
      }
     
      console.log("Invoice daily update from recurring ===========>", invoice.nextInvoiceDate, invoice.previousInvoiceDate);
      await RecurringModel.updateOne({ _id: invoice._id }, invoice);
      let invoiceData = await addInvoice(newInvoice, invoice.userId, invoice.businessId);
      await sendInvoiceEmail(
        emailInput,
        invoice.userId,
        invoice.businessId,
        invoiceData.data.invoice._id
      );
    }
   }
  }
});

//Todo : Weekly Job ------------
cron.schedule("15 0 * * *", async () => {

   console.log("Weekly recurrencec job --->");
   let dayOfWeek = moment().format("dddd")
   console.log("weekly job day of week ---", dayOfWeek);

    let searchCondition = {
      isDeleted: false,
      isActive: true,
      isRecurring: true,
      status: "active",
      "recurrence.unit": "weekly",
      "recurrence.startDate": { $gte: today },
      "recurrence.dayOfWeek": dayOfWeek,
      invoiceCount: { $gte: 0 }
    };

    console.log("Weekly search ===", searchCondition);
    let recurring = await RecurringModel.find(searchCondition)

    for (let i = 0; i < recurring.length; i++) {
      console.log(" Weekly Recurring =====================================================================");
      let invoice = recurring[i];
      console.log("Recurring Id -------->", invoice._id);
  
      if(invoice.sendMail.to.length > 0){
        console.log("No email fund for sending recurring daily invoice --->");
      }
      else {
      if (invoice && invoice.recurrence) {
        let newInvoice = await createInvoiceFromRecurring(invoice);
  
        let emailInput = {
          to: [invoice.sendMail.to],
          message: invoice.sendMail.message,
          self: invoice.sendMail.copyMyself,
          subject: "Recurring Peymynt Invoice",
          from: "raza@gmail.com"
        };
  
        if (invoice.notifyStatus.value !== "on") {
          let a = invoice.notifyStatus.key;
          invoice.dueDate = moment().add(a, "days");
          newInvoice.dueDate = moment().format();
        } else {
          invoice.dueDate = moment().format();
          newInvoice.dueDate = moment().format();
        }
  
        if (invoice.recurrence.type === "after" && invoice.recurrence.maxInvoices > 0) {
          console.log("Recurence aftrer -------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;
          invoice.previousInvoiceDate = invoice.nextInvoiceDate;
          invoice.nextInvoiceDate = moment().add(7,'days').format('YYYY-MM-DD');
  
          if (invoice.invoiceCount === invoice.recurrence.maxInvoices) {
            console.log("Sent ---------", invoice.invoiceCount,"===",invoice.recurrence.maxInvoices);
            invoice.status = "sent";
         }
        }
  
        if (invoice.recurrence.type === "on" && invoice.recurrence.endDate >= today ) {
          console.log("On type ------------------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;
          invoice.previousInvoiceDate = invoice.nextInvoiceDate;
          invoice.nextInvoiceDate = moment().add(7,'days').format('YYYY-MM-DD');
  
          if (invoice.recurrence.endDate === today) {
            console.log("Sent ---------", );
            invoice.status = "sent";
         }
        }
  
        if (invoice.recurrence.type === "never") {
          console.log("Never type -----------------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;
          invoice.previousInvoiceDate = invoice.nextInvoiceDate;
          invoice.nextInvoiceDate = moment().add(7,'days').format('YYYY-MM-DD');
        }
       
        console.log("Invoice daily update from recurring ===========>", invoice);
        await RecurringModel.updateOne({ _id: invoice._id }, invoice);
        let invoiceData = await addInvoice(newInvoice, invoice.userId, invoice.businessId);
        await sendInvoiceEmail(
          emailInput,
          invoice.userId,
          invoice.businessId,
          invoiceData.data.invoice._id
        );
      }
     }
    }
});

//Todo : Monthly Job ------------
cron.schedule("30 0 * * *", async () => {

  let lastDay = moment().endOf('month').format('YYYY-MM-DD');
  let todayDate = moment().date();
  let d = new Date();
  d.setMonth(d.getMonth()+1);
  let nextMonthLastDay = moment(d).endOf("month").format('YYYY-MM-DD');

  let currDate = moment().date();
    let searchCondition = {
      isDeleted: false,
      isActive: true,
      status: "active",
      isRecurring: true,
      "recurrence.unit": "monthly",
      "recurrence.dayofMonth": currDate ,
      invoiceCount: { $gte : 0 }
    };

    console.log("Monthly search ===", searchCondition);
    let recurring = await RecurringModel.find(searchCondition)
    console.log("recurring --------", recurring[0]._id);
   
    for (let i = 0; i < recurring.length; i++) {
      console.log(" Monthly Recurring =====================================================================");
      let invoice = recurring[i];
      console.log("Recurring Id -------->", invoice._id);
  
      if(invoice.sendMail.to.length > 0){
        console.log("No email found for sending recurring daily invoice --->");
      }
      else {
      if (invoice && invoice.recurrence) {
        let newInvoice = await createInvoiceFromRecurring(invoice);
  
        let emailInput = {
          to:  [invoice.sendMail.to], //["priyanka199391@gmail.com", "vsharan.elex@gmail.com", "raza@gmail.com"],
          message: invoice.sendMail.message,
          self: invoice.sendMail.copyMyself,
          subject: "Recurring Peymynt Invoice",
          from: "raza@gmail.com"
        };
  
        if (invoice.notifyStatus.value !== "on") {
          let a = invoice.notifyStatus.key;
          invoice.dueDate = moment().add(a, "days");
          newInvoice.dueDate = moment().format();
        } else {
          invoice.dueDate = moment().format();
          newInvoice.dueDate = moment().format();
        }
  
        if (recurrence.dayofMonth === "last" && today === lastDay) {
          invoice.previousInvoiceDate = invoice.nextInvoiceDate;
          invoice.nextInvoiceDate = nextMonthLastDay;
        } 
        else if(recurrence.dayofMonth === dayOfMonth) {
          invoice.previousInvoiceDate = invoice.nextInvoiceDate;
          invoice.nextInvoiceDate = moment().add(1, "month").format("YYYY-MM-DD");
        }
        else {
        }
        
        if (invoice.recurrence.type === "after" && invoice.recurrence.maxInvoices > 0) {
          console.log("Recurence aftrer -------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;

          if (invoice.invoiceCount === invoice.recurrence.maxInvoices) {
            console.log("Sent ---------", invoice.invoiceCount,"===",invoice.recurrence.maxInvoices);
            invoice.status = "sent";
         }
        }
  
        if (invoice.recurrence.type === "on" && invoice.recurrence.endDate >= today ) {
          console.log("On type ------------------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;
        
          if (invoice.recurrence.endDate === today) {
            console.log("Sent ---------", );
            invoice.status = "sent";
         }
        }
  
        if (invoice.recurrence.type === "never") {
          console.log("Never type -----------------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;
        }

       
        await RecurringModel.updateOne({ _id: invoice._id }, invoice);
        let invoiceData = await addInvoice(newInvoice, invoice.userId, invoice.businessId);
        await sendInvoiceEmail(
          emailInput,
          invoice.userId,
          invoice.businessId,
          invoiceData.data.invoice._id
        );
      }
     }
    }
});

//Todo : Yearly Job ------------
// export const recurringJobForYearly = async () => {
  cron.schedule("40 0 * * *", async () => {

    let month = moment().format("MMMM");
    let currDate = moment().date();

    let searchCondition = {
      isDeleted: false,
      isActive: true,
      status: "active",
      isRecurring: true,
      $and: [
        {"recurrence.unit": "yearly"},
        { "recurrence.monthOfYear": month },
        { "recurrence.dayofMonth": currDate }
      ]
    };

    let recurring = await RecurringModel.find(searchCondition)

    for (let i = 0; i < recurring.length; i++) {
      console.log("Yearly Recurring =====================================================================");
      let invoice = recurring[i];
      console.log("Recurring Id -------->", invoice._id);
  
      if(invoice.sendMail.to.length > 0){
        console.log("No email found for sending recurring daily invoice --->");
      }
      else {
      if (invoice && invoice.recurrence) {
        let newInvoice = await createInvoiceFromRecurring(invoice);
  
        let emailInput = {
          to:  [invoice.sendMail.to],// ["priyanka199391@gmail.com", "vsharan.elex@gmail.com", "raza@gmail.com"]
          message: invoice.sendMail.message,
          self: invoice.sendMail.copyMyself,
          subject: "Recurring Peymynt Invoice",
          from: "raza@gmail.com"
        };
  
        if (invoice.notifyStatus.value !== "on") {
          let a = invoice.notifyStatus.key;
          invoice.dueDate = moment().add(a, "days");
          newInvoice.dueDate = moment().format();
        } else {
          invoice.dueDate = moment().format();
          newInvoice.dueDate = moment().format();
        }
  
        if (invoice.recurrence.type === "after" && invoice.recurrence.maxInvoices > 0) {
          console.log("Recurence aftrer -------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;
          invoice.previousInvoiceDate = invoice.nextInvoiceDate;
          invoice.nextInvoiceDate = moment().add(1,'days').format('YYYY-MM-DD');
  
          if (invoice.invoiceCount === invoice.recurrence.maxInvoices) {
            console.log("Sent ---------", invoice.invoiceCount,"===",invoice.recurrence.maxInvoices);
            invoice.status = "sent";
         }
        }
  
        if (invoice.recurrence.type === "on" && invoice.recurrence.endDate >= today ) {
          console.log("On type ------------------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;
          invoice.previousInvoiceDate = invoice.nextInvoiceDate;
          invoice.nextInvoiceDate = moment().add(1,'days').format('YYYY-MM-DD');
  
          if (invoice.recurrence.endDate === today) {
            console.log("Sent ---------", );
            invoice.status = "sent";
         }
        }
  
        if (invoice.recurrence.type === "never") {
          console.log("Never type -----------------------------");
          invoice.invoiceCount = invoice.invoiceCount + 1;
          invoice.previousInvoiceDate = invoice.nextInvoiceDate;
          invoice.nextInvoiceDate = moment().add(1,'days').format('YYYY-MM-DD');
        }
       
        console.log("Invoice daily update from recurring ===========>", invoice);
        await RecurringModel.updateOne({ _id: invoice._id }, invoice);
        let invoiceData = await addInvoice(newInvoice, invoice.userId, invoice.businessId);
        await sendInvoiceEmail(
          emailInput,
          invoice.userId,
          invoice.businessId,
          invoiceData.data.invoice._id
        );
      }
     }
    }
  });
// };

//Todo : Custom Job ------------
cron.schedule("50 0 * * *", async () => {

  let month = moment().format("MMMM");
  let currDate = moment().date();

  let searchCondition = {
    isDeleted: false,
    isActive: true,
    status: "active",
    isRecurring: true,
    "recurrence.unit" : "custom",
    "recurrence.startDate": {
      $gte: today
    },
  };

  let recurring = await RecurringModel.find(searchCondition)
  let condition ;
  if("recurrence.subUnit" === "daily"){
    condition = {
      "recurrence.startDate": {
        $gte: today
      },
      invoiceCount: { $gte: 0 }
    }
  }

  if("recurrence.subUnit" === "weekly"){
    searchCondition = {
      "recurrence.startDate": { $gte: today },
      "recurrence.dayOfWeek": dayOfWeek,
       invoiceCount: { $gte: 0 }
    }
  }

  if("recurrence.subUnit" === "daily"){
    searchCondition = {
      $and: [
        {"recurrence.unit": "yearly"},
        { "recurrence.monthOfYear": month },
        { "recurrence.dayofMonth": currDate }
      ]
    }
  }

  for (let i = 0; i < recurring.length; i++) {
    console.log("Yearly Recurring =====================================================================");
    let invoice = recurring[i];
    console.log("Recurring Id -------->", invoice._id);

    if(invoice.sendMail.to.length > 0){
      console.log("No email found for sending recurring daily invoice --->");
    }
    else {
    if (invoice && invoice.recurrence) {
      let newInvoice = await createInvoiceFromRecurring(invoice);

      let emailInput = {
        to:  [invoice.sendMail.to],// ["priyanka199391@gmail.com", "vsharan.elex@gmail.com", "raza@gmail.com"]
        message: invoice.sendMail.message,
        self: invoice.sendMail.copyMyself,
        subject: "Recurring Peymynt Invoice",
        from: "raza@gmail.com"
      };

      if (invoice.notifyStatus.value !== "on") {
        let a = invoice.notifyStatus.key;
        invoice.dueDate = moment().add(a, "days");
        newInvoice.dueDate = moment().format();
      } else {
        invoice.dueDate = moment().format();
        newInvoice.dueDate = moment().format();
      }

      if (invoice.recurrence.type === "after" && invoice.recurrence.maxInvoices > 0) {
        console.log("Recurence aftrer -------------------");
        invoice.invoiceCount = invoice.invoiceCount + 1;
      }

      if (invoice.recurrence.type === "on" && invoice.recurrence.endDate >= today ) {
        console.log("On type ------------------------------");
        invoice.invoiceCount = invoice.invoiceCount + 1;
      }

      if (invoice.recurrence.type === "never") {
        console.log("Never type -----------------------------");
        invoice.invoiceCount = invoice.invoiceCount + 1;
      }
     
      if (invoice.invoiceCount === invoice.recurrence.maxInvoices) {
          console.log("Sent ---------", invoice.invoiceCount,"===",invoice.recurrence.maxInvoices);
          invoice.status = "sent";
       }
      console.log("Invoice daily update from recurring ===========>", invoice);
      await RecurringModel.updateOne({ _id: invoice._id }, invoice);
      let invoiceData = await addInvoice(newInvoice, invoice.userId, invoice.businessId);
      await sendInvoiceEmail(
        emailInput,
        invoice.userId,
        invoice.businessId,
        invoiceData.data.invoice._id
      );
    }
   }
  }
});

 const createInvoiceFromRecurring = async(invoice) => {
  let invoiceNumber = await getLatestInvoiceNumber(invoice.businessId, invoice.userId);
  let invoiceInput = {
      name: invoice.title,
      invoiceLogo:
        "https://peymynt-dev.s3.ap-south-1.amazonaws.com/551103-1TOqFD1502285018.jpg",
      title: invoice.title,
      subTitle: invoice.subTitle,
      invoiceNumber,
      customer: invoice.customer,
      isReminder: false,
      currency: invoice.currency,
      invoiceDate: moment().format("YYYY-MM-DD"),
      footer: invoice.footer,
      notes: invoice.notes,
      amountBreakup: invoice.amountBreakup,
      itemHeading: invoice.itemHeading,
      exchangeRate: invoice.exchangeRate,
      items: invoice.items,
      totalAmount: invoice.totalAmount,
      totalAmountInHomeCurrency: invoice.totalAmountInHomeCurrency,
      dueAmount: invoice.dueAmount,
      userId: invoice.userId,
      businessId: invoice.businessId,
      postal: invoice.postal,
      isRecurring: false,
      purchaseOrder: invoice.purchaseOrder,
      skipped: false,
      sentVia: "",
      beforeFourteen: {
        enable: false,
        notifyDate: null
      },
      beforeSeven: {
        enable: false,
        notifyDate: null
      },
      beforeThree: {
        enable: false,
        notifyDate: null
      },
      onDueDate: {
        enable: false,
        notifyDate: null
      },
      afterThree: {
        enable: false,
        notifyDate: null
      },
      afterSeven: {
        enable: false,
        notifyDate: null
      },
      afterFourteen: {
        enable: false,
        notifyDate: null
      },
      publicView: invoice.publicView
    }

    return invoiceInput;
}
