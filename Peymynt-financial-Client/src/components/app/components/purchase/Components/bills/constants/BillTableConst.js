import React, { Fragment } from "react";
import { NavLink } from 'react-router-dom';
import { getCommonFormatedDate } from "utils/common";
import { toMoney } from "utils/GlobalFunctions";
import DropdownWrapper from "./ActionDropDown";

const statusRender = (cell, row, rowIndex, formatExtraData) => {
  return row.status === "expired" ? (
    <span className="badge badge-danger">{row.status}</span>
  ) : row.status === "unpaid" ? (
    <span className="badge badge-default">{row.status}</span>
  ) : row.status === "paid" ? (
    <span className="badge badge-success">{row.status}</span>
  ) : row.status === "viewed" ? (
    <span className="badge badge-warning">{row.status}</span>
  ) : (
    <span>{row.status}</span>
  );
};

const dateRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <span className="py-text--link" to={`/app/purchase/bills/${row.id}`}>
      {getCommonFormatedDate(row.billDate)}
    </span>
  );
};

const numberRender = (cell, row, rowIndex, formatExtraData) => {
  return <span to={`/app/purchase/bills/${row.id}`}>{row.billNumber || "—"}</span>;
};

const vendorRender = (cell, row, rowIndex, formatExtraData) => {
  return row.vendor ? (
    <Fragment>
      <span to={`/app/purchase/bills/${row.id}`}>{row.vendor.vendorName}</span>
      <div className="py-text--hint">
        {row.vendor.vendorType === 'contractor' ? '1099 Contractor' : 'Vendor'}
      </div>
    </Fragment>
  ) : null;
};

const amountRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <Fragment>
      <span to={`/app/purchase/bills/${row.id}`}>{`${
        row.currency ? row.currency.symbol : ""
      }${toMoney(row.dueAmount ? row.dueAmount : 0)} ${
        !!row.currency.code
          ? row.currency.code
          : ""
      }`}</span>
      <span className="py-text--hint"> Total {`${
        row.currency ? row.currency.symbol : ""
      }${toMoney(row.totalAmount ? row.totalAmount : 0)} ${
        !!row.currency.code
          ? row.currency.code
          : ""
      }`}</span>
    </Fragment>
  );
};

// const renderStatusLabel = () => {
//     const { row }
//     return
// }
const actionRender = (cell, row, rowIndex, { recordPayment } = {}) => {
  const onRecord = () => recordPayment(row);
  return (
    <Fragment>
      <a href="javascript:void(0);" onClick={onRecord} className="py-text--link">Record payment</a>
      <DropdownWrapper row={row} index={rowIndex} onRecord={onRecord} />
    </Fragment>
  );
};

const noColumnRender = (cell, row, rowIndex, formatExtraData) => {
  console.log("in nocolumn", row);
  return (
    <div className="inner-alert">
      <div className="alert alert-primary" role="alert">
        <svg viewBox="0 0 20 20" className="py-icon" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
        You don't have any estimates. Why not <Link to="/app/purchase/add" className="accent">create an estimate</Link>?
      </div>
    </div>
  )
};

export function getColumns(recordPayment) {
  return [
    {
      dataField: "billDate",
      classes: 'py-table__cell invoice-bill-date',
      text: "Date",
      formatter: dateRender,
      sort: true,
    },
    {
      dataField: "billNumber",
      classes: 'py-table__cell invoice-bill-number',
      text: "Number",
      formatter: numberRender,
      sort: false,
    },
    {
      dataField: "vendor.vendorName",
      classes: 'py-table__cell invoice-bill-client',
      text: "Vendor",
      formatter: vendorRender,
      sort: false,
    },
    {
      dataField: "dueAmount",
      classes: 'py-table__cell-amount invoice-bill-amount-due-paid',
      text: "Amount due",
      formatter: amountRender,
      sort: false
    },
    {
      dataField: "",
      classes: 'py-table__cell invoice-bill-status',
      text: "Payment status",
      formatter: statusRender,
      sort: false
    },
    {
      dataField: "",
      classes: 'py-table__cell invoice-bill-actions',
      text: "Actions",
      formatter: actionRender,
      formatExtraData: { recordPayment },
      sort: false,
      style: {
        textAlign: 'right'
      }
    }
  ];
}

export const defaultSorted = [
  {
    dataField: "billDate",
    order: "desc"
  }
];

export const FILTER_CONST = [
  {
    label: "Sent",
    value: "sent"
  },
  {
    label: "Saved",
    value: "saved"
  },
  {
    label: "Viewed",
    value: "viewed"
  },
  {
    label: "Expired",
    value: "expired"
  }
];
