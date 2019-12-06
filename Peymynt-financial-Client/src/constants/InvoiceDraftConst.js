import React from 'react'
import moment from 'moment'

const statusRender = (cell, row, rowIndex, formatExtraData) =>{
    return (
      <span className="badge-danger">{moment(row.expiryDate).format('YYYY-MM-DD')}</span>
    );
  }
  
  const dateRender = (cell, row, rowIndex, formatExtraData)=> {
    return (
      <a href="javascript:void(0)">{moment(row.estimateDate).format('YYYY-MM-DD')}</a>
    );
  }
  
  const numberRender = (cell, row, rowIndex, formatExtraData)=> {
    return (
      <a href="javascript:void(0)">{row.estimateNumber}</a>
    );
  }
  
const customerRender = (cell, row, rowIndex, formatExtraData)=> {
    return (
      <a href="javascript:void(0)">{row.customer.customerName}</a>
    );
  }
  
  const amountRender = (cell, row, rowIndex, formatExtraData) => {
    return (
      <a href="javascript:void(0)">{row.amount}</a>
    );
  }

export const columns = [{
  dataField: 'status',
  text: 'Status',
  formatter: statusRender,
  sort: true,
}, {
  dataField: 'date',
  text: 'Date',
  formatter: dateRender,
  sort: true

}, {
  dataField: 'number',
  text: 'Number',
  formatter: numberRender,
  sort: true
},
{
  dataField: 'customer',
  text: 'Customer',
  formatter: customerRender,
  sort: true
},
{
  dataField: 'amount due',
  text: 'Amount due',
  formatter: amountRender,
  sort: true
},
];

export const defaultSorted = [{
    dataField: 'name',
    order: 'desc'
  }];
