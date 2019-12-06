import React, { Fragment } from "react";
import { getCommonFormatedDate } from "../../../../../utils/common";
import history from "customHistory";

const InvoiceRowHoverPopUp = props => {
        return (
        <Fragment>
            <div className="popover_wrapper">
            {props.children}
                <div className="tooltip">
                    <ul>
                        <li>
                            <span>Due</span>
                            <span> {getCommonFormatedDate(props.row.dueDate)}</span>
                        </li>
                        <li>
                            <span>Last Sent</span>
                            <span>{props.row.lastSent ? getCommonFormatedDate(props.row.lastSent) : "Never"}</span>
                        </li>
                        <li>
                            <span>Last Viewed</span>
                            <span>{props.row.lastViewed ? getCommonFormatedDate(props.row.lastViewed) : "Never"}</span>
                        </li>
                        <li>
                            <span>Total</span>
                            <span>{props.row.customer.currency.symbol ? props.row.customer.currency.symbol : "$"}{props.row.totalAmount}</span>
                        </li>
                    </ul>
                    <div className="customer_details">
                        <div className="customer_container">
                            <div className="col-left">
                              <p><strong>Customer:</strong></p>
                            </div>
                            <div className="col-right">
                            <p>{props.row.customer.customerName}</p>
                            </div>
                        </div>
                        {props.row.customer.firstName && (<div className="customer_container">
                            <div className="col-left">
                              <p><strong></strong></p>
                            </div>
                            <div className="col-right">
                            <p>{props.row.customer.firstName} {props.row.customer.lastName}</p>
                            </div>
                        </div>)}
                        {props.row.customer.email && (<div className="customer_container">
                            <div className="col-left">
                              <p><strong></strong></p>
                            </div>
                            <div className="col-right">
                            <p>{props.row.customer.email} </p>
                            </div>
                        </div>)}
                        {props.row.customer.phone && (<div className="customer_container">
                            <div className="col-left">
                              <p><strong></strong></p>
                            </div>
                            <div className="col-right">
                            <p>{props.row.customer.phone} </p>
                            </div>
                        </div>)}
                        <div className="customer_container">
                            <div className="col-left">
                              <p><strong>Created From:</strong></p>
                            </div>
                            <div className="col-right">
                            <p>{props.row.createdFrom ? props.row.createdFrom : "--"} </p>
                            </div>
                        </div>
                        <div className="customer_container">
                            <div className="col-left">
                              <p><strong>Notes:</strong></p>
                            </div>
                            <div className="col-right">
                            <p dangerouslySetInnerHTML={{ __html: props.row.notes ? props.row.notes : " -- " }} ></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
        )
}

export default InvoiceRowHoverPopUp;


