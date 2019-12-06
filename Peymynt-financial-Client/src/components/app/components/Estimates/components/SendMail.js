import { cloneDeep } from "lodash";
import React from "react";
import { connect } from 'react-redux';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap";
import { sendMailAction } from "../../../../../actions/sendMailAction";

class SendMail extends React.Component {
  state = {
    emailInput: {
      to: [],
      message: "",
      self: false
    },
    sentTo: "",
    isEmail: true,
    selectedOption: null,
    loader: false
  };

  componentDidUpdate(prevProps){
    const { open, mailInfo } = this.props;
    if(open!==prevProps.open){
      let updateEmailInput = cloneDeep(this.state.emailInput);
      updateEmailInput.to = mailInfo.customer && !!mailInfo.customer.email ? [mailInfo.customer.email] : [];
      this.setState({emailInput: updateEmailInput})
    }
  }

  handleTextField = e => {
    const { value, name } = e.target;
    let updateData = this.state.emailInput;
    if (name === "self") {
      updateData.self = !updateData.self;
    } else if (name === "to") {
      updateData.to = value;
    } else {
      updateData = { ...updateData, [name]: value };
    }
    this.setState({
      emailInput: updateData
    });
  };

  handleOnKeyPress = event => {
    const { sentTo, emailInput } = this.state;
    if ([13, 9].includes(event.keyCode)) {
      let isEmail = this.isValidMail(sentTo);
      if (isEmail && !!sentTo) {
        emailInput.to.push(sentTo);
        emailInput.to = emailInput.to.filter((item) => {
          return item !== ""
        })
        this.setState({ emailInput, isEmail, sentTo: "" });
      }else{
        isEmail = sentTo === "" ? true : this.isValidMail(sentTo ? sentTo : emailInput.to[0]);
        this.setState({ isEmail });

      }
    }
  };

  isValidMail= (value)=>{
    const regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return regex.test(value)

  };

  handleEmailChange = event => {
    const { value } = event.target;
    let isEmail = true;
    if (!!value && this.isValidMail(value)) {
      isEmail =this.isValidMail(value)
    }else{
      isEmail = true
    }
    // if (!!value) {
      this.setState({
        sentTo: value,
        isEmail
      });
    // }
  };

  removeMailto = (mailto, index) => {
    let updateEmail = cloneDeep(this.state.emailInput);
    updateEmail.to = updateEmail.to.filter((item, i) => {
      return item !== mailto && item !== ""
    });
    this.setState({emailInput: updateEmail})
  };

  sendMail = async event => {
    event.preventDefault();
    const { mailInfo, handleModal } = this.props;
    let emailInput = cloneDeep(this.state.emailInput);
    emailInput.message = escape(emailInput.message);
    const payload = { emailInput };
    this.props.sendMailAction(mailInfo._id, payload);
  };

  _toBlur = ({target: {name, value}}) => {
    let { emailInput } = this.state;

    if(!!value){
      if(this.isValidMail(value)){
        emailInput.to = emailInput.to.concat(value);
        this.setState({ emailInput, sentTo: null })
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.sendMail !== nextProps.sendMail) {
      const { success, error, data } = nextProps.sendMail;
      if (success) {
        this.props.showSnackbar(data.message, false)
      } else if (error) {
        
        this.props.showSnackbar(data.data.message, true)
      }
    }
  }

  render() {
    const { handleModal, open, sendMail } = this.props;
    const { loading, error, success, data, message } = sendMail;
    const { emailInput, selectedOption, sentTo, loader } = this.state;
    if(success){
      handleModal(null, data.estimate)
    }
    return (
      <Modal
        isOpen={open}
        returnFocusAfterClose={true}
        className="modal-add modal-email"
      >
        <ModalHeader toggle={handleModal}>Send estimate</ModalHeader>
        <ModalBody>
          <Form className="send-with-py" onSubmit={e=>e.preventDefault()}>

            <FormGroup row  >
              <Label for="exampleEmail" md={3} className="text-right">
                To <span className="text-danger">*</span>
              </Label>
              <Col md={7} className="cust-select">
                <div className="cust-field">
                  {emailInput.to.length > 0 &&
                  emailInput.to.map((mailto, index) => {
                    return (
                      <div className="estimate-list__reciept-list" key={index}>
                        <i className="fa fa-times" onClick={e => this.removeMailto(mailto, index)}>
                        </i>
                        {mailto}
                      </div>
                    );
                  })}
                  <Input
                    type="email"
                    value={sentTo}
                    onChange={this.handleEmailChange}
                    onKeyDown={this.handleOnKeyPress}
                    placeholder="Recipients"
                    className=""
                    onBlur={this._toBlur.bind(this)}
                  />
                </div>
                {!this.state.isEmail && "Enter valid Email"}
              </Col>
            </FormGroup>
            <FormGroup row >
              <Label for="exampleText" md={3} className="text-right">
                Message
              </Label>
              <Col md={7}>
                <Input
                  type="textarea"
                  name="message"
                  onChange={this.handleTextField}
                  style={{ minHeight: "100px" }}
                />
              </Col>
            </FormGroup>
            <FormGroup row >
              <Label for="exampleText" md={3} className="text-right" />
              <Col md={7}>
                <FormGroup>
                  <Label className="py-checkbox">
                    <Input
                      name="self"
                      type="checkbox"
                      className="py-form__element"
                      checked={emailInput.self}
                      value={emailInput.self}
                      onChange={this.handleTextField}
                    />
                    <span className="py-form__element__faux"></span>
                    <span className="py-form__element__label">Send a copy to {localStorage.getItem("user.email")}</span>
                  </Label>
                </FormGroup>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>

          <Button
              className="btn-outline-primary mr-2"
              onClick={handleModal}
            >
              Cancel
            </Button>

            <Button
              disabled={!this.state.isEmail || loading}
              onClick={this.sendMail}
              type="submit"
              className={"btn-primary"}
            >
              Send {
              loading===true ? <Spinner color="primary" size="md" className="loader btnLoader" /> : ""
            }
            </Button>{" "}
           
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({sendMail}) => {
  return {
    sendMail : sendMail
  }
};

export default connect(mapStateToProps, { sendMailAction })(SendMail);
