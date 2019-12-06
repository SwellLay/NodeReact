import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import compose from 'recompose/compose';

import BusinessType from "./businessType";
import BusinessDetails from "./businessDetails";
import YourDetail from "./yourDetails";
import BankDetail from "./bankDetails";
import CustomizedStatement from "./customizedStatement";
import Verification from "./verification";
import Success from "./success";
import { openGlobalSnackbar } from '../../../../../../actions/snackBarAction';
import { addBodyToPayment, getOnboardingStatus, verifyPaymentOnboarding } from '../../../../../../actions/paymentAction';
import { fetchStatesByCountryId } from "../../../../../../api/CustomerServices";
//import { _documentTitle } from '../../../../utils/GlobalFunctions';
import { _documentTitle } from '../../../../../../utils/GlobalFunctions';

const styles = theme => ({

	bodyP: {
		width: "1206px",
		marginTop: '24px',
		marginBottom: '24px',
		marginRight: '-177px',
		marginLeft: 'auto'
	},
	root: {
		...theme.mixins.gutters(),
		padding: '24px',
		borderRadius: '12px',
		boxShadow: '0 8px 32px rgba(77,101,117,0.35)',
		borderColor: 'transparent',
		display: 'block',
	},
	padding25: {
		padding: '25px 40px'
	},
	button: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
	actionsContainer: {
		marginBottom: theme.spacing.unit * 2,
	},
	resetContainer: {
		padding: theme.spacing.unit * 3,
	},
	icon: {
		transform: 'scale(1.2)',
		"& $disabled": {
			color: "red !important"
		}
	},
	connectorActive: {
		color: '#fff !important',
		borderRadius: '50%',
		border: '2px solid #78c3fc !important',
		transform: 'scale(1.5) !important',
		'& $text': {
			fill: "#78c3fc !important"
		}
	},
	iconContainer: {
		transform: 'scale(1.2)',
	},
	connectorCompleted: {
		borderColor: "#23c770 !important",
		color: "#23c770 !important",
		'& $connectorLine': {
			borderColor: 'rgb(120, 195, 252) !important',
		}
	},
	connectorDisabled: {
		color: '#fff !important',
		borderRadius: '50%',
		border: '2px solid #78c3fc !important',
	},
	connectorLine: {
		// transition: theme.transitions.create('border-color'),
		// borderLeftWidth: '2px',
		// borderColor: 'rgba(120, 195, 252, 0.71) !important',
	},
	disabled: {},
	text: {}
});

function getSteps() {
	return ['Business Type', 'Business Details', 'Your Details', 'Bank Details', 'Customized Statement', 'Verification'];
}

class OnBoarding extends PureComponent {

	state = {
		activeStep: 0,
		error: {
			businnesType: null,
			businessDetails: null,
			yourDetails: null,
			bankDetails: null,
			customizedStatement: null,
			verification: null
		},
		submitProcess: false,
		autoNavCheck: true,
		lastStep: false,
		statesOptions: [],
		tos: {},
		businessType: null,
		success:false,
		goBack:true
	};

	componentDidMount() {
		_documentTitle(this.props.selectedBusiness, '');
		this.props.fetchOnBoarding();
		this.fetchStates("");
	}


	fetchStates = async id => {
		const _id = (this.props.selectedBusiness && this.props.selectedBusiness.country) ? this.props.selectedBusiness.country.id : 1;
		const statesList = await fetchStatesByCountryId(_id);
		this.setState({ statesOptions: statesList.states });
	};

	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			if (this.state.autoNavCheck && nextProps.onboardingBody && Object.keys(nextProps.onboardingBody).length > 0) {
				if (nextProps.verifyData.verified || (nextProps.onboardingBody.stripe && nextProps.onboardingBody.stripe.id)) {
					this.setState({ activeStep: 6, autoNavCheck: false,goBack:false })
				} else if (nextProps.onboardingBody.tos_acceptance && nextProps.onboardingBody.tos_acceptance.date){
					this.setState({ activeStep: 5, autoNavCheck: false });
				}
				else if (Object.keys(nextProps.onboardingBody.account).length > 0 && nextProps.onboardingBody.account.accountName)
					this.setState({ activeStep: 4, autoNavCheck: false, loading: false })
				else if (nextProps.onboardingBody.owners && nextProps.onboardingBody.owners.length > 0)
					this.setState({ activeStep: 3, autoNavCheck: false })
				else if (nextProps.onboardingBody.legalName && nextProps.onboardingBody.legalName.length > 0)
					this.setState({ activeStep: 2, autoNavCheck: false })
			}
			if (nextProps.verified)
				this.setState({ activeStep: 5 })
			if (this.props.verifyData.error !== nextProps.verifyData.error) {
				if (nextProps.verifyData.error) {
					console.log("loading")
					this.setState({loading: false})
					this.props.showSnackbar(nextProps.verifyData.tosAcceptance.message, true);
				} else {
					//this.setState({ success:true})
					const message = nextProps.verifyData.tosAcceptance.message ? nextProps.verifyData.tosAcceptance.message : "Payment setup successfully."
					this.props.showSnackbar(message, false)

					// this.setState({ activeStep: 6, autoNavCheck: false })
				}
			}
		}
	}


	shouldComponentUpdate(prevProps, prevState) {
		 if(this.props.verifyData && this.props.verifyData.error && prevState.submitProcess){
			this.setState(() => ({
				activeStep: 4,
				autoNavCheck: false,
				submitProcess: false,
				goBack:true,
			}));
		}else if(this.props.verified && prevState.submitProcess){
			this.setState(() => ({
				activeStep: 6,
				autoNavCheck: false,
				goBack:false,
				submitProcess: false
			}));
		}
		 else if (!prevProps.loading) {
			if (prevState.submitProcess) {
				if (this.state.activeStep === 1 && this.props.onboardingBody.legalName && this.props.onboardingBody.legalName.length > 0) {
					this.setState(() => ({
						activeStep: 2,
						autoNavCheck: false
					}));
				} else if ((this.state.activeStep === 1 || this.state.activeStep === 2) && this.props.onboardingBody.legalName && this.props.onboardingBody.owners && this.props.onboardingBody.owners.length == 0) {
					this.setState(() => ({
						activeStep: 2,
						autoNavCheck: false
					}));
				}
				else {
					this.handleNext();
				}
				this.setState({ submitProcess: false });
				return false;
			}
			return true;
		} 
		return true;
	}

handleNext = () => {
	this.setState(state => ({
		activeStep: (state.activeStep >= 6) ? 6 : state.activeStep + 1,
	}));
};

handleBack = () => {
	this.setState(state => ({
		activeStep: (state.activeStep <= 0) ? 0 : state.activeStep - 1,
	}));
};

handleReset = () => {
	this.setState({
		activeStep: 0,
	});
};

handleJump = (index) => {
	this.setState(state => ({
		activeStep: (state.activeStep > index) ? index : state.activeStep,
	}));
}

getStepContent = (step) => {
	switch (step) {
		case 0:
			return (<BusinessType
				onSubmit={this.handleBTypeSubmit}
				onShowSnackbar={this.onShowSnackbar}
				onBack={this.handleBack}
				data={this.props.onboardingBody}
				error={this.state.error['businnesType']}
				loading={this.props.loading} />
			);
		case 1:
			return (<BusinessDetails
				onSubmit={this.handleBDetSubmit}
				onBack={this.handleBack}
				data={this.props.onboardingBody}
				statesOptions={this.state.statesOptions}
				organizationType={this.props.selectedBusiness}
				onShowSnackbar={this.onShowSnackbar}
				error={this.state.error['businessDetails']}
				loading={this.props.loading} />);
		case 2:
			return (<YourDetail
				onSubmit={this.handleYDetSubmit}
				onBack={this.handleBack}
				data={this.props.onboardingBody}
				onSave={this.saveOnboardingData}
				onShowSnackbar={this.onShowSnackbar}
				statesOptions={this.state.statesOptions}
				error={this.state.error['yourDetails']}
				loading={this.props.loading} />);
		case 3:
			return (<BankDetail
				onSubmit={this.handleBKDetSubmit}
				onBack={this.handleBack}
				data={this.props.onboardingBody}
				onShowSnackbar={this.onShowSnackbar}
				error={this.state.error['bankDetails']}
				loading={this.props.loading} />);
		case 4:
			return (<CustomizedStatement
				onSubmit={this.handleCSSubmit}
				onShowSnackbar={this.onShowSnackbar}
				onBack={this.handleBack}
				data={this.props.onboardingBody}
				setVerify={this.setVerify}
				selectedBusiness={this.props.selectedBusiness}
				error={this.state.error['customizedStatement']}
				loading={this.props.loading && !this.props.error} />);
		case 5:
			return (<Verification
				onSubmit={this.handleVSubmit}
				onBack={this.handleBack}
				data={this.props.onboardingBody}
				onShowSnackbar={this.onShowSnackbar}
				error={this.state.error['verification']}
				loading={this.props.loading} />);
		case 6:
			return (<Success
				onSubmit={this.handleSuccess}
				data={this.props.onboardingBody}
				onShowSnackbar={this.onShowSnackbar}
				error={this.state.error['verification']}
				loading={this.props.loading} />);
		default:
			return 'Unknown step';
	}
}

handleBTypeSubmit = (value) => {
	this.setState({
		businessType: value
	})
	const data = {
		businessType: value
	}
	this.patchOnboardingData(data);

}

handleBDetSubmit = (data) => {
	this.patchOnboardingData(data);
}

handleYDetSubmit = (data) => {
	this.patchOnboardingData(data);
}

handleBKDetSubmit = (data) => {
	this.patchOnboardingData(data);
}

handleCSSubmit = (data) => {
	this.setState({ lastStep: true });
	this.patchOnboardingData(data);
}

setVerify = (tos) => {
	this.setState({ tos: tos });
}

handleVSubmit = (data) => {
	this.verifyOnboarding(this.state.tos)
	//this.setState({submitProcess: true});
}

handleSuccess = () => {

}

onShowSnackbar = (message) => {
	this.props.showSnackbar(message, true);
}


saveOnboardingData = (data) => {
	this.props.patchOnboarding({
		businessInput: data
	});
}

patchOnboardingData = (data) => {
	this.setState({ submitProcess: true });
	this.props.patchOnboarding({
		businessInput: data
	});
}

verifyOnboarding = (tos) => {
	 this.setState({submitProcess: true});
	this.props.verifyOnboarding({
		"paymentInput": {
			"tosAcceptance": tos
		}
	});
}

render() {
	const { classes, verified, onboardingBody } = this.props;
	const steps = getSteps();
	const { activeStep, goBack } = this.state;
	const connector = (
		<StepConnector
			classes={{
				// line: classes.connectorLine,
				line: 'payment__onboard__step__line',
			}}
		/>
	);


	return (
		<div id="Onboarding" className="content-wrapper__main">
			<Grid container>
				<Grid className="Payment__Onboarding__Stepper__Container" item xs={3} pt-5>
					<Stepper activeStep={activeStep} orientation="vertical" connector={connector}>
						{steps.map((label, index) => (
							<Step
								style={{ cursor: 'pointer' }} onClick={() => {
									if (goBack) {
										this.setState(state => ({
											activeStep: (state.activeStep > index) ? index : state.activeStep
										}));
									}
								}} key={label}>
								<StepLabel
									// classes={{
									// 	iconContainer: classes.iconContainer
									// }}
									StepIconProps={{
										classes: {
											// root: classes.icon,
											root: 'payment__onboarding__step__icon',
											// completed: classes.connectorCompleted,
											completed: 'is-completed',
											// active: classes.connectorActive,
											active: 'is-active',
											// text: classes.text,
											text: 'payment__onboarding__step__icon-text',

										}
									}}
								// StepIconProps={{
								//     classes: {
								// 		active: classes.connectorActive,
								// 		completed: classes.connectorCompleted,
								// 		disabled: classes.connectorDisabled
								//     }
								// }}
								><span className="payment__onboarding__step__label">{label}</span></StepLabel>
							</Step>
						))}
					</Stepper>
				</Grid>
				<Grid item item xs={9} className="Payment__Onboarding__Stepper__Content">
					<div className="content">
						<div className="payment__onboarding__container">
							<div className="payment__onboarding__content">
								{this.getStepContent(activeStep)}
							</div>
						</div>
					</div>
				</Grid>
			</Grid>
		</div>
	)
}
}

const mapStateToProps = (state) => {
	return {
		onboardingBody: state.paymentReducer.onboardingBody,
		verified: state.paymentReducer.verified,
		selectedBusiness: state.businessReducer.selectedBusiness,
		verifyData: state.paymentReducer,
		loading: state.paymentReducer.loading,
		error: state.paymentReducer.error
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		patchOnboarding: (body) => {
			dispatch(addBodyToPayment(body))
		},
		fetchOnBoarding: () => {
			dispatch(getOnboardingStatus())
		},
		verifyOnboarding: (body) => {
			dispatch(verifyPaymentOnboarding(body))
		},
		showSnackbar: (message, error) => {
			dispatch(openGlobalSnackbar(message, error))
		}
	}
}

export default compose(
	withStyles(styles, { name: 'PaymentOnboarding' }),
	connect(mapStateToProps, mapDispatchToProps)
)(OnBoarding);