import React from 'react';
import { injectStripe } from 'react-stripe-elements';
import { Button, Col, CustomInput, Row, Spinner } from 'reactstrap';

import checkoutServices from '../../../../../../api/CheckoutService'
import { toDollar } from '../../../../../../utils/common';
import CardSection from './CardSection';

const initialCheckout = (state, isEditMode) => {
    let data = {
        id: state && state._id || '',
        userId: state && state.userId || localStorage.getItem('user.id'),
        businessId: state && state.businessId || localStorage.getItem('businessId'),
        firstName: state && state.firstName || '',
        lastName: state && state.lastName || '',
        email: state && state.email || '',
        phone: state && state.phone || '',
        address: state && state.address || '',
        address2: state && state.address2 || '',
        country: state && state.country || '',
        region: state && state.region || '',
        city: state && state.city || '',
        postal: state && state.postal || '',
        cardNumber: state && state.cardNumber || '4242424242424242',
        cardExpiryDate: state && state.expiryDate || '',
        cvv: state && state.cvv || '488',
        cardHolderName: state && state.cardHolderName || 'Test',
        cardZip: state && state.cardZip || '395004',
        isSaveCard: state ? state.isSaveCard : { allowed: false },
        saveCard: state ? state.saveCard : false
    };
    if (!isEditMode) {
        delete data.id
    }
    return data
};

class CheckoutPayForm extends React.Component {
    constructor() {
        super();
        this.state = {
            previewCheckoutModel: initialCheckout(),
            checkoutDetails: {},
            inprogressPayment: false,
            isValid: false,
            isChanged: false
        }
    }

    setInProgressStatus = (value) => {
        this.setState({
            inprogressPayment: value,
        })
    };

    doPayment = async (env) => {
        const { previewModel, checkoutDetails, selectedCheckout, actions } = this.props;
        this.setInProgressStatus(true);

        // We don't want to let default form submission happen here, which would refresh the page.
        //env.preventDefault();
        this.setState({
            isChanged: true
        });

        let _card = {
            "id": "card_1Dz3NGESFAq4sBmR6pgHoNwV",
            "object": "card",
            "address_city": "",
            "address_country": "",
            "address_line1": "",
            "address_line1_check": "",
            "address_line2": "",
            "address_state": "",
            "address_zip": "",
            "address_zip_check": "",
            "brand": "visa",
            "country": "US",
            "currency": "usd",
            "cvc_check": "",
            "dynamic_last4": "",
            "fingerprint": "OnKSZRcnObkG6lgx",
            "funding": "credit",
            "last4": "4242",
            "metadata": {},
            "name": "Geeks Dev",
            "tokenization_method": null
        };

        // if (!previewModel || !previewModel.firstName || !previewModel.lastName || !previewModel.email) {
        //     console.log('Missing contact details');
        //     this.props.showError(true);
        //     this.props.showSnackbar("Missing contact details", true);
        //     this.setInProgressStatus(false);
        // } else if (!checkoutDetails) {
        //     this.props.showError(false);
        //     console.log(' Checkout details missing');
        //     this.props.showSnackbar("Checkout details missing", true);
        //     this.setInProgressStatus(false);
        // } else {
        this.props.showError(false);
        console.log(' Receiving');
        this.props.stripe.createToken(_card).then(({ token }) => {
            console.log('Received Stripe token:' + JSON.stringify(token));
            if (!token) {
                this.props.showSnackbar("Card details missing", true);
            }
            else if (!previewModel || !previewModel.firstName || !previewModel.lastName || !previewModel.email) {
                console.log('Missing contact details');
                this.props.showError(true);
                this.props.showSnackbar("Missing contact details", true);
                this.setInProgressStatus(false);
            } else if (!checkoutDetails.fields && checkoutDetails.fields.address && (!previewModel || !previewModel.address || !previewModel.country.id || !previewModel.state.id || !previewModel.postal || !previewModel.city)) {
                console.log('Missing Address details');
                this.props.showError(true);
                this.props.showSnackbar("Address details missing", true);
                this.setInProgressStatus(false);
            }else if (!checkoutDetails) {
                this.props.showError(false);
                console.log(' Checkout details missing');
                this.props.showSnackbar("Checkout details missing", true);
                this.setInProgressStatus(false);
            }
            else {
                token['card']['brand'] = 'visa';
                let _checkoutPayment = {
                    "checkoutInput": {
                        "uuid": (selectedCheckout && selectedCheckout.uuid) ? selectedCheckout.uuid : checkoutDetails.uuid,
                        "stripeToken": token.id,
                        "method": "card",
                        "customer": {
                            "firstName": previewModel.firstName,
                            "lastName": previewModel.lastName,
                            "email": previewModel.email,
                            "phone": previewModel.phone
                        },
                        "address": {
                            "addressLine1": previewModel.address,
                            "addressLine2": previewModel.address2,
                            "country": previewModel.country,
                            "state": previewModel.region,
                            "city": previewModel.city,
                            "postal": (previewModel.postal) ? parseInt(previewModel.postal) : -1
                        },
                        "cardHolderName": previewModel.customerName,
                        "rawElementResponse": JSON.stringify(token),
                        "saveCard": previewModel.saveCard ? previewModel.saveCard : false,
                        'cardHolderName': previewModel.customerName
                    }
                };
                this.paymentCallback(_checkoutPayment);
            }
            // this.setInProgressStatus(false);
        }).catch((err) => {
            console.log('error', err);
            this.setInProgressStatus(false);
        });
        // }
    };

    paymentCallback = async (_checkoutPayment) => {
        const { actions } = this.props;
        try {
            const response = await checkoutServices.doCheckoutPayment(_checkoutPayment);
            if (response.statusCode === 200) {
                this.props.showSnackbar("Payment has been processed successfully", false);
                this.props.onPayment(true);
                this.setInProgressStatus(false);
        } else {
                this.props.showSnackbar(response.message || 'Something went wrong, please try again.', true);
            }
        } catch (error) {
            console.log('error: ', error);
            if(error.message== "Seems this checkout is not available at the moment. Please contact business owner."){
                this.setInProgressStatus(false);
                this.props.onTurnOff(true);
            }else{
                this.setInProgressStatus(false);
                this.props.showSnackbar("Something went wrong", true)
            }
        }
    };

    validateElement = (data) => {
    };

    handleText = (event) => {
        const target = event.target;
        const { name, value } = event.target;
        const { previewModel, selectedCheckout, checkoutDetails } = this.props;
        let modal = previewModel;
        if (target.type === 'checkbox') {
            console.log("modal", modal);
            if (name === "saveCard") {
                modal.isSaveCard = { allowed: !previewModel.isSaveCard };
                modal.saveCard = !modal.saveCard;
            } else if (name === "sell") {
                modal.sell.allowed = !modal.sell.allowed;
                modal.sell.account = ''
            } else {
                modal.buy.allowed = !modal.buy.allowed;
                modal.buy.account = ''
            }
            this.setState({
                previewCheckoutModel: modal
            })
        } else if (name === "taxes") {
            modal.taxes.push(value)
        } else {
            this.setState({
                previewCheckoutModel: { ...this.state.previewCheckoutModel, [name]: value }
            })
        }
    };

    render() {
        const { previewModel, selectedCheckout, checkoutDetails } = this.props;
        const { previewCheckoutModel, inprogressPayment, isValid, isChanged } = this.state;
        return (
            <div>
                <div className="py-header py-header--page">
                    <div className="py-header--title">
                        <h4 className="py-heading--section-title">Billing details</h4>
                    </div>

                    <div className="ml-auto text-right">
                        <ul className="list-inline m-0">
                            <li className="list-inline-item"><img src="/assets/images/payments/visa.png" width='32' className="mr-1" /></li>
                            <li className="list-inline-item"><img src="/assets/images/payments/mastercard.png" width='32' className="mr-1" /></li>
                            <li className="list-inline-item"><img src="/assets/images/payments/amex.png" width='32' className="mr-1" /></li>
                            <li className="list-inline-item"><img src="/assets/images/payments/discover.png" width='32' className="m-0" /></li>
                        </ul>
                        <div className="py-text--xsmall py-text--hint">Credit, Debit and Prepaid Cards edit</div>
                    </div>
                </div>
                <CardSection handleText={(e) => this.props.handleText(e)}
                    validateElement={(data) => this.validateElement(data)} isChanged={isChanged} />


                <button disabled={inprogressPayment} className="btn btn-block btn-primary d-inline-flex align-items-center justify-content-center" onClick={this.doPayment}> {inprogressPayment ? <Spinner size="sm" color="light" /> : ""}<i className="fa fa-lock py-icon--small mr-2" /> Pay {(checkoutDetails.total >= 0.51) ? toDollar(checkoutDetails.total) : toDollar(0.51)}</button>
            </div>
        );
    }
}

export default injectStripe(CheckoutPayForm);
