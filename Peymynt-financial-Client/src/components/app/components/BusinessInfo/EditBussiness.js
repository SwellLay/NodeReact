import _, { cloneDeep, find } from 'lodash'
import moment from "moment-timezone";
import React, { Component } from 'react';
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Form, FormText, Input, Label, } from "reactstrap";
import SelectBox from "utils/formWrapper/SelectBox";
import { openGlobalSnackbar } from '../../../../actions/snackBarAction';
import {
  deleteBusinessById,
  fetchBusinessById,
  fetchBusinessCountries,
  updateCompany
} from '../../../../api/businessService';
import { fetchStatesByCountryId } from '../../../../api/CustomerServices';
import { _documentTitle } from '../../../../utils/GlobalFunctions';
import { ArchiveConfirmation } from '../profile/components/ArchiveConfirmation';
import { businessObject } from './helper/businessObject';

class EditBussinessInfo extends Component {

  state = {
    businessInfo: businessObject(),
    countries: [],
    stateList: [],
    shippingCountries: [],
    title: '',
    statesOptions: [],
    confrmArchv: false
  };

  componentDidMount = async() => {
    console.log("props", this.props);
    const businessId = this.props.match.params.businessId;
    _documentTitle({}, "Edit Your Business");
    // document.title = businessInfo && businessInfo.organizationName ? `Peymynt - ${businessInfo.organizationName} - Edit Business` : `Peymynt - Edit Business`;
    this.fetchBusinessDetail(businessId);
    this.fetchFormData()
  };

  fetchBusinessDetail = async (businessId) => {
    let response = await fetchBusinessById(businessId);
    if (response.data.business) {
      this.setState({ businessInfo: businessObject(response.data.business) });
      if(!!response.data.business.country){
        let stateList = (await fetchStatesByCountryId(response.data.business.country.id)).states;
        this.setState({stateList})
      }
    }
  };

  editBusinessHandle = async (event, fieldName) => {
    console.log("event, fieldName", event, fieldName);
    let updateValue = cloneDeep(this.state.businessInfo);
    if (fieldName === "country") {
      let stateList = (await fetchStatesByCountryId(event.id)).states;
      updateValue.address[fieldName] = await this.prepareCountryObj(event.id);
      this.setState({ stateList: stateList })
    } else if (fieldName === "state") {
      updateValue.address[fieldName] = event
    } else if(fieldName === "timezone"){
      updateValue[fieldName] = {
        name: event.value,
        offSet: parseInt(moment.tz(new Date, event.value).format('Z')),
        zoneAbbr: moment.tz(new Date, event.value).format('z')
      }
    } else {
      const { name, value } = event.target;
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
  };

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
    e.preventDefault();
    let businessInfo = cloneDeep(this.state.businessInfo);
    const businessId = businessInfo._id;
    delete businessInfo._id;
    let payload = {
      businessInput : businessInfo
    };
    try {
      await updateCompany(businessId, payload);
      this.props.showSnackbar("Business updated successfully")
    } catch (error) {
      console.error('error submitBusiness ====>', error);
      this.props.showSnackbar("Something went wrong, please try again", true)
    }
  };

  fetchFormData = async () => {
    const countries = (await fetchBusinessCountries()).data.countries;
    this.setState({ countries })
  };

  _handleArchive = async (e) => {
    e.preventDefault();
    const businessId = this.props.match.params.businessId;
    try{
      await deleteBusinessById(businessId);
      this.props.showSnackbar("Business removed successfully", false);
      window.location.href = `${process.env.WEB_URL}/app/dashboard`
    }catch (error){
      console.log("error in archive business=>", error);
      this.props.showSnackbar("Something went wrong, please try again", true)
    }
  };

  timeZoneList = () => {
    let listOfTimeZone = moment.tz.names();
    const list = listOfTimeZone.map(item => {
      return {
        label: item,
        value: item
      }
    });
    return list
  };

  render() {
    const { businessInfo, countries, stateList, confrmArchv } = this.state;
    const { communication, address, currency } = businessInfo;
    const timeZoneList = this.timeZoneList();
    return (

      <div className="py-page__inner">
        <header className="py-header--page">
          <div className="py-header--title">
            <h4 className="py-heading--title d-flex align-items-center">
              {_.includes(this.props.location.pathname, 'account') ?
                <NavLink className="py-icon py-icon--lg" to={`/app/${this.props.match.params.businessId}/accounts/business`}>
                  <svg className="py-icon" viewBox="0 0 20 20" id="back" xmlns="http://www.w3.org/2000/svg"><path d="M13.813 16.187a1.15 1.15 0 0 1-1.626 1.626l-7-7a1.15 1.15 0 0 1 0-1.626l7-7a1.15 1.15 0 0 1 1.626 1.626L7.626 10l6.187 6.187z"></path></svg>
                </NavLink>
                : ""
              }
              Edit {businessInfo.organizationName}
            </h4>
          </div>
        </header>
        <Form className="py-form-field--condensed">
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label is-required" id="link1">  Company Name</Label>
            <div  className="py-form-field__element">
              <Input
                type="text"
                value={businessInfo.organizationName}
                name="organizationName"
                onChange={this.editBusinessHandle}
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1">  Address Line 1</Label>

            <div  className="py-form-field__element">

              <Input
                type="text"
                value={address.addressLine1}
                name="addressLine1"
                onChange={this.editBusinessHandle}
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1">  Address Line 2</Label>

            <div  className="py-form-field__element">

              <Input
                type="text"
                value={address.addressLine2}
                name="addressLine2"
                onChange={this.editBusinessHandle}
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1"> City </Label>
            <div  className="py-form-field__element">
              <Input
                type="text"
                value={address.city}
                name="city"
                onChange={this.editBusinessHandle}
              />

            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label is-required" id="link1"> Country
            </Label>
            <div className="py-form-field__element">
              <SelectBox
                labelKey={"name"}
                valueKey={"id"}
                value={address.country}
                onChange={e => this.editBusinessHandle(e, "country")}
                placeholder="Select a country"
                options={countries}
                clearable={false}
              />
              <FormText className="text-mute">
                If you do business in one country but are based in another, choose the country where you file your taxes,
                or where your business is incorporated.
              </FormText>
            </div>
          </div>

          {/* <div className="py-form-field py-form-field--inline">
                <Label className="py-form-field__label" id="link1"></Label>
                <span className="text-danger"></span>
                <div  className="py-form-field__element">
                  <p> </p>
                </div>
              </div> */}


          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1">  Province/State </Label>
            <div  className="py-form-field__element">
              <SelectBox
                labelKey={"name"}
                valueKey={"id"}
                value={address.state}
                onChange={e => this.editBusinessHandle(e, "state")}
                options={stateList}
                placeholder="Select a province/state"
                clearable={false}
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1"> Postal/Zip Code </Label>

            <div className="py-form-field__element">

              <Input
                type="text"
                value={address.postal}
                name="postal"
                onChange={this.editBusinessHandle}
                className="py-form__element__small"
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1">Time Zone </Label>

            <div  className="py-form-field__element">
              <SelectBox
                value={{ label: businessInfo.timezone.name, value: businessInfo.timezone.name }}
                onChange={e => this.editBusinessHandle(e, "timezone")}
                options={timeZoneList}
                clearable={false}
                placeholder="Select a timezone"
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1"> Phone </Label>

            <div className="py-form-field__element">

              <Input
                type="text"
                value={communication.phone}
                name="phone"
                onChange={this.editBusinessHandle}
                className="py-form__element__small"
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1"> Fax </Label>

            <div className="py-form-field__element">

              <Input
                type="text"
                value={communication.fax}
                name="fax"
                onChange={this.editBusinessHandle}
                className="py-form__element__small"
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1"> Mobile </Label>

            <div className="py-form-field__element">

              <Input
                type="text"
                value={communication.mobile}
                name="mobile"
                onChange={this.editBusinessHandle}
                className="py-form__element__small"
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1"> Toll Free </Label>

            <div className="py-form-field__element">

              <Input
                type="text"
                value={communication.tollFree}
                name="tollFree"
                className="py-form__element__small"
                onChange={this.editBusinessHandle}
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label className="py-form-field__label" id="link1"> Website  </Label>

            <div  className="py-form-field__element">

              <Input
                type="text"
                value={communication.website}
                name="website"
                onChange={this.editBusinessHandle}
                placeholder=""
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label id="link1" className="py-form-field__label--align-top"> Business Currency  </Label>

            <div className="py-form-field__element">

              {/* <Input
                    type="text"
                    value={ `${currency && currency.code} - ${currency && currency.name}`}
                    name="currency"
                    // onChange={this.editBusinessHandle}
                    placeholder=""
                    readOnly
                    className="feild-height readOnly"
                  /> */}

              <span className="py-text m-0">{ `${currency && currency.code} - ${currency && currency.name}`}</span>
              <FormText>
                This is your reporting currency and cannot be changed. You can still send invoices,
                track expenses and enter transactions in any currency and an exchange rate is applied for you.
                {/* <a className="py-text--link-external" href="javascript: void(0)" > Learn more</a> */}
              </FormText>
            </div>
          </div>
          {/* <h5 id="headinginr">  Business Currency {currency && currency.code} - {currency && currency.name} </h5>

              <div className="py-form-field py-form-field--inline">

                <Label className="py-form-field__label" id="link1"></Label>
                <span className="text-danger"></span>
                <div  className="py-form-field__element">
                  <p>This is your reporting currency and cannot be changed. You can still send invoices, track expenses and enter transactions in any currency and an exchange rate is applied for you. </p>
                </div>
              </div> */}
          <div className="py-form-field py-form-field--inline">
            <div className="py-form-field__label"></div>
            <div className="py-form-field__element">
              <button onClick={this.submitBusiness} className="btn btn-primary">Save</button>
            </div>
          </div>
          <hr />
          <h3 className="py-heading--section-title">Archive This Business</h3>
          {
            confrmArchv ?
              (<ArchiveConfirmation archieve={this._handleArchive.bind(this)} closeConfrm={() => this.setState({confrmArchv: false})}/>)
              : (
                <div>
                  <p>
                    This will hide <span className="py-text--strong">{businessInfo.organizationName}</span> from every menu and you will no longer be able to access it. You can always restore this business later.
                  </p>

                  <button className="btn btn-outline-danger" onClick={() => this.setState({confrmArchv: true})}>Archive {businessInfo.organizationName} </button>
                </div>
              )
          }

        </Form>
      </div>
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
)(EditBussinessInfo)
