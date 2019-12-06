import React from 'react';
import { CardElement, Row, Col, Input, CardNumberElement, CardExpiryElement, CardCVCElement, PaymentRequestButtonElement, IbanElement, IdealBankElement, PostalCodeElement } from 'react-stripe-elements';
import { Button, FormGroup, Label } from 'reactstrap';
import history from 'customHistory';

var stripeStyle = {
    base: {
        fontSize: '16px',
        color: '#41494f',
        fontFamily: "py-circular, sans-serif",
        fontSmoothing: 'antialiased',

        '::placeholder': {
            color: 'rgba(40, 21, 64, 0.3)',
            fontStyle: 'italic'
        }
    }
}

class CardSection extends React.Component {
    constructor() {
        super()
        this.state = {
            isChanged:false,
            card_number: false,
            card_expiry: false,
            card_cvc: false,
            card_zip: false,
            customerName: false,
            card_number_changed: false,
            card_expiry_changed: false,
            card_cvc_changed: false,
            card_zip_changed: false,
            customerName_changed: false,
            card_error_msg: 'Enter the card number',
            isPreview:false
        }
    }

    componentDidMount(){
        if(history.location.pathname == '/app/sales/checkouts/preview'){
              this.setState({
                isPreview:true
              })
        }
    }

    componentDidUpdate(prevProps) {
        const { isChanged } = this.props

        if (prevProps.isChanged != isChanged) {
            this.setState({
                isChanged: true,
                card_number_changed: true,
                card_expiry_changed: true,
                card_cvc_changed: true,
                card_zip_changed: true,
                customerName_changed: true,
            })
        }
    }

    stripeElementChange = (element, name, type) => {
        let {isChanged} = this.state;
        if(isChanged == true && name == 'customerName' && element.target && element.target.value !== ''){
            this.setState({ [name]: true, [type]:true });
        } else if (!element.empty && element.complete) {
            this.setState({ [name]: true, [type]:true });
        } else {
            this.setState({ [name]: false, [type]:true  });
            if(name == 'card_number' && element.error && element.error.code == 'invalid_number'){
                this.setState({ card_error_msg: 'Enter a valid card number' });
            } else {
                this.setState({ card_error_msg: 'Enter the card number' });
            }
        }
        this.setState({ isChanged: true });
        
        let {card_number, card_expiry, card_cvc, card_zip, customerName} = this.state;
        this.props.validateElement({'card_number':   card_number, 'card_expiry': card_expiry, 'card_cvc': card_cvc, 'card_zip': card_zip, 'customerName':customerName});
    }

    render() {
        let {card_number, card_expiry, card_cvc, card_zip, customerName, isChanged, card_error_msg, isPreview,
            card_number_changed,card_expiry_changed,card_cvc_changed,customerName_changed, card_zip_changed} = this.state;
        let classess = (isChanged == true && (card_number == false || card_expiry == false || card_cvc == false || card_zip == false || customerName == false))? 'full-width stripe-has-error' : 'full-width';
        let customerNameClass = (isChanged == true && customerName == false)? 'pd0 card-75 radR0 StripeElement customStripeElement StripeElement--invalid' : 'pd0 card-75 radR0 StripeElement customStripeElement';
        return (
            <div className="full-width">
                <div className="payment-view__input-group ">
                    <div className={`payment-view__card-number ${!card_number && card_number_changed ? 'stripe-has-error' : ''}`}>
                            <CardNumberElement style={stripeStyle} placeholder="Card number" className="py-stripe__element" name="card_number" onChange={(element) => this.stripeElementChange(element, 'card_number', 'card_number_changed')} />
                    </div>

                    <div className={`payment-view__expire-date ${!card_expiry && card_expiry_changed ? 'stripe-has-error' : ''}`}>
                            <CardExpiryElement className="py-form__element__small" style={stripeStyle} name="card_expiry" className="py-stripe__element" onChange={(element) => this.stripeElementChange(element, 'card_expiry', 'card_expiry_changed')}/>
                    </div>

                    <div className={`payment-view__cvc ${!card_cvc && card_cvc_changed ? 'stripe-has-error' : ''}`}>
                        <CardCVCElement className="py-form__element__small" className="py-stripe__element" style={stripeStyle} name="card_cvc" onChange={(element) => this.stripeElementChange(element, 'card_cvc', 'card_cvc_changed')}/>
                    </div>
                    
                </div>

                    <div className="errors full-width top">
                        <div className="card-50">
                        {
                            (!card_number && card_number_changed)? <span className="stripe-error ">{card_error_msg}</span> :''
                        }
                        </div>
                        <div className="card-25">
                        {
                            (!card_expiry && card_expiry_changed)? <span className="stripe-error">Enter the expiry date</span> :''
                        }
                        </div>
                        <div className="card-25">
                        {
                            (!card_cvc && card_cvc_changed)? <span className="stripe-error">Enter the security code</span> :''
                        }
                        </div>
                    </div>

            

                <div>
                    <div className="py-form-field py-form-field--condensed">
                        <div className="py-form-field__element card-detail-field-group">
                        <input style={stripeStyle} type="text" placeholder="Name on card" className={`form-control py-stripe__element card-detail-field-group__name ${!customerName && customerName_changed ? 'has-error' : ''}`} name="customerName" onChange={(e) => {this.props.handleText(e); this.stripeElementChange(e, 'customerName', 'customerName_changed') }} />

                        <PostalCodeElement style={stripeStyle} placeholder="ZIP/Postal"  className={`py-stripe__element  card-detail-field-group__zip  ${!card_zip && card_zip_changed ? 'has-error' : ''}`} name="card_zip" onChange={(element) => this.stripeElementChange(element, 'card_zip', 'card_zip_changed')}/>
                            {
                                (isChanged == true && (customerName == false || card_zip == false))? 
                                <div className="errors full-width">
                                    <div className="card-75">
                                    {
                                        (!customerName && customerName_changed)? <span className="stripe-error">Enter the cardholder's name</span> :''
                                    }
                                    </div>
                                    <div className="card-25">
                                    {
                                        (!card_zip && card_zip_changed)? <span className="stripe-error">Enter the ZIP code
                                        </span> :''
                                    }
                                    </div>
                                </div>
                                : ''
                            }
                        </div>
                    </div>
                </div>               
                
            </div>
        );
    }
}

export default CardSection;