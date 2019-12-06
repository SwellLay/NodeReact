import React from 'react';
import { Elements } from 'react-stripe-elements';

import InjectedCheckoutForm from './CheckoutPayForm';

class StripeCheckout extends React.Component {
    render() {
        return (
            <Elements>
                <InjectedCheckoutForm {...this.props} handleText={e => this.props.handleText(e)} />
            </Elements>
        );
    }
}

export default StripeCheckout;