import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap';
import Cards from 'global/Card';
import { getAmountToDisplay } from '../../../../../utils/GlobalFunctions';
import { NavLink } from 'react-router-dom';

export const PaymentDetails = ({row, classes, account}) =>  {
    let arrows = {
        imgArrowRefund: `${process.env.CDN_URL}/static/web-assets/arrow_left.svg`,
		imgArrowSuccess: `${process.env.CDN_URL}/static/web-assets/arrow_success.svg`,
		imgArrowDeclined: `${process.env.CDN_URL}/static/web-assets/arrow_declined.svg`,
		imgArrowLeft: `${process.env.CDN_URL}/static/web-assets/arrow_left.svg`
    }
    return (
        <div className="payments-list__item--body">

            <div className="payment-list__item-amount">
                {
                    !!row.amountBreakup ? (
                        <Fragment>
                            <div className="d-flex justify-content-between mb-4">
                                <div>Amount</div>
                                <div> {getAmountToDisplay(row.currency, row.amount)} </div>
                            </div>
                            {
                                !!row.amountBreakup.fee && (
                                    <div className="d-flex justify-content-between mb-2">
                                        <div>Fee</div>
                                        <div> {getAmountToDisplay(row.currency, row.amountBreakup.fee)} </div>
                                    </div>
                                )
                            }
                            {
                                row.status == "REFUNDED" ? (
                                    <div>
                                        <div className="d-flex justify-content-between pt-3 mb-4">
                                            <div><strong>You get</strong></div>
                                            <div><strong> (Refunded) <strike>{getAmountToDisplay(row.currency, (row.amountBreakup.total - row.amountBreakup.fee))}</strike></strong></div>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>Refund</div>
                                            <div><NavLink to={`payments/view-refund/${row.id}`}>View</NavLink> {getAmountToDisplay(row.currency, row.amountBreakup.total)} </div>
                                        </div>
                                    </div>
                                ) : (

                                        <div className="d-flex justify-content-between pt-3">
                                            <div><strong>You get</strong></div>
                                            <div><strong>{getAmountToDisplay(row.currency, !!row.amountBreakup ? (row.amountBreakup.total - row.amountBreakup.fee) : row.amount)} </strong></div>
                                        </div>
                                    )
                            }
                        </Fragment>
                    ) :
                        row.status == "REFUNDED" ? (
                            <div>
                                <div className="d-flex justify-content-between">
                                    <div>Your customer gets</div>
                                    <div> {getAmountToDisplay(row.currency, row.amount)}</div>
                                </div>
                            </div>
                        ) : (

                                <div className="d-flex justify-content-between pt-3">
                                    <div><strong>You get</strong></div>
                                    <div><strong>{getAmountToDisplay(row.currency, !!row.amountBreakup ? row.amountBreakup.total : row.amount)} </strong></div>
                                </div>
                            )
                }
            </div>
            <div className="payment-cards__container">
                <div className="payment-cards__item">
                    <span className="py-text py-text--hint">Your customer's credit card</span>
                    <Cards
                        number={row.method !== 'bank' ? row.card && row.card.number : row.bank && row.bank.number}
                        name={row.method !== 'bank' ? row.card && row.card.cardHolderName : row.bank && row.bank.name}
                        issuer={(row.method) ? row.method : ''}
                        method={row.method !== 'bank' ? row.card : row.bank}
                        preview={true}
                    />
                </div>

                <div className="payment-cards__indicator">
                    <img
                        src={row.status.toLowerCase() === 'success' ? arrows.imgArrowSuccess : row.status.toLowerCase() === 'refunded' ? arrows.imgArrowRefund : arrows.imgArrowDeclined}
                    />
                    </div>

                <div className="payment-cards__item">
                    <span className="py-text py-text--hint">Your account</span>

                        <div className={`${classes.myAccount} py-payment-card py-payment__bank`}>
                            <div className="py-payment__bank-icon">
                                <i className="fas fa-university"></i>
                            </div>
                            <div>
                                <div className="py-payment__bank-name">{row.ownAccount.bankName}</div>
                                <div className="py-payment__bank-number">{account}</div>
                            </div>

                            <div className="py-payment__bank__link">
                                <a hre="#" className="py-text--link">View payout</a>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}
