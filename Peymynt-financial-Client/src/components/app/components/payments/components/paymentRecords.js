import React, { PureComponent, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link, browserHistory } from 'react-router-dom';
import { Container, Row, Col, Tabs, Tab, InputGroup, Form, FormControl, Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import moment from 'moment';
// import Cards from 'react-credit-cards';
import Cards from 'global/Card';
import 'react-credit-cards/es/styles-compiled.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import * as PaymentIcon from 'global/PaymentIcon';
import visa from 'payment-icons/min/flat/visa.svg';

// import RefundModal from './RefundModal';
import { toMoney, getAmountToDisplay } from "../../../../../utils/GlobalFunctions";
import { toDisplayDate } from "../../../../../utils/common";
import { PaymentDetails } from "./PaymentDetails";
import { RefundModal } from "./RefundModal";
import NavItem from "react-bootstrap/NavItem";
import TabPane from "react-bootstrap/TabPane";
import compose from 'recompose/compose';
import { postNewRefund } from '../../../../../actions/paymentAction';
import { openGlobalSnackbar } from '../../../../../actions/snackBarAction';
import { connect } from 'react-redux';
import DatepickerWrapper from "../../../../../utils/formWrapper/DatepickerWrapper";

const styles = theme => ({
	container: {
		width: "1206px",
		marginTop: '24px',
		marginBottom: '24px',
		marginRight: '-177px',
		marginLeft: 'auto'
	},
	header: {
		marginLeft: '0px',
		paddingLeft: '0px'
	},
	datePickerCol: {
		margin: '0px',
		padding: '0px'
	},
	startDatePicker: {
		maxWidth: '150px',
		height: '37px',
		borderBottomLeftRadius: '5px',
		borderTopLeftRadius: '5px',
		borderWidth: '1px',
		borderColor: 'lightgrey',
		paddingLeft: '10px'
	},
	endDatePicker: {
		maxWidth: '150px',
		height: '37px',
		borderBottomRightRadius: '5px',
		borderTopRightRadius: '5px',
		borderWidth: '1px',
		borderColor: 'lightgrey',
		paddingLeft: '10px'
	},
	table: {
	},
	tableHeader: {

	},
	tableColumn: {
		border: '0px'
	},
	tabContainer: {
		marginRight: '245px',
		marginTop: '24px'
	},
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
	payments: {
		color: '#0ea90e',
		fontSize: '16px',
		fontWeight: '500'
	},
	paymentExpandable: {
	},
	paymentExpandableBodySuccess: {
		padding: '16px',
		background: '#beffdc',
		borderRadius: '6px'
	},
	paymentExpandableBodyDeclined: {
		padding: '16px',
		background: '#fefcc9',
		borderRadius: '6px'
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
		color: '#4d6575',
		background: '#fff',
		border: '1px solid #ebeff4',
		padding: '6px 20px',
		textAlign: 'center',
		minWidth: '100px',
		borderRadius: '500px',
		display: 'inline-block',
		boxShadow: 'none',
		verticalAlign: 'middle',
		outline: 0,
		'&:hover': {
			borderColor: '#9F55FF',
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
		color: 'dimgrey',
		whiteSpace: 'initial'
	},
	myAccount: {
		background: 'linear-gradient(25deg, #013aff, #7f92ff)',
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
		'&:disabled': {
			border: '0px',
			width: '50px',
			backgroundColor: 'transparent',
			marginTop: '-2px'
		}
	}
});

class PaymentRecords extends PureComponent {
	
	state = {
		startDate: null,
		endDate: null,
		createRefundModalShow: [],
		filters: {
			startDate: "",
			endDate: "",
			text: ""
		},
		isOpenRefund: false,
		refundModalIndex: 0,
		editMountRefund: true
	}

	static getDerivedStateFromProps(props, state) {
		if(props.data && props.data.length > 0 && state.createRefundModalShow.length != props.data.length) {
		let modals = [];
		props.data.map((d, i) => {
			let a = {};
			a['modal_' + i] = false;
			modals.push(a);
		});
		return { createRefundModalShow: modals };
	}else if(props.refundStatus) {
		//props.fetchData();
		return null;
	} 
		return { ...state };
	}

	handleDateChange = (date, name) => {
		let { filters } = this.state;
		filters[name] = moment(new Date(date)).format('YYYY-MM-DD');
		this.setState(filters);
		this.props.fetchData(filters);
	}

	handleSearch = (e) => {
		let { filters } = this.state;
		filters.text = e.target.value;
		this.setState(filters);
	}
	handleSearchClick = e => {
		let { filters } = this.state;
		this.props.fetchData(filters);
	}

	onTabChange = (key) => {
		if (key == 'refunds') {
			this.props.getRefund(this.state.filters);
		}
		else if (key == 'payments') {
			this.props.fetchData(this.state.filters);
		}
	}

	isPaymentListExpandable = (row) => {
		return true;
	}

	getHeaderOfExpandable = (row) => {
		const { classes } = this.props;
		if (row.status == "SUCCESS") {
			return (
				<div>
					<div className={`${classes.expandableHeader} expandHeader`}>
						Payment Successful for&nbsp;
						{
							row.paymentType.toLowerCase() == "invoice" ?
								<Fragment>
									<Link style={{color: '#0a7d4e'}} to={"/app/invoices/view/" + row.invoiceId}>{`Invoice #${row.other ? row.other.invoiceNo : ''}`}</Link>
								</Fragment> :
								<Fragment>
									<Link style={{color: '#0a7d4e'}} to={"/app/sales/checkouts/edit/" + row.checkoutId}>{`${row.other ? row.other.checkoutName : ''}`}</Link>
								</Fragment>
						}
					</div>
					<div className={`${classes.expandableSubHeader} expandSubHeader header d-inline-flex align-items-center`}>
						<svg className="py-icon mr-1" viewBox="0 0 20 20" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg> Paid out on {moment.parseZone(row.date).format("MMMM DD, YYYY")}
					</div>
				</div>
			)
		}
		else if (row.status == "DECLINED") {
			return (
				<div>
					<div className={`${classes.expandableHeader} expandHeader`}>
						Your customer's credit card was declined for <Link style={{color: '#b8b117'}} to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>{`${row.paymentType} #${row.other ? row.other.invoiceNo : ''}`}</Link>
					</div>
					<div className={`${classes.expandableSubHeader} expandSubHeader d-inline-flex align-items-center`}>
					<svg className="py-icon mr-1" viewBox="0 0 20 20" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg> Your customer should be aware of the issue, but you may need to reach out to them if they don't successfully retry with another payment method.
					</div>
				</div>
			)
		}
		else if (row.status == "REFUNDED") {
			return (
				<div>
					<div className={`${classes.expandableHeader} expandHeader`}>
						Refunded for <Link style={{color: '#b8b117'}} to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>{`${row.paymentType} ${row.paymentType === 'Invoice' ? ('#' + row.other.invoiceNo) : row.other.checkoutName}`}</Link>
					</div>
				</div>
			)
		}
	}

	paymentListExpandableComponent = (row) => {
		const { classes } = this.props;
		let currency = row.currency ? row.currency.symbol : "$";
		let account = (row.ownAccount && row.ownAccount.accountNumber) ? row.ownAccount.accountNumber.split('') : [];
		account = (account) ? account.splice(0, account.length - 3, 'xxxx') : [];
		account = (account) ? account.join('') : '';
		console.log("icon row", row);
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
			paymentId: row.id,
			refundAmount: row.amount,
			reason: ''
		};
		let {data, ...filteredProps} = this.props;

		return (
			<div className="payment-list__item-container">
				{this.state.createRefundModalShow[row.index]['modal_' + row.index] &&
				<RefundModal
							data = {row}
							open = {this.state.createRefundModalShow[row.index]['modal_' + row.index]}
							styles = {style}
							editMountRefund = {this.state.editMountRefund}
							postRefund = {(index) => this.postRefund(body, index)}
							changeBody = {(name, value) => {
								// console.log("body", typeof value, value)
								if(name === 'refundAmount'){
									body[name] = parseFloat(value)
								}else{
									body[name] = value
								}
							}}
							_setAmount = {(value) => body.refundAmount = parseFloat(value).toFixed(2)}
							handleRefundModalClose = {() => this.handleRefundModalClose(row.index)}
							setEditRefund = {(value) => this.setState({ editMountRefund: !this.state.editMountRefund})}
							{...filteredProps}
							classes={`${this.props.classes}`}
						/>}
				<div className={row.status == 'SUCCESS' ? classes.paymentExpandableBodySuccess : classes.paymentExpandableBodyDeclined}>
					{/*
						<div className={classes.expandableHeader}>
							Payment Successful for <Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>{row.paymentType}</Link>
						</div>
						<div className={classes.expandableSubHeader}>
							<i className="fas fa-info-circle" /> Paid out on {moment.parseZone(row.date).format("MMMM DD, YYYY")}
						</div>
					*/}
					{
						this.getHeaderOfExpandable(row)
					}
					<PaymentDetails row={row} {...this.props} account={account} />
				</div>
				<div className="payment-list__footer">
					{row.status == "SUCCESS" ? (
						<button className="btn btn-outline-primary" onClick={() => { this.handleRefundModalOpen(row.index) }}>
							Refund
					</button>) : ''
					}
					<Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.invoiceId : '/app/sales/checkouts/edit/' + row.checkoutId}>
						<button className="btn btn-primary">
							View {row.paymentType}
						</button>
					</Link>
				</div>
			</div>
		)
	}

	payments = (props) => {
		let { classes } = props;
		let data = [];
		props.data.map((d, i) => {
			data.push({
				id: d.id,
				status: d.status,
				method: d.paymentIcon,
				date: d.paymentDate,
				customer: `${d.customer.firstName} ${d.customer.lastName}`,
				totalAmount: d.amountBreakup.total,
				amountBreakup: d.amountBreakup,
				amount: d.amount,
				account: d.account,
				paymentType: d.paymentType,
				linkId: d[d.paymentType.toLowerCase()],
				ownAccount: d.ownAccount,
				index: i,
				refund: d.refund.id,
				other: d.other,
				currency: d.currency,
				card: d.card,
				bank: d.bank,
				invoiceId: d.invoiceId,
				checkoutId: d.checkoutId,
			})
		})
		return (
			<BootstrapTable className={`${classes.table} payments-list`} data={data} bordered={false}
				expandableRow={this.isPaymentListExpandable}
				expandRowClassName="payTableExpandRow"
				classes="py-table"
				options={{ expandRowBoxShadow: "0px 8px 32px red" }}
				trClassName={"py-table__row"}
				expandComponent={this.paymentListExpandableComponent} pagination>

				<TableHeaderColumn dataField='id' isKey hidden>Id</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='status' dataFormat={(cell, row) => {
					return (<div className={classes['status' + cell]}>{cell}</div>)
				}} width="200px">Status</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='method' dataFormat={(cell, row) => {
					let icon = PaymentIcon[cell] ? PaymentIcon[cell] : cell;
					return (<img src={process.env.WEB_URL.includes('localhost') ? `/${icon}` : icon} width='35px' />)
				}} width="120px">Method</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='date' dataFormat={(cell, row) => {
					return toDisplayDate(cell, true, "MMM D, YYYY @ HH:mm A")

				}}>Date</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='customer'>Customer</TableHeaderColumn>
				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell-amount`} dataField='amount' dataFormat={(cell, row) => {
					let currency = row.currency;
					return (<div className={`${classes.payments} payAmount ${row.status === 'REFUNDED' && 'color-default'}`} style={{ textAlign: 'right' }}>{getAmountToDisplay(currency, cell)}</div>)
				}}>Amount</TableHeaderColumn>

			</BootstrapTable>
		)
	}

	handleRefundModalOpen = (index) => {
		let a = this.state.createRefundModalShow;
		a[index]['modal_' + index] = true;
		this.setState({createRefundModalShow: a, isOpenRefund: true});
	}
	handleRefundModalClose = (index) => {
		let a = this.state.createRefundModalShow;
		a[index]['modal_' + index] = false;
		this.setState({createRefundModalShow: a, isOpenRefund: false});
	}

	postRefund = (body, index) => {
		if(!!body.reason){
			this.props.postNewRefund({
				refundInput: body
			}).then(res => {
				this.handleRefundModalClose(index);
				this.props.fetchData();
			})
		}else{
			this.props.openGlobalSnackbar('Please select reason first.', true)
		}
	}

	refundListExpandableComponent = (row) => {
		const { classes } = this.props;
		let currency = row.currency.symbol;
		let account = row.ownAccount.accountNumber.split('');
		account.splice(0, account.length - 3, 'xxxx');
		account = account.join('');
		return (
			<div className={classes.paymentExpandable}>
				<div className={row.status == 'SUCCESS' ? classes.paymentExpandableBodySuccess : classes.paymentExpandableBodyDeclined}>
					<div>
						<div className={`${classes.expandableHeader} expandHeader`}>
							Refunded for&nbsp;
							{
								row.paymentType.toLowerCase() == "invoice" ?
								<Fragment>
									<Link style={{color: '#0a7d4e'}} to={"/app/invoices/view/" + row.invoiceId}>{`Invoice #${row.other ? row.other.invoiceNo : ''}`}</Link>
								</Fragment> :
								<Fragment>
									<Link style={{color: '#0a7d4e'}} to={"/app/sales/checkouts/edit/" + row.checkoutId}>{`${row.other ? row.other.checkoutName : ''}`}</Link>
								</Fragment>
							}
							<span>&nbsp;due to {row.reason}</span>
							 {/* <Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>{`${row.paymentType} #${row.other.invoiceNo}`}</Link> {row.reason ? 'due to ' + row.reason : ''} */}
						</div>
						<div className={`${classes.expandableSubHeader} expandSubHeader`}>
							<i className="fas fa-info-circle" /> Refund on {moment.parseZone(row.date).format("MMMM DD, YYYY")}
						</div>
					</div>
					{/* {
						this.getHeaderOfExpandable(row)
					} */}
					<PaymentDetails row={row} {...this.props} account={account} />
				</div>
				<div className="d-flex justify-content-end py-3">
					<Link to={'/app/payments/view-payment/' + row.paymentId}>
						<button className="btn btn-outline-primary mr-2">
							View Original Payment
						</button>
					</Link>
					<Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.invoiceId : '/app/sales/checkouts/edit/' + row.checkoutId}>
						<button className="btn btn-primary">
							View {row.paymentType}
						</button>
					</Link>
				</div>
			</div>
		)
	}

	refunds = (props) => {
		let { classes } = props;
		let data = [];
		if (props.refundList) {
			props.refundList.map((d, i) => {
				data.push({
					id: d.id,
					status: d.status,
					method: d.paymentIcon,
					date: d.refundDate,
					customer: `${d.customer.firstName} ${d.customer.lastName}`,
					amount: d.amount,
					account: d.account,
					paymentType: d.paymentType,
					linkId: d[d.paymentType.toLowerCase()],
					ownAccount: d.ownAccount,
					index: i,
					// refund: d.refund.id,
					card: d.card,
					bank: d.bank,
					invoiceId: d.invoiceId,
					checkoutId: d.checkoutId,
					account: d.account,
					reason: d.reason,
					paymentId: d.payment.id,
					currency: d.currency,
					other: d.other
				})
			})
		}
		return (
			<BootstrapTable className={`${classes.table}`} data={data} bordered={false}
				expandableRow={this.isPaymentListExpandable}
				trClassName={"py-table__row"}
				classes={'py-table--condensed'}
				expandComponent={this.refundListExpandableComponent} pagination>

				<TableHeaderColumn dataField='id' isKey hidden>Id</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='status' dataFormat={(cell, row) => {
					return (<div className={classes['status' + cell]}>{cell}</div>)
				}} width="200px">Status</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='method' dataFormat={(cell, row) => {
					let icon = PaymentIcon[cell] ? PaymentIcon[cell] : cell;
					// console.log("icon", cell)
					return (<img src={icon} width='35px' />)
				}} width="120px">Method</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='date' dataFormat={(cell, row) => {
					return toDisplayDate(cell, true, "MMM D, YYYY @ HH:mm A")
				}}>Refund Date</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='customer'>Customer</TableHeaderColumn>
				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell-amount text-right`} dataField='totalAmount' dataFormat={(cell, row) => {
					let currency = row.currency
					return (<div className={`${classes.payments} color-default`} style={{ textAlign: 'right' }}>{getAmountToDisplay(currency, row.amount)}</div>)
				}}>Refund Amount</TableHeaderColumn>

			</BootstrapTable>
		)
	}

	render() {
		const { classes } = this.props;
		let Payments = this.payments;
		let Refunds = this.refunds;
		return (
			<div className="content-wrapper__main PaymentList__Container">
				<header className="py-header--page">
					<div className="py-header--title">
						<h2 className="py-heading--title">Payments</h2>
					</div>
				</header>
				<div className="payments-filter-container">

						<div className="payments-filter__search">
							<InputGroup>
								<FormControl
									placeholder="Search"
									aria-describedby="basic-addon2"
									onChange={this.handleSearch}
								/>
								<InputGroup.Append>
									<InputGroup.Text onClick={this.handleSearchClick}><i className="fas fa-search"></i></InputGroup.Text>
								</InputGroup.Append>
							</InputGroup>
						</div>

						<div className="payments-filter__datepicker">

							<div className="py-datepicker--range">
									<DatepickerWrapper
										className="py-form__element__small form-control py-datepicker--range-from"
										selected={this.state.startDate}
										onChange={(date) => this.handleDateChange(date, "startDate")}
										placeholderText="From"
										isClearable={true}
									/>
									<DatepickerWrapper
										className="py-form__element__small form-control form-control py-datepicker--range-to"
										selected={this.state.endDate}
										onChange={date => this.handleDateChange(date, "endDate")}
										placeholderText="To"
										isClearable={true}
										minDate={this.state.startDate}
									/>
									</div>
						</div>

				</div>
				<div className="container pd0 mg-t-30">
					<Tabs defaultActiveKey="payments" className="py-nav--tabs" id="uncontrolled-tab-example" onSelect={this.onTabChange}>
						<Tab className={classes.tabBody} eventKey="payments" title="Payments">
							<Payments {...this.props} />
						</Tab>
						<Tab className={classes.tabBody} eventKey="refunds" title="Refunds">
							<Refunds {...this.props} />
						</Tab>
					</Tabs>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return{
		refundStatus: state.paymentReducer,
		refundList: state.paymentReducer.refundRecords
	}
}

export default compose(
	withStyles(styles),
	connect(mapStateToProps, {postNewRefund, openGlobalSnackbar})
)(PaymentRecords);
