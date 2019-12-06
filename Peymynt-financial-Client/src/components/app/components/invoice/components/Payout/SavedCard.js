import React, { Component } from 'react'
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
import { _paymentMethodIcons } from '../../../../../../utils/GlobalFunctions';
import { ShowPaymentIcons } from '../../../../../../global/ShowPaymentIcons';

export default class SavedCard extends Component {
    state={
        selected: {
            selected_0: true,
            selectedId: null
        }
    }

    setSelectedCard = (i, id, e) => {
        this.setState({
            selected: {[`selected_${i}`]: true},
            selectedId: id
        })
    }
    _setAmount = e => {
        const { name, value } = e.target;
        let paymentInput = cloneDeep(this.state.paymentInput);
        paymentInput[name] = parseFloat(value).toFixed(2);
        this.setState({
          paymentInput
        })
    };
    render() {
        const {openSaveCard, onClose, allCards, amount, handlePayment, setAmount, selectedId, handleSubmit, loading} = this.props;
        console.log("selectedId", this.state.selectedId, selectedId)
        return (
            <Form onSubmit={(e) => {e.preventDefault();handleSubmit(this.state.selectedId ? this.state.selectedId : selectedId)}}>
                <ModalBody className="py-4 px-5">
                    <FormGroup className="py-form-field">
                        <Label>Amount:</Label>
                        <div className="py-form-field__element">
                            <InputGroup>
                                <InputGroupAddon addonType="prepend" className={`prependAddon-input-card`}
                                // disabled={edit === true ? true : false}
                                >
                                    {'$'}
                                </InputGroupAddon>
                                {"   "}
                                <Input
                                    value={amount}
                                    onChange={(e) => handlePayment(e)}
                                    type="number"
                                    name="amount"
                                    step="any"
                                    onBlur={e => setAmount(e)}
                                    // disabled={edit === true ? true : false}
                                    className={"flex-1"}
                                />
                            </InputGroup>
                            {/* <small> {paymentInput.exchangeRate && paymentData.currency ? `${paymentData.currency.code} - ${paymentData.currency.name}` : ""}</small> */}
                        </div>
                    </FormGroup>
                    <FormGroup className="py-form-field">
                        <Label>Select Payment Method:</Label>
                        <div>
                            <ul className="payment__cards__list">
                                {
                                    allCards.length > 0 &&
                                    allCards.map((card, i) => {
                                        return (
                                            <li key={i} onClick={this.setSelectedCard.bind(this, i, card.id)}
                                                className={this.state.selected[`selected_${i}`] === true ? 'is-selected payment__cards__list__item' : 'payment__cards__list__item'}
                                            >

                                                    <ShowPaymentIcons
                                                        icons={[card.brand]}
                                                        className="icon"
                                                    />
                                                    <span className="number"> <span>••• ••• •••</span> {card.cardNumber}</span>
                                                    <span className="date">{`${card.expiryMonth}/${card.expiryYear}`}</span>
                                                    <span className="name">{card.cardHolderName}</span>
                                                    {this.state.selected[`selected_${i}`] === true }
                                            </li>
                                        )
                                    })
                                }
                                <li onClick={() => this.props.setDifferent()} className="payment__cards__list__item">Use a Different Credit Card</li>
                            </ul>
                        </div>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-outline-primary" onClick={() => onClose()}>Back</Button>
                    <Button color="primary" className="" disabled={loading}>
                        {loading && <Spinner size="sm" color="light" />} Record payment
                    </Button>
                </ModalFooter>
            </Form>
        )
    }
}
