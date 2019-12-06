import React, { Component } from 'react'
import { connect } from 'react-redux';
import SelectBox from '../../utils/formWrapper/SelectBox';

class StateWrapper extends Component {
  handleChange = (item) => {
    let value = '';
    if (item && item.id) {
      value = item.id;
    }
    this.props.handleText({ target: { name: 'state', value } });
  };

  render() {
    return (
      <SelectBox
        placeholder="Select a province/state"
        valueKey={"id"}
        labelKey={"name"}
        className="h-100 select-40"
        disabled={this.props.disabled}
        required={this.props.required}
        value={this.props.selectedState}
        onChange={this.handleChange}
        options={this.props.options || this.props.selectedCountryStates}
        isClearable={false}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCountryStatesForShipping: state.customerReducer.selectedCountryStatesForShipping,
    selectedCountryStates: state.customerReducer.selectedCountryStates
  }
};


export default connect(mapStateToProps)(StateWrapper)
