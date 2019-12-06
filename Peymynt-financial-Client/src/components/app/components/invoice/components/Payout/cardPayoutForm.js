import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { injectStripe, CardElement } from 'react-stripe-elements';
import Button from '@material-ui/core/Button';
import { Container, Row, Col, InputGroup, FormControl, Form, FormLabel } from 'react-bootstrap';
import paymentService from '../../../../../../api/paymentService';
import * as PaymentIcon from 'global/PaymentIcon';
import CardSection from '../../../sales/components/Checkouts/CardSection';
import InvoiceCardSection from './InvoiceCardSection';
import { toMoney } from '../../../../../../utils/GlobalFunctions';
// import CardSection from '../../../sales/components/Checkouts/CardSection';
import { Spinner } from 'reactstrap';

const style = {
	row: {
		maxWidth: '500px',
		marginRight: 'auto',
		marginLeft: 'auto',
		marginBottom: '0px',
		// paddingTop: '17px',
		textAlign: 'left'
	},
	col: {
		padding: '2px'
	},
	input: {
		borderColor: '#b2c2cd'
	},
	button: {
		color: '#fff',
		background: '#136acd',
		border: '1px solid transparent',
		padding: '6px 20px',
		textAlign: 'center',
		minWidth: '100%',
		borderRadius: '500px',
		display: 'inline-block',
		boxSizing: 'border-box',
		verticalAlign: 'middle',
		outline: 0,
		'&:hover': {
			background: '#0b59b1',
		}
	}
}

class CardPayoutForm extends React.Component {

	state = {
		cardInfo: {},
		saveCard: false,
		successPaid: false,
		paidAmount: null,
		loading: false
	}

	handleSubmit = (ev) => {
		ev.preventDefault();
		this.setState({ loading: true })
		let cardInfo = {};
		cardInfo.isSaveCard = { allowed: this.state.saveCard }

		this.props.stripe.createToken(cardInfo).then(({ token }) => {
			console.log('Received Stripe token:', token);
			this.proceedToPay(token);
		}).catch(err => {
			this.props.showSnackbar(err.message, true)
			this.setState({loading: false})
		})
	}

	proceedToPay = (tokenBody) => {
		const { invoiceData } = this.props;
		const { paidAmount } = this.state;
		if (!!tokenBody && !!tokenBody.id) {
			let paymentBody = {
				"paymentInput": {
					"uuid": invoiceData.uuid,
					"stripeToken": tokenBody.id,
					"amount": paidAmount ? parseFloat(paidAmount).toFixed(2) : invoiceData.dueAmount,
					"rawElementResponse": JSON.stringify(tokenBody),
					"method": 'card',
					'saveCard': this.state.saveCard,
					'cardHolderName': this.state.cardHolderName
				}
			};
			this.paymentCallback(paymentBody);
		} else {
			this.props.showSnackbar("Failed to establish secure connection for payment. Please try again.", true);
			this.setState({loading: false})
		}
	}

	paymentCallback = async (_checkoutPayment) => {
		try {
			const response = await paymentService.doCheckoutPayment(_checkoutPayment);
			if (response.statusCode === 200) {
				this.setState({ successPaid: true, loading: false });
				// this.props.showSnackbar("Payment Done", false);
				this.props.refreshData()
				this.props.openAlert(response.data.paymentResponse)
				// this.props.onPayment(true);
			} else {
				this.setState({ loading: false })
				this.props.showSnackbar(response.message, false);
			}
		} catch (error) {
			this.setState({ loading: false })
			console.log('error: ', error);
			this.props.showSnackbar(error.message, true)
		}
	}

	onFormValChange = (name, value) => {
		let cardInfo = this.state.cardInfo;
		cardInfo[name] = value;
		this.setState({ cardInfo: cardInfo });
	}

	onSaveSelect = (e) => {
		this.setState({ saveCard: !this.state.saveCard });
	}

	_setAmount = e => {
		const { name, value } = e.target;
		this.setState({
			paidAmount: parseFloat(value).toFixed(2)
			// 2invoiceData: {...this.state.invoiceData,
			// 	dueAmount: parseFloat(value).toFixed(2)
			// }
		})
	}

	render() {
		const { invoiceData } = this.props;
		const { successPaid, paidAmount } = this.state;
		console.log('paidAmount', paidAmount, invoiceData)
		if (!successPaid) {
			return (
				<form onSubmit={this.handleSubmit}>
					<div className="py-box py-box--large no-border">
							<div className="d-flex flex-column align-items-end">
								<ul className="list-inline m-0">
									<li className="list-inline-item"> <img src={`${PaymentIcon.visa}`} width='52px' style={{ margin: "0 5px" }} /></li>
									<li className="list-inline-item"> <img src={`${PaymentIcon.master}`} width='52px' style={{ margin: "0 5px" }} /></li>
									<li className="list-inline-item"> <img src={`${PaymentIcon.amex}`} width='52px' style={{ margin: "0 5px" }} /></li>
									<li className="list-inline-item"> <img src={`${PaymentIcon.discover}`} width='52px' style={{ margin: "0 5px" }} /></li>
								</ul>
								<span className="py-text--small py-text--hint">Credit, Debit and Prepaid Cards</span>
							</div>
						<Row style={style.row}>
							<InvoiceCardSection
								_handleCardHolder={(e) => this.setState({ cardHolderName: e.target.value })}
								sign={invoiceData && invoiceData.currency && invoiceData.currency.symbol}
								amount={!!paidAmount ? paidAmount : (invoiceData && toMoney(invoiceData.dueAmount, false))}
								_handleAmountChange={e => this.setState({ paidAmount: e.target.value })}
								_setAmount={e => this._setAmount(e)}
							/>
							{/* <CardElement style={{
	                        base: {
	                            fontSize: '18px'
	                        }
	                    }} className="card-element-payout" /> */}
							{/*<Col xs={6} style={style.col}>
						<FormControl
								  style = {style.input}
							      placeholder="Card Number"
							      onChange={(e)=>{
							      	this.onFormValChange('cardNumber', e.target.value);
							      }}
							    />
						</Col>
						<Col xs={3} style={style.col}>
						<FormControl
								  style = {style.input}
							      placeholder="MM/YY"
							      onChange={(e)=>{
							      	this.onFormValChange('expiry', e.target.value);
							      }}
							    />
						</Col>
						<Col xs={3} style={style.col}>
						<FormControl
								  style = {style.input}
							      placeholder="CVV"
							      onChange={(e)=>{
							      	this.onFormValChange('cvv', e.target.value);
							      }}
							    />
						</Col>*/}
						</Row>

						{/*
					<Row style={style.row}>
						<Col xs={6} style={style.col}>
						<FormControl
								  style = {style.input}
							      placeholder="Name on card"
							      onChange={(e)=>{
							      	this.onFormValChange('name', e.target.value);
							      }}
							    />
						</Col>
						<Col xs={3} style={style.col}>
						<FormControl
								  style = {style.input}
							      placeholder="ZIP / Postal"
							      onChange={(e)=>{
							      	this.onFormValChange('zip', e.target.value);
							      }}
							    />
						</Col>
						<Col xs={3} style={style.col}>
						<FormControl
								  style = {style.input}
							      placeholder="Amount"
							      defaultValue={invoiceData.currency.symbol +' '+ invoiceData.amountBreakup.total}
							      disabled
							      onChange={(e)=>{
							      	this.onFormValChange('amount', e.target.value);
							      }}
							    />
						</Col>
					</Row>
				*/}

						<Row style={style.row}>
							<Form.Group controlId="formBasicChecbox">
								<Form.Check type="checkbox" label={"Save this credit card and allow " + invoiceData.businessId.organizationName + " to automatically charge it for future invoices"} onChange={this.onSaveSelect} className="cardSave-check" />
							</Form.Group>
						</Row>

						<Row style={style.row}>
							<button className="btn btn-primary btn-block" disabled={this.state.loading}>
								<i className="fa fa-lock mr-1" /> {this.state.loading ? <Spinner size="sm" color="light" /> : `Pay ${invoiceData.currency.symbol}${!!paidAmount ? paidAmount : toMoney(invoiceData.dueAmount)}`}
							</button>
						</Row>
					</div>
				</form>
			)
		}
		else {
			return (
				<div style={{ width: '100%', textAlign: 'center' }}>
					<h1> Success </h1>
				</div>
			)
		}
	}
}

export default injectStripe(CardPayoutForm);