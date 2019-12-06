import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

class PaymentInit extends PureComponent {

	render () {
		const { classes } = this.props;
		return (
			<div className="content-wrapper__main__fixed">

					<header className="py-header py-header--page text-center">
						<div className="py-header--title">
							<h5 className="text-primary">PAYMENT BY PEYMYNT</h5>
							<div className="py-heading--title mb-3">Your customers can pay you online.</div>
						</div>
					</header>

					<div className="text-center">
						<div className="py-heading--subtitle mt-0">Get paid by your customers using:</div>

						<Row className="justify-content-center">
							<Col md={10}>
							<Row className="justify-content-center">
								<Col md={4} className="d-flex">
									<a className="card card-body card-hover p-4 justify-content-start align-items-center" onClick={()=>{this.props.history.push('/app/invoices')}}>
											<img src='/assets/images/invoices.png' style={{maxWidth: '48px'}} className="mb-3"/>
												<h5>Invoices</h5>
												<div>Faster payments means better cash flow.</div>
									</a>
								</Col>
								<Col md={4} className="d-flex">
									<a className="card card-body card-hover p-4 justify-content-start align-items-center" onClick={()=>{this.props.history.push('/app/recurring')}}>
											<img src='/assets/images/recuring.png' style={{maxWidth: '48px'}} className="mb-3"/>
												<h5>Recurring invoices</h5>
												<div>Get paid automatically from repeat customers.</div>
									</a>
								</Col>
								<Col md={4} className="d-flex">
									<a className="card card-body card-hover p-4 justify-content-start align-items-center" onClick={()=>{this.props.history.push('/app/sales/checkouts')}}>
											<img src='/assets/images/checkout.png' style={{maxWidth: '48px'}} className="mb-3"/>
												<h5>Checkout</h5>
												<div>Accept payments directly from your website. No coding required.</div>
									</a>
								</Col>
							</Row>
							</Col>
						</Row>

					</div>

					<div className="text-center w-75 mx-auto mt-4">
						<div>
							<img src='/assets/images/payout.png' className="mb-3" style={{height: '70px', width: '70px'}}/>
							<h5>Want to get you first payout even faster?</h5>
							<p className="w-75 mx-auto">You can verify your identity and tell us where to deposit your money even before receiving your first payment.</p>
							<button className="btn btn-primary"  onClick={()=>{this.props.history.push('/app/payments/onboarding')}}>
								Setup payment
							</button>
						</div>
					</div>
				</div>
		)
	}
}

export default  (PaymentInit);