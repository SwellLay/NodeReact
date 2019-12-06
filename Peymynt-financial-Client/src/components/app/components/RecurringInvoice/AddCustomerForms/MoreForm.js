import React, { Component } from 'react'
import {
    Col,
    Button,
    Form,
    FormGroup,
    Input,
    FormFeedback,
  } from "reactstrap";
import classnames from 'classnames';
import { initialCustomerObject } from '../../sales/components/customer/customerSupportFile/constant';
import { fetchCountries } from '../../../../../api/globalServices';
import {fetchStatesByCountryId} from "../../../../../api/CustomerServices";
import { find, orderBy, uniqBy, cloneDeep } from 'lodash';
import * as CustomerActions from '../../../../../actions/CustomerActions';
import { connect } from 'react-redux';

export default class MoreForm extends Component {
    state={
        customerModel: initialCustomerObject(),
        countries: [],
        currencies: [],
        statesOptions: []
    }

    componentDidMount() {
        const { isEditMode, selectedCustomer, businessInfo } = this.props
        document.title = businessInfo && businessInfo.organizationName ? `Peymynt-${businessInfo.organizationName}-Customers` : `Peymynt-Customers`;
        const onSelect = isEditMode ? selectedCustomer : null
        const formatedData = initialCustomerObject(onSelect, isEditMode, businessInfo);
        this.setState({ customerModel: formatedData });
        this.fetchFormData()
    }
    componentDidUpdate(prevProps) {
        const { isEditMode, selectedCustomer, businessInfo } = this.props
        if (prevProps.selectedCustomer != selectedCustomer) {
            const onSelect = isEditMode ? selectedCustomer : null
            const formatedData = initialCustomerObject(onSelect, isEditMode, businessInfo)
            this.setState({ customerModel: formatedData })
            this.fetchFormData()
        }
    }

    fetchFormData = async () => {
        const countries = (await fetchCountries()).countries;
        const currencies = await CustomerActions.fetchCurrencies()
        this.setState({ countries, currencies, shippingCountries: countries })
    }

    handleText(e){
        const {name, value} = e.target;
        this.setState({
            customerModel: {
                ...this.state.customerModel,
                communication: {
                    ...this.state.customerModel.communication, [name]: value
                }
            }
        })
    }
  render() {
    return (
      <div>
        <Form className="py-form-field--condensed">
            <div className="py-form-field py-form-field--inline">

                <label className="py-form-field__label">Account Number </label>
                <div className="py-form-field__element">
                <Input
                    type="text"
                    value={this.props.customerModel.communication.accountNumber}
                    name="accountNumber"
                    onChange={this.props.handleText}
                    className="py-form__element__medium"
                />
                </div>
            </div>
            <div className="py-form-field py-form-field--inline">

                <label className="py-form-field__label">Fax </label>
                <div className="py-form-field__element">
                <Input
                    type="text"
                    value={this.props.customerModel.communication.fax}
                    name="fax"
                    onChange={this.props.handleText}
                    className="py-form__element__medium"
                />
                </div>
            </div>
            <div className="py-form-field py-form-field--inline">
                <label className="py-form-field__label">Mobile </label>
                <div className="py-form-field__element">
                <Input
                    type="text"
                    value={this.props.customerModel.communication.mobile}
                    name="mobile"
                    onChange={this.props.handleText}
                    className="py-form__element__medium"
                />
                </div>
            </div>
            <div className="py-form-field py-form-field--inline">

                <label className="py-form-field__label">Toll-Free </label>
                <div className="py-form-field__element">
                <Input
                    type="text"
                    value={this.props.customerModel.communication.tollFree}
                    name="tollFree"
                    onChange={this.props.handleText}
                    className="py-form__element__medium"
                />
                </div>
            </div>
            <div className="py-form-field py-form-field--inline">

                <label className="py-form-field__label">Website </label>
                <div className="py-form-field__element">
                <Input
                    type="text"
                    value={this.props.customerModel.communication.website}
                    name="website"
                    onChange={this.props.handleText}
                    className="py-form__element__medium"
                />
                </div>
            </div>
            {/* <div className="py-form-field py-form-field--inline">

                <label className="py-form-field__label">Internal Notes </label>
                <div className="py-form-field__element">
                <Input
                    type="textarea"
                    // value={this.state.customerModel.communication.internalNotes}
                    name="internalNotes"
                    onChange={this.props.handleText}
                    className="py-form__element__medium"
                />
                </div>
            </div> */}
        </Form>
      </div>
    )
  }
}