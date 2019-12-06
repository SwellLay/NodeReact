import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Col, FormGroup, Input, Label, FormText } from "reactstrap";
import { fetchStatesByCountryId } from "../../../../../../../api/globalServices";
import { changePhoneFormate } from "../../../../../../../utils/GlobalFunctions";

class ShippingAddress extends React.Component {
  state = {
    statesOptions: []
  };

  componentDidMount() {
    const { country } = this.props.addressShipping;
    this.fetchStates(country.id);
  }

  componentDidUpdate(prevProps) {
    const { addressShipping } = this.props;
    const oldAddressShipping = prevProps.addressShipping;
    if (addressShipping != oldAddressShipping) {
      if (addressShipping.country != oldAddressShipping.country) {
        this.fetchStates(addressShipping.country.id);
      }
    }
  }

  fetchStates = async id => {
    console.log("dfsdfgdgfdd==========>", id);
    const statesList = await fetchStatesByCountryId(id);
    this.setState({ statesOptions: statesList.states });
  };

  render() {
    const { addressShipping, handleText, countryMenus } = this.props;
    const statesOptions = this.state.statesOptions;
    return (
      <Fragment>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label is-required"
          >
            Ship to contact
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="contactPerson"
              value={addressShipping.contactPerson}
              onChange={e => handleText(e, "addressShipping")}
              className={!addressShipping.contactPerson ? "text-danger py-form__element__medium" : "py-form__element__medium"}
              required
            />
            {!addressShipping.contactPerson ? <div className="py-text--small text-danger">This field is required.</div> : ""}
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label"
          >
            Country
          </Label>
          <div className="py-form-field__element">
          <div className="py-select--native">
            <Input
              type="select"
              name="country"
              className="py-form__element"
              value={addressShipping.country.id}
              onChange={e => handleText(e, "addressShipping")}
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
          <Label
            for="exampleEmail"
            className="py-form-field__label"
          >
            Province/State
          </Label>
          <div className="py-form-field__element">
            <div className="py-select--native">
            <Input
              type="select"
              name="state"
              className="py-form__element"
              value={parseInt(addressShipping.state.id)}
              onChange={e => handleText(e, "addressShipping")}
            >
              <option key={-1} value={""}>
                {"Select a provinence/state"}
              </option>
              {setCountryStates(statesOptions)}
            </Input>
            </div>
          </div>
        </div>

        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label"
          >
            Address line 1
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="addressLine1"
              className="py-form__element__medium"
              value={addressShipping.addressLine1}
              onChange={e => handleText(e, "addressShipping")}
            />
          </div>
        </div>

        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label"
          >
            Address line 2
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="addressLine2"
              className="py-form__element__medium"
              value={addressShipping.addressLine2}
              onChange={e => handleText(e, "addressShipping")}
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
              value={addressShipping.city}
              onChange={e => handleText(e, "addressShipping")}
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
              value={addressShipping.postal}
              className="py-form__element__medium"
              onChange={e => handleText(e, "addressShipping")}
            />
          </div>
        </div>

        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label"
          >
            Phone
          </Label>
          <div className="py-form-field__element">
            <Input
              type="text"
              name="phone"
              className="py-form__element__medium"
              value={changePhoneFormate(addressShipping.phone)}
              onChange={e => handleText(e, "addressShipping")}
            />
          </div>
        </div>

        <div className="py-form-field py-form-field--inline">
          <Label
            for="exampleEmail"
            className="py-form-field__label"
          >
            Delivery instructions
          </Label>
          <div className="py-form-field__element">
            <textarea
              type="text"
              rows="10"
              name="deliveryNotes"
              className="form-control py-form__element__medium"
              value={addressShipping.deliveryNotes}
              onChange={e => handleText(e, "addressShipping")}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCountry: state.customerReducer.selectedCountry,
    selectedCountryStates:
      state.customerReducer.selectedCountryStatesForShipping
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    null
  )(ShippingAddress)
);

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
  return countryStates && countryStates.length ? (
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
