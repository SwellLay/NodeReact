import React, { Component } from 'react'
import { Button, Card, CardBody, Col, Container, Row, Spinner } from 'reactstrap';
import history from '../../../../../../customHistory';
import { ShowPaymentIcons } from '../../../../../../global/ShowPaymentIcons';
import { terms } from '../../../../../../utils/GlobalFunctions';

export default class NoCheckouts extends Component {
    render() {
        const{ isPaymentEnabled, checkouts, isLoadingData } = this.props
        return (
            <div>
                <Row className="card-body pd0 no-checkouts" hidden={(checkouts && checkouts.length > 0) || isLoadingData === true}>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <img src="../../../assets/images/no-checkouts.svg" className="img-fluid mrR0"
                        alt="" />
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} className="mrT50">
                        <h6 className="text-primary"> CHECKOUTS </h6><br></br>
                        <h2 className="">
                            Accept payments directly from your website.
                        </h2>
                        <h4 className="">
                            No coding required.
                        </h4>
                        <h4 className="text-secondry mrT10"> Just 3.5% + 30¢ per transaction </h4>

                        <button hidden={isPaymentEnabled} onClick={() => history.push('/app/payments')} className="btn mt-4 btn-primary">Turn on payments</button>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} className="mrT10 text-center">
                        <Button hidden={!isPaymentEnabled} onClick={() => history.push('/app/sales/checkouts/add')} className="btn btn-primary">Create your first checkout</Button>
                        <div className="payment__cards__list__item-big">
                            <ShowPaymentIcons
                                icons={['visa', 'master', 'amex', 'bank']}
                                className="icon big-icon"
                            />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} className="mrT10 text-center">
                        <div className="py-box checkouts-inline-payments-provision__promo-body">
                            <div className="py-box__content">
                                <ul className="py-list--icon">
                                    <li className="">
                                        <i className="fa fa-check"/>
                                        {/* <svg className="py-svg-icon"><use xlink:href="#check"></use></svg> */}
                                        <strong className="py-text--strong">No surprise fees, ever.</strong> No setup, monthly, or hidden fees.
                                    </li>
                                    <li className="">
                                        <i className="fa fa-check"/>
                                        {/* <svg className="py-svg-icon"><use xlink:href="#check"></use></svg> */}
                                        <strong className="py-text--strong">You're in control.</strong> Customize payment methods anytime.
                                    </li>
                                    <li className="">
                                        <i className="fa fa-check"/>
                                        {/* <svg className="py-svg-icon"><use xlink:href="#check"></use></svg> */}
                                        <strong className="py-text--strong">Flexible for your needs.</strong> Receive automatic payments through Invoicing by Peymynt.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} className="mrT10 text-center">
                        <div className="checkouts-inline-payments-provision__terms-footer">
                            <span className="py-text py-text--hint">
                                By continuing, you are agreeing to the Payments by Peymynt <a className="py-text--link-external" href="javascript: void(0)" onClick={() => terms()} rel="noopener noreferrer" target="_blank">Terms of Service</a>.
                            </span>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
