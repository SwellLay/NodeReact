import { cloneDeep, groupBy } from "lodash";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Elements, StripeProvider } from 'react-stripe-elements';
import {
  Alert,
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import SelectBox from "utils/formWrapper/SelectBox";
import { openGlobalSnackbar, updateData } from "../../../../../actions/snackBarAction";
import { editPayment, recordPayment } from "../../../../../api/InvoiceService";
import CustomerServices from "../../../../../api/CustomerServices";
import { getStripeKey } from '../../../../../utils/common';
import { changePriceFormat, _showExchangeRate, _setCurrency } from "../../../../../utils/GlobalFunctions";
import InjectInvoiceCardPayout from './InvoiceCardPayout';
import SavedCard from "./Payout/SavedCard";
import { fetchAllCustomerCards } from "../../../../../actions/CustomerActions";
import CenterSpinner from "../../../../../global/CenterSpinner";
import { chargeCard } from "../../../../../actions/paymentAction";

export const paymentAccount = currencyName => {
  return ([
    {
      label: `Cash on Hand (${currencyName})`,
      value: "cash_on_hand",
    },
    {
      label: `CHASE COLLEGE (${currencyName})`,
      value: "chase_college",
    },
    {
      label: `Owner Invesstment / Drawings (${currencyName})`,
      value: "owner_investment",
    },
    {
      label: `Cash on Hand (${currencyName})`,
      value: "cash_on_hand",
    }
  ])

};

export const ACCOUNT = [
  {
    id: 0,
    label: "Bank payment",
    value: "bank"
  },
  {
    id: 1,
    label: "Cash",
    value: "cash"
  },
  {
    id: 2,
    label: "Check",
    value: "cheque"
  },
  {
    id: 3,
    label: "Credit Card",
    value: "card"
  },
  {
    id: 4,
    label: "PayPal",
    value: "paypal"
  },
  {
    id: 5,
    label: "Other",
    value: "other"
  }
];

const PAYMENT_INPUT = {
  account: "",
  amount: 0,
  memo: "",
  method: "",
  exchangeRate: 0,
  invoiceId: "",
  businessId: "",
  paymentDate: new Date(),
};

class InvoicePayment extends Component {
  state = {
    paymentInput: PAYMENT_INPUT,
    invoiceInput: {},
    recordStep: 0,
    bankSubmit: false,
    showSave: false,
    allCardsData: [],
    cardLoading: true
  };

  componentDidMount() {
    const { recordStep } = this.state
    if(recordStep === 1){
      console.log("in step1")
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { openRecord, receipt, paymentData, recordStep, edit } = this.props;
    if (prevProps.openRecord != openRecord) {
      let paymentInput = cloneDeep(this.state.paymentInput);
      if(!!receipt){
        paymentInput = receipt;
        let pMethods = groupBy(ACCOUNT, "value");
        paymentInput.amount = parseFloat(receipt.amount).toFixed(2) || 0;
        // paymentInput.method = (pMethods[receipt.methodToDisplay] && pMethods[receipt.methodToDisplay][0].label)
        // paymentInput.method = pMethods[receipt.methodToDisplay] && (receipt.methodToDisplay == 'card' ? pMethods.credit_card[0].label : pMethods[receipt.methodToDisplay][0].label)
      }else{
        paymentInput.invoiceId = paymentData._id;
        paymentInput.amount = parseFloat(paymentData.dueAmount).toFixed(2) || 0;
        paymentInput.amount = parseFloat(paymentData.dueAmount).toFixed(2) || 0;
        paymentInput.methodToDisplay = null;
        paymentInput.memo = null;
      }
      paymentInput.exchangeRate = paymentData.exchangeRate || 0;
      paymentInput.businessId = (typeof paymentData.businessId === "object") ? paymentData.businessId._id : paymentData.businessId;
      this.setState({ paymentInput });
      if(!!recordStep){
        this.setState({recordStep})
      }
    }
    if(this.state.recordStep === 1){
      const cardData = await CustomerServices.fetchCustomerCards(paymentData.customer._id)
      if(prevState.recordStep !== this.state.recordStep){
        if(!!cardData.data && !!cardData.data.cards && cardData.data.cards.length > 0){
          this.setState({
            allCardsData: cardData.data.cards,
            showSave: true,
            cardLoading: false
          })
        }else{
          this.setState({
            allCardsData: [],
            showSave: false,
            cardLoading: false
          })
        }
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.paymentReducer.data !== nextProps.paymentReducer.data){
      if(nextProps.paymentReducer.success){
        console.log("in props", this.props.paymentReducer, nextProps.paymentReducer)
        this.props.refreshData() 
        this.props.onClose()
      }
    }
  }
  onSaveClick = async e => {
    e.preventDefault();
    this.setState({ bankSubmit: true });
    const { showSnackbar, paymentData, refreshData, openAlert, receipt, onClose } = this.props;
    try {
      let { paymentInput } = this.state;
      let payment;
      let payload = {
        paymentInput:{
          amount: parseFloat(paymentInput.amount),
          amountInHomeCurrency: paymentInput.amountInHomeCurrency,
          exchangeRate: paymentInput.exchangeRate,
          manualMethod: paymentInput.method.toLowerCase(),
          memo: paymentInput.memo,
          method: "manual",
          paymentDate: paymentInput.paymentDate
        }
      }
      console.log()
      //Checking for edit or record.
      if (receipt) {
        payment = (await editPayment(paymentData._id, receipt._id, payload)).data.payment
      } else {
        payment = (await recordPayment(paymentData._id, payload)).data.payment
      }
      await this.onCancel();
      this.setState({ bankSubmit: false });
      refreshData();
      openAlert(payment, "Record a payment", "The payment was recorded.");
      // onClose()
      // showSnackbar("Payment recorded successfully", false);
    } catch (error) {
      console.error("Got error from server ", error);
      this.setState({ bankSubmit: false });
      showSnackbar(error.message, true);
    }
  };

  onCancel = e => {
    this.setState({
      paymentInput: PAYMENT_INPUT
    });
    this.props.onClose();
  };

  handlePayment = (event, fieldName) => {
    let paymentInput = this.state.paymentInput;
    if (fieldName === "paymentDate") {
      paymentInput[fieldName] = event;
    } else if (fieldName === "account") {
      paymentInput[fieldName] = event.value;
    } else if (fieldName === "method") {
      paymentInput[fieldName] = event.value;
      paymentInput.methodToDisplay = event.value;
    } else {
      const { name, value } = event.target;
      paymentInput[name] = value;
    }
    this.setState({
      paymentInput
    });
  };

  _setAmount = e => {
    const { name, value } = e.target;
    let paymentInput = cloneDeep(this.state.paymentInput);
    paymentInput[name] = parseFloat(value).toFixed(2);
    this.setState({
      paymentInput
    })
  };

  _handleChargeSaveCard = (id) => {
    const { paymentData } = this.props
    console.log("id", id)
    let paymentBody = {
			"paymentInput": {
				"uuid": paymentData.uuid,
				"method": "card",
				"amount": parseFloat(this.state.paymentInput.amount),
				"cardId": id,

      }
		};
    this.props.chargeCard(paymentBody)
  }

  render() {
    const { openRecord, onClose, businessInfo, paymentData, allCards, receipt, receiptIndex, refreshData, edit, isEdit, paymentReducer } = this.props;
    const { paymentInput, recordStep, bankSubmit, showSave, allCardsData, cardLoading } = this.state;
    const currencySymbol = _setCurrency(paymentData && paymentData.currency, businessInfo && businessInfo.currency).symbol
    const currencyName = _setCurrency(paymentData && paymentData.currency, businessInfo && businessInfo.currency)
    console.log("paymentReducer", allCards, showSave)
    return (
      <Modal
        isOpen={openRecord}
        toggle={onClose}
        // className="modal-add modal-confirm"
        onClosed={() => {
          this.setState({ recordStep: 0 })
        }}
      >
        <ModalHeader toggle={onClose}>{isEdit === true ? 'Edit a payment for this invoice' : 'Record a payment'} </ModalHeader>
        {
          recordStep == 0 ? (
            <div>
              <ModalBody>
                <div>
                  <Row style={{ paddingLeft: '10%' }}>
                    <Col xs={3}>
                      <i className="fas fa-credit-card" style={{ fontSize: '31px', color: 'white', backgroundColor: 'rgb(68, 47, 140)', padding: '20px', borderRadius: '50%' }}></i>
                    </Col>
                    <Col xs={8}>
                      <div style={{ marginBottom: '10px' }}>
                        Process your customer's credit card directly through Peymynt.
                      </div>
                      <Button className="btn-primary" onClick={() => {
                        this.setState({ recordStep: 1 })
                      }}>Charge a credit card</Button>
                    </Col>
                  </Row>
                  <div class="py-text--divider">
                    <span>
                       &nbsp;&nbsp; Or &nbsp;&nbsp;
                    </span>
                    </div>
                  <Row style={{ paddingLeft: '10%', marginBottom: '24px' }}>
                    <Col xs={3}>
                      <i className="fas fa-cash-register" style={{ fontSize: '31px', color: 'white', backgroundColor: 'rgb(68, 47, 140)', padding: '20px', borderRadius: '50%' }}></i>
                    </Col>
                    <Col xs={9}>
                      <div style={{ marginBottom: '10px' }}>
                        Record a payment you've already received, such as cash, check, or bank payment.
                      </div>
                      <Button className="btn-primary" onClick={() => {
                        this.setState({ recordStep: 2 })
                      }}>Record a manual payment</Button>
                    </Col>
                  </Row>
                </div>
              </ModalBody>
            </div>
          ) : recordStep == 1 ? (
            <div>
              {
                cardLoading ? <CenterSpinner/> :
                showSave ?
                  <SavedCard
                    allCards={allCardsData}
                    amount={paymentInput.amount}
                    setDifferent={() => this.setState({showSave: false})}
                    handlePayment = {(e) => this.handlePayment(e)}
                    handleSubmit={(id) => this._handleChargeSaveCard(id)}
                    selectedId={allCardsData[0].id}
                    onClose={onClose}
                    loading={paymentReducer.loading}
                    setAmount = {this._setAmount.bind(this)}
                  />
                  : (
                    <ModalBody className="invoice__record__modal__body">
                      <StripeProvider apiKey={getStripeKey()}>
                        <Elements>
                          <InjectInvoiceCardPayout invoiceData={paymentData} onBack={() => {
                              this.setState({ recordStep: allCardsData.length > 0 ? 1 : 0, showSave: allCardsData.length > 0 })
                            }}
                            showSnackbar={(message, error) => this.props.showSnackbar(message, error)}
                            businessInfo={businessInfo}
                            receipt = {receipt}
                            receiptIndex = {receiptIndex}
                            refreshData={() => refreshData()}
                            openAlert={(payment, number) => this.props.openAlert(payment, "Record a payment", "The payment was recorded.")}
                          />
                        </Elements>
                      </StripeProvider>
                    </ModalBody>
                  )
              }
            </div>
          ) : (
                <Form onSubmit={this.onSaveClick}>
                  <ModalBody className="invoice__record__modal__body">
                    {
                      isEdit === true ? (
                        <Alert color="primary" className="alertReciept">
                          <div className="d-flex">
                            <svg viewBox="0 0 20 20" className="py-icon--lg mr-2" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
                            <span>Payments received through Peymynt are automatically categorized to ensure accurate bookkeeping.</span>
                          </div>
                        </Alert>)
                      :(<p>
                        Record a payment you’ve already received, such as cash, cheque, or
                        bank payment.
                      </p>)
                    }

                    <FormGroup className="py-form-field py-form-field--inline">
                      <Label for="exampleEmail" className="py-form-field__label">
                        Payment date
                      </Label>
                      <div className="py-form-field__element">
                        <DatepickerWrapper
                          selected={paymentInput.paymentDate}
                          onChange={date => this.handlePayment(date, "paymentDate")}
                          placeholderText="YYYY-MM-dd"
                          dateFormat="YYYY-MM-dd"
                          disabled={edit === true ? true : false}
                          className={edit?"form-control invoiceDisabled":"form-control"}
                        />
                      </div>
                    </FormGroup>
                    <FormGroup className="py-form-field py-form-field--inline">

                        <Label for="exampleEmail" className="py-form-field__label">
                          Amount
                        </Label>


                        <div className="py-form-field__element">
                        <InputGroup>

                          <InputGroupAddon addonType="prepend" className={`prependAddon-input-card ${edit === true && 'is-disabled'}`}
                          disabled={edit === true ? true : false}
                          >
                            {currencySymbol}
                          </InputGroupAddon>
                          {"   "}
                          <Input
                            value={paymentInput.amount}
                            onChange={this.handlePayment}
                            type="number"
                            name="amount"
                            step="any"
                            onBlur={this._setAmount.bind(this)}
                            disabled={edit === true ? true : false}
                            className={edit?"is-disabled py-form__element__medium":"py-form__element__small"}
                          />
                        </InputGroup>

                          <small> {paymentInput.exchangeRate && paymentData.currency ? `${paymentData.currency.code} - ${paymentData.currency.name}` : ""}</small>
                        </div>
                    </FormGroup>
                    {_showExchangeRate(businessInfo.currency, paymentData.currency) ?
                      <Fragment>
                        <FormGroup className="py-form-field py-form-field--inline">
                          <Label for="exampleEmail" className="py-form-field__label">
                            Exchange rate
                          </Label>
                          <div className="py-form-field__element">
                            <Input
                              value={paymentInput.exchangeRate}
                              onChange={this.handlePayment}
                              name="exchangeRate"
                              disabled={edit === true ? true : false}
                              className={edit?"invoiceDisabled":"py-form__element__medium"}
                            />
                            <div className="py-text--small py-text--hint">{paymentInput.exchangeRate && paymentData.currency ? `${paymentData.currency.code} to ${businessInfo.currency.code}` : ""}</div>
                          </div>
                        </FormGroup>
                        <FormGroup className="py-form-field py-form-field--inline">
                          <Label for="exampleEmail" className="py-form-field__label">
                            Converted amount
                          </Label>
                          <div className="py-form-field__element">
                            <div className="d-flex flex-column">
                              <strong>{businessInfo.currency.symbol}{""}{changePriceFormat((paymentInput.amount * paymentInput.exchangeRate), 2)} </strong>
                              <small>{paymentInput.exchangeRate ? `${businessInfo.currency.code} - ${businessInfo.currency.name}` : ""}</small>
                            </div>
                          </div>

                        </FormGroup>
                      </Fragment>
                      : ""
                    }
                    <FormGroup className="py-form-field py-form-field--inline">
                      <Label for="method" className="py-form-field__label">
                        Payment method
                      </Label>
                      <div className="py-form-field__element">
                        <SelectBox
                          value={paymentInput.methodToDisplay && paymentInput.methodToDisplay.toLowerCase()}
                          onChange={e => this.handlePayment(e, "method")}
                          options={ACCOUNT}
                          clearable={false}
                          placeholder={"Select a payment method..."}
                          required
                          name="method"
                          disabled={edit === true ? true : false}
                          className={edit?"invoiceDisabled is-disabled":""}
                        />
                      </div>
                    </FormGroup>
                    {/* <FormGroup row>
                      <Label for="exampleEmail" className="py-form-field__label">
                        Payment account
                      </Label>
                      <Col sm={7}>

                        <SelectBox
                          value={paymentInput.account}
                          onChange={e => this.handlePayment(e, "account")}
                          options={paymentAccount(currencyName)}
                          clearable={false}
                          placeholder={"Select a payment account..."}
                          required
                          name="method"
                        />
                        <small className="color-muted">
                          {" "}
                          Any account into which you deposit and withdraw funds from. */}
                          {/* <a href="#">Learn more.</a>{" "} */}
                        {/* </small>
                      </Col>
                    </FormGroup> */}
                    <FormGroup className="py-form-field py-form-field--inline">
                      <Label for="exampleEmail" className="py-form-field__label">
                        Memo / notes
                      </Label>
                      <div className="py-form-field__element">
                        <textarea
                          value={paymentInput.memo}
                          onChange={this.handlePayment}
                          name="memo"
                          rows="4"
                          className="form-control py-form__element__medium"
                        />
                      </div>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="btn-outline-primary"
                      onClick={this.onCancel}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="btn-primary"
                    >
                      {bankSubmit ? <Spinner size="sm" color="light" /> : 'Submit'}
                    </Button>
                  </ModalFooter>
                </Form>
              )}
      </Modal>
    );
  }
}

const mapPropsToState = state => ({
  businessInfo: state.businessReducer.selectedBusiness,
  allCards: state.getAllCards,
  paymentReducer: state.paymentReducer
});

const mapDispatchToProps = dispatch => {
  return {
    refreshData: () => {
      dispatch(updateData());
    },
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error));
    },
    fetchAllCustomerCards: (id) => {
      dispatch(fetchAllCustomerCards(id))
    },
    chargeCard: (body) => {
      dispatch(chargeCard(body))
    }
  };
};

export default connect(
  mapPropsToState,
  mapDispatchToProps
)(InvoicePayment);
