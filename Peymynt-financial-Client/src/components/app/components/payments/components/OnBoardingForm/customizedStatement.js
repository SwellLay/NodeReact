import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Container, Row, Col, InputGroup, FormControl, Form, FormGroup, FormLabel } from 'react-bootstrap';
import { Spinner } from 'reactstrap';

const styles = theme => ({
	header: {
		fontSize: '20px',
		lineHeight: '24px',
		fontWeight: '700',
		textAlign: 'left',
		marginBottom: '14px'
	},
	subHeader: {
		margin: '16px 0',
		color: '#687578',
		fontSize: '14px',
		lineHeight: '18px',
		textAlign: 'left'
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
		outline: 'none',
		'&:hover': {
			background: '#0b59b1',
		}
	},
	textLeft:{
		fontSize:'14px',
		padding:'6px 10px'
	},
	FormControl: {
	},
})

class CustomizedStatement extends Component {

	state = {
		formData: {},
		tos: {},
		isAgree: false
	}

	onSelected = (type) => {

	}

	onSubmit = () => {
		if (!this.state.isAgree) {
			this.props.onShowSnackbar('Agree the Payments by Peymynt');
		} else {
			this.props.onSubmit(this.state.formData);
		}
	}

	set_tos = (tos) => {
		this.setState({ tos: tos })
	}

	static getDerivedStateFromProps(props, state) {
		if (props.data && !(state && Object.keys(state.formData).length > 0))
			return { formData: props.data }
		return null;
	}

	onFormValChange = (key, value) => {
		let formData = this.state.formData ? this.state.formData : {};
		if (key.split('.').length > 1) {
			let keys = key.split('.');
			if (!formData[keys[0]])
				formData[keys[0]] = {};
			formData[keys[0]][keys[1]] = value;
		}
		else {
			formData[key] = value;
		}
		this.setState({ formData: formData });
	}

	toggleAgree = () => {
		this.setState({ isAgree: !this.state.isAgree });
	}

	render() {
		const { classes,selectedBusiness, loading } = this.props;
		const { statement, tos_acceptance } = this.state.formData;
		const { isAgree } = this.state;
		return (
			<div>
				<div className="h4"> Customize your customer's statement </div>
				<div className="py-text">
					When customers pay you, your business name appears on their statements.
					Customize your name so they can instantly recognize your brand.
				</div>
				{/* <FormGroup style={{ background: '#f3f3f3', padding: '24px', borderRadius: '6px' }}> */}
				<FormGroup className="py-box py-box--gray py-box--large mt-3">
						<FormLabel className="py-form-field__label">Business Name</FormLabel>

						<div>
							<FormControl
								placeholder="Business Name"
								aria-label="Business Name"
								maxLength="21"
								className="py-form__element__fluid form-control-lg"
								aria-describedby="basic-addon1"
								defaultValue={statement ? statement.displayName:selectedBusiness.organizationName}
								onChange={(e) => {
									this.onFormValChange('statement.displayName', e.target.value);
								}}
							/>
							<span className="py-text--hint">{21-statement.displayName.length} Characters Remaining</span>
						</div>

				</FormGroup>
					<Row style={{ margin: '25px auto'}}>
						<img src="/assets/images/cust-img.jpg" style={{ maxWidth: '320px', margin: 'auto'}}/>
					</Row>
				<div>

					<div className="mb-4">
					<label for="privacy-policy" className="py-checkbox">
						<input type="checkbox"

						id="privacy-policy"
						onChange={(e) => {
							let tos = {
								date: Math.floor(Date.now() / 1000),
								userAgent: navigator.userAgent,
								ip: '0.0.0.0'
							};
							this.props.setVerify(tos);
							this.onFormValChange('tos_acceptance', tos);
							this.toggleAgree();
						}}

						/>
						<span className="py-form__element__faux"></span>
						<span className="py-form__element__label">
							I agree to the Payments by Peymynt <a className="py-text--link" href="/" target="_blank">Term of service</a>
						</span>
					</label>
					</div>

					<button  className="btn btn-primary" onClick={this.onSubmit} disabled={!this.state.isAgree || !statement.displayName}>
						Save and continue {loading && (<Spinner size="sm" color="light" />)}
					</button>

				</div>
			</div>
		)
	}
}

export default withStyles(styles)(CustomizedStatement);