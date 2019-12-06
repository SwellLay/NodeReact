import React, { Component } from 'react'
import { Table } from 'reactstrap';
import CenterSpinner from '../../../../../../global/CenterSpinner';
// import { _paymentMethodIcons } from '../../../../../../utils/GlobalFunctions';
import { PaymentMethodConfirmation } from '../../../../../../utils/PopupModal/DeleteModal';
import AddNewcardModal from '../../../../../../utils/PopupModal/AddNewCardModal';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { getStripeKey } from '../../../../../../utils/common';
import * as PaymentIcon from 'global/PaymentIcon';

export default class CustomerPayment extends Component {
  state = {
    openDelete: false,
    selectedCardNumber: "",
    selectedId: '',
    newCardModal: false
  };
  openDeleteModal = (selectedId, selectedCardNumber, index) => {
    let a = {};
		a['modal_' + index] = true;

    this.setState({ openDelete: true, selectedCardNumber, selectedId, a })
  };

  deleteCard = () => {
    this.props.deleteCard(this.state.selectedId);
    console.log("delete")
  };

  toggleModal = e => {
    // let a = {};
		// a['modal_' + index] = false;
    this.setState({
      openDelete: !this.state.openDelete
    })
  };

  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
    if (this.props.deleteCardData !== nextProps.deleteCardData) {
      const { error, success, message } = nextProps.deleteCardData;
      if (success) {
        this.props.showSnackBar(message, false);
        this.props.fetchCards()
        this.toggleModal()
      } else if (error) {
        this.props.showSnackBar(message, true)
      }
    }
  }


  _handleToggleNewCard(e){
    e.preventDefault();
    this.setState({newCardModal: !this.state.newCardModal})
  }
  // openDelete =
  render() {
    const { id, cardsData } = this.props
    const { loading, success, data } = cardsData;
    const { openDelete, selectedCardNumber, newCardModal } = this.state;

    return (
      <div>
        <div className="py-header--page align-items-center">
          <div className="py-header--title">
           <h4 className="m-0">Saved payment methods 
           {/* <small><a href="javascript: void(0)" className="py-text--link-external fs-small">Learn more</a></small> */}
           </h4>
          </div>
          <div className="ml-auto">
            <button className="btn btn-primary btn-rounded" onClick={this._handleToggleNewCard.bind(this)}>Add new card</button>
          </div>
        </div>
        <div className="paymentTable-customer mrT10">
          <Table hover className="customerTable">
            <thead className="py-table__header">
              <tr className="py-table__row">
                <th className="py-table__cell" style={{ borderTop: 'none' }}></th>
                <th className="py-table__cell" style={{ borderTop: 'none' }}>Card number</th>
                <th className="py-table__cell" style={{ borderTop: 'none' }}>Expiry</th>
                <th className="py-table__cell" style={{ borderTop: 'none' }}>Name on card</th>
                <th className="py-table__cell" style={{ borderTop: 'none', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            {
              loading ?
                <tr>
                  <td colSpan={5}>
                    <CenterSpinner />
                  </td>
                </tr>
                : success ?
                (<tbody>
                {data && data.cards && data.cards.length > 0 ? data.cards.map((item, i) => {
                    return (
                      <tr className="py-table__row" key={i}>
                        <td className="py-table__cell">
                          <img style={{ width: '40px' }}
                            src={process.env.WEB_URL.includes('localhost') ? `${PaymentIcon[item.brand]}` : `${PaymentIcon[item.brand]}`} />
                        </td>
                        <td className="py-table__cell">
                          <span>
                          •••• •••• •••• {item.cardNumber}
                          </span>
                        </td>
                        <td className="py-table__cell">
                          {`${item.expiryMonth}/${item.expiryYear}`}
                        </td>
                        <td className="py-table__cell">
                          {item.cardHolderName}
                        </td>
                        <td className="py-table__cell__action">
                          <a className="py-table__action py-table__action__danger py-icon"
                            onClick={this.openDeleteModal.bind(this, item.id, item.cardNumber, i)}>
                              <svg viewBox="0 0 20 20" id="delete" xmlns="http://www.w3.org/2000/svg"><path d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"></path></svg>
                            </a>
                        </td>
                      </tr>
                    )
                  }) :
                  (<tr>
                    <td className="py-table__cell"></td>
                    <td className="py-table__cell">
                      <span>You don't have any saved payment methods.</span>
                    </td>
                  </tr>)}
                </tbody>)
                : null
            }
          </Table>
          <PaymentMethodConfirmation
            openModal={openDelete}
            onConfirm={this.deleteCard.bind(this)}
            onClose={this.toggleModal.bind(this)}
            cardNumber={this.state.selectedCardNumber}
            showSnackBar={(message, error) => this.props.showSnackBar(message, error)}
          />
        </div>
        <StripeProvider apiKey={getStripeKey()}>
          <Elements>
            <AddNewcardModal
              openModal={newCardModal}
              onConfirm={this.deleteCard.bind(this)}
              onClose={() => this.setState({newCardModal: false})}
              id = {id}
              showSnackBar={(message, error) => this.props.showSnackBar(message, error)}
              fetchCards={() => this.props.fetchCards()}
            />
          </Elements>
        </StripeProvider>
      </div>
    )
  }
}
