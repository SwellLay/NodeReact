import React ,{PureComponent, Fragment} from 'react';
import { Container, Row, Col, Button, Form, FormText, FormGroup, Label, Input } from 'reactstrap';
import { verifyLink, resetPassword } from 'actions/authAction';
import { connect } from 'react-redux'
import history from 'customHistory'
import CenterSpinner from '../../global/CenterSpinner';
import { openGlobalSnackbar } from '../../actions/snackBarAction';
import SnakeBar from '../../global/SnakeBar';

class ResetPassword extends PureComponent {
    state = {
        npassword: "",
        cpassword: "",
        inputType: true
    }
    componentDidMount(){
        const {token} = this.props.match.params;
        this.props.verifyLink(token);
    }

    _handleValues = ({target: {name, value}}) => {
        this.setState({
            [name]: value
        })
    }

    componentWillReceiveProps(nextProps){
        if(this.props.passwordReset !== nextProps.passwordReset){
            const { error, data, success } = nextProps.passwordReset;
            if(error){
                this.props.openGlobalSnackbar(data.message, true)
            }else if(success){
                this.props.openGlobalSnackbar("Password changed successfully.", false);
                history.push('/login')

            }

        }
    }

    _handleSubmit = e => {
        e.preventDefault()
        const { npassword, cpassword } = this.state;
        console.log("npassword", npassword, cpassword)
        if(npassword === cpassword){
            let data = {
                password: npassword,
                privateToken: this.props.linkVerify && this.props.linkVerify.data && this.props.linkVerify.data.privateToken,
                publicToken: this.props.match.params.token
            }
            this.props.resetPassword(data);
        }else{
            this.props.openGlobalSnackbar("Confirm password should be same as new password.", true)
        }
    }

    _handleShow = e => {
        this.setState({inputType: !this.state.inputType})
    }
    render() {
        console.log('this', this.props)
        const { loading, data, success } = this.props.linkVerify;
        return (
            <div className="py-page__auth">
                <SnakeBar/>
                <Row className="align-items-center justify-content-center no-gutters height-100 mainApp">
                    {
                        loading ? <CenterSpinner /> :
                        success ? (<Fragment>
                            <div className="py-page__login">
                                <div className="login-form mt-5 mt-md-0">
                                    {/* <img src="assets/logo.png" className="logo img-fluid mb-4 mb-md-6" alt="" /> */}
                                    <h1 className="py-heading--title">Change your password</h1>
                                    <p className="py-text">Add your new password to retrieve your account or&nbsp;
                                    <a href="javascript:void(0)" className="py-text--link"  onClick={() => history.push('/login')}>Login</a>
                                    </p>
                                    <Form className="login-form" onSubmit={this._handleSubmit.bind(this)}>
                                        <FormGroup>
                                            <label for="ResetNewPassword" className="py-form-field__label">New password</label>
                                            <Input id="ResetNewPassword" type={this.state.inputType ? "password" : "text"} name="npassword" required minLength={6} placeholder="New Password" onChange={this._handleValues.bind(this)}/>
                                            <span className="d-flex justify-content-between">
                                                <span className="py-text--hint">At least 6 characters, but longer is better.</span>
                                                <a href="javascript:void(0)" className="py-text--small py-text--link" onClick={this._handleShow.bind(this)} >Show</a>
                                            </span>
                                        </FormGroup>
                                        <FormGroup>
                                        <label for="ResetConfirmPassword" className="py-form-field__label">Confirm password</label>
                                            <Input className="" type="password" id="ResetConfirmPassword" name="cpassword"  required minLength={6}placeholder="Confirm Password" onChange={this._handleValues.bind(this)}/>
                                        </FormGroup>
                                        <FormGroup className="">
                                            <Button type="submit" className="btn-primary btn-block mt-3">
                                                Reset Password
                                            </Button>
                                        </FormGroup>
                                    </Form>
                                </div>
                            </div>
                        </Fragment>)
                        : (<Fragment>
                            <Col sm="5" lg="4" className="mx-auto">
                                <div className="login-form mt-5 mt-md-0">
                                    <h3 className="color-red">Password Reset Unsuccessful</h3>
                                    <br/><p className="color-2 mt-0 mb-4 mb-md-6">
                                        The password reset link was invalid, possibly because it has already been used.
                                        Please request another password reset.
                                    </p>

                                </div>
                            </Col>
                        </Fragment>)
                    }
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        linkVerify: state.linkVerify,
        passwordReset: state.passwordReset
    }
}
export default connect(mapStateToProps, { verifyLink, resetPassword, openGlobalSnackbar })(ResetPassword);