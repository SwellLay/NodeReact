import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { injectStripe, CardElement, CardNumberElement, CardExpiryElement, CardCVCElement, PaymentRequestButtonElement, IbanElement, IdealBankElement, PostalCodeElement } from 'react-stripe-elements';
import {
	Input,
	InputGroupAddon,
	InputGroup,
	Button,
	Spinner
} from "reactstrap";
import { Container, Row, Col, FormControl, Form, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import paymentService from '../../../../../api/paymentService';
import * as PaymentIcon from 'global/PaymentIcon';
import { autoRehydrate } from 'redux-persist';
import SweetAlertSuccess from '../../../../../global/SweetAlertSuccess';
import { getAmountToDisplay, _setCurrency } from '../../../../../utils/GlobalFunctions';
import { stripeStyle } from '../../../../../global/commonStyles';
// import CardSection from '../../../sales/components/Checkouts/CardSection';

const style = {
	row: {
		paddingTop: '14px',
	},
	row2: {
		marginLeft: 'auto',
		padding: '14px 0 0',
	},
	row3: {
		margin: '0 auto',
		maxWidth: '250px',
		paddingTop: '14px',
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

class InvoiceCardPayout extends React.Component {

	state = {
		cardInfo: {},
		saveCard: false,
		successPaid: false,
		paidAmount: null,
		isEditAmount: false,
		cardHolderName: "",
		loading: false
	}

	componentDidMount() {
		const { invoiceData } = this.props;
		const { paidAmount } = this.state;
		this.setState({ paidAmount: paidAmount ? parseFloat(paidAmount).toFixed(2) : parseFloat(invoiceData.dueAmount).toFixed(2) });
	}

	handleSubmit = (ev) => {
		ev.preventDefault();
		this.setState({loading: true})
		let cardInfo = {};
		cardInfo.isSaveCard = { allowed: this.state.saveCard }
		this.props.stripe.createToken().then( res => {
			const { token } = res
			if(typeof res.error === 'object'){
				if(res.error.hasOwnProperty('message')){
					this.props.showSnackbar(res.error.message, true);
					this.setState({loading: false})
				}
			}else{
				this.proceedToPay(token);
			}
		}).catch (err => {
			this.props.showSnackbar(err.message, true);
			this.setState({loading: false})
			console.error("err card", err)
		})
	}

	proceedToPay = (tokenBody) => {
		const { invoiceData } = this.props;
		const { paidAmount, saveCard, cardHolderName } = this.state;

		const _amount = paidAmount ? paidAmount : invoiceData.dueAmount;

		let paymentBody = {
			"paymentInput": {
				"uuid": invoiceData.uuid,
				"stripeToken": tokenBody.id,
				"method": "card",
				"amount": parseFloat(_amount),
				"saveCard": saveCard,
				"cardHolderName": cardHolderName,
				"rawElementResponse": JSON.stringify(tokenBody),

			}
		};
		this.paymentCallback(paymentBody);

	}

	paymentCallback = async (_checkoutPayment) => {
		try {
			const response = await paymentService.doCheckoutPayment(_checkoutPayment);
			if (response.statusCode === 200) {
				this.setState({ successPaid: true, loading: false });
				this.props.openAlert(response.data.paymentResponse, 0)
				this.props.refreshData();
			} else {
				this.setState({ loading: false });
				this.props.showSnackbar(response.mesage, true);
			}
		} catch (error) {
			this.setState({ loading: false });
			console.error('error: ', error);
			this.props.showSnackbar(error.message, true)
		}
	}

	onFormValChange = (name, value) => {
		let cardInfo = this.state.cardInfo;
		cardInfo[name] = value;
		this.setState({ cardInfo: cardInfo });
	}

	onSaveSelect = (e) => {
		this.setState({ saveCard: e.target.checked });
	}

	togglEditAmount = (evt) => {
		this.setState({
			isEditAmount: true
		});
	}

	handleAmountChange = event => {
		const { value } = event.target;
		this.setState({ paidAmount: value });
	};

	_setAmount = e => {
		const { name, value } = e.target;
		this.setState({
		  paidAmount: parseFloat(value).toFixed(2)
		})
	  }

	render() {
		const { invoiceData, receipt, receiptIndex, businessInfo } = this.props;
		const { successPaid, paidAmount } = this.state;
		console.log("_setCurrency(invoiceData.currency && invoiceData.currency, businessInfo.currency)", _setCurrency(invoiceData.currency && invoiceData.currency, businessInfo.currency))
		if (!successPaid) {
			return (
				<form className="invoice__record__modal__content" onSubmit={this.handleSubmit}>
					<div>
						<FormGroup row>
							<div  hidden={!this.state.isEditAmount}>
								<InputGroup size="normal">
									<InputGroupAddon addonType="prepend" className="prependAddon-input-card">
										{_setCurrency(invoiceData.currency && invoiceData.currency, businessInfo.currency).symbol}
									</InputGroupAddon>
									<Input
										type="type"
										value={paidAmount}
										step="any"
										onChange={this.handleAmountChange}
										name="dueAmount"
										placeholder="Amount"
										className="border-left-no"
										onBlur={this._setAmount.bind(this)}
										className="stripe-control text-strong"
									/>
								</InputGroup>
							</div>
							<div hidden={this.state.isEditAmount} className="d-flex justify-content-between align-items-center">
								<label className="py-text--strong">
									<span className="d-block text-muted">Amount</span>
									<span className="h3">{getAmountToDisplay(_setCurrency(invoiceData.currency && invoiceData.currency, businessInfo.currency), paidAmount)}</span>
								</label>
								<button type="button" size={"sm"} className="btn btn-xs btn-outline-primary" onClick={this.togglEditAmount}>Edit</button>
							</div>

						</FormGroup>
						<FormGroup>
								<Input type="text" placeholder="Name on card" className="py-stripe__element w-100 m-0" onChange={(e) => this.setState({cardHolderName: e.target.value})}/>
							</FormGroup>

							<FormGroup>
								<div className="payment-view__card-number">
										<div className="py-stripe__element">
											<CardNumberElement style={stripeStyle} placeholder="Card number" />
										</div>
									</div>
							</FormGroup>

							<FormGroup className="payment-view__input-group">	
								<InputGroup>
									<div className="payment-view__expire-date">
										<div className="py-stripe__element">
											<CardExpiryElement style={stripeStyle}/>
										</div>
									</div>

									<div className="payment-view__cvc">
										<div className="py-stripe__element">
											<CardCVCElement style={stripeStyle}/>
										</div>
									</div>
									<div className="py-stripe__element payment-view__zip-postal">
										<PostalCodeElement style={stripeStyle} placeholder="ZIP/Postal"/>
									</div>
								</InputGroup>

							</FormGroup>

						<FormGroup>
							<label className="py-checkbox">
								<input
								type="checkbox"
								className="py-form__element"
								onChange={this.onSaveSelect}
								/>
								<span className="py-form__element__faux"></span>
								<span className="py-form__element__label">Save this card for future payments.</span>
							</label>
						</FormGroup>
					</div>

					<div className="d-flex justify-content-between mt-5">
							<button type="button" className="btn btn-outline-primary" onClick={this.props.onBack}>Back</button>
							<button type="submit" className="btn btn-primary">
								{ this.state.loading ? <Spinner size="sm" color="light" />  : 'Record payment'}
							</button>
					</div>
				</form>
			)
		}
		else {
			return (
				<SweetAlertSuccess showAlert={true}
					title="Record a payment"
					message="The payment was recorded."
					receipt={receipt}
					receiptIndex={receiptIndex}
					onConfirm={this.props.onOpenReceiptMail}
					onCancel={this.onCloseAlert}
				/>
			)
		}
	}
}

export default injectStripe(InvoiceCardPayout);