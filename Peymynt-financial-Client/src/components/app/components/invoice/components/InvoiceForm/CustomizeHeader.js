import React from "react";
import {
  Button,
  Col,
  FormGroup,
  Label,
  Input,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { connect } from 'react-redux';

import { cloneDeep } from 'lodash';
import { setUserSettings } from "../../../../../../actions/loginAction";
import { patchSalesSetting } from "../../../../../../api/SettingService";

class CustomizeHeader extends React.Component {

  state={
    invoiceColumnSettings:this.props.invoice
  }
  componentDidUpdate(prevProps){
    const {invoice} = this.props
    if(invoice!== prevProps.invoice){
      this.setState({invoiceColumnSettings : invoice})
    }
  }
  onSaveClick = (e) => {
    e.preventDefault()
    const updateSettings = this.state.invoiceColumnSettings
    let newSettings = cloneDeep(updateSettings.itemHeading)
    const oldSetting = this.props.invoice.itemHeading
    if(newSettings.savedForFuture && !oldSetting.savedForFuture){
      delete newSettings.savedForFuture
      this.updateInvoiceSettings(newSettings)
    }
    this.props.onSave(updateSettings)
  }

  updateInvoiceSettings = async (itemHeading)=>{
    let salesSettingInput ={
      itemHeading
    }
    let response = await(patchSalesSetting({salesSettingInput}))
    this.props.setUserSettings(response.data.salesSetting)
  }

  handleItemHeading = (event, isOther)=>{
    let updateSettings = cloneDeep(this.state.invoiceColumnSettings)
    const {name, value} = event.target
    if(isOther){
        updateSettings.itemHeading[name].name=value
    }
    if(name.includes("column")){
        updateSettings.itemHeading[name].name=value
    }else{
      if(name === "hideDescription"){
        updateSettings.itemHeading["hideItem"]=false
      }else if( name === "hideItem"){
        updateSettings.itemHeading["hideDescription"]=false
      }
        updateSettings.itemHeading[name]=!updateSettings.itemHeading[name]
    }
    this.setState({invoiceColumnSettings:updateSettings})
}

  render() {
    const { openHeader, onClose } = this.props;
    const { itemHeading } = this.state.invoiceColumnSettings
    return (
      <Modal
        isOpen={openHeader}
        toggle={onClose}
        className="customize_invoice_modal"
        centered
      >
        <ModalHeader className="py-text--strong">
          Customize this invoice
          {/* <button className="py-close" onClick={onClose}> <img src="/assets/cancel.svg" /> </button> */}
        </ModalHeader>
        <ModalBody>
          <p className="py-form-legend py-text--strong">Edit the titles of the columns on this invoice:</p>
          <div className="py-form-field py-form-field--inline">
              <div className="py-form-field__label--align-top">Items</div>
              <div className="py-form-field__element">
                {["Items", "Services", "Products", "Other"].map((itemType, index) => {
                  return (
                    <div key={itemType + index}>
                        <Label className="py-radio">
                          <input
                            type="radio"
                            name="column1"
                            checked={itemHeading.column1.name === itemType || !["Items", "Services", "Products", "Other"].includes(itemHeading.column1.name)}
                            value={itemType}
                            onChange={this.handleItemHeading}
                          />
                          <span className="py-form__element__faux"></span>
                          <span className="py-form__element__label">{itemType}</span>
                          <span className="py-text--emphasized">{itemType === 'Items' ? `(Default)` : ""}</span>
                        </Label>

                        {itemType === "Other" ?
                          <div className="py-form-field__hint">
                              <Input type="text" name="column1" onChange={e => this.handleItemHeading(e, "Other")} className="py-form__element__medium" onFocus={this.handleItemHeading}/>
                          </div>
                        : ""}
                    </div>

                  )
                })}
              </div>
          </div>
          <div className="py-divider"></div>

          <div className="py-form-field py-form-field--inline">
              <div className="py-form-field__label--align-top">Units</div>
              <div className="py-form-field__element">
                {["Quantity", "Hours", "Other"].map((unitType, index) => {
                  return (
                    <div key={unitType + index}>
                        <Label className="py-radio">
                          <input
                            type="radio"
                            name="column2"
                            checked={itemHeading.column2.name === unitType || !["Quantity", "Hours", "Other"].includes(itemHeading.column2.name)}
                            value={unitType}
                            onChange={this.handleItemHeading}
                          />
                          <span className="py-form__element__faux"></span>
                          <span className="py-form__element__label">{unitType}</span>
                          <span className="py-text--emphasized">{unitType === 'Quantity' ? `(Default)` : ""}</span>
                        </Label>

                        {unitType === "Other" ?
                          <div className="py-form-field__hint">
                            <Input type="text" name="column2" onChange={e => this.handleItemHeading(e, "Other")} className="py-form__element__medium" onFocus={this.handleItemHeading}/>
                          </div>
                        : ""}
                    </div>)
                })}
              </div>
          </div>


          <div className="py-divider"></div>


          <div className="py-form-field py-form-field--inline">
              <div className="py-form-field__label--align-top">Price</div>
              <div className="py-form-field__element">
              {["Price","Rate", "Other"].map((priceType, index)=>{
                return(<div key={priceType + index} className="radio">
                    <Label className="py-radio">
                      <input
                        type="radio"
                        name="column3"
                        checked={itemHeading.column3.name === priceType || !["Price","Rate", "Other"].includes(itemHeading.column3.name)}
                        value={priceType}
                        onChange={this.handleItemHeading}
                      />
                      <span className="py-form__element__faux"></span>
                      <span className="py-form__element__label">{priceType}</span>
                      <span className="py-text--emphasized">{priceType === 'Price' ? `(Default)` : ""}</span>
                    </Label>
                    {priceType === "Other" ?
                      <div className="py-form-field__hint">
                        <Input type="text" name="column3" onChange={e => this.handleItemHeading(e, "Other")} className="py-form__element__medium" onFocus={this.handleItemHeading}/>
                      </div>
                    : ""}
              </div>)
              })}
              </div>
          </div>
          <div className="py-divider"></div>
          <div className="py-form-field py-form-field--inline">
              <label className="py-form-field__label--align-top">Amount</label>
              <div className="py-form-field__element">
                {["Amount", "Other"].map((amountType, index)=>{
                  return(<div key={amountType + index}>
                      <Label className="py-radio">
                        <input
                          type="radio"
                          name="column4"
                          checked={itemHeading.column4.name === amountType || !["Amount" ,"Other"].includes(itemHeading.column4.name)}
                          value={amountType}
                          onChange={this.handleItemHeading}
                        />
                        <span className="py-form__element__faux"></span>
                        <span className="py-form__element__label">{amountType}</span>
                        <span className="py-text--emphasized">{amountType === 'Amount' ? `(Default)` : ""}</span>
                      </Label>
                      {amountType === "Other" ?
                          <div className="py-form-field__hint">
                            <Input type="text" name="column4" onChange={e => this.handleItemHeading(e, "Other")} className="py-form__element__medium" onFocus={this.handleItemHeading}/>
                          </div>
                      : ""}
                </div>)
                })}
              </div>
          </div>
          <div className="py-divider"></div>
            <div className="py-form-field py-form-field--inline">
              <div className="py-form-field__label--align-top h5">Hide columns:</div>
                <div className="py-form-field__element">
                  <Label className="py-checkbox mr-2">
                    <input type="checkbox"
                      name={"hideItem"}
                      value={itemHeading.hideItem}
                      checked={itemHeading.hideItem}
                      onChange={this.handleItemHeading}
                    />
                    <span className="py-form__element__faux"></span>
                    <span className="py-form__element__label">Hide item name</span>
                  </Label>
                  <Label className="py-checkbox">
                    <input
                     type="checkbox"
                     name={"hideDescription"}
                     value={itemHeading.hideDescription}
                     checked={itemHeading.hideDescription}
                     onChange={this.handleItemHeading}
                    />
                    <span className="py-form__element__faux"></span>
                    <span className="py-form__element__label">Hide item description</span>
                  </Label>
                  <div className="mt-2">
                  <span className="py-text--hint mb-1">Your invoice must show at least one of the above.</span>
                  <ul className="list-unstyled">
                    <li className="mb-1">
                    <Label className="py-checkbox">
                      <input
                       type="checkbox"
                       name={"hideQuantity"}
                       value={itemHeading.hideQuantity}
                       checked={itemHeading.hideQuantity}
                       onChange={this.handleItemHeading}
                      />
                      <span className="py-form__element__faux"></span>
                      <span className="py-form__element__label">Hide units</span>
                    </Label>
                    </li>
                    <li className="mb-1">
                    <Label className="py-checkbox">
                      <input
                       type="checkbox"
                       name={"hidePrice"}
                       value={itemHeading.hidePrice}
                       checked={itemHeading.hidePrice}
                       onChange={this.handleItemHeading}
                      />
                      <span className="py-form__element__faux"></span>
                      <span className="py-form__element__label">Hide price</span>
                      </Label>

                    </li>
                    <li>
                      <Label className="py-checkbox">
                        <input
                        type="checkbox"
                        name={"hideAmount"}
                        value={itemHeading.hideAmount}
                        checked={itemHeading.hideAmount}
                        onChange={this.handleItemHeading}
                        />
                        <span className="py-form__element__faux"></span>
                        <span className="py-form__element__label">Hide amount</span>
                      </Label>
                    </li>
                  </ul>
                  </div>

                </div>
            </div>

          <div className="py-divider"></div>

          <div className="py-form-field py-form-field--inline">
              <label className="py-form-field__label"></label>
              <div className="py-form-field__element">
                  <Label className="py-checkbox">
                    <input
                      type="checkbox"
                      name={"savedForFuture"}
                      value={itemHeading.savedForFuture}
                      checked={itemHeading.savedForFuture}
                      onChange={this.handleItemHeading}
                    />
                    <span className="py-form__element__faux"></span>
                    <span className="py-form__element__label">Apply these settings for all future
                    invoices.</span>
                    </Label>
                    <span className="py-form-field__hint">
                      These settings will apply to recurring and non-recurring invoices. You can change these anytime from Invoice Customization settings. 
                    </span>
              </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="btn-outline-primary mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button className="btn-primary"  onClick={this.onSaveClick} >Save</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(null, {setUserSettings})(CustomizeHeader)
