import history from 'customHistory';
import { find } from 'lodash';
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Label } from 'reactstrap';
import { bindActionCreators } from 'redux'
import * as CustomerActions from '../../../../../../../actions/CustomerActions';
import { openGlobalSnackbar } from '../../../../../../../actions/snackBarAction';
import { addVendor, updateVendor } from '../../../../../../../actions/vendorsAction';
import { fetchStatesByCountryId } from '../../../../../../../api/CustomerServices';
import { fetchCountries } from '../../../../../../../api/globalServices';
import { _documentTitle } from '../../../../../../../utils/GlobalFunctions';
import { vendorInput } from '../constants'
import RegularForm from './RegularForm';

class VendorForm extends Component {

  state = {
    vendorInput: this.props.vendorInput || vendorInput,
    countries: [],
    currencies: [],
    shippingCountries: [],
    regularMore: false,
    errors: {
      ssn: '',
    },
  };

  componentDidMount() {
    const { isEditMode, selectedCustomer, businessInfo } = this.props;
    _documentTitle(businessInfo, `${isEditMode ? 'Edit' : 'Add'} a vendor`);
    this.fetchFormData();
  }

  fetchStates = async (id) => {
    const statesList = await fetchStatesByCountryId(id);
    this.props.actions.setCountrytStates(statesList);
  };

  fetchFormData = async () => {
    const { vendorInput } = this.props;
    const countries = (await fetchCountries()).countries;
    let defaultCurrency = this.props.businessInfo.currency;
    const currencies = await CustomerActions.fetchCurrencies();

    if (vendorInput) {
      this.setState({
        countries,
        currencies,
        shippingCountries: countries,
        vendorInput: {
          ...vendorInput,
          ...vendorInput.address,
          country: vendorInput.address.country.id,
          state: vendorInput.address.state.id,
          ...vendorInput.contractor,
        }
      }, () => this.fetchStates(vendorInput.address.country.id));
    } else {
      this.setState({
        countries,
        currencies,
        shippingCountries: countries,
        vendorInput: {
          ...this.state.vendorInput,
          currency: defaultCurrency
        }
      });
    }
  };

  handleText = async (e) => {
    const { name, value } = e.target;
    let defaultCurrency = this.props.businessInfo.currency;

    if (name === 'state') {
      let setValue = this.mapWithStates(value);
      this.setState({
        vendorInput: {
          ...this.state.vendorInput,
          address: {
            ...this.state.vendorInput.address,
            [name]: setValue
          }
        }
      })
    } else if (name === 'country') {
      let setValue = this.mapWithCountry(value);

      await this.fetchStates(value);
      const newCurrency = this.linkCurrencyWithCountry(setValue.name);

      this.setState({
        vendorInput: {
          ...this.state.vendorInput,
          currency: { ...newCurrency },
          country: value,
          address: {
            ...this.state.vendorInput.address,
            state: {},
            [name]: setValue
          },
        }
      })
    } else if (name === 'city' || name === 'addressLine1' || name === 'addressLine2' || name === 'postal') {
      this.setState({
        vendorInput: {
          ...this.state.vendorInput,
          address: {
            ...this.state.vendorInput.address,
            [name]: value
          }
        }
      })
    } else if (name === 'currency') {
      const setValue = this.mapCurrencyWithCurrency(value);

      this.setState({
        vendorInput: { ...this.state.vendorInput, [name]: setValue }
      });
    } else if (name === 'accountNumber' || name === 'phone' || name === 'fax' || name === 'mobile' ||
      name === 'tollFree' || name === 'website') {
      this.setState({
        vendorInput: {
          ...this.state.vendorInput,
          communication: {
            ...this.state.vendorInput.communication,
            [name]: value
          }
        }
      })
    } else if (name === 'contractorType' || name === 'ssn' || name === 'ein') {
      this.setState({
        vendorInput: {
          ...this.state.vendorInput,
          contractor: {
            ...this.state.vendorInput.contractor,
            [name]: value
          }
        }
      })
    } else if (name === 'vendorType') {
      this.setState({
        vendorInput: {
          ...this.state.vendorInput,
          vendorType: value,
          currency: defaultCurrency,
          country: '',
          address: {
            ...this.state.vendorInput.address,
            country: {},
          },
        },
      })
    } else {
      this.setState({
        vendorInput: { ...this.state.vendorInput, [name]: value }
      });
    }

    if (name === 'vendorType' && value === 'contractor') {
      setTimeout(async () => {
        await this.handleText({ target: { name: 'country', value: '231' } });
        await this.handleText({ target: { name: 'currency', value: 'USD' } });
      }, 300)
    }
  };

  fetchStatesForShipping = async (id) => {
    const statesList = await fetchStatesByCountryId(id);
    this.props.actions.setCountrytStatesForShipping(statesList);
  };

  mapCurrencyWithCurrency = id => {
    const countries = this.state.currencies;
    let currencies = countries.map(country => {

      return country.currencies[0]

    });

    const currencyObject = find(currencies, { 'code': id });

    let selectedCountryCurrency = {
      name: currencyObject.name,
      code: currencyObject.code,
      symbol: currencyObject.symbol,
      displayName: currencyObject.displayName
    };
    return selectedCountryCurrency
  };


  linkCurrencyWithCountry = (name) => {
    const countries = this.state.currencies;
    const country = countries.find(row => row.name === name);
    if (!country) {
      return {};
    }
    return country.currencies[0];
  };


  mapWithStates = (id) => {

    let countryStates = this.props.selectedCountryStates;
    if (countryStates && countryStates.length > 0) {
      let stateObject = find(countryStates, { 'id': id });
      if (stateObject) {

        stateObject = {
          name: stateObject.name,
          id: stateObject.id,
          countryId: stateObject.country_id
        }
      }

      return stateObject;
    }
    return {};
  };

  mapWithCountry = id => {
    let countries = this.state.countries;
    if (countries && countries.length > 0) {
      let countryObject = find(countries, { 'id': parseInt(id) });
      if (!countryObject) {
        return {};
      }
      let countryObj = {
        name: countryObject.name,
        id: countryObject.id,
        // sortname: countryObject.sortname ? countryObject.sortname : ''
      };
      return countryObj;
    }
    return {};
  };

  validatePayload = (payload) => {
    const errors = {};
    if (payload.vendorType === "contractor") {
      if (payload.contractor && payload.contractor.contractorType === 'individual' && (!payload.contractor.ssn || !(/^\d{3}-\d{2}-\d{4}$/ig.test(payload.contractor.ssn) || /^\d{9}$/ig.test(payload.contractor.ssn)))) {
        errors.ssn = 'SSN must be in the format 999-99-9999';
      }

      if (payload.address.postal && !(/^\d{5}$/ig.test(payload.address.postal) || /^\d{5}-\d{4}$/ig.test(payload.address.postal))) {
        errors.postal = 'must be in the format 12345 or 12345-1234';
      }
    }

    this.setState({ errors });

    return !Object.keys(errors).length
  };

  _submitForm = async (e) => {
    e.preventDefault();
    const { vendorInput } = this.state;
    const { isEdit, addVendor, updateVendor, match } = this.props;
    delete vendorInput.country;
    delete vendorInput.state;
    delete vendorInput.city;
    delete vendorInput.addressLine1;
    delete vendorInput.addressLine2;
    delete vendorInput.postal;
    delete vendorInput.contractorType;
    delete vendorInput.ssn;
    delete vendorInput.ein;

    if (vendorInput.contractor && !vendorInput.contractor.ein) {
      delete vendorInput.contractor.ein;
    }

    if (!vendorInput.vendorType) {
      vendorInput.vendorType = "regular";
    }

    if (!this.validatePayload(vendorInput)) {
      return;
    }

    try {
      if (isEdit) {
        delete vendorInput.businessId;
        delete vendorInput.createdAt;
        delete vendorInput.id;
        delete vendorInput.isAccountAdded;
        await updateVendor(vendorInput, match.params.id)
      } else {
        await addVendor(vendorInput)
      }
    } catch (err) {
      console.log("err", err)
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.addVendorState !== nextProps.addVendorState) {
      if (nextProps.addVendorState.success) {
        this.props.showSnackbar(nextProps.addVendorState.message, false);
        history.push('/app/purchase/vendors');
      } else if (nextProps.addVendorState.error) {
        this.props.showSnackbar(nextProps.addVendorState.message, true)
      }
    }
    if (this.props.updateVendorState !== nextProps.updateVendorState) {
      if (nextProps.updateVendorState.success) {
        this.props.showSnackbar(nextProps.updateVendorState.message, false);
        history.push('/app/purchase/vendors');
      } else if (nextProps.updateVendorState.error) {
        this.props.showSnackbar(nextProps.updateVendorState.message, true)
      }
    }
  }

  renderNonUS() {
    const { vendorInput, errors } = this.state;
    const { vendorType } = vendorInput;
    const { addVendorState } = this.props;
    const { success, loading, error, data } = addVendorState;

    return (
      <div className="vendorFormWrapper">
        <Form onSubmit={this._submitForm.bind(this)}>
          <div className="py-form-field py-form-field--inline">
            <Label
              for="exampleEmail"
              className="py-form-field__label is-required">
              Vendor Name
            </Label>
            <div className="py-form-field__element">
              <Input
                required
                type="text"
                name="vendorName"
                value={vendorInput.vendorName}
                onChange={this.handleText}
                // maxLength={300}
              />
            </div>
          </div>
          <RegularForm otherCountries from="regular" handleText={this.handleText}
            vendorInput={vendorInput} errors={errors} />
          <div className="py-form-field py-form-field--inline">
            <Label
              for="exampleEmail"
              className="py-form-field__label">
            </Label>
            <div className="py-form-field__element">
              <button type="submit"
                className={((!!vendorInput.vendorName) && (!!vendorInput.vendorType) && !loading) ? "btn btn-rounded btn-accent" : "btn btn-rounded btn-accent disabled"}
                disabled={(!!vendorInput.vendorName && !!vendorInput.vendorType && !loading)}
              >Save
              </button>
            </div>
          </div>
        </Form>
      </div>
    )
  }

  render() {
    if (this.props.nonUSBusiness) {
      return this.renderNonUS();
    }
    const { vendorInput, errors } = this.state;
    const { vendorType } = vendorInput;
    const { addVendorState } = this.props;
    const { success, loading, error, data } = addVendorState;

    return (
      <div className="vendorFormWrapper">
        <Form onSubmit={this._submitForm.bind(this)} className="py-form-field--condensed">
          <div className="py-form-field py-form-field--inline">
            <Label
              for="exampleEmail"
              className="py-form-field__label is-required">
              Vendor Name
            </Label>
            <div className="py-form-field__element">
              <Input
                required
                type="text"
                name="vendorName"
                value={vendorInput.vendorName}
                onChange={this.handleText.bind(this)}
                // maxLength={300}
              />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label
              for="exampleEmail"
              className="py-form-field__label">
              Type
            </Label>
            <div className="py-form-field__element" style={{ paddingTop: '6px' }}>
              <Label className="py-radio">
                <Input type="radio"
                  name="vendorType"
                  value="regular"
                  onChange={this.handleText}
                  checked={vendorInput.vendorType === 'regular'}
                />{' '}
                <span className="py-form__element__faux"></span>
                <span className="py-form__element__label">Regular</span>
              </Label>
              <span className="py-text--hint">Companies that provide goods and services to your business (e.g. internet and utility providers).</span>
            </div>
          </div>

          <div className="py-form-field py-form-field--inline">
            <div className="py-form-field__label"></div>
            <div className="py-form-field__element">
              <Label className="py-radio">
                <Input
                  type="radio"
                  name="vendorType"
                  value="contractor"
                  onChange={this.handleText}
                  checked={vendorInput.vendorType === 'contractor'}
                />{' '}
                <span className="py-form__element__faux"></span>
                <span className="py-form__element__label">1099-MISC contractor</span>
              </Label>
              <span className="py-text--hint">Contractors that perform a service for which you pay them and provide a 1099-MISC form.</span>

            </div>
          </div>
          {
            vendorType === 'regular' ?
              (<Fragment>
                <div className="py-form-field py-form-field--inline">
                  <Label
                    for="exampleEmail"
                    className="py-form-field__label">
                  </Label>
                  <div className="py-form-field__element">
                    <hr />
                  </div>
                </div>
                <RegularForm from="regular" handleText={this.handleText.bind(this)}
                  vendorInput={this.state.vendorInput} />
              </Fragment>)
              : vendorType === 'contractor' ?
              (<Fragment>
                <div className="py-form-field py-form-field--inline">
                  <Label
                    for="exampleEmail"
                    className="py-form-field__label">
                  </Label>
                  <div className="py-form-field__element">
                    <hr />
                  </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                  <Label
                    for="exampleEmail"
                    className="py-form-field__label">
                    Contractor type
                  </Label>
                  <div className="py-form-field__element">
                    <div className="py-select--native">
                      <Input
                        type="select"
                        name="contractorType"
                        className="py-form__element"
                        value={vendorInput.contractorType}
                        onChange={this.handleText.bind(this)}
                      >
                        <option value={"individual"}>{'Individual'}</option>
                        <option value={"business"}>{'Business'}</option>
                      </Input>
                    </div>
                    {vendorInput.contractor.contractorType === 'individual' ? (
                      <small className="py-text--hint">A single person that’s not registered as a business or not
                        doing business under an official name.</small>
                    ) : (
                      <small className="py-text--hint">A contractor that’s registered as a business or doing business
                        under an official name.</small>
                    )}
                  </div>
                </div>
                {
                  vendorInput.contractor.contractorType === 'individual' ?
                    (
                      <Fragment>
                        <div className="py-form-field py-form-field--inline">
                          <Label
                            for="exampleEmail"
                            className="py-form-field__label is-required">
                            Social Security Number
                          </Label>
                          <div className="py-form-field__element">
                            <Input
                              type="text"
                              name="ssn"
                              className={errors.ssn && "has-errors"}
                              value={vendorInput.contractor.ssn}
                              placeholder="999-99-9999"
                              required
                              onChange={this.handleText.bind(this)}
                            />
                            <br />
                            {errors.ssn
                              ? <span className="input-error-text">{errors.ssn}</span>
                              : <span className="py-text--hint">SSN must be in the format 999-99-9999</span>
                            }
                          </div>
                        </div>
                      </Fragment>
                    ) :
                    (
                      <Fragment>
                        <div className="py-form-field py-form-field--inline">
                          <Label
                            for="exampleEmail"
                            className="py-form-field__label">
                            Business Legal Name
                          </Label>
                          <div className="py-form-field__element">
                            <b className="business-name">{vendorInput.vendorName}</b>

                            <div className="py-notify py-notify--warning py-notify--small">
                              <div className="py-notify__icon-holder">
                                <svg viewBox="0 0 20 20" className="py-svg-icon icon" id="attention"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M7.916 3.222C8.369 2.453 9.153 2 10 2c.848 0 1.632.453 2.085 1.222l6.594 12.196c.426.758.428 1.689.006 2.449-.424.765-1.147 1.122-2.084 1.133H3.391c-.928-.01-1.65-.368-2.075-1.133a2.51 2.51 0 0 1 0-2.436l6.6-12.21zm-4.76 12.904a.717.717 0 0 0-.002.696c.063.114.21.174.557.178h12.46c.356-.004.502-.064.565-.178a.723.723 0 0 0-.008-.708L10.564 4.298A.657.657 0 0 0 10 3.97a.656.656 0 0 0-.557.317l-6.287 11.84zM10 14a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-6a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z"></path>
                                </svg>
                              </div>
                              <div className="py-notify__content-wrapper">
                                <div className="py-notify__content">
                                  To ensure that 1099-MISC forms are generated correctly, this business name needs to be
                                  accurate. If the business legal name isn’t correct here, edit it in the “Vendor name”
                                  field above.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                          <Label
                            for="exampleEmail"
                            className="py-form-field__label is-required">
                            Employer Identification Number
                          </Label>
                          <div className="py-form-field__element">
                            <Input
                              type="text"
                              required
                              name="ein"
                              maxLength={9}
                              value={vendorInput.contractor.ein}
                              placeholder="99-999999"
                              onChange={this.handleText.bind(this)}
                            />
                          </div>
                        </div>
                      </Fragment>
                    )
                }
                <RegularForm from="contractor" handleText={this.handleText.bind(this)}
                  vendorInput={this.state.vendorInput} errors={errors} />
              </Fragment>)
              : ""
          }
          <div className="py-form-field py-form-field--inline mt-4">
            <Label
              className="py-form-field__label">
            </Label>
            <div className="py-form-field__element">
              <button type="submit"
                className="btn btn-primary"
                disabled={!vendorInput.vendorName || !vendorInput.vendorType || loading}
              >Save
              </button>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nonUSBusiness: state.businessReducer.selectedBusiness.country.id.toString() !== '231',
    selectedCustomer: state.customerReducer.selectedCustomer,
    countryCurrencyList: state.customerReducer.countryCurrencyList,
    errorMessage: state.customerReducer.errorMessage,
    businessInfo: state.businessReducer.selectedBusiness,
    selectedCountryStates: state.customerReducer.selectedCountryStates,
    selectedCountryStatesForShipping: state.customerReducer.selectedCountryStatesForShipping,
    addVendorState: state.addVendor,
    updateVendorState: state.updateVendor
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(CustomerActions, dispatch),
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    },
    addVendor: (vendorInput) => {
      dispatch(addVendor(vendorInput))
    },
    updateVendor: (vendorInput, id) => {
      dispatch(updateVendor(vendorInput, id))
    }
  };
};


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(VendorForm)))
