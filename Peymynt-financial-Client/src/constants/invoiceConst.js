import * as invoice from "../components/app/components/invoice/components/TableRender";

export const columns = [{
  dataField: 'status',
  text: 'Status',
  classes: 'py-table__cell',
  formatter: invoice.statusRender,
  sort: false,
},{
  dataField: 'dueDate',
  text: 'Due',
  classes: 'py-table__cell',
  formatter: invoice.dueDateRender,
  sort: true
}, {
  dataField: 'invoiceDate',
  text: 'Date',
  formatter: invoice.dateRender,
  sort: true,
  classes: 'py-table__cell',
  id: 'tooltip'
}, {
  dataField: 'invoiceNumber',
  text: 'Number',
  classes: 'py-table__cell',
  formatter: invoice.numberRender,
  sort: false,
  sortFunc: (a, b, order, dataField, rowA, rowB) => {
    if (order === 'asc') return rowA.invoiceNumber - rowB.invoiceNumber;
    else return rowB.invoiceNumber - rowA.invoiceNumber;
  }
},
{
  dataField: 'customer.customerName',
  text: 'Customer',
  classes: 'py-table__cell',
  formatter: invoice.customerRender,
  sort: false
},
// {
//   dataField: 'totalAmount',
//   text: 'Total',
//   formatter: invoice.totalRender,
//   sort: false
// },
{
  dataField: 'dueAmount',
  text: 'Amount due',
  classes: 'py-table__cell-amount',
  formatter: invoice.amountRender,
  sort: false
},
{
  dataField: 'action',
  text: 'Actions',
  classes: 'py-table__cell__action',
  formatter: invoice.actionRender,
  sort: false
}
];

export const draftColumns = [{
  dataField: 'status',
  text: 'Status',
  classes: 'py-table__cell',
  formatter: invoice.statusRender,
  sort: false,
},{
  dataField: 'invoiceDate',
  text: 'Date',
  classes: 'py-table__cell',
  formatter: invoice.dateRender,
  sort: true,
  id: 'tooltip'
}, {
  dataField: 'invoiceNumber',
  text: 'Number',
  classes: 'py-table__cell',
  formatter: invoice.numberRender,
  sort: false,
  sortFunc: (a, b, order, dataField, rowA, rowB) => {
    if (order === 'asc') return rowA.invoiceNumber - rowB.invoiceNumber;
    else return rowB.invoiceNumber - rowA.invoiceNumber;
  }
},
{
  dataField: 'customer.customerName',
  text: 'Customer',
  classes: 'py-table__cell',
  formatter: invoice.customerRender,
  sort: false
},
// {
//   dataField: 'totalAmount',
//   text: 'Total',
//   formatter: invoice.totalRender,
//   sort: false
// },
{
  dataField: 'dueAmount',
  text: 'Amount due',
  classes: 'py-table__cell-amount',
  formatter: invoice.amountRender,
  sort: false
},
{
  dataField: 'action',
  text: 'Actions',
  classes: 'py-table__cell__action',
  formatter: invoice.actionRender,
  sort: false
}
];

export const allColumns = [{
  dataField: 'status',
  text: 'Status',
  classes: 'py-table__cell',
  formatter: invoice.statusRender,
  sort: false,
},{
  dataField: 'invoiceDate',
  text: 'Date',
  classes: 'py-table__cell',
  formatter: invoice.dateRender,
  sort: true,
  id: 'tooltip'
}, {
  dataField: 'invoiceNumber',
  text: 'Number',
  classes: 'py-table__cell',
  formatter: invoice.numberRender,
  sort: false,
  sortFunc: (a, b, order, dataField, rowA, rowB) => {
    if (order === 'asc') return rowA.invoiceNumber - rowB.invoiceNumber;
    else return rowB.invoiceNumber - rowA.invoiceNumber;
  }
},
{
  dataField: 'customer.customerName',
  text: 'Customer',
  classes: 'py-table__cell',
  formatter: invoice.customerRender,
  sort: false
},
{
  dataField: 'totalAmount',
  text: 'Total',
  classes: 'py-table__cell',
  formatter: invoice.totalRender,
  sort: false
},
{
  dataField: 'dueAmount',
  text: 'Amount due',
  classes: 'py-table__cell-amount',
  formatter: invoice.amountRender,
  sort: false
},
{
  dataField: 'action',
  text: 'Actions',
  classes: 'py-table__cell__action',
  formatter: invoice.actionRender,
  sort: false
}
];

export const defaultSorted = [{
  dataField: 'dueDate',
}];


export const INVOICE_STATUS_FILTER = (tab) => {return [
  {
    label: "Draft",
    value: "draft",
    disabled: tab === 'all' ? false : true
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
    value: "paid",
    disabled: tab === 'all' ? false : true
  },
  {
    label: "Overdue",
    value: "overdue"
  }
]};

Object.defineProperty(exports, "__esModule", {
  value: true
});


export var customStrings = {
  prefixAgo: null,
  prefixFromNow: null,
  suffixAgo: 'ago',
  suffixFromNow: 'in',
  seconds: 'less than a minute',
  minute: 'about a minute',
  minutes: '%d minutes',
  hour: 'about an hour',
  hours: 'about %d hours',
  day: 'a day',
  days: '%d days',
  month: 'about a month',
  months: '%d months',
  year: 'about a year',
  years: '%d years',
  wordSeparator: ' '
};