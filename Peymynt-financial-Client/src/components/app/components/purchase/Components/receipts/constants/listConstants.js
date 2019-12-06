import React, { Fragment } from 'react';
import { getCommonFormatedDate } from 'utils/common';
import { toMoney } from 'utils/GlobalFunctions';
import ReceiptsDropdown from '../components/ReceiptsDropdown';

export function getColumns(viewDetails, editDetails, deleteReceipt, businesses, moveReceipt) {
  return [
    {
      dataField: 'status',
      text: 'Status',
      formatter: statusRender,
      classes: 'py-table__cell',
      sort: false,
    },
    {
      dataField: 'receiptDate',
      text: 'Date',
      formatter: dateRender,
      classes: 'py-table__cell',
      sort: false,
      id: 'tooltip'
    },
    {
      dataField: 'merchant',
      classes: 'py-table__cell',
      text: 'Merchant',
      sort: false
    },
    {
      dataField: 'source',
      text: 'Source',
      classes: 'py-table__cell',
      sort: false,
    },
    {
      dataField: 'totalAmount',
      text: 'Total',
      formatter: totalRender,
      classes: 'py-table__cell-amount',
      sort: false
    },
    {
      dataField: 'action',
      text: 'Actions',
      classes: 'py-table__cell__actions',
      formatter: actionRender,
      formatExtraData: { viewDetails, editDetails, deleteReceipt, businesses, moveReceipt },
      sort: false
    }
  ];
}

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

function statusRender(cell, row) {
  if (row.status === "Processing") {
    return <span className="badge badge-warning">Processing</span>;
  }
  if (row.status === "Ready") {
    return <span className="badge badge-info">Ready</span>;
  }
  if (row.status === "Done") {
    return <span className="badge badge-success">Done</span>;
  }

  return <span className="badge badge-danger">{row.status}</span>;
}

export function dateRender(cell, row) {
  return (
    getCommonFormatedDate(row.receiptDate)
  );
}

function totalRender(cell, row) {
  return (
    <Fragment>
      {`${row.currency ? row.currency.symbol : ''}${toMoney(row.totalAmount ? row.totalAmount : 0)}`}
    </Fragment>
  );
}

function actionRender(cell, row, rowIndex, { viewDetails, editDetails, deleteReceipt, businesses, moveReceipt } = {}) {
  const onView = () => viewDetails(row);
  const onEdit = () => editDetails(row);
  const onDelete = () => deleteReceipt(row.id);
  const onMove = (businessId) => moveReceipt(row.id, businessId);

  return (
    <Fragment>
      <ReceiptsDropdown row={row} index={rowIndex} businesses={businesses} onView={onView} onEdit={onEdit}
        onDelete={onDelete} onMove={onMove}
      />
    </Fragment>
  );
}
