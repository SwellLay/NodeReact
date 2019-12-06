import React, { Fragment } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Form,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Spinner
} from "reactstrap";
import { cloneDeep } from "lodash";
import { connect } from "react-redux";

import SelectBox from "utils/formWrapper/SelectBox";
import classnames from "classnames";
import { sendMail, sendInvoice } from "../../../../../../api/InvoiceService";
import { updateData, openGlobalSnackbar } from "../../../../../../actions/snackBarAction";
import { mailMessage } from "../../helpers";
import moment from "moment";
import SweetAlertSuccess from "../../../../../../global/SweetAlertSuccess";

class MailInvoice extends React.Component {
  state = {
    activeTab: "1",
    editSubject: false,
    sentVia: undefined,
    isEmail:true,
    mailInvoice: {
      from: "",
      to: [""],
      subject: ``,
      message: "",
      self: false,
      attachPDF: false
    },
    loading: false,
    showSuccess: false
  };

  componentDidMount() {
    const { invoiceData, businessInfo, activeTab } = this.props;
    let { mailInvoice } = this.state;
    mailInvoice.subject = `${invoiceData.title} #${invoiceData.invoiceNumber} from ${businessInfo.organizationName}`;
    mailInvoice.from = localStorage.getItem("user.email");
    mailInvoice.to = [`${invoiceData.customer && invoiceData.customer.email ? invoiceData.customer.email : ""}`]
    const isEmail = ![mailInvoice.to].includes("")
    this.setState({ mailInvoice, isEmail, activeTab: activeTab || '1'});
  }

  componentDidUpdate(previousProps) {
    const { invoiceData, businessInfo, activeTab } = this.props;
    if (previousProps.invoiceData != invoiceData) {
      let { mailInvoice } = this.state;
      mailInvoice.subject = `${invoiceData.title} #${invoiceData.invoiceNumber} from ${businessInfo.organizationName}`;
      mailInvoice.from = localStorage.getItem("user.email");
      mailInvoice.to = [`${invoiceData.customer && invoiceData.customer.email ? invoiceData.customer.email : ""}`]
      const isEmail = ![mailInvoice.to].includes("")
      this.setState({ mailInvoice, isEmail, activeTab: activeTab || '1' });
    }
  }

  checkCustomerEmailExist = ()=>{
    // invoiceData.customer && invoiceData.customer.email ? invoiceData.customer.email
    if(typeof customer === 'object' && customer.email !== ""){

    }
  }

  setMailInvoice =(invoiceData)=>{
    let mailInvoice = cloneDeep()
    mailInvoice.subject = `${invoiceData.title} #${invoiceData.invoiceNumber} from ${businessInfo.organizationName}`;
    mailInvoice.from = localStorage.getItem("user.email");
    mailInvoice.to = [`${invoiceData.customer && invoiceData.customer.email ? invoiceData.customer.email : ""}`]
  }

  toggleTab = tab => {
    let queryString = "";
    if (this.state.activeTab !== tab) {
      queryString = tab !== "all" ? `status=${tab}` : "";
      this.setState({
        activeTab: tab
      });
    }
  };

  addToMailAddress = () => {
    let mailInvoice = cloneDeep(this.state.mailInvoice);
    mailInvoice.to.push("");
    this.setState({ mailInvoice, isEmail:false });
  };

  removeMailAddress = idx => {
    let mailInvoice = cloneDeep(this.state.mailInvoice);
    mailInvoice.to = mailInvoice.to.filter((item, index) => {
      return index !== idx;
    });
    if (mailInvoice.to.length <= 0) {
      mailInvoice.to.push("");
    }
    this.setState({ mailInvoice,isEmail:true });
  };

  isValidMail = (value) => {
    const regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    return regex.test(value)
  }

  handleMailInvoice = (event, index) => {
    const { value, name, type } = event.target;
    let mailInvoice = this.state.mailInvoice;
    if (index !== undefined) {
      mailInvoice[name][index] = value;
    } else {
      if (type === "checkbox") {
        mailInvoice[name] = !mailInvoice[name];
      } else {
        mailInvoice[name] = value;
      }
    }
    this.setState({ mailInvoice });
  };

  handleChangeEmail = (event, index) => {
    const { value, name } = event.target;
    let mailInvoice = this.state.mailInvoice;
    const isEmail = this.isValidMail(value)
    mailInvoice[name][index] = value;
    this.setState({ mailInvoice, isEmail });
  };

  renderSendAddress = () => {
    const to = this.state.mailInvoice.to;
    return (
      <FormGroup className="py-form-field py-form-field--inline">
        <Label for="exampleEmail" className="py-form-field__label">
          To
        </Label>
        <div className="py-form-field__element">
          {to.map((address, index) => {
            return index === 0 ? (
              <div key={index} className="multirecipient">
                <div>
                <Input
                  required
                  type="email"
                  name="to"
                  value={address}
                  className="py-form__element__medium"
                  onChange={e => this.handleChangeEmail(e, index)}
                />
                </div>
                <a className="multirecipient__icon py-text--link" onClick={this.addToMailAddress}>
                  {" "}
                  <svg viewBox="0 0 26 26" className="py-icon" id="add--large" xmlns="http://www.w3.org/2000/svg"><path d="M13 24C6.925 24 2 19.075 2 13S6.925 2 13 2s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 8a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0V8z"></path><path d="M8 14a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2H8z"></path></svg>
                </a>
              </div>
            ) : (
                <div key={index} className="multirecipient">
                  <div>
                  <Input
                    required
                    type="email"
                    name="to"
                    className="py-form__element__medium"
                    value={address}
                    onChange={e => this.handleChangeEmail(e, index)}
                  />
                  </div>
                  <a className="multirecipient__icon py-text--link" onClick={() => this.removeMailAddress(index)}>
                    <svg viewBox="0 0 20 20" className="py-icon" id="cancel" xmlns="http://www.w3.org/2000/svg"><path d="M11.592 10l5.078 5.078a1.126 1.126 0 0 1-1.592 1.592L10 11.592 4.922 16.67a1.126 1.126 0 1 1-1.592-1.592L8.408 10 3.33 4.922A1.126 1.126 0 0 1 4.922 3.33L10 8.408l5.078-5.078a1.126 1.126 0 0 1 1.592 1.592L11.592 10z"></path></svg>
                  </a>
                </div>
              );
          })}
        {!this.state.isEmail && <span style={{color:'red'}}>Enter valid Email</span>}
        </div>
      </FormGroup>
    );
  };

  onCancelClick = () => {
    this.setState({
      activeTab: "1",
      editSubject: false,
      mailInvoice: {
        from: "",
        to: [""],
        subject: "Invoice #5 from Sample",
        message: "",
        self: false,
        attachPDF: false
      }
    });
    this.props.on.Close;
  };

  onEditSubject = () => {
    this.setState({
      editSubject: true
    })
  }

  closeMailInvoice = (status) => {
    const { onClose } = this.props
    this.setState({ sentVia: undefined, showSuccess: status === true ? true : false })
    onClose(status, "Send this invoice", "This invoice was sent", 'invoice')
  }

  sendMailToCustomer = async (e) => {
    e.preventDefault()
    const { invoiceData, refreshData, showSnackbar } = this.props
    let { mailInvoice, sentVia } = this.state
    let payload
    try {
      this.setState({ loading: true });
      if (sentVia) {
        payload = {
          invoiceInput: {
            status: 'sent',
            sentVia: sentVia,
            sentDate: moment().format('YYYY-MM-DD')
          }
        };
        await sendInvoice(invoiceData._id, payload);
      } else {
        payload = {
          emailInput: mailInvoice
        }
        await sendMail(invoiceData._id, payload);
      }
      await this.setState({ loading: false });
      this.closeMailInvoice(true)
      // refreshData();
    } catch (error) {
      const errorMessage = error.message
      showSnackbar(errorMessage, true);
      await this.setState({ loading: false });
    }
  }

  sendMailToUser = (e, type) => {
    const { invoiceData, businessInfo } = this.props
    this.setState({
      sentVia: type
    })
    const url = mailMessage(invoiceData, type, businessInfo)
    window.open(url)
  }

  openMailInvoicePreview = () => {
    const { invoiceData } = this.props
    window.open(`${process.env.WEB_URL}/invoices/${invoiceData._id}/mail-preview`)
  }

render() {
  const { openMail, businessInfo, invoiceData, onClose } = this.props;
  const { mailInvoice, editSubject, sentVia, isEmail, loading, showSuccess } = this.state;
  return (
    showSuccess ?
      (
        <SweetAlertSuccess showAlert={true} title={'Send a invoice'} message="The Invoice was sent" onCancel={() => this.setState({showSuccess: false})} from="invoice"/>
      ): (
      <Modal
        isOpen={openMail}
        toggle={this.closeMailInvoice}
        centered
      >
        <ModalHeader
          toggle={this.closeMailInvoice}
        >{invoiceData.sentDate ? `Resend this invoice` : `Send this invoice`}</ModalHeader>
        <ModalBody>
          {/* <Nav tabs> */}
            {/* <NavItem> */}
              {/* <NavLink
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggleTab("1");
                }}
              >
                Peymynt
              </NavLink> */}
            {/* </NavItem> */}
            {/* <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggleTab("2");
                }}
              >
                Gmail, Outlook, Yahoo
              </NavLink>
            </NavItem> */}
          {/* </Nav> */}
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Form className="send-with-py"  onSubmit={e => this.sendMailToCustomer(e)}>
                <FormGroup className="py-form-field py-form-field--inline">
                  <Label for="exampleEmail" className="py-form-field__label">
                    From
                  </Label>
                  <div className="py-form-field__element">
                    <Input
                      required
                      type="email"
                      name="from"
                      disabled
                      className="py-form__element__medium"
                      value={mailInvoice.from}
                      onChange={this.handleChangeEmail}
                    />
                    <a className="multirecipient__icon py-text--link" href="javascript: void(0)">
                      <i className="fa fa-question-circle"/>
                    </a>
                  </div>
                  {/* <Label for="exampleEmail" className="py-form-field__label" style={{width: '3%'}}>
                  </Label> */}
                </FormGroup>
                {this.renderSendAddress()}
                <FormGroup className="py-form-field py-form-field--inline align-items-center">
                  <Label for="exampleEmail" className="py-form-field__label">
                    Subject
                </Label>

                <div className="py-form-field__element">
                      {editSubject ? (
                        <Input
                          type="text"
                          name="subject"
                          className="py-form__element__medium"
                          value={mailInvoice.subject}
                          onChange={this.handleMailInvoice}
                        />
                      ) : (
                          <span className="">
                            {" "}
                            {mailInvoice.subject} <a className="py-text--link py-text--strong" href="#" onClick={this.onEditSubject}> Edit subject</a>{" "}
                          </span>
                        )}
                </div>

                </FormGroup>
                <FormGroup className="py-form-field py-form-field--inline">
                  <Label for="exampleEmail" className="py-form-field__label">
                    Message
                </Label>
                  <div className="py-form-field__element">
                    <textarea
                      type="text"
                      name="message"
                      onChange={this.handleMailInvoice}
                      value={mailInvoice.message}
                      style={{height: '148px'}}
                      className="form-control py-form__element__medium"
                      placeholder={`Enter your message to ${
                        businessInfo.organizationName
                      }`}
                    />
                  </div>
                </FormGroup>
                <FormGroup className="py-form-field py-form-field--inline mb-2">
                  <div className="py-form-field__label"></div>
                  <div className="py-form-field__element">
                  <Label className="py-checkbox">
                    <Input
                      name="self"
                      type="checkbox"
                      className="py-form__element"
                      value={mailInvoice.self}
                      checked={mailInvoice.self}
                      onChange={this.handleMailInvoice}
                    />{" "}

                    <span className="py-form__element__faux"></span>
                    <span className="py-form__element__label">Send a copy to myself at {localStorage.getItem("user.email")}</span>
                  </Label>

                  <Label className="py-checkbox">
                      <Input
                        type="checkbox"
                        name="attachPDF"
                        className="py-form__element"
                        checked={mailInvoice.attachPDF}
                        value={mailInvoice.attachPDF}
                        onChange={this.handleMailInvoice}
                      />
                      <span className="py-form__element__faux"></span>
                      <span className="py-form__element__label">Attach the invoice as a PDF</span>
                    </Label>
                  </div>

                </FormGroup>
                <div className="tabfooter text-right">
                  <Button
                      className="btn-outline-primary"
                      onClick={this.closeMailInvoice}
                    >
                      {" "}
                      Cancel{" "}
                    </Button>

                    <Button
                      className="btn-outline-primary mx-2"
                      onClick={this.openMailInvoicePreview}
                    >
                      {" "}
                      Preview{" "}
                    </Button>

                    <button
                      color="danger"
                      disabled={!isEmail || loading}
                      // disabled={true}
                      type={'submit'} className="btn btn-primary"
                    >
                      { loading ? <Spinner size="sm" color="light" /> : 'Send'}
                  </button>
                </div>
              </Form>
            </TabPane>
            <TabPane tabId="2">
              {!sentVia ? <Fragment>

                <div className="send-invoice-email__provider">
                  <a className="send-invoice-email__provider__link">
                    <img className="send-invoice-email__provider__logo" src="/assets/gmail-logo.png" />
                    <span className="send-invoice-email__provider__text">
                      <span className="py-text py-text--body"
                        onClick={(e) => this.sendMailToUser(e, 'gmail')}
                      >Send with Gmail</span>
                    </span>
                    <span className="send-invoice-email__provider__forward-icon">
                      <i className="fa fa-angle-right"> </i>
                    </span>
                  </a>
                </div>
                <div className="send-invoice-email__divider"></div>
                <div className="send-invoice-email__provider">
                  <a className="send-invoice-email__provider__link">
                    <img className="send-invoice-email__provider__logo" src="/assets/outlook-logo.png" />
                    <span className="send-invoice-email__provider__text">
                      <span className="py-text py-text--body"
                        onClick={(e) => this.sendMailToUser(e, 'outlook')}
                      >Send with Outlook</span>
                    </span>
                    <span className="send-invoice-email__provider__forward-icon">
                      <i className="fa fa-angle-right"> </i>
                    </span>
                  </a>
                </div>
                <div className="send-invoice-email__divider"></div>
                <div className="send-invoice-email__provider">
                  <a className="send-invoice-email__provider__link">
                    <img className="send-invoice-email__provider__logo" src="/assets/yahoo-logo.png" />
                    <span className="send-invoice-email__provider__text">
                      <span className="py-text py-text--body"
                        onClick={(e) => this.sendMailToUser(e, 'yahoo')}
                      >Send with Yahoo! Mail</span>
                    </span>
                    <span className="send-invoice-email__provider__forward-icon">
                      <i className="fa fa-angle-right"> </i>
                    </span>
                  </a>
                </div>
              </Fragment>
                :
                <Fragment>
                  <div className="send-invoice-email__followup">

                    {sentVia === 'gmail' ?
                      <img className="send-invoice-email__followup__logo" src="/assets/gmail-logo.png" />
                      :
                      sentVia === 'yahoo' ?
                        <img className="send-invoice-email__followup__logo" src="/assets/yahoo-logo.png" />
                        :
                        <img className="send-invoice-email__followup__logo" src="/assets/outlook-logo.png" />
                    }
                    <div> {`Welcome back! Did you resend your invoice with ${sentVia}?`} </div>
                  </div>
                  <div className="tabfooter">
                    <Button
                      color="danger"
                      onClick={this.sendMailToCustomer} className="btn btn-rounded btn-accent pull-right btn btn-secondary"
                    >
                      Yes, and update sent date
                </Button>
                    <Button
                      className="btn btn-rounded  btn-gray pull-right btn btn-secondary"
                      onClick={this.closeMailInvoice}
                    >
                      {" "}
                      No, leave as is{" "}
                    </Button>
                  </div>
                </Fragment>}

            </TabPane>
          </TabContent>

        </ModalBody>
      </Modal>)
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
)(MailInvoice);
