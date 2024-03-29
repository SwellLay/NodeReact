import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { CardElement, injectStripe } from "react-stripe-elements";

class BillingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            storage: "",
            isProcessing: false,
            isCardComplete: false
        };
    }

    validateForm() {
        return (
            this.state.name !== "" &&
            this.state.storage !== "" &&
            this.state.isCardComplete
        );
    }

    handleFieldChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleCardFieldChange = event => {
        this.setState({
            isCardComplete: event.complete
        });
    }

    handleSubmitClick = async event => {
        event.preventDefault();

        const { name } = this.state;

        this.setState({ isProcessing: true });

        const { token, error } = await this.props.stripe.createToken({ name });

        this.setState({ isProcessing: false });

        this.props.onSubmit(this.state.storage, { token, error });
    }

    render() {
        const loading = this.state.isProcessing || this.props.loading;

        return (
            <form className="BillingForm" onSubmit={this.handleSubmitClick}>
                <FormGroup bsSize="large" controlId="storage">
                    <ControlLabel>Storage</ControlLabel>
                    <FormControl
                        min="0"
                        type="number"
                        step="any"
                        value={this.state.storage}
                        onChange={this.handleFieldChange}
                        placeholder="Number of notes to store"
                    />
                </FormGroup>
                <hr />
                <FormGroup bsSize="large" controlId="name">
                    <ControlLabel>Cardholder&apos;s name</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.name}
                        onChange={this.handleFieldChange}
                        placeholder="Name on the card"
                    />
                </FormGroup>
                <ControlLabel>Credit Card Info</ControlLabel>
                <CardElement
                    className="card-field"
                    onChange={this.handleCardFieldChange}
                    style={{
                        base: { fontSize: "18px", fontFamily: '"Open Sans", sans-serif' }
                    }}
                />
            </form>
        );
    }
}

export default BillingForm;
