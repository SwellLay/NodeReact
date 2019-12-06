import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';

class AlertBox extends Component {

  onConfirmClick = () => {
    const { receipt, receiptIndex, onConfirm } = this.props
    onConfirm(receipt, receiptIndex)
  }

  showSweetAlert = () => {
    const { onCancel, message, showAlert, title } = this.props
    return (
      <SweetAlert
        success
        showCancel
        confirmBtnText="Send a receipt"
        cancelBtnText="Close"
        cancelBtnId="dropItemCancel"
        cancelBtnBsStyle="default"
        title="The payment was recorded."
        onConfirm={this.onConfirmClick}
        onCancel={onCancel}
        confirmBtnCssClass="btn btn-rounded btn-accent"
        confirmBtnId="dropItemConf"
        cancelBtnCssClass="btn btn-rounded btn-gray"
      />
    )
  }
  render() {
    const { showAlert, title } = this.props
    return (
      showAlert ? this.showSweetAlert() : ""
    );
  }
}


export default AlertBox
