import React, { Component } from 'react'
import { Card, CardBody, Col, Form, FormGroup } from 'reactstrap';
import { ShowPaymentIcons } from '../../../../../../global/ShowPaymentIcons';
import { _documentTitle } from '../../../../../../utils/GlobalFunctions';
import { fetchPaymentSettings, savePaymentSettings } from './../../../../../../actions/paymentSettings';
import { connect } from 'react-redux';
const acceptPayment = {
  padding: "25px",
  background: "#e0f4fb",
  borderRadius: "6px",
  marginBottom: "25px",
  border: "solid 2px #bde7f6"
};
const declinePayment = {
  padding: "25px",
  background: "#fcfbe3",
  borderRadius: "6px",
  marginBottom: "25px",
  border: "solid 2px #f6f2ad"
};
const pyIcon = {
  marginTop : '-11px'
};
const payload = {};

class Payments extends Component {

  constructor (props) {

    super(props)
    this.state =  {
      cardpopupAccept : this.props.data.accept_card,
      isPopup : false ,
    } 
  }

  componentDidMount(){
    this.props.fetchPaymentSettings();

    // let businessInfo = JSON.parse(localStorage.getItem('reduxPersist:businessReducer'))
    // _documentTitle(businessInfo.selectedBusiness, '')
    const { businessInfo } = this.props;
    document.title = businessInfo ? `Peymynt - ${businessInfo.organizationName} - Payments Settings` : "Peymynt - Payments Settings";
  }

  componentWillReceiveProps(newProps) {
    if(newProps.data.accept_card !== this.props.data.accept_card)
    {
      this.setState({
        isPopup : true
      });
    }
  }

  handleField = (event) => {
    const { name, checked, value } = event.target;
    if (name !== 'accept_card')
    {
      this.handlePopupClose()
    }
    if(name === 'preferred_mode')
    {
       payload[name] = value;
    }
    else{
      payload[name] = checked;
    }
      this.saveSettingAPICall(payload);
  };

  handlePopup = (check) => {
    payload['allInvoices'] = check;
    this.saveSettingAPICall(payload);
    this.handlePopupClose();
  }

    handlePopupClose = () =>
    {
      this.setState({
        isPopup : false
      })
    }

  saveSettingAPICall = (dataObj) => {
    this.props.savePaymentSettings(dataObj);
  }

  render() {
    const { data, loading } = this.props;
    return (
      <div className="py-page__content py-page__settings__payments">
        <div className="py-page__inner" style={{ maxWidth: "1000px"}}>
          <header className="py-header--page">
              <div className="py-header--title">
                  <h2 className="py-heading--title">Payments</h2>
              </div>
          </header>
          <div className="py-box py-box--large">
            <Form>
              <FormGroup>
                <div className="d-flex">
                  <label className="py-switch m-0" htmlFor="accept_card">
                    <input
                      id="accept_card"
                       disabled={loading}
                      type="checkbox"
                      className="py-toggle__checkbox"
                      name="accept_card"
                      value="accept_card"
                       onChange={this.handleField}
                       checked={data.accept_card}
                    />
                    <span className="py-toggle__handle"></span>
                    <span className="py-toggle__label">
                      Accept credit card payments on new invoices
                    </span>
                    <span className="py-form-field__hint receipts-setting__hint-text">
                      2.9% + 30c per transaction
                    </span>
                  </label>
                  <ShowPaymentIcons className="credit-card-icons" icons={['visa', 'master', 'amex', 'discover']}/>
                </div>
              </FormGroup>
              { this.state.isPopup && 
              <React.Fragment>
          {data.accept_card ?
            <div className="py-settings-accept-payment" style={acceptPayment}>
              <div >
                
                <div className="d-inline-flex align-items-center mb-4">
                  <svg className="py-icon mr-2" style={pyIcon} viewBox="0 0 20 20" id="info" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path>
                  </svg>
                  <h4 style={{
                      fontSize: "20px",
                      fontWeight: "400"
                  }}>
                  Dont Forget about existing invoices</h4>
                  </div>
                 
                  <p className="mb-4">They are also more likey to get paid fater when you turn on credit card payments</p>
                  <button className="btn btn-outline-primary" onClick={() => this.handlePopup('true')}>Accept creadit card payments for existing invoices</button>
                  <button className="btn btn-link" onClick={this.handlePopupClose}> Not Right Now </button>
              </div>
              
            </div>
           :
            <div className="py-settings-accept-payment" style={declinePayment}>
              <div>
                
                <div className="d-inline-flex align-items-center mb-4">
                


                <svg className="mr-2" style={pyIcon} xmlns="http://www.w3.org/2000/svg" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12" y1="17" y2="17"/></svg>
                  <h4 style={{
                      fontSize: "20px",
                      fontWeight: "400"
                  }}>
                  Do you wish to turn off credit card payments on all existing invoices as well?</h4>
                  </div>
                 
                  
                  <button className="btn btn-outline-primary" onClick={() => this.handlePopup('false')}>Yes turn off credit card payments for existing invoices as well ?</button>
                  <button className="btn btn-link" onClick={this.handlePopupClose}> Not Right Now </button>
              </div>
              
            </div>
            }
         

             </React.Fragment> }
              <FormGroup>

                <div className="d-flex">
                <label className="py-switch m-0" htmlFor="accept_bank">
                  <input
                    id="accept_bank"
                     disabled={loading}
                    type="checkbox"
                    name="accept_bank"
                    value="accept_bank"
                    className="py-toggle__checkbox"
                     onChange={this.handleField}
                     checked={data.accept_bank}
                  />
                  <span className="py-toggle__handle"></span>&nbsp;
                  <span className="py-toggle__label">
                    Accept bank payments (ACH) on new invoices
                  </span>
                  <span className="py-form-field__hint receipts-setting__hint-text">
                    1% per transaction
                  </span>
                </label>

                <ShowPaymentIcons className="bank-logos__wrapper" icons={['boi', 'chase', 'wells']}/>

                </div>
              </FormGroup>
              <div className="py-divider"></div>
              <div>
                <span className="py-text">When offering both payment methods to your customers, how would you prefer to be paid?</span>
              </div>
              <ul className="list-inline m-0">
                <li className="list-inline-item mr-4">
                  <label htmlFor="id_payment_method_0" className="py-radio">
                    <input
                      type="radio"
                      name="preferred_mode"
                      id="id_payment_method_0"
                      checked={data.preferred_mode === "card" ? true : false}
                      value="card"
                       onChange={this.handleField}
                    />
                      <span className="py-form__element__faux"></span>
                      <span className="py-form__element__label">Credit Card</span>
                  </label>
                </li>
                <li className="list-inline-item">
                  <label htmlFor="id_payment_method_1" className="py-radio">
                    <input
                      type="radio"
                      name="preferred_mode"
                      id="id_payment_method_1"
                      checked={data.preferred_mode === "bank" ? true : false}
                      value="bank"
                       onChange={this.handleField}
                    />
                      <span className="py-form__element__faux"></span>
                      <span className="py-form__element__label">Bank Payment (ACH)</span>
                  </label>
                </li>
              </ul>
            </Form>
          </div>

          <div className="d-flex flex-column jusitfy-content-center align-items-center">
            <img src='/assets/icons/png/credit-card.png' className="py-icon--xlg" />
            <h3 className="py-heading--title">Give customers the option to pay you right away</h3>
          <h4 className="py-heading--subtitle">Online payments help you get paid upto 3 times faster!</h4>
          </div>
          <div className="benefits-description py-box py-box--large py-box--gray">
            <ul className="py-list--icon">
              <li>
                <svg viewBox="0 0 20 20" className="py-icon mr-2" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.586L17.293 4.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L7 14.586z"></path></svg>
                <strong>Fast payouts.</strong> 2 business days for credit cards, 2-7 business days for bank payments.
              </li>
              <li>
                <svg viewBox="0 0 20 20" className="py-icon mr-2" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.586L17.293 4.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L7 14.586z"></path></svg>
                <strong>No surcharges.</strong> Accept AMEX and international credit cards at no extra cost.
              </li>
              <li>
                <svg viewBox="0 0 20 20" className="py-icon mr-2" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.586L17.293 4.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L7 14.586z"></path></svg>
                <strong>Returned fees on refunds.</strong> Necer worry about reversing a charge.
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

const mapPropsToState = ({ paymentSettings: { data, loading }, snackbar, businessReducer }) => ({
  businessInfo: businessReducer.selectedBusiness,
  data,
});

export default connect(mapPropsToState, { savePaymentSettings, fetchPaymentSettings })(Payments)
