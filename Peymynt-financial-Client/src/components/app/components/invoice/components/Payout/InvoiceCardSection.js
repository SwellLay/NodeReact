import React from 'react';
import { CardElement, Row, Col, CardNumberElement, CardExpiryElement, CardCVCElement, PaymentRequestButtonElement, IbanElement, IdealBankElement, PostalCodeElement } from 'react-stripe-elements';
import { InputGroup, InputGroupAddon, FormGroup, Input } from 'reactstrap';
import { stripeStyle } from '../../../../../../global/commonStyles';

class InvoiceCardSection extends React.Component {
    componentDidMount(){
        let cssLink = document.createElement('link');
        cssLink.href = './card.css';
        cssLink.rel = "stylesheet";  
        cssLink.type = "text/css"; 
        let frame5 = document.getElementsByName('__privateStripeFrame5');
        // if(frame5.length > 0){
        //     frame5[0].document.body.appendChild(cssLink)
        // }
        // console.log('frams', frames)
    }
    render() {
        console.log("amount", this.props.amount)
        return (
            <div className="full-width payment-view">

                <div className="form-group">
                    <label for="PaymentCard__Name" className="py-form-field__label">Name</label>
                    <input type="text" placeholder="Customer name" id="PaymentCard__Name" className="form-control" name="firstName" onChange={(e) => this.props._handleCardHolder(e)}/>
                </div>
                <FormGroup className="payment-view__input-group">

                    <div className="payment-view__card-number">
                        <CardNumberElement id="PaymentCard__Number" style={stripeStyle} className="py-stripe__element" placeholder="Card number"  />
                    </div>
                    <div className="payment-view__expire-date">
                        <CardExpiryElement style={stripeStyle} className="py-stripe__element"  id="PaymentCard__ExpireDate"  />
                    </div>
                    <div className="payment-view__cvc">
                        <CardCVCElement style={stripeStyle} className="py-stripe__element" id="PaymentCard__CVV" />
                    </div>
                </FormGroup>

                <FormGroup>
                    <PostalCodeElement placeholder="ZIP/Postal" style={stripeStyle} className="py-stripe__element" />
                </FormGroup>
                <FormGroup className="payment-view__amount">
                <InputGroup>
                    <InputGroupAddon addonType="prepend" className="prependAddon-input-card no-border">
                        {this.props.sign}
                    </InputGroupAddon>
                    <input
                        type="text"
                        step="any"
                        value={this.props.amount}
                        onChange={e => this.props._handleAmountChange(e)}
                        name="dueAmount"
                        onBlur={(e) => this.props._setAmount(e)}
                        className="form-control"
                    />
                </InputGroup>
                    {/* <input type="text" placeholder="Customer name" className="strpe-control" name="firstName" onChange={(e) => this.props._handleCardHolder(e)}/> */}
                </FormGroup>
                {/* <CardElement style={{
                        base: {
                            fontSize: '18px'
                        }
                    }} className="card-element" /> */}
            </div>
        );
    }
}

export default InvoiceCardSection;