import React, { Fragment } from 'react';
import PlaidLink from 'react-plaid-link'
import { connect } from 'react-redux';
import { Col, Spinner } from 'reactstrap';
import { getBankAccounts } from '../../../../../../actions/invoiceActions'
import paymentService from '../../../../../../api/paymentService';
import CenterSpinner from '../../../../../../global/CenterSpinner';
import { toMoney } from '../../../../../../utils/GlobalFunctions';
import { _institutionLists, PoweredByBank } from '../../helpers';
import BankAccounts from './BankAccounts';

// import { PoweredBy } from "../../../../common/PoweredBy";

class BankPayoutForm extends React.Component {

	state = {
		paidAmount: null,
		loading: false,
		showAccounts: false,
		accounts: null,
		logo: null,
		publicToken: null,
		metadata: null,
		selectedBank: null,
		payLoading: false
	};

	handleOnSuccess = async (token, metadata) => {
		console.log("metadata.accounts", metadata);
		let data = {
			accountInput: {
				publicToken: metadata.public_token,
				institutionId: metadata.institution.institution_id
			}
		};
		if (!!token) {
			try {
				await this.props.getBankAccounts(data);
				this.setState({ publicToken: token, metadata })
			} catch (err) {
				console.error('Error in account fetxh --------->', err)
			}
		}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.bankAccounts !== nextProps.bankAccounts) {
			const { bankAccounts } = nextProps;
			if (!!bankAccounts) {
				const { success, error, data } = bankAccounts;
				if (success) {
					this.setState({ accounts: data.accounts, showAccounts: true, logo: data.institution.logo, selectedBank: data.accounts[0].account_id })
				} else {
					console.error("error in bank accounts -------->", data)
				}
			}
		}
	}

	proceedToPay = (token, metaData) => {
		const { invoiceData } = this.props;
		this.setState({ payLoading: true });
		const { paidAmount, signature, selectedBank } = this.state;
		let paymentBody = {
			"paymentInput": {
				"uuid": invoiceData.uuid,
				"method": "bank",
				"amount": paidAmount ? paidAmount : invoiceData.dueAmount,
				'plaidToken': token,
				'accountId': selectedBank,
				"rawLinkResponse": JSON.stringify(metaData),
				"signature": signature
			}
		};
		this.paymentCallback(paymentBody);
	};

	paymentCallback = async (_checkoutPayment) => {
		try {
			const response = await paymentService.doCheckoutPayment(_checkoutPayment);
			if (response.statusCode === 200) {
				this.setState({ successPaid: true, payLoading: false });
				// this.props.showSnackbar("Payment Done", false);
				this.props.refreshData();
				this.props.openAlert(response.data.paymentResponse)
				// this.props.onPayment(true);
			} else {
				this.setState({ payLoading: false });
				this.props.showSnackbar(response.message, true);
			}
		} catch (error) {
			console.error('error: ', error);
			this.setState({ payLoading: false });
			this.props.showSnackbar(error.message, true)
		}
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		})
	};

	handleAccount = (item) => {
		console.log('selected', item);
		let { metadata } = this.state;
		metadata.account_id = item.id;
		this.setState({ metadata, selectedBank: item.id })
	};

	render() {
		const { invoiceData, bankAccounts } = this.props;
		const { accounts, showAccounts, payLoading, logo, paidAmount, publicToken, metadata, selectedBank, signature } = this.state;
		return (
			<div style={{ padding: '24px' }} className="py-box py-box--large m-0 no-border">
				{
					this.state.loading ?
						<div className="spinner-wrapper"><Spinner /></div> :
						<Fragment>
							{
								bankAccounts.loading ?
									<CenterSpinner /> :
									showAccounts ?
										<BankAccounts
											accounts={accounts}
											invoiceData={invoiceData}
											handleOnSuccess={this.handleOnSuccess.bind(this)}
											logo={logo}
											paidAmount={paidAmount}
											handleChange={this.handleChange.bind(this)}
											setAmount={e => this.setState({ paidAmount: parseFloat(e.target.value).toFixed(2) })}
											proceedToPay={this.proceedToPay.bind(this)}
											token={publicToken}
											metadata={metadata}
											handleAccount={this.handleAccount.bind(this)}
											selectedBank={selectedBank}
											signature={signature}
											loading={payLoading}
											orgName={invoiceData && invoiceData.businessId && invoiceData.businessId.organizationName}
										/> : (
											<div className="bankPayment-container">
												<div className="bankPayment-formExplainer py-text--strong">
													<h6>
														<span>Select a bank shown below or search for your bank by clicking "Pay using your bank" </span>
													</h6>
												</div>
												{/* <div className="py-institution-search">
										<Input type="text" placeholder={'Type a bank name. For example, "US Bank" or "SunTrust"'}/>
										<div className="py-institution-search__result">
											<ul>
												{
													_institutionLists.map((item, i) => {
														return (
															<li className="instituton-search__option">
																<img src={item.img} alt={item.name}/>
																<span>{item.name}</span>
															</li>
														)
													})
												}
											</ul>
										</div>
										<span className="input-search color-muted"> <i className="fa fa-search"/> </span>
									</div> */}
												<PlaidLink
													clientName="Peymynt"
													env={process.env.PLAID_ENV}
													product={["auth"]}
													publicKey={process.env.PLAID_PUBLIC_KEY}
													onExit={this.handleOnExit}
													onSuccess={this.handleOnSuccess}
													countryCodes={["GB", "CA", "FR", "ES", "US"]}
													style={{
														outline: 0,
														background: '#fff',
														border: 'none'
													}}
													className="plaid"
												>
													<Fragment>
														<div className="py-bank-list row">
															{
																_institutionLists.map((item, i) => {
																	return (
																		<Col sm={3} key={i} className="py-bank-list__item-wrapper">
																			<div className="institution-list__display">
																				<div className="intitution-list__item">
																					<img src={item.img} alt={item.name} />
																					<span>{item.name}</span>
																				</div>
																			</div>
																		</Col>
																	)
																})
															}
														</div>
														<button className="btn btn-primary btn-rounded">
															{"Pay " + invoiceData.currency.symbol + toMoney(invoiceData.dueAmount) + " using your bank"}
														</button>
													</Fragment>
												</PlaidLink>
											</div>
										)
							}
						</Fragment>
				}
				<PoweredByBank />
			</div>
		)
	}
}

const mapStateToProps = state => (
	{
		bankAccounts: state.getAllBankAccounts
	}
);
export default connect(mapStateToProps, { getBankAccounts })(BankPayoutForm);
