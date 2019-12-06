import { orderBy, uniqBy } from 'lodash';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Input } from 'reactstrap';
import { bindActionCreators } from 'redux'
import * as CustomerActions from '../../actions/CustomerActions';
import { fetchCountries } from '../../api/globalServices';

class CurrencyWrapper extends Component {

  state = {
    currencies: []
  };

  componentDidMount() {
    const { businessInfo } = this.props;
    this.fetchFormData()
  }

  fetchFormData = async () => {
    const countries = (await fetchCountries()).countries;

    const currencies = await CustomerActions.fetchCurrencies();
    this.setState({ currencies })
  };

  renderCurrencyOptions = () => {
    let countries = this.state.currencies;
    let currencies = countries.map(country => {
      return country.currencies[0]
    });
    currencies = orderBy(uniqBy(currencies, "code"), "code", "asc");
    return currencies.map((item, i) => {
      return (<option key={i} value={item.code}>
        {item.displayName}
      </option>)
    })
  };

  render() {
    return (
      <div className="py-select--native">
        <Input
          type="select"
          name="currency"
          className="py-form__element"
          value={this.props.selectedCurrency.code || this.props.businessInfo.currency.code}
          disabled={this.props.disabled}
          onChange={this.props.handleText}
          placeholder="Select a currency"
        >
          {this.renderCurrencyOptions()}
        </Input>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCustomer: state.customerReducer.selectedCustomer,
    countryCurrencyList: state.customerReducer.countryCurrencyList,
    businessInfo: state.businessReducer.selectedBusiness,
    selectedCountryStates: state.customerReducer.selectedCountryStates,
    selectedCountryStatesForShipping: state.customerReducer.selectedCountryStatesForShipping
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(CustomerActions, dispatch),
  };
};


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(CurrencyWrapper)))
