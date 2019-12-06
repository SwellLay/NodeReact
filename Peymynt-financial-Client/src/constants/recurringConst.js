
import * as invoice from "../components/app/components/RecurringInvoice/helpers/TableRender";
import moment from "moment";
console.log('actionRender', invoice.actionRender)
export const columns = [{
  dataField: 'status',
  text: 'Status',
  formatter: invoice.statusRender,
  sort: false,
  classes: 'py-table__cell'
},
{
  dataField: 'customer.customerName',
  text: 'Customer',
  formatter: invoice.customerRender,
  sort: false,
  classes: 'py-table__cell'
},
{
  dataField: 'invoiceDate',
  text: 'Schedule',
  formatter: invoice.scheduleColRender,
  sort: false,
  classes: 'py-table__cell',
  style: {
    'minWidth' : '310px'
  }
},
{
  dataField: 'previousInvoiceRender',
  text: 'Previous Invoice',
  formatter: invoice.previousInvoiceRender,
  sort: false,
  classes: 'py-table__cell',
  style: {
    'width' : '110px',
  }
},
{
  dataField: 'nextInvoiceRender',
  text: 'Next Invoice',
  formatter: invoice.nextInvoiceRender,
  sort: false,
  classes: 'py-table__cell',
  style: {
    'width' : '110px'
  }
},
{
  dataField: 'totalAmount',
  text: 'Invoice amount',
  formatter: invoice.amountRender,
  sort: false,
  classes: 'py-table__cell',
  style: {
    'text-align': 'right'
  }
},
{
  dataField: 'totalAmount',
  text: '',
  formatter: invoice.actionRender,
  sort: false,
  classes: 'py-table__cell'
}
];

export const columnsAll = [{
  dataField: 'status',
  text: 'Status',
  formatter: invoice.statusRender,
  sort: false,
  classes: 'py-table__cell'
},
{
  dataField: 'customer.customerName',
  text: 'Customer',
  formatter: invoice.customerRender,
  sort: false,
  classes: 'py-table__cell'
},
{
  dataField: 'invoiceDate',
  text: 'Schedule',
  formatter: invoice.scheduleColRender,
  sort: false,
  classes: 'py-table__cell',
  style: {
    'minMidth' : '310px'
  }
},
{
  dataField: 'previousInvoiceRender',
  text: 'Previous Invoice',
  formatter: invoice.previousInvoiceRender,
  sort: false,
  classes: 'py-table__cell',
  style: {
    'width' : '110px',
  }
},
{
  dataField: 'nextInvoiceRender',
  text: 'Next Invoice',
  formatter: invoice.nextInvoiceRender,
  sort: false,
  style: {
    'width' : '110px'
  }
},
{
  dataField: 'totalAmount',
  text: 'Invoice amount',
  formatter: invoice.amountRender,
  sort: false,
  classes: 'py-table__cell',
  style: {
    'textAlign': 'right'
  }
},
{
  dataField: 'totalAmount',
  text: '',
  formatter: invoice.actionRenderDraft,
  classes: 'py-table__cell',
  sort: false
}
];

export const draftColumns = [{
  dataField: 'status',
  text: 'Status',
  formatter: invoice.statusRender,
  classes: 'py-table__cell',
  sort: false
},
{
  dataField: 'customer.customerName',
  text: 'Customer',
  formatter: invoice.customerRender,
  classes: 'py-table__cell',
  sort: false
},
{
  dataField: 'invoiceDate',
  text: 'Schedule',
  formatter: invoice.dateRender,
  sort: false,
  classes: 'py-table__cell',
  style: {
    'minWidth' : '310px'
  }
},
{
  dataField: 'invoiceDate',
  text: 'Created',
  formatter: invoice.dateRender,
  sort: false,
  classes: 'py-table__cell'
},
{
  dataField: 'invoiceDate',
  text: 'First Invoice',
  formatter: invoice.dateRender,
  sort: false,
  classes: 'py-table__cell'
},
{
  dataField: 'totalAmount',
  text: 'Invoice amount',
  formatter: invoice.amountRender,
  sort: false,
  classes: 'py-table__cell-amount'
},
{
  dataField: 'totalAmount',
  text: '',
  formatter: invoice.actionRenderDraft,
  sort: false,
  classes: 'py-table__cell'
}
];

export const defaultSorted = [{
  dataField: 'invoiceDate',
  order: 'desc'
}];


export const INVOICE_STATUS_FILTER = [
  {
    label: "Draft",
    value: "draft"
  },
  {
    label: "Unsent",
    value: "saved"
  },
  {
    label: "Sent",
    value: "sent"
  },
  {
    label: "Viewed",
    value: "viewed"
  },
  {
    label: "Partial",
    value: "partial"
  },
  {
    label: "Paid",
    value: "paid"
  },
  {
    label: "Overdue",
    value: "overdue"
  }
];

export const REAPAT_INVOICE = [
  {
    label: "Daily",
    value: "daily"
  },
  {
    label: "Weekly",
    value: "weekly"
  },
  {
    label: "Monthly",
    value: "monthly"
  },
  {
    label: "Yearly",
    value: "yearly"
  },
  {
    label: "Custom",
    value: "custom"
  }
];

export const SUB_UNIT = [
  {
    label: "Day(s)",
    value: "Day(s)"
  },
  {
    label: "Week(s)",
    value: "Week(s)"
  },
  {
    label: "Month(s)",
    value: "Month(s)"
  },
  {
    label: "Year(s)",
    value: "Year(s)"
  }
];

export const monthlyList = [
    {
        label: "First",
        value: moment().startOf('M').format('DD')
      },
      {
        label: "Last",
        value: "last"
      },
      {
        label: "2nd",
        value: '2nd'
      },
      {
        label: "3rd",
        value: "3rd"
      },
      {
        label: "4th",
        value: "4th"
      },
      {
        label: "5th",
        value: "5th"
      },
      {
        label: "6th",
        value: "6th"
      },
      {
        label: "7th",
        value: "7th"
      },
      {
        label: "8th",
        value: "8th",
      },
      {
        label: "9th",
        value: "9th",
      },
      {
        label: "10th",
        value: "10th"
      },
      {
        label: "11th",
        value: "11th"
      },
      {
        label: "12th",
        value: "12th"
      },
      {
        label: "13th",
        value: "13th"
      },
      {
        label: "14th",
        value: "14th"
      },
      {
        label: "15th",
        value: "15th"
      },
      {
        label: "16th",
        value: "16th"
      },
      {
        label: "17th",
        value: "17th",
      },
      {
        label: "18th",
        value: "18th",
      },
      {
        label: "19th",
        value: "19th",
      },
      {
        label: "20th",
        value: "20th",
      },
      {
        label: "21st",
        value: "21st",
      },
      {
        label: "22nd",
        value: "22nd",
      },
      {
        label: "23rd",
        value: "23rd",
      },
      {
        label: "24th",
        value: "24th",
      },
      {
        label: "25th",
        value: "25th",
      },
      {
        label: "26th",
        value: "26th",
      },
      {
        label: "27th",
        value: "27th",
      },
      {
        label: "28th",
        value: "28th",
      },
      {
        label: "29th",
        value: "29th",
      },
      {
        label: "30th",
        value: "30th",
      },
      {
        label: "31st",
        value: "31st",
      } 
]

export const INVOICE_END = [
  {
    label:"After",
    value:"after"
  },
  {
    label:"On",
    value:"on"
  },
  {
    label:"Never",
    value:"never"
  }
]

export const WEEKLY_LIST = [
  {
    label:"Sunday",
    value:"Sunday"
  },
  {
    label:"Monday",
    value:"Monday"
  },
  {
    label:"Tuesday",
    value:"Tuesday"
  },
  {
    label:"Wednesday",
    value:"Wednesday"
  },
  {
    label:"Thursday",
    value:"Thursday"
  },
  {
    label:"Friday",
    value:"Friday"
  },
  {
    label:"Saturday",
    value:"Saturday"
  }
]

export const MONTH_YEAR=[
  {
    label:'January',
    value:'January'
  },
  {
    label:'February',
    value:'February'
  },
  {
    label:'March',
    value:'March'
  },
  {
    label:'April',
    value:'April'
  },
  {
    label:'May',
    value:'May'
  },
  {
    label:'June',
    value:'June'
  },
  {
    label:'July',
    value:'July'
  },
  {
    label:'August',
    value:'August'
  },
  {
    label:'September',
    value:'September'
  },
  {
    label:'October',
    value:'October'
  },
  {
    label:'November',
    value:'November'
  },
  {
    label:'December',
    value:'December'
  },
]

export const PAYMENT_DUE_OPTION=[
  {
    key:'On',
    value:'On Receipt'
  },
  {
    key:'7',
    value:'Within 7 Days'
  },
  {
    key:'14',
    value:'Within 14 Days'
  },
  {
    key:'30',
    value:'Within 30 Days'
  },
  {
    key:'45',
    value:'Within 45 Days'
  },
  {
    key:'60',
    value:'Within 60 Days'
  },
  {
    key:'90',
    value:'Within 90 Days'
  },
]