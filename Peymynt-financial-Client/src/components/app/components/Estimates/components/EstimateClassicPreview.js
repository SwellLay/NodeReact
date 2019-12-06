
import React, { Component, Fragment } from "react";
import { convertDateToYMD, getCommonFormatedDate } from "../../../../../utils/common";
import { EstimateBillToComponent, RenderShippingAddress } from "./EstimateInvoiceComponent";
import { getAmountToDisplay } from "../../../../../utils/GlobalFunctions";
import  TotalCalculation  from "./../../../../common/TotalCalculation";


class EstimateClassicPreview extends Component {
  render() {
    const { invoiceData, userSettings } = this.props;
    const borderColor = userSettings && userSettings.accentColour;
    const { itemHeading } = userSettings;
    const businessInfo = invoiceData.businessId;
    let ship = invoiceData.customer && invoiceData.customer.addressShipping;
    let country =
      businessInfo.country
        ? businessInfo.country.name
        : "";
    let state =
      businessInfo.address && businessInfo.address.state
        ? businessInfo.address.state.name
        : "";
    const sign = invoiceData.currency;
    let preview = false;
    if (_.includes(window.location.pathname, '/estimates/view')) {
      preview = true
    }
    return (
      <Fragment>
        <div className={preview ? "invoice-preview__body prev" : "invoice-preview__body"}>
          <div className="classic-template" style={{ border: borderColor ? `10px solid ${borderColor}` : "#4b4d65" }}>
            <section className="classic-template__header">
              {userSettings && userSettings.displayLogo && userSettings.companyLogo ? (
                <div className="classic-template__header__logo invoiceLogo">
                  <img
                    src={userSettings.companyLogo} alt="" />
                </div>
              ) : (
                  <div className="classic-template__header__logo" />
                )}

              <div className="classic-template__header__info">
                <strong className="py-text--strong">
                  {businessInfo && businessInfo.organizationName}
                </strong>
                <div className="address">
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
                  <div className="address__field">
                    {businessInfo && businessInfo.address ? `${businessInfo.address.city ? businessInfo.address.city + ", " : ""}` : ""} {businessInfo.address && businessInfo.address.state && businessInfo.address.state.name} {businessInfo.address && businessInfo.address.postal}
                  </div>
                </div>
                <div className="address">
                  <div className="address__field">
                    <span className="py-text py-text--body"> {country} </span>
                  </div>
                </div>
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
            </section>
            <div className="classic-template__separator">
              <div className="classic-template__separator__header">
                {/* <hr
                  className="classic-template__separator___header__left_divider"
                  style={{ borderColor: `${borderColor}` }}
                /> */}
                <div
                  className="classic-template__separator__header__right_divider"
                  style={{ borderColor: `${borderColor}` }}
                ></div>
                <div className="classic-template__separator__header__frame">
                  <svg height="72" viewBox="0 0 28 72" width="28">
                    <g fill="none" stroke={`${borderColor}`} strokeWidth="2">
                      <path d="M183 57.038v-42.076c-.33.025-.664.038-1 .038-7.18 0-13-5.82-13-13 0-.336.013-.67.038-1h-154.076c.025.33.038.664.038 1 0 7.18-5.82 13-13 13-.336 0-.67-.013-1-.038v42.076c.33-.025.664-.038 1-.038 7.18 0 13 5.82 13 13 0 .336-.013.67-.038 1h154.076c-.025-.33-.038-.664-.038-1 0-7.18 5.82-13 13-13 .336 0 .67.013 1 .038z" />
                      <path d="M177 51.503v-31.007c-.33.024-.664.037-1 .037-7.18 0-13-5.626-13-12.567 0-.325.013-.648.038-.967h-142.076c.025.319.038.641.038.967 0 6.94-5.82 12.567-13 12.567-.336 0-.67-.012-1-.037v31.007c.33-.024.664-.037 1-.037 7.18 0 13 5.626 13 12.567 0 .325-.013.648-.038.967h142.076c-.025-.319-.038-.641-.038-.967 0-6.94 5.82-12.567 13-12.567.336 0 .67.012 1 .037z" />
                    </g>
                  </svg>
                  <div
                    className="classic-template__separator__header__frame__text"
                    style={{ borderColor: `${borderColor}` }}
                  >
                    <div
                      className="py-heading--title"
                      style={{ color: `${borderColor}`, textTransform: 'capitalize' }}
                    >
                      {invoiceData && invoiceData.name}
                    </div>
                  </div>
                  <svg height="72" viewBox="0 0 28 72" width="28">
                    <g fill="none" stroke={`${borderColor}`} strokeWidth="2">
                      <path d="M27 57.038v-42.076c-.33.025-.664.038-1 .038-7.18 0-13-5.82-13-13 0-.336.013-.67.038-1h-154.076c.025.33.038.664.038 1 0 7.18-5.82 13-13 13-.336 0-.67-.013-1-.038v42.076c.33-.025.664-.038 1-.038 7.18 0 13 5.82 13 13 0 .336-.013.67-.038 1h154.076c-.025-.33-.038-.664-.038-1 0-7.18 5.82-13 13-13 .336 0 .67.013 1 .038z" />
                      <path d="M21 51.503v-31.007c-.33.024-.664.037-1 .037-7.18 0-13-5.626-13-12.567 0-.325.013-.648.038-.967h-142.076c.025.319.038.641.038.967 0 6.94-5.82 12.567-13 12.567-.336 0-.67-.012-1-.037v31.007c.33-.024.664-.037 1-.037 7.18 0 13 5.626 13 12.567 0 .325-.013.648-.038.967h142.076c-.025-.319-.038-.641-.038-.967 0-6.94 5.82-12.567 13-12.567.336 0 .67.012 1 .037z" />
                    </g>
                  </svg>
                </div>
                <div
                  className="classic-template__separator__header__right_divider"
                  style={{ borderColor: `${borderColor}` }}
                >
                </div>
              </div>
              <div className="classic-template__separator__subheader">
                <div className="py-heading--subtitle">{invoiceData.subheading}</div>
              </div>
            </div>
            <section className="classic-template__metadata">
              <div className="classic-template__metadata__customer">
                <EstimateBillToComponent estimateKeys={invoiceData.customer} />
              </div>
              {invoiceData && invoiceData.customer && invoiceData.customer.addressShipping && (<div className="classic-template__metadata__customer">
                <RenderShippingAddress addressShipping={invoiceData.customer.addressShipping} />
              </div>)}
              <div className="invoice-template-details">
                <table className="py-table--plain">
                  <tbody className="py-table__body">
                    <tr>
                      <td className="py-table__cell" colSpan="1">
                        <strong className="py-text--strong">
                          Estimate Number :
                        </strong>
                      </td>
                      <td className="py-table__cell" colSpan="1">
                        <span className="py-text py-text--body">
                          {invoiceData && invoiceData.estimateNumber}
                        </span>
                      </td>
                    </tr>

                    {invoiceData && invoiceData.purchaseOrder &&
                      <tr>
                        <td className="py-table__cell" colSpan="1">
                          <strong className="py-text--strong">
                            P.O./S.O. Number :
                        </strong>
                        </td>
                        <td className="py-table__cell" colSpan="1">
                          <span className="py-text py-text--body">
                            {invoiceData && invoiceData.purchaseOrder}
                          </span>
                        </td>
                      </tr>}

                    <tr>
                      <td className="py-table__cell" colSpan="1">
                        <strong className="py-text--strong">
                          Estimate Date :
                        </strong>
                      </td>
                      <td className="py-table__cell" colSpan="1">
                        <span className="py-text py-text--body">
                          {convertDateToYMD(invoiceData.estimateDate)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-table__cell" colSpan="1">
                        <strong className="py-text--strong">
                          Expires On :
                        </strong>
                      </td>
                      <td className="py-table__cell" colSpan="1">
                        <span className="py-text py-text--body">
                          {convertDateToYMD(invoiceData.expiryDate)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-table__cell" colSpan="1">
                        <strong className="py-text--strong">
                          {`Grand Total (${invoiceData && invoiceData.currency ? invoiceData.currency.code : businessInfo.currency && businessInfo.currency.code}) :`}
                        </strong>
                      </td>
                      <td className="py-table__cell" colSpan="1">
                        <span className="py-text py-text--body">
                          <strong className="py-text-strong">
                            {
                              getAmountToDisplay(invoiceData.currency, invoiceData.amountBreakup.total)
                            }
                          </strong>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <div className="classic-template__items">
              <table className="py-table">
                <thead className="py-table__header">
                    <tr className="py-table__row">
                    {!itemHeading.hideItem && <th colSpan="4" className="py-table__cell">{itemHeading.column1.name}</th>}
                    {!itemHeading.hideQuantity && <th colSpan="1" className="py-table__cell text-center">{itemHeading.column2.name}</th>}
                    {!itemHeading.hidePrice && <th colSpan="1" className="py-table__cell-amount">{itemHeading.column3.name}</th>}
                    {!itemHeading.hideAmount && <th colSpan="1" className="py-table__cell-amount">{itemHeading.column4.name}</th>}
                    {/* <th className="py-table__cell thItems">
                      Item
                    </th>
                    <th className="py-table__cell thQuantity">
                      Quantity
                    </th>
                    <th className="py-table__cell thPrice">
                      Price
                    </th>
                    <th className="py-table__cell thAmount">
                      Amount
                    </th> */}
                  </tr>
                </thead>
                <tbody className="py-table__body">
                  {invoiceData.items.map((item, key) => {
                    return (
                      <tr className="py-table__row" key={key}>
                        <td colSpan="4" className="py-table__cell">
                          <span className="text-strong"><b>{item.name}</b></span>
                          <p className="">{item.description}</p>
                        </td>
                        <td colSpan="1" className="py-table__cell text-center">
                          <span className="text-strong"></span>
                          <p className="">{item.quantity}</p>
                        </td>
                        <td colSpan="1" className="py-table__cell-amount">
                          <span>{`${getAmountToDisplay(sign, item.price)}`}</span>
                        </td>
                        <td colSpan="1" className="py-table__cell-amount">
                          <span>{`${getAmountToDisplay(sign, item.quantity * item.price)}`}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TotalCalculation data={invoiceData}
            sign={sign} from="estimate"/>

            {invoiceData.memo && (
              <div className="modern-template__memo">
                <div className="py-text py-text--small">
                  <strong className="py-text--strong">Notes</strong>
                </div>
                <div className="py-text py-text--small" dangerouslySetInnerHTML={{ __html: invoiceData.memo }} />
              </div>
            )}

            <div className="classic-template__footer">
              <span className="py-text py-text--fine-print">
                {invoiceData && invoiceData.footer}
              </span>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}


const InvoiceTaxes = props => {
  return props.invoiceItems.length > 0
    ? props.invoiceItems.map((tax, index) => {
      return (
        <Fragment key={"taxtotal" + index}>
          <div className="template-totals-amounts-line">
            <div className="template-totals-amounts-line-label">
              <span>
                {typeof (tax.taxName) === 'object' ?
                  `${tax.taxName.abbreviation} ${tax.rate}% ${tax.taxName.other.showTaxNumber ? `(${tax.taxName.taxNumber}):` : ':'}`
                  : `${tax.taxName} ${tax.rate}%:`
                }
              </span>
              {"  "}
            </div>
            <div className="template-totals-amounts-line-amount" style={{ marginLeft: '10px' }}>
              <span>{`${getAmountToDisplay(props.sign, tax.amount)}`}</span>
            </div>
          </div>
        </Fragment>
      );
    })
    : "";
};


export default EstimateClassicPreview