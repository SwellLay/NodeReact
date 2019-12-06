import React, { Component, Fragment } from "react";
import { getAmountToDisplay, toMoney } from "../../../../../utils/GlobalFunctions";
import { EstimateBillToComponent, RenderShippingAddress } from "../../Estimates/components/EstimateInvoiceComponent";
import TotalCalculation from "./../../../../common/TotalCalculation";
import { InvoiceInfoComponent } from "./InvoicePreview";

class InvoicePreviewModern extends Component {
  render() {
    const { invoiceData, userSettings, payments, showPayment } = this.props;
    const borderColor = userSettings.accentColour;
    const borderColorDarker = `darken(${borderColor},30%)`;
    const businessInfo = typeof invoiceData.businessId === 'object' ? invoiceData.businessId : this.props.businessInfo;
    let ship = invoiceData.customer && invoiceData.customer.addressShipping;
    const sign = invoiceData.currency ? invoiceData.currency.symbol : "";

    return (
      <div className="invoice-preview__body">
        <div className="modern-template">
          <div className="modern-template__header">
            <div className="modern-template__header__label" style={{ backgroundColor: `${borderColor}`, color: "rgb(255, 255, 255)" }}>
              <span className="modern-template__header__label__valign_wrapper">
                <div className="modern-template__header__label__title">{invoiceData.title ? invoiceData.title.toUpperCase() : invoiceData.name ? invoiceData.name.toUpperCase() : ""}</div>
                <div className="modern-template__header__label__subtitle" style={{ color: "#fff" }}>{invoiceData && invoiceData.subTitle || invoiceData.subheading}</div>
              </span>
            </div>
            <div className="modern-template__header__amount-due" style={{ backgroundColor: `${borderColor}`, color: "rgb(255, 255, 255)", opacity: "0.8" }}>
              <span className="modern-template__header__amount-due__valign_wrapper">
                <div>{showPayment ? 'Amount Due' : 'Grand Total'} ({invoiceData.currency && invoiceData.currency.code})</div>
                <div className="modern-template__header__amount-due__value">
                  {invoiceData ? getAmountToDisplay(invoiceData.currency, showPayment ? invoiceData.dueAmount : invoiceData.totalAmount) : ''}
                </div>
              </span>
            </div>
          </div>
          <section className="modern-template__metadata">
            <EstimateBillToComponent estimateKeys={invoiceData && invoiceData.customer} />
            <RenderShippingAddress addressShipping={invoiceData.customer && invoiceData.customer.addressShipping} />
            <InvoiceInfoComponent estimateKeys={invoiceData} sign={invoiceData && invoiceData.currency && invoiceData.currency.symbol} showPayment={showPayment} from="modern"/>
          </section>
          <div className="modern-template__items">
            <table className="py-table">
              <thead className="py-table__header">
                <tr className="py-table__row">
                  {!invoiceData.itemHeading.hideItem && <th colSpan="4" className="py-table__cell">{invoiceData.itemHeading.column1.name}</th>}
                  {!invoiceData.itemHeading.hideQuantity && <th colSpan="1" className="py-table__cell modern-template__cell-center ">{invoiceData.itemHeading.column2.name}</th>}
                  {!invoiceData.itemHeading.hidePrice && <th colSpan="1" className="py-table__cell py-table__cell-amount">{invoiceData.itemHeading.column3.name}</th>}
                  {!invoiceData.itemHeading.hideAmount && <th colSpan="1" className="py-table__cell py-table__cell-amount">{invoiceData.itemHeading.column4.name}</th>}
                </tr>
              </thead>
              <tbody className="py-table__body">
                {invoiceData.items.length ? invoiceData.items.map((item, key) => {
                  return (<tr className="py-table__row" key={key}>
                    <td colSpan="4" className="py-table__cell modern-template__item">
                      {!invoiceData.itemHeading.hideItem && <span className="text-strong">{item.column1 || item.name}</span>}
                      {!invoiceData.itemHeading.hideDescription && <p className="invoice-product-description mb-0">{item.column2 || item.description}</p>}
                    </td>
                    {!invoiceData.itemHeading.hideQuantity && <td colSpan="1" className="py-table__cell modern-template__item modern-template__cell-center">{item.column3 || item.quantity}</td>}
                    {!invoiceData.itemHeading.hidePrice && <td colSpan="1" className="py-table__cell modern-template__item py-table__cell-amount">{`${sign}${toMoney(item.column4 || item.price)}`}</td>}
                    {!invoiceData.itemHeading.hideAmount && <td colSpan="1" className="py-table__cell modern-template__item py-table__cell-amount">{`${sign}${toMoney((item.column3 || item.quantity) * (item.column4 || item.price))}`}</td>}
                  </tr>)
                }) : (<tr className="py-table__row">
                  <td colSpan={'7'} className="text-center">You have not added any items.</td>
                </tr>
                  )}
              </tbody>
            </table>
          </div>
          <TotalCalculation data={invoiceData}
            sign={invoiceData.currency}
            payments={payments}
            showPayment={showPayment}
            from={!showPayment && 'estimate'}
          />
          {invoiceData.notes ?
            (
              <div className="modern-template__memo">
                <div className="py-text py-text--small">
                  <strong className="py-text--strong">Notes</strong>
                </div>
                <div className="py-text py-text--small" dangerouslySetInnerHTML={{ __html: invoiceData.notes }} />
              </div>
            ) : invoiceData.memo &&
            (
              <div className="modern-template__memo">
                <div className="py-text py-text--small">
                  <strong className="py-text--strong">Notes</strong>
                </div>
                <div className="py-text py-text--small" dangerouslySetInnerHTML={{ __html: invoiceData.memo }} />
              </div>
            )}

          <div className="modern-template__sticky-bottom print_footer">
            <section className="modern-template__footer fs-exclude">
              <span className="py-text py-text--fine-print word-break">{invoiceData.footer}</span>
            </section>
            <div className="py-divider" />
            <div className="modern-template__business-info">
              {userSettings && userSettings.displayLogo && userSettings.companyLogo ? (<div className="classic-template__header__logo invoiceLogoModern">
                <img src={userSettings.companyLogo} alt="" /> </div>) : (<div className="classic-template__header__logo" />)}
              <div className="modern-template__business-info__address">
                <strong className="py-text--strong">{businessInfo && businessInfo.organizationName} </strong>
                <div className="address">
                  <div className="address__field">
                    <span className="py-text py-text--body"> {businessInfo.address && !!businessInfo.address.addressLine1 ? businessInfo.address.addressLine1 : ""}</span>
                  </div>
                  <div className="address__field">
                    <span className="py-text py-text--body"> {businessInfo.address && !!businessInfo.address.addressLine2 ? businessInfo.address.addressLine2 : ""}</span>
                  </div>
                  <div className="address__field">
                    {`${businessInfo.address && !!businessInfo.address.city ? `${businessInfo.address.city},` : ""}`} {businessInfo.address && businessInfo.address.state && !!businessInfo.address.state.name ? businessInfo.address.state.name : ""} {businessInfo.address && !!businessInfo.address.postal ? businessInfo.address.postal : ""}
                  </div>
                  <div className="address__field">
                    <span className="py-text py-text--body">{businessInfo.address && businessInfo.address.country && businessInfo.address.country.name}</span>
                  </div>
                </div>
              </div>
              {businessInfo.communication &&
                (<div className="modern-template__business-info__contact">
                  <div className="address">
                    <strong className="py-text--strong">Contact Information</strong>
                    {businessInfo.communication.phone ? <div className="address__field"> Phone: {businessInfo.communication.phone}</div> : ""}
                    {businessInfo.communication.fax ? <div className="address__field">Fax: {businessInfo.communication.fax}</div> : ""}
                    {businessInfo.communication.mobile ? <div className="address__field"> Mobile: {businessInfo.communication.mobile}</div> : ""}
                    {businessInfo.communication.tollFree ? <div className="address__field"> Toll free: {businessInfo.communication.mobile}</div> : ""}
                    {businessInfo.communication.website ? <div className="address__field">{businessInfo.communication.website}</div> : ""}
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const RenderInvoiceItems = props => {
  const { sign, invoiceItems } = props;
  const { itemHeading } = invoiceItems;
  return (
    <tbody>
      {invoiceItems.length > 0 ? invoiceItems.map((item, key) => {
        return (
          <tr key={key}>
            <td className="py-table__cell" colSpan="4">
              {!itemHeading.hideItem && <span className="text-strong">{item.column1}</span>}
              {!itemHeading.hideDescription && <p className="invoice-product-description">{item.column2}</p>}
            </td>
            {!itemHeading.hideQuantity && <td className="py-table__cell" colSpan="1">
              <span>{item.column3}</span>
            </td>}
            {!itemHeading.hidePrice && <td className="py-table__cell" colSpan="1">
              <span>{`${sign}${toMoney(item.column4)}`}</span>
            </td>}
            {!itemHeading.hideAmount && <td className="py-table__cell" colSpan="1">
              <span>{`${sign}${toMoney(item.column3 * item.column4)}`}</span>
            </td>}
          </tr>
        );
      }) : (<tr className="py-table__row">
        <td colSpan="7" className="text-center">You have not added any items.</td>
      </tr>)}
    </tbody>
  );
};

const InvoiceItemsHeader = (props) => {
  const { itemHeading } = props.invoiceInfo;
  return (
    <thead>
      <tr>
        {!itemHeading.hideItem && <th width="800">{itemHeading.column1.name}</th>}
        {!itemHeading.hideQuantity && <th width="200">{itemHeading.column2.name}</th>}
        {!itemHeading.hidePrice && <th width="200">{itemHeading.column3.name}</th>}
        {!itemHeading.hideAmount && <th width="200">{itemHeading.column4.name}</th>}
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

const InvoiceTaxes = props => {
  return props.invoiceItems.length > 0
    ? props.invoiceItems.map((tax, index) => {
      return (
        <Fragment key={"taxtotal" + index}>
          <div className="template-totals-amounts-line">
            <div className="template-totals-amounts-line-label">
              <span>
                {typeof (tax.taxName) === 'object' ?
                  `${tax.taxName.abbreviation} ${tax.taxName.other.showTaxNumber ? `(${tax.taxName.taxNumber})` : ''}`
                  : `${tax.taxName}`
                }</span>
              {"  "}
            </div>
            <div className="template-totals-amounts-line-amount">
              <span>{`${props.sign}${toMoney(tax.amount)}`}</span>
            </div>
          </div>
        </Fragment>
      );
    })
    : "";
};

export default InvoicePreviewModern;
