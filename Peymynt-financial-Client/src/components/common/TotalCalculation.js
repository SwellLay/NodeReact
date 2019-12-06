import * as PaymentIcon from 'global/PaymentIcon';
import { groupBy } from "lodash";
import React, { Component, Fragment } from 'react';
import { convertDateToYMD } from '../../utils/common';
import {  getAmountToDisplay, _paymentMethodDisplay, toMoney } from "../../utils/GlobalFunctions";
import { ACCOUNT } from '../app/components/invoice/components/InvoicePayment';

class TotalCalculation extends Component {
  render() {
    const { sign, data, payments, from } = this.props;
    const invoicePayments = payments && payments.length > 0 && payments || data.payments;
    let pMethods = groupBy(ACCOUNT, 'value');

    return (
        <div className="py-invoice-template__totals">
          <div className="py-space-blank">
          </div>
          <div className="py-invoice-template__totals-amounts">
            {
              data.amountBreakup.taxTotal.length > 0 &&  data.amountBreakup.taxTotal[0].rate > 0 ?
                <div className="py-invoice-template__row py-invoice-template__subtotal">
                  <div className="py-invoice-template__row-label"><strong className="py-text--strong">Subtotal:</strong></div>
                  <div className="py-invoice-template__row-amount"><span className="py-text py-text--body">{getAmountToDisplay(data.currency, data.amountBreakup.subTotal)}</span></div>
                </div>
                : ""
            }
            <TaxCalculation
              invoiceItems={data.amountBreakup.taxTotal}
              sign={sign}
            />

            {/* start :: spacer */}
            
            {/* end :: spacer */}

            <div className="py-invoice-template__row py-invoice-template__total">
              <div className="py-invoice-template__row-label"><strong className="py-text--strong">Total:</strong></div>
              <div className="py-invoice-template__row-amount"><span className="py-text py-text--body">{getAmountToDisplay(data.currency, data.totalAmount)}</span></div>
            </div>
            {/* <tr> */}
            {
              invoicePayments && invoicePayments.length > 0 ?
                invoicePayments.map((item, i) => {
                  return (
                    <div className="py-invoice-template__row py-invoice-template__history" key={`payment ${i}`}>
                      {
                        item.method === 'card'
                          ? <div className="py-invoice-template__row-label">Payment on {convertDateToYMD(item.paymentDate)} using <img src={process.env.WEB_URL.includes('localhost') ? `/${PaymentIcon[item.card.type]}` : `${PaymentIcon[item.card.type]}`} style={{ height: '24px', width: '38px', marginBottom: '5px' }} /> ending in {item.card.number}:</div>
                          : item.method === 'bank' ?
                            <div className="py-invoice-template__row-label">Payment on {convertDateToYMD(item.paymentDate)} using <img src={process.env.WEB_URL.includes('localhost') ? `/${PaymentIcon['bank']}` : `${PaymentIcon['bank']}`} style={{ height: '24px', width: '38px', marginBottom: '5px' }} /> ({item.bank && item.bank.name && item.bank.name.toLowerCase()} ••• {item.bank && item.bank.number && item.bank.number}):</div>
                            : <div className="py-invoice-template__row-label">Payment
                          on {convertDateToYMD(item.paymentDate)} {_paymentMethodDisplay(item.methodToDisplay)}:</div>
                      }
                      {/* <td className="py-invoice-template__row-label">Payment on {convertDateToYMD(item.paymentDate)} using  {pMethods[item.methodToDisplay] && pMethods[item.methodToDisplay][0] && pMethods[item.methodToDisplay][0].label}:</td> */}
                      <div className="py-invoice-template__row-amount">{`${getAmountToDisplay(sign, item.amount)}`}</div>
                    </div>
                    // <div className="py-invoice-template__row py-invoice-template__history" key={i}>
                    //     <div className="py-invoice-template__row-label">
                    //     <span>Payment on {convertDateToYMD(item.paymentDate)} using a {pMethods[item.methodToDisplay] && pMethods[item.methodToDisplay][0] && pMethods[item.methodToDisplay][0].label} :</span>
                    //     </div>
                    //     <div className="py-invoice-template__row-amount">
                    //     <span>{`${sign} ${toMoney(item.amount)}`}</span>
                    //     </div>
                    // </div>
                  )
                })
                : ""
            }
            {/* <RenderPaymentMethods invoiceData={data} sign={data.currency && data.currency.symbol} />
                        </tr> */}

            {/* spacer */}
            <div className="py-divider-thick">
            </div>

            {/* Amount due */}
            <div className="classic-template__totals__amounts__line">
              <div className="classic-template__totals__amounts__line__label">
                <strong className="py-text--strong">{`${from === 'estimate' ? 'Grand Total' : 'Amount Due'} (${data && data.currency ? data.currency.code : sign}):`} </strong>
              </div>
              <div className="classic-template__totals__amounts__line__amount word-break">
                <strong className="py-text--strong">{
                  data ? getAmountToDisplay(data.currency, from === 'estimate' ? data.totalAmount : data.dueAmount || data.totalAmount) : ''
                }</strong>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const TaxCalculation = props => {
  return props.invoiceItems.length > 0
    ? props.invoiceItems.map((tax, index) => {
      console.log('tax', tax);
      if (tax.rate > 0) {
        return (
          <Fragment key={"taxtotal" + index}>
            <div className="py-invoice-template__row py-invoice-template__taxes">
              <div className="py-invoice-template__row-label">
                <span>{typeof (tax.taxName) === 'object' ?
                  `${tax.taxName.abbreviation} ${tax.rate}%${tax.taxName.other.showTaxNumber ? `(${tax.taxName.taxNumber}):` : ':'}`
                  : `${tax.taxName} ${tax.rate}%`
                }</span>
                {"  "}
              </div>
              <div className="py-invoice-template__row-amount">
                <span>{`${getAmountToDisplay(props.sign, tax.amount)}`}</span>
              </div>
            </div>
            <div className="py-divider-thin">
            </div>
          </Fragment>
        );
      }
    })
    : "";
};

export default TotalCalculation;
