import * as PaymentIcon from 'global/PaymentIcon';
import { groupBy } from "lodash";
import React, { Component, Fragment } from "react";
import { convertDateToYMD, getCommonFormatedDate } from "../../../../../utils/common";
import { getAmountToDisplay, _paymentMethodDisplay, toMoney } from "../../../../../utils/GlobalFunctions";
import { EstimateBillToComponent, RenderShippingAddress } from "../../Estimates/components/EstimateInvoiceComponent";
import { ACCOUNT } from "./InvoicePayment";
import invoice from '..';

class InvoicePreview extends Component {


  render() {
    const { invoiceData, userSettings, payments, showPayment } = this.props;
    const businessInfo = typeof invoiceData.businessId === 'object' ? invoiceData.businessId : this.props.businessInfo;
    const sign = invoiceData.currency ? invoiceData.currency.symbol : "";
    let ship = invoiceData.customer && invoiceData.customer.addressShipping;
    console.log("invoiceData", invoiceData)
    return (
      <div className="invoice-preview__body">
        <div className="contemporary-template">
          <div className="contemporary-template__header">
            {userSettings && !!userSettings.companyLogo ?
              <div className="contemporary-template__header__logo invoiceLogo">
                <img src={userSettings.companyLogo || ''}
                  content-height="100%"
                  scaling="uniform"
                />
              </div>
              : <div className="contemporary-template__header__logo">
                <img src={''}
                  content-height="100%"
                  scaling="uniform"
                />
              </div>
            }
            <div className="contemporary-template__header__info">
              <div className="con-temp-header_title">
                {invoiceData.title ? invoiceData.title.toUpperCase() : invoiceData.name ? invoiceData.name.toUpperCase() : ""}
                {/* {invoiceData.invoiceNumber && invoiceData.invoiceNumber > 0 ? ` #${invoiceData.invoiceNumber}` : ""} */}
              </div>
              <div className="details__text">
                {invoiceData.subTitle || invoiceData.subheading}
              </div>
              <div className="con-temp-header_subtitle">
                <strong>{businessInfo && businessInfo.organizationName}</strong>
              </div>
              {businessInfo && businessInfo.address && (
                <div className="con-temp-address">
                  <div className="address__field">
                    {businessInfo.address.addressLine1}
                  </div>
                  <div className="address__field">
                    {!!businessInfo.address.city ? `${businessInfo.address.city},` : ""} {businessInfo.address.state && businessInfo.address.state.name} {businessInfo.address.postal}
                  </div>
                  <div className="address__field">{businessInfo.address.country && businessInfo.address.country.name}</div>
                  <div className="address__field" />
                </div>
              )}
              <br />
              {businessInfo && businessInfo.communication && (
                <div className="con-temp-address">
                  {businessInfo.communication.phone && (<div className="address__field"> Phone: {businessInfo.communication.phone}</div>)}
                  {businessInfo.communication.fax && (<div className="address__field">Fax: {businessInfo.communication.fax}</div>)}
                  {businessInfo.communication.mobile && (<div className="address__field"> Mobile: {businessInfo.communication.mobile}</div>)}
                  {businessInfo.communication.tollFree && (<div className="address__field">
                    {" "}
                    Toll free: {businessInfo.communication.tollFree}
                  </div>)}
                  {businessInfo.communication.website && (<div className="address__field">{businessInfo.communication.website}</div>)}
                </div>
              )}
            </div>
          </div>
          <hr />
          <div className="contemporary-template__metadata">
            <Fragment>
              <div className="contemporary-template__metadata__customer">
                <EstimateBillToComponent estimateKeys={invoiceData.customer} />
              </div>
              {invoiceData && invoiceData.customer && invoiceData.customer.addressShipping && (<div className="contemporary-template__metadata__customer">
                <RenderShippingAddress addressShipping={invoiceData.customer.addressShipping} />
              </div>)}
              <InvoiceInfoComponent estimateKeys={invoiceData} sign={invoiceData && invoiceData.currency && invoiceData.currency.symbol} showPayment={showPayment} from="contemporary"/>
            </Fragment>

          </div>
          <InvoiceItems invoiceInfo={invoiceData} invoiceItems={invoiceData.items} sign={sign} userSettings={userSettings} />
          <br />
          <section className="contemporary-template__totals">
            <div className="contemporary-template__totals-blank" />
            <div className="contemporary-template__totals-amounts">
              {
                invoiceData.amountBreakup.taxTotal.length > 0 ?
                (<Fragment>
                    <div className="py-invoice-template__row py-invoice-template__history">
                      <div className="py-invoice-template__row-label text-right">
                        <strong>Subtotal:</strong>
                      </div>
                      <div className="py-invoice-template__row-amount">
                        <span>{getAmountToDisplay(invoiceData.currency, invoiceData.amountBreakup.subTotal)}</span>
                      </div>
                    </div>
                    <InvoiceTaxes
                      invoiceItems={invoiceData.amountBreakup.taxTotal}
                      sign={sign}
                    />
                    <div className="template-divider template-divider-small-margin" />
                  </Fragment>) : ""
              }
              <div className="py-invoice-template__row py-invoice-template__history total-amount">
                <div className="py-invoice-template__row-label text-right">
                  <strong>Total:</strong>
                </div>
                <div className="py-invoice-template__row-amount">
                  <span>{getAmountToDisplay(invoiceData.currency, invoiceData.amountBreakup.total)}</span>
                </div>
              </div>
              {
                showPayment && (
                  <RenderPaymentMethods invoiceData={invoiceData} sign={invoiceData && invoiceData.currency && invoiceData.currency.symbol} payments={payments} />
                )
              }
              <div className="template-divider-bold template-divider-small-margin" />
              <div className="py-invoice-template__row py-invoice-template__history">
                <div className="py-invoice-template__row-label text-right">
                  <span className="text-strong">
                    <strong>{showPayment ? `Amount Due (${
                      invoiceData && invoiceData.currency
                        ? invoiceData.currency.code
                        : ""
                      }):` : `Grand Total (${
                        invoiceData && invoiceData.currency
                          ? invoiceData.currency.code
                          : ""
                        }):`}</strong>
                  </span>
                </div>
                <div className="py-invoice-template__row-amount text-strong">
                  <span>{
                    invoiceData ? getAmountToDisplay(invoiceData.currency, showPayment ? invoiceData.dueAmount :invoiceData.totalAmount) : ''
                  }</span>
                </div>
              </div>
            </div>
          </section>
          {invoiceData.notes ? (
            <div className="notes">
              <strong>
                Notes
              </strong><br />
              <div className="word-break" dangerouslySetInnerHTML={{ __html: invoiceData.notes }} />
            </div>
          ): invoiceData.memo && (
            <div className="notes">
              <strong>
                Notes
              </strong><br />
              <div className="word-break" dangerouslySetInnerHTML={{ __html: invoiceData.memo }} />
            </div>
          )}
          <div className="text-center contemporary-template__footer word-break">{invoiceData.footer}</div>
        </div>
      </div>
    );
  }
}

export const InvoiceInfoComponent = props => {
  const { estimateKeys, sign, showPayment } = props;
  let someFormattedDate = '';
  if (estimateKeys) {
    let date = estimateKeys.invoiceDate;
    let key = '';
    if (estimateKeys.notifyStatus && estimateKeys.notifyStatus.key != "On" && estimateKeys.notifyStatus.key != "on") {
      key = estimateKeys.notifyStatus.key;
      let new_date = new Date(date);
      new_date.setDate(new_date.getDate() + parseInt(key));
      let dd = new_date.getDate();
      let mm = new_date.getMonth() + 1;
      let y = new_date.getFullYear();
      someFormattedDate = mm + '/' + dd + '/' + y;
    } else {
      someFormattedDate = estimateKeys.invoiceDate;
    }
  }

  console.log("estimateKeys", estimateKeys)

  return (
    <div className="invoice-template-details">
      <table className="table py-table--plain">
        <tbody>
          <tr>
            <td>
              <strong className="text-strong">{estimateKeys.invoiceNumber ? 'Invoice' : "Estimate"} Number:</strong>
            </td>
            <td>
              {estimateKeys && estimateKeys.isRecurring ? 'Auto-generated' :
                <span>{estimateKeys ? estimateKeys.invoiceNumber ? estimateKeys.invoiceNumber : estimateKeys.estimateNumber : 0}</span>}
            </td>
          </tr>
          {/* <tr>
            <td>
              <strong className="text-strong">P.O./S.O. Number :</strong>
            </td>
            <td>
              <span>{estimateKeys ? estimateKeys.invoiceNumber : 0}</span>
            </td>
          </tr> */}
          {estimateKeys && estimateKeys.purchaseOrder && (
            <tr>
              <td>
                <strong className="text-strong">P.O./S.O. Number:</strong>
              </td>
              <td>
                <span>{estimateKeys ? estimateKeys.purchaseOrder : 0}</span>
              </td>
            </tr>
          )}
          <tr>
            <td>
              <strong className="text-strong">{showPayment ? 'Invoice' : 'Estimate'} Date:</strong>
            </td>
            <td>
              {
                estimateKeys && !estimateKeys.invoiceDate && !estimateKeys.estimateDate ? 'Auto-generated'
                  : <span>
                    {convertDateToYMD(estimateKeys.invoiceDate || estimateKeys.estimateDate)}
                  </span>
              }
            </td>
          </tr>
          <tr>
            <td>
              <strong className="text-strong">{showPayment ? 'Payment Due' : 'Expires On'}:</strong>
            </td>
            <td>
              {
                estimateKeys && !estimateKeys.dueDate && !estimateKeys.expiryDate ? 'Auto-generated'
                  : <span>
                    {/*{estimateKeys && someFormattedDate ? convertDateToYMD(someFormattedDate) : "Nil"}*/}
                    {/*estimateKeys ? convertDateToYMD(estimateKeys.dueDate) : "Nil"*/}
                    {convertDateToYMD(estimateKeys.dueDate || estimateKeys.expiryDate)}
                  </span>
              }
            </td>
          </tr>
          {
            props.from !== 'modern' && (
              <tr>
                <td className="table-cell-first">
                  <span className="text-strong">
                    <strong>{showPayment ? `Amount Due (${
                      estimateKeys && estimateKeys.currency
                        ? estimateKeys.currency.code
                        : ""
                      }):` : `Grand Total (${
                        estimateKeys && estimateKeys.currency
                          ? estimateKeys.currency.code
                          : ""
                        }):`}</strong>
                  </span>
                </td>
                <td className="table-cell-second">
                  <span className="text-strong">
                    {
                      estimateKeys ? getAmountToDisplay(estimateKeys.currency, showPayment ? estimateKeys.dueAmount :estimateKeys.totalAmount) : ''
                    }
                  </span>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  );
};

const RenderInvoiceItems = props => {
  const { sign, invoiceItems, invoiceInfo } = props;
  const { itemHeading } = invoiceInfo;
  return (
    <tbody>
      {invoiceItems.length > 0 ? invoiceItems.map((item, key) => {
        return (
          <tr key={key} className="bodr_btm" >
            <td width="400">
              {!itemHeading.hideItem && <span className="text-strong">{item.column1 || item.name}</span>}
              {!itemHeading.hideDescription && <p className="invoice-product-description">{item.column2 || item.description}</p>}
            </td>
            {!itemHeading.hideQuantity && <td width="200">
              <span>{item.column3 || item.quantity}</span>
            </td>}
            {!itemHeading.hidePrice && <td width="200">
              <span>{getAmountToDisplay(invoiceInfo.currency, item.column4 || item.price)}</span>
            </td>}
            {!itemHeading.hideAmount &&
              <td width="200">
                <span>{getAmountToDisplay(invoiceInfo.currency, (item.column3 || item.quantity) * (item.column4 || item.price))}</span>
              </td>}
          </tr>
        );
      }) : (<tr className="bodr_btm">
        <td colSpan="7" className="text-center">You have not added any items.</td>
      </tr>)}
    </tbody>
  );
};

const InvoiceItemsHeader = (props) => {
  const { itemHeading } = props.invoiceInfo;
  const borderColour = props.userSettings ? props.userSettings.accentColour : "#000";
  return (
    <thead>
      <tr>
        <th style={{ backgroundColor: `${borderColour}` }} width="400">{itemHeading.column1.name}</th>
        {!itemHeading.hideQuantity && <th style={{ backgroundColor: borderColour }} width="200">{itemHeading.column2.name}</th>}
        {!itemHeading.hidePrice && <th style={{ backgroundColor: borderColour }} width="200">{itemHeading.column3.name}</th>}
        {!itemHeading.hideAmount && <th style={{ backgroundColor: borderColour }} width="100">{itemHeading.column4.name}</th>}
      </tr>
    </thead>
  );
};

export const InvoiceItems = props => {
  return (
    <div className="contemporary-template__items">
      <table className="table">
        <InvoiceItemsHeader
          invoiceInfo={props.invoiceInfo}
          userSettings={props.userSettings}
        />
        <RenderInvoiceItems
          invoiceInfo={props.invoiceInfo}
          invoiceItems={props.invoiceItems}
          sign={props.sign}
        />
      </table>
    </div>
  );
};

export const RenderPaymentMethods = ({ invoiceData, sign, payments }) => {
  console.log('payments', payments);
  let pMethods = groupBy(ACCOUNT, 'value');
  return (
    payments && payments.length > 0 ?
      payments.map((item, i) => {
        return (
          <div className="py-invoice-template__row py-invoice-template__history" key={i}>
            <div className="py-invoice-template__row-label">
              {
                item.method === 'card' ?
                  <span>Payment on {convertDateToYMD(item.paymentDate)} using <img src={process.env.WEB_URL.includes('localhost') ? `/${PaymentIcon[item.card.type]}` : `${PaymentIcon[item.card.type]}`} style={{ height: '24px', width: '38px', marginBottom: '5px' }} /> ending in {item.card.number}:</span>
                  : item.method === 'bank' ?
                    <span>Payment on {convertDateToYMD(item.paymentDate)} using <img src={process.env.WEB_URL.includes('localhost') ? `/${PaymentIcon['bank']}` : `${PaymentIcon['bank']}`} style={{ height: '24px', width: '38px', marginBottom: '5px' }} /> ({item.bank && item.bank.name && item.bank.name.toLowerCase()} ••• {item.bank && item.bank.number && item.bank.number}):</span>
                    :
                    <span>Payment on {convertDateToYMD(item.paymentDate)} {_paymentMethodDisplay(item.methodToDisplay)}:</span>
              }

            </div>
            <div className="py-invoice-template__row-amount">
              <span>{item.type === 'refund' ? `(${getAmountToDisplay(invoiceData.currency, invoiceData.amount)})` : `${getAmountToDisplay(invoiceData.currency, item.amount)}`}</span>
            </div>
          </div>
        )
      })
      : ""
  )
};

export const InvoiceTaxes = props => {
  return props.invoiceItems.length > 0
    ? props.invoiceItems.map((tax, index) => {
      return (
        <Fragment key={"taxtotal" + index}>
          <div className="py-invoice-template__row py-invoice-template__history">
            <div className="py-invoice-template__row-label text-right">
              <span>
                {typeof (tax.taxName) === 'object' ?
                  `${tax.taxName.abbreviation}${tax.taxName.other.showTaxNumber ? ` (${tax.taxName.taxNumber}):` : ':'}`
                  : ` ${tax.taxName}:`
                }
              </span>
              {"  "}
            </div>
            <div className="py-invoice-template__row-amount">
              <span>{`${props.sign} ${toMoney(tax.amount)}`}</span>
            </div>
          </div>
        </Fragment>
      );
    })
    : "";
};

export default InvoicePreview;
