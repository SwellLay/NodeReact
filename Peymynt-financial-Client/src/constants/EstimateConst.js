import React, { Fragment } from "react";
import moment from "moment";
import history from "customHistory";
import DropdownWrapper from "global/DropdownWrapper";
import { toMoney } from "../utils/GlobalFunctions";
import { getCommonFormatedDate } from "../utils/common";

export const statusClass = (status) => {
  let className;
  switch (status) {
    case "expired" :
      className = 'badge-danger';
      break;
    case "saved" :
      className = "badge-secondary"
      break;
    case "sent" :
      className = "badge-success"
      break;
    default:
      className = "badge-warning e"
  }
  return className;
}

const statusRender = (cell, row, rowIndex, formatExtraData) => {
  return row.status === "expired" ? (
    <span className="badge badge-danger">{row.status}</span>
  ) : row.status === "saved" ? (
    <span className="badge badge-secondary">{row.status}</span>
  ) : row.status === "sent" ? (
    <span className="badge badge-success">{row.status}</span>
  ) : row.status === "viewed" ? (
    <span className="badge badge-warning">{row.status}</span>
  ) : (
            <span>{row.status}</span>
          );
};

const dateRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <a className="py-text--link" onClick={() => history.push(`/app/estimates/view/${row._id}`)}>
      {getCommonFormatedDate(row.estimateDate)}
    </a>
  );
};

const numberRender = (cell, row, rowIndex, formatExtraData) => {
  return <a  onClick={() => history.push(`/app/estimates/view/${row._id}`)}>{row.estimateNumber}</a>;
};

const customerRender = (cell, row, rowIndex, formatExtraData) => {
  {
    {
      row;
    }
  }
  return row.customer ? (
    <a onClick={() => history.push(`/app/estimates/view/${row._id}`)}>{row.customer.customerName}</a>
  ) : null;
};

const amountRender = (cell, row, rowIndex, formatExtraData) => {
  let buisinessInfo = JSON.parse(localStorage.getItem('reduxPersist:businessReducer')).selectedBusiness
  return (
    <Fragment>
      <a className="py-text--nowrap" onClick={() => history.push(`/app/estimates/view/${row._id}`)}>{`${
        row.currency.symbol
        }${toMoney(row.totalAmount ? row.totalAmount : 0)} ${
        row.businessId.currency.code !== row.currency.code
          ? row.currency.code
          : ""
        }`}
        {
          row.businessId.currency.code !== row.currency.code ?
            <Fragment>
              <span className="py-text--hint">
                {buisinessInfo.currency.symbol}{toMoney(
                  row.totalAmountInHomeCurrency
                )}  {buisinessInfo.currency.code}
              </span>
            </Fragment> :
            null
        }
      </a>
    </Fragment>
  );
};

const actionRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <Fragment>
      <DropdownWrapper row={row} index={rowIndex} />
    </Fragment>
  );
};

const noColumnRender = (cell, row, rowIndex, formatExtraData) => {
  console.log("in nocolumn", row)
  return (
    <div className="inner-alert">
      <div className="alert alert-primary" role="alert">
       <svg viewBox="0 0 20 20" className="py-icon" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
        You don't have any estimates. Why not <Link to="/app/estimates/add" className="accent">create an estimate</Link>?
        </div>
    </div>
  )
}

export const columnNull = [
  {
    dataField: "",
    text: "Status",
    formatter: noColumnRender,
    classes: 'py-table__cell',
    sort: false
  },
  {
    dataField: "estimateDate",
    text: "Date",
    formatter: null,
    classes: 'py-table__cell',
    sort: true
  },
  {
    dataField: "estimateNumber",
    text: "Number",
    formatter: null,
    classes: 'py-table__cell',
    sort: false
  },
  {
    dataField: "customer.customerName",
    text: "Customer",
    formatter: null,
    classes: 'py-table__cell',
    sort: false
  },
  {
    dataField: "totalAmount",
    text: "Amount",
    formatter: null,
    classes: 'py-table__cell-amount',
    sort: false,
  },
  {
    dataField: "",
    text: "",
    formatter: null,
    sort: false
  }
]

export const columns = [
  {
    dataField: "status",
    text: "Status",
    formatter: statusRender,
    classes: 'py-table__cell',
    sort: false
  },
  {
    dataField: "estimateDate",
    text: "Date",
    formatter: dateRender,
    classes: 'py-table__cell',
    sort: true
  },
  {
    dataField: "estimateNumber",
    text: "Number",
    formatter: numberRender,
    classes: 'py-table__cell',
    sort: false
  },
  {
    dataField: "customer.customerName",
    text: "Customer",
    formatter: customerRender,
    classes: 'py-table__cell',
    sort: false
  },
  {
    dataField: "totalAmount",
    text: "Amount",
    formatter: amountRender,
    classes: 'py-table__cell-amount',
    sort: false,
  },
  {
    dataField: "",
    text: "",
    formatter: actionRender,
    classes: 'py-table__cell__action',
    sort: false
  }
];

export const defaultSorted = [
  {
    dataField: "estimateDate",
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
