import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputMask from 'react-input-mask';
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { Container, Row, Col, InputGroup, FormControl, Form, FormGroup, FormLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Spinner } from 'reactstrap';
import Select from 'react-select';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';


const styles = theme => ({
	header: {
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
		outline: 'none',
		'&:hover': {
			background: '#0b59b1',
		}
	},
	sellTypeRadio: {
		marginTop: '-10px'
	},
	rootRadio: {
		background: '#1f7eea',
		color: '#1f7eea',
		'&$checked': {
			color: '#1f7eea',
		}
	},
	checkedRadio: {
		background: '#1f7eea'
	},
	dropDownItems: {
		fontSize: '16px',
		whiteSpace: 'pre-line',
		padding: '5px',
	},
	menuStyle: {

	},
	typeHeadControl: {
		'& input': {
			fontSize: '16px !important',
		}
	},
	captionText: {
		color: '#4d6575',
		fontSize: '14px'
	}
})

const businessCategoryOptions = [{ type: "Accounting, Auditing, and Bookkeeping Services" }, { type: "Advertising Services" }, { type: "Architectural, Engineering, and Surveying Services" },
{ type: "Automotive Body Repair Shops" }, { type: "Bands, Orchestras, and Miscellaneous Entertainers" }, { type: "Barber and Beauty Shops" }, { type: "Chiropractors" },
{ type: "Commercial Photography, Art, and Graphics" }, { type: "Construction Materials" }, { type: "Courier Services - Air or Ground, Freight Forwarders" },
{ type: "Dance Halls, Studios and Schools" }, { type: "Dentists, Orthodontists" }, { type: "Department Stores" }, { type: "Doctors" }, { type: "Eating Places, Restaurants" },
{ type: "General Contractors - Residential and Commercial" }, { type: "Health and Beauty Spas" }, { type: "Household Employer" }, { type: "Insurance Sales, Underwriting, and Premiums" },
{ type: "Landscaping and Horticultural Services" }, { type: "Legal Services, Attorneys" }, { type: "Management, Consulting, and Public Relations Services" },
{ type: "Medical Services and Health Practitioners" }, { type: "Miscellaneous General Merchandise Stores" }, { type: "Miscellaneous Repair Shops and Related Services" },
{ type: "Nursing Care/Personal Care Facilities" }, { type: "Organizations, Charitable and Social Service" }, { type: "Organizations, Religious" },
{ type: "Other General Services" }, { type: "Photographic Studios" }, { type: "Professional Services" }, { type: "Real Estate Agents and Managers - Rentals" },
{ type: "Stenographic and Secretarial Support Services" }];

class BusinessDetails extends Component {

	state = {
		validated: false,
		formData: {},
		einDisabled: false,
		dbaDisabled: false,
		dbaHide: false,
		einCheckBoxHide: false,
		nonProfit: false,
		einCheckboxDefault: false,
		statesOptions: [],
		fetchData: false,
		dropdownOpen: false,
		zipLength: false
	}

	onSubmit = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			this.props.onSubmit(this.state.formData);
		}

		this.setState({
			validated: true
		})

	}


	componentDidMount() {
		const { businessType } = this.props.data;
		console.log('businessType', businessType)
		if (businessType == "sole_proprietorship" || businessType == "single_member_llc" || businessType == "Single Member LLC") {
			this.setState({
				einDisabled: false,
				dbaHide: true,
				einCheckboxDefault: false
			})
		} else if (businessType == "non_profit" || businessType == "partnership" || businessType == 'Multiple Member LLC' || businessType == 'corporation') {
			this.setState({
				nonProfit: true,
				einCheckBoxHide: true,
				einDisabled: false,
			})
		} else {
			this.setState({
				einDisabled: true,
				einCheckBoxHide: false,
				einCheckboxDefault: true
			})
		}

		if (this.props.data) {
			if (this.props.data.ein) {
				this.setState({
					einCheckboxDefault: false
				})
			}
			this.setState({ formData: this.props.data, fetchData: true })

		}

	}

	onFormValChange = (key, value) => {
		let formData = this.state.formData ? this.state.formData : {};
		if (key.split('.').length > 1) {
			if (key == 'address.postal') {
				this.setState({
					zipLength: value.length == 5 ? false : true
				})
			}
			let keys = key.split('.');
			if (!formData[keys[0]])
				formData[keys[0]] = {};
			formData[keys[0]][keys[1]] = value;
		}
		else {
			formData[key] = value;
		};

		this.setState({ formData: formData });
	}


	toggle = () => {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	render() {
		const { classes, statesOptions, loading, data: { businessType } } = this.props;
		const { formData, einDisabled, validated, einCheckboxDefault, dbaHide, dbaDisabled, fetchData,
			dropdownOpen, nonProfit, einCheckBoxHide, zipLength } = this.state;
			console.log('einCheckBoxHide', einCheckBoxHide)
		return (
			<div className="onboarding__business__details">
				<header className="py-header py-header--page">
					<div className="py-header--title">
						<div className="h3 mb-3"> Tell us about your business </div>
					</div>
				</header>
				{/* <Select
                      	valueKey={"id"}
						  labelKey={"name"}
						  placeholder="State"
					  value={(formData && formData.address && formData.address.state) ? formData.address.state.id : ''}
					  onChange={(e) => {
						  this.onFormValChange('address.state', e);
					  }}
					  isClearable={false}
					  options={statesOptions}
                    /> */}

				{fetchData && (<Form noValidate validated={validated} onSubmit={this.onSubmit}>

					<fieldset className="py-box py-box--card">
								<div className="py-box--header">
									<div className="py-box--header-title">Business informations</div>
								</div>
								<div className="py-box--content">

						<FormGroup>
							<label className="py-form-field__label">Business Legal Name</label>
							<FormControl
								placeholder="Business Legal Name"
								aria-label="Business Legal Name"
								aria-describedby="basic-addon1"
								className="py-form__element__medium"
								required
								defaultValue={formData ? formData.legalName : ''}
								onChange={(e) => {
									this.onFormValChange('legalName', e.target.value);
								}}
							/>
							<Form.Control.Feedback className="text-left" type="invalid">
								Required
							</Form.Control.Feedback>
						</FormGroup>
						<FormGroup>
							<label className="py-form-field__label">Category</label>
							<div className="relative">
								<Select
									valueKey={"type"}
									labelKey={"type"}
									placeholder="Category"
									className="py-form__element__fluid"
									value={formData && formData.businessCategory ? formData.businessCategory : businessCategoryOptions[0]}
									onChange={(e) => {
										this.onFormValChange('businessCategory', e ? e.type : businessCategoryOptions[0]);
									}}
									options={businessCategoryOptions}
								/>
							</div>

							<Form.Control.Feedback className="text-left" type="invalid">
								Required
                             </Form.Control.Feedback>
						</FormGroup>
						<FormGroup>
							<label className="py-form-field__label">You sell</label>
							<RadioGroup row
								aria-label="Gender"
								name="gender1"
								required
								className={classes.sellTypeRadio}
								value={formData && formData.sellType ? formData.sellType : ''}
								onChange={(e) => {
									this.onFormValChange('sellType', e.target.value);
								}}
							>

								<FormControlLabel className="py-brand--type" value="Product" control={<Radio color='primary' classes={{ root: classes.root, checked: classes.checked }} />} label="Product" />
								<FormControlLabel className="py-brand--type" value="Service" control={<Radio color='primary' classes={{ root: classes.root, checked: classes.checked }} />} label="Service" />
								<FormControlLabel className="py-brand--type" value="Both" control={<Radio color='primary' classes={{ root: classes.root, checked: classes.checked }} />} label="Both" />
							</RadioGroup>

							<Form.Control.Feedback type="invalid">
								Required
                </Form.Control.Feedback>
						</FormGroup>

						<FormGroup>
							<label className="py-form-field__label">Description</label>
							<Form.Control
								as="textarea"
								rows="4"
								required
								aria-label="SSN"
								className="py-form__element__fluid"
								aria-describedby="basic-addon1"
								value={formData ? formData.description : ''}
								onChange={(e) => {
									this.onFormValChange('description', e.target.value);
								}}
							/>
							<Form.Control.Feedback className="text-left" type="invalid">
								Required
                            </Form.Control.Feedback>
						</FormGroup>

						<FormGroup>
							<label className="py-form-field__label">Employer Identification Number (Tax ID)</label>
							<OverlayTrigger
								key="top"
								placement="top"
								overlay={
									<Tooltip id={`tooltip-top`} >
										If you process more than $20,000/year we use this to fill out you 1099-K form
                                        </Tooltip>
								}
							>
								<InputMask mask="99-9999999" disabled={einDisabled} maskChar={null} value={(formData && formData.ein) ? formData.ein : ''} onChange={(e) => {
									this.onFormValChange('ein', e.target.value);
								}}>
									{(inputProps) =>
										<FormControl
											style={{ maxWidth: '150px' }}
											className="py-form__element__medium"
											placeholder="EIN"
											aria-label="EIN"
											required
											type="text"
											disabled={einDisabled}
											aria-describedby="basic-addon1"
											{...inputProps}
										/>
									}
								</InputMask>
							</OverlayTrigger>

							<Form.Control.Feedback className="text-left" type="invalid">
								Required
                                   </Form.Control.Feedback>


							{!einCheckBoxHide && (<Form.Check type="checkbox" className={classes.captionText} label="I don't have an EIN"
								defaultChecked={einCheckboxDefault}
								onChange={(e) => {
									this.setState({ einDisabled: e.target.checked });
									this.onFormValChange('ein', e.target.checked ? '' : formData.ein);
								}} />)}
						</FormGroup>
						{dbaHide && !einDisabled &&
							(<FormGroup>
								<label className="py-form-field__label">Trade Name (DBA)</label>
								<OverlayTrigger
									key="top"
									placement="top"
									overlay={
										<Tooltip id={`tooltip-top`} >
											A trade name or DBA is a business name you've register with IRS
                                        </Tooltip>
									}
								>
									<FormControl
										placeholder="DBA"
										aria-label="DBA"
										required
										className="py-form__element__medium"
										disabled={dbaDisabled}
										value={(formData && formData.tradeName) ? formData.tradeName : ''}
										onChange={(e) => {
											this.onFormValChange('tradeName', e.target.value);
										}}
									/>
								</OverlayTrigger>

								<Form.Control.Feedback className="text-left" type="invalid">
									Required
								</Form.Control.Feedback>
								<Form.Check type="checkbox" className={classes.captionText} label="I didn't register my EIN with DBA"
									defaultChecked={dbaDisabled}
									onChange={(e) => {
										this.setState({ dbaDisabled: e.target.checked });
										this.onFormValChange('tradeName', e.target.checked ? '' : formData.tradeName);
									}} />
							</FormGroup>
							)}

						{nonProfit && (
							<Fragment>
								<FormGroup>
									<label className="py-form-field__label" >How do you typically receive your donations?</label>
									<div className="py-select--native">
										<Form.Control as="select"
											required
											className="py-form__element py-form__element__medium"
											defaultValue={(formData && formData.donationVia) ? formData.donationVia : ''}
											onChange={(e) => {
												this.onFormValChange('donationVia', e.target.value);
											}}>
											<option value="">Select</option>
											<option value="Email">Email</option>
											<option value="Events">Events</option>
											<option value="Website">Website</option>
										</Form.Control>
									</div>

								</FormGroup>

								<FormGroup>
									<label className="py-form-field__label">Who has signing authority on the bank account your payments will be deposited into?</label>
									<FormControl
										placeholder="Enter full name"
										aria-label="Enter full name"
										required
										className="py-form__element__medium"
										aria-describedby="basic-addon1"
										defaultValue={(formData && formData.signingAuthorityName) ? formData.signingAuthorityName : ''}
										onChange={(e) => {
											this.onFormValChange('signingAuthorityName', e.target.value);
										}}
									/>
									<Form.Control.Feedback className="text-left" type="invalid">
										Required
								</Form.Control.Feedback>
								</FormGroup>
							</Fragment>
						)}
					</div>
					</fieldset>

						<fieldset className="py-box py-box--card">
						<div className="py-box--header">
									<div className="py-box--header-title">Contact informations</div>
								</div>
								<div className="py-box--content">
							<FormGroup>
								<label className="py-form-field__label">Telephone</label>
								<InputMask mask="(999)-999-9999" maskChar={null} value={formData ? formData.telephone : ''} onChange={(e) => {
									this.onFormValChange('telephone', e.target.value);
								}}>
									{(inputProps) =>
										<FormControl
											aria-label="Telephone"
											required
											className="py-form__element__medium"
											type="tel"
											aria-describedby="basic-addon1"
											{...inputProps}
										/>
									}
								</InputMask>

								<Form.Control.Feedback className="text-left" type="invalid">
									Valid Telephone Required
									</Form.Control.Feedback>
							</FormGroup>

							<FormGroup>
								<label className="py-form-field__label">Website</label>
								<FormControl
									className={classes.FormControl}
									aria-label="Website"
									aria-describedby="basic-addon1"
									className="py-form__element__medium"
									defaultValue={formData ? formData.website : ''}
									onChange={(e) => {
										this.onFormValChange('website', e.target.value);
									}}
								/>
							</FormGroup>
							{
								businessType === 'non_profit' && (
									<FormGroup>
										<label className="py-form-field__label">How old is the organization?</label>
										<FormControl
											className={classes.FormControl}
											aria-describedby="basic-addon1"
											className="py-form__element__medium"
											// defaultValue={formData ? formData.website : ''}
											onChange={(e) => {
												this.onFormValChange('website', e.target.value);
											}}
										/>
									</FormGroup>
								)
							}


							<FormGroup>
								<label className="py-form-field__label">Street</label>
								<FormControl
									placeholder="Street"
									aria-label="Street"
									required
									className="py-form__element__medium"
									aria-describedby="basic-addon1"
									defaultValue={(formData && formData.address) ? formData.address.addressLine1 : ''}
									onChange={(e) => {
										this.onFormValChange('address.addressLine1', e.target.value);
									}}
								/>
							</FormGroup>

							<FormGroup className="form-inline">
								<div className="">
									<label className="py-form-field__label">Unit</label>
									<FormControl
										placeholder="Unit"
										aria-label="Unit"
										className="py-form__element__small mr-3"
										aria-describedby="basic-addon1"
										defaultValue={(formData && formData.address) ? formData.address.addressLine2 : ''}
										onChange={(e) => {
											this.onFormValChange('address.addressLine2', e.target.value);
										}}
									/>
								</div>

								<div>
									<label className="py-form-field__label">City</label>
									<FormControl
										placeholder="City"
										aria-label="City"
										required
										className="py-form__element__small"
										aria-describedby="basic-addon1"
										defaultValue={(formData && formData.address) ? formData.address.city : ''}
										onChange={(e) => {
											this.onFormValChange('address.city', e.target.value);
										}}
									/>
								</div>
							</FormGroup>

							<FormGroup className="form-inline">
								<div className="mr-3">
									<label className="py-form-field__label">State</label>
									<div className="py-select--select py-form__element__medium">
										<Select
											valueKey={"id"}
											labelKey={"name"}
											placeholder="State"
											required
											value={(formData && formData.address && formData.address.state && formData.address.state.id) ? formData.address.state.id : ""}
											onChange={(e) => {
												this.onFormValChange('address.state', e ? e : statesOptions[0]);
											}}
											isClearable={false}
											options={statesOptions}
										/>
									</div>
								</div>
								<div>
									<label className="py-form-field__label">ZIP code</label>
									<FormControl
										className="py-form__element py-form__element__small"
										placeholder="ZIP"
										aria-label="ZIP"
										required
										pattern="\d{0,9}"
										minLength={5}
										maxLength={5}
										type="text"
										defaultValue={(formData && formData.address) ? formData.address.postal : ''}
										onChange={(e) => {
											this.onFormValChange('address.postal', e.target.value);
										}}
									/>
								</div>
								{zipLength && (<span className="w-100 error">ZIP field cannot contain less then 5 characters</span>)}
								<span className="py-text--hint w-100">P.O. Box addresses cannot be accepted</span>
							</FormGroup>
							</div>
						</fieldset>
						
					<FormGroup>
						<div className="py-form-field__label mb-2">Have you accepted credit card payments in the past?</div>
						<label for="accepted_credit_card_true" className="py-radio">
							<input type="radio" id="accepted_credit_card_true" name="accepted_credit_card_in_past" defaultChecked={formData && formData.accepted_credit_card_in_past} />
							<span className="py-form__element__faux"></span>
							<span className="py-form__element__label">Yes</span>
						</label>

						<label for="accepted_credit_card_false" className="py-radio">
							<input type="radio" id="accepted_credit_card_false" name="accepted_credit_card_in_past" defaultChecked={formData ? !formData.accepted_credit_card_in_past : false} />
							<span className="py-form__element__faux"></span>
							<span className="py-form__element__label">No</span>
						</label>

						{/* <Form inline >
									<Form.Check style={{ marginRight: '10px' }} type="radio" label="Yes" />
									<Form.Check type="radio" label="No" name="accepted_credit_card_in_past"  />
								</Form> */}
					</FormGroup>


					<div className="d-flex justify-content-start mt-4">
						<button type="submit" className="btn btn-primary" disabled={loading} >
							Save and continue {loading && (<Spinner size="sm" color="light" />)}
						</button>
					</div>
				</Form>)}
			</div>
		)
	}

}

export default withStyles(styles)(BusinessDetails);