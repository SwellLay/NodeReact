import React, { Fragment } from 'react';
import { Row, Input, InputGroup, Form, FormGroup, InputGroupAddon, Button, Modal, Label, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormControl } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Link } from 'react-router-dom';
import Cards from 'global/Card';
import { getAmountToDisplay, _setCurrency, toMoney } from '../../../../../utils/GlobalFunctions';

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

export const RefundModal = props => {
    console.log("RefundModal", props);
    return (
        <Fragment>
            <Modal isOpen={props.open}
				toggle={props.handleRefundModalClose}
			 	centered
			>
				<ModalHeader
				toggle={props.handleRefundModalClose}
				className="py-modal__header__title">
					<span>Refund to {props.data.customer}</span>
				</ModalHeader>
                <ModalBody className="Refund-Modal__body">
                    <div className="py-form-field--condensed">
                        <div className="py-form-field py-form-field--inline">
                            <div className="py-form-field__label">
                                Refund amount
                            </div>
                            <div className="py-form-field__element">
                                <InputGroup className="d-inline-flex align-items-center flex-wrap">
                                	<div className="refund-modal__amount">
										{/* <FormControl id="refund_amount" className={props.classes.editAmount} defaultValue={toMoney(props.data.amount)}
										onChange={e => props.changeBody('refundAmount', e.target.value)} onBlur={(e) => {
                                            props.setEditRefund(true)
										}} disabled={props.editMountRefund} /> */}
										<FormGroup className="py-form-field py-form-field--inline">

											{/* <Label for="exampleEmail" className="py-form-field__label">
											Amount
											</Label> */}


									<div>
										<InputGroup>
											<InputGroupAddon addonType="prepend" className={`prependAddon-input-card ${props.editMountRefund === true && 'disabled'}`}
											disabled={props.editMountRefund === true ? true : false}
											>
												{props.data.currency.symbol}
											</InputGroupAddon>
											{"   "}
											<Input
												defaultValue={props.data.amount}
												onChange={e => props.changeBody('refundAmount', e.target.value)}
												type="number"
												name="amount"
												step="any"
												// onBlur={(e) => {
												// 	props._setAmount(e.target.value)
												// }}
												disabled={props.editMountRefund}
												className={props.editMountRefund ? "invoiceDisabled" : "py-form__element__small"}
											/>
										</InputGroup>

											{/* <small> {paymentInput.exchangeRate && paymentData.currency ? `${paymentData.currency.code} - ${paymentData.currency.name}` : ""}</small> */}
											</div>
										</FormGroup>
                                    </div>
									<InputGroupAddon addonType="prepend" >
										<a className="py-text--link" onClick={(e) => {
											props.setEditRefund(false)
										}}>Edit Amount</a>
									</InputGroupAddon>
								</InputGroup>
							</div>
						</div>
						<div className="py-form-field py-form-field--inline align-items-center">
							<div className="py-form-field__label">
								{props.data.paymentType}
							</div>
							<div className="py-form-field__element">
							{
								props.data.paymentType.toLowerCase() == "invoice" ?
								<Fragment>
									<Link className="py-text--link" to={"/app/invoices/view/" + props.data.invoiceId}>{`Invoice #${props.data.other ? props.data.other.invoiceNo : ''}`}</Link>
								</Fragment> :
								<Fragment>
									<Link className="py-text--link" to={"/app/sales/checkouts/edit/" + props.data.checkoutId}>{`${props.data.other ? props.data.other.checkoutName : ''}`}</Link>
								</Fragment>
							}
							</div>
						</div>
						<div className="py-form-field py-form-field--inline">
							<div className="py-form-field__label">
								Customer paid by
	          				</div>
							<div className="py-form-field__element">
								<Cards
									number={props.data.method !== 'bank' ? props.data.card && props.data.card.number : props.data.bank && props.data.bank.number}
									name={props.data.method !== 'bank' ? props.data.card.cardHolderName : props.data.bank.name}
									issuer={(props.data.method) && props.data.method}
									preview={true}
									method={props.data.method !== 'bank' ? props.data.card : props.data.bank}
								/>
							</div>
						</div>
						<div className="py-form-field py-form-field--inline">
							<div className="py-form-field__label is-required">
								Reason
	          				</div>
							<div className="py-form-field__element">
								<Typeahead
									id={"refund_reason"}
									required={true}
									dropup={true}
									className="py-form__element__medium"
									placeholder="Please select a reason"
									options={['Customer complaint', 'Duplicate payment', 'Other']}
									onChange={(val) => {
                                        props.changeBody('reason', val[0])
									}}
									renderMenuItemChildren={(item) => {
                                        return (<div className={props.classes.dropDownItems}>{item}</div>);
									}}
                                    />
							</div>
						</div>
						<div className="py-form-field py-form-field--inline">
							<div className="py-form-field__label">
								Notes to self
	          				</div>
							<div className="py-form-field__element">
								<FormControl
									id="refund_notes"
									as="textarea"
									rows="4"
									aria-label="SSN"
									className="py-form__element__medium"
									aria-describedby="basic-addon1"
									onChange={(e) => {
										body['notes'] = e.target.value
									}}
                 				/>
							</div>
						</div>
					</div>
                </ModalBody>
				<ModalFooter>
					<Link to={ props.data.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + props.data.linkId : '/app/sales/checkouts/edit/' + props.data.linkId}>
						<Button  className="btn btn-outline-primary">
							View {props.data.paymentType}
						</Button>
					</Link>
					<Button variant="contained" className="btn-primary" onClick={() => { props.postRefund(props.data.index) }}>
						Refund
	            </Button>
				</ModalFooter>
			</Modal>
        </Fragment>
    )
}