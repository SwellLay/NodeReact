import history from "customHistory";
import moment from "moment";
import React, { Fragment } from "react";
import InvoiceDropdown from "./InvoiceDropDown";
import InvoiceRowHoverPopUp from "./InvoiceRowHoverPopUp"
import { toMoney, _prettyDate, getAmountToDisplay, _showExchangeRate } from "../../../../../utils/GlobalFunctions";

import { Tooltip } from 'reactstrap';
import TimeAgo from 'react-timeago';

import frenchStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import customStrings from "../../../../../constants/invoiceConst";
import strings from '../helpers/TimeAgoFormatter';
import sendBlock from '../helpers/SendBlockFormatter';
import { getCommonFormatedDate } from "../../../../../utils/common";

const formatter = buildFormatter(strings)
const sendFormatter = buildFormatter(sendBlock)

export const statusRender = (cell, row, rowIndex, formatExtraData) => {
  if (row.status === "overdue") {
    return <span className="badge badge-danger">{"Overdue"}</span>;
  } else if (row.status === "saved") {
    return <span className="badge badge-default">{"Unsent"}</span>;
  } else if (row.status === "draft") {
    return <span className="badge badge-secondary">{row.status}</span>;
  } else if (row.status === "paid") {
    return <span className="badge badge-success">{row.status}</span>;
  } else if (row.status === "partial") {
    return <span className="badge badge-warning">{row.status}</span>;
  } else if (row.status === "sent") {
    return <span className="badge badge-info">{"Sent"}</span>;
  } else if (row.status === 'viewed') {
    return <span className="badge badge-warning">{row.status}</span>;
  } else {
    return <span className="badge badge-default">{row.status}</span>;
  }
};

 export const dateRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <InvoiceRowHoverPopUp row={row}>
      <div className="py-table__cell-content popover_wrapper" onClick={() => history.push(`/app/invoices/view/${row._id}`)} id={`date-${row._id}`}>
        {getCommonFormatedDate(row.invoiceDate)}
      </div>
    </InvoiceRowHoverPopUp>
  );
};


export const dueDateRender = (cell, row, rowIndex, formatExtraData) => {

  let color = 'black';
  if (row.status === 'overdue') {
    color = '#ff6464'

  }
  return (
    <InvoiceRowHoverPopUp row={row}>
    <div className="py-table__cell-content"  onClick={() => history.push(`/app/invoices/view/${row._id}`)} id={`date-${row._id}`} className="py-text--link" style={{ color: color }}>
      {row.status === 'overdue' ? <Fragment>Due <TimeAgo date={row.dueDate} formatter={formatter} /> </Fragment> : <Fragment>Due <TimeAgo date={row.dueDate} formatter={sendFormatter} /></Fragment>}
    </div>
    </InvoiceRowHoverPopUp>
  );
};

export const numberRender = (cell, row, rowIndex, formatExtraData) => {
  return (
     <InvoiceRowHoverPopUp row={row}>
    <a onClick={() => history.push(`/app/invoices/view/${row._id}`)}>{row.invoiceNumber}</a>
    {row.isRecurring ? <span className="color-muted" data-toggle="tooltip" title="This is a recurring invoice"
      style={{ display: 'block', lineHeight: '0.8' }}
    ><small>Recurring</small></span> : ""}
    </InvoiceRowHoverPopUp>
  )
};

export const customerRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <InvoiceRowHoverPopUp row={row}>
    <div className="py-table__cell-content" onClick={() => history.push(`/app/invoices/view/${row._id}`)}>{row.customer && row.customer.customerName}</div>
</InvoiceRowHoverPopUp>
  );
};

export const totalRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <InvoiceRowHoverPopUp row={row}>
      <a onClick={() => history.push(`/app/invoices/view/${row._id}`)}>
        {`${row.currency.symbol}${toMoney(row.totalAmount ? row.totalAmount : 0)}`}
      </a>
    </InvoiceRowHoverPopUp>
  );
};

export const amountRender = (cell, row, rowIndex, formatExtraData) => {
  let buisinessInfo = JSON.parse(localStorage.getItem('reduxPersist:businessReducer')).selectedBusiness
  console.log("row", row, buisinessInfo.currency, _showExchangeRate(buisinessInfo.currency, row.currency))
  return (
    <InvoiceRowHoverPopUp row={row}>
      <div onClick={() => history.push(`/app/invoices/view/${row._id}`)} className={row.totalAmountInHomeCurrency > 0 ? "text-right invoice-amount-cell amount-cell" : "text-right invoice-amount-cell"}>
        {
          row ? getAmountToDisplay(row.currency, row.dueAmount) : ''
        }

        {/* {_showExchangeRate(row.currency, buisinessInfo.currency) } */}
        <small className="py-text--hint">
          {_showExchangeRate(buisinessInfo.currency, row.currency)
            ? `${getAmountToDisplay(buisinessInfo.currency, row.totalAmountInHomeCurrency)} ${buisinessInfo.currency.code}`
          : ""}
        </small>
      </div>
      </InvoiceRowHoverPopUp>
  );
};

export const actionRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <Fragment>
      <InvoiceDropdown row={row} index={rowIndex} />
    </Fragment>
  );
};
