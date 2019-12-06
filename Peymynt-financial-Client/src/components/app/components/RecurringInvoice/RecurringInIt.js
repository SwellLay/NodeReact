import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import history from "../../../../customHistory";
// import history from ''
class RecurringInit extends PureComponent {

	render () {
		const { classes } = this.props;
		return (
			<div className="content-wrapper__main__fixed">

					<header className="py-header py-header--page text-center">
						<div className="py-header--title">
							<h5 className="text-primary">RECURRING INVOICES</h5>
							<div className="py-heading--title mb-3">Bill your repeat customers and get paid without lifting a finger.</div>
						</div>
					</header>
                    <div className="text-center mrT10 mrB30">
                        <button className="btn btn-primary"  onClick={()=>{history.push('/app/recurring/add')}}>
                            Create a recurring invoice
                        </button>
                    </div>
					<div className="text-center">
						{/* <div className="py-heading--subtitle mt-0">Get paid by your customers using:</div> */}

						<Row className="justify-content-center">
							<Col md={10}>
							<Row className="justify-content-center">
								<Col md={4} className="d-flex">
									<a className="card card-body card-hover p-4 justify-content-start align-items-center">
											<img src='/assets/icon-a1.png' style={{maxWidth: '48px'}} className="mb-3"/>
												<h5>Automatic payments</h5>
												<div>Charge your customer's saved credit card automatically to get paid instantly.</div>
									</a>
								</Col>
								<Col md={4} className="d-flex">
									<a className="card card-body card-hover p-4 justify-content-start align-items-center">
											<img src='/assets/images/recuring.png' style={{maxWidth: '48px'}} className="mb-3"/>
												<h5>Flexible scheduling</h5>
												<div>Fully customizable so your customers get your invoices exactly what you want.</div>
									</a>
								</Col>
								<Col md={4} className="d-flex">
									<a className="card card-body card-hover p-4 justify-content-start align-items-center">
											<img src='/assets/images/invoices.png' style={{maxWidth: '48px'}} className="mb-3"/>
												<h5>Proffessional invoices</h5>
												<div>Created beautiful, branded invoices that your customers will love and trust.</div>
									</a>
								</Col>
							</Row>
							</Col>
						</Row>

					</div>

					{/* <div className="text-center w-75 mx-auto mt-4">
						<div>
							<img src='/assets/images/payout.png' className="mb-3" style={{height: '70px', width: '70px'}}/>
							<h5>Want to get you first payout even faster?</h5>
							<p className="w-75 mx-auto">You can verify your identity and tell us where to deposit your money even before receiving your first payment.</p>

						</div>
					</div> */}
				</div>
		)
	}
}

export default  (RecurringInit);