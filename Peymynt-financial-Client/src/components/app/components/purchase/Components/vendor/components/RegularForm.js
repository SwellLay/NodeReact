import classNames from 'classnames';
import CountryWrapper from 'global/CountryWrapper';
import CurrencyWrapper from 'global/CurrencyWrapper';
import StateWrapper from 'global/StateWrapper';
import React, { Component, Fragment } from 'react'
import { Input, Label } from 'reactstrap';

export default class RegularForm extends Component {
  state = {
    regularMore: false
  };

  render() {
    const { regularMore } = this.state;
    const { vendorInput: { communication, contractor: { contractorType }, currency, firstName, lastName, email, country, address: { addressLine1, addressLine2, city, postal, state } = {}, vendorType = "regular" }, otherCountries, errors = {} } = this.props;
    return (
      <Fragment>
        {otherCountries ? (
            <div className="py-form-field py-form-field--inline">
              <Label
                for="exampleEmail"
                className="py-form-field__label is-required">
                Email
              </Label>
              <div className="py-form-field__element">
                <Input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={this.props.handleText}
                  // maxLength={300}
                />
              </div>
            </div>
          )
          : null}

        {vendorType === 'contractor' && contractorType === 'business' ? null : (
          <Fragment>
            <div className="py-form-field py-form-field--inline">
              <Label
                for="exampleEmail"
                className={classNames({ "py-form-field__label": true, 'is-required': vendorType === 'contractor' })}>
                First name
              </Label>
              <div className="py-form-field__element">
                <Input
                  type="text"
                  name="firstName"
                  placeholder={vendorType === 'contractor' || otherCountries ? '' : ''}
                  required={vendorType === 'contractor' || otherCountries}
                  value={firstName}
                  onChange={this.props.handleText}
                  // maxLength={300}
                />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label
                for="exampleEmail"
                className={classNames({ "py-form-field__label": true, 'is-required': vendorType === 'contractor' })}>
                Last name
              </Label>
              <div className="py-form-field__element">
                <Input
                  type="text"
                  name="lastName"
                  placeholder={vendorType === 'contractor' || otherCountries ? '' : ''}
                  required={vendorType === 'contractor' || otherCountries}
                  value={lastName}
                  onChange={this.props.handleText}
                  // maxLength={300}
                />
              </div>
            </div>
          </Fragment>
        )}
        <div className="py-form-field py-form-field--inline"
          style={vendorType === "contractor" ? { display: 'none' } : {}}>
          <Label
            for="exampleEmail"
            className="py-form-field__label">
            Currency{" "}
          </Label>
          <div className="py-form-field__element">
            <CurrencyWrapper disabled={vendorType === "contractor"} handleText={(e) => this.props.handleText(e)}
              selectedCurrency={currency || {}} />
          </div>
        </div>
        {!otherCountries ? (
            <div className="py-form-field py-form-field--inline">
              <Label
                for="exampleEmail"
                className={classNames({ "py-form-field__label": true, 'is-required': vendorType === 'contractor' })}>
                Email
              </Label>
              <div className="py-form-field__element">
                <Input
                  type="email"
                  name="email"
                  placeholder={vendorType === 'contractor' ? '' : ''}
                  required={vendorType === 'contractor'}
                  value={email}
                  onChange={this.props.handleText}
                  // maxLength={300}
                />
              </div>
            </div>
          )
          : null}
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label">
            Country
          </Label>
          <div className="py-form-field__element">
            <CountryWrapper addBlank disabled={vendorType === "contractor"} handleText={(e) => this.props.handleText(e)}
              selectedCountry={country} />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className={classNames({ "py-form-field__label": true, 'is-required': vendorType === 'contractor' })}>
            Province/State
          </Label>
          <div className="py-form-field__element">
            <StateWrapper required={vendorType === 'contractor'} addBlank handleText={(e) => this.props.handleText(e)}
              selectedState={state} />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className={classNames({ "py-form-field__label": true, 'is-required': vendorType === 'contractor' })}>
            Address line 1
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="addressLine1"
              placeholder={vendorType === 'contractor' || otherCountries ? '' : ''}
              required={vendorType === 'contractor' || otherCountries}
              value={addressLine1}
              onChange={this.props.handleText}
              // maxLength={300}
            />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label">
            Address line 2
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="addressLine2"
              placeholder={otherCountries ? '' : ''}
              value={addressLine2}
              required={otherCountries}
              onChange={this.props.handleText}
              // maxLength={300}
            />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className={classNames({ "py-form-field__label": true, 'is-required': vendorType === 'contractor' })}>
            City
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="city"
              placeholder={vendorType === 'contractor' || otherCountries ? '' : ''}
              required={vendorType === 'contractor' || otherCountries}
              value={city}
              onChange={this.props.handleText}
              // maxLength={300}
            />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className={classNames({ "py-form-field__label": true, 'is-required': vendorType === 'contractor' })}>
            Postal/Zip code
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="postal"
              placeholder={vendorType === 'contractor' || otherCountries ? '' : ''}
              required={vendorType === 'contractor' || otherCountries}
              value={postal}
              className={errors.postal && "has-errors"}
              onChange={this.props.handleText}
              // maxLength={300}
            />
            <br />
            {errors.postal && (<span className="input-error-text">{errors.postal}</span>)}
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label">
          </Label>
          <div className="py-form-field__element">
            <a className="py-text--link" href="javascript:void(0)"
              onClick={() => this.setState({ regularMore: !this.state.regularMore })}>
              Enter additional information (optional)
            </a>
          </div>
        </div>
        {
          regularMore ?
            (<Fragment>
              <div className="py-form-field py-form-field--inline">
                <Label
                  for="exampleEmail"
                  className="py-form-field__label">
                  Account number
                </Label>
                <div className="py-form-field__element">
                  <Input
                    type="text"
                    name="accountNumber"
                    // value={communication.accountNumber}
                    // onChange={this.props.handleText}
                    // maxLength={300}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <Label
                  for="exampleEmail"
                  className="py-form-field__label">
                  Phone
                </Label>
                <div className="py-form-field__element">
                  <Input
                    type="text"
                    name="phone"
                    value={communication.phone}
                    onChange={this.props.handleText}
                    // maxLength={300}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <Label
                  for="exampleEmail"
                  className="py-form-field__label">
                  Fax
                </Label>
                <div className="py-form-field__element">
                  <Input
                    type="text"
                    name="fax"
                    value={communication.fax}
                    onChange={this.props.handleText}
                    // maxLength={300}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <Label
                  for="exampleEmail"
                  className="py-form-field__label">
                  Mobile
                </Label>
                <div className="py-form-field__element">
                  <Input
                    type="text"
                    name="mobile"
                    value={communication.mobile}
                    onChange={this.props.handleText}
                    // maxLength={300}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <Label
                  for="exampleEmail"
                  className="py-form-field__label">
                  Toll free
                </Label>
                <div className="py-form-field__element">
                  <Input
                    type="text"
                    name="tollFree"
                    value={communication.tollFree}
                    onChange={this.props.handleText}
                    // maxLength={300}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <Label
                  for="exampleEmail"
                  className="py-form-field__label">
                  Website
                </Label>
                <div className="py-form-field__element">
                  <Input
                    type="url"
                    name="website"
                    value={communication.website}
                    onChange={this.props.handleText}
                    // maxLength={300}
                  />
                </div>
              </div>
            </Fragment>)
            : ""
        }
        {vendorType === 'contractor' ? (
          <div className="py-form-field py-form-field--inline">
            <Label
              for="exampleEmail"
              className="py-form-field__label">
              Direct Deposit payment
            </Label>
            <div className="py-form-field__element check-group-container">
              <span>After saving the contractor information you will be able to add bank details on the vendors list.</span>
            </div>
          </div>
        ) : null}
      </Fragment>
    )
  }
}
