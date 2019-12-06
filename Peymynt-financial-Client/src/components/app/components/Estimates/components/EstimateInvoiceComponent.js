import history from "customHistory";
import { get } from 'lodash';
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import { convertEstimateToInvoice } from "../../../../../api/EstimateServices";
import { convertDateToYMD } from "../../../../../utils/common";
import { getAmountToDisplay } from "../../../../../utils/GlobalFunctions";
import TotalCalculation from "./../../../../common/TotalCalculation";
import { statusClass } from "../../../../../constants/EstimateConst";

export const EstimateSpan = props => {
  console.log("props", props);
    return <div>
        <span className="text-strong">
            {props.estimateKey}
        </span>
    </div>
};

export const RenderShippingAddress = props => {
    const addressShipping = props.addressShipping;
    return <div className="template-metadata-customer-shipping">
        {
            get(addressShipping, 'contactPerson') &&
            <Fragment>
                <div className="py-text--block-label text-uppercase py-text--hint">
                    Ship to
                </div>
                <div class="invoice-view-billing__details">
                {get(addressShipping, 'contactPerson') && (<div className="py-text--strong mb-2">{get(addressShipping, 'contactPerson')}</div>)}
                {get(addressShipping, 'addressLine1') && (<p className="m-0">
                    {get(addressShipping, 'addressLine1')}
                    </p>)}
                {get(addressShipping, 'addressLine2') && (
                    <p className="m-0">{get(addressShipping, 'addressLine2')} </p>)}
                {get(addressShipping, 'city') && (<p className="m-0">
                    {get(addressShipping, 'city')}
                  {get(addressShipping, 'state.name') && `, ${get(addressShipping, 'state.name')}`}
                  {get(addressShipping, 'postal') > 0 && ` ${get(addressShipping, 'postal')}`}
                </p>)}
              {/* {get(addressShipping, 'state.name') && (<span className="">
                    {get(addressShipping, 'state.name')}
                    <br></br></span>)} */}
              {/* {get(addressShipping, 'postal') > 0 && (<span className="">
                    {get(addressShipping, 'postal')}
                    <br></br></span>)} */}
                {get(addressShipping, 'country.name') && (<p className="m-0">
                    {get(addressShipping, 'country.name')}
                    </p>)}

                <div className="template-metadata-customer-address">
                    <br />
                    {get(addressShipping, 'phone') ? get(addressShipping, 'phone') : ''}
                    <br />
                </div>
                </div>
            </Fragment>
        }
    </div>
};

const statusAction = (status, openSendMail, props) => {
    switch (status) {
        case "expired":
            return <span>
                Create a <Link to='/app/estimates/add' className="py-text--link">new estimate</Link>
            </span>;
        case 'saved':
            return (<span>
                Send <a className="py-text--link" onClick={openSendMail} href="javascript: void(0)">this estimate</a>
            </span>);
        case 'sent':
            return (<span>
                <a href="javascript:void(0)" className="py-text--link" onClick={() => convertEstimate(props)}>convert to invoice</a>
            </span>);
        case 'viewed':
            return (<span>
                <a href="javascript:void(0)" className="py-text--link" onClick={() => convertEstimate(props)}>convert to invoice</a>
            </span>);
        default:
            return null
    }
};

export const EstimateHeader = props => {
    if (!props.estimate) {
        return null
    } else {
      const { name, estimateNumber, status } = props.estimate;
        return <header className="py-header--page align-items-center">
            <div className="py-header--title">
                <h1 className="py-heading--title" >{`${name} #${estimateNumber}`}</h1>
            </div>

            <div className="py-header--actions">
                <div className="py-box--gray invoice-status-badge">
                    <div className={`badge ${statusClass(status)} mr-1`}>{status}</div>
                    <span>{statusAction(status, props.handleModal, props)}</span>
                </div>
            </div>
        </header>
    }
};

export const EstimateBillToComponent = props => {
    const estimateKeys = props.estimateKeys;
    if(!!estimateKeys){
        return <div className="template-metadata-customer-billing">
            <span className="py-text--block-label text-uppercase py-text--hint">
                Bill to
            </span>
            {estimateKeys && estimateKeys.customerName && (<strong className="py-text--strong">{estimateKeys.customerName}</strong>)}

            <div className="invoice-view-billing__details">
            {estimateKeys && estimateKeys.firstName && (<p className="m-0">{estimateKeys.firstName} {estimateKeys.lastName}</p>)}
            {estimateKeys && estimateKeys.addressBilling && estimateKeys.addressBilling.addressLine1 && (<p className="m-0">
                {estimateKeys.addressBilling.addressLine1}
            </p>)}
            {estimateKeys && estimateKeys.addressBilling && estimateKeys.addressBilling.addressLine2 && (<p className="m-0">
                {estimateKeys.addressBilling.addressLine2}, {estimateKeys && estimateKeys.addressBilling && estimateKeys.addressBilling.state && estimateKeys.addressBilling.state.name && (
              <p className="m-0">
                {estimateKeys.addressBilling.state.name} {estimateKeys && estimateKeys.addressBilling && estimateKeys.addressBilling
              && estimateKeys.addressBilling.postal > 0 && estimateKeys.addressBilling.postal}
            </p>)}
            </p>)}
            {estimateKeys && estimateKeys.addressBilling && estimateKeys.addressBilling.country
                && estimateKeys.addressBilling.country.name && (<p className="m-0">
                    {estimateKeys && estimateKeys.addressBilling && estimateKeys.addressBilling.country
                        && estimateKeys.addressBilling.country.name}
                    </p>)}
            <br/>{
                estimateKeys && estimateKeys.communication ?
                (
                    <div className="template-metadata-customer-address">
                        {estimateKeys && estimateKeys.communication && estimateKeys.communication.phone&& <p className="m-0">{estimateKeys.communication.phone}</p>}
                        {estimateKeys && <p className="m-0">{estimateKeys.email}</p>}
                    </div>
                ): ""
            }
            </div>
        </div>
    }else{
        return <span>You have not added a customer.</span>
    }
};

export const EstimateInfoComponent = props => {
    const { estimateKeys, sign } = props;
    return <div className="invoice-template-details">
        <table className="table">
            <tbody>
                <tr>
                    <td>
                        <strong className="text-strong">
                            Estimate Number:
                        </strong>
                    </td>
                    <td>
                        <span>{estimateKeys ? estimateKeys.estimateNumber : 0}</span>
                    </td>
                </tr>
                {estimateKeys && estimateKeys.purchaseOrder && <tr>
                    <td>
                        <strong className="text-strong">
                            P.O. / S.O. Number:
                        </strong>
                    </td>
                    <td>
                        <span>{estimateKeys.purchaseOrder}</span>
                    </td>
                </tr>}
                <tr>
                    <td>
                        <strong className="text-strong">
                            Estimate Date:
                        </strong>
                    </td>
                    <td>
                        <span>{estimateKeys ? convertDateToYMD(estimateKeys.estimateDate) : 'Nil'}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <strong className="text-strong">Expires On:</strong>
                    </td>
                    <td>
                        <span>{estimateKeys ? convertDateToYMD(estimateKeys.expiryDate) : 'Nil'}</span>
                    </td>
                </tr>
                <tr>
                    <td className="table-cell-first">
                        <span className="text-strong">
                            <strong>{`Grand Total (${estimateKeys && estimateKeys.currency ? estimateKeys.currency.code : ""}):`}</strong>
                        </span>
                    </td>
                    <td className="table-cell-second">
                        <span className="text-strong">
                            <strong>{`${getAmountToDisplay(sign, estimateKeys.amountBreakup.total)}`}</strong>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
};


const RenderEstimateItems = (props) => {
  const { sign, estimateItems } = props;
    return <tbody className="py-table__body">
        {
            estimateItems.map((item, key) => {
                return <tr key={key} className="py-table__row">
                    <td width="300" className="matchPd pdfTable-item">
                        <span className="text-strong"><b>{item.name}</b></span>
                        <p className="invoice-product-description m-0">{item.description}</p>
                    </td>
                    <td width="200" className="pdfTable-quantity">
                        <span>{item.quantity}</span>
                    </td>
                    <td width="200" className="pdfTable-price">
                        <span>{`${getAmountToDisplay(sign, item.price || 0)}`}</span>
                    </td>
                    <td width="200" className="pdfTable-total">
                        <span>{`${getAmountToDisplay(sign, item.quantity * item.price)}`}</span>
                    </td>
                </tr>
            })
        }
    </tbody>
};

const EstimateItemsHeader = (props) => {
    const borderColour = props.userSettings ? props.userSettings.accentColour : "#000";
    const { itemHeading } = props.userSettings;
    return <thead className="py-table__header">
        <tr>
            {!itemHeading.hideItem && <th style={{ backgroundColor: borderColour }} className="thItems">{itemHeading.column1.name}</th>}
            {!itemHeading.hideQuantity && <th style={{ backgroundColor: borderColour }} className="thQuantity">{itemHeading.column2.name}</th>}
            {!itemHeading.hidePrice && <th style={{ backgroundColor: borderColour }} className="thPrice">{itemHeading.column3.name}</th>}
            {!itemHeading.hideAmount && <th style={{ backgroundColor: borderColour }} className="thAmount">{itemHeading.column4.name}</th>}
        </tr>
    </thead>
};

export const EstimateItems = (props) => {
    return <div className="contemporary-template__items">
        <table className="table">
            <EstimateItemsHeader userSettings={props.userSettings} />
            <RenderEstimateItems estimateItems={props.estimateItems} sign={props.sign} userSettings={props.userSettings} />
        </table>
    </div>
};


const EstimateTaxes = (props) => {
    return (
        props.estimateItems.length ? props.estimateItems.map((tax, index) => {
            return (<Fragment key={'taxtotal' + index}>
                <div className="template-totals-amounts-line">
                    <div className="template-totals-amounts-line-label temlpateTotalLabel">
                        <span >{typeof (tax.taxName) === 'object' ?
                            `${tax.taxName.abbreviation} ${tax.rate}% ${tax.taxName.other.showTaxNumber ? `(${tax.taxName.taxNumber}):` : ':'}`
                            : `${tax.taxName} ${tax.rate}%`
                        }</span>{'  '}
                    </div>
                    <div className="template-totals-amounts-line-amount temlpateTotalAmount">
                        <span>{`${getAmountToDisplay(props.sign, tax.amount)}`}</span>
                    </div>
                </div>
            </Fragment>)
        }) : ""
    )
};

//TODO calculat tax and display
//Currency symbole should change dynamically

export const EstimateAlert = (props) => {
    return <div>
        <span color={props.color}>
            {props.message}
        </span>
    </div>
};

export const convertEstimate = async (props) => {
    let estimateId = props.estimate._id;
    const invoiceData = await convertEstimateToInvoice(estimateId);
    const invoiceId = invoiceData.data.invoice._id;
    history.push(`/app/invoices/edit/${invoiceId}`);
};

export const EstimateBreakup = (props) => {
  const { estimateInfo, sign } = props;
    let showExchange = estimateInfo && estimateInfo.currency && estimateInfo.currency.code;
    return (<TotalCalculation data={estimateInfo}
        sign={sign} from="estimate"/>)
};
