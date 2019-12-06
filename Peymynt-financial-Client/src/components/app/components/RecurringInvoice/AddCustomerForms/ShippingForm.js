import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Form, FormGroup, Input, Label, } from "reactstrap";
import { initialCustomerObject } from '../../sales/components/customer/customerSupportFile/constant';

class ShippingForm extends Component {
    state = {
        sameBilling: true,
        customerModel: initialCustomerObject(),
        countries: [],
        currencies: [],
        statesOptions: []
    };

    // componentDidMount() {
    //     const { isEditMode, selectedCustomer, businessInfo } = this.props
    //     document.title = businessInfo && businessInfo.organizationName ? `Peymynt-${businessInfo.organizationName}-Customers` : `Peymynt-Customers`;
    //     const onSelect = isEditMode ? selectedCustomer : null
    //     const formatedData = initialCustomerObject(onSelect, isEditMode, businessInfo);
    //     this.setState({ customerModel: formatedData });
    //     this.fetchFormData()
    // }
    // componentDidUpdate(prevProps) {
    //     const { isEditMode, selectedCustomer, businessInfo } = this.props
    //     if (prevProps.selectedCustomer != selectedCustomer) {
    //         const onSelect = isEditMode ? selectedCustomer : null
    //         const formatedData = initialCustomerObject(onSelect, isEditMode, businessInfo)
    //         this.setState({ customerModel: formatedData })
    //         this.fetchFormData()
    //     }
    // }

    // fetchFormData = async () => {
    //     const countries = (await fetchCountries()).countries;
    //     const currencies = await CustomerActions.fetchCurrencies()
    //     this.setState({ countries, currencies, shippingCountries: countries })
    // }

    // fetchStates = async (id) => {
    //     const statesList = await fetchStatesByCountryId(id);
    //     // CustomerActions.setCountrytStates(statesList);
    //     CustomerActions.setCountrytStates(statesList);
    //     console.log('statesList', statesList)
    //     this.setState({ statesOptions: statesList.states })
    // }

    // renderCurrencyOptions = () => {
    //     let countries = this.state.currencies;
    //     let currencies = countries.map(country => { return country.currencies[0] });
    //     currencies = orderBy(uniqBy(currencies, "code"), "code", "asc");
    //     return currencies.map((item, i) => {
    //         return (<option key={i} value={item.code}>
    //             {item.displayName}
    //         </option>)
    //     })
    // }

    setCountries = (countries) => {
        return countries && countries.length ? countries.map((item, i) => {
            return <option key={i} value={item.id}> {item.name}</option>
        }) : <option key={-1} value={0}> {'None'}</option>
    };

    setCountryStates = (countryStates) => {
      console.log("setCountryStates", countryStates);
        return countryStates && countryStates.length > 0 ? countryStates.map((item, i) => {
            return <option key={i} value={item.id}>{item.name}</option>
        }) : <option key={-1} value={0} disabled>{"None"}</option>;
    };

    // mapWithCountry = id => {
    //     let countries = this.state.countries;
    //     if (countries && countries.length > 0) {
    //         // let currencies = countries.map(country => { return country.currencies[0]});
    //         let countryObject = find(countries, { 'id': parseInt(id) });
    //         let countryObj = {
    //             name: countryObject.name,
    //             id: countryObject.id,
    //             sortname: countryObject.sortname ? countryObject.sortname : ''
    //         }
    //         // await CustomerActions.setCountry(countryObj);
    //         // await this.fetchStates(countryObj.id);
    //         return countryObj;
    //     }
    //     return {};
    // }

    // mapWithStates = (id, addressType) => {
    //     let countryStates = (addressType === 'shipping') ?
    //         this.props.selectedCountryStatesForShipping : this.props.selectedCountryStates;
    //     if (countryStates && countryStates.length > 0) {
    //         let stateObject = find(countryStates, { 'id': id });
    //         if (stateObject) {
    //             let countryObj = {
    //                 name: stateObject.name,
    //                 id: stateObject.id,
    //                 country_id: stateObject.country_id
    //             }
    //         }
    //         return stateObject;
    //     }
    //     return {};
    // }

    // mapCurrencyWithCurrency = id => {
    //     const countries = this.state.currencies;
    //     let currencies = countries.map(country => { return country.currencies[0] });
    //     const currencyObject = find(currencies, { 'code': id });
    //     let selectedCountryCurrency = {
    //         name: currencyObject.name,
    //         code: currencyObject.code,
    //         symbol: currencyObject.symbol,
    //         displayName: currencyObject.displayName
    //     }
    //     return selectedCountryCurrency
    // }

    // handleText = async (event, type) => {
    //     const { name, value } = event.target;
    //     console.log('tyoe', type);

    //     if(name === 'country'){
    //         let setValue = this.mapWithCountry(value);
    //         await this.fetchStates(value);
    //         this.setState({
    //             customerModel: {
    //                 ...this.state.customerModel,
    //                 addressShipping: {
    //                     ...this.state.customerModel.addressShipping, [name]: setValue
    //                 }
    //             }
    //         });
    //     }else if (name === 'state') {
    //         let setValue = this.mapWithStates(value, 'billing');
    //         this.setState({
    //             customerModel: {
    //                 ...this.state.customerModel,
    //                 addressShipping: {
    //                     ...this.state.customerModel.addressShipping, [name]: setValue
    //                 }
    //             }
    //         });
    //     }else if (name === 'currency') {
    //         // let states = await CustomerActions.fetchStatesByCountryId(value);
    //         console.log(" currency: => " + name + ":", value);
    //         const setValue = this.mapCurrencyWithCurrency(value)
    //         this.setState({
    //             customerModel: { ...this.state.customerModel, [name]: setValue }
    //         });
    //     }else if (name === 'city' ||
    //     name === 'addressLine1' || name === 'addressLine2' || name === 'postal') {
    //     this.setState({
    //         customerModel: {
    //             ...this.state.customerModel,
    //             addressShipping: {
    //                 ...this.state.customerModel.addressShipping, [name]: value
    //             }
    //         }
    //     });
    // }
    // }

    _handleIsShip(e){
        this.setState({
            sameBilling: !this.state.sameBilling
        });
        this.props.handleText(e)
    }
  render() {
      const { sameBilling } = this.state;

    return (
      <div>
        <p className="headingsAdd">Shipping address</p>
        <Form className="py-form-field--condensed">
            <div className="py-form-field py-form-field--inline" className="mb-30">
                <div className="py-form-field__element">
                <Label check className="py-checkbox">
                    <Input
                        type="checkbox"
                        checked={!this.props.customerModel.isShipping}
                        name="isShipping"
                        onChange={e => this.props.handleText(e)}
                    />{' '}
                    <span className="py-form__element__faux"></span>
                    <span className="py-form__element__label">Same as billing address</span>
                </Label>
                </div>
            </div>
            {
                this.props.customerModel.isShipping ?
                (   <Fragment>
                        <div className="py-form-field py-form-field--inline">
                            <label className="py-form-field__label">Ship to Contact </label>
                            <div className="py-form-field__element">
                                <Input
                                    type="text"
                                    value={this.props.customerModel.addressShipping.contactPerson}
                                    name="contactPerson"
                                    onChange={e => this.props.handleText(e, 'addressShipping')}
                                    className="py-form__element__medium"
                                />
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                            <label className="py-form-field__label">Address line 1 </label>
                            <div className="py-form-field__element">
                                <Input
                                    type="text"
                                    value={this.props.customerModel.addressShipping.addressLine1}
                                    name="addressLine1"
                                    onChange={e => this.props.handleText(e, 'addressShipping')}
                                    className="py-form__element__medium"
                                />
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">

                            <label className="py-form-field__label">Address line 2 </label>
                            <div className="py-form-field__element">
                                <Input
                                    type="text"
                                    value={this.props.customerModel.addressShipping.addressLine2}
                                    name="addressLine2"
                                    onChange={e => this.props.handleText(e, 'addressShipping')}
                                    className="py-form__element__medium"
                                />
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">

                            <label className="py-form-field__label">City </label>
                            <div className="py-form-field__element">
                                <Input
                                    type="text"
                                    value={this.props.customerModel.addressShipping.city}
                                    name="city"
                                    onChange={e => this.props.handleText(e, 'addressShipping')}
                                    className="py-form__element__medium"
                                />
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                            <label className="py-form-field__label">Postal/ZIP code </label>
                            <div className="py-form-field__element">
                                <Input
                                    type="text"
                                    value={this.props.customerModel.addressShipping.postal}
                                    name="postal"
                                    onChange={e => this.props.handleText(e, 'addressShipping')}
                                    className="py-form__element__medium"
                                />
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                            <label className="py-form-field__label">Country </label>
                            <div className="py-form-field__element">
                                <div className="py-select--native">
                                <Input
                                    type="select"
                                    name="country"
                                    className="py-form__element"
                                    value={this.props.customerModel.addressShipping.country.id}
                                    onChange={e => this.props.handleText(e, 'addressShipping')}>
                                    <option key={-1} value={""}>{'Select a country'}</option>
                                    {this.setCountries(this.props.countryMenus)}
                                </Input>
                                </div>
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                            <label className="py-form-field__label">Province/State </label>
                            <div className="py-form-field__element">
                                <div className="py-select--native">
                                    <Input
                                        type="select"
                                        name="state"
                                        className="py-form__element"
                                        value={!!this.props.customerModel.addressShipping && this.props.customerModel.addressShipping.state && this.props.customerModel.addressShipping.state.id && this.props.customerModel.addressShipping.state.id}
                                        onChange={e => this.props.handleText(e, 'addressShipping')}>
                                        <option key={-5} value={""}>{'Select a province/state'}</option>
                                        {this.setCountryStates(this.props.selectedCountryStates)}
                                    </Input>
                                </div>
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                            <label className="py-form-field__label">Delivery Instructions </label>
                            <div className="py-form-field__element">
                                <Input
                                    type="textarea"
                                    value={this.props.customerModel.addressShipping.deliveryNotes}
                                    name="deliveryNotes"
                                    onChange={e => this.props.handleText(e, 'addressShipping')}
                                    className="py-form__element__medium"
                                />
                            </div>
                        </div>
                    </Fragment>

                )
                : ''
            }
        </Form>
      </div>
    )
  }
}


const mapStateToProps = state => {
    return {
        selectedCountry: state.customerReducer.selectedCountry,
        // selectedCountryStates: state.customerReducer.selectedCountryStates
    }
};

export default connect(mapStateToProps, null)(ShippingForm)
