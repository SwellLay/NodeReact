import React, { PureComponent, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import compose from 'recompose/compose';
// import { Container, Row, Col } from 'react-bootstrap';
import { Row, Col, Dropdown, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, TabContent, TabPane, Nav, NavItem, NavLink, Tooltip, Container } from 'reactstrap';
import Button from '@material-ui/core/Button';
import history from "customHistory";

import { getAllPayments, getAllRefunds, postNewRefund } from '../../../../actions/paymentAction';
import { addBodyToPayment, getOnboardingStatus, verifyPaymentOnboarding } from '../../../../actions/paymentAction';
import PaymentInit from './components/onBoardingInit';
import PaymentRecords from './components/paymentRecords';

const styles = theme => ({

})

class Payment extends PureComponent {

	state = {
		paymentDataLoaded: false
	}


	componentDidMount() {
		const { businessInfo } = this.props
		this._fetchPayments()
		document.title = businessInfo ? `Peymynt - ${businessInfo.organizationName} - Payments` : "Peymynt - Payments";		
		if (this.props.paymentIntermediateData) {
			history.push("/app/payments/onboarding");
		}
		const {paymentDataLoaded} = this.props;
		if(paymentDataLoaded == true){
			this.setState({paymentDataLoaded : true})
		}
	}

	componentDidUpdate(prevProps) {
		console.log(this.props);
		// console.log(this.props.onboardingBody);

		// if(this.props.onboardingBody.legalName && this.props.onboardingBody.legalName.length > 0){
		// 	history.push("/app/payments/onboarding");
		// }
		//351 - not finished the payment setup
		if (this.props.paymentIntermediateData) {
			history.push("/app/payments/onboarding");
		}

		const {paymentDataLoaded} = this.props;
		if(paymentDataLoaded == true){
			this.setState({paymentDataLoaded : true})
		}
	}

	_fetchPayments = () => {
		if (this.props.location.search) {
			const data ={
				checkoutId:this.props.location.search.split('?checkoutId=')[1]
			}
			this.props.getPayment(data);
		} else {
			this.props.getPayment();
		}
		this.setState({paymentDataLoaded: false})
	}

	redirectToOnBoarding() {
		history.push("/app/payments/onboarding");
	}

	render() {
		const { classes, paymentList, refundList, statusCode, message } = this.props;
		const { paymentDataLoaded } = this.state;
		console.log("paymentList", paymentList, statusCode)
		if (paymentDataLoaded) {
			if (Array.isArray(paymentList) && paymentList.length > 0) {
				return (
					<PaymentRecords
						data={paymentList}
						refundList={refundList}
						fetchData={this._fetchPayments}
						getRefund={this.props.getRefund}
						// postRefund={this.props.postRefund} 
						/>
				)
			} else if (statusCode === 351) {
				return (
					<PaymentInit {...this.props} />
				)
			} else if((!Array.isArray(paymentList) || paymentList.length <= 0) && statusCode === 200) {
				return (
					<PaymentRecords
					data={paymentList}
					refundList={refundList}
					fetchData={this._fetchPayments}
					getRefund={this.props.getRefund}
					// postRefund={this.props.postRefund} 
					/>
				)
			} else {
				return (
					<Container className="mrT50 text-center">
						<h6>No Payment data available.</h6>
					</Container>
				)
			}
		} else {
			return (
				<div>
					<Container className="mrT50 text-center">
						<div className="spinner-border spinner-border-lg text-primary" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</Container>
				</div>
			);
		}
	}
}

const mapStateToProps = (state) => {
	return {
		onboardingBody: state.paymentReducer.onboardingBody,
		paymentList: state.paymentReducer.paymentRecords,
		refundList: state.paymentReducer.refundRecords,
		paymentData: state.paymentReducer.paymentData,
		paymentIntermediateData: state.paymentReducer.paymentIntermediateData,
		paymentDataLoaded: state.paymentReducer.paymentDataLoaded,
		statusCode: state.paymentReducer.statusCode,
		message: state.paymentReducer.message,
		businessInfo: state.businessReducer.selectedBusiness,
		
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getPayment: (body) => {
			dispatch(getAllPayments(body))
		},
		getRefund: (body) => {
			dispatch(getAllRefunds(body))
		},
		fetchOnBoarding: () => {
			dispatch(getOnboardingStatus())
		},
		postRefund: (body) => {
			dispatch(postNewRefund(body))
		}
	}
}

export default compose(
	withStyles(styles, { name: 'Payment' }),
	connect(mapStateToProps, mapDispatchToProps)
)(Payment);