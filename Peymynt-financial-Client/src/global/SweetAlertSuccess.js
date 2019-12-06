import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, } from "reactstrap";
import SuccessSvg from './SuccessSvg';

class SweetAlertSuccess extends Component {
  onConfirmClick = (e) => {
    const { receipt, receiptIndex, onConfirm } = this.props;
    onConfirm(receipt, receiptIndex)
  };

  showSweetAlert = () => {
    const { onCancel, message, showAlert, title, from } = this.props;
    return (
      <Modal
        className={'modalSweet-alert modal-add'}
        centered
        toggle={onCancel}
        isOpen={showAlert}
      >
        <ModalHeader>
          <h4 className={'text-left'}>{title}</h4>
        </ModalHeader>
        <ModalBody>
          <div className="sweetAlert-modal-content">
            <div className={"sweetAlert-modal-success__check"}>
              <SuccessSvg/>
            </div>
            <div className="sweetAlert-modal__heading">
              <div className="sweetAlert-modal__heading-title">
                {message}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="sweetAlert-modal-footer__btn-wrapper">
            <button className="btn btn-outline-primary mr-2" onClick={onCancel} id="dropItemClose">Close</button>
            {
              from === 'invoice' ? ""
              : <button className="btn btn-rounded btn-accent" onClick={this.onConfirmClick.bind(this)} id="dropItemConfirm">Send a receipt</button>
            }
          </div>
        </ModalFooter>
      </Modal>
    )
  };
  render() {
    const { showAlert, title } = this.props;
    return (
      showAlert ? this.showSweetAlert() : ""
    );
  }
}


export default SweetAlertSuccess
