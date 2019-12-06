import React, { Component } from 'react'
import SelectBox from "utils/formWrapper/SelectBox";
import { fetchCountries } from '../../api/globalServices';

export default class CountryWrapper extends Component {
  state = {
    countries: []
  };

  componentDidMount() {
    this.fetchFormData()
  }

  fetchFormData = async () => {
    const countries = (await fetchCountries()).countries;
    this.setState({ countries, shippingCountries: countries })
  };

  handleChange = (item) => {
    let value = '';
    if (item && item.id) {
      value = item.id;
    }
    this.props.handleText({ target: { name: 'country', value } });
  };

  render() {
    return (
      <SelectBox
        placeholder="Select a country"
        valueKey={"id"}
        labelKey={"name"}
        className="h-100 select-40"
        disabled={this.props.disabled}
        value={this.props.selectedCountry}
        onChange={this.handleChange}
        options={this.state.countries}
        isClearable={false}
      />
    )
  }
}
