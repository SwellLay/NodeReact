import history from "customHistory";
import _, { cloneDeep } from "lodash";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Form, FormGroup, Input, Label, Spinner, Table } from "reactstrap";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import SelectBox from "utils/formWrapper/SelectBox";
import { openGlobalSnackbar } from "../../../../../actions/snackBarAction";
import {
  addEstimate,
  checkEstimateNumberExist,
  fetchLatestEstimateNumber,
  updateEstimate
} from "../../../../../api/EstimateServices";
import { currentExchangeRate } from "../../../../../api/globalServices";
import taxServices from "../../../../../api/TaxServices";
import { _setCurrency, _showExchangeRate, getAmountToDisplay } from "../../../../../utils/GlobalFunctions";
import CustomizeHeader from "../../invoice/components/InvoiceForm/CustomizeHeader";
import Taxes from "../../sales/components/Taxes";
import {
  calculateTaxes,
  estimatePayload,
  estimateProductObject,
  getSelectedCurrency,
  getSelectedCustomer,
  setFormData
} from "./constant";
import { EstimateAlert } from "./EstimateInvoiceComponent";
import Popup from "./Popup";

const sampleProduct = {
  item: "",
  description: "",
  quantity: 1,
  price: undefined,
  taxes: [],
};
class EstimateForm extends Component {
  state = {
    showExchange: false,
    selectedCustomer: {},
    currencies: [],
    estimatePayload: estimatePayload(null, this.props.businessInfo, this.props.userSettings),
    customers: [],
    products: [],
    currency: "",
    taxList: [],
    openPopup: false,
    type: "All",
    estimateNumber: 0,
    isEstimateNumberExist: false,
    minDate: new Date(),
    loader: false,
    openHeader: false
  };

  componentDidMount() {
    const { isEditMode, selectedEstimate, businessInfo, isDuplicate } = this.props;
    console.log("selectedEstimate, businessInfo", selectedEstimate, businessInfo)
    document.title = businessInfo && businessInfo.organizationName ? `Peymynt - ${businessInfo.organizationName} - Estimate` : `Peymynt - Estimate`;
    let formatedData = this.state.estimatePayload;
    if (isEditMode) {
      let showExchange = _showExchangeRate(businessInfo.currency, (selectedEstimate && selectedEstimate.currency));
      formatedData = estimatePayload(selectedEstimate, businessInfo);
      this.setState({ estimatePayload: formatedData, showExchange, loader: true });
    }
    this.fetchtaxList();
    this.fetchFormData(formatedData);
    if (!isEditMode) {
      this.createEstimateNumber();
    }
    document.addEventListener("DOMContentLoaded", function () {
      var elements = document.getElementsByTagName("INPUT");
      for (var i = 0; i < elements.length; i++) {
        elements[i].oninvalid = function (e) {
          e.target.setCustomValidity("");
          if (!e.target.validity.valid) {
            e.target.setCustomValidity("This field cannot be left blank");
          }
        };
        elements[i].oninput = function (e) {
          e.target.setCustomValidity("");
        };
      }
    })
  }

  componentDidUpdate(prevProps) {
    const { selectedEstimate, businessInfo } = this.props;
    if (prevProps.selectedEstimate !== selectedEstimate) {
      console.log("componentDidUpdate", prevProps, this.props)
      let showExchange = _showExchangeRate(businessInfo.currency, selectedEstimate.currency);
      let formatedData = estimatePayload(selectedEstimate, businessInfo);
      this.setState({ estimatePayload: formatedData, showExchange });
      this.fetchFormData(formatedData);
    }
  }

  fetchtaxList = async () => {
    const response = (await taxServices.fetchTaxes()).data.taxes;
    this.setState({ taxList: response })
  };

  createEstimateNumber = async () => {
    let result = await fetchLatestEstimateNumber();
    if (result.statusCode === 200) {
      this.setState({
        estimatePayload: { ...this.state.estimatePayload, estimateNumber: result.data.estimateNumber }
      });
    }
  };

  fetchFormData = async (formatedData) => {
    let stateData = {
      currencies: this.state.currencies,
      customers: this.state.customers,
      products: this.state.products
    };
    const listData = await setFormData(stateData, "all");
    this.setState(listData);
    // await this.calculateAmount()
    await this.setFormData(listData, formatedData)
  };

  setFormData = async (listData, data) => {
    const { businessInfo } = this.props;
    const currencyValue = data.currency || businessInfo.currency;
    const selectedCustomer = await getSelectedCustomer(listData.customers, data.customer, businessInfo);
    const selectedCurency = await getSelectedCurrency(listData.currencies, currencyValue);
    this.setState({ selectedCustomer, selectedCurency, loader: false })
  };

  updateList = async (fetch, data) => {
    let stateData = {
      currencies: this.state.currencies,
      customers: this.state.customers,
      products: this.state.products
    };
    let { estimatePayload, selectedCustomer, prodIndex } = this.state;

    if (fetch === 'CustomerPopup') {
      estimatePayload.customer = data;
      selectedCustomer = data
    } else {
      estimatePayload.items[prodIndex] = data;
      estimatePayload.items[prodIndex]['amount'] = estimatePayload.items[prodIndex]['quantity'] * estimatePayload.items[prodIndex]['price'];

    }
    const listData = await setFormData(stateData, fetch);
    this.setState(listData);
    this.setState({ openPopup: false, estimatePayload, selectedCustomer });
    this.calculateAmount(estimatePayload)
  };

  onPopupClose = async type => {
    let stateData = {
      currencies: this.state.currencies,
      customers: this.state.customers,
      products: this.state.products
    };
    const data = await setFormData(stateData, type);
    this.setState(data);
    this.setState({ openPopup: false });
  };

  handleCustomer = async (selected, e) => {
    let elem = document.getElementById('customerAdd');
    elem.setCustomValidity("");
    if (selected && selected._id === "Add new customer") {
      this.setState({ openPopup: true, type: "CustomerPopup" });
    } else {
      let { estimatePayload, selectedCurency, selectedCustomer, currencies, showExchange } = this.state;
      const { businessInfo } = this.props;
      estimatePayload.customer = selected;
      estimatePayload.currency = _setCurrency(selected && selected.currency, businessInfo.currency);
      if (selected === null) {
        showExchange = false
      }else{
        showExchange = _showExchangeRate(businessInfo.currency, selected.currency);
      }
      console.log("selectyedCurrency", selected)
      if (showExchange) {
        try {
          const { data } = await currentExchangeRate(selected.currency.code, businessInfo.currency.code);
          estimatePayload.exchangeRate = data.exchangeRate;
        } catch (error) {
          console.error("error", error);
          return error;
        }
      }
      selectedCurency = getSelectedCurrency(
        currencies,
        (selected && selected.currency) || null
      );
      this.setState({
        selectedCurency,
        selectedCustomer: { ...selected, currency: _setCurrency(selected && selected.currency, businessInfo.currency) },
        estimatePayload,
        showExchange
      });
    }
  };

  setData = data => {
    let { estimatePayload, selectedCurency, currencies, showExchange } = this.state;
    const { businessInfo } = this.props;
    estimatePayload.customer = data;
    estimatePayload.currency = _setCurrency(data && data.currency, businessInfo && businessInfo.currency);
    if (data === null) {
      showExchange = false
    }else{
      showExchange = _showExchangeRate(businessInfo.currency, data.currency);
    }
    selectedCurency = getSelectedCurrency(
      currencies,
      _setCurrency(data && data.currency, businessInfo.currency)
    );
    this.setState({
      selectedCurency,
      selectedCustomer: data,
      estimatePayload,
      showExchange
    });
  };

  handleCurrency = async selected => {
      let { estimatePayload, selectedCustomer, selectedCurency } = this.state;
      let showExchange = _showExchangeRate(this.props.businessInfo.currency, selected);
      estimatePayload.currency = selected;
      if (showExchange) {
        try {
          const { data } = await currentExchangeRate(selected.code, this.props.businessInfo.currency.code);
          estimatePayload.exchangeRate = data.exchangeRate;
        } catch (error) {
          return error;
        }
      }
      this.setState({ showExchange, selectedCurency: selected, estimatePayload },
        () => this.calculateAmount(estimatePayload));
  };

  handleProduct = (selected, i) => {
    let estimatePayload = this.state.estimatePayload;
    if (selected && selected.target) {
      const { name, value } = selected.target;
      let { items } = estimatePayload;
      if(['price', 'quantity'].includes(name)){
        if(value.length < 11){
          items[i][name] = value;
        }
      }else{
        items[i][name] = value;
      }
      if (['price', 'quantity'].includes(name)) {
        items[i]['amount'] = items[i]['quantity'] * items[i]['price'];
      }
      this.setState({ estimatePayload });
      this.calculateAmount(estimatePayload);
    } else {
      let elem = document.getElementById(`item${i}`);
      elem.setCustomValidity("");
      if (selected && selected.item === "Add new product") {
        this.setState({ openPopup: true, type: "ProductPopup", prodIndex: i });
        // this.calculateAmount(estimatePayload);
      } else {
        let { estimatePayload } = this.state;
        if (selected) {
          estimatePayload.items[i] = selected;
        } else {
          estimatePayload.items[i] = sampleProduct;
        }
        estimatePayload.items[i]['amount'] = estimatePayload.items[i]['quantity'] * estimatePayload.items[i]['price'];
        this.setState({ estimatePayload });
        this.calculateAmount(estimatePayload);
      }
    }
  };

  calculateAmount = async (payload) => {
    let { showExchange, taxList } = this.state;
    let estimatePayload = payload;
    let result = await calculateTaxes(estimatePayload.items, taxList);
    estimatePayload.amountBreakup = {
      subTotal: result.sumAmount,
      taxTotal: result.taxsTotal,
      total: result.amount
    };
    estimatePayload.totalAmount = result.amount;
    estimatePayload.totalAmountInHomeCurrency = showExchange ? estimatePayload.exchangeRate * result.amount : 0;

    this.setState({ estimatePayload });
  };

  handleEstimate = async (e, fieldName) => {
    if (fieldName && fieldName.includes("Date")) {
      this.setState({
        estimatePayload: { ...this.state.estimatePayload, [fieldName]: e }
      });
      if (fieldName === 'estimateDate') {
        this.setState({
          minDate: e,
          estimatePayload: { ...this.state.estimatePayload, expiryDate: e, [fieldName]: e }

        })
      }
    } else {
      const { name, value } = e.target;
      if (name && name === "estimateNumber") {
        if (!isNaN(value)) {
          this.setState({
            estimatePayload: { ...this.state.estimatePayload, [name]: parseInt(value) }
          });
          let result = await checkEstimateNumberExist(value);
          if (result.statusCode === 200) {
            if (result.data.estimateNumberExist) {
              this.setState({
                isEstimateNumberExist: true
              });
            } else {
              this.setState({
                isEstimateNumberExist: false
              });
            }
          }
        }
      } else {
        this.setState({
          estimatePayload: { ...this.state.estimatePayload, [name]: value }
        }, () => { if (name === "exchangeRate") { this.calculateAmount(this.state.estimatePayload); } });
      }

    }
  };

  handleTaxChange = (selected, i) => {
    let { estimatePayload } = this.state;
    let selectedTax = selected.map(item => {
      return item.value;
    });
    estimatePayload.items[i].taxes = selectedTax;

    this.setState({ estimatePayload });
    this.calculateAmount(estimatePayload);
  };

  addALine = () => {
    let estimatePayload = cloneDeep(this.state.estimatePayload);
    const addItem = estimateProductObject();
    estimatePayload.items.push(addItem);
    this.setState({ estimatePayload });
  };

  handleDelete = idx => {
    let estimatePayload = this.state.estimatePayload;
    estimatePayload.items = estimatePayload.items.filter((s, index) => {
      return !(index === idx);
    });
    if (estimatePayload.items.length === 0) {
      this.addALine();
    } else {
      this.setState({ estimatePayload });
    }
    this.calculateAmount(estimatePayload)
  };

  estimateFormSumbit = async (e) => {
    e.preventDefault();
    try {

      let estiPayload = cloneDeep(this.state.estimatePayload);
      estiPayload.businessId = typeof estiPayload.businessId === "object" ? estiPayload.businessId._id : estiPayload.businessId;
      estiPayload.customer = typeof estiPayload.customer === "object" ? estiPayload.customer._id : estiPayload.customer;
      estiPayload.memo = this.refs.memo.innerHTML;
      delete estiPayload.postal
      const payload = {
        estimateInput: estiPayload
      };
      let response;
      console.log("estima", estiPayload)
      if(estiPayload.items.length > 0){
        if (this.props.isEditMode) {
          const id = this.props.selectedEstimate._id;
          response = await updateEstimate(id, payload);
          this.props.showSnackbar("Estimate updated successfully", false);
        } else {
          response = await addEstimate(payload);
          this.props.showSnackbar("Estimate added successfully", false);
        }
        if (response) {
          history.push(`/app/estimates/view/${response.data.estimate._id}`);
        }
      }else{
        this.props.showSnackbar('Please add a line.' || "Something went wrong", true);
        return false
      }
    } catch (error) {
      console.error("error in estimate post query", error);
      this.props.showSnackbar(error.message || "Something went wrong", true);
    }
  };

  onTextChange = (event, i) => {
    let { estimatePayload } = this.state;
    const { name, value } = event.target;
    let { items } = estimatePayload;
    items[i][name] = value;
    this.setState({ estimatePayload });
  };

  _handleBlur = e => {

  };
  itemsHtml = (currencySymbol) => {
    const { estimatePayload, taxList, products } = this.state;
    if(estimatePayload.items && estimatePayload.items.length > 0){
      return estimatePayload.items.map((item, i) => {
        return (
          <tr key={i} className="py-table__row">
            <td className="py-table__cell estimate_form_item">
              <SelectBox
                valueKey={"item"}
                labelKey={"name"}
                className="h-100 select-height "
                value={item.item ? item : ""}
                onChange={item => this.handleProduct(item, i)}
                options={products}
                placeholder="Choose"
                isClearable
                id={`item${i}`}
                inputProps={{
                  onInvalid: (e) => e.target.setCustomValidity('This field is required.'),
                  onInput: (e) => e.target.setCustomValidity(''),
                }}
                required
              />
            </td>
            <td className="py-table__cell estimate_form_description">
              <textarea className="form-focus--expand form-control"
                type="textarea"
                name="description"
                onChange={e => this.onTextChange(e, i)}
                value={item.description}
                maxLength={1000}
              ></textarea>
            </td>
            <td className="py-table__cell estimate_form_quantity">
              <Input
                type="number"
                step="any"
                name="quantity"
                maxLength={10}
                onChange={e => this.handleProduct(e, i)}
                value={item.quantity}
              />
            </td>
            <td className="py-table__cell estimate_form_price">
              <Input
                type="number"
                step="any"
                name="price"
                maxLength={12}
                onChange={e => this.handleProduct(e, i)}
                value={item.price}
                className="py-form__element__small"
                onBlur={this._handleBlur.bind(this)}
              />
            </td>
            <td className="py-table__cell estimate_form_taxes" >
              <Taxes
                taxList={taxList}
                taxValue={item}
                isEditMode={true}
                index={i}
                onChange={this.handleTaxChange}
                fetchtaxList={this.fetchtaxList}
              />
            </td>
            <td className="py-table__cell-amount estimate_form_amount">
              {getAmountToDisplay(_setCurrency(estimatePayload && !!estimatePayload.currency && estimatePayload.currency, this.props.businessInfo.currency), item.amount)}
            </td>
            <td className="py-table__cell__action">
              <div className="py-table__action py-table__action__danger py-icon" onClick={() => this.handleDelete(i)}>
                <svg className="py-svg-icon" viewBox="0 0 20 20" id="delete" xmlns="http://www.w3.org/2000/svg"><path d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"></path></svg>
              </div>
            </td>
          </tr>
        );
      });
    }else{
      return(
        <tr className="py-table__row">
          <td colSpan='7'>
            <div className="alert alert-info full-width">
              <div>
                <i className="fa fa-info-circle"/>
              </div>
              <div className="full-width pdL20">
                <span>You need to <a href="javascript:void(0)" onClick={this.addALine}>add</a> at least one line.</span>
              </div>
            </div>
          </td>
        </tr>
      )
    }
  };

  showCustomerInfo = () => {
    const { customer } = this.state.estimatePayload;
    return (
      customer ?
        <Fragment>
          <span className="py-text--hint text-capitalize mt-2">
            <span> {`${customer.firstName} ${customer.lastName}`}</span>
            {customer.addressBilling && customer.addressBilling.addressLine1.length > 0 ? (<div><span> {`${customer.addressBilling.addressLine1}`}</span></div>) : ""}
            {customer.addressBilling && customer.addressBilling.addressLine2.length > 0 ? (<div><span> {`${customer.addressBilling.addressLine2}`}</span></div>) : ""}
            {customer.addressBilling ? (<div><span> {`${customer.addressBilling.city} ${customer.addressBilling.state.name} ${customer.addressBilling.postal || ""}`}</span></div>) : ""}
            {customer.addressBilling ? (<div><span> {`${customer.addressBilling.country.name}`}</span></div>) : ""}
            {customer.addressBilling && customer.communication ? (<div><span>{`${customer.communication.phone}`}</span></div>) : ""}
            <span> {`${customer.email}`}</span>
          </span>
        </Fragment> : ""
    )
  };

  handleHeader = () => {
    this.setState({
      openHeader: true
    });
  };

  closeHeader = () => {
    this.setState({ openHeader: false });
  };


  onHeaderChange = data => {
    this.setState({ invoiceInput: data, showAlert: true });
    this.closeHeader()
  };

  render() {
    const {
      estimatePayload,
      openPopup,
      type,
      customers,
      selectedCustomer,
      currencies,
      showExchange,
      openHeader
    } = this.state;
    const { isEditMode, businessInfo } = this.props;
    const { itemHeading } = estimatePayload;
    const currencySymbol = _setCurrency(estimatePayload && !!estimatePayload.currency && estimatePayload.currency, businessInfo.currency).symbol;
    console.log("Estimate", estimatePayload, businessInfo)
    return (
      <div className="content-wrapper__main estimateForm">
        <header className="py-header--page">
          <div className="py-header--title">
            <h2 className="py-heading--title">{isEditMode ? "Edit" : "Create"} an estimate </h2>
          </div>
        </header>
          {this.state.loader ? <Spinner color="primary" size="md" className="loader" /> : (
                <Form className="estimate_form__container" onSubmit={this.estimateFormSumbit.bind(this)}>
                  <div className="py-box--header">
                  <div className="py-form-field mr-3">
                      <label for="EstimateName" className="py-form-field__label d-block">Estimate name</label>
                      <Input
                        type="text"
                        value={estimatePayload.name}
                        id="EstimateName"
                        name="name"
                        onChange={this.handleEstimate}
                        placeholder="Estimate name"
                        className="py-form__element__large mr-2 py-input--large" />
                    </div>

                    <div className="py-form-field">
                      <label for="EstimateNumber" className="py-form-field__label d-block">Estimate number</label>
                          <Input
                            type="number"
                            step="any"
                            value={estimatePayload.estimateNumber}
                            onChange={this.handleEstimate}
                            name="estimateNumber"
                            id="EstimateNumber"
                            placeholder="Estimate number"
                            className="py-form__element__medium py-input--large"
                            required
                          />
                          {this.state.isEstimateNumberExist ?
                          <EstimateAlert color="danger" message="Estimare Number already exist, Please choose other number" /> :
                          null}
                    </div>
                  </div>
                  <div className="py-box--content">
                  <div className="py-form-field--condensed estimate-form__info__container">
                    <div className="estimate-form__info__content">
                      <FormGroup className="">
                        <Label for="exampleEmail" className="py-form-field__label is-required">
                          Customer
                        </Label>
                        <div className="py-form-field__element">
                          <SelectBox
                            labelKey={'customerName'}
                            valueKey={'_id'}
                            value={estimatePayload.customer}
                            onChange={this.handleCustomer.bind(this)}
                            options={customers}
                            isClearable={true}
                            inputProps={{
                              onInvalid: (e) => e.target.setCustomValidity('This field is required.'),
                              onInput: (e) => e.target.setCustomValidity(''),
                            }}
                            placeholder="Select a customer"
                            id="customerAdd"
                            required
                            className="py-form__element__medium"
                          />
                          {this.showCustomerInfo()}

                        </div>
                      </FormGroup>

                      <FormGroup className="">
                        <Label for="exampleEmail" className="py-form-field__label">
                          Currency{" "}
                        </Label>
                        <div className="py-form-field__element">
                          <SelectBox
                            labelKey={'displayName'}
                            valueKey={'code'}
                            value={estimatePayload.currency}
                            onChange={this.handleCurrency}
                            className="py-form__element__medium"
                            options={currencies}
                            clearable={false}
                          />
                        </div>
                      </FormGroup>
                      {showExchange && (
                        <div className="py-form-field">
                          <label for="exampleEmail" className="py-form-field__label">
                            Exchange Rate
                          </label>
                          <div className="py-form-field__element">
                            <Input
                              type="number"
                              step="any"
                              value={estimatePayload.exchangeRate}
                              name="exchangeRate"
                              className="py-form__element__medium"
                              onChange={this.handleEstimate}
                              maxLength="10"
                            />
                            <div className="py-text--hint">Exchange rate at invoice date is from openexhangerates.org</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="estimate-form__info__content">
                      <div className="py-form-field py-form-field--inline">
                        <Label for="exampleEmail" className="py-form-field__label">
                          Date
                        </Label>
                        <div className="py-form-field__element">
                          <DatepickerWrapper
                            selected={estimatePayload.estimateDate}
                            onChange={date =>
                              this.handleEstimate(date, "estimateDate")
                            }
                            className="form-control py-form__element__small"
                          />
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <Label for="exampleEmail" className="py-form-field__label">
                          Expires on{" "}
                        </Label>
                        <div className="py-form-field__element">
                          <DatepickerWrapper
                            selected={estimatePayload.expiryDate}
                            onChange={date =>
                              this.handleEstimate(date, "expiryDate")
                            }
                            minDate={this.state.minDate}
                            className="form-control py-form__element__small"
                          />
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <Label for="exampleEmail" className="py-form-field__label">
                          P.O./S.O.{" "}
                        </Label>
                        <div className="py-form-field__element">
                          <Input
                            type="text"
                            className="py-form__element__small"
                            value={estimatePayload.purchaseOrder}
                            onChange={this.handleEstimate}
                            name="purchaseOrder"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="estimate-form__info__content">
                      <div className="py-form-field py-form-field--inline">
                        <Label for="exampleEmail" className="py-form-field__label">
                          Subheading{" "}
                        </Label>
                        <div className="py-form-field__element">
                          <Input
                            type="text"
                            className="py-form__element__small"
                            value={estimatePayload.subheading}
                            onChange={this.handleEstimate}
                            name="subheading"
                          />
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <Label for="exampleEmail" className="py-form-field__label">
                          Footer{" "}
                        </Label>
                        <div className="py-form-field__element">
                          <Input
                            type="text"
                            className="py-form__element__small"
                            value={estimatePayload.footer}
                            onChange={this.handleEstimate}
                            name="footer"
                          />
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <Label for="exampleEmail" className="py-form-field__label">
                          Memo{" "}
                        </Label>
                        <div className="py-form-field__element">
                          <div
                            contentEditable="true"
                            ref="memo"
                            name="memo"
                            rows={3}
                            className="form-control editableDiv"
                            dangerouslySetInnerHTML={{ __html: estimatePayload.memo }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>

                  <div className="py-box estimate__form__builder py-box--small">
                    <CustomizeHeader
                      invoice={estimatePayload}
                      openHeader={openHeader}
                      onClose={this.closeHeader}
                      onSave={this.onHeaderChange}
                    />
                    <Table hover className="py-table m-0" required>
                      <colgroup></colgroup>
                      <thead className="py-table__header">
                        <tr className="py-table__row">
                          <th className="py-table__cell estimate_form_item">
                            {itemHeading.hideItem ? <img className="eye_logo" src="/assets/eye.png" /> : ""}
                            {itemHeading.column1.name}
                          </th>
                          <th className="py-table__cell estimate_form_description">
                            Description
                        </th>
                          <th className="py-table__cell estimate_form_quantity">
                            {itemHeading.hideQuantity ? <img className="eye_logo" src="/assets/eye.png" /> : ""}
                            {itemHeading.column2.name}
                          </th>
                          <th className="py-table__cell estimate_form_price">
                            {itemHeading.hidePrice ? <img className="eye_logo" src="/assets/eye.png" /> : ""}
                            {itemHeading.column3.name}
                          </th>
                          <th className="py-table__cell estimate_form_taxes">Tax</th>
                          <th className="py-table__cell estimate_form_amount" style={{ textAlign: 'right' }}>
                            {itemHeading.hideAmount ? <img className="eye_logo" src="/assets/eye.png" /> : ""}
                            {/* <img className="eye_logo" src="/assets/eye.png" />{" "}<br /> */}
                            {itemHeading.column4.name}
                          </th>
                          <th className="py-table__cell" />
                        </tr>
                      </thead>
                      <tbody>{this.itemsHtml(currencySymbol)}</tbody>
                    </Table>
                    <Table className="table-no-border tableCalculation">
                      <tbody>
                        <tr className="py-table__row noBorder">
                          <td class="py-table__cell" style={{ textAlign: 'left' }}><a
                            href="javascript:void(0)"
                            onClick={this.addALine}
                            className="estimate__form__add_new py-text--link"
                          >
                            <svg viewBox="0 0 20 20" className="py-svg-icon mr-2" id="add" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm1-10V5.833c0-.46-.448-.833-1-.833s-1 .373-1 .833V9H5.833C5.373 9 5 9.448 5 10s.373 1 .833 1H9v3.167c0 .46.448.833 1 .833s1-.373 1-.833V11h3.167c.46 0 .833-.448.833-1s-.373-1-.833-1H11zm-1 8c4.067 0 7-2.933 7-7s-2.933-7-7-7-7 2.933-7 7 2.933 7 7 7z"></path></svg>
                            <span>Add a line</span>
                          </a></td>
                          <td class="py-table__cell" className="label"><span>Subtotal:</span></td>
                          <td class="py-table__cell" className="amount"><span>
                            {getAmountToDisplay(estimatePayload && !!estimatePayload.currency && estimatePayload.currency, estimatePayload.amountBreakup.subTotal)}
                          </span></td>
                          <td class="py-table__cell__action"></td>
                        </tr>
                        {estimatePayload.amountBreakup.taxTotal.length ?
                          estimatePayload.amountBreakup.taxTotal.map((item, index) => {
                            return (
                              <Fragment key={index}>
                                <tr className="py-table__row noBorder">
                                  <td class="py-table__cell" >&nbsp; </td>
                                  <td class="py-table__cell" className="label" style={{textAlign: 'right'}}>
                                    <span>
                                      {typeof (item.taxName) === 'object' ?
                                        `${item.taxName.abbreviation}${item.taxName.other.showTaxNumber ? ` (${item.taxName.taxNumber}):` : ':'}`
                                        : `${item.taxName}:`
                                      }
                                    </span>
                                  </td>
                                  <td class="py-table__cell" className="amount">
                                    <span>
                                      {getAmountToDisplay(estimatePayload && !!estimatePayload.currency && estimatePayload.currency, item.amount)}
                                    </span>
                                  </td>
                                </tr>
                              </Fragment>
                            )
                          }) : null
                        }
                        <tr className="totalSection">
                          <td class="py-table__cell">&nbsp;</td>
                          <td class="py-table__cell" className="label">
                            <span>{`Total (${_setCurrency(estimatePayload.currency && estimatePayload.currency, businessInfo.currency).code})`}:</span>
                          </td>
                          <td class="py-table__cell" className="amount">
                            <span>
                              {getAmountToDisplay(estimatePayload && !!estimatePayload.currency && estimatePayload.currency, estimatePayload.amountBreakup.total)}
                            </span>
                          </td>
                        </tr>
                        {showExchange && (<tr className="totalSection">
                          <td class="py-table__cell">&nbsp;</td>
                          <td class="py-table__cell" className="label">
                            <span><small>{`Total (${businessInfo.currency.code} at ${estimatePayload.exchangeRate})`}:</small></span>
                          </td>
                          <td class="py-table__cell" className="amount">
                            <span>
                              <small>{getAmountToDisplay(businessInfo.currency, estimatePayload.totalAmountInHomeCurrency)}</small>
                            </span>
                          </td>
                        </tr>)}
                      </tbody>
                    </Table>
                  </div>
                  <div className="py-box--footer">
                    <button
                      className="btn btn-primary"
                      type="submit"
                    // onClick={this.estimateFormSumbit}
                    >
                      Save
                    </button>
                  </div>
                </Form>
          )}
          <Popup
            type={type}
            openPopup={openPopup}
            onClosePopup={this.onPopupClose}
            updateList={this.updateList}
            setData={this.setData.bind(this)}
          />
        </div>
    );
  }
}

const mapPropsToState = state => ({
  userSettings: state.settings.userSettings,
  businessInfo: state.businessReducer.selectedBusiness
});
const mapDispatchToProps = (dispatch) => {
  return {
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    }
  };
};
export default withRouter(connect(mapPropsToState, mapDispatchToProps)(EstimateForm));
