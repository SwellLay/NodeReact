
import getSymbolFromCurrency from 'currency-symbol-map';
import React, { Component, Fragment } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { EstimateBillToComponent, EstimateBreakup, EstimateInfoComponent, EstimateItems, EstimateSpan, RenderShippingAddress } from "./EstimateInvoiceComponent";
import { getAmountToDisplay } from '../../../../../utils/GlobalFunctions';
import { InvoiceTaxes } from '../../invoice/components/InvoicePreview';


class InvoicePrintComponent extends Component {
  render() {
    const { businessInfo, invoiceData, userSettings } = this.props;
    const currencySign = invoiceData.currency
    let preview = false;
    if (_.includes(window.location.pathname, '/estimates/view')) {
      preview = true
    }
    console.log("window", this.props)
    return (
      <div className="content" >
        <div className={preview ? "invoice-preview__body" : "invoice-preview__body"}>
          <div className="contemporary-template" style={{ minHeight: '1024px' }}>
            <div className="contemporary-template__header">
              <div className="contemporary-template__header__logo">
                <div className="heading-title"></div>
                {userSettings && userSettings.displayLogo && userSettings.companyLogo ? (
                  <div className="classic-template__header__logo invoiceLogo">
                    <img
                      src={userSettings.companyLogo}
                      alt=""
                    />
                  </div>
                ) : (
                    <div className="classic-template__header__logo" />
                  )}
              </div>
              <div className="contemporary-template__header__info">
                <div className="con-temp-header_title">
                  {invoiceData.name.toUpperCase()}
                </div>
                <div className="details__text text-muted">
                  {invoiceData.subheading || ""}
                </div>
                <div className="con-temp-header_subtitle">
                  <strong>{businessInfo && businessInfo.organizationName}</strong>
                </div>
                {
                  businessInfo && businessInfo.address && (
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
                  )
                }
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
            {/* <div className="contemporary-template__divider--full-width">
              <div className="py-divider" />
            </div> */}
            <hr/>
            <div className="contemporary-template__metadata">
              <Fragment>
                <div className="contemporary-template__metadata__customer">
                  <EstimateBillToComponent estimateKeys={invoiceData.customer} />
                </div>
                {invoiceData && invoiceData.customer && invoiceData.customer.addressShipping && (<div className="contemporary-template__metadata__customer">
                  <RenderShippingAddress addressShipping={invoiceData.customer.addressShipping} />
                </div>)}
                <EstimateInfoComponent estimateKeys={invoiceData} sign={currencySign} />
              </Fragment>
            </div>
            <EstimateItems estimateItems={invoiceData.items} sign={currencySign} userSettings={userSettings} />
            {/* <div className="template-divider-bold" /> */}
            {/* <EstimateBreakup estimateInfo={invoiceData} sign={currencySign} /> */}
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
                {/* <RenderPaymentMethods invoiceData={invoiceData} sign={invoiceData && invoiceData.currency && invoiceData.currency.symbol} payments={payments} /> */}
                <div className="template-divider-bold template-divider-small-margin" />
                <div className="py-invoice-template__row py-invoice-template__history">
                  <div className="py-invoice-template__row-label text-right">
                    <span className="text-strong">
                      <strong>{`Amount Due (${
                        invoiceData && invoiceData.currency
                          ? invoiceData.currency.code
                          : ""
                        }):`}</strong>
                    </span>
                  </div>
                  <div className="py-invoice-template__row-amount text-strong">
                    <span>{
                      invoiceData ? getAmountToDisplay(invoiceData.currency, invoiceData.dueAmount) : ''
                    }</span>
                  </div>
                </div>
              </div>
            </section>
            {invoiceData.memo && <div className="template-memo matchPd">
              <div>
                <span style={{ 'fontWeight': 'bold' }} className="text-strong">Notes</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: invoiceData.memo }} />
            </div>}
            <div className="contemporary-template__footer">
              <span className="text-fine-print">{invoiceData.footer}</span>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default InvoicePrintComponent