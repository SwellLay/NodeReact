import React, { PureComponent, Fragment } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import history from 'customHistory'
import { openGlobalSnackbar } from '../../actions/snackBarAction';
import { forgotPassword } from '../../api/LoginService';
import { generateResetLink } from 'actions/authAction';
import CenterSpinner from '../../global/CenterSpinner';
import { NavLink } from 'react-router-dom';
import { persistingStore } from '../../client';

class ForgotPassword extends PureComponent {
    state = {
        email: '',
        emailSent: false
    }
    componentDidMount() {
        document.title = "Peymynt - Forgot Your Password?"
    }

    handleText = e => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    sendEMail = async (e) => {
        e.preventDefault()
        localStorage.clear()
        persistingStore.purge();

        try {
            const { email } = this.state
            const payload = {email}
            this.props.generateResetLink(payload)
            this.setState({emailSent: true})
            this.props.openGlobalSnackbar("Reset instructions has been sent.", false)
        } catch (error) {
            console.error("=====> error ====>", error)
            // history.push('/login')
            this.props.openGlobalSnackbar("Something went wrong, please try again later.", true)
        }
    }

    render() {
        const { email, emailSent } = this.state
        const { data, loading } = this.props.resetLink;
        return (
            <div fluid className="py-page__auth">
                <Row className="align-items-center height-80 justify-content-center no-gutters">
                    {/* <Col md="4" className="img-bg align-items-center justify-content-center d-flex overlay">
                        <div className="content">
                            <h2 className="display-4 display-md-3 color-1 mt-4 mt-md-0">Welcome to
                            <span className="bold d-block">Peymynt</span>
                            </h2>
                            <p className="lead color-1 alpha-5">Recover your account</p>
                        </div>
                    </Col> */}
                    <Col md="8" className="d-flex align-items-center justify-content-between">
                        {
                            emailSent ?
                            loading ? (<CenterSpinner className="text-center"/>) : (<Fragment>
                                <div className="py-page__login">
                                    <h1 className="color-5 bold">Check Your Email</h1><br/>
                                    <div className="color-2 mt-0 mb-4 mb-md-6">
                                        {
                                            data && !!data.messageToDisplay ? (<div dangerouslySetInnerHTML={{__html: data.messageToDisplay}}/>)
                                            : (<div>Internal Server Error</div>)
                                        }
                                        <br/><div>If you don't receive the email, check your spam folder or <a href="javascript: void(0)">contact us</a>.</div>
                                        <br/><div>Or try password reset using a <a href="javascript: void(0)" onClick={() => this.setState({emailSent: false, email: ""})}>different email address</a>.</div>
                                    </div>
                                </div>
                            </Fragment>)
                            :(<Fragment>
                                <div className="py-page__login">
                                    <div className="py-header py-header--page">
                                        <div className="py-header--title">
                                            <h2 className="">Forgot your password? Don't panic!</h2>
                                            {/* <p className="color-2 mt-0 mb-4 mb-md-6">Enter your <span
                                        data-toggle="tooltip" data-placement="top" title="Your primary email address can be the email you originally used to signup for Peymynt, or the email where you recieve Pwymynt mail notifications. It may be different from your usual business or personal email."
                                            className="info-text"
                                            >primary email address</span>&nbsp;and we'll send you instruction on how to reset your password.
                                            </p> */}
                                        </div>
                                    </div>
                                    <Form className="login-form" onSubmit={this.sendEMail}>
                                        <FormGroup className="mb-4">
                                            <Label for="AccountReset__Email">Email</Label>
                                            <Input
                                                required
                                                type="email"
                                                name="email"
                                                value={email}
                                                id="AccountReset__Email"
                                                placeholder="Your registered email address"
                                                onChange={this.handleText} />
                                                <span className="py-text--hint mt-1">
                                                Type the address linked to your account and we'll send you password reset instructions. They might end up in your spam folder, so please check there as well.
                                    
                                                </span>
                                        </FormGroup>

                                        <FormGroup className="d-flex align-items-center justify-content-start">
                                            <Button type="submit" className="btn-primary mr-2">Send Instructions
                                            </Button>
                                            <NavLink to='/login' className="btn btn-outline-primary">Back to sign in</NavLink>
                                        </FormGroup>
                                    </Form>
                                </div>
                            </Fragment>)
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        resetLink: state.getResetLink
    }
}
export default connect(mapStateToProps, {openGlobalSnackbar, generateResetLink})(ForgotPassword);