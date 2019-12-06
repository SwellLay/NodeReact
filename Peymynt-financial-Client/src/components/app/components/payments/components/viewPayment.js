import React, { PureComponent, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link, browserHistory } from 'react-router-dom';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import moment from 'moment';
import { Container, Row, Col, Tabs, Tab, InputGroup, Form, FormControl, Modal } from 'react-bootstrap';
import Cards from 'global/Card';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import * as PaymentIcon from 'global/PaymentIcon';
import { getPaymentById, getRefundByPaymentId, postNewRefund } from '../../../../../actions/paymentAction';
import { getAmountToDisplay, _documentTitle } from "../../../../../utils/GlobalFunctions";
import { PaymentDetails } from "./PaymentDetails";
import { RefundModal } from "./RefundModal";
import { toDisplayDate } from "../../../../../utils/common";
import { openGlobalSnackbar } from "../../../../../actions/snackBarAction";

const styles = theme => ({
	statusSUCCESS: {
		padding: '3px',
		color: '#14713f',
		backgroundColor: '#adf0cc',
		fontWeight: '900',
		textAlign: 'center',
		fontSize: '12px',
		borderRadius: '3px',
		maxWidth: '125px',
	},
	statusDECLINED: {
		padding: '3px',
		color: '#686307',
		backgroundColor: '#eee991',
		fontWeight: '900',
		textAlign: 'center',
		fontSize: '12px',
		borderRadius: '3px',
		maxWidth: '125px',
	},
	statusREFUNDED: {
		padding: '3px',
		color: '#686307',
		backgroundColor: '#eee991',
		fontWeight: '900',
		textAlign: 'center',
		fontSize: '12px',
		borderRadius: '3px',
		maxWidth: '125px',
	},
	paymentExpandableBodySuccess: {
		padding: '14px',
		background: '#70fb481f'
	},
	paymentExpandableBodyDeclined: {
		padding: '14px',
		background: '#70fb481f'
	},
	viewInvoiceButton: {
		color: '#fff',
		background: '#136acd',
		border: '1px solid transparent',
		padding: '6px 20px',
		textAlign: 'center',
		minWidth: '100px',
		borderRadius: '500px',
		display: 'inline-block',
		boxSizing: 'border-box',
		verticalAlign: 'middle',
		outline: 0,
		margin: '10px',
		'&:hover': {
			background: '#0b59b1',
		}
	},
	refundButton: {
		color: '#136acd',
		background: '#fff',
		border: '1px solid transparent',
		padding: '6px 20px',
		textAlign: 'center',
		minWidth: '100px',
		borderRadius: '500px',
		display: 'inline-block',
		boxSizing: 'border-box',
		verticalAlign: 'middle',
		outline: 0,
		margin: '10px',
		'&:hover': {
			border: '1px solid #136acd',
		}
	},
	paymentFooter: {
		width: '100%',
		textAlign: 'right'
	},
	expandableHeader: {
		fontSize: '20px',
		fontWeight: '600',
		paddingBottom: '10px'
	},
	expandableSubHeader: {
		marginBottom: '27px',
		color: 'dimgrey',
		whiteSpace: 'initial'
	},
	myAccount: {
		width: '260px',
		height: '150px',
		background: 'linear-gradient(25deg, #013aff, #7f92ff)',
		borderRadius: '16px',
		textAlign: 'left',
		paddingTop: '18%',
		fontSize: '15px',
		fontWeight: '600',
		color: 'white',
		paddingLeft: '22px'
	},
	dropDownItems: {
		fontSize: '14px',
		whiteSpace: 'pre-line',
		padding: '5px'
	},
	refundDialog: {
		maxWidth: '610px'
	},
	editAmount: {
		maxWidth: '70px',
		marginTop: '-2px',
		marginRight: '4px',
		marginLeft: '4px',
		maxHeight: '28px',
		'&:disabled': {
			border: '0px',
			width: '50px',
			backgroundColor: 'transparent',
			marginTop: '-2px'
		}
	}
})

class ViewPayment extends PureComponent {

	state = {
		modal_0: false,
		editMountRefund: true
	}

	componentDidMount() {
		this.props.getPayment(this.props.match.params.id);
		_documentTitle({}, 'Payment details')
		this.props.getRefundByPaymentId(this.props.match.params.id);
	}

	componentWillReceiveProps(nextProps){
		if(this.props.refundInfo !== nextProps.refundInfo){
			console.log("refundInfo", nextProps.refundInfo)
		}
	}

	handleRefundModalOpen = (index) => {
		let a = {};
		a['modal_' + index] = true;
		this.setState(a);
	}
	handleRefundModalClose = (index) => {
		let a = {};
		a['modal_' + index] = false;
		this.setState(a);
	}

	RefundModal = (props) => {
		let style = {
			leftCol: {
				textAlign: 'right',
				fontSize: '16px',
				fontWeight: '500'
			},
			rightCol: {
				textAlign: 'left',
				fontSize: '16px',
				fontWeight: '500'
			},
			formRow: {
				padding: '10px'
			}
		};
		let body = {
			paymentId: props.data.id,
			refundAmount: props.data.amount,
			reason: ''
		};

		console.log("props refund", props)

		return (
			<RefundModal
				open = {this.state['modal_' + props.data.index]}
				styles = {style}
				editMountRefund = {this.state.editMountRefund}
				postRefund = {() => this.postRefund(body, props.data.index)}
				changeBody = {(name, value) => {
					// console.log("body", typeof value, value)
					if(name === 'refundAmount'){
						body[name] = parseFloat(value)
					}else{
						body[name] = value
					}
				}}
				_setAmount = {(value) => body.refundAmount = parseFloat(value).toFixed(2)}
				handleRefundModalClose = {() => this.handleRefundModalClose(props.data.index)}
				setEditRefund = {(value) => this.setState({ editMountRefund: !this.state.editMountRefund})}
				{...props}
				classes={`${this.props.classes}`}
			/>
		)
	}

	postRefund = (body, index) => {
		console.log("Posting refund view : "+JSON.stringify(body));
		if(!!body.reason){
			this.props.postRefund({
				refundInput: body
			})
			this.handleRefundModalClose(index);
			// window.close()
		}else{
			this.props.openGlobalSnackbar('Select reason first.', true)
		}
	}

	getHeaderOfExpandable = (row) => {
		const { classes } = this.props;
		if (row.status == "SUCCESS") {
			return (
				<div>
					<div className={classes.expandableHeader}>
						Payment Successful for&nbsp;
						{
							row.paymentType.toLowerCase() == "invoice" ?
								<Fragment>
									<Link style={{color: '#0a7d4e'}} to={"/app/invoices/view/" + row.invoiceId}>{`Invoice #${row.other ? row.other.invoiceNo : ''}`}</Link>
								</Fragment>
							:
								<Fragment>
									<Link style={{color: '#0a7d4e'}} to={"/app/sales/checkouts/edit/" + row.checkoutId}>{`${row.other ? row.other.checkoutName : ''}`}</Link>
								</Fragment>
						}
					</div>
					<div className={classes.expandableSubHeader}>
						<i className="fas fa-info-circle" /> Paid out on {moment.parseZone(row.date).format("MMMM DD, YYYY")}
					</div>
				</div>
			)
		}
		else if (row.status == "DECLINED") {
			return (
				<div>
					<div className={classes.expandableHeader}>
						Your customer's credit card was declined for <Link style={{color: '#6c640c'}} to={row.paymentType && row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>{row.paymentType}</Link>
					</div>
					<div className={classes.expandableSubHeader}>
						<i className="fas fa-info-circle" /> Your customer should be aware of the issue, but you may need to reach out to them if they don't successfully retry with another payment method.
					</div>
				</div>
			)
		}
		else if (row.status == "REFUNDED") {
			return (
				<div>
					<div className={classes.expandableHeader}>
						Payment Successful for&nbsp;
						{
							row.paymentType.toLowerCase() == "invoice" ?
								<Fragment>
									<Link style={{color: '#b8b117'}} to={"/app/invoices/view/" + row.invoiceId}>{`Invoice #${row.other ? row.other.invoiceNo : ''}`}</Link>
								</Fragment> :
								<Fragment>
									<Link style={{color: '#b8b117'}} to={"/app/sales/checkouts/edit/" + row.checkoutId}>{`${row.other ? row.other.checkoutName : ''}`}</Link>
								</Fragment>
						}
					</div>
					<div className={classes.expandableSubHeader}>
						<i className="fas fa-info-circle" /> Paid out on {moment.parseZone(row.date).format("MMMM DD, YYYY")}
					</div>
				</div>
			)
		}
	}

	render() {
		let row = null;
		const { classes, paymentInfo } = this.props;
		let account, icon;
		console.log("paymentInfo", paymentInfo)
		if (paymentInfo) {
			row = {
				id: paymentInfo.id,
				status: paymentInfo.status,
				method: paymentInfo.paymentIcon,
				date: paymentInfo.paymentDate.successDate,
				customer: `${paymentInfo.customer.firstName} ${paymentInfo.customer.lastName}`,
				totalAmount: paymentInfo.amount.total,
				amount: paymentInfo.amount,
				account: paymentInfo.account,
				paymentType: paymentInfo.paymentType,
				linkId: paymentInfo.paymentType === 'Invoice' ? paymentInfo.invoiceId : paymentInfo.refundId,
				ownAccount: paymentInfo.ownAccount,
				index: 0,
				amountBreakup: paymentInfo.amountBreakup,
				refund: paymentInfo.refund.id,
				other: paymentInfo.other,
				currency: paymentInfo.currency || {symbol: "$"},
				card: paymentInfo.card,
				bank: paymentInfo.bank,
				invoiceId: paymentInfo.invoiceId,
				checkoutId: paymentInfo.checkoutId,
			};

			account = row.ownAccount.accountNumber.split('');
			account.splice(0, account.length - 3, 'xxxx');
			account = account.join('');

			icon = PaymentIcon[row.method] ? PaymentIcon[row.method] : row.method;
		}
		let RefundModal = this.RefundModal;
		if (row) {
			console.log("row", row)
			return (
				
				// <div>
				<div className="content-wrapper__main">
					<header class="py-header--page">
						<div class="py-header--title">
							<h2 class="py-heading--title">Payment details</h2>
						</div>
					</header>
					{/* <h2 className="py-heading--title">Payment details</h2> */}
					<div className={classes.paymentExpandable}
						style={{
							minWidth: '950px',
							marginRight: 'auto',
							marginLeft: 'auto',
							padding: '10px',
							boxShadow: '1px 2px 5px lightgrey'
						}}
					>
						<RefundModal data={row} />
						<Container>
							<Row style={{ marginBottom: '12px' }}>
								<Col><div className={classes['status' + row.status]}>{row.status}</div></Col>
								<Col><img src={process.env.WEB_URL.includes('localhost') ? `/${icon}` : icon} width='35px' /></Col>
								<Col xs={3}>{toDisplayDate(row.date, true, "MMM D, YYYY @ HH:mm A")}</Col>
								<Col>{row.customer}</Col>
								<Col>{getAmountToDisplay(row.currency, row.amountBreakup.total)}</Col>
							</Row>
						</Container>
						<div className={row.status == 'SUCCESS' ? classes.paymentExpandableBodySuccess : classes.paymentExpandableBodyDeclined}>
							{
								this.getHeaderOfExpandable(row)
							}
							<PaymentDetails row={row} {...this.props} account={account}/>
						</div>
						<div className={`${classes.paymentFooter} payment-list__footer`}>
							{row.status == "SUCCESS" ? (
								<button className="btn btn-outline-primary" onClick={() => { this.handleRefundModalOpen(row.index) }}>
									Refund
								</button>) : ''
							}
							<Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>
								<button className="btn btn-primary">
									View {row.paymentType}
								</button>
							</Link>
						</div>
					</div>
			</div>
				// </div>
			)
		}
		else {
			return (<div> </div>)
		}
	}

}

const mapStateToProps = (state) => {
	return {
		paymentInfo: state.paymentReducer.paymentInfo,
		refundInfo: state.paymentReducer.refundInfo
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getPayment: (body) => {
			dispatch(getPaymentById(body))
		},
		getRefundByPaymentId: (body) => {
			dispatch(getRefundByPaymentId(body))
		},
		postRefund: (body) => {
			dispatch(postNewRefund(body))
		},
		openGlobalSnackbar: (message, error) => {
			dispatch(openGlobalSnackbar(message, error))
		}
	}
}

export default compose(
	withStyles(styles, { name: 'Payments' }),
	connect(mapStateToProps, mapDispatchToProps)
)(ViewPayment);