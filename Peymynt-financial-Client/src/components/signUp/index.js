import React, { PureComponent } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom'
import history from 'customHistory'
import SignupService from '../../api/SignupService'
import { login, googleLogin } from 'actions/loginAction';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';
import {privacyPolicy , terms} from "../../utils/GlobalFunctions";
import { openGlobalSnackbar } from "actions/snackBarAction";
import SnakeBar from '../../global/SnakeBar';
import { NavLink } from 'react-router-dom';

const setRegisterData = (state, isConfirmed) => {
  const payload = {
    firstName: state && state.firstName || '',
    lastName: state && state.lastName || '',
    email: state && state.email || '',
    password: state && state.password || '',
    confirmPassword: state && state.confirmPassword || '',
  }
  if (isConfirmed) {
    delete payload.confirmPassword
  }
  return payload
}
class SignUp extends PureComponent {

  state = {
    errorMessage: '',
    registerData: setRegisterData()
  }

  componentDidMount() {
    document.title = "Peymynt - Register"
  }

  handleText = (event) => {
    const { name, value } = event.target
    this.setState({
      registerData: { ...this.state.registerData, [name]: value }
    })
  }


  googleResponse = async (response) => {
    const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
    this.props.googleLogin(response);
  };

  checkConfirmationPassword = (event) => {
    event.preventDefault();
    const registerData = this.state.registerData;
    const { password, confirmPassword } = registerData
    if (password === confirmPassword) {
      this.signUpFormSubmit(registerData)
    } else {
      this.setState({
        errorMessage: "password does not match"
      })
      return
    }
  }

  signUpFormSubmit = async (registerData) => {
    try {
      const user = {
        userInput: setRegisterData(registerData, true)
      }
      const response = await SignupService.registration(user)
      if(!!response){
        if(response.statusCode === 200){
          this.props.showSnackbar('Signup successfully.', false);
        }
      }
      this.setState({ errorMessage: '' })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user.id', response.data.user._id)
      localStorage.setItem('user.email', response.data.user.email)
      history.push('/onboarding')
    } catch (error) {
      if(!!error){
        console.log("error", error)
        this.props.showSnackbar(error.data.message, true);
      }
      this.setState({ errorMessage: error.message })
    }

  }

  render() {
    const { registerData, errorMessage } = this.state
    return (
      <div className="py-page__auth">
        <Row className="no-gutters">
          <Col md="4" className="img-bg align-items-center justify-content-center d-flex overlay">
            <div className="content">
              <h2 className="display-4 p-4">Get started with
              <span className="bold d-block">Peymynt</span>
              </h2>
            </div>
          </Col>
          <Col md="8" className="d-flex flex-column align-items-center justify-content-center">
            <SnakeBar isAuth={false} />

            <div className="py-page__login">

              <h1 className="py-heading--title text-center">Create an account</h1>
              <Form className="login-form" onSubmit={this.checkConfirmationPassword}>


            
                <FormGroup className="d-flex align-items-center justify-content-between">
                  <GoogleLogin
                    scope="profile email"
                     clientId='648232443420-8s3iosmrcp8jjrf40f5djhulfu7slep3.apps.googleusercontent.com'
                    // clientId='38087117284-9nujuvhr24m6p2u65ja9vjfoastanu3g.apps.googleusercontent.com'
                    // clientId="644820555038-3qir84bks04qmkf0v45or74bop92cesk.apps.googleusercontent.com"
                    // clientId='43c74cd23122682a6ae3e89ebf50e3a7-4836d8f5-89f38845'
                    buttonText="Sign up with Google"
                    // responseType="code"
                    onSuccess={this.googleResponse}
                    onFailure={this.googleResponse}
                    className="btn btn-social--google btn-block"
                  />
                </FormGroup>


                   <div className="py-text--divider">
                     <span> or sign up with email</span>
                   </div>


                <FormGroup className="d-flex">

                  <div className="w-50">
                    <Label for="AccountSignup__Firstname">First name</Label>
                    <Input
                    value={registerData.firstName}
                    type="text"
                    name="firstName"
                    className="mr-2"
                    id="AccountSignup__Firstname"
                    placeholder="Bruce"
                    onChange={this.handleText}
                    required />

                  </div>

                  <div className="mx-2"></div>

                  <div className="w-50">

                    <Label for="AccountSignup__Lastname">Last name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    className=""
                    id="AccountSignup__Lastname"
                    placeholder="Wayne"
                    value={registerData.lastName}
                    onChange={this.handleText}
                    required
                  />
                  </div>
                    
                </FormGroup>
                <FormGroup>
                  <Label for="AccountSignup__Email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="AccountSignup__Email"
                    placeholder="name@email.com"
                    value={registerData.email}
                    onChange={this.handleText}
                    required
                  />

                </FormGroup>
                <FormGroup>
                  <Label for="AccountSignup__Password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={registerData.password}
                    onChange={this.handleText}
                    required />

                </FormGroup>
                <FormGroup>
                <Label for="AccountSignup__ConfirmPassword">Confirm password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="AccountSignup__ConfirmPassword"
                    placeholder="confirm password"
                    value={registerData.confirmPassword}
                    onChange={this.handleText}
                    required />
                </FormGroup>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}

                <FormGroup className="d-flex align-items-center justify-content-between mt-4">
                  <Button type="submit" className="btn-primary btn-block text-center">Register
                  </Button>

                </FormGroup>

              </Form>
              <div className="text-center">
                <p className="py-text--xsmall py-text--hint px-4">By registering, you acknowledge that you have read and agree to the
								<a onClick={() => terms()} href="#" className="py-text--link"> Terms of Use </a>and<a onClick={() => privacyPolicy()} href="#" className="py-text--link"> Privacy Policy</a>.
                </p>
                {/* <br/> */}
                <p className="py-text">Already have an account? <NavLink to='/login' className="py-text--link">Login</NavLink>.</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  login: data => {
      dispatch(login(data))
  },
  googleLogin: data => {
      dispatch(googleLogin(data));
  },
  showSnackbar: (message, error) => {
    dispatch(openGlobalSnackbar(message, error))
  }
})
export default withRouter((connect(null, mapDispatchToProps)(SignUp)))

// export default withRouter(SignUp);

// export default SignUp