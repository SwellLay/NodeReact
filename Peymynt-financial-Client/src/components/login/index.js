import { googleLogin, login } from 'actions/loginAction';
import history from 'customHistory'
import React, { PureComponent } from 'react';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import SnakeBar from '../../global/SnakeBar';
import { _documentTitle } from '../../utils/GlobalFunctions';
import {Helmet} from "react-helmet";

class Login extends PureComponent {
  state = {
    email: "",
    password: "",
    validate: {
      emailState: ""
    },
    isError: false,
    isAuthenticated: false, user: null, token: ''
  };

  componentDidMount() {
    _documentTitle({}, 'Sign in');
    let authCheck = localStorage.getItem("token");
    if (!authCheck) {
      history.push("/login")
      //window.location.reload(true);
    } else {
      history.push("/app/dashboard")
    }
  }


  loginFormSubmit = async (event) => {
    event.preventDefault();
    let payload = {
      email: this.state.email,
      password: this.state.password
    };
    await this.props.login(payload);
    if (this.props.errorMessage) {
      this.setState({
        isError: true
      });
      setTimeout(() => {
        this.setState({
          isError: false
        })
      }, 2000)
    }
  };

  handleTextField = (event) => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    if (emailRex.test(event.target.value)) {
      validate.emailState = 'has-success'
    } else {
      validate.emailState = 'has-danger'
    }
    this.setState({ validate });
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  googleResponse = async (response) => {
    const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
    this.props.googleLogin(response);
  };

  showError = () => {
    if (this.props.errorMessage) {
      this.setState;
      setTimeout(() => {
        return <p ><font color="red">{this.props.errorMessage}</font></p>
      }, 2000)
    }
  };

  render() {
    return (
      <div className="py-page__auth">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Peymynt - Sign In</title>
        </Helmet>
        {/* <Container className="d-flex justify-content-between align-items-center p-2 pt-3">
                    <div className="">
                        <h3>Peymynt</h3>
                    </div>
                    <div className="py-header__auth-actions">
                             <p className="py-text">Don't have an account yet?
							<a href="javascript:void(0)" className="py-text--link ml-2" onClick={() => history.push('/register')}>Create it here</a>
                            </p>
                    </div>
                </Container> */}
        <Row className="no-gutters">
          <Col md="4" className="img-bg align-items-center justify-content-center d-flex overlay">
            <div className="content  p-4">
              <h2 className="display-4">Welcome to
                <span className="bold d-block">Peymynt</span>
              </h2>
              <p className="lead color-1 alpha-5">Login to your account</p>
            </div>
          </Col>
          <Col md={8}className="d-flex flex-column align-items-center justify-content-center">
            <SnakeBar isAuth={false} />
            <div className="py-page__login">

              <div className="py-header mb-4">
                <div className="py-header--title text-center">
                  <h1 className="py-heading--title mb-2 text-center">Hello, who's this?</h1>
                  {/* <p>Welcome back! Sign in to continue</p> */}
                </div>
              </div>

              <Form className="login-form" role="form" onSubmit={this.loginFormSubmit}>


                <FormGroup className="justify-content-end">
                  <div className="ajax-button">


                    <GoogleLogin
                      scope="profile email"
                      clientId='648232443420-8s3iosmrcp8jjrf40f5djhulfu7slep3.apps.googleusercontent.com'
                      // clientId='38087117284-9nujuvhr24m6p2u65ja9vjfoastanu3g.apps.googleusercontent.com'
                      // clientId="644820555038-3qir84bks04qmkf0v45or74bop92cesk.apps.googleusercontent.com"
                      // clientId='43c74cd23122682a6ae3e89ebf50e3a7-4836d8f5-89f38845'
                      buttonText="Sign in with Google"
                      // responseType="code"
                      onSuccess={this.googleResponse}
                      onFailure={this.googleResponse}
                      className="btn btn-social--google text-center btn-block"
                    />
                  </div>

                </FormGroup>

                <div className="py-text--divider">
                  <span> &nbsp;&nbsp; Or, sign in with your email &nbsp;&nbsp;</span>
                </div>
                {/* <Label className="bold small text-uppercase color-2" for="exampleEmail">Email</Label> */}
                <FormGroup>
                  <Label for="AccountLogin__Emaill">Email</Label>
                  <Input autoFocus onChange={this.handleTextField}
                    type="email" name="email" id="AccountLogin__Email" placeholder="name@mail.com" required />
                </FormGroup>
                <FormFeedback valid={this.state.validate.emailState === 'has-success'}
                >Success</FormFeedback>
                <FormFeedback invalid={this.state.validate.emailState === 'has-danger'}>
                  Uh oh! Looks like there is an issue with your email. Please input a correct email.</FormFeedback>
                {/* <Label className="bold small text-uppercase color-2" for="examplePassword">Password</Label> */}
                <FormGroup className="d-flex flex-column align-items-end">
                  <Label for="AccountLogin__Password" className="align-self-start">Password</Label>
                  <Input onChange={this.handleTextField} id="AccountLogin__Password"  type="password" name="password" placeholder="password" required />
                  <a className="py-text--link text-right" href="javascript:void(0)" onClick={() => history.push('/forgot-password')}>Forgot password?</a>
                </FormGroup>
                {this.state.isError ? <p ><font color="red">{this.props.errorMessage}</font></p> : null}
                <FormGroup className="d-flex align-items-center justify-content-between mt-4">
                  <div className="ajax-button">
                    {/* <div className="fas fa-check btn-status text-success success"></div>
                                        <div className="fas fa-times btn-status text-danger failed"></div> */}
                    <Button type="submit" className="btn-primary btn-block text-center btn-lg">
                      Sign in
                    </Button>

                  </div>
                </FormGroup>
              </Form>
              <p className="py-text text-center">Don't have an account yet?
                <a href="javascript:void(0)" className="py-text--link ml-2" onClick={() => history.push('/register')}>Create an account</a>.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStatetoProps = state => ({
  errorMessage: state.appUserReducer.errorMessage
});

const mapDispatchToProps = (dispatch) => ({
  login: data => {
    dispatch(login(data))
  },
  googleLogin: data => {
    dispatch(googleLogin(data));
  }
});


// const mapDispatchToProps = (dispatch) =>{
//     return {
//         actions: bindActionCreators(loginActions, dispatch)
//     };
// }

export default withRouter((connect(mapStatetoProps, mapDispatchToProps)(Login)))
//export default Login
