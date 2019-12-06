import BusinessService from "api/businessService";
import history from "customHistory";

import { cloneDeep, find } from "lodash";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Form, Input, Label, Spinner } from "reactstrap";
import { bindActionCreators } from "redux";
import SelectBox from "utils/formWrapper/SelectBox";
import * as BusinessAction from "../../../../actions/businessAction";
import { openGlobalSnackbar } from "../../../../actions/snackBarAction";
import { BUSINESS_TYPE, ORGANIZATION_TYPE } from "../../../../constants/businessConst";

class AddBusiness extends PureComponent {
  state = {
    countries: [],
    currencies: [],
    subTypeList: [],
    addBusiness: {
      organizationName: "",
      organizationType: "",
      country: {
        name: "",
        id: ""
      },
      currency: {
        code: "",
        name: "",
        symbol: "",
        displayName: ""
      },
      businessType: "",
      businessSubType: "",
    },
    loading: false
  };
  countries = [];
  currencies = [];

  componentDidMount() {
    document.title = "Peymynt - Register";
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      history.push("/login");
      window.location.reload(true);
      return;
    }
    this.fetchFormData();
  }

  componentWillUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.fetchFormData();
    }
  }

  fetchFormData = async () => {
    const countriesAndCurrency = await BusinessService.fetchBusinessCountries();
    const currencies = await this.currenciesList(countriesAndCurrency.data.countries);
    this.setState({ countries: countriesAndCurrency.data.countries });
    this.setState({ currencies: currencies });
  };

  currenciesList = (countries) => {
    let currencies = [];
    countries.forEach(element => {
      const currObj = element.currencies[0];
      currencies.push(currObj)
    });
    return currencies
  };

  handleText = (event, fieldName) => {
    let updateBusiness = cloneDeep(this.state.addBusiness);
    let subTypeList = cloneDeep(this.state.subTypeList);
    if (fieldName === 'currencies') {
      updateBusiness["currency"] = event;
    } else {
      const { name, value } = event.target;
      if (name === "businessType") {
        updateBusiness.businessSubType = "";
        let data = BUSINESS_TYPE;
        const selectedType = data.filter(item => {
          if (item.value === value) {
            return item;
          }
        });
        subTypeList = selectedType[0].options;
        updateBusiness[name] = value;
      } else if (name === "country") {
        updateBusiness["currency"] = this.mapCurrencyWithCountry(value);
        updateBusiness[name] = this.prepareCountryObj(value);
      } else if (name === "currency") {
        updateBusiness["currency"] = updateBusiness.currency;
      } else {
        updateBusiness[name] = value;
      }
    }
    this.setState({ addBusiness: updateBusiness, subTypeList });
  };

  prepareCountryObj = id => {
    const { countries } = this.state;
    const countryObject = find(countries, { id: parseInt(id) });
    let countryObj = {
      name: countryObject.name,
      id: countryObject.id
    };
    return countryObj;
  };

  mapCurrencyWithCountry = id => {
    const { countries } = this.state;
    const currencyObject = find(countries, { id: parseInt(id) });
    return currencyObject.currencies[0];
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    let payload = {
      businessInput: this.state.addBusiness
    };
    try {
      const response = await BusinessService.addCompany(payload);
      if (response.statusCode === 201) {
        await this.props.actions.fetchBusiness();
        console.log('business', response.data.business)
        await this.props.actions.setSelectedBussiness(response.data.business);
        this.props.openGlobalSnackbar(`Business "${response.data.business.organizationName}" added successfully!`);
        this.setState({ loading: false });
        history.push("/app/dashboard");
      }
    } catch (error) {
      this.setState({ loading: false });

      // this.props.openGlobalSnackbar(`somthing went wrong, please check the connection!`);
      alert(error);
      return "Something went wrong, please check the connection.";
    }
  };

  render() {
    const {
      organizationName,
      organizationType,
      country,
      currency,
      businessSubType,
      businessType,
    } = this.state.addBusiness;
    const { countries, subTypeList, currencies } = this.state;
    return (
      <div className="content-wrapper__main__fixed content-wrapper__small">
        <header className="py-header--page">
          <div className="py-header--title">
            <div className="py-heading--title">Create a business</div>
          </div>
        </header>
        <Form
          className="py-form--vertical m-0"
          role="form"
          onSubmit={this.handleSubmit}
        >

          <div className="py-box py-box--xlarge">
            <div className="py-form-field">
              <Label
                className="py-form-field__label is-required"
                for="exampleEmail">
                Company Name
              </Label>

              <div className="py-form-field__element">
                <Input
                  onChange={this.handleText}
                  className="py-form__element__fluid"
                  type="text"
                  name="organizationName"
                  value={organizationName}
                  required
                />
              </div>
            </div>
            <div className="py-form-field">
              <Label
                className="py-form-field__label is-required"
                for="exampleEmail"
              >
                Type of Business
              </Label>
              <div className="py-form-field__element">
                <div className="py-select--native  py-form__element__fluid">
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
                      return (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      );
                    })}
                  </Input>
                </div>
                <p className="py-text--hint"> This helps Peymynt display the right accounts, saving you time. Choose the option that best represents your business.</p>

              </div>
            </div>
            {businessType != "" && (
              <div className="py-form-field">
                <div className="col-sm-3" />
                <div className="py-form-field__element">
                  <div className="py-select--native">
                    <Input
                      type="select"
                      name="businessSubType"
                      value={businessSubType}
                      onChange={this.handleText}
                      className="py-form__element"
                      placeholder="What does your business do?"
                      required
                    >
                      {subTypeList.length > 0 &&
                      subTypeList.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </Input>
                  </div>
                </div>
              </div>
            )}

            <div className="py-form-field">
              <Label
                className="py-form-field__label is-required"
                for="exampleEmail"
              >
                Type of Organization
              </Label>
              <div className="py-form-field__element">

                <div className="py-select--native  py-form__element__fluid">
                  <Input
                    type="select"
                    name="organizationType"
                    value={organizationType}
                    onChange={this.handleText}
                    className="py-form__element"
                    required
                  >
                    {ORGANIZATION_TYPE.map((item, index) => {
                      return (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      );
                    })}
                  </Input>
                </div>
                <p className="py-text--hint" >Choose Sole Proprietor if you have not incorporated (and do not plan to), and are not in partnership with anyone else.</p>
              </div>
            </div>
            <div className="py-form-field">
              <Label
                className="py-form-field__label is-required"
                for="exampleEmail"
              >
                Country
              </Label>

              <div className="py-form-field__element">
                <div className="py-select--native py-form__element__fluid">
                  <Input
                    type="select"
                    name="country"
                    value={country.countryName}
                    onChange={this.handleText}
                    className="py-form__element"
                    required
                  >
                    <option key={-1} value={""}>
                      {"Select a country"}
                    </option>
                    {countries.length > 0 &&
                    countries.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Input>
                </div>
                <p className="py-text--hint" >If you do business in one country but are based in another, choose the country where you file your taxes, or where your business is incorporated.</p>
              </div>
            </div>
            <div className="py-form-field">
              <Label
                className="py-form-field__label is-required"
                for="exampleEmail"
              >
                Business Currency
              </Label>

              <div className="py-form-field__element">
                <SelectBox
                  labelKey='displayName'
                  options={currencies}
                  value={currency}
                  onChange={e => this.handleText(e, 'currencies')}
                  placeholder="Select a currency"
                />
                <p className="py-text--hint" >This is your reporting currency and cannot be changed. You can still send invoices, track expenses and enter transactions in any currency and an exchange rate is applied for you. <a href="javascript: void(0)">Learn more.</a></p>
              </div>
            </div>
          </div>

          <div className="py-form-field">
            <div className="py-form-field__blank">
            </div>
            <div className="py-form-field__element">
              <div className="ajax-button">
                <div className="fas fa-check btn-status text-success success" />
                <div className="fas fa-times btn-status text-danger failed" />
                <Button
                  type="submit"
                  className="btn-accent btn-rounded"
                  color={"primary"}
                >
                  Create
                  {
                    this.state.loading ?
                      (<Spinner size="sm" color="secondary" />)
                      : ""
                  }
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(BusinessAction, dispatch),
    openGlobalSnackbar: bindActionCreators(openGlobalSnackbar, dispatch)
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(AddBusiness)
);
