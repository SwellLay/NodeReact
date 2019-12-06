import React, { Fragment } from "react";
import moment from "moment";
import history from "customHistory";
import CheckoutDropdownWrapper from "global/CheckoutDropdownWrapper";
import { toMoney } from "../utils/GlobalFunctions";
import { getCommonFormatedDate } from "../utils/common";

const statusRender = (cell, row, rowIndex, formatExtraData) => {
  return row.status === "Offline" ? (
    <span className="badge badge-default">{renderCell(row._id, row.status , row.status)}</span>
  ) : row.status === "Draft" ? (
    <span className="badge badge-secondary">{renderCell(row._id, row.status , row.status)}</span>
  ) : row.status === "Online" ? (
    <span className="badge badge-success">{renderCell(row._id, row.status , row.status)}</span>
  ) : row.status === "Archived" ? (
    <span className="badge badge-warning">{renderCell(row._id, row.status , row.status)}</span>
  ) : (<span>{row.status}</span>);
};

const getLinkUrl = (_id, status) => {
    if(_id && status){
      if(status == 'Online' || status == 'Offline'){
        return '/app/sales/checkouts/share/'+_id
      } else if(status == 'Draft'){
        return '/app/sales/checkouts/edit/'+_id
      } else return '1';
    } else {
      return '2'
    }
}

const renderCell = (_id, status, val) => {
  return (
    (status == 'Archived')? <span>{val}</span> :
    <span  href="javascript:void(0)" onClick={() => history.push(getLinkUrl(_id, status))}>
      {val}
    </span>
  )
}

const titleRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    renderCell(row._id, row.status , row.itemName)
  );
};

const dateRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    renderCell(row._id, row.status, (row.createdAt)? getCommonFormatedDate(row.createdAt) : '')
  );
};

const amountRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <Fragment>
      {renderCell(row._id, row.status, `${(row.currency)? row.currency.symbol : ''}${toMoney(row.total ? row.total : 0)}`)}
    </Fragment>
  );
};

const actionRender = (cell, row, rowIndex, formatExtraData) => {
  return (
    <Fragment>
      <CheckoutDropdownWrapper onUpdate={onupdate} row={row} index={rowIndex} />
    </Fragment>
  );
};

export const columns = [
  {
    dataField: "status",
    text: "Status",
    formatter: statusRender,
    sort: false,
    classes: 'py-table__cell'
  },
  {
    dataField: "itemName",
    text: "Title",
    formatter: titleRender,
    sort: false,
    classes: 'py-table__cell'
  },
  {
    dataField: "createdAt",
    text: "Date created",
    formatter: dateRender,
    sort: true,
    colSpan: '3',
    classes: 'py-table__cell'
  },
  {
    dataField: "price",
    text: "Amount",
    formatter: amountRender,
    sort: false,
    classes: 'py-table__cell-amount'
  }
];

export const defaultSorted = [
  {
    dataField: "createdAt",
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
