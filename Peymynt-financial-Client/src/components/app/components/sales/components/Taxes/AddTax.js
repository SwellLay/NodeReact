import React, { Component } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { openGlobalSnackbar } from "../../../../../../actions/snackBarAction";
import taxServices from "../../../../../../api/TaxServices";
import { Spinner } from 'reactstrap';

const taxPayload = {
  name: "",
  userId: localStorage.getItem("user.id"),
  businessId: localStorage.getItem("businessId"),
  abbreviation: "",
  rate: "",
  description: "",
  taxNumber: "",
  other: {
    showTaxNumber: false,
    isRecoverable: false,
    isCompound: false
  }
};

class AddTax extends Component {
  state = {
    modal: false,
    disabled: "",
    addTax: taxPayload,
    loading:false
  };

  handelTextChange = e => {
    const { name, value } = e.target;
    console.log("name", name, e.key)
    let updateTax = this.state.addTax;
    const otherArray = ["showTaxNumber", "isRecoverable", "isCompound"];
    if (otherArray.includes(name)) {
      updateTax.other[name] = !updateTax.other[name];
      this.setState({ addTax: updateTax });
    } else {
      if(name === 'rate'){
        if (e.which != 8 && e.which != 0 && e.which < 48 || e.which > 57)
        {
            e.preventDefault();
        }else{
          this.setState({
            addTax: { ...updateTax, [name]: value }
          });
        }
      }else{
        this.setState({
          addTax: { ...updateTax, [name]: value }
        });
      }
    }
    this.setDisable()
  };

  setDisable = () => {
    let addTax = this.state.addTax;
    let disabled = "";
    if (addTax.name === '' || addTax.abbreviation === '' || addTax.rate === '' || (addTax.other.showTaxNumber && addTax.taxNumber)) {
      disabled = 'Field is required'
    }
    if(addTax.other.showTaxNumber){
      if(!addTax.taxNumber){
        disabled = 'Field is required'
      }else{
        disabled=""
      }
    }
    this.setState({ disabled });
    return disabled !== ''
  };

  submitTax = async () => {
    let disable = this.setDisable();
    if (disable) {
      return false
    }
    let taxInput = { ...this.state.addTax };
    if (!taxInput.userId) {
      taxInput.userId = localStorage.getItem("user.id");
    }

    if (!taxInput.businessId) {
      taxInput.businessId = localStorage.getItem("businessId");
    }
    try {
      this.setState({
        loading:true
      })
      const response = await taxServices.addTax({ taxInput });
      this.setState({
        loading:false
      })
      // console.log("result", result);
      if (response.statusCode === 201) {
        let result = response.data.tax;
        let selectedOption = {
          value: result._id,
          label: `${result.abbreviation} ${result.rate}%`
        };
        // this.setState({ addTax: taxPayload });
        this.props.onAddTax(event, selectedOption);
        this.setState({
          addTax: taxPayload
        })
        this.props.showSnakebar('Tax added', false)
      }
    } catch (error) {
      this.props.showSnakebar('Something went wrong. Please try again', true)
      this.setState({
        loading:false
      })
    }
  };
  _handleKeypress = e => {
    console.log("evt, e.keyCode", e.keyCode)
    const invalidKey = [
      69,
      107,
      109
    ]
    if(invalidKey.includes(e.keyCode)){
      e.preventDefault();
    }
  }

  render() {
    const { openAddTax, onClose } = this.props;
    const { disabled, addTax, loading } = this.state;
    const {
      name,
      abbreviation,
      rate,
      description,
      taxNumber,
      other,

    } = addTax;
    return (
      <Modal isOpen={openAddTax} toggle={onClose} className="modal-add tax-modal">
        <ModalHeader toggle={onClose}>Add Tax</ModalHeader>
        <ModalBody>
          <Form className="py-form-field--condensed">
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label is-required">
                Tax Name
              </Label>
              <div className="py-form-field__element">
                <Input
                  className={!!disabled && !name.trim() ? "has-errors" : ''}
                  required
                  type="text"
                  className="py-form__element__medium"
                  name="name"
                  value={name}
                  onChange={this.handelTextChange}
                />
                {disabled && !name.trim() && (<span className="d-block input-error-text">{disabled}</span>)}
              </div>
            </div>

            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label">
                Abbreviation
              </Label>
              <div className="py-form-field__element">
                <Input
                  required
                  className={!!disabled && !abbreviation.trim() ? "has-errors" : ''}
                  type="text"
                  name="abbreviation"
                  className="py-form__element__medium"
                  value={abbreviation}
                  onChange={this.handelTextChange}
                  maxLength={10}
                />
                {disabled && !abbreviation.trim() && (
                  <span className="d-block input-error-text">{disabled}</span>)}
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label">
                Tax Rate (%)
              </Label>
              <div className="py-form-field__element">
                <Input
                  required
                  className={!!disabled && !rate ? "has-errors" : ''}
                  type="number"
                  step="any"
                  name="rate"
                  className="py-form__element__medium"
                  value={rate}
                  onChange={this.handelTextChange}
                  onKeyDown={this._handleKeypress}

                />
                <div className="py-form-field__hint">
                  Tax Rate should be a number only, without a percent sign.
                </div>
                {disabled && !rate && (<span className="d-block input-error-text">{disabled}</span>)}
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label">
                {" "}
                Description
              </Label>
              <div className="py-form-field__element">
                <Input
                  type="text"
                  name="description"
                  className="py-form__element__medium"
                  value={description}
                  onChange={this.handelTextChange}
                />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label">
                {" "}
                Tax Number
              </Label>
              <div className="py-form-field__element">
                <Input
                  type="text"
                  required={other.showTaxNumber}
                  name="taxNumber"
                  className="py-form__element__medium"
                  value={taxNumber}
                  onChange={this.handelTextChange}
                />
                {disabled && other.showTaxNumber && !taxNumber && (<span className="d-block input-error-text">{disabled}</span>)}
              </div>
            </div>

            <div className="py-form-field py-form-field--inline">
              <div for="exampleEmail" className="py-form-field__label">
              </div>
              <div className="py-form-field__element">
                  <label className="py-checkbox">
                    <Input
                      type="checkbox"
                      name={"showTaxNumber"}
                      value={other.showTaxNumber}
                      checked={other.showTaxNumber}
                      onChange={this.handelTextChange}
                    />
                    <span className="py-form__element__faux"></span>
                    <span className="py-form__element__label">Show Tax Number on Invoices</span>
                  </label>
              </div>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
              <Button className="btn-outline-primary" onClick={onClose}>
                Cancel
              </Button>

              <Button
                // type='submit'
                disabled={loading}
                onClick={this.submitTax}
                className="btn-primary"
              >
                Add tax {loading && (<Spinner size="sm" color="light" />)}
              </Button>{" "}
              
            </ModalFooter>
      </Modal>

    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showSnakebar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error));
    }
  }
};

export default withRouter((connect(null, mapDispatchToProps)(AddTax)))
