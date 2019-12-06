import React from 'react';
import { Button, Modal, ModalBody, ModalHeader, Col, Spinner } from 'reactstrap';
import { ShowPaymentIcons } from '../../global/ShowPaymentIcons';
import { injectStripe, CardElement, Row, CardNumberElement, CardExpiryElement, CardCVCElement, PaymentRequestButtonElement, IbanElement, IdealBankElement, PostalCodeElement } from 'react-stripe-elements';
import { stripeStyle } from 'global/commonStyles';
import { initiateCard, addCard } from '../../api/CardsService';

class AddNewcardModal extends React.Component {
    state = {
        clientSecret: "",
        loading: false,
        cardHolderName: ""
    }
    componentDidMount(){
         this._handleInitiateCard();
        console.log("stripe", this.props)
    }

    _handleInitiateCard = async() => {
        const { id } = this.props;
        try{
            let initiate = await initiateCard(id);
            if(!!initiate){
                if(!!initiate.data && !!initiate.data.initiateResponse){
                    this.setState({clientSecret: initiate.data.initiateResponse.clientSecret})
                }
            }
        }catch(err){
            console.error("Car Initiate Error => ", err)
        }
    }

    _handleSubmit = async (ev) => {
        ev.preventDefault();
        const{ clientSecret, cardHolderName } = this.state;
		this.setState({loading: true})
		let cardInfo = {};
        cardInfo.isSaveCard = { allowed: this.state.saveCard }
        await this._handleInitiateCard();
        try{
            this.props.stripe.createToken().then( async res => {
                const { token } = res
                try{
                    this.props.stripe.handleCardSetup(clientSecret, {
                        payment_method_data: {
                            billing_details: {
                              name: cardHolderName
                            },
                            card:{
                                token: token.id
                            }
                          }
                    }).then( response => {
                        if(typeof response.error === 'object'){
                            if(response.error.hasOwnProperty('message')){
                                this.props.showSnackBar(response.error.message, true);
                                this.setState({loading: false})
                            }
                        }else{
                            this._proceedToPay(response.setupIntent.payment_method);
                        }
                    }).catch (err => {
                        this.props.showSnackBar(err.message, true);
                        this.setState({loading: false})
                        console.error("err card", err)
                    })
                }catch(err){
                    console.log("in err", err.message)
                    this.setState({loading: false})
                    this.props.showSnackBar(err.message, true);
                }
            })
            .catch = (err) => {
                console.error("Payment Create Token Error => ", err)
                this.setState({loading: false})
                this.props.showSnackBar(err.message, true);
            }
        }catch(err){
            console.log("err", err);
    		this.setState({loading: false})
            this.props.showSnackBar(err.message, true);
        }
	}

	_proceedToPay = async (cardData) => {
        const { id } = this.props;
		let input = {
            cardInput: {
                cardHolderName: this.state.cardHolderName,
                paymentMethodId: cardData
            }
        }
        try{
            const addCardResponse = await addCard(id, input)
            if(addCardResponse.error){
                this.props.showSnackBar(addCardResponse.message, true)
                this.setState({loading: false})
            }else{
                this.props.showSnackBar(addCardResponse.message, false)
                this.setState({loading: false})
                this.props.onClose()
                this.props.fetchCards()
            }
        }catch(err){
            console.error("Add Card Error =>", err)
            this.props.showSnackBar(err.message, true)
            this.setState({loading: false})
        }

	}

    render(){
        const { openModal, onDelete, onClose, message } = this.props;
        return (
            <Modal isOpen={openModal} toggle={onClose} className="modal-add modal-confirm modal-small" centered>
                <ModalHeader toggle={onClose}>Add New Card</ModalHeader>
                <ModalBody className="new_card_modal">
                    <ShowPaymentIcons
                        className="credit-card-icons big-payment-icons"
                        icons={['visa', 'master', 'amex', 'discover']}
                    />
                    <small style={{margin: '0 24px'}}>Credit & Debit</small>
                    <form onSubmit={this._handleSubmit.bind(this)}>
                        <div className="row">
                            <Col xs={12}>
                                <CardNumberElement id="PaymentCard__Number" style={stripeStyle} className="py-stripe__element" placeholder="Card number" required/>
                            </Col>
                            <Col xs={6} className="pdR0 mrT20">
                                <CardExpiryElement style={stripeStyle} className="py-stripe__element"  id="PaymentCard__ExpireDate"  required/>
                            </Col>
                            <Col xs={6} className="pdL0 mrT20">
                                <CardCVCElement style={stripeStyle} className="py-stripe__element" id="PaymentCard__CVV" required/>
                            </Col>
                            <Col xs={12} className="mrT20 mrB20">
                                <input type="text" className="py-stripe__element form-control" placeholder="Name on card" onChange={({target: {value}}) => this.setState({cardHolderName: value})} required/>
                            </Col>
                            <Col xs={12}>
                                <PostalCodeElement placeholder="ZIP/Postal" style={stripeStyle} className="py-stripe__element" required/>
                            </Col>
                            <Col xs={12} className="mrT20">
                                <button type="submit" className="btn btn-primary full-width" disabled={this.state.loading}>
                                    {this.state.loading && (<Spinner size="sm" color="light" />)}&nbsp;<i className="fa fa-lock"/> Save Card
                                </button>
                            </Col>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        )
    }
}

export default injectStripe(AddNewcardModal);
