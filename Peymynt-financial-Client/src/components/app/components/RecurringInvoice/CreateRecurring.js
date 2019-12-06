import history from "customHistory";
import { cloneDeep } from "lodash";
import moment from "moment";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Button,
  Col,
  Collapse,
  FormGroup,
  Input,
  Label,
  Tooltip,
  Spinner
} from "reactstrap";
import SelectBox from "utils/formWrapper/SelectBox";
import { DeleteModal } from "utils/PopupModal/DeleteModal";
import { openMailBox, openPayment } from "../../../../actions";
import { setUserSettings } from "../../../../actions/loginAction";
import { openGlobalSnackbar } from "../../../../actions/snackBarAction";
import { fetchSignedUrl, uploadImage } from "../../../../api/businessService";
import { currentExchangeRate } from "../../../../api/globalServices";
import { getInvoiceNumber } from "../../../../api/InvoiceService";
import {
  addRecurringInvoice,
  updateRecurringInvoice
} from "../../../../api/RecurringService";
import { addSalesSetting } from "../../../../api/SettingService";
import taxServices from "../../../../api/TaxServices";
import { changePriceFormat, toMoney, _documentTitle, _setCurrency, getAmountToDisplay, _showExchangeRate } from "../../../../utils/GlobalFunctions";
import SingleTax from "../../components/sales/components/Taxes/SingleTax";
import BusinessPopup from "../BusinessInfo/BusinessPopup";
import { EstimateBillToComponent, RenderShippingAddress } from "../Estimates/components/EstimateInvoiceComponent";
import CustomizeHeader from "../invoice/components/InvoiceForm/CustomizeHeader";
import InvoicePreview from "../invoice/components/InvoicePreview";
import {
  calculateTaxes,
  getSelectedCurrency,
  getSelectedCustomer,
  invoiceInput,
  INVOICE_ITEM,
  setFormData
} from "./helpers";
import { PAYMENT_DUE_OPTION } from "../../../../constants/recurringConst";
import AddCustomerPopup from './AddCustomerPopup';
import pluralize from 'pluralize';
import InvoicePreviewClassic from "../invoice/components/InvoicePreviewClassic";
import InvoicePreviewModern from "../invoice/components/InvoicePreviewModern";
import Popup from "../Estimates/components/Popup";

class CreateRecurring extends Component {
  state = {
    showExchange: false,
    openUpperDropdown: false,
    openBelowDropdown: false,
    collapse: false,
    tooltipAutoGenNo: false,
    tooltipAutoGenDate: false,
    showPreview: false,
    openBusinessPopup: false,
    selectedCustomer: undefined,
    selectedCurency: undefined,
    currencies: [],
    customers: [],
    products: [],
    taxList: [],
    showAlert: false,
    invoiceInput: invoiceInput(
      null,
      this.props.businessInfo,
      this.props.userSettings
    ),
    showCustomer: true,
    addCustomerModal: false,
    openPopup: false,
    hideAddButton: false,
    type: "All",
    editCustomer: false,
    businessInfo: this.props.businessInfo,
    loading: false
  };
  componentDidMount() {
    const { isEditMode, invoiceData, businessInfo, userSettings } = this.props;
    let formatedData = this.state.invoiceInput;
    if (isEditMode) {
      let showExchange = _showExchangeRate(invoiceData && invoiceData.currency, businessInfo && businessInfo.currency)
      formatedData = invoiceInput(invoiceData, businessInfo, userSettings);
      this.setState({ invoiceInput: formatedData, showExchange });
    }
    this.fetchtaxList();
    this.fetchFormData(formatedData);
    if (!isEditMode) this.createInvoiceNumber();
  }

  componentDidUpdate(prevProps) {
    const { invoiceData, businessInfo, userSettings } = this.props;
    if (prevProps.invoiceData !== invoiceData) {
      let showExchange = _showExchangeRate(invoiceData && invoiceData.currency, businessInfo && businessInfo.currency)
      let formatedData = invoiceInput(invoiceData, businessInfo, userSettings);
      this.setState({ invoiceInput: formatedData, showExchange });
      this.fetchFormData(formatedData);
    }
  }

  componentWillUnmount() {
    if (this.state.showAlert) {
      let data = window.confirm("are you sure");
      if (!data) {
        window.stop();
        history.push(this.props.location.pathname);
      }
    }
  }

  createInvoiceNumber = async () => {
    let result = await getInvoiceNumber();
    if (result.statusCode === 200) {
      this.setState({
        invoiceInput: {
          ...this.state.invoiceInput,
          invoiceNumber: result.data.invoiceNumber
        }
      });
    }
  };

  fetchtaxList = async () => {
    const response = (await taxServices.fetchTaxes()).data.taxes;
    this.setState({ taxList: response });
  };

  fetchFormData = async formatedData => {
    let stateData = {
      currencies: this.state.currencies,
      customers: this.state.customers,
      products: this.state.products
    };
    const listData = await setFormData(stateData, "all");
    this.setState(listData);
    // await this.calculateAmount(invoiceInput)
    await this.setFormData(listData, formatedData);
  };

  setFormData = async (listData, data) => {
    const { businessInfo } = this.props;
    const currencyValue = data.currency || businessInfo.currency;

    const selectedCustomer = await getSelectedCustomer(
      listData.customers,
      data.customer,
      businessInfo
    );
    const selectedCurency = await getSelectedCurrency(
      listData.currencies,
      currencyValue
    );
    _documentTitle(businessInfo, "")
    this.setState({ selectedCustomer, selectedCurency });
  };

  setData = (selected) => {
    const { businessInfo, invoiceData } = this.props;
    let { invoiceInput, selectedCurency, currencies, editCustomer, selectedCustomer } = this.state;
    invoiceInput.customer = (selected && selected._id || selected.id) || "";
    selectedCurency = getSelectedCurrency(
      currencies,
      _setCurrency(selected.currency, businessInfo.currency)
    );
    invoiceInput.currency = selectedCurency;
    console.log('selected', selected, invoiceData);
    this.setState({
      selectedCurency,
      selectedCustomer: selected,
      invoiceInput,
      showCustomer: true,
      showAlert: true,
    });
  };

  updateList = async fetch => {
    let stateData = {
      currencies: this.state.currencies,
      customers: this.state.customers,
      products: this.state.products
    };
    const listData = await setFormData(stateData, fetch);
    this.setState(listData);
    this.setState({ openPopup: false });
  };

  onPopupClose = async type => {
    let stateData = {
      currencies: this.state.currencies,
      customers: this.state.customers,
      products: this.state.products
    };
    if(!this.state.editCustomer){
      const data = await setFormData(stateData, type);
      this.setState(data);
    }
    this.setState({ openPopup: false });
  };

  toggleUpperDropdown = () => {
    this.setState(prevState => ({
      openUpperDropdown: !prevState.openUpperDropdown
    }));
  };
  toggleBelowDropdown = () => {
    this.setState(prevState => ({
      openBelowDropdown: !prevState.openBelowDropdown
    }));
  };

  toggleBusiness = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  toggleFooter = () => {
    this.setState({ footerCollapse: !this.state.footerCollapse });
  };

  handleOnInputChange = async (event, fieldName) => {
    let invoiceInput = cloneDeep(this.state.invoiceInput);
    if (fieldName && fieldName.includes("Date")) {
      invoiceInput[fieldName] = moment(event).format("YYYY-MM-DD");
      invoiceInput.dueDate =
        fieldName === "invoiceDate" && event >= new Date()
          ? moment(event).format("YYYY-MM-DD")
          : invoiceInput.dueDate;
    } else if (fieldName === "notifyStatus") {
      invoiceInput.notifyStatus = event;
    } else {
      const { name, value } = event.target;
      invoiceInput[name] = value;
    }
    this.setState({ invoiceInput, showAlert: true });
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
    this.closeHeader();
  };

  addItem = () => {
    let { invoiceInput, hideAddButton } = this.state;
    invoiceInput.items.push(INVOICE_ITEM);
    this.setState({
      invoiceInput,
      hideAddButton: true,
      openPopup: false,
      type: ""
    });
  };

  handleCustomer = selected => {
    console.log("inside Handle", selected)
    const { businessInfo } = this.props;
    if (selected && selected._id === "Add new customer") {
      this.setState({ openPopup: true, type: "CustomerPopup", addCustomerModal: true });
    } else {
      let { invoiceInput, selectedCurency, currencies } = this.state;
      invoiceInput.customer = (selected && selected) || "";
      invoiceInput.sendMail.to[0] = selected.email;
      selectedCurency = getSelectedCurrency(
        currencies,
        _setCurrency(selected && selected.currency, businessInfo.currency)
      );
      invoiceInput.currency = selectedCurency;
      this.setState({
        selectedCurency,
        selectedCustomer: selected,
        invoiceInput,
        showCustomer: true,
        showAlert: true
      });
    }
  };

  handleCurrency = async selected => {
    const { businessInfo } = this.props;
    let { invoiceInput } = this.state;
    let showExchange =
      selected && businessInfo && businessInfo.currency.code !== selected.code;
    invoiceInput.currency = selected;
    if (showExchange) {
      try {
        const { data } = await currentExchangeRate(
          selected.code,
          businessInfo.currency.code
        );
        invoiceInput.exchangeRate = data.exchangeRate;
      } catch (error) {
        console.error("----------------------error exchange change--- >", error);
        return error;
      }
    }
    this.setState({ showExchange, invoiceInput, showAlert: true }, () =>
      this.calculateAmount(invoiceInput)
    );
  };

  handleProductValue = (e, idx) => {
    const { name, value } = e.target;
    let updateInvoice = cloneDeep(this.state.invoiceInput);
    updateInvoice.items[idx][name] = value;
    this.setState({ invoiceInput: updateInvoice, showAlert: true });
  };

  handleProduct = (selected, i) => {
    let updateInvoice = cloneDeep(this.state.invoiceInput);
    let hideAddButton = this.state.hideAddButton;
    if (selected) {
      if (selected.target) {
        const { name, value } = selected.target;
        updateInvoice.items[i][name] = value;
        // if (["column3", "column4"].includes(name)) {
        //   updateInvoice.items[i]["amount"] =
        //   updateInvoice.items[i]["column3"] * updateInvoice.items[i]["column4"];
        // }
      } else {
        if (selected.item === "Add new product") {
          updateInvoice.items[updateInvoice.items.length - 1].item = "";
          this.setState({ openPopup: true, type: "ProductPopup" });
        } else {
          updateInvoice.items[i] = selected;
        }
        hideAddButton = false;
      }
      updateInvoice.items[i]["amount"] =
        updateInvoice.items[i]["column3"] * updateInvoice.items[i]["column4"];
        // updateInvoice.items[i]["column4"] = parseFloat(updateInvoice.items[i]["column4"]).toFixed(2)
    } else {
      updateInvoice.items[i] = INVOICE_ITEM;
    }
    console.log("updateInvoice", updateInvoice)
    this.setState(
      {
        invoiceInput: updateInvoice,
        selectedProduct: selected,
        hideAddButton,
        showAlert: true
      },
      () => {
        this.calculateAmount(updateInvoice);
      }
    );
  };

  calculateAmount = async (invoiceData) => {
    let { showExchange, taxList } = this.state;
    let invoiceInput = cloneDeep(invoiceData);
    let result = await calculateTaxes(invoiceInput.items, taxList);
    console.log('calculateTaxes', result, invoiceInput)
    invoiceInput.amountBreakup = {
      subTotal: result.sumAmount,
      taxTotal: result.taxsTotal,
      total: result.amount
    };
    invoiceInput.totalAmount = result.amount;
    invoiceInput.totalAmountInHomeCurrency = showExchange
      ? (invoiceInput.exchangeRate * result.amount)
      : 0;

    this.setState({ invoiceInput });
  };

  handleDelete = idx => {
    let invoiceInput = this.state.invoiceInput;
    invoiceInput.items = invoiceInput.items.filter((s, index) => {
      return !(index === idx);
    });
    this.setState({ invoiceInput, hideAddButton: false });
    this.calculateAmount(invoiceInput);
  };

  onSubmitInvoice = async option => {
    console.log("invoice data==> ", this.state.invoiceInput);
    this.setState({ showAlert: false, loading: true });

    const {
      openPayment,
      openMailBox,
      isEditMode,
      invoiceData,
      showSnackbar
    } = this.props;
    try {
      let invoiceInput = cloneDeep(this.state.invoiceInput);
      // invoiceInput.customer = invoiceInput.customer._id;
      let response;
      invoiceInput.amountBreakup.taxTotal = invoiceInput.amountBreakup.taxTotal.map(item => {
        item.taxName = item.taxName._id;
        return item
      });
      if (typeof invoiceInput.customer === 'object') {
        invoiceInput.customer = invoiceInput.customer._id || invoiceInput.customer.id;
      }
      invoiceInput.notes = this.refs.notes.innerHTML;
      invoiceInput.notes = invoiceInput.notes == "<br>" ? "" : invoiceInput.notes;

      if (isEditMode) {
        const id = invoiceData._id;
        invoiceInput.businessId = invoiceInput.businessId._id;
        invoiceInput.userId =
          typeof invoiceInput.userId === "object"
            ? invoiceInput.userId._id
            : invoiceInput.userId;
        delete invoiceInput._id;
        response = await updateRecurringInvoice(id, { invoiceInput });
        showSnackbar("Invoice Update Successfully", false);
      } else {
        delete invoiceInput._id;
        invoiceInput.dueAmount = invoiceInput.totalAmount;
        response = await addRecurringInvoice({ invoiceInput });
        showSnackbar("Invoice created successfully", false);
      }
      if (response) {
        if (option === "Payment") {
          openPayment();
        } else if (option === "Send") {
          openMailBox();
        }
        history.push(`/app/recurring/view/${response.data.invoice._id}`);
        this.setState({loading: false})
      }
    } catch (error) {
      console.log("error in recurring post query", error.message);
      showSnackbar(error.message, true);
      this.setState({loading: false})
    }
    // history.push(`/app/recurring/view/5ca615fff096f94d3f406c09`);
  };

  handleTaxChange = (selected, i) => {
    let { invoiceInput } = this.state;
    let selectedTax = selected.map(item => {
      if (item) {
        return item.value;
      }
    });
    invoiceInput.items[i].taxes = selectedTax;

    this.setState({ invoiceInput }, () => this.calculateAmount(invoiceInput));
  };

  _setPrice = (i, e) => {
    const { name, value } = e.target;
    let {invoiceInput} = this.state;
    invoiceInput.items[i][name] = parseFloat(value).toFixed(2)
    if(!!value){
      this.setState({
        invoiceInput
      })
    }
  }

  renderTableRow = () => {
    const { products, taxList, openPopup, type, businessInfo } = this.state;
    const { items, currency } = this.state.invoiceInput;
    return items.length > 0
      ? items.map((item, i) => {
        return (
          <Fragment>
            {item.item === undefined ? (
              <div key={i} className="invoice-item-table-body">
                <div className="py-table__cell w-100">
                  <SelectBox
                    autofocus={true}
                    openOnFocus={true}
                    valueKey={"item"}
                    labelKey={"column1"}
                    className="h-100 select-height"
                    placeholder="Type an item name"
                    value={undefined}
                    onChange={item => this.handleProduct(item, i)}
                    options={products}
                  />
                </div>
                <div className="py-table__cell bin-cell">
                  <span onClick={() => this.handleDelete(i)}>
                    {/* <i className="far fa-trash-alt fa-xs" /> */}
                    <i className="fa fa-trash-o" />
                  </span>
                </div>
              </div>
            ) : (
                <Fragment>
                  <div key={i} className="invoice-item-table-body">
                    <div className="py-table__cell all_scroll_effect">:::</div>
                    <div className="py-table__cell item-cell">
                      {openPopup && type === "ProductPopup" ? (
                        <Input
                          name="column1"
                          className="form-control"
                          placeholder="Enter item name"
                          value={item.column1}
                          onChange={e => this.handleProductValue(e, i)}
                          style={{ height: "40px" }}
                        />
                      ) : (
                          <label>{item.column1}</label>
                        )}
                    </div>
                    <div className="py-table__cell detail-cell">
                      <Input
                        type="textarea"
                        name="column2"
                        //   onChange={e => this.onTextChange(e, i)}
                        className="form-control"
                        placeholder="Enter item description"
                        value={item.column2}
                        onChange={e => this.handleProduct(e, i)}
                        style={{ height: "40px" }}
                      />
                    </div>
                    <div className="py-table__cell quantity-cell">
                      <Input
                        // type="text"
                        type="number"
                        step="any"
                        className="form-control"
                        name="column3"
                        onChange={e => this.handleProduct(e, i)}
                        value={item.column3}
                      />
                    </div>
                    <div className="py-table__cell price-cell">
                      <Input
                        // type="text"
                        className="form-control"
                        maxLength="11"
                        type="number"
                        step="any"
                        name="column4"
                        onChange={e => this.handleProduct(e, i)}
                        value={item.column4}
                        onBlur={this._setPrice.bind(this, i)}
                      />
                    </div>
                    <div className="py-table__cell amount-cell">
                      {`${getAmountToDisplay(_setCurrency(currency, businessInfo.currency), item.amount || item.column4)}`}
                    </div>
                    <div className="py-table__cell bin-cell">
                      <span onClick={() => this.handleDelete(i)}>
                        {/* <i className="far fa-trash-alt fa-xs" /> */}
                        <i className="fa fa-trash-o" />
                      </span>
                    </div>
                  </div>
                  <div className="invoice-item-table-body">
                    <div className="invoice-item-income-account">
                      {/* Edit income account */}
                    </div>
                    <div
                      className="invoice-item-row-tax-section__taxes"
                      style={{ width: "50%" }}
                    >
                      <SingleTax
                        taxValue={item}
                        currencySymbol={_setCurrency(currency, businessInfo.currency).symbol}
                        isEditMode={true}
                        index={i}
                        taxList={taxList}
                        multi={false}
                        fetchtaxList={this.fetchtaxList}
                        onChange={this.handleTaxChange}
                      />
                    </div>
                  </div>
                </Fragment>
              )}
          </Fragment>
        );
      })
      : "";
  };

  onCustomerChange = () => {
    this.handleCustomer(undefined);
  };

  onPreviewClick = () => {
    this.setState({
      invoiceInput: {
        ...this.state.invoiceInput,
        dueAmount: this.state.invoiceInput.totalAmount
      },
      showPreview: !this.state.showPreview
    });
  };

  onSaveAndSend = () => {
    this.onSubmitInvoice("Send");
  };

  onSaveAndPayment = () => {
    this.onSubmitInvoice("Payment");
  };

  onShowCustomer = () => {
    this.setState({ showCustomer: !this.state.showCustomer });
  };

  onEditBusiness = () => {
    this.setState({
      openBusinessPopup: true
    });
  };

  onEditBusinessClose = (info) => {
    this.setState({
      openBusinessPopup: false,
      businessInfo: info
    });
  };

  onImageUpload = async event => {
    const file = event.target.files[0];
    let imageUrl;
    if (file) {
      imageUrl = await this.getSignedUrl(file);
    }
    this.onUpdateSettings(event, imageUrl);
  };

  getSignedUrl = async file => {
    try {
      const payload = {
        s3Input: {
          contentType: file.type,
          fileName: file.name
        }
      };
      const response = await fetchSignedUrl(payload);
      const { sUrl, pUrl } = response.data.signedUrl;
      if (sUrl) {
        await uploadImage(sUrl, file);
        return pUrl;
      }
    } catch (error) {
      this.props.showSnackbar("Something went wrong, please try again", true);
    }
  };

  removeLogoConfirmation = () => {
    this.setState(prevState => ({
      deleteLogoConfirmation: !prevState.deleteLogoConfirmation
    }));
  };

  onUpdateSettings = async (e, imageUrl) => {
    let userSettings = cloneDeep(this.props.userSettings);
    userSettings.companyLogo = imageUrl ? imageUrl : "";
    delete userSettings._id;
    delete userSettings.createdAt;
    delete userSettings.updatedAt;
    delete userSettings.__v;
    delete userSettings.itemHeading.savedForFuture;
    let salesSettingInput = {
      ...userSettings
    };
    try {
      let request = await addSalesSetting({ salesSettingInput });
      !imageUrl && this.removeLogoConfirmation();
      this.props.setUserSettings(request.data.salesSetting);
    } catch (error) {
      this.props.showSnackbar("Something went wrong, please try again", true);
    }
  };

  toggleToolTip = tooltip => {
    if (tooltip === "Auto-generated-Number") {
      this.setState(prevState => ({
        tooltipAutoGenNo: !prevState.tooltipAutoGenNo
      }));
    } else {
      this.setState(prevState => ({
        tooltipAutoGenDate: !prevState.tooltipAutoGenDate
      }));
    }
  };

  _handleShowCustomer = data => {
    this.setState({ addCustomerModal: !this.state.addCustomerModal, showCustomer: false, invoiceInput: { ...this.state.invoiceInput, customer: data }, selectedCustomer: data })
  }

  handleEditCustomer(){
    this.setState({openPopup: true, type: "CustomerPopup", addCustomerModal: true, editCustomer: true})
  }

  render() {
    const {
      invoiceInput,
      openHeader,
      customers,
      selectedCustomer,
      currencies,
      showExchange,
      showPreview,
      showCustomer,
      addCustomerModal,
      openPopup,
      type,
      deleteLogoConfirmation,
      openBusinessPopup,
      tooltipAutoGenNo,
      tooltipAutoGenDate,
      businessInfo,
      loading
    } = this.state;
    const { isEditMode, userSettings, invoiceData } = this.props;
    const { itemHeading } = invoiceInput;
    console.log('in edit', this.state)
    return (
      <Fragment>
        <div className="content-wrapper__main__fixed">
          <header className="py-header--page">
            <div className="py-header--title">
              <div className="py-heading--title">
                {isEditMode
                  ? `Edit recurring invoice #${invoiceInput.invoiceNumber}`
                  : "New recurring invoice"}{" "}
              </div>
            </div>

            <div className="py-header--actions">
                <Button
                  onClick={this.onPreviewClick}
                  className="btn btn-outline-primary mr-2"
                >
                  {showPreview ? "Edit" : "Preview"}
                </Button>

                  <Button onClick={() => this.onSubmitInvoice()} className="btn btn-primary">
                    {loading ? <Spinner color="primary" size="md" className="loader btnLoader" /> : 'Save and continue'}
                  </Button>

              </div>
          </header>
          {showPreview ? (
            <Fragment>
              <div className="py-notify py-notify--info">
                <div className="py-notify__icon-holder">
                   <svg viewBox="0 0 20 20" className="py-svg-icon" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
                </div>
                <div className="py-notify__content-wrapper">
                <div className="py-notify__content">
                <div className="py-notify__message">
                  This is a preview of your invoice. Switch back to Edit if you
                  need to make changes.
                  </div>
                  </div>
                </div>
              </div>
              {
                userSettings.template === "classic" ?
                  (<InvoicePreviewClassic
                    ref={el => (this.componentRef = el)}
                    invoiceData={invoiceInput}
                    userSettings={userSettings}
                    businessInfo = {businessInfo}
                  />)
                : userSettings.template === "modern" ?
                  (<InvoicePreviewModern
                    ref={el => (this.componentRef = el)}
                    invoiceData={invoiceInput}
                    userSettings={userSettings}
                    businessInfo = {businessInfo}
                  />)
                :
                  (<InvoicePreview
                    ref={el => (this.componentRef = el)}
                    invoiceData={invoiceInput}
                    userSettings={userSettings}
                    businessInfo = {businessInfo}
                  />)
              }
            </Fragment>
          ) : (
              <div className="content">
                <div className="shadow-box border-0 card-wizard card">
                  <div className="invoice-add__body">
                    <div className="content">
                      <div className="invoice-view__collapsible">
                      <div className={
                                      this.state.collapse
                                        ? "invoice-view__collapsible-button is-open"
                                        : "invoice-view__collapsible-button"
                                    }>

                                <Button
                                  color="grey"
                                  className="btn-link"
                                  onClick={this.toggleBusiness}
                                >
                                    <div className="invoice-view__collapsible-button__content">
                                      <div>Business address and contact details, title, summary,
                                      and logo
                                      </div>
                                        <div className="invoice-view__collapsible-button__expand-icon">
                                            <svg viewBox="0 0 20 20" id="expand" xmlns="http://www.w3.org/2000/svg"><path d="M10 12.586l6.293-6.293a1 1 0 0 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 1.414-1.414L10 12.586z"></path></svg>
                                         </div>
                                    </div>
                                
                              </Button>

                            </div>
                        <Collapse isOpen={this.state.collapse}>
                          <div className="py-box py-box--large no-border">
                            <div className="row no-gutters">
                              <Col xs={12} sm={6} md={6} lg={6} >
                                {userSettings && userSettings.companyLogo !== "" ?
                                  <div className="edit-info info-logo" style={{ color: '#9f55ff', cursor: 'pointer' }}>
                                    <img src={userSettings.companyLogo} alt="" /><br /><br />
                                    <strong style={{ color: '#9f55ff' }} onClick={this.removeLogoConfirmation}>
                                      {" "}
                                      Remove logo{" "}
                                    </strong>
                                  </div>
                                  :
                                  <div className="uploader-zone">
                                    <img src="/assets/upload.svg" />
                                    <div className="py-text--browse"> Browse your logo here. </div>
                                    <div className="py-text--hint"> Maximum 5MB in size. <br />JPG, PNG, or GIF formats.</div>
                                    <div className="py-text--hint"> Recommended size: 300 x 200 pixels.</div>
                                    <Input type="file" name='companyLogo' onChange={this.onImageUpload} accept=".jpg,.png,.jpeg" />
                                  </div>}
                              </Col>
                              <Col xs={12} sm={6} md={6} lg={6}>
                                <FormGroup>
                                  <Input className="jumbo-text"
                                    style={{
                                      textAlign: "right"
                                    }}
                                    type="text"
                                    name="title"
                                    value={invoiceInput.title}
                                    onChange={this.handleOnInputChange}
                                  />
                                </FormGroup>
                                <FormGroup>
                                  <Input
                                    style={{
                                      marginTop: "0px",
                                      marginBottom: "0px",
                                      height: "35px",
                                      textAlign: "right"
                                    }}
                                    type="text"
                                    name="subTitle"
                                    value={invoiceInput.subTitle}
                                    placeholder="Summary (e.g. project name, description of invoice)"
                                    onChange={this.handleOnInputChange}
                                  />
                                </FormGroup>
                                <div className="business-inof text-right">
                                  <strong>
                                    {" "}
                                    {businessInfo &&
                                      businessInfo.organizationName}
                                  </strong>
                                  {businessInfo ? businessInfo.address ? (
                                    <div className="address">
                                      <div className="address_field">
                                        {" "}
                                        <span> {businessInfo.address.addressLine1 ? businessInfo.address.addressLine1 : ""} </span>{" "}
                                      </div>
                                      <div className="address_field">
                                        {" "}
                                        <span>
                                          {" "}
                                          {`${businessInfo.address.city ? businessInfo.address.city : ""},`} {businessInfo.address.state && businessInfo.address.state.name ? businessInfo.address.state.name : ""} {businessInfo.address.postal ? businessInfo.address.postal : ""}
                                        </span>
                                      </div>
                                      <div className="address_field">
                                        {" "}
                                        <span>{businessInfo.address.country && businessInfo.address.country.name ? businessInfo.address.country.name : ""}</span>{" "}
                                      </div>
                                    </div>
                                  ) : "" : ""}
                                  {businessInfo && businessInfo.communication && (
                                    <div className="address">
                                      {businessInfo.communication.phone && (<div className="address__field"> Phone: {businessInfo.communication.phone}</div>)}
                                      {businessInfo.communication.fax && (<div className="address__field">Fax: {businessInfo.communication.fax}</div>)}
                                      {businessInfo.communication.mobile && (<div className="address__field"> Mobile: {businessInfo.communication.mobile}</div>)}
                                      {businessInfo.communication.tollFree && (<div className="address__field">
                                        {" "}
                                        Toll free: {businessInfo.communication.tollFree}
                                      </div>)}
                                      {businessInfo.communication.website && (<div className="address__field">{businessInfo.communication.website}</div>)}
                                    </div>
                                  )}
                                  <div className="edit-info" style={{ color: '#9f55ff', cursor: 'pointer' }}>
                                    <a className="py-text--link" style={{ color: '#9f55ff' }} onClick={this.onEditBusiness}>
                                      {" "}
                                      Edit your business address and contact details{" "}
                                    </a>
                                  </div>
                                </div>
                              </Col>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                      <div className="py-box is-highlighted">
                          <div className="row recurring__invoice__form__header">
                            <Col md={6} >
                              {selectedCustomer ? (
                                <Fragment>
                                  <div className="classic-template__metadata">
                                    <EstimateBillToComponent
                                      estimateKeys={selectedCustomer}
                                    />
                                    <RenderShippingAddress
                                      addressShipping={selectedCustomer.addressShipping}
                                    />
                                  </div>
                                  <strong className="invoice-view-payment-section__content p-0">
                                    <a className="py-text--link" onClick={this.handleEditCustomer.bind(this)}>
                                      {`Edit ${selectedCustomer.customerName}`}
                                    </a>
                                    {" • "}
                                    <a
                                      className="py-text--link"
                                      onClick={this.onCustomerChange}
                                    >
                                      {"Choose a different customer"}
                                    </a>
                                  </strong>
                                  {/* <a
                                  onClick={this.onCustomerChange}
                                  className="additem"
                                >
                                  <strong>Choose a different customer</strong>
                                </a> */}
                              </Fragment>
                              ) : (
                                  <Fragment>
                                    <div className="invoice-add-customer">
                                      {showCustomer ? (
                                        <Button
                                          onClick={this.onShowCustomer}
                                          className="add-customer-btn"
                                        >
                                          <img src="/assets/add-user.svg" />
                                          Add customer
                                    </Button>
                                      ) : (
                                          <SelectBox
                                            // autoFocus={true}
                                            autofocus={true}
                                            openOnFocus={true}
                                            labelKey={"customerName"}
                                            valueKey={"_id"}
                                            value={invoiceInput.customer}
                                            onChange={this.handleCustomer}
                                            options={customers}
                                            clearable={false}
                                          />
                                        )}
                                    </div>
                                  </Fragment>
                                )}
                            </Col>
                            <Col md={5} className="ml-auto">
                              <FormGroup className="py-form-field py-form-field--inline align-items-center">
                                <Label
                                  for="exampleEmail"
                                  className="py-form-field__label"
                                >
                                  Invoice number
                              </Label>
                                <div
                                className="py-form-field__element"
                                  id="autoGenerateRecurringNumber"
                                >
                                  <Label data-toggle="tooltip" title="The invoice number will be automatically assigned when each recurring is generated.">Auto-generated</Label>
                                </div>
                              </FormGroup>
                              <FormGroup className="py-form-field py-form-field--inline">
                                <Label
                                  for="exampleEmail"
                                  className="py-form-field__label"
                                >
                                  P.O./S.O. number
                              </Label>
                                <div className="py-form-field__element">
                                  <Input
                                    type="Text"
                                    value={invoiceInput.postal}
                                    name="postal"
                                    className="py-form__element__small"
                                    onChange={this.handleOnInputChange}
                                    id="exampleEmail"
                                  />
                                </div>
                              </FormGroup>
                              <FormGroup className="py-form-field py-form-field--inline align-items-center">
                                <Label
                                  for="exampleEmail"
                                  className="py-form-field__label"
                                >
                                  Invoice date
                              </Label>
                                <div className="py-form-field__element"
                                  id="autoGenerateRecurringDate">
                                  <Label>Auto-generated</Label>
                                  <Tooltip
                                    placement="top"
                                    isOpen={tooltipAutoGenDate}
                                    target="autoGenerateRecurringDate"
                                    toggle={() =>
                                      this.toggleToolTip("Auto-generated-Date")
                                    }
                                  >
                                    <strong>
                                      The invoice date will be automatically
                                      assigned based on the invoice schedule and
                                      frequency.
                                  </strong>
                                  </Tooltip>
                                </div>
                              </FormGroup>
                              <FormGroup className="py-form-field py-form-field--inline">
                                <Label
                                  for="exampleEmail"
                                  className="py-form-field__label"
                                >
                                  Payment due
                              </Label>
                                <div className="py-form-field__element">
                                  <SelectBox
                                    labelKey={"value"}
                                    valueKey={"key"}
                                    value={invoiceInput.notifyStatus}
                                    onChange={e =>
                                      this.handleOnInputChange(e, "notifyStatus")
                                    }
                                    options={PAYMENT_DUE_OPTION}
                                    clearable={false}
                                    className="py-form__element__small"
                                  />
                                </div>
                              </FormGroup>
                            </Col>
                          </div>

                        <div className="invoice-add-info__section">
                          <div className="invoice-add-info__customize-tab">
                            <a
                              className="py-text--link py-text--strong"
                              onClick={this.handleHeader}
                            >
                              {" "}
                              <span className="py-icon mr-1">
                                <svg viewBox="0 0 20 20" id="edit" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 13.836L16.586 6 14 3.414 6.164 11.25l2.586 2.586zm-1.528 1.3l-2.358-2.358-.59 2.947 2.948-.59zm11.485-8.429l-10 10a1 1 0 0 1-.51.274l-5 1a1 1 0 0 1-1.178-1.177l1-5a1 1 0 0 1 .274-.511l10-10a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414z"></path></svg>
                              </span>
                              Edit columns
                          </a>
                          </div>

                          <CustomizeHeader
                            invoice={invoiceInput}
                            openHeader={openHeader}
                            onClose={this.closeHeader}
                            onSave={this.onHeaderChange}
                          />
                          <div className="invoice-add-info__itemtable">
                            <div className="py-frame">
                              <div className="invoice-item-table">
                                <div className="invoice-item-table-header">
                                  <div className="py-table__cell all_scroll_effect">{/* :::: */}</div>
                                  <div className="py-table__cell item-cell py-text--strong">
                                    {itemHeading.hideItem ? <img className="eye_logo" src="/assets/eye.png" /> : ""}
                                    {itemHeading.column1.name}
                                  </div>
                                  <div className="py-table__cell detail-cell" />
                                  <div className="py-table__cell quantity-cell py-text--strong">
                                    {itemHeading.hideQuantity ? <img className="eye_logo" src="/assets/eye.png" /> : ""}
                                    {itemHeading.column2.name}
                                  </div>
                                  <div className="py-table__cell price-cell py-text--strong">
                                    {itemHeading.hidePrice ? <img className="eye_logo" src="/assets/eye.png" /> : ""}
                                    {itemHeading.column3.name}
                                  </div>
                                  <div className="py-table__cell amount-cell py-text--strong">
                                    {itemHeading.hideAmount ? <img className="eye_logo" src="/assets/eye.png" /> : ""}
                                    {/* <img className="eye_logo" src="/assets/eye.png" />{" "}<br /> */}
                                    {itemHeading.column4.name}
                                  </div>
                                  <div className="py-table__cell bin-cell py-text--strong">
                                    &nbsp;
                                </div>
                                </div>
                                {this.renderTableRow()}
                              </div>
                            </div>
                            {!this.state.hideAddButton ? <button onClick={this.addItem} className="btn btn-add-invoice">
                              <i className="py-icon pe pe-7s-plus fn py-text--strong"/>{" "}&nbsp;Add {itemHeading.column1.name.toLowerCase() === 'items' ? `an ${pluralize.singular(itemHeading.column1.name.toLowerCase())}` : `a ${pluralize.singular(itemHeading.column1.name.toLowerCase())}`}
                          </button> : ""}
                            <section className="invoice-add-totals__totals">
                              <div className="invoice-add-totals__totals__amounts">
                                <div className="invoice-add-totals__totals__amounts__line">
                                  <div className="invoice-add-totals__totals__amounts__line__label">
                                    Subtotal
                                </div>
                                  <div className="invoice-add-totals__totals__amounts__line__amount">
                                    {`${getAmountToDisplay(_setCurrency(invoiceInput.currency, businessInfo.currency), invoiceInput.amountBreakup.subTotal)}`}
                                  </div>
                                </div>

                                {invoiceInput.amountBreakup.taxTotal.length
                                  ? invoiceInput.amountBreakup.taxTotal.map(
                                    (item, index) => {
                                      return (
                                        <Fragment key={index}>
                                          <div className="invoice-add-totals__totals__amounts__line">
                                            <div className="invoice-add-totals__totals__amounts__line__label">
                                              {typeof (item.taxName) === 'object' ?
                                                `${item.taxName.abbreviation} ${item.rate > 0 ? `${item.rate}%` : ""} ${item.taxName.other.showTaxNumber ? item.taxName.taxNumber ? `(${item.taxName.taxNumber})` : '' : ""}`
                                                : `${item.taxName}`
                                              }
                                            </div>
                                            <div className="invoice-add-totals__totals__amounts__line__amount">
                                              {`${getAmountToDisplay(_setCurrency(invoiceInput.currency, businessInfo.currency), item.amount)}`}
                                            </div>
                                          </div>
                                        </Fragment>
                                      );
                                    }
                                  )
                                  : null}

                                <div className="invoice-add-totals__totals__amounts__line">
                                  <div className="invoice-add-totals__totals__amounts__line__label__currency-select d-flex">
                                        <strong className="py-text--strong">Total{" "}</strong>

                                        <SelectBox
                                          labelKey={"displayName"}
                                          valueKey={"code"}
                                          value={_setCurrency(invoiceInput.currency, businessInfo.currency)}
                                          onChange={this.handleCurrency}
                                          options={currencies}
                                          clearable={false}
                                          className="d-inline-block ml-3 text-left py-select--medium"
                                        />
                                  </div>
                                  <div className="invoice-add-totals__totals__amounts__line__amount">
                                    <strong>
                                      {getAmountToDisplay(_setCurrency(invoiceInput.currency, businessInfo.currency), invoiceInput.amountBreakup.total)}
                                    </strong>
                                  </div>
                                  {}
                                </div>
                                {showExchange && (
                                  <div className="invoice-add-totals__totals__amounts__line">
                                    <div className="">Currency conversion:</div>
                                    <div className="">
                                      {`${
                                        invoiceInput.currency && businessInfo.currency.symbol
                                        }${toMoney(invoiceInput.totalAmountInHomeCurrency)} (${businessInfo.currency.code}) to ${
                                        invoiceInput.exchangeRate
                                        }`}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </section>
                          </div>
                        </div>
                        <div className="invoice-memo">
                          <strong className="color-muted">Notes</strong>
                          <textarea
                            type="textarea"
                            ref="notes"
                            name="notes"
                            rows={'3'}
                            value={invoiceInput.notes}
                            onChange={this.handleOnInputChange}
                            placeholder="Enter notes that are visible to your customer"
                            className="reactStrap-design noBorder p-0"
                          />
                        </div>
                      </div>

                      <div className="invoice-view__collapsible invoice-view__footer">
                        <div className={
                                      this.state.collapse
                                        ? "invoice-view__collapsible-button is-open"
                                        : "invoice-view__collapsible-button"
                                    }>
                              <Button
                                color="grey"
                                className="btn-link"
                                onClick={this.toggleFooter}
                              >
                                
                                  <div className="invoice-view__collapsible-button__content">
                                    <div>
                                      Footer
                                    </div>

                                    <div className="invoice-view__collapsible-button__expand-icon">
                                        <svg viewBox="0 0 20 20" id="expand" xmlns="http://www.w3.org/2000/svg"><path d="M10 12.586l6.293-6.293a1 1 0 0 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 1.414-1.414L10 12.586z"></path></svg>
                                    </div>
                                  </div>
                              </Button>
                            </div>

                            <Collapse className="py-box" isOpen={this.state.footerCollapse}>
                              <Input
                                type="textarea"
                                value={invoiceInput.footer}
                                onChange={this.handleOnInputChange}
                                name="footer"
                                placeholder="Enter a footer for this invoice (e.g. tax information, thank you note)"
                              />
                            </Collapse>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          {showPreview ? null : (
            <div className="d-flex justify-content-end align-items-center" style={{ marginBottom: "50px" }}>
                  <Button
                    onClick={this.onPreviewClick}
                    className="btn btn-outline-primary mr-2"
                  >
                    Preview
                  </Button>

                    <Button className="btn btn-primary" onClick={() => this.onSubmitInvoice()}>
                      {loading ? <Spinner color="primary" size="md" className="loader btnLoader" /> : 'Save and continue'}
                    </Button>
            </div>
          )}
        </div>
        <DeleteModal
          message={`Removing your logo will remove it from all existing and future invoices.
        Are you sure you want to remove your business logo?`}
          openModal={deleteLogoConfirmation}
          onDelete={this.onUpdateSettings}
          onClose={this.removeLogoConfirmation}
        />
        <BusinessPopup
          openPopup={openBusinessPopup}
          onClose={this.onEditBusinessClose}
        />
        <Popup
          type={type}
          openPopup={openPopup}
          onClosePopup={this.onPopupClose}
          updateList={this.updateList}
          setData={this.setData.bind(this)}
          isEditMode={this.state.editCustomer}
          customer={selectedCustomer}
          invoice = {invoiceInput}
          invoiceData={invoiceData}
        />
      </Fragment>
    );
  }
}
const mapPropsToState = state => ({
  userSettings: state.settings.userSettings,
  businessInfo: state.businessReducer.selectedBusiness
});
const mapDispatchToProps = dispatch => {
  return {
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error));
    },
    openPayment: () => {
      dispatch(openPayment());
    },
    openMailBox: () => {
      dispatch(openMailBox());
    },
    setUserSettings: data => {
      dispatch(setUserSettings(data));
    }
  };
};
export default withRouter(
  connect(
    mapPropsToState,
    mapDispatchToProps
  )(CreateRecurring)
);
