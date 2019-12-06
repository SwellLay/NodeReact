
import React, { Component } from "react";
import { convertDateToYMD, getCommonFormatedDate } from "../../../../../utils/common";
import { EstimateBillToComponent, RenderShippingAddress } from "./EstimateInvoiceComponent";
import { shadeColor, getAmountToDisplay } from "../../../../../utils/GlobalFunctions";
import TotalAmountTable from "../../../../common/TotalAmountTable";
import TotalCalculation from "../../../../common/TotalCalculation";


class EstimateModrenPreview extends Component {
  render() {
    const { invoiceData, userSettings } = this.props;

    const borderColour = userSettings.accentColour;
    const businessInfo = invoiceData.businessId;
    const { itemHeading } = userSettings
    const sign = invoiceData.currency;
    let ship = invoiceData.customer && invoiceData.customer.addressShipping;
    let preview = false;
    if (_.includes(window.location.pathname, '/estimates/view')) {
      preview = true
    }
    console.log("userSettings : ", userSettings);
    console.log("businessInfo : ", businessInfo);
    return (
      <div className={"invoice-preview__body"}>
        <div className="modern-template">
          <div className="modern-template__header">
            <div className="modern-template__header__label" style={{ backgroundColor: borderColour ? borderColour : "#4b4d65", color: "rgb(255, 255, 255)" }}>
              <span className="modern-template__header__label__valign_wrapper">
                <div className="modern-template__header__label__title"> {`${invoiceData && invoiceData.name && invoiceData.name.toUpperCase()}`}</div>
                <div className="heading-subtitle" style={{ color: "#fff" }}> {invoiceData && invoiceData.subheading}</div>
              </span>
            </div>
            <div className="modern-template__header__amount-due" style={{ backgroundColor: borderColour ? shadeColor(borderColour) : shadeColor("#4b4d65"), color: "rgb(255, 255, 255)" }}>
              <span className="modern-template__header__amount-due__valign_wrapper">
                <strong className="py-text--strong">{`Grand Total (${invoiceData && invoiceData.currency ? invoiceData.currency.code : businessInfo.currency && businessInfo.currency.code})`}</strong>
                <div className="modern-template__header__amount-due__value">{getAmountToDisplay(invoiceData.currency, invoiceData.amountBreakup.total)}
                </div>
              </span>
            </div>
          </div>
          <section className="modern-template__metadata">
            <div className="modern-template__metadata__customer fs-exclude">
              <div className="classic-template__metadata__customer">
                <EstimateBillToComponent estimateKeys={invoiceData.customer} />
              </div>
              {invoiceData && invoiceData.customer && invoiceData.customer.addressShipping && (<div className="classic-template__metadata__customer">
                <RenderShippingAddress addressShipping={invoiceData.customer.addressShipping} />
              </div>)}
            </div>
            <div className="invoice-template-details">
              <table className="py-table">
                <tbody className="py-table__body">
                  <tr>
                    <td className="py-table__cell ta-l estimateNumber"> <strong className="py-text--strong">Estimate Number :</strong></td>
                    <td className="py-table__cell ta-l estimateNumber"> {invoiceData && invoiceData.estimateNumber} </td>
                  </tr>
                  {invoiceData && invoiceData.purchaseOrder &&
                    <tr>
                      <td className="py-table__cell ta-l estimateNumber"> <strong className="py-text--strong">P.O./S.O. Number :</strong></td>
                      <td className="py-table__cell ta-l estimateNumber"> {invoiceData && invoiceData.purchaseOrder} </td>
                    </tr>}

                  <tr>
                    <td className="py-table__cell ta-l estimateNumber"> <strong className="py-text--strong">Estimate Date :</strong></td>
                    <td className="py-table__cell ta-l estimateNumber" colSpan="1"> <span className="py-text py-text--body">{convertDateToYMD(invoiceData.estimateDate)}</span> </td>
                  </tr>
                  <tr>
                    <td className="py-table__cell ta-l estimateNumber"> <strong className="py-text--strong">Expires On :</strong></td>
                    <td className="py-table__cell ta-l estimateNumber" colSpan="1"> <span className="py-text py-text--body">{convertDateToYMD(invoiceData.expiryDate)}</span> </td>
                  </tr>
                </tbody>
              </table>

            </div>
          </section>
          <div className="modern-template__items">
            <table className="py-table">
              <thead className="py-table__header">
                <tr className="py-table__row">
                  {!itemHeading.hideItem && <th colSpan="4" className="py-table__cell">{itemHeading.column1.name}</th>}
                  {!itemHeading.hideQuantity && <th colSpan="1" className="py-table__cell text-center">{itemHeading.column2.name}</th>}
                  {!itemHeading.hidePrice && <th colSpan="1" className="py-table__cell-amount">{itemHeading.column3.name}</th>}
                  {!itemHeading.hideAmount && <th colSpan="1" className="py-table__cell-amount">{itemHeading.column4.name}</th>}
                  {/* <th className="thQuantity"> Quantity </th>
                  <th className="thPrice"> Price </th>
                  <th className="thAmount"> Amount </th> */}
                </tr>
              </thead>
              <tbody className="py-table__body">
                {invoiceData.items.map((item, key) => {
                  return (<tr className="py-table__row" key={key}>
                    <td colSpan="4" className="py-table__cell">
                      <span className="text-strong"><b>{item.name}</b></span>
                      <p className="invoice-product-description m-0">{item.description}</p>
                    </td>
                    <td colSpan="1" className="py-table__cell text-center">
                      <span className="text-strong"></span>
                      <p className="invoice-product-description m-0">{item.quantity}</p>
                    </td>
                    <td colSpan="1" className="py-table__cell-amount">
                      <span>{`${getAmountToDisplay(sign, item.price)}`}</span>
                    </td>
                    <td colSpan="1" className="py-table__cell-amount">
                      <span>{`${getAmountToDisplay(sign, item.quantity * item.price)}`}</span>
                    </td>
                  </tr>)
                })}
              </tbody>
            </table>
          </div>
          
          <TotalCalculation data={invoiceData}
            sign={sign} from="estimate"/>
          {invoiceData.memo &&
            (
              <div className="modern-template__memo">
                <div className="py-text py-text--small">
                  <strong className="py-text--strong">Notes</strong>
                </div>
                <div className="py-text py-text--small" dangerouslySetInnerHTML={{ __html: invoiceData.memo }} />
              </div>
            )}

          <div className="modern-template__sticky-bottom">
            <section className="modern-template__footer fs-exclude">
              <span className="py-text py-text--fine-print">{invoiceData.footer}</span>
            </section>
            <div className="py-divider" />
            <div className="modern-template__business-info">
              {userSettings && userSettings.displayLogo && userSettings.companyLogo ? (<div className="classic-template__header__logo invoiceLogoModern">
                <img src={userSettings.companyLogo} alt="" /> </div>) : (<div className="classic-template__header__logo" />)}
              <div className="modern-template__business-info__address">
                <strong className="py-text--strong">{businessInfo && businessInfo.organizationName} </strong>
                <div className="address">
                  <div className="address__field">
                    <span className="py-text py-text--body"> {businessInfo.address && businessInfo.address.addressLine1}</span>
                  </div>
                  <div className="address__field">
                    <span className="py-text py-text--body"> {businessInfo.address && businessInfo.address.addressLine2}</span>
                  </div>
                  <div className="address__field">
                    {businessInfo.address ? `${businessInfo.address.city ? businessInfo.address.city + ", " : ""}` : ""} {businessInfo.address && businessInfo.address.state && businessInfo.address.state.name} {businessInfo.address && businessInfo.address.postal}
                  </div>
                  <div className="address__field">
                    <span className="py-text py-text--body">{businessInfo.country && businessInfo.country.name}</span>
                  </div>
                </div>
              </div>
              {businessInfo && businessInfo.communication && (
                <div className="con-temp-address">
                  <strong className="py-text--strong">Contact Information</strong>
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
        </div>
      </div>
    );
  }
}

export default EstimateModrenPreview