import BusinessService from 'api/businessService'
import history from 'customHistory'
import { cloneDeep, find } from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { bindActionCreators } from 'redux'
import * as BusinessAction from "../../actions/businessAction";
import { BUSINESS_TYPE, ORGANIZATION_TYPE } from '../../constants/businessConst';

class Onboarding extends PureComponent {
  state = {
    countries: [],
    currencies: [],
    subTypeList: [],
    addBusiness: {
      organizationName: "",
      organizationType: '',
      country: {
        name: '',
        id: ''
      },
      currency: {
        code: '',
        name: '',
        symbol: '',
        displayName: ''
      },
      businessType: '',
      businessSubType: ''
    },
  };
  countries = [];
  currencies = [];

  componentDidMount() {
    document.title = "Peymynt - Register";
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      history.push('/login');
      window.location.reload(true);
      return
    }
    this.fetchFormData()
  }

  componentWillUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.fetchFormData()
    }
  }

  fetchFormData = async () => {
    // const countries = (await CustomerServices.fetchCountries()).countries
    const countriesAndCurrency = (await BusinessService.fetchBusinessCountries());
    // const currencies = await CustomerServices.fetchCurrencies()
    this.setState({ countries: countriesAndCurrency.data.countries });
    this.setState({ currencies: countriesAndCurrency.data.countries })
  };


  handleText = (event) => {

    const { name, value } = event.target;
    let updateBusiness = cloneDeep(this.state.addBusiness);
    let subTypeList = cloneDeep(this.state.subTypeList);
    if (name === 'businessType') {
      updateBusiness.businessSubType = '';
      let data = BUSINESS_TYPE;
      const selectedType = data.filter(item => {
        if (item.value === value) {
          return item
        }
      });
      subTypeList = selectedType[0].options;
      updateBusiness[name] = value
    } else if (name === 'country') {
      updateBusiness['currency'] = this.mapCurrencyWithCountry(value);
      updateBusiness[name] = this.prepareCountryObj(value);
    } else if (name === 'currency') {
      updateBusiness['currency'] = updateBusiness.currency;
    } else {
      updateBusiness[name] = value
    }
    this.setState({ addBusiness: updateBusiness, subTypeList })
  };

  prepareCountryObj = id => {
    const { countries } = this.state;
    const countryObject = find(countries, { 'id': parseInt(id) });
    let countryObj = {
      name: countryObject.name,
      id: countryObject.id
    };
    return countryObj;
  };

  mapCurrencyWithCountry = id => {
    const { countries } = this.state;
    const currencyObject = find(countries, { 'id': parseInt(id) });
    return currencyObject.currencies[0];
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    let payload = {
      businessInput: this.state.addBusiness
    };
    try {
      const response = await BusinessService.addCompany(payload);
      if (response.statusCode === 201) {
        await this.props.actions.fetchBusiness();
        history.push('/app/dashboard')
      }
    } catch (error) {
      alert(error);
      return "somthing went wrong, please check the connection."
    }
  };

  _clearLocal(e){
    localStorage.clear();
  }

  render() {
    const { organizationName, organizationType, country,
      currency, businessSubType, businessType
    } = this.state.addBusiness;
    const { countries, subTypeList } = this.state;
    return (
      <div>
        <Container fluid className="d-flex justify-content-center py-4 bg-white">
          <div className="py-brand--logo">
            {/* Note: To be replaced with logo */}
            <span className="py-heading--section-title m-0 text-primary">Peymynt</span>
          </div>
        </Container>
        <div className="py-page__auth onboarding__initial">
          <Row className="no-gutters mt-4 justify-content-center align-items-center">
            {/* <Col md="4" className="img-bg align-items-center justify-content-center d-flex overlay">
                        <div className="content">
                            <h2 className="display-4 display-md-3 color-1 mt-4 mt-md-0">Welcome to
							<span className="bold d-block">Peymynt</span>
                            </h2>
                        </div>
                    </Col> */}
            <div className="py-page__login" style={{maxWidth: '500px'}}>
              {/* <img src="assets/logo.png" className="logo img-fluid mb-4 mb-md-6" alt="" /> */}
              {/* <h1 className="color-5 bold">Login</h1> */}
              <header className="py-header py-header--page justify-content-center">
                <div className="py-header--title">
                  <h1 className="py-heading--section-title text-center">Tell us about your business</h1>
                </div>
              </header>

              <Form className="login-form onboard-form" role="form" onSubmit={this.handleSubmit}>
                <div className="py-box py-box--xlarge">
                  <FormGroup>
                    <Label className="py-form-field__label is-required" for="exampleEmail">Company Name</Label>
                    <Input
                      onChange={this.handleText}
                      type="text"
                      name="organizationName"
                      value={organizationName}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className="py-form-field__label is-required" for="exampleEmail">Type of Business</Label>
                    <div className="py-select--native py-form__element__fluid">
                      <Input
                        type="select"
                        name="businessType"
                        value={businessType}
                        onChange={this.handleText}
                        className="py-form__element"
                        placeholder="What does your business do?"
                        required
                      >
                        {BUSINESS_TYPE.map((item, i) => {
                          return <option key={i} value={item.value}>{item.label}</option>
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                  {businessType != '' &&
                  <FormGroup>
                    <div className="py-select--native py-form__element__fluid">
                      <Input
                        type="select"
                        name="businessSubType"
                        value={businessSubType}
                        onChange={this.handleText}
                        className="py-form__element"
                        placeholder="What does your business do?"
                        required
                      >
                        {subTypeList.length && subTypeList.map((item, i) => {
                          return <option key={i} value={item.value}>{item.label}</option>
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                  }
                  {/* <div className="note-text">This helps Peymynt display the right accounts, saving you time. Choose the option that best represents your business. </div> */}
                  <FormGroup>
                    <Label className="py-form-field__label is-required" for="exampleEmail">Country</Label>
                    <div className="py-select--native py-form__element__fluid">
                      <Input
                        type="select"
                        name="country"
                        value={country.countryName}
                        onChange={this.handleText}
                        className="py-form__element"
                        required
                      >
                        <option key={-1} value={""}>{'---------------'}</option>
                        {countries.length && countries.map((item, index) => {
                          return <option key={index} value={item.id}>{item.name}</option>
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                  {/* <div className="note-text">If you do business in one country but are based in another, choose the country where you file your taxes, or where your business is incorporated. </div> */}
                  <FormGroup>
                    <Label className="py-form-field__label is-required" for="exampleEmail">Business Currency</Label>
                    <Input
                      type="text"
                      name="currency"
                      value={currency.displayName}
                      onChange={this.handleText}
                      required
                    >
                      {/* <option key={-1} value={""}>{'---------------'}</option>
                                        {currencies.length && currencies.map((item, i) => {
                                            let countryName = item.country
                                            let countryCode = item.currency_code;
                                            let showValue = countryCode + " - " + countryName;
                                            return <option key={i} value={countryCode}>{showValue}</option>
                                        })} */}
                    </Input>
                  </FormGroup>
                  {/* <div className="note-text"> This is your reporting currency and cannot be changed. You can still send invoices, track expenses and enter transactions in any currency and an exchange rate is applied for you.</div> */}
                  <FormGroup>
                    <Label className="py-form-field__label is-required" for="exampleEmail">Type of Entity</Label>
                    <div className="py-select--native py-form__element__fluid">
                      <Input
                        type="select"
                        name="organizationType"
                        value={organizationType}
                        onChange={this.handleText}
                        className="py-form__element"
                        required
                      >
                        {ORGANIZATION_TYPE.map((item, index) => {
                          return <option key={index} value={item.value}>{item.label}</option>
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                  {/* <div className="note-text">Choose Sole Proprietor if you have not incorporated (and do not plan to), and are not in partnership with anyone else. </div>
                                 */}

                  <FormGroup className="">
                    {/* <a  onClick={() => history.push('/forgot-password')} href="javascript:void(0)" className="text-warning small">Forgot your password?</a> */}
                    <div className="ajax-button">
                      <div className="fas fa-check btn-status text-success success"></div>
                      <div className="fas fa-times btn-status text-danger failed"></div>
                      <button type="submit" className="btn btn-primary btn-block mt-4 btn-lg">Get started
                      </button>
                      <span className="mrT20 mrB20">Want to use different account? <NavLink to='/login' onClick={() => localStorage.clear()}>Login here</NavLink></span>
                    </div>
                  </FormGroup>
                </div>
              </Form>
            </div>
          </Row>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(BusinessAction, dispatch)
  };
};


export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Onboarding)
);
