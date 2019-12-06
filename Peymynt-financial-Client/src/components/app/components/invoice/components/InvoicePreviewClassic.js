import React, { Component, Fragment } from "react";
import { convertDateToYMD } from "../../../../../utils/common";
import { InvoiceInfoComponent, RenderPaymentMethods } from "./InvoicePreview";
import { RenderShippingAddress, EstimateBillToComponent } from "../../Estimates/components/EstimateInvoiceComponent";
import { toMoney, getAmountToDisplay } from "../../../../../utils/GlobalFunctions";

class InvoicePreviewClassic extends Component {
  leftSvg;
  render() {
    const { invoiceData, userSettings, payments, showPayment } = this.props;
    const borderColor = userSettings.accentColour;
    const businessInfo = typeof invoiceData.businessId === 'object' ? invoiceData.businessId : this.props.businessInfo;
    let country =
      businessInfo.address && businessInfo.address.country
        ? businessInfo.address.country.name
        : "";
    let ship = invoiceData.customer && invoiceData.customer.addressShipping;
    let state =
      businessInfo.address && businessInfo.address.state
        ? businessInfo.address.state.name
        : "";
    const sign = invoiceData.currency ? invoiceData.currency.symbol : "";
    console.log("businessInfo", invoiceData)
    return (
      <Fragment>
        <div className="invoice-preview__body">
          <div
            className="classic-template"
            style={{ border: `10px solid ${borderColor}` }}
          >
            <section className="classic-template__header">
              {userSettings && userSettings.companyLogo ? (
                <div className="classic-template__header__logo invoiceLogo">
                  <img
                    src={userSettings.companyLogo}
                  />
                </div>
              ) : (
                  <div className="classic-template__header__logo" />
                )}

              <div className="classic-template__header__info">
                <strong className="py-text--strong">
                  {businessInfo.organizationName}
                </strong>
                <div className="address">
                  {/* <div className="address__field" />
                  <div className="address__field" />
                  <div className="address__field" />
                  <div className="address__field" /> */}
                  <div className="address__field">
                    <span className="py-text py-text--body">
                      {businessInfo.address &&
                        businessInfo.address.addressLine1}
                    </span>
                  </div>
                  <div className="address__field">
                    <span className="py-text py-text--body">
                      {businessInfo.address &&
                        businessInfo.address.addressLine2}
                    </span>
                  </div>
                  <div className="address__field" />
                  <div className="address__field">
                    {`${businessInfo.address && !!businessInfo.address.city ? `${businessInfo.address.city},` : ""}`}{" "}
                    {businessInfo.address &&
                      businessInfo.address.state &&
                      businessInfo.address.state.name}{" "}
                    {businessInfo.address && businessInfo.address.postal}
                  </div>
                </div>
                {/* <br /> */}
                <div className="address">
                  {/* <div className="address__field" />
                  <div className="address__field" />
                  <div className="address__field" />
                  <div className="address__field" /> */}
                  <div className="address__field">
                    <span className="py-text py-text--body"> {country} </span>
                  </div>
                </div>
                <br />
                {businessInfo.communication && (
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
            </section>
            <div className="classic-template__separator">
              <div className="classic-template__separator__header">
                <div
                  className="classic-template__separator__header__right_divider"
                  style={{ borderColor: `${borderColor}`}}
                >
                  </div>
                <div className="classic-template__separator__header__frame">

                  <svg height="72" viewBox="0 0 28 72" width="28" ref={r => (this.leftSvg = r)}>
                    <g fill="none" stroke={`${borderColor}`} strokeWidth="2">
                      <path d="M183 57.038v-42.076c-.33.025-.664.038-1 .038-7.18 0-13-5.82-13-13 0-.336.013-.67.038-1h-154.076c.025.33.038.664.038 1 0 7.18-5.82 13-13 13-.336 0-.67-.013-1-.038v42.076c.33-.025.664-.038 1-.038 7.18 0 13 5.82 13 13 0 .336-.013.67-.038 1h154.076c-.025-.33-.038-.664-.038-1 0-7.18 5.82-13 13-13 .336 0 .67.013 1 .038z" />
                      <path d="M177 51.503v-31.007c-.33.024-.664.037-1 .037-7.18 0-13-5.626-13-12.567 0-.325.013-.648.038-.967h-142.076c.025.319.038.641.038.967 0 6.94-5.82 12.567-13 12.567-.336 0-.67-.012-1-.037v31.007c.33-.024.664-.037 1-.037 7.18 0 13 5.626 13 12.567 0 .325-.013.648-.038.967h142.076c-.025-.319-.038-.641-.038-.967 0-6.94 5.82-12.567 13-12.567.336 0 .67.012 1 .037z" />
                    </g>
                  </svg>
                  <div
                    className="classic-template__separator__header__frame__text"
                    style={{ borderColor: `${borderColor}`, borderTopColor: `${borderColor}` }}
                  >
                    <div
                      className="py-heading--title"
                      style={{ color: `${borderColor}` }}
                    >
                      {invoiceData.title ? invoiceData.title.toUpperCase() : invoiceData.name ? invoiceData.name.toUpperCase() : ""}
                    </div>
                  </div>

                  <svg height="72" viewBox="0 0 28 72" width="28">
                    <g fill="none" stroke={`${borderColor}`} strokeWidth="2">
                      <path d="M27 57.038v-42.076c-.33.025-.664.038-1 .038-7.18 0-13-5.82-13-13 0-.336.013-.67.038-1h-154.076c.025.33.038.664.038 1 0 7.18-5.82 13-13 13-.336 0-.67-.013-1-.038v42.076c.33-.025.664-.038 1-.038 7.18 0 13 5.82 13 13 0 .336-.013.67-.038 1h154.076c-.025-.33-.038-.664-.038-1 0-7.18 5.82-13 13-13 .336 0 .67.013 1 .038z" />
                      <path d="M21 51.503v-31.007c-.33.024-.664.037-1 .037-7.18 0-13-5.626-13-12.567 0-.325.013-.648.038-.967h-142.076c.025.319.038.641.038.967 0 6.94-5.82 12.567-13 12.567-.336 0-.67-.012-1-.037v31.007c.33-.024.664-.037 1-.037 7.18 0 13 5.626 13 12.567 0 .325-.013.648-.038.967h142.076c-.025-.319-.038-.641-.038-.967 0-6.94 5.82-12.567 13-12.567.336 0 .67.012 1 .037z" />
                    </g>
                  </svg>

                  {/* <img src={this.leftSvg} /> */}
                </div>
                <div
                  className="classic-template__separator__header__right_divider"
                  style={{ borderColor: `${borderColor}` }}
                >
                  </div>
              </div>
              <div className="classic-template__separator__subheader">
                <div className="py-heading--subtitle">{invoiceData.subTitle || invoiceData.subheading}</div>
              </div>
            </div>
            <section className="classic-template__metadata">
              <EstimateBillToComponent estimateKeys={invoiceData.customer} />
              <RenderShippingAddress addressShipping={invoiceData.customer && invoiceData.customer.addressShipping} />
              <InvoiceInfoComponent estimateKeys={invoiceData} sign={invoiceData && invoiceData.currency && invoiceData.currency.symbol} showPayment={showPayment} from="classic"/>
            </section>
            <div className="classic-template__items mrT25">
              <table className="py-table">
                <thead className="py-table__header">
                  <tr className="py-table__row">
                    <th colSpan="4" className="py-table__cell">
                      {invoiceData.itemHeading.column1.name}
                    </th>
                    {!invoiceData.itemHeading.hideQuantity && (
                      <th colSpan="1" className="py-table__cell-amount text-center classic-template__items__column--center py-text--strong">
                        {invoiceData.itemHeading.column2.name}
                      </th>
                    )}
                    {!invoiceData.itemHeading.hidePrice && (
                      <th colSpan="1" className="py-table__cell">
                        {invoiceData.itemHeading.column3.name}
                      </th>
                    )}
                    {!invoiceData.itemHeading.hideAmount && (
                      <th colSpan="1" className="py-table__cell-amount">
                        {invoiceData.itemHeading.column4.name}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="py-table__body">
                  {invoiceData.items.length > 0 ? invoiceData.items.map((item, key) => {
                    return (
                      <tr className="py-table__row" key={key}>
                        <td colSpan="4" className="py-table__cell">
                          {!invoiceData.itemHeading.hideItem && (
                            <span className="text-strong">{item.column1 || item.name}</span>
                          )}
                          {!invoiceData.itemHeading.hideDescription && (
                            <p className="">
                              {item.column2 || item.description}
                            </p>
                          )}
                        </td>
                        {!invoiceData.itemHeading.hideQuantity && (
                          <td colSpan="1" className="py-table__cell text-center py-table__cell-amount">{item.column3 || item.quantity}</td>
                        )}
                        {!invoiceData.itemHeading.hidePrice && (
                          <td colSpan="1" className="py-table__cell py-table__cell-amount">{`${sign}${toMoney(item.column4 || item.price)}`}</td>
                        )}
                        {!invoiceData.itemHeading.hideAmount && (
                          <td colSpan="1" className="py-table__cell py-table__cell-amount">{`${sign}${toMoney((item.column3 || item.quantity) * (item.column4 || item.price))}`}</td>
                        )}
                      </tr>
                    );
                  }) : (<tr className="py-table__row">
                    <td colSpan="7" className="py-table__cell text-center py-table__cell-amount">You have not added any items.</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            <section className="py-invoice-template__totals">
              <div className="py-space-blank" />
              <div className="py-invoice-template__totals-amounts">
                <span className="classic-template__totals__taxes">
                  <div className="invoice-template-taxes">
                    {
                      invoiceData.amountBreakup.taxTotal.length > 0 ?
                      (
                        <Fragment>
                          <div className="py-invoice-template__row py-invoice-template__taxes">
                            <div className="py-invoice-template__row-label">
                              <strong className="py-text--strong">Subtotal:</strong>
                            </div>
                            <div className="py-invoice-template__row-amount">
                              <span className="py-text py-text--body mr0">
                                {" "}
                                {getAmountToDisplay(invoiceData.currency, invoiceData.amountBreakup.subTotal)}
                              </span>
                            </div>
                          </div>
                          <InvoiceTaxes
                            invoiceItems={invoiceData.amountBreakup.taxTotal}
                            sign={sign}
                          />
                          <div className="invoice-template-taxes__divider--small-margin">
                            <div className="py-divider" />
                          </div>
                        </Fragment>
                      ) : ""
                    }
                  </div>
                </span>
                <div className="classic-template__totals__amounts__line">
                  <div className="classic-template__totals__amounts__line__label">
                    <strong className="py-text--strong">Total:</strong>
                  </div>
                  <div className="classic-template__totals__amounts__line__amount">
                    <span className="py-text py-text--body">
                      {getAmountToDisplay(invoiceData.currency, invoiceData.totalAmount)}
                    </span>
                  </div>
                </div>
                {
                  showPayment && (
                    <RenderPaymentMethods invoiceData={invoiceData} sign={invoiceData.currency && invoiceData.currency.symbol} payments={payments} />
                  )
                }
                <hr className="classic-template__hr-double" />

                <div className="classic-template__totals__amounts__line">
                  <div className="classic-template__totals__amounts__line__label">
                    <strong className="py-text--strong">
                      {
                        showPayment ? `Amount Due (
                          ${businessInfo.currency && businessInfo.currency.code}):`:
                          `Grand Total (
                            ${businessInfo.currency && businessInfo.currency.code}):`
                      }
                    </strong>
                  </div>
                  <div className="classic-template__totals__amounts__line__amount word-break">
                    <strong className="py-text--strong">
                      {invoiceData ? getAmountToDisplay(invoiceData.currency, showPayment ? invoiceData.dueAmount : invoiceData.totalAmount) : ''}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {invoiceData.notes ? (
              <div className="py-invoice-template__memo">
                <div className="py-text py-text--small">
                  <strong className="py-text--strong">Notes</strong>
                </div>
                <div className="py-text py-text--small word-break" dangerouslySetInnerHTML={{ __html: invoiceData.notes }} />
              </div>
            ) : invoiceData.memo && (
              <div className="py-invoice-template__memo">
                <div className="py-text py-text--small">
                  <strong className="py-text--strong">Notes</strong>
                </div>
                <div className="py-text py-text--small word-break" dangerouslySetInnerHTML={{ __html: invoiceData.memo }} />
              </div>
            )}

            <div className="classic-template__footer print_footer">
              <span className="py-text py-text--fine-print word-break">
                {invoiceData && invoiceData.footer}
              </span>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const RenderInvoiceItems = props => {
  const { sign, invoiceItems } = props;
  return (
    <tbody>
      {invoiceItems.map((item, key) => {
        return (
          <tr key={key}>
            <td className="py-table__cell">
              <span className="text-strong">{item.column1 || item.name}</span>
              <p className="">{item.column2 || item.description}</p>
            </td>
            <td className="py-table__cell">
              <span>{item.column3 || item.quantity}</span>
            </td>
            <td className="py-table__cell">
              <span>{`${sign}${toMoney(item.column4 || item.price)}`}</span>
            </td>
            <td className="py-table__cell">
              <span>{`${sign}${toMoney((item.column3 || item.quantity) * (item.column4 || item.price))}`}</span>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

const InvoiceItemsHeader = () => {
  return (
    <thead>
      <tr>
        <th width="400">Items</th>
        <th width="200">Quantity</th>
        <th width="200">Price</th>
        <th width="100">Amount</th>
      </tr>
    </thead>
  );
};

export const InvoiceItems = props => {
  return (
    <div className="its-not">
      <table className="table">
        <InvoiceItemsHeader />
        <RenderInvoiceItems
          invoiceItems={props.invoiceItems}
          sign={props.sign}
        />
      </table>
    </div>
  );
};

const InvoiceTaxes = props => {
  return props.invoiceItems.length > 0
    ? props.invoiceItems.map((tax, index) => {
      return (
        <Fragment key={"taxtotal" + index}>
          <div className="classic-template__totals__amounts__line">
            <div className="classic-template__totals__amounts__line__label">
              <span>
                {typeof (tax.taxName) === 'object' ?
                  `${tax.taxName.abbreviation}${tax.taxName.other.showTaxNumber ? ` (${tax.taxName.taxNumber}) :` : ':'}`
                  : `${tax.taxName}:`
                }
              </span>
              {"  "}
            </div>
            <div className="classic-template__totals__amounts__line__amount">
              <span>{`${props.sign}${toMoney(tax.amount)}`}</span>
            </div>
          </div>
        </Fragment>
      );
    })
    : "";
};

export default InvoicePreviewClassic;
