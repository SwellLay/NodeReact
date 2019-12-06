import requestWithToken from "./requestWithToken";
import {
  HTTP_POST,
  HTTP_GET,
  HTTP_PUT,
  HTTP_DELETE,
  HTTP_PATCH
} from "../components/app/components/Estimates/components/constant";

export const addRecurringInvoice = data => {
  return requestWithToken({
    url: "/api/v1/recurring",
    method: HTTP_POST,
    data
  });
};

export const sendRecurringMail = (invoiceId, data) => {
  return requestWithToken({
    url: `/api/v1/recurring/mail/${invoiceId}`,
    method: HTTP_POST,
    data
  });
};

export const sendRecurringReminderMail = (invoiceId, data) => {
  return requestWithToken({
    url: `/api/v1/recurring/${invoiceId}/reminder`,
    method: HTTP_POST,
    data
  });
};

export const getRecurringInvoices = queryString => {
  let url = `/api/v1/recurring`;
  if (queryString) {
    url += `?${queryString}`;
  }
  return requestWithToken({
    url,
    method: HTTP_GET
  });
};

export const getRecurringInvoice = invoiceId => {
  return requestWithToken({
    url: `/api/v1/recurring/${invoiceId}`,
    method: HTTP_GET
  });
};

export const cloneRecurringInvoice = id => {
  return requestWithToken({
    url: `/api/v1/recurring/clone/` + id,
    method: HTTP_PUT
  });
};

export const updateRecurringInvoice = (invoiceId, data) => {
  return requestWithToken({
    url: `/api/v1/recurring/${invoiceId}`,
    method: HTTP_PUT,
    data
  });
};

export const deleteRecurringInvoice = invoiceId => {
  return requestWithToken({
    url: `/api/v1/recurring/${invoiceId}`,
    method: HTTP_DELETE
  });
};

export const sendRecurringInvoice = (id, data) => {
  return requestWithToken({
    url: `/api/v1/recurring/${id}`,
    method: HTTP_PATCH,
    data
  });
};

export const getRecurringInvoicesCount = queryString => {
  let url = `/api/v1/recurring/count`;
  if (queryString) {
    url += `?${queryString}`;
  }
  return requestWithToken({
    url,
    method: HTTP_GET
  });
};

export const getRecurringInvoiceDashboardCount = () => {
  return requestWithToken({
    url: `/api/v1/recurring/dashboard/statusCount`,
    method: HTTP_GET
  });
};

export const getRecurringInvoiceNumber = () => {
  return requestWithToken({
    url: `/api/v1/recurring/createinvoicenumber`,
    method: HTTP_GET
  });
};

export const getRecurringInvoiceByUUID = uuid => {
  return requestWithToken({
    url: `/api/v1/recurring/share/${uuid}`,
    method: HTTP_GET
  });
};

export const recordRecurringPayment = (invoiceId, data) => {
  return requestWithToken({
    url: `/api/v1/recurring/${invoiceId}/payment`,
    method: HTTP_POST,
    data
  });
};

export const editRecurringPayment = (invoiceId, paymentId, data) => {
  return requestWithToken({
    url: `/api/v1/recurring/${invoiceId}/editPayment/${paymentId}`,
    method: HTTP_PUT,
    data
  });
};

export const removeRecurringPayment = (invoiceId, paymentId) => {
  return requestWithToken({
    url: `/api/v1/recurring/${invoiceId}/payment/${paymentId}`,
    method: HTTP_DELETE
  });
};

export const sendRecurringReceiptMail = (invoiceId, paymentId, data) => {
  return requestWithToken({
    url: `/api/v1/recurring/${invoiceId}/receipt/${paymentId}`,
    method: HTTP_POST,
    data
  });
};
