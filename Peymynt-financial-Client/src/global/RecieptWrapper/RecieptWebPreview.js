import React, { Fragment } from 'react'
import { convertDateToYMD } from '../../utils/common';
import { toMoney } from '../../utils/GlobalFunctions';
import CenterSpinner from '../CenterSpinner';
import * as PaymentIcon from 'global/PaymentIcon';

export const RecieptWebPreview = ({ invoiceData, businessInfo, receiptData, userInfo, salesSettings }) => {
    return (
        <div className="Receipt">
            {
                !!invoiceData && !!businessInfo && !!receiptData && userInfo ?
                    (<Fragment>
                        <div className="logo"><img src={!!salesSettings ? salesSettings.companyLogo : "/assets/Total.png"} alt="" /></div>
                        <h2 className="py-text--strong">Payment Receipt</h2>
                        <span className="receiptNo" style={{ textTransform: 'capitalize' }}>
                            {invoiceData.title && invoiceData.title} #
                        {invoiceData.invoiceNumber}
                        </span>
                        <span className="for">
                            for {invoiceData.customer.customerName}{" "}
                            <br />paid on&nbsp;
                        {receiptData
                                ? convertDateToYMD(receiptData.paymentDate)
                                : ""}
                        </span>
                        <span className="businessInfo-reciept">{businessInfo.organizationName} <br />
                            {businessInfo.address ? businessInfo.address.addressLine1 && (
                                <Fragment>
                                    {businessInfo.address.addressLine1 || ""}&nbsp;
                            {businessInfo.address.addressLine2 || ""}<br />
                                    {`${businessInfo.address.city}, ` || ""}
                                    {businessInfo.address.state ? `${businessInfo.address.state.name}, ` : ""}
                                    {businessInfo.address.postal}<br />
                                    {
                                        businessInfo.communication ?
                                            <Fragment>
                                                {
                                                    businessInfo.communication.phone ?
                                                        (<Fragment>Tel: {businessInfo.communication.phone} <br /></Fragment>) : ""
                                                }
                                                {
                                                    businessInfo.communication.mobile ?
                                                        (<Fragment>Mobile: {businessInfo.communication.mobile}<br /></Fragment>) : ""
                                                }
                                                {
                                                    businessInfo.communication.tollFree ?
                                                        (<Fragment>Toll free: {businessInfo.communication.tollFree}<br /></Fragment>) : ""
                                                }
                                                {
                                                    businessInfo.communication.website || ""
                                                }
                                            </Fragment>
                                            : ""
                                    }
                                </Fragment>
                            ) : ""}
                            {/* 222 South Main Street<br/>
                        Suite 1612<br/>
                        Los Angeles, California 90007<br/>
                        United States<br/>
                        Tel: 3109550124<br/>
                        Mobile: 7000628392<br/>
                        Toll free: 1800828773<br/>
                        www.tunnelartist.com */}
                        </span>
                        <hr />
                        <div className="reciept-business-details">
                            {
                                businessInfo && invoiceData && receiptData && (
                                    <Fragment>
                                        <div>
                                            <span>
                                                Hi {invoiceData.customer.customerName}
                                            </span>
                                        </div>
                                        <br />
                                        <div>
                                            <span>
                                                Here's your payment receipt for <span style={{ textTransform: 'capitalize' }}>{invoiceData.title && invoiceData.title}</span> #
                                            {invoiceData.invoiceNumber} for {invoiceData.currency ? invoiceData.currency.symbol : ""}{receiptData ? `${receiptData.amount}.00` : ""}{" "}
                                                {invoiceData.currency ? invoiceData.currency.code : ""}.
                                        </span>
                                        </div>
                                        <br />
                                        <div>
                                            <span>
                                                You can always view your receipt online at:
                                        </span>
                                            {" "}
                                            <a target='_blank' href={`${process.env.WEB_URL}/invoice/${invoiceData.uuid}/public/reciept-view/readonly/${receiptData._id}`} className="py-text--strong">{`${process.env.WEB_URL}/reciept-view/readonly/${receiptData._id}`}</a>
                                        </div>
                                        <br />
                                        <div>
                                            <span>If you have any questions, please let us know.</span>
                                        </div>
                                        <br />
                                        <div>
                                            <span>Thanks,</span>
                                        </div>
                                        <div>
                                            <span>{businessInfo.organizationName}</span>
                                        </div>
                                    </Fragment>
                                )
                            }
                        </div>
                        {/* <div className="sep"></div> */}
                        <div className="payD">
                            <div className="amt">
                                Payment Amount: <strong>
                                    {invoiceData.currency ? invoiceData.currency.symbol : ""}{receiptData ? toMoney(receiptData.amount) : ""}{" "}
                                    {invoiceData.currency ? invoiceData.currency.code : ""}
                                </strong>
                            </div>
                            <div className="method">
                                <strong>PAYMENT METHOD</strong>:   {receiptData ? receiptData.method === 'card' ?
                                    <Fragment>
                                        <img src={process.env.WEB_URL.includes('localhost') ? `/${PaymentIcon[receiptData.card.type]}` : PaymentIcon[receiptData.card.type]} style={{ height: '24px', width: '38px' }} /> {receiptData.card.number}
                                    </Fragment>
                                    : receiptData.method === 'bank' ?
                                        <Fragment>
                                            <img src={PaymentIcon['bank']} style={{ height: '24px', width: '38px' }} /> {receiptData.bank && receiptData.bank.name} ••• {receiptData.bank && receiptData.bank.number && receiptData.bank.number}
                                        </Fragment>
                                        : receiptData.method === 'manual' ?
                                            <Fragment>
                                                {receiptData.manual && receiptData.manual.type}
                                            </Fragment>
                                            : ""
                                    : ""}
                            </div>
                            <div className="reciept-invoice-button">
                                <button
                                    className="btn btn-rounded btn-accent"
                                    type="button"
                                    onClick={() => { window.open(`${process.env.WEB_URL}/public/invoice/${invoiceData.uuid}`) }}
                                >
                                    View Invoice
                            </button>
                            </div>
                            <span>Or <a
                                target='_blank'
                                href={`${process.env.WEB_URL}/invoice/${invoiceData.uuid}/public/reciept-view/readonly/${receiptData && receiptData._id}`}
                                className="py-text--strong"
                            >
                                View reciept on web
                                </a>
                            </span>
                        </div>
                        {
                            invoiceData.status === 'paid' ?
                                <div className="status-image" style={{ marginBottom: '10px' }}>
                                    <img src="/assets/stamp.png" />
                                </div>
                                : ""
                        }
                        <div className="thanks">
                            Thanks for your business. If this invoice was sent in error, please contact <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                        </div>
                        <div className="foot"></div>
                    </Fragment>) : <CenterSpinner />
            }
        </div>
    )
}
