import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Col, FormGroup, Input, Label } from "reactstrap";
import { fetchStatesByCountryId } from "../../../../../../../api/CustomerServices";

class BillingAddress extends React.Component {
  state = {
    statesOptions: []
  };

  componentDidMount() {
    const { country } = this.props.addressBilling;
    this.fetchStates(country.id);
  }

  componentDidUpdate(prevProps) {
    const { addressBilling } = this.props;
    const oldAddressBilling = prevProps.addressBilling;
    if (addressBilling != oldAddressBilling) {
      if (addressBilling.country != oldAddressBilling.country) {
        this.fetchStates(addressBilling.country.id);
      }
    }
  }

  fetchStates = async id => {
    const statesList = await fetchStatesByCountryId(id);
    this.setState({ statesOptions: statesList.states });
  };

  render() {
    const { addressBilling, handleText, countryMenus } = this.props;
    const statesOptions = this.state.statesOptions;
    return (
      <Fragment>
        <div className="py-form-field py-form-field--inline">
          <Label for="exampleEmail" className="py-form-field__label">
            Address line 1
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              className="py-form__element__medium"
              name="addressLine1"
              value={addressBilling.addressLine1}
              onChange={handleText}
            />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label for="exampleEmail" className="py-form-field__label">
            Address line 2
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              className="py-form__element__medium"
              name="addressLine2"
              value={addressBilling.addressLine2}
              onChange={handleText}
            />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label"
          >
            City
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="city"
              className="py-form__element__medium"
              value={addressBilling.city}
              onChange={handleText}
            />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label"
          >
            Postal/Zip code
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="postal"
              className="py-form__element__medium"
              value={addressBilling.postal}
              onChange={handleText}
            />
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label for="exampleEmail" className="py-form-field__label">
            Country
          </Label>
          <div className="py-form-field__element">
            <div className="py-select--native">
              <Input
                type="select"
                name="country"
                className="py-form__element"
                // value={this.state.customerModel.currency.code}
                value={addressBilling.country.id}
                onChange={handleText}
                placeholder="Select a country"
              >
                <option key={-1} value={""}>
                  {"Select a country"}
                </option>
                {setCountries(countryMenus)}
              </Input>
            </div>
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label for="exampleEmail" className="py-form-field__label">
            Province/State
          </Label>
          <div className="py-form-field__element">
          <div className="py-select--native">
            <Input
              type="select"
              name="state"
              className="py-form__element"
              value={addressBilling.state.id}
              onChange={handleText}
              placeholder={'Select a provinence/state'}
            >
              <option key={-1} value={""}>
                {'Select a provinence/state'}
              </option>
              {setCountryStates(statesOptions)}
            </Input>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const setCountries = countries => {
  return countries && countries.length ? (
    countries.map((item, i) => {
      return (
        <option key={i} value={item.id}>
          {" "}
          {item.name}
        </option>
      );
    })
  ) : (
    <option key={-1} value={0}>
      {" "}
      {"None"}
    </option>
  );
};

const setCountryStates = countryStates => {
  return countryStates && countryStates.length > 0 ? (
    countryStates.map((item, i) => {
      return (
        <option key={i} value={item.id}>
          {item.name}
        </option>
      );
    })
  ) : (
    <option key={-1} value={0} disabled>
      {"None"}
    </option>
  );
};

const mapStateToProps = state => {
  return {
    selectedCountry: state.customerReducer.selectedCountry,
    selectedCountryStates: state.customerReducer.selectedCountryStates
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(BillingAddress)
);
