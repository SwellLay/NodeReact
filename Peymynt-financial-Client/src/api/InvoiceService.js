import {
  HTTP_DELETE,
  HTTP_GET,
  HTTP_PATCH,
  HTTP_POST,
  HTTP_PUT
} from "../components/app/components/Estimates/components/constant";
import request from "./request";
import requestWithToken from "./requestWithToken";
import requestWithBlob from "./requestWithBlob";

export const addInvoice = data => {
  return requestWithToken({
    url: "/api/v1/invoices",
    method: HTTP_POST,
    data
  });
};

export const sendMail = (invoiceId, data) => {
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}/mail`,
    method: HTTP_POST,
    data
  });
};

export const sendReminderMail = (invoiceId, data) => {
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}/reminder`,
    method: HTTP_POST,
    data
  });
};

export const getInvoices = queryString => {
  let url = `/api/v1/invoices`;
  if (queryString) {
    url += `?${queryString}`;
  }
  return requestWithToken({
    url,
    method: HTTP_GET
  });
};

export const getInvoice = invoiceId => {
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}`,
    method: HTTP_GET
  });
};

export const cloneInvoice = id => {
  return requestWithToken({
    url: `/api/v1/invoices/clone/` + id,
    method: HTTP_PUT
  });
};

export const updateInvoice = (invoiceId, data) => {
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}`,
    method: HTTP_PUT,
    data
  });
};

export const deleteInvoice = invoiceId => {
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}`,
    method: HTTP_DELETE
  });
};

export const sendInvoice = (id, data) => {
  return requestWithToken({
    url: `/api/v1/invoices/${id}`,
    method: HTTP_PATCH,
    data
  });
};

export const patchInvoice = (id, data) => {
  return requestWithToken({
    url: `/api/v1/invoices/${id}`,
    method: HTTP_PATCH,
    data
  });
};

export const getInvoicesCount = queryString => {
  let url = `/api/v1/invoices/count`;
  if (queryString) {
    url += `?${queryString}`;
  }
  return requestWithToken({
    url,
    method: HTTP_GET
  });
};

export const getInvoiceDashboardCount = () => {
  return requestWithToken({
    url: `/api/v1/invoices/dashboard/statusCount`,
    method: HTTP_GET
  });
};

export const getInvoiceNumber = () => {
  return requestWithToken({
    url: `/api/v1/invoices/createinvoicenumber`,
    method: HTTP_GET
  });
};

export const getInvoiceByUUID = uuid => {
  return request({
    url: `/api/v1/invoices/share/${uuid}`,
    method: HTTP_GET
  });
};

export const recordPayment = (invoiceId, data) => {
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}/payment`,
    method: HTTP_POST,
    data
  });
};

export const editPayment = (invoiceId, paymentId, data) => {
  console.log("data", data);
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}/payments/${paymentId}`,
    method: HTTP_PUT,
    data
  });
};

export const removePayment = (invoiceId, paymentId) => {
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}/payment/${paymentId}`,
    method: HTTP_DELETE
  });
};

export const sendReceiptMail = (invoiceId, paymentId, data) => {
  return requestWithToken({
    url: `/api/v1/invoices/${invoiceId}/receipt/${paymentId}`,
    method: HTTP_POST,
    data
  });
};

export const getBankAccounts = (data) => {
  return request({
    url: `/api/v1/payments/accounts/balance`,
    method: HTTP_POST,
    data
  });
};


export const getInvoicePayments = (id) => {
  return requestWithToken({
    url: `/api/v1/invoices/${id}/payments`,
    method: HTTP_GET
  })
};

export const downloadPdf = (uuid, from) => {
  return requestWithBlob({
    url: `/api/v1/${from}/share/${uuid}/export`,
    method: HTTP_GET
  })
};
