import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ProductForm from '../../../../sales/components/productServices/ProductForm';


// @Todo: Vendor Form

export default class Popup extends Component {
  onClose = () => {
    const { onClosePopup, type } = this.props;
    onClosePopup(type)
  };

  updateList = (data) => {
    const { updateList, type } = this.props;
    updateList(type, data)
  };

  render() {
    const { openPopup, onClose, type } = this.props;
    return (
      <Modal isOpen={openPopup} toggle={onClose} className="modal-add modal-common" centered>
        <ModalHeader toggle={onClose}>Add {type === "ProductPopup" ? "Product" : "a vendor"}</ModalHeader>
        <ModalBody>
          {type === 'ProductPopup' ?
            (<ProductForm
              flag={true}
              buyOnly
              onClose={this.onClose}
              updateList={this.updateList}
            />) :
            null}
        </ModalBody>
      </Modal>
    )
  }
}
