import React, { Component } from 'react'
import {
    Col,
    Button,
    Form,
    FormGroup,
    Input,
    FormText,
  } from "reactstrap";
import classnames from 'classnames';
import { find, orderBy, uniqBy, cloneDeep } from 'lodash';
export default class ContactForm extends Component {

    renderCurrencyOptions = () => {
        let countries = this.props.currencies;
        let currencies = countries.map(country => { return country.currencies[0] });
        currencies = orderBy(uniqBy(currencies, "code"), "code", "asc");
        return currencies.map((item, i) => {
            return (<option key={i} value={item.code}>
                {item.displayName}
            </option>)
        })
    }
  render() {
    return (
      <div>
        <Form className="py-form-field--condensed">
            <FormGroup row>
                <label className="col-md-5 pr-0 text-right">Customer  <span className="text-danger">*</span> </label>               
                <Col md={6}>
                <Input
                    type="text"
                    value={this.props.customerModel.customerName}
                    name="customerName"
                    className={!this.props.customerModel.customerName ? "err color-red feild-height" : "feild-height"}
                    onChange={this.props.handleText}
                />
                {!this.props.customerModel.customerName ? <FormText className="color-red">Please enter a customer name!</FormText> : ""}
                </Col>
            </FormGroup>
            <FormGroup row>

                <label className="col-md-5 pr-0 text-right">Email </label>
                <Col md={6}>
                <Input
                    type="email"
                    // value={''}
                    value={this.props.customerModel.email}
                    name="email"
                    onChange={this.props.handleText}
                    className="feild-height"
                />
                </Col>
            </FormGroup>
            <FormGroup row>

                <label className="col-md-5 pr-0 text-right">Phone </label>
                <Col md={6}>
                <Input
                    type="text"
                    // value={''}
                    value={this.props.customerModel.communication.phone}
                    name="phone"
                    onChange={this.props.handleText}
                    className="feild-height"
                />
                </Col>
            </FormGroup>
            <FormGroup row>

                <label className="col-md-5 pr-0 text-right">First Name </label>
                <Col md={6}>
                <Input
                    type="text"
                    value={this.props.customerModel.firstName}
                    // value={''}
                    name="firstName"
                    // placeholder="First Name"
                    onChange={this.props.handleText}
                    className="feild-height input-placeholder"
                />
                </Col>
            </FormGroup>
            <FormGroup row>
                <label className="col-md-5 pr-0 text-right">Last Name </label>
                <Col md={6}>
                <Input
                    type="text"
                    // value={''}
                    name="lastName"
                    value={this.props.customerModel.lastName}
                    // placeholder="Last Name"
                    onChange={this.props.handleText}
                    className="feild-height input-placeholder"
                />
                </Col>
            </FormGroup>
        </Form>
      </div>
    )
  }
}
