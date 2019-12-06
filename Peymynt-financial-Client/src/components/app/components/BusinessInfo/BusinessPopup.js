import React, { Component } from 'react';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Card,
  CardBody,
  Table,
  Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import { connect } from "react-redux";
import SelectBox from "utils/formWrapper/SelectBox";
import { cloneDeep, find } from 'lodash'
import { fetchBusinessById, updateCompany, fetchBusinessCountries } from '../../../../api/businessService';
import { businessObject, timeZoneList } from './helper/businessObject';
import { fetchStatesByCountryId } from '../../../../api/CustomerServices';
import { openGlobalSnackbar } from '../../../../actions/snackBarAction';


class BusinessPopup extends Component {

  state = {
    businessInfo: businessObject(),
    countries: [],
    stateList: [],
    shippingCountries: [],
    title: '',
    statesOptions: []
  }

  componentDidMount() {
    const businessId = localStorage.getItem('businessId')
    // document.title = businessInfo && businessInfo.organizationName ? `Peymynt - ${businessInfo.organizationName} - Edit Business` : `Peymynt - Edit Business`;
    this.fetchBusinessDetail(businessId)
    this.fetchFormData()
  }

  fetchBusinessDetail = async (businessId) => {
    let response = await fetchBusinessById(businessId)
    if (response.data.business) {
      this.setState({ businessInfo: businessObject(response.data.business) })
    }
  }

  editBusinessHandle = async (event, fieldName) => {
    let updateValue = cloneDeep(this.state.businessInfo)
    if (fieldName === "country") {
      let stateList = (await fetchStatesByCountryId(event.id)).states
      updateValue.address[fieldName] = await this.prepareCountryObj(event.id)
      this.setState({ stateList: stateList })
    } else if (fieldName === "state") {
      updateValue.address[fieldName] = event
    } else if(fieldName === "timezone"){
      updateValue[fieldName] = event
    } else {
      const { name, value } = event.target
      if (["city", "postal", "addressLine1", "addressLine2"].includes(name)) {
        updateValue.address[name] = value
      } else if (["phone", "fax", "mobile", "tollFree", "website"].includes(name)) {
        updateValue.communication[name] = value
      }else {
        updateValue[name] = value
      }
    }
    this.setState({
      businessInfo: updateValue
    })
  }

  prepareCountryObj = id => {
    const { countries } = this.state;
    const countryObject = find(countries, { 'id': parseInt(id) });
    let countryObj = {
        name: countryObject.name,
        id: countryObject.id,
        sortname: countryObject.sortname
        
    };
    return countryObj;
};

  submitBusiness= async(e)=>{
    e.preventDefault()
    let businessInfo = cloneDeep(this.state.businessInfo)
    const businessId = businessInfo._id
    delete businessInfo._id
    let payload = {
      businessInput : businessInfo
    }
    try {
      await updateCompany(businessId, payload)
      this.props.showSnackbar("Business updated successfully")
      this.props.onClose(payload.businessInput)
    } catch (error) {
      console.error('error submitBusiness ====>', error)
      this.props.showSnackbar("Something went wrong, please try again", true)
    }
  }

  fetchFormData = async () => {
    const countries = (await fetchBusinessCountries()).data.countries;
    this.setState({ countries })
  }

  render() {
    const { businessInfo, countries, stateList } = this.state
    const { communication, address } = businessInfo
    const { openPopup, onClose } = this.props
    return (
        <Modal isOpen={openPopup} className="modal-add " centered>
        <ModalHeader toggle={() => onClose(businessInfo)}>
            <h4 className="py-modal__header__stitle">Edit Business Address and Contact Details</h4>
        </ModalHeader>
        <ModalBody className="px-5">
            <Form className="py-form--vertical  py-form-field--condensed">

              <div className="py-box  py-box--card">
                <div className="py-box--header">
                    <div className="py-box--header-title">Business details</div>
                </div>

                <div className="py-box--content">
                <div className="py-form-field">
                  <label className="py-form-field__label">  Company Name  <span className="text-danger">*</span> </label>               
                  <div className="py-form-field__element">
                    <Input
                      type="text"
                      value={businessInfo.organizationName}
                      name="organizationName"
                      onChange={this.editBusinessHandle}
                      className="py-form__element__fluid"
                    />
                  </div>
                </div>
                <div className="py-form-field">
              <label className="py-form-field__label"> Phone </label>

                <div className="py-form-field__element" >

                  <Input
                    type="text"
                    value={communication.phone}
                    name="phone"
                    onChange={this.editBusinessHandle}
                    className="py-form__element__fluid"
                  />
                </div>
              </div>
              <div className="py-form-field">
              <label className="py-form-field__label"> Fax </label>

                <div className="py-form-field__element" className="">

                  <Input
                    type="text"
                    value={communication.fax}
                    name="fax"
                    onChange={this.editBusinessHandle}
                    className="py-form__element__fluid"
                  />
                </div>
              </div>
              <div className="py-form-field">
              <label className="py-form-field__label">Mobile </label>

                <div className="py-form-field__element" className="">

                  <Input
                    type="text"
                    value={communication.mobile}
                    name="mobile"
                    onChange={this.editBusinessHandle}
                    className="py-form__element__fluid"
                  />
                </div>
              </div>
              <div className="py-form-field">
                <label className="py-form-field__label"> Toll Free </label>
                <div className="py-form-field__element">

                  <Input
                    type="text"
                    value={communication.tollFree}
                    name="tollFree"
                    onChange={this.editBusinessHandle}
                    className="py-form__element__fluid"
                  />
                </div>
              </div>
              <div className="py-form-field">
               <label className="py-form-field__label"> Website  </label>
                <div className="py-form-field__element">
                  <Input
                    type="text"
                    value={communication.website}
                    name="website"
                    onChange={this.editBusinessHandle}
                    placeholder=""
                    className="py-form__element__fluid"
                  />
                </div>
              </div>
              </div>
              </div>

              {/* end:: box */}

              <div className="py-box py-box--card">
                <div className="py-box--header">
                  <div className="py-box--header-title">Address</div>
                </div>
                <div className="py-box--content">
                <div className="py-form-field py-text--hint">
                  If you do business in one country but are based in another, choose the country where you file your taxes,
                          or where your business is incorporated.
                </div>
                <div className="py-form-field">
                <label className="py-form-field__label">Address Line 1</label>

                  <div className="py-form-field__element">

                    <Input
                      type="text"
                      value={address.addressLine1}
                      name="addressLine1"
                      onChange={this.editBusinessHandle}
                      className="py-form__element__fluid"
                    />
                  </div>
                </div>
                <div className="py-form-field" >
                <label className="py-form-field__label">  Address Line 2</label>

                  <div className="py-form-field__element">

                    <Input
                      type="text"
                      value={address.addressLine2}
                      name="addressLine2"
                      onChange={this.editBusinessHandle}
                      className="py-form__element__fluid"
                    />
                  </div>
                </div>
                <div className="py-form-field">
                <label className="py-form-field__label"> City </label>
                  <div className="py-form-field__element">
                    <Input
                      type="text"
                      value={address.city}
                      name="city"
                      onChange={this.editBusinessHandle}
                      className="py-form__element__fluid"
                    />

                  </div>
                </div>
                <div className="py-form-field">
                  <label className="py-form-field__label">  Country  <span className="text-danger">*</span> </label>  
                  <div className="py-form-field__element">
                    <SelectBox
                      labelKey={"name"}
                      valueKey={"id"}
                      value={address.country}
                      onChange={e => this.editBusinessHandle(e, "country")}
                      options={countries}
                      clearable={false}
                    />
                  </div>
                  </div>

                  <div className="py-form-field">
                <label className="py-form-field__label">Time Zone </label>
                <div className="py-form-field__element">
                <SelectBox
                    labelKey={"displayName"}
                    valueKey={"offset"}
                    value={businessInfo.timezone}
                    onChange={e => this.editBusinessHandle(e, "timezone")}
                    options={timeZoneList}
                    className="py-form__element__fluid"
                    clearable={false}
                  />
                </div>
              </div>



              <div className="py-form-field" >
              <label className="py-form-field__label"> Province/State </label>
                <div className="py-form-field__element">
                  <SelectBox
                    labelKey={"name"}
                    valueKey={"id"}
                    value={address.state}
                    onChange={e => this.editBusinessHandle(e, "state")}
                    options={stateList}
                    clearable={false}
                  />
                </div>
              </div>
              <div className="py-form-field" >
              <label className="py-form-field__label"> Postal/Zip Code </label>

                <div className="py-form-field__element" >

                  <Input
                    type="text"
                    value={address.postal}
                    name="postal"
                    onChange={this.editBusinessHandle}
                    className="py-form__element__fluid"
                  />
                </div>
              </div>
             
              </div>
              </div>
            </Form>
        </ModalBody>

        <ModalFooter>
          <Button className="btn-outline-primary" color="grey" onClick={() => onClose(businessInfo)}>Close</Button>
          <Button className="btn btn-primary" color="danger" onClick={this.submitBusiness}>Save</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(BusinessPopup)