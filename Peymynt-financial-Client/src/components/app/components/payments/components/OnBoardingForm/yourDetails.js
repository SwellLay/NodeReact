import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InputMask from 'react-input-mask';
import { Container, Row, Col, InputGroup, FormControl, FormText, Form, FormGroup, FormLabel, Card, Table } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Spinner } from 'reactstrap';
import Select from 'react-select';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import moment from "moment";
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';


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
	dayDropdown: {
		width: '50px'
	},
	FormControl: {
		fontSize: '16px !important',
		boxShadow: 'none !important',
		border: '1px solid #b2c2cd',
	},
	typeHeadControl: {
		'& input': {
			fontSize: '16px !important',
		}
	},
	captionText: {
		color: '#4d6575',
		fontSize: '14px'
	},
	addIcon: {
		verticalAlign: 'bottom',
		color: '#9F55FF',
		marginRight: '4px'

	},
	fontSize15: {
		fontSize: '15px'
	}
})

const months = ["January", "February", "March", "April", "May",
	"June", "July", "August", "September", "October",
	"November", "December"];

class YourDetails extends Component {

	state = {
		validated: false,
		formData: {},
		ownerDetail: {},
		ownerDetailIndex: 0,
		finalListView: true,
		forEdit: false,
		ownderShipCheck: false,
		zipLength: false,
		dobValid: false,
		ssnError: false,
		popoverOpen: false,
		day: '',
		month: '',
		year: ''
	}

	onSelected = (type) => {

	}

	onSubmit = () => {
		this.props.onSubmit(this.state.formData);
	}

	onCancel = () => {
		this.setState({ finalListView: true });
	}

	onDelete = (idx) => {
		let { formData } = this.state;
		formData.owners = formData.owners.filter((item, i) => {
			return idx !== i;
		})
		this.props.onSave(formData);
	}

	onSave = () => {
		let { formData, ownerDetail, forEdit, ownerDetailIndex, month, day, year } = this.state;
		if (!formData.owners)
			formData.owners = [];
		if (forEdit)
			formData.owners[ownerDetailIndex] = ownerDetail;
		// else{
		// 	console.log("Object.keys(ownerDetail).length", Object.keys(ownerDetail).length)
		// 	if(!!ownerDetail && Object.keys(ownerDetail).length > 0 && ){
		// 		formData.owners.push(ownerDetail);
		// 	}
		// }

			formData.owners = formData.owners.filter(item => {return item !== {}})
			console.log('ownerDetail', formData.owners, ownerDetail, ownerDetailIndex, forEdit )
		//this.setState({ formData: formData, ownerDetail: {}, forEdit: false, finalListView: true });
		const form = event.currentTarget;
		console.log(form.checkValidity())
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			console.log("inside")
			if(formData.owners[ownerDetailIndex] && moment().diff(formData.owners[ownerDetailIndex].dob, 'years') >= 16 && !!month && !!year && !!day){
				formData.owners[ownerDetailIndex]['communication'].phone = formData.owners[ownerDetailIndex]['communication'].phone.replace(/[^a-zA-Z0-9]/g, "")
				formData.owners[ownerDetailIndex]['govtId'].value = formData.owners[ownerDetailIndex]['govtId'].value.replace(/[^a-zA-Z0-9]/g, "")
				this.props.onSave(formData);
				this.setState({ formData: formData, ownerDetail: {}, forEdit: false, finalListView: true });
				this.setState({
					validated: false,
					dobValid: false
				})
			}else{
				event.preventDefault();
				event.stopPropagation();
				this.setState({
					// dobValid: true,
					validated: true
				})
			}
		} else {
			if(moment().diff(formData.owners[ownerDetailIndex].dob, 'years') >= 16 && !!month && !!year && !!day){
				formData.owners[ownerDetailIndex]['communication'].phone = formData.owners[ownerDetailIndex]['communication'].phone.replace(/[^a-zA-Z0-9]/g, "")
				formData.owners[ownerDetailIndex]['govtId'].value = formData.owners[ownerDetailIndex]['govtId'].value.replace(/[^a-zA-Z0-9]/g, "")
				this.props.onSave(formData);
				this.setState({ formData: formData, ownerDetail: {}, forEdit: false, finalListView: true });
				this.setState({
					validated: false,
					dobValid: false
				})
			}else{
				event.preventDefault();
				event.stopPropagation();
				this.setState({
					dobValid: true
				})
			}
		}



	}

	isValidForm = () => {
		let { formData, ownerDetail, forEdit, ownerDetailIndex } = this.state;
		let own = formData.owners[ownerDetailIndex];
		if (own.firstName && own.lastName && own.ownership && own.dob && own.communication && own.communication.phone && own.address && own.address.addressLine1 && own.address.state && own.address.city && own.address.state && own.address.zip && own.govtId && own.govtId.value) {
			return true;
		} else {
			return false;
		}
	}

	onFormValChange = (key, value) => {
		let { formData, ownerDetailIndex } = this.state;
	//	const { statesOptions } = this.props;
		if (formData.owners.length < 1) {
			formData.owners = [];
			formData.owners.push({});
		}
		//let ownerDetail = this.state.ownerDetail ? this.state.ownerDetail : {};

		// if (key == 'address.state') {
		// 	var _state = (statesOptions) ? statesOptions.find((item) => item.id === value) : {};
		// 	formData.owners[ownerDetailIndex]['address']['state'] = _state;
		// } else
		if (key.split('.').length > 1) {
			if (key == 'address.postal') {
				this.setState({
					zipLength: value.length == 5 ? false : true
				})
			}
			let keys = key.split('.');
			if (!formData.owners[ownerDetailIndex][keys[0]]) {
				formData.owners[ownerDetailIndex][keys[0]] = {};
			}
			formData.owners[ownerDetailIndex][keys[0]][keys[1]] = value;
		}
		else {
			formData.owners[ownerDetailIndex][key] = value;
		}

		this.setState({ formData: formData });
	}

	onPhoneChange(e) {
		let { formData, ownerDetailIndex } = this.state;
		formData.owners[ownerDetailIndex]['communication'] = (formData.owners[ownerDetailIndex]['communication']) ? formData.owners[ownerDetailIndex]['communication'] : { 'phone': '', 'mobile': '' };
		formData.owners[ownerDetailIndex]['communication']['phone'] = e.target.value;
		this.setState({ formData: formData });
	}

	onSSNChange(e) {
		let { formData, ownerDetailIndex } = this.state;
		formData.owners[ownerDetailIndex]['govtId'] = (formData.owners[ownerDetailIndex]['govtId']) ? formData.owners[ownerDetailIndex]['govtId'] : { 'idType': 'SSN', 'value': '' };
		formData.owners[ownerDetailIndex]['govtId'] = { 'idType': 'SSN', 'value': e.target.value };
		this.setState({ formData: formData });
		if(this.props.data.businessType === 'partnership'){
			if(e.target.value.length < 9){
				this.setState({ssnError: true})
			}else{
				this.setState({ssnError: false})
			}
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props.data && !(state && Object.keys(state.formData).length > 0)) {
			if (props.data.owners && props.data.owners.length > 0){
				const dob = props.data.owners[state.ownerDetailIndex].dob
				return { formData: props.data, ownerDetail: props.data.owners[state.ownerDetailIndex], month: new Date(dob).getMonth(), day: new Date(dob).getDate(), year: new Date(dob).getYear()  };
			}
			else
				return { formData: props.data, finalListView: false };
		}

		return null;
	}

	onDateChange = (key, currentValue, place, value) => {

		let date = currentValue && !isNaN(new Date(currentValue)) ? new Date(currentValue) : new Date(0);
		if (place == 'm') {
			value = months.indexOf(value);
		}
		switch (place) {
			case 'd':
				this.setState({
					day: value
				})
				date.setDate(value);
				break;
			case 'm':
				this.setState({
					month: value
				})
				date.setMonth(value);
				break;
			case 'y':
				this.setState({
					year: value
				})
				date.setYear(value);
				break;
		}
		this.onFormValChange(key, date);

		// let newDateArray = (currentValue && currentValue.split('-').length > 0) ? currentValue.split('-') : [1970,1,1];
		// newDateArray[place] = value;
		// console.log(newDateArray.join('-'));
		// this.onFormValChange(key, new Date(newDateArray.join('-')));
	}

	setCountryStates = (countryStates) => {
		return countryStates && countryStates.length > 0 ? (
			countryStates.map((item, i) => {
				return (
					<option key={i} value={item.id}>
						{item.name}
					</option>
				);
			})
		) : '';
	};

	ownerShipFun = (e) => {
		if (e.target.checked) {
			this.setState({
				ownderShipCheck: true
			})
		} else {
			this.setState({
				ownderShipCheck: false
			})
		}
	}

	render() {
		const { classes, statesOptions, loading, data: {businessType} } = this.props;
		const { formData, ownerDetailIndex, finalListView, validated, ownderShipCheck, zipLength, dobValid, day, month, year } = this.state;
		const ownerDetail = (formData.owners && (formData.owners.length > ownerDetailIndex)) ? formData.owners[ownerDetailIndex] : {};
		console.log("businessType", businessType)
		return (
			<div className="pr-4">
				<header className="py-header py-header--page">
					<div className="py-header--title">
						<div className="mb-3 h3"> Tell us about the other owners</div>
						<div className="py-text"> U.S. banking regulations require us to collect the information of anyone owning 25% or more of the business. </div>
					</div>
				</header>

				{formData.owners && formData.owners.length > 0 && finalListView ? (<div>
					<Row className="p-3">
						<Table className="mb-0">
							<thead style={{ backgroundColor: '#ebeff4', textAlign: 'left' }}>
								<tr>
									<th colSpan="3">You</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style={{ textAlign: 'left' }}>
										{(formData.owners[0].firstName) ? (formData.owners[0].firstName + ' ') : '' + (formData.owners[0].lastName) ? formData.owners[0].lastName : ''}
									</td>
									<td style={{ textAlign: 'left' }}>
										{(formData.owners[0].ownership) ? formData.owners[0].ownership + '%' : ''} ownership
									</td>
									<td style={{ textAlign: 'right', cursor: 'pointer' }} 
										onClick={(e) => {
										this.setState({ finalListView: false, forEdit: true, ownerDetailIndex: 0, ownerDetail: formData.owners[0] })
									}}
										><EditIcon />
									</td>
								</tr>
							</tbody>
						</Table>
						<Table className="mb-0">
							<thead style={{ backgroundColor: '#ebeff4', textAlign: 'left' }}>
								<tr>
									<th colSpan="4">Additional Owners</th>
								</tr>
							</thead>
							<tbody>
								{
									formData.owners.map((owner, index) => {
										if(index!== 0)
										return (
											<tr>
												<td style={{ textAlign: 'left' }}>
													{(owner.firstName) ? (owner.firstName + ' ') : '' + (owner.lastName) ? owner.lastName : ''}
												</td>
												<td style={{ textAlign: 'left' }}>
													{(owner.ownership) ? owner.ownership + '%' : ''} ownership
												</td>
												<td style={{ textAlign: 'right', cursor: 'pointer' }} onClick={(e) => {
													this.setState({ finalListView: false, forEdit: true, ownerDetailIndex: index, ownerDetail: formData.owners[index] })
												}}>
													<EditIcon />
												</td>
												<td style={{ textAlign: 'right', cursor: 'pointer' }} onClick={(e) => {this.setState({popoverOpen: !this.state.popoverOpen})}}>
													<DeleteIcon id={"Popover1"}/>
													<Popover className="popover" placement="bottom-end" isOpen={this.state.popoverOpen} target="Popover1" toggle={() => {this.setState({popoverOpen: !this.state.popoverOpen})}}>
														<PopoverHeader>
															Delete this owner?
														</PopoverHeader>
														<PopoverBody>
														<div className="d-flex justify-content-start">
															<button className="btn btn-outline-primary mr-2" onClick={() => {this.setState({popoverOpen: false})}}>
																Cancel
															</button>
															<button className="btn btn-danger mr-2" type="submit" onClick={() => {this.onDelete(index)}}>
																Delete
															</button>

														</div>
														</PopoverBody>
													</Popover>
												</td>
											</tr>)
									})
								}
								<tr>
									<td colSpan={4} className="text-center">
										<div style={{ cursor: 'pointer' }} onClick={(e) => {
											let newOwnerInForm = formData;
											newOwnerInForm.owners.push({});
											this.setState({ finalListView: false, ownerDetailIndex: formData.owners.length - 1, formData: newOwnerInForm })
										}}>
											<AddIcon className={classes.addIcon} />Add additional owners
										</div>
										<hr className="m-0" />
									</td>
								</tr>
							</tbody>
						</Table>
					</Row>

					<div className="d-flex jusitfy-content-between flex-column mt-4">
						<div>
							<label className="py-checkbox">
								<input type="checkbox" id="owenership-checkbox" onChange={(e) => this.ownerShipFun(e)} />
								<span className="py-form__element__faux"></span>
								<span className="py-form__element__label">I confirm there are no additional owners with 25% or more of the business</span>
							</label>
						</div>
						<div className="mt-4">
							<button className="btn btn-primary" disabled={!ownderShipCheck} onClick={this.onSubmit}>
								Continue
								</button>
						</div>
					</div>
				</div>

				) : (<div>

					<Form noValidate validated={validated} onSubmit={this.onSave}>
						<h5>Personal informations</h5>
						<fieldset className="py-box py-box--xlarge">
							<FormGroup>
								<label className="py-form-field__label is-required">Legal Name</label>
								<div className="form-inline">
									<div className="d-flex">
										<FormControl
											placeholder="First Name"
											aria-label="First Name"
											required
											className="py-form__element__medium mr-2"
											aria-describedby="basic-addon1"
											defaultValue={ownerDetail ? ownerDetail.firstName : ''}
											onChange={(e) => {
												this.onFormValChange('firstName', e.target.value);
											}}
										/>
										<FormControl
											placeholder="Last Name"
											aria-label="Last Name"
											required
											xs={6}
											className="py-form__element__medium"
											aria-describedby="basic-addon1"
											defaultValue={ownerDetail ? ownerDetail.lastName : ''}
											onChange={(e) => {
												this.onFormValChange('lastName', e.target.value);
											}}
										/>
									</div>
								</div>
							</FormGroup>
							{
								(businessType !== "sole_proprietorship" || businessType !== "single_member_llc" || businessType !== "Single Member LLC") && (

									<FormGroup>
										<label className="py-form-field__label is-required">Ownership</label>
										<Form inline >
											<InputGroup className="mb-3">
												<FormControl
													// placeholder="%"
													aria-label="%"
													required
													className="py-form__element__xsmall"
													aria-describedby="basic-addon1"
													style={{borderRight: '0px'}}
													value={ownerDetail ? ownerDetail.ownership : ''}
													onChange={(e) => {
														if (Number(e.target.value) <= 100)
															this.onFormValChange('ownership', e.target.value);
													}}
												/>

												<InputGroup.Append style={{marginTop: '4px'}}>
													<InputGroup.Text style={{padding: '0 10px', borderLeft: '0px', backgroundColor: 'transparent'}}>%</InputGroup.Text>
												</InputGroup.Append>
												<div style={{ paddingTop: '-2px', paddingLeft: '10px' }}> of business </div>
											</InputGroup>
										</Form>
									</FormGroup>
								)
							}

							<FormGroup>
								<FormLabel className="py-form-field__label is-required">Phone</FormLabel>
								<InputMask mask="(999)-999-9999" maskChar={null}
									value={(ownerDetail && ownerDetail.communication) ? ownerDetail.communication.phone : ''}
									onChange={(e) => {
										this.onPhoneChange(e);
									}}>
									{(inputProps) =>
										<FormControl
											className="py-form__element__medium"
											aria-label="Telephone"
											required
											type="tel"
											aria-describedby="basic-addon1"
											{...inputProps}
										/>
									}
								</InputMask>
							</FormGroup>

							<FormGroup>
								<label className="py-form-field__label is-required">Date of Birth</label>
								<InputGroup className="mb-3">
									<Typeahead
										id="month"
										placeholder="Month"
										required
										dropup={true}
										options={months}
										className={`py-form__element__small ${dobValid && 'err'}`}
										defaultSelected={month ? [months[month] + ''] : ''}
										onChange={(e) => {
											if (e.length > 0)
												this.onDateChange('dob', ownerDetail.dob, 'm', e[0])
										}}
										renderMenuItemChildren={(item) => {
											return (<div className={classes.dropDownItems}>{item}</div>);
										}}
									/>
									<Typeahead
										id="day"
										placeholder="Day"
										dropup={true}
										required
										className={`py-form__element__xsmall ${dobValid && 'err'}`}
										options={Array.from({ length: 31 }, (v, i) => i + 1 + '')}
										defaultSelected={day ? [new Date(year, month, day).getDate() + ''] : ''}
										onChange={(e) => {
											if (e.length > 0)
												this.onDateChange('dob', ownerDetail.dob, 'd', e[0])
										}}
										renderMenuItemChildren={(item) => {
											return (<div className={classes.dayDropdown}>{item}</div>);
										}}
									/>
									<FormControl
										id="year"
										placeholder="Year"
										aria-label="Year"
										required
										aria-describedby="basic-addon1"
										className={`py-form__element__xsmall ${dobValid && 'err'}`}
										defaultValue={year ? new Date(year, month, day).getFullYear() : ''}
										onChange={(e) => {
											if (e.target.value.length > 0)
												this.onDateChange('dob', ownerDetail.dob, 'y', e.target.value)
										}}
									/>
								</InputGroup>
								{
									dobValid && (
										<FormText className="err color-red">You should be at least 16 years old.</FormText>
									)
								}
							</FormGroup>
							<FormGroup>
								<FormLabel className="py-form-field__label is-required">SSN</FormLabel>

								<InputMask mask="999-99-9999" maskChar={null}
									value={(ownerDetail && ownerDetail.govtId) ? ownerDetail.govtId.value : ''}
									onChange={(e) => {
										this.onSSNChange(e);
									}}>
									{(inputProps) =>
										<FormControl
											className={this.state.ssnError ? "py-form__element__medium err color-red" : "py-form__element__medium"}
											aria-label="SSN"
											required
											type="text"
											aria-describedby="basic-addon1"
											{...inputProps}
										/>
									}
								</InputMask>
								<Form.Control.Feedback className="text-left" type="invalid">
									Required
								</Form.Control.Feedback>
							</FormGroup>
							{
								this.state.ssnError && (
									<small className="err color-red">Field cannot contain less than 9 characters</small>
								)
							}
						</fieldset>

						<div>
							<h5>Home Address</h5>
							<fieldset className="py-box py-box--xlarge">
								<FormGroup>
									<label for="onboardAddress" className="py-checkbox">
										<input
											id="onboardAddress" type="checkbox" label="" onChange={(e) => {
												if (e.target.checked)
													this.onFormValChange('address', formData.address);
											}}
										/>
										<span className="py-form__element__faux"></span>
										<span className="py-form__element__label">Same as Business Address</span>
									</label>
								</FormGroup>

								<FormGroup>
									<label className="py-form-field__label">Street </label>
									<FormControl
										placeholder="Street"
										aria-label="Street"
										required
										aria-describedby="basic-addon1"
										className="py-form__element__medium"
										defaultValue={(ownerDetail && ownerDetail.address) ? ownerDetail.address.addressLine1 : ''}
										onChange={(e) => {
											this.onFormValChange('address.addressLine1', e.target.value);
										}}
									/>


								</FormGroup>
								<FormGroup className="form-inline">
									<div className="mr-3">
										<label className="py-form-field__label">City</label>
										<FormControl
											placeholder="City"
											aria-label="City"
											required
											className="py-form__element__medium"
											aria-describedby="basic-addon1"
											defaultValue={(ownerDetail && ownerDetail.address) ? ownerDetail.address.city : ''}
											onChange={(e) => {
												this.onFormValChange('address.city', e.target.value);
											}}
										/>

									</div>
									<div>
										<label className="py-form-field__label">Unit </label>
										<FormControl
											placeholder="Unit"
											aria-label="Unit"
											className="py-form__element__small"
											aria-describedby="basic-addon1"
											defaultValue={(ownerDetail && ownerDetail.address) ? ownerDetail.address.addressLine2 : ''}
											onChange={(e) => {
												this.onFormValChange('address.addressLine2', e.target.value);
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
											value={(ownerDetail && ownerDetail.address && ownerDetail && ownerDetail.address.state) ? ownerDetail.address.state.id : ""}
											onChange={(e) => {
												this.onFormValChange('address.state', e ? e : statesOptions[0]);
											}}
											isClearable={false}
											options={statesOptions}
											className="py-form__element__fluid"
											aria-describedby="basic-addon1"
											required
										/>
										</div>
										<Form.Control.Feedback className="text-left" type="invalid">
											Required
										</Form.Control.Feedback>
									</div>

									<div>
									<label className="py-form-field__label">ZIP Code</label>
										<FormControl
											className="py-form__element py-form__element__small"
											placeholder="ZIP"
											aria-label="ZIP"
											required
											pattern="\d{0,9}"
											minLength={5}
											maxLength={5}
											type="text"
											defaultValue={(ownerDetail && ownerDetail.address) ? ownerDetail.address.postal : ''}
											onChange={(e) => {
												this.onFormValChange('address.postal', e.target.value);
											}}
										/>
										{
											businessType !== 'partnership' && (
												<Fragment>
													<label className="py-form-field__label">What is your position with the organization?</label>
													<FormControl
														className="py-form__element py-form__element__small"
														placeholder="Position"
														required
														pattern="\d{0,9}"
														minLength={5}
														maxLength={5}
														type="text"
														defaultValue={(ownerDetail && ownerDetail.address) ? ownerDetail.address.postal : ''}
														onChange={(e) => {
															this.onFormValChange('address.postal', e.target.value);
														}}
													/>
												</Fragment>
											)
										}
										{/* <label className="py-form-field__label">ZIP Code</label>
												<InputMask mask="99999" maskChar={null} value={(ownerDetail && ownerDetail.address) ? ownerDetail.address.postal : ''} onChange={(e) => {
													this.onFormValChange('address.postal', e.target.value);
												}}>

												{(inputProps) =>
													<FormControl
														className="py-form__element__small"
														placeholder="ZIP"
														aria-label="ZIP"
														required
														type="text"
														aria-describedby="basic-addon1"
														{...inputProps}
													/>
												}
											</InputMask> */}
									</div>
									{zipLength && (<span className="w-100 error">ZIP field cannot contain less then 5 characters</span>)}
									<span className="py-text--hint">P.O. Box addresses cannot be accepted</span>
								</FormGroup>
							</fieldset>
						</div>

						<div className="d-flex justify-content-start">
							<button className="btn btn-primary mr-2" type="submit" disabled={loading}>
								Save and continue {loading && (<Spinner size="sm" color="light" />)}
							</button>
							{formData.owners && formData.owners.length > 0 && <button className="btn btn-outline-primary mr-2" onClick={this.onCancel}>
								Cancel
									</button>
							}

						</div>
					</Form>

				</div>)}
			</div>
		)
	}
}

export default withStyles(styles)(YourDetails);