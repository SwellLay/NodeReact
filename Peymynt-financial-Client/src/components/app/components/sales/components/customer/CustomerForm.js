import history from 'customHistory';
import { cloneDeep, find, orderBy, uniqBy } from 'lodash';
import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import { bindActionCreators } from 'redux'
import * as CustomerActions from '../../../../../../actions/CustomerActions';
import { openGlobalSnackbar } from '../../../../../../actions/snackBarAction';
import { fetchStatesByCountryId } from "../../../../../../api/CustomerServices";
import { fetchCountries } from '../../../../../../api/globalServices';
import BillingAddress from './customerSupportFile/BillingAddress';
import { initialCustomerObject } from './customerSupportFile/constant';
import ShippingAddress from './customerSupportFile/ShippingAddress';

class CustomerForm extends PureComponent {
  state = {
    hideFields: false,
    modal: false,
    activeTab: '3',
    collapse: false,
    customerModel: initialCustomerObject(),
    countries: [],
    currencies: [],
    shippingCountries: [],
    title: '',
    statesOptions: [],
    default_currecy: '',
    fetchstateapi: false,
  };

  componentDidMount() {
    const { isEditMode, selectedCustomer, businessInfo, selectedBusiness } = this.props;
    document.title = businessInfo && businessInfo.organizationName ? `Peymynt-${businessInfo.organizationName}-Customers` : `Peymynt-Customers`;
    console.log("test-didmount", selectedBusiness)
    const onSelect = isEditMode ? selectedCustomer : null;
    const formatedData = initialCustomerObject(onSelect, isEditMode, businessInfo);
    this.setState({ customerModel: formatedData });
    this.fetchFormData();
    this.fetchStates(businessInfo.country.id);
    this.setState({ default_currecy: selectedBusiness.currency.code });
  }

  componentDidUpdate(prevProps) {
    const { isEditMode, selectedCustomer, businessInfo } = this.props;
    if (prevProps.selectedCustomer != selectedCustomer) {
      const onSelect = isEditMode ? selectedCustomer : null;
      const formatedData = initialCustomerObject(onSelect, isEditMode, businessInfo);
      this.setState({ customerModel: formatedData })
      // this.fetchFormData()
    }
  }

  fetchFormData = async () => {
    const countries = (await fetchCountries()).countries;

    const currencies = await CustomerActions.fetchCurrencies();
    this.setState({ countries, currencies, shippingCountries: countries })
  };


  handleText = async (event, type) => {
    const target = event.target;
    const { name, value } = event.target;
    console.log('tyoe', type);
    if (type === 'addressShipping') {

      if (target.name === 'state') {
        console.log(" CustomerModel-> addressShipping states: => " + name + ":", value);
        console.log("country object ", value);
        let setValue = this.mapWithStates(value, 'shipping');

        this.setState({
          customerModel: {
            ...this.state.customerModel,
            addressShipping: {
              ...this.state.customerModel.addressShipping, [name]: setValue
            }
          }
        });
      } else if (target.name === 'country') {
        console.log(" CustomerModel-> addressShipping : => " + name + ":", value);
        let setValue = this.mapWithCountry(value);
        console.log('************ setValue ***********', setValue);
        await this.fetchStatesForShipping(value);

        this.setState({
          customerModel: {
            ...this.state.customerModel,
            addressShipping: {
              ...this.state.customerModel.addressShipping, [name]: setValue
            }
          }
        });
      } else {
        this.setState({
          customerModel: {
            ...this.state.customerModel,
            addressShipping: {
              ...this.state.customerModel.addressShipping, [name]: value
            }
          }
        })
      }
    } else if (name === 'isShipping') {
      let customerModel = cloneDeep(this.state.customerModel);
      customerModel.isShipping = !customerModel.isShipping;
      this.setState({
        customerModel
      })
    }
    else if (target.type === 'checkbox') {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      console.log(" ProductModel Checkbox : => " + name + ":" + value);
      this.setState({
        customerModel: { ...this.state.customerModel, [name]: value }
      })
    } else if (target.name === 'accountNumber' || target.name === 'phone' || target.name === 'fax' || target.name === 'mobile' ||
      target.name === 'tollFree' || target.name === 'website') {
      console.log(" CustomerModel-> communication : => " + name + ":" + value);
      this.setState({
        customerModel: {
          ...this.state.customerModel,
          communication: {
            ...this.state.customerModel.communication, [name]: value
          }
        }
      })
    } else if (target.name === 'city' ||
      target.name === 'addressLine1' || target.name === 'addressLine2' || target.name === 'postal') {
      this.setState({
        customerModel: {
          ...this.state.customerModel,
          addressBilling: {
            ...this.state.customerModel.addressBilling, [name]: value
          }
        }
      });
    } else if (target.name === 'state') {
      let setValue = this.mapWithStates(value, 'billing');
      this.setState({
        customerModel: {
          ...this.state.customerModel,
          addressBilling: {
            ...this.state.customerModel.addressBilling, [name]: setValue
          }
        }
      });
    } else if (target.name === 'country') {
      let setValue = this.mapWithCountry(value);
      await this.fetchStates(value);
      this.setState({
        customerModel: {
          ...this.state.customerModel,
          addressBilling: {
            ...this.state.customerModel.addressBilling, [name]: setValue
          }
        }
      });
    } else if (target.name === 'currency') {
      // let states = await CustomerActions.fetchStatesByCountryId(value);
      console.log(" currency: => " + name + ":", value);
      const setValue = this.mapCurrencyWithCurrency(value);
      this.setState({
        customerModel: { ...this.state.customerModel, [name]: setValue }
      });
    }
    else {
      console.log(" CustomerModel : => ", name, ":", value);
      this.setState({
        customerModel: { ...this.state.customerModel, [name]: value }
      })
    }
  };


  mapWithCountry = id => {
    let countries = this.state.countries;
    if (countries && countries.length > 0) {
      let countryObject = find(countries, { 'id': parseInt(id) });
      let countryObj = {
        name: countryObject.name,
        id: countryObject.id,
        sortname: countryObject.sortname ? countryObject.sortname : ''
      };
      return countryObj;
    }
    return {};
  };


  mapWithStates = (id, addressType) => {

    let countryStates = (addressType === 'shipping') ?
      this.props.selectedCountryStatesForShipping : this.props.selectedCountryStates;
    if (countryStates && countryStates.length > 0) {
      let stateObject = find(countryStates, { 'id': id });
      if (stateObject) {

        let countryObj = {
          name: stateObject.name,
          id: stateObject.id,
          country_id: stateObject.country_id
        }
      }

      return stateObject;
    }
    return {};
  };

  fetchStates = async (id) => {
    const statesList = await fetchStatesByCountryId(id);
    this.props.actions.setCountrytStates(statesList);
  };

  fetchStatesForShipping = async (id) => {
    const statesList = await fetchStatesByCountryId(id);
    this.props.actions.setCountrytStatesForShipping(statesList);
    console.log('setCountrytStatesForShipping', statesList)
  };

  mapCurrencyWithCurrency = id => {
    const countries = this.state.currencies;
    let currencies = countries.map(country => { return country.currencies[0] });
    const currencyObject = find(currencies, { 'code': id });
    let selectedCountryCurrency = {
      name: currencyObject.name,
      code: currencyObject.code,
      symbol: currencyObject.symbol,
      displayName: currencyObject.displayName
    };
    return selectedCountryCurrency
  };
  customerFormSumbit = (event) => {
    event.preventDefault();
    let customerObj = this.state.customerModel;
    if (!customerObj.addressBilling.country.id) {
      customerObj.addressBilling.country.id = 0
    }
    const customerId = customerObj.id;
    delete customerObj.id;
    let payload = {
      customerInput: customerObj
    };
    this.saveCustomer(payload, customerId);
    this.props.actions.resetCountrytStates();
  };

  saveCustomer = async (payload, customerId) => {
    const { isEditMode, actions, type, updateList } = this.props;

    let response;
    try {
      if (isEditMode) {
        await actions.updateCustomer(customerId, payload);
        this.props.showSnackbar("Customer updated successfully", false);
      } else {
        response = await actions.addCustomer(payload);
        this.props.showSnackbar("Customer added successfully", false);
      }
      if (type) {
        updateList(response)
      } else {
        history.push('/app/sales/customer');
      }
    } catch (error) {
      console.log('error===>', error);
      this.props.showSnackbar("Something went wrong", true)
    }
  };

  handleShippingAdderss = e => {
    const { name, value } = e.target;
    let that = this;
    let { customerModel } = this.state;
    customerModel.addressShipping[name] = value;
    this.setState({
      customerModel: {
        ...this.state.customerModel,
        addressShipping: {
          ...this.state.customerModel.addressShipping, [name]: value
        }
      }
    })
  };

  handleHideFields = () => {
    this.setState(prevState => {
      return {
        hideFields: !prevState.hideFields
      }
    })
  };

  onCancel = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose()
    } else {
      history.push('/app/sales/customer');
    }
  };

  renderCurrencyOptions = () => {
    let countries = this.state.currencies;
    let currencies = countries.map(country => { return country.currencies[0] });
    currencies = orderBy(uniqBy(currencies, "code"), "code", "asc");
    return currencies.map((item, i) => {
      return (<option key={i} value={item.code}>
        {item.displayName}
      </option>)
    })
  };

  componentWillReceiveProps() {
    if (this.state.customerModel.addressBilling.country.id !== "" && !this.state.fetchstateapi) {
      this.fetchStates(this.state.customerModel.addressBilling.country.id);
      this.setState({ fetchstateapi: true })
    }
  }

  _renderSectionHeading = title => {
    return (
      <div>
        <h4 className="py-heading--section-title">{title}</h4>
      </div>
    )
  };

  render() {
    const { isEditMode, type } = this.props;
    const { countries, currencies, customerModel, shippingCountries } = this.state;
    console.log("in render", customerModel, this.state.default_currecy);
    return (
      <div>
        <Form className="py-form-field--condensed" onSubmit={this.customerFormSumbit.bind(this)}>
          <Fragment>
            {this._renderSectionHeading('Contact')}
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label is-required">Customer</Label>
              <div className="py-form-field__element">
                <Input required type="text"
                  className="py-form__element__medium"
                  value={this.state.customerModel.customerName} Customer or Company Name
                  name="customerName"
                  onChange={this.handleText} />
              </div>
            </div>

            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label">Email</Label>
              <div className="py-form-field__element">
                <Input type="email"
                  name="email"
                  className="py-form__element__medium"
                  value={this.state.customerModel.email}
                  onChange={this.handleText} />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label">Phone</Label>
              <div className="py-form-field__element">
                <Input type="text" name="phone"
                  className="py-form__element__medium"
                  value={this.state.customerModel.communication.phone}
                  onChange={this.handleText} />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label">Contact</Label>
              <div className="py-form-field__element">
                <Input type="text" name="firstName"
                  className="py-form__element__medium"
                  value={this.state.customerModel.firstName}
                  onChange={this.handleText} />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label" ></Label>
              <div className="py-form-field__element">
                <Input type="text" name="lastName"
                  className="py-form__element__medium"
                  value={this.state.customerModel.lastName}
                  onChange={this.handleText} />
              </div>
            </div>
          </Fragment>
          <div className="py-divider"></div>
          <Fragment>
            {this._renderSectionHeading("Billing")}
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label" >Currency</Label>
              <div className="py-form-field__element">
                <div className="py-select--native">
                  <Input
                    type="select"
                    name="currency"
                    className="py-form__element py-form__element__medium"
                    value={!!this.state.customerModel.currency.code ? this.state.customerModel.currency.code : this.state.default_currecy}
                    placeholder="Select a currency"
                    onChange={this.handleText}>
                    <option key={-1} value={""}>
                      {"Select a currency"}
                    </option>
                    {this.renderCurrencyOptions()}
                  </Input>
                </div>
                <span className="py-text--hint">Billing address</span>
              </div>
            </div>

            <BillingAddress
              addressBilling={this.state.customerModel.addressBilling}
              handleText={this.handleText}
              countryMenus={countries}
              selectedCountryStates={this.props.selectedCountryStates}
            />
            <div className="py-divider"></div>
          </Fragment>
          <Fragment>
            {this._renderSectionHeading('Shipping')}
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label" ></Label>
              <div className="py-form-field__element">
                <span className="py-text--hint">Specify a shipping address</span>
                <Label className="py-checkbox">
                  <input
                    type="checkbox"
                    name='isShipping'
                    checked={this.state.customerModel.isShipping}
                    value={this.state.customerModel.isShipping}
                    onChange={this.handleText}
                  />
                  <span className="py-form__element__faux"></span>
                  <span className="py-form__element__label">Shipping address</span>
                </Label>
              </div>
            </div>
            {this.state.customerModel.isShipping &&
              <ShippingAddress
                addressShipping={this.state.customerModel.addressShipping}
                handleText={this.handleText}
                countryMenus={shippingCountries}
                selectedCountryStates={this.props.selectedCountryStatesForShipping}
              />
            }
            <div className="py-divider"></div>
          </Fragment>
          <Fragment>
            {this._renderSectionHeading("More")}
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label" >Account number</Label>
              <div className="py-form-field__element">
                <Input type="text" className="py-form__element__medium" name="accountNumber"
                  value={this.state.customerModel.communication.accountNumber}
                  onChange={this.handleText} />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label" >Fax</Label>
              <div className="py-form-field__element">
                <Input type="text" className="py-form__element__medium" name="fax"
                  value={this.state.customerModel.communication.fax}
                  onChange={this.handleText} />
              </div>
            </div>
            {/* <div className="py-form-field py-form-field--inline">
                            <Label for="exampleEmail" className="py-form-field__label" >Phone</Label>
                            <Col xs={12} sm={8} md={4} lg={2}>
                                <Input type="text" name="phone"
                                    value={this.state.customerModel.communication.phone}
                                    onChange={this.handleText} />
                            </div>
                        </div> */}
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label" >Mobile</Label>
              <div className="py-form-field__element">
                <Input type="text" name="mobile"
                  className="py-form__element__medium"
                  value={this.state.customerModel.communication.mobile}
                  onChange={this.handleText} />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label" >Toll free</Label>
              <div className="py-form-field__element">
                <Input type="text" name="tollFree"
                  className="py-form__element__medium"
                  value={this.state.customerModel.communication.tollFree}
                  onChange={this.handleText} />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="exampleEmail" className="py-form-field__label" >Website</Label>
              <div className="py-form-field__element">
                <Input type="text" name="website"
                  className="py-form__element__medium"
                  value={this.state.customerModel.communication.website}
                  onChange={this.handleText} />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label
                for="exampleEmail"
                className="py-form-field__label">
                Internal notes
                    </Label>
              <div className="py-form-field__element">
                <textarea
                  type="text"
                  rows="10"
                  name="internalNotes"
                  className="form-control py-form__element__medium"
                  value={this.state.customerModel.communication.deliveryNotes}
                  onChange={e => handleText(e, "addressShipping")}
                />
              </div>
            </div>
          </Fragment>
          <div className="py-form-field py-form-field--inline" check>
            <div className="py-form-field__label"></div>
            <div className="py-form-field__element">
              <Button /* disabled={type === 'popup'} */
                className="btn btn-primary btn-rounded">Save</Button>
              {/* <Button className="btn btn-rounded" onClick={this.onCancel}>Cancel</Button> */}
            </div>
          </div>

        </Form>
      </div>

    )
  }
}


const mapStateToProps = (state) => {
  return {
    selectedCustomer: state.customerReducer.selectedCustomer,
    countryCurrencyList: state.customerReducer.countryCurrencyList,
    errorMessage: state.customerReducer.errorMessage,
    businessInfo: state.businessReducer.selectedBusiness,
    selectedCountryStates: state.customerReducer.selectedCountryStates,
    selectedCountryStatesForShipping: state.customerReducer.selectedCountryStatesForShipping
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(CustomerActions, dispatch),
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    }
  };
};


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(CustomerForm)))
