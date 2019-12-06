import React, { Fragment } from 'react';
import { convertDateToYMD } from '../../utils/common';
import * as PaymentIcon from 'global/PaymentIcon';
import CenterSpinner from '../CenterSpinner';
import { toMoney } from '../../utils/GlobalFunctions';

export const RecieptPreview = ({ invoiceData, businessInfo, receiptData, userInfo, salesSettings }) => (
    <div className="Receipt">
        {
            !!invoiceData && !!businessInfo && !!receiptData ?
                (<Fragment>
                    <div className="logo"><img src={!!salesSettings ? salesSettings.companyLogo : "/assets/Total.png"} alt="" /></div>
                    <h2 className="py-text--strong mrT30">Payment Receipt</h2>
                    <span className="receiptNo">
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
                    <p>{businessInfo.organizationName} <br />
                        {/* {userInfo.firstName} */}
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
                    </p>
                    <div className="sep"></div>
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
                    </div>
                    <div className="thanks color-muted">
                        Thanks for your business. If this invoice was sent in error, please contact <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                    </div>
                    <div className="foot"></div>
                </Fragment>) : <CenterSpinner />
        }

    </div>
)