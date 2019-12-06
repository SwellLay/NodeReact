import React, { Component } from 'react';
import {
  Button,
  Form,
  Col,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  checkbox,
  Spinner
} from "reactstrap";
import { connect } from "react-redux";
import history from "customHistory";

import { updateData, openGlobalSnackbar } from "../../../../../actions/snackBarAction";
import { cloneDeep } from "lodash";
import { sendReceiptMail } from '../../../../../api/InvoiceService';

class SendReceipt extends Component {
  state = {
    sendReceipt: {
      from: localStorage.getItem('user.email'),
      to: [""],
      subject: "",
      message: "",
      self: false
    },
    loading: false
  }

  componentDidMount() {
    const { invoiceData, businessInfo } = this.props;
    let { sendReceipt } = this.state;
    sendReceipt.subject = `Payment Receipt for ${invoiceData.title} #${invoiceData.invoiceNumber}`;
    sendReceipt.from = localStorage.getItem("user.email");
    sendReceipt.to=[`${invoiceData.customer && invoiceData.customer.email}`]
    this.setState({ sendReceipt });
  }

  componentDidUpdate(prevProps) {
    const { openRecord, receipt, invoiceData, businessInfo } = this.props;
    if (prevProps.openRecord != openRecord) {
      const customerName = invoiceData.customer ? invoiceData.customer.customerName : ''
      const customerEmail = invoiceData.customer ? invoiceData.customer.email : ''
      const currencySymbol = invoiceData.customer ? invoiceData.customer.currency.symbol : ''
      const currencyCode = invoiceData.customer ? invoiceData.customer.currency.code : ''
      let { sendReceipt } = this.state;
      sendReceipt.subject = `Payment Receipt for ${invoiceData.title} #${invoiceData.invoiceNumber}`;
      sendReceipt.from = localStorage.getItem("user.email");
      sendReceipt.to=[`${customerEmail}`]
      sendReceipt.message = `Hi ${customerName},

Here's your payment receipt for
${invoiceData.title} #${invoiceData.invoiceNumber}, for ${currencySymbol}${receipt.amount} ${currencyCode}.

You can always view your receipt
online, at:
${process.env.WEB_URL}/invoice/${invoiceData.uuid}/public/reciept-view/readonly/${receipt._id}

If you have any questions, please let us know.

Thanks,
${businessInfo.organizationName}`
this.setState({ sendReceipt });
    }
  }

  openReceiptPreview=()=>{
    const {invoiceData, receipt} = this.props
    window.open(`/invoices/${invoiceData._id}/receipt-preview/${receipt._id}`);
  }

  onSaveClick = async e => {
    e.preventDefault();
    const { showSnackbar, invoiceData, receipt, refreshData, onClose } = this.props;
    let emailInput = this.state.sendReceipt
    try {
      await this.setState({ loading: true });
      await sendReceiptMail(invoiceData._id, receipt._id, { emailInput });
      onClose();
      refreshData();
      showSnackbar("Payment recorded successfully", false);
      await this.setState({ loading: false });
    } catch (error) {
      console.error("Got error from server ", error);
      showSnackbar("Something went wrong. Please try again", true);
      await this.setState({ loading: false });
    }
  };

  onCancel = e => {
    this.setState({
      sendReceipt: {
        from: "",
        to: [""],
        subject: "Invoice #5 from Sample",
        message: "",
        self: false
      }
    });
    this.props.onClose();
  };

  handleReceipt = (event, index) => {
    const { value, name, type } = event.target;
    let sendReceipt = this.state.sendReceipt;
    if (index === "message") {
      sendReceipt[name] = value;
    } else {
      if (index !== undefined) {
        sendReceipt[name][index] = value;
      } else {
        if (type === "checkbox") {
          sendReceipt[name] = !sendReceipt[name];
        } else {
          sendReceipt[name] = value;
        }
      }
    }
    this.setState({ sendReceipt });
  };

  addRecipientAddress = () => {
    let sendReceipt = cloneDeep(this.state.sendReceipt);
    sendReceipt.to.push("");
    this.setState({ sendReceipt });
  };

  removeRecipientAddress = idx => {
    let sendReceipt = cloneDeep(this.state.sendReceipt);
    sendReceipt.to = sendReceipt.to.filter((item, index) => {
      return index !== idx;
    });
    if (sendReceipt.to.length <= 0) {
      sendReceipt.to.push("");
    }
    this.setState({ sendReceipt });
  };

  renderSendAddress = () => {
    const to = this.state.sendReceipt.to;
    return (
      <FormGroup className="py-form-field py-form-field--inline">
        <Label for="exampleEmail" className="py-form-field__label">
          To
        </Label>
        <div className="py-form-field__element">
          {to.map((address, index) => {
            return index === 0 ? (
              <div key={index} className="multirecipient">
                <Input
                  type="email"
                  name="to"
                  value={address}
                  onChange={e => this.handleReceipt(e, index)}
                />
                <a className="multirecipient__icon py-text--link" onClick={this.addRecipientAddress}>
                  <svg className="py-icon" viewBox="0 0 26 26" id="add--large" xmlns="http://www.w3.org/2000/svg"><path d="M13 24C6.925 24 2 19.075 2 13S6.925 2 13 2s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 8a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0V8z"></path><path d="M8 14a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2H8z"></path></svg>
                </a>
              </div>
            ) : (
                <div key={index} className="multirecipient">
                  <Input
                    type="email"
                    name="to"
                    value={address}
                    onChange={e => this.handleReceipt(e, index)}
                  />
                  <a className="multirecipient__icon py-text--link" onClick={() => this.removeRecipientAddress(index)}>
                    <svg className="py-icon" viewBox="0 0 20 20" id="cancel" xmlns="http://www.w3.org/2000/svg"><path d="M11.592 10l5.078 5.078a1.126 1.126 0 0 1-1.592 1.592L10 11.592 4.922 16.67a1.126 1.126 0 1 1-1.592-1.592L8.408 10 3.33 4.922A1.126 1.126 0 0 1 4.922 3.33L10 8.408l5.078-5.078a1.126 1.126 0 0 1 1.592 1.592L11.592 10z"></path></svg>
                  </a>
                </div>
              );
          })}
        </div>
      </FormGroup>
    );
  };

  render() {
    const { openRecord, onCloseReceiptMail, businessInfo, invoiceData } = this.props;
    const { sendReceipt, loading } = this.state
    return (
      <Modal
        isOpen={openRecord}
        toggle={onCloseReceiptMail}
        className="send-with-py"
        centered
      >
        <ModalHeader toggle={onCloseReceiptMail}>Send a receipt</ModalHeader>
        <ModalBody>
          <FormGroup className="py-form-field py-form-field--inline">
            <Label for="exampleEmail" className="py-form-field__label">
              From
              </Label>
            <div className="py-form-field__element form-control w-auto ml-0" style={{paddingTop: '7px'}}>
              {localStorage.getItem('user.email')}
            </div>
          </FormGroup>
          {this.renderSendAddress()}
          <FormGroup className="py-form-field py-form-field--inline align-items-center">
            <Label for="exampleEmail" className="py-form-field__label">
              Subject
              </Label>

            <div className="py-form-field__element form-control w-auto ml-0">
              {sendReceipt.subject}
            </div>
          </FormGroup>
          <FormGroup className="py-form-field py-form-field--inline">
            <Label for="exampleEmail"className="py-form-field__label">
              Message
              </Label>
            <div className="py-form-field__element">
              <Input type={"textarea"} cols={5} rows={15}value={sendReceipt.message} className="form-control custom-textarea" name={"message"} onChange={this.handleReceipt} />
            </div>
          </FormGroup>
          <FormGroup className="py-form-field py-form-field--inline">
            <div className="py-form-field__label"></div>
            <div className="py-form-field__element">
              <label className="py-checkbox">
                <Input
                  name="self"
                  type="checkbox"
                  value={sendReceipt.self}
                  checked={sendReceipt.self}
                  onChange={this.handleReceipt}
                />
                <span className="py-form__element__faux"></span>
                <span className="py-form__element__label">Send a copy to myself at {localStorage.getItem("user.email")}</span>
              </label>
            </div>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-outline-primary"
            onClick={this.onCancel}
          >
            Cancel
            </Button>
          <Button className="btn-primary"
          onClick={this.openReceiptPreview}
          >Preview</Button>
          <Button
            type="submit"
            onClick={this.onSaveClick}
            disabled={loading}
            className="btn-primary"
          >
            { loading ? <Spinner size="sm" color="light" /> : 'Send'}
            </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapPropsToState = state => ({
  businessInfo: state.businessReducer.selectedBusiness
});

const mapDispatchToProps = dispatch => {
  return {
    refreshData: () => {
      dispatch(updateData());
    },
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error));
    }
  };
};


export default connect(
  mapPropsToState,
  mapDispatchToProps
)(SendReceipt)
