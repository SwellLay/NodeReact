import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputMask from 'react-input-mask';
import { Container, Row, Col, InputGroup, FormControl, FormGroup, Form, FormLabel, Modal } from 'react-bootstrap';
import { Popover, PopoverHeader, PopoverBody, CardImgOverlay, FormText } from 'reactstrap';

const styles = theme => ({
	headerTop: {
		fontSize: '20px',
		lineHeight: '24px',
		fontWeight: '700',
		textAlign: 'left',
		marginBottom: '14px'
	},
	foot: {
		textAlign: 'right',
		marginTop: '24px'
	},
	next: {
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
		outline:'none',
		'&:hover': {
			background: '#0b59b1',
		}
	},
	nextConfirmation: {
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
		outline:'none',
		'&:hover': {
			background: '#136acd',
			color:'#fff'
		}
	},
	cancelConfirm: {
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
		outline:'none'
	},
	FormControl: {
		fontSize: '16px !important',
		boxShadow: 'none !important',
		border: '1px solid #b2c2cd',
	},
	findInformation:{
		color: '#136acd !important',
		fontSize: '14px',
		fontWeight: 'bold',
		marginTop: '-10px',
		cursor:'pointer',
		textAlign:'right'
	},
	modalContent:{
        borderRadius: '.6rem'
	},

	title:{
		fontWeight:'700'
	},
	subTitle:{
		fontSize:'15px',
		fontWeight:'500',
		marginLeft: '20px',
		 marginRight: '20px',
		   paddingLeft: '0px'
	}
})

class BankDetails extends Component {

	state = {
		validated: false,
		formData: {},
		confirmBank: false,
		popoverOpen: false,
		routingMsg: '',
		routing_error: false,
		accountMsg: '',
		account_error: false

	}

	handleCloseConfirm = () => {
		this.setState({ confirmBank: false });
	}

	onSubmit = () => {
		this.props.onSubmit(this.state.formData);

	}

	handleShowConfirm = (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			this.setState({
				validated: true
			})
		} else {
			this.setState({
				validated: false
			})
			console.log(this.state)
			if(!this.state.routing_error && !this.state.account_error){
				this.setState({ confirmBank: true });
			}
		}

	}

	toggle = () => {
		this.setState(prevState => ({
			popoverOpen: !prevState.popoverOpen
		}));
	};

	onFormValChange = (key, value) => {
		let formData = this.state.formData ? this.state.formData : {};
		if (key.split('.').length > 1) {
			let keys = key.split('.');
			if (!formData[keys[0]]) {
				formData[keys[0]] = {};
			}
			formData[keys[0]][keys[1]] = value;
		}
		else {
			formData[key] = value;
		}
		this.setState({ formData: formData });
	}

	onRoutingNoChange = (e) => {
		let { formData } = this.state;
		console.log("value", !isNaN(e.target.value) && e.target.value.length === 9, e.target.value.length)
		if (!isNaN(e.target.value)) {
			formData['account'] = (formData['account']) ? formData['account'] : { 'routingNumber': '' };
			formData['account']['routingNumber'] = e.target.value;
			if(e.target.value.length === 9){
				this.setState({ formData: formData, routing_error: false, routingMsg: '' });
			}else{

				this.setState({
					routing_error: true,
					routingMsg: 'Routing number needs to be a 9 digit number.',
					formData
				})
			}
		}
	}

	onAccNoChange = (e) => {
		let { formData } = this.state;
		if (!isNaN(e.target.value)) {
			formData['account'] = (formData['account']) ? formData['account'] : { 'accountNumber': '' };
			formData['account']['accountNumber'] = e.target.value;
			if(e.target.value.length <= 17 && e.target.value.length >= 6){
				this.setState({ formData: formData, account_error: false, accountMsg: "" });
			}else{
				this.setState({
					formData, account_error: true, accountMsg: "Account number needs to be a 6 to 17 digit number."
				})
			}
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props.data && !(state && Object.keys(state.formData).length > 0))
			return { formData: props.data }

		return null;
	}

	render() {
		const { classes } = this.props;
		const { validated } = this.state;
		const { account } = this.state.formData;
		return (
			<div>
				{/* <div className="mb-3 h4">Where do you want to deposit your money?</div> */}
				<header className="py-header--page">
					<div className="h3 m-0">Add a bank account</div>
				</header>

					<Form noValidate validated={validated} onSubmit={this.handleShowConfirm}>
						<fieldset class="py-box py-box--large">
						<FormGroup>
								<Form.Group controlId="exampleForm.ControlInput1" >
									<label className="py-form-field__label">Bank Name</label>
									<Form.Control type="text" placeholder="Bank Name"
										required
										className="py-form__element__medium"
										defaultValue={account ? account.bankName : ''}
										onChange={(e) => {
											this.onFormValChange('account.bankName', e.target.value);
										}} />
								</Form.Group>

						</FormGroup>

						<FormGroup>
								<Form.Group controlId="exampleForm.ControlInput1">
									<label className="py-form-field__label">Account Name</label>
									<Form.Control type="text" placeholder="Account Name"
										required
										className="py-form__element__medium"
										defaultValue={account ? account.accountName : ''}
										onChange={(e) => {
											this.onFormValChange('account.accountName', e.target.value);
										}} />
								</Form.Group>
						</FormGroup>


						<FormGroup>


									<label className="py-form-field__label" >Accout type</label>
									<div className="py-select--native">
									<Form.Control as="select"
										required
										className="py-form__element py-form__element__medium"
										defaultValue={account ? account.accountType : ''}
										onChange={(e) => {
											this.onFormValChange('account.accountType', e.target.value);
										}}>
										<option>Select an account type</option>
										<option>Business Checking</option>
										<option>Busines savings</option>
										<option>Personal Checking</option>
										<option>Personal savings</option>
									</Form.Control>
									</div>

						</FormGroup>
						<FormGroup>
								<Form.Group controlId="exampleForm.ControlSelect1">
									<label className="py-form-field__label">Routing Number</label>
									<InputMask mask="999999999" maskChar={null} value={account ? account.routingNumber : ''}
										onChange={(e) => {
											this.onRoutingNoChange(e);
										}}>
										{(inputProps) =>
											<FormControl
												required
												className={this.state.routing_error ? "py-form__element__medium color-red err" : "py-form__element__medium"}
												placeholder="9 digits"
												minLength="9"
												maxLength="9"
												aria-label="Routing Number"
												aria-describedby="basic-addon1"
												{...inputProps}
											/>
										}
									</InputMask>
								</Form.Group>
								<small className="color-red err">{this.state.routingMsg}</small>

								<Form.Group controlId="exampleForm.ControlSelect1">
								<label className="py-form-field__label">Accout number</label>
								<InputMask mask="99999999999999999" maskChar={null} value={account ? account.accountNumber : ''}
											onChange={(e) => {
												this.onAccNoChange(e);
											}}>
									{(inputProps) =>
										<FormControl
											required
											className={this.state.account_error ? "py-form__element__medium color-red err" : "py-form__element__medium"}
											placeholder="6-17 digits"
											minLength="6"
											maxLength="17"
											aria-label="Account number"
											aria-describedby="basic-addon1"
											{...inputProps}
										/>
									}
								</InputMask>
								</Form.Group>
								<small className="color-red err">{this.state.accountMsg}</small>

							<div className="d-flex justify-content-start mt-2" onMouseEnter={this.toggle} onMouseLeave={this.toggle}>
									<div className="py-text--link py-text--small" id="Popover1" >
										<span className="py-icon py-icon--small mr-2"><svg viewBox="0 0 20 20" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg></span>Where do I find this information?
									</div>
									<Popover className="big-popover" placement="bottom-end" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
										<PopoverBody>
											<img src="/assets/images/account-number-info.PNG" style={{ maxHeight: '250px', width: '100%' }} />
										</PopoverBody>
                                    </Popover>
									{/* <Popover innerClassName="test" modifiers={{ preventOverflow: { enabled: false } }} eventsEnabled={true} positionFixed={false} data-toggle="popover" placement="bottom-end" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
										<PopoverBody>
											<img src="/assets/images/account-number-info.PNG" style={{ maxHeight: '250px', width: '100%' }} />
										</PopoverBody>
									</Popover> */}

							</div>
						</FormGroup>
						<div className="d-flex justify-content-start mt-4">
							<button className="btn btn-primary" type="submit">
								continue
							</button>
						</div>
						</fieldset>
					</Form>

				<Modal show={this.state.confirmBank} onHide={this.handleCloseConfirm} className={classes.modalContent}>
					<Modal.Header>
						<Modal.Title className={classes.title}>Confirm bank information</Modal.Title>
					</Modal.Header>

					<Modal.Body style={{ padding: '1.7rem 2.6rem' }}>

						<div className="py-notify py-notify--info py-notify--small">
							<div className="py-notify__icon-holder">
							<svg viewBox="0 0 20 20" className="py-icon" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
							</div>
							<div className="py-notify__content-wrapper">
								<div className="py-notify__content">
									Make sure your bank information below is correct to continue.
								</div>
							</div>
						</div>

							<div className="py-box py-box--card">
								<div className="py-box--header">
									<div className="py-box--header-title">Your Bank Details</div>
								</div>
								<div className="py-box--content">
										<Row>
											<Col md={6}>
												<div className="mb-3">
													<div className="">Account type</div>
													<div className="py-text--hint">{account ? account.accountType : ''}</div>
												</div>
											</Col>
											<Col md={6}>
												<div className="mb-3">
													<div className="">Account name</div>
													<div className="py-text--hint">{account ? account.accountName : ''}</div>
												</div>
											</Col>
										</Row>
										<Row className="justify-content-start">

											<Col md={6}>
												<div className="mb-3">
													<div className="">Routing number</div>
													<div className="py-text--hint">{account ? account.routingNumber : ''}</div>
												</div>
											</Col>
											<Col md={6}>
												<div className="mb-3">
													<div className="">Account number</div>
													<div className="py-text--hint">{account ? account.accountNumber : ''}</div>
												</div>
											</Col>
										</Row>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button className="btn btn-outline-primary" onClick={this.handleCloseConfirm}>
							Edit bank information
					</button>
						<button className="btn btn-primary" onClick={this.onSubmit}>
							Confirm
					</button>
					</Modal.Footer>
				</Modal>

			</div>
		)
	}
}

export default withStyles(styles)(BankDetails);