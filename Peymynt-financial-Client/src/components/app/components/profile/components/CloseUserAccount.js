import React, { Component } from 'react'
import { Col, Container, Row, Form, FormGroup, Label, Input } from 'reactstrap';

import * as BusinessAction from "../../../../../actions/businessAction";
import { openGlobalSnackbar } from '../../../../../actions/snackBarAction';
import profileServices from '../../../../../api/profileService';
import LoginService from '../../../../../api/LoginService';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import ConfirmationPopup from './ConfirmationPopup';

class CloseUserAccount extends Component {

    state = {
        reason: '',
        details: '',
        open: false,
        password: ''
    }

    componentDidMount() {
        this.fetchBusiness();
    }

    fetchBusiness = async () => {
        await this.props.actions.fetchBusiness()
    }

    handleText = e => {
        const { name, value } = e.target;
        this.setState({[name]: value})
    }

    handleFormSubmission = async(e) => {
        e.preventDefault();
        this.setState({open: true})
    }

    closeModal = e => {
        this.setState({open: false})
    }

    handleText = e => {
        this.setState({password: e.target.value})
      }

    confirmClose = async(e) => {
        let id = localStorage.getItem('user.id'),
            email = localStorage.getItem('user.email'),
            password= this.state.password

        // console.log("delete")
        if(!!password){
            try{
                let auth = await LoginService.authenticate({email, password});
                if(auth.statusCode === 200){
                    try{
                        await profileServices.deletePass(id);
                        localStorage.clear();
                        this.props.history.push('/')
                    }catch(err){
                        console.log("error in close user account ====>", err)
                        this.props.openGlobalSnackbar("Something went wrong, please try again later.", true)
                    }
                }
            }
            catch (err){
                console.log("error in close user account auth ====>", err)
                this.props.openGlobalSnackbar("Something went wrong, please try again later.", true)
            }
        }else{
            this.props.openGlobalSnackbar("Please enter password.", true    )
        }
    }

  render() {
    const { business, params } = this.props;
    const { open } = this.state
    let id = localStorage.getItem('businessId')
    return (

            <div className="bg-white">
                    <div className="container py-4">
                        

                        <header className="AccountTerminate__Header mb-5 text-center">
                            <div className="mb-3">
                            <img src="/assets/images/logo.png" width="80"/> <span className="logo_heading">Peymynt</span>
                            </div>
                           
                            <h1 className="py-heading--title">Close Your Peymynt Account</h1>
                        </header>
                            <p className="py-text--strong">Are you sure you want to permanently close all of your businesses in peymynt?</p>
                            <p>We’re sorry to see you go. Please note that the action you’re about to take will
                                <a className="text-danger" href="javascript: void(0)"> permanently close all of the following business and personal finance accounts:</a></p>
                            <ul>
                                {
                                    !!business ?
                                        business.length > 0 ?
                                            business.map((item, i) => {
                                                return (<li key={i}>{item.organizationName}</li>)
                                            })
                                        : (<li>No Business..</li>)
                                    : (<li>No Business..</li>)
                                }
                            </ul>
                            <p><b>Closing your account is permanent, and cannot be reversed.</b> If you are looking to close one of your businesses, you can archive it by <a className="py-text--link" href="javascript: void(0)">following these steps instead.</a></p>
                            <Form onSubmit={this.handleFormSubmission.bind(this)}>
                                <FormGroup>
                                    <Label for="companyName" className="py-form-field__label is-required">Reason For Leaving</Label>
                                    <div className="py-form-field">
                                        <div className="py-select--native py-form__element__large">
                                        <select
                                            name="country"
                                            className="form-control py-form__element"
                                            // value={'userInput.address'.country.id}
                                            onChange={(e) => handleText(e)}
                                            >
                                            <option value={"Missing Features"}>
                                                {"Missing Features"}
                                            </option>
                                            <option value={"Customer Support"}>
                                                {"Customer Support"}
                                            </option><option value={"My Business Is Closing"}>
                                                {"My Business Is Closing"}
                                            </option><option value={"Cost of Payroll or Payments"}>
                                                {"Cost of Payroll or Payments"}
                                            </option><option value={"I don't understand how to use Peymynt"}>
                                                {"I don't understand how to use Peymynt"}
                                            </option><option value={"Other"}>
                                                {"Other"}
                                            </option>
                                        </select>
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="details" className="py-form-field__label">Details </Label>
                                    <div className="py-form-field__element">

                                        <textarea
                                            name="details"
                                            rows="5"
                                            className="form-control py-form__element__large"
                                            onChange={this.handleText.bind(this)}
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs={12} sm={8} md={8} lg={8}>
                                        <button type="submit" className="btn btn-danger mr-2">Permanently close all businesses</button>
                                        <NavLink to={`/app/${id}/accounts`} className="py-text--link ml-2">Cancel</NavLink>
                                    </Col>
                                </FormGroup>
                            </Form>
                            <ConfirmationPopup
                                open={open}
                                closeModal={this.closeModal.bind(this)}
                                confirmClose={this.confirmClose.bind(this)}
                                id={id}
                                handleText={this.handleText.bind(this)}
                            />
                        </div>
                </div>
    )
  }
}

const mapStateToProps = state => {
    return {
        business: state.businessReducer.business,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(BusinessAction, dispatch),
        openGlobalSnackbar: bindActionCreators(openGlobalSnackbar, dispatch)
    };
};


export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CloseUserAccount)
);