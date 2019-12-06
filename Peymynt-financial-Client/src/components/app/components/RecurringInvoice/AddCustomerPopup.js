import classnames from 'classnames';
import { cloneDeep, find } from 'lodash';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from "reactstrap";
import { bindActionCreators } from 'redux'
import * as CustomerActions from '../../../../actions/CustomerActions';
import { openGlobalSnackbar } from '../../../../actions/snackBarAction';
import { fetchStatesByCountryId } from "../../../../api/CustomerServices";
import { fetchCountries } from '../../../../api/globalServices';
import { initialCustomerObject } from '../sales/components/customer/customerSupportFile/constant';
import BillingForm from './AddCustomerForms/BillingForm';
import ContactForm from './AddCustomerForms/ContactForm';
import MoreForm from './AddCustomerForms/MoreForm';
import ShippingForm from './AddCustomerForms/ShippingForm';

class AddCustomerPopup extends Component {
  state = {
    activeTab: '1',
    hideFields: false,
    modal: false,
    collapse: false,
    customerModel: initialCustomerObject(this.props.customer, this.props.isEditMode, this.props.businessInfo),
    countries: [],
    currencies: [],
    shippingCountries: [],
    title: '',
    statesOptions: [],
    customerNameErr: false
  };

  _toggle(tab){
    if(!!this.state.customerModel.customerName){
      this.setState({ customerNameErr: false });
      if(this.state.activeTab !== tab){
        this.setState({activeTab: tab})
      }
    }else{
      this.setState({ customerNameErr: true });
      this.props.showSnackbar("Please enter required fields", true)
    }
    if(tab === '3'){
      if(!!this.state.customerModel.addressShipping.contactPerson){
        if(this.state.activeTab !== tab){
          this.setState({activeTab: tab})
        }
      }
    }
  }

  componentDidMount() {
    const { isEditMode, selectedCustomer, businessInfo, customer } = this.props;
    console.log("this.props", this.props);
    document.title = businessInfo && businessInfo.organizationName ? `Peymynt-${businessInfo.organizationName}-Customers` : `Peymynt-Customers`;
    const onSelect = isEditMode ? customer : null;
    console.log('onSelect', onSelect);
    const formatedData = initialCustomerObject(onSelect, isEditMode, businessInfo);
    this.setState({ customerModel: formatedData });
    this.fetchFormData();
    this.fetchStates(businessInfo.country.id);
  }

  componentDidUpdate(prevProps) {
    const { isEditMode, selectedCustomer, businessInfo } = this.props;
    if (prevProps.selectedCustomer != selectedCustomer) {
      const onSelect = isEditMode ? selectedCustomer : null;
      const formatedData = initialCustomerObject(onSelect, isEditMode, businessInfo);
      this.setState({ customerModel: formatedData });
      this.fetchFormData()
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
    if (type === 'addressShipping') {
      if (target.name === 'state') {
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
        let setValue = this.mapWithCountry(value);
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
    }else if (target.type === 'checkbox') {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      console.log(" ProductModel Checkbox : => " + name + ":" + value);
      this.setState({
        customerModel: { ...this.state.customerModel, [name]: value }
      })
    } else if (target.name === 'accountNumber' || target.name === 'phone' || target.name === 'fax' || target.name === 'mobile' ||
      target.name === 'tollFree' || target.name === 'website') {
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
      const setValue = this.mapCurrencyWithCurrency(value);
      this.setState({
        customerModel: { ...this.state.customerModel, [name]: setValue }
      });
    }else if(target.name === 'customerName') {
      this.setState({
        customerModel: { ...this.state.customerModel, [name]: value },
        customerNameErr: false
      })
    } else {
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
        name: !!countryObject && !!countryObject.name && countryObject.name,
        id: !!countryObject && !!countryObject.id && countryObject.id,
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
    const customerId = customerObj.id;
    delete customerObj.id;
    let payload = {
      customerInput: customerObj
    };
    if(!!customerObj.customerName){
      this.saveCustomer(payload, customerId);
      this.props.actions.resetCountrytStates();
    }
  };

  saveCustomer = async(payload, customerId) => {
    const { isEditMode, actions, type, updateList } = this.props;
    let response;
    try {
      if (isEditMode) {
        if (!(this.props.invoiceData && this.props.invoiceData.payments && this.props.invoiceData.payments.length > 0 && this.props.invoiceData.customer.customerName !== payload.customerInput.customerName)) {
          response = await actions.updateCustomer(customerId, payload);
          if(!!response){
            this.props.showSnackbar("Customer updated successfully", false);
          }else{
            this.props.showSnackbar(response.message, true);
          }
        }else{
          response = payload.customerInput
        }
      } else {
        response = await actions.addCustomer(payload);
        if(!!response){
          this.props.showSnackbar("Customer added successfully", false);
        }else{
          this.props.showSnackbar(response.message, true);
        }
      }
      if (type) {
        updateList(response)
      } else {
        // history.push('/app/sales/customer');
        this.props.closeModal(response)
      }
    } catch (error) {
      console.err('error===>', error);
      this.props.showSnackbar(error.message, true)
    }
  };

  render() {
    const { open, isEditMode, customer } = this.props;
    const { countries, currencies, customerModel, shippingCountries } = this.state;
    console.log('customerPopup', customerModel)
    return (
      <div>
        <Modal isOpen={open} className="modal-add modal-customer" centered>
          <ModalHeader>
                <h4 className="modal-title">{isEditMode === true ? 'Edit' : 'Add'} a customer</h4>
          </ModalHeader>
            <ModalBody>
            <Nav tabs className="py-nav--tabs mb-4">
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this._toggle('1'); }}
                >
                  Contact
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this._toggle('2'); }}
                >
                  Billing
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this._toggle('3'); }}
                >
                  Shipping
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '4' })}
                  onClick={() => { this._toggle('4'); }}
                >
                  More
                </NavLink>
              </NavItem>
            </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        <ContactForm
                          currencies={this.state.currencies}
                          handleText={this.handleText}
                          businessInfo={this.props.businessInfo}
                          customerNameErr= {this.state.customerNameErr}
                          customerModel={customerModel}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <BillingForm
                          handleText={this.handleText}
                          currencies={this.state.currencies}
                          countryMenus={shippingCountries}
                          customerModel={customerModel}
                          selectedCountryStates={this.props.selectedCountryStatesForShipping}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col sm="12">
                        <ShippingForm
                          addressShipping={this.state.customerModel.addressShipping}
                          handleText={this.handleText}
                          countryMenus={shippingCountries}
                          customerModel={customerModel}
                          selectedCountryStates={this.props.selectedCountryStatesForShipping}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col sm="12">
                        <MoreForm
                          customerModel={customerModel}
                          handleText={this.handleText}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
            </ModalBody>
                <ModalFooter>
                  <button className="btn btn-outline-primary" onClick={() => this.props.closeModal(!!customerModel.customerName && customerModel.customerName === !!customer && !!customer.customerName && customer.customerName ? customerModel : customer)}>Cancel</button>
                  <button className="btn btn-primary" color="danger" disabled={!this.state.customerModel.customerName} onClick={this.customerFormSumbit.bind(this)}>Save</button>
                </ModalFooter>
        </Modal>
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


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(AddCustomerPopup)))
