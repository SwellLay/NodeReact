import requestWithToken from "./requestWithToken";

export function fetchBankAccounts(limit = 2) {
  return requestWithToken({
    url: `api/v1/dashboard/bank/accounts?limit=${limit}`,
    method: 'GET',
  })
}

export function fetchPayableInvoices(limit = 5) {
  return requestWithToken({
    url: `api/v1/dashboard/payable/invoices?limit=${limit}`,
    method: 'GET',
  })
}

export function fetchOwingBills(limit = 5) {
  return requestWithToken({
    url: `api/v1/dashboard/owing/bills?limit=${limit}`,
    method: 'GET',
  })
}

export function fetchNetIncome(limit) {
  return requestWithToken({
    url: `api/v1/dashboard/income?limit=${limit}`,
    method: 'GET',
  })
}

export function fetchOverdueInvoices(limit) {
  return requestWithToken({
    url: `api/v1/dashboard/overdue/invoices?limit=${limit}`,
    method: 'GET',
  })
}

export function fetchOverdueBills(limit) {
  return requestWithToken({
    url: `api/v1/dashboard/overdue/bills?limit=${limit}`,
    method: 'GET',
  })
}

export function fetchExpenseBreakdown(limit) {
  return requestWithToken({
    url: `api/v1/dashboard/expense/category?limit=${limit}`,
    method: 'GET',
  })
}

export function fetchCashFlow(limit = 12) {
  return requestWithToken({
    url: `api/v1/dashboard/cashflow?limit=${limit}`,
    method: 'GET',
  })
}

export function fetchProfitAndLoss(limit = 12) {
  return requestWithToken({
    url: `api/v1/dashboard/profit?limit=${limit}`,
    method: 'GET',
  })
}
