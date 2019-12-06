import requestWithToken from './requestWithToken'

function patchPayment(data) {
  return requestWithToken({
    url: '/api/v1/payments/onboarding',
    method: 'PATCH',
    data
  });
}

function fetchPayment(data) {
  return requestWithToken({
    url: '/api/v1/payments/onboarding',
    method: 'GET'
  });
}

function verify(data) {
  return requestWithToken({
    url: '/api/v1/payments/verify',
    method: 'POST',
    data
  });
}

function getPaymentById(id) {
  return requestWithToken({
    url: '/api/v1/payments/'+id,
    method: 'GET'
  })
}

function getAllPayments(filter) {
  console.log("filter", filter)
  let url = '/api/v1/payments?limit=0';
  if(filter && filter.checkoutId){
    url = '/api/v1/payments?limit=0&checkoutId='+filter.checkoutId;
  }else if(!!filter){
    url = `/api/v1/payments?limit=0${!!filter.startDate ? `&startDate=${filter.startDate}` : ""}${!!filter.endDate ? `&endDate=${filter.endDate}` : ""}${!!filter.text ? `&text=${filter.text}` : ""}`
  }
  return requestWithToken({
    url: url,
    method: 'GET',
    data: filter
  })
}

function getRefundById(id) {
  return requestWithToken({
    url: '/api/v1/refunds/'+id,
    method: 'GET'
  })
}

function getRefundByPaymentId(id) {
  return requestWithToken({
    url: '/api/v1/refunds/payments/'+id,
    method: 'GET'
  })
}

function getAllRefunds(filter) {
  return requestWithToken({
    url: '/api/v1/refunds?limit=0',
    method: 'GET',
    dada: filter
  })
}

function createRefund(data) {
  return requestWithToken({
    url: '/api/v1/refunds',
    method: 'POST',
    data
  });
}

function doCheckoutPayment(data) {
    return requestWithToken({
        url: '/api/v1/payments/invoice/charge',
        method: 'POST',
        data: data
    });
}

function chargeCardService(data) {
  return requestWithToken({
    url: '/api/v1/payments/invoice/charge',
    method: 'POST',
    data
  });
}

const PaymentService = {
    patchPayment,
    fetchPayment,
    verify,
    getAllPayments,
    getPaymentById,
    getAllRefunds,
    getRefundById,
    getRefundByPaymentId,
    createRefund,
    doCheckoutPayment,
    chargeCardService
}

export default PaymentService;