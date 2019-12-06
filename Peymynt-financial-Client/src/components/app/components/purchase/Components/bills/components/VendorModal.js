import { fetchCurrencies } from 'actions/CustomerActions';
import CurrencyWrapper from 'global/CurrencyWrapper';
import { cloneDeep, set } from 'lodash';
import React, { Component, Fragment } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { fetchStatesByCountryId } from '../../../../../../../api/CustomerServices';
import { fetchCountries } from '../../../../../../../api/globalServices';
import CountryWrapper from '../../../../../../../global/CountryWrapper';
import StateWrapper from '../../../../../../../global/StateWrapper';

class VendorModal extends Component {
  state = {
    data: {},
    currencies: [],
    countries: [],
    states: [],
    additionalInformation: false,
    errors: {
      vendorName: '',
    },
  };

  componentWillReceiveProps(props) {
    if (!this.state.data.currencyId || !this.state.data.currency || !this.state.data.currency.code) {
      this.handleCurrency({ target: { value: props.currency.code || '' } })
    }
  }

  componentDidMount() {
    this.loadInitialData();
  }

  loadInitialData = async () => {
    const [currencies, countries] = await Promise.all([this.fetchCurrencies(), this.fetchCountries()]);

    this.setState({ currencies, countries });
  };

  fetchCurrencies = async () => {
    const countries = await fetchCurrencies();
    return countries.map(c => c.currencies[0]);
  };

  fetchCountries = async () => {
    const { countries } = await fetchCountries();
    return countries;
  };

  fetchStates = async (id) => {
    const { states } = await fetchStatesByCountryId(id);
    this.setState({ states });
  };

  close = () => {
    this.setState({ data: {}, additionalInformation: false });
    this.props.onClose();
  };

  toggleAdditionalInformation = () => {
    this.setState({ additionalInformation: !this.state.additionalInformation });
  };

  handleChange = ({ target: { name, value } = {} } = {}) => {
    const data = cloneDeep(this.state.data);
    set(data, name, value);
    this.setState({ data });
  };

  handleCountry = ({ target: { value } = {} } = {}) => {
    const data = cloneDeep(this.state.data);
    set(data, 'countryId', value);
    const country = this.state.countries.find(r => r.id.toString() === value.toString());
    if (!country) {
      return;
    }
    set(data, 'country', { name: country.name, id: country.id });
    this.setState({ data }, () => this.fetchStates(country.id));
  };

  handleState = ({ target: { value } = {} } = {}) => {
    const data = cloneDeep(this.state.data);
    set(data, 'stateId', value);
    const state = this.state.states.find(r => r.id.toString() === value.toString());
    set(data, 'state', { name: state.name, id: state.id, countryId: this.state.countryId });
    this.setState({ data });
  };

  handleCurrency = ({ target: { value } = {} } = {}) => {
    const data = cloneDeep(this.state.data);
    set(data, 'currencyId', value);
    const currency = this.state.currencies.find(r => r.code.toString() === value.toString());
    set(data, 'currency', currency);
    this.setState({ data });
  };

  getData = () => {
    const data = cloneDeep(this.state.data);

    data.vendorType = 'regular';
    data.communication = {
      phone: data.phone,
      fax: data.fax,
      mobile: data.mobile,
      tollFree: data.tollFree,
      website: data.website,
    };
    delete data.phone;
    delete data.fax;
    delete data.mobile;
    delete data.tollFree;
    delete data.website;

    data.address = {
      country: data.country,
      state: data.state,
      city: data.city,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      postal: data.postal,
    };

    delete data.countryId;
    delete data.stateId;
    delete data.state;
    delete data.country;
    delete data.addressLine1;
    delete data.addressLine2;
    delete data.postal;
    delete data.city;

    delete data.currencyId;

    return data;
  };

  validateData = (data) => {
    const errors = {};
    if (!data.vendorName || !data.vendorName.trim()) {
      errors.vendorName = "Vendor name should never be empty";
    }
    this.setState({ errors });
    return !Object.keys(errors).length;
  };

  submitForm = (e) => {
    e.preventDefault();

    const payload = this.getData();
    if (!this.validateData(payload)) {
      return;
    }
    this.props.addVendor(payload, this.close);
  };

  renderStateOptions() {
    const options = this.state.states.map(state => (
      <option key={state.id} value={state.id}>{state.name}</option>
    ));

    options.unshift((<option key={-1} value="">Choose</option>));

    return options;
  }

  renderAdditionalInformation() {
    const { data = {}, additionalInformation } = this.state;
    return (
      <Fragment>
        <FormGroup row>
          <Label
            className="text-right"
            md={5}>
          </Label>
          <Col md={7} className="field-container">
            <a href="javascript:void(0)" onClick={this.toggleAdditionalInformation} style={{ fontWeight: 'bold' }}>
              <i className={`fa fa-chevron-${additionalInformation ? 'up' : 'down'}`} />
              &nbsp;
              <span>{additionalInformation ? 'Hide' : 'Add'} additional information</span>
            </a>
          </Col>
        </FormGroup>
        {additionalInformation && (
          <Fragment>
            <FormGroup row>
              <Label
                className="text-right text-muted"

                md={5}>
                Account number
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="accountNumber" value={data.accountNumber}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Address line 1
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="addressLine1" value={data.addressLine1}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Address line 2
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="addressLine2"
                  value={data.addressLine2}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                City
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="city"
                  value={data.city}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                xs={12}
                sm={6}
                md={5}>
                Country
              </Label>
              <Col md={5} className="field-container">
                <CountryWrapper handleText={this.handleCountry}
                  selectedCountry={data.countryId} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                xs={12}
                sm={6}
                md={5}>
                Province/State
              </Label>
              <Col md={5} className="field-container">
                <StateWrapper handleText={this.handleState}
                  selectedState={data.stateId} options={this.state.states} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Postal/Zip code
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="postal"
                  value={data.postal}
                  onChange={this.handleChange} maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Phone
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="phone"
                  value={data.phone}
                  onChange={this.handleChange} maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Fax
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="fax" value={data.fax}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Mobile
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="mobile"
                  value={data.mobile}
                  onChange={this.handleChange} maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Toll free
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="tollFree" value={data.tollFree}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Website
              </Label>
              <Col md={6}>
                <Input
                  type="email"
                  name="website"
                  value={data.website}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
          </Fragment>
        )}
      </Fragment>
    );
  }

  render() {
    const { data, errors } = this.state;
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalHeader toggle={this.close}>Add a Vendor </ModalHeader>
        <ModalBody>
          <Form onSubmit={this.submitForm}>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Vendor name <span className="text-danger">*</span>
              </Label>
              <Col md={6}>
                <Input
                  className={errors.vendorName && "has-errors"}
                  type="text"
                  name="vendorName"
                  value={data.vendorName}
                  onChange={this.handleChange}
                  maxLength={300}
                />
                {errors.vendorName && (<span className="input-error-text">{errors.vendorName}</span>)}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Email
              </Label>
              <Col md={6}>
                <Input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                First name
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="firstName"
                  value={data.firstName}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                md={5}>
                Last name
              </Label>
              <Col md={6}>
                <Input type="text"
                  name="lastName"
                  value={data.lastName}
                  onChange={this.handleChange}
                  maxLength={300}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                className="text-right text-muted"
                xs={12}
                sm={6}
                md={5}>
                Currency{" "}
              </Label>
              <Col xs={12} sm={6} md={5} className="field-container">
                <CurrencyWrapper handleText={this.handleCurrency} selectedCurrency={{ code: data.currencyId }} />
              </Col>
            </FormGroup>
            {this.renderAdditionalInformation()}
          </Form>
        </ModalBody>
        <ModalFooter>
          <FormGroup row>
            <Col md={5} />
            <Col md={7} className="text-right">
              <Button
                type="submit"
                color="grey"
                className="btn btn-accent btn-secondary btn-rounded"
                onClick={this.submitForm}
              >
                Add vendor
              </Button>
              <span className="pdL5 pdR5">or</span>
              <Button
                onClick={this.close}
                className="btn btn-gray btn-rounded"
              >
                Cancel
              </Button>
            </Col>
          </FormGroup>
        </ModalFooter>
      </Modal>
    );
  }
}

export default VendorModal;
