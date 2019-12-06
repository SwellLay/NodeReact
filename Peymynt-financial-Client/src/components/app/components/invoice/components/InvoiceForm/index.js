import history from "customHistory";
import { cloneDeep } from "lodash";
import moment from "moment";
import pluralize from 'pluralize';
import React, { Fragment } from "react";
import { FormText } from "react-bootstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactSVG from 'react-svg';
import {
  Button,
  Col,
  Collapse,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import SelectBox from "utils/formWrapper/SelectBox";
import { DeleteModal } from "utils/PopupModal/DeleteModal";
import { openMailBox, openPayment } from "../../../../../../actions";
import { setUserSettings } from "../../../../../../actions/loginAction";
import { openGlobalSnackbar } from "../../../../../../actions/snackBarAction";
import { fetchSignedUrl, uploadImage } from "../../../../../../api/businessService";
import { currentExchangeRate } from "../../../../../../api/globalServices";
import { addInvoice, getInvoiceNumber, updateInvoice } from "../../../../../../api/InvoiceService";
import { addSalesSetting, patchSalesSetting } from "../../../../../../api/SettingService";
import taxServices from "../../../../../../api/TaxServices";
import CenterSpinner from "../../../../../../global/CenterSpinner";
import { ValidationMessages } from "../../../../../../global/ErrorBoxes/Message";
import { _documentTitle, _showExchangeRate, getAmountToDisplay, _calculateExchangeRate, _setCurrency } from "../../../../../../utils/GlobalFunctions";
import BusinessPopup from "../../../BusinessInfo/BusinessPopup";
import { EstimateBillToComponent, RenderShippingAddress } from "../../../Estimates/components/EstimateInvoiceComponent";
import Popup from "../../../Estimates/components/Popup";
import SingleTax from "../../../sales/components/Taxes/SingleTax";
import {
  calculateTaxes,
  getSelectedCurrency,
  getSelectedCustomer,
  INVOICE_ITEM,
  invoiceInput,
  setFormData
} from "../../helpers";
import InvoicePreview from "../InvoicePreview";
import InvoicePreviewClassic from "../InvoicePreviewClassic";
import InvoicePreviewModern from "../InvoicePreviewModern";
import CustomizeHeader from "./CustomizeHeader";

class InvoiceForm extends React.Component {
  state = {
    showExchange: false,
    openProduct: false,
    openUpperDropdown: false,
    openBelowDropdown: false,
    collapse: false,
    showPreview: false,
    openBusinessPopup: false,
    popoverOpen: false,
    selectedCustomer: undefined,
    selectedCurency: undefined,
    currencies: [],
    customers: [],
    products: [],
    taxList: [],
    showAlert: false,
    invoiceInput: invoiceInput(null, this.props.businessInfo, this.props.userSettings),
    showCustomer: true,
    openPopup: false,
    hideAddButton: false,
    type: "All",
    editCustomer: false,
    loader: true,
    businessInfo: this.props.businessInfo,
    messages: [],
    oldInvoiceDate: moment().format("YYYY-MM-DD")
  };
  componentDidMount() {
    const { isEditMode, invoiceData, businessInfo, userSettings } = this.props;
    let formatedData = this.state.invoiceInput;
    if (isEditMode) {
      formatedData = invoiceInput(invoiceData, businessInfo, userSettings);
      let showExchange = _showExchangeRate(businessInfo.currency, formatedData.currency)
      this.setState({ invoiceInput: formatedData, showExchange, businessInfo });
    }
    this.fetchtaxList();
    this.fetchFormData(formatedData);
    if (!isEditMode) this.createInvoiceNumber();
  }

  componentDidUpdate(prevProps) {
    const { invoiceData, businessInfo, userSettings } = this.props;
    if (prevProps.invoiceData !== invoiceData) {
    console.log("businessCurrency, matchCurrency", businessInfo.currency, prevProps.invoiceData)
      let showExchange = _showExchangeRate(businessInfo.currency, invoiceData.currency);
      let formatedData = invoiceInput(invoiceData, businessInfo, userSettings);
      this.setState({ invoiceInput: formatedData, showExchange, businessInfo });
      this.fetchFormData(formatedData);
    }
  }

  componentWillUnmount() {
    if (this.state.showAlert) {

      let data = window.confirm("Your changes will be lost if you don't save your invoice.");
      if (!data) {
        window.stop();
        // return false;
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
    this.setState({ taxList: response })
  };

  fetchFormData = async formatedData => {
    let stateData = {
      currencies: this.state.currencies,
      customers: this.state.customers,
      products: this.state.products
    };
    const listData = await setFormData(stateData, "all");
    this.setState(listData);
    // await this.calculateAmount()
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
    this.setState({ selectedCustomer, selectedCurency, loader: false });
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
    if (!this.state.editCustomer) {
      const data = await setFormData(stateData, type);
      this.setState(data);
    }
    this.setState({ openPopup: false, editCustomer: false });
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

  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  handleOnInputChange = (event, fieldName) => {
    const invoiceInput = cloneDeep(this.state.invoiceInput);
    if (fieldName && fieldName.includes("Date")) {
      invoiceInput[fieldName] = moment(event).format("YYYY-MM-DD");
      invoiceInput.dueDate = fieldName === "invoiceDate" && invoiceInput.invoiceDate >= invoiceInput.dueDate ? invoiceInput.invoiceDate : invoiceInput.dueDate
    } else {
      const { name, value } = event.target;
      invoiceInput[name] = value;
    }
    this.setState({ invoiceInput, showAlert: true, oldInvoiceDate: this.state.invoiceInput.invoiceDate });
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

  addItem = () => {
    let { invoiceInput, hideAddButton } = this.state;
    invoiceInput.items.push(INVOICE_ITEM);
    this.setState({ invoiceInput, hideAddButton: true, openPopup: false, type: "" });
  };

  handleCustomer = selected => {
    const { businessInfo } = this.props;
    if (selected && selected._id === "Add new customer") {
      this.setState({ openPopup: true, type: "CustomerPopup", isEditMode: false });
    } else {
      let { invoiceInput, selectedCurency, currencies } = this.state;
      invoiceInput.customer = (selected && selected) || "";
      selectedCurency = getSelectedCurrency(
        currencies,
        _setCurrency(selected && selected.currency, businessInfo.currency)
      );
      console.log("selectedCurency", selectedCurency)
      invoiceInput.currency = selectedCurency;
      let showExchange = _showExchangeRate(businessInfo.currency, invoiceInput.currency);
      this.setState({
        selectedCurency,
        selectedCustomer: selected,
        invoiceInput,
        showCustomer: true,
        showAlert: true,
        showExchange
      });
      this.calculateAmount()
    }
  };

  setData = (selected) => {
    const { businessInfo, invoiceData } = this.props;
    let { invoiceInput, selectedCurency, currencies, editCustomer, selectedCustomer } = this.state;
    invoiceInput.customer = (selected && selected._id || selected.id) || "";
    selectedCurency = getSelectedCurrency(
      currencies,
      _setCurrency(selected && selected.currency, businessInfo.currency)
    );
    invoiceInput.currency = selectedCurency;
    // console.log('selected', selected, invoiceData);
    let messages = this.state.messages;
    if (editCustomer && selected._id !== (invoiceData.customer && invoiceData.customer._id)) {
      messages[0] = {
        heading: "Customer",
        message: 'An invoice customer cannot be modified after a payment has been made.'
      };
      this.setState({
        selectedCurency,
        selectedCustomer,
        invoiceInput,
        showCustomer: true,
        showValidation: true,
        messages
      });
      window.scrollTo(0, 0)
      // history.push(`/app/invoices/view/${invoiceInput._id}?errorCustomer=`);
    } else
      this.setState({
        selectedCurency,
        selectedCustomer: selected,
        invoiceInput,
        showCustomer: true,
        showAlert: true,
        showValidation: false,
      });
  };

  handleCurrency = async selected => {
    const { businessInfo } = this.props;
    let { invoiceInput } = this.state;
    let showExchange = _showExchangeRate(businessInfo.currency, selected)
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
    this.setState({ showExchange, invoiceInput, showAlert: true }, () => this.calculateAmount());
  };

  handleProductValue = (e, idx) => {
    const { name, value } = e.target;
    let updateInvoice = cloneDeep(this.state.invoiceInput);
    updateInvoice.items[idx]["item"] = "";
    updateInvoice.items[idx][name] = value;
    this.setState({ invoiceInput: updateInvoice, showAlert: true })
  };

  handleProduct = (selected, i) => {
    let updateInvoice = cloneDeep(this.state.invoiceInput);
    let hideAddButton = this.state.hideAddButton;
    if (selected) {
      if (!!selected.target) {
        const { name, value } = selected.target;
        if (name === 'column4' || name === 'column3') {
          if (value.length <= 11) {
            updateInvoice.items[i][name] = value;
          }
        } else {
          updateInvoice.items[i][name] = value;
        }
        updateInvoice.items[i]["amount"] =
        updateInvoice.items[i]["column3"] * updateInvoice.items[i]["column4"];
        this.setState(
          { invoiceInput: updateInvoice, selectedProduct: selected, hideAddButton, showAlert: true },
          () => {
            console.log("column2", name)
            if(name !== 'column2'){
              this.calculateAmount()
            }
          }
        );
      }else {
        if (selected.item === "Add new item") {
          updateInvoice.items[updateInvoice.items.length - 1].item = 0;
          this.setState({ openProduct: true, type: "ProductPopup" });
        } else {
          updateInvoice.items[i] = selected;
          updateInvoice.items[i].taxes = selected.taxes;
          if (!!selected.column4) {
            updateInvoice.items[i]['column4'] = parseFloat(selected.column4).toFixed(2)
          }
        }
        hideAddButton = false
        updateInvoice.items[i]["amount"] =
        updateInvoice.items[i]["column3"] * updateInvoice.items[i]["column4"];
        console.log("column2 name", selected.target)
        this.setState(
          { invoiceInput: updateInvoice, selectedProduct: selected, hideAddButton, showAlert: true },
          () => this.calculateAmount()
        );
      }
    } else {
      updateInvoice.items[i] = INVOICE_ITEM;
      console.log("column2 test")
      this.setState(
        { invoiceInput: updateInvoice, selectedProduct: selected, hideAddButton, showAlert: true },
        () => this.calculateAmount()
      );
    }
    console.log('updateInvoice', updateInvoice)
  };

  _handlePriceBlur(i, e) {
    let updateInvoice = cloneDeep(this.state.invoiceInput);
    let { name, value } = e.target;
    if (name === 'column4') {
      if (!!value) {
        updateInvoice.items[i]['column4'] = parseFloat(value).toFixed(2);
      } else {
        updateInvoice.items[i]['column4'] = parseFloat(0);
      }
    }
    if (name === 'column3') {
      if (!value) {
        updateInvoice.items[i]['column3'] = parseFloat(0);
      }
    }
    this.setState({ invoiceInput: updateInvoice, priceError: false })
  }

  calculateAmount = async () => {
    let { taxList } = this.state;
    const { businessInfo } = this.props;
    let invoiceInput = cloneDeep(this.state.invoiceInput);
    let showExchange = _showExchangeRate(businessInfo.currency, invoiceInput.currency)
    let result = await calculateTaxes(this.state.invoiceInput.items, taxList);
    invoiceInput.amountBreakup = {
      subTotal: result.sumAmount,
      taxTotal: result.taxsTotal,
      total: result.amount
    };
    invoiceInput.totalAmount = result.amount;
    invoiceInput.totalAmountInHomeCurrency = showExchange
      ? _calculateExchangeRate(invoiceInput.exchangeRate, result.amount)
      : 0;
      if (showExchange) {
        try {
          const { data } = await currentExchangeRate(
            invoiceInput.currency.code,
            businessInfo.currency.code
          );
          invoiceInput.exchangeRate = data.exchangeRate;
        } catch (error) {
          console.error("----------------------error exchange change--- >", error);
          return error;
        }
      }
    this.setState({ invoiceInput, showExchange });
  };

  handleDelete = idx => {
    let invoiceInput = this.state.invoiceInput;
    invoiceInput.items = invoiceInput.items.filter((s, index) => {
      return !(index === idx);
    });
    this.setState({ invoiceInput, hideAddButton: false });
    this.calculateAmount();
  };

  onSubmitInvoice = async option => {
    this.setState({ showAlert: false, showValidation: false, messages: [] });
    const {
      openPayment,
      openMailBox,
      isEditMode,
      invoiceData,
      showSnackbar
    } = this.props;
    const { selectedCustomer } = this.state;
    try {
      let invoiceInput = cloneDeep(this.state.invoiceInput);
      let response;
      invoiceInput.amountBreakup.taxTotal = invoiceInput.amountBreakup.taxTotal.map(item => {
        item.taxName = item.taxName._id;
        return item
      });
      if(invoiceInput.items.length > 0){

        if (typeof invoiceInput.customer === 'object') {
          invoiceInput.customer = invoiceInput.customer._id || invoiceInput.customer.id;
        }
        if(!!this.refs.notes){
          invoiceInput.notes = this.refs.notes.innerHTML;
        }
        invoiceInput.notes = invoiceInput.notes == "<br>" ? "" : invoiceInput.notes;
        if (isEditMode) {
          let messages = this.state.messages;
          let selectedName = selectedCustomer.customerName || selectedCustomer.customer.customer.customerName
          let selectedId = selectedCustomer._id || selectedCustomer.customer.customer._id
          if (invoiceInput.payments && invoiceInput.payments.length > 0) {
            if (moment(invoiceData.invoiceDate).format('YYYY-MM-DD') !== moment(invoiceInput.invoiceDate).format('YYYY-MM-DD')) {
              messages[1] = {
                heading: 'Invoice Date',
                message: "An invoice's issue date cannot be modified after a payment has been made"
              };
              this.setState({
                showValidation: true,
                messages
              });
              window.scrollTo(0, 0)
            }
            if (invoiceInput.currency.code !== invoiceData.currency.code) {
              messages[2] = {
                heading: 'Currency',
                message: "An invoice's currency cannot be modified after a payment has been made"
              },
                messages[3] = {
                  heading: 'Exchange Rate',
                  message: "An invoice's exchange rate cannot be modified after a payment has been made"
                },
                this.setState({
                  showValidation: true,
                  messages
                });
              window.scrollTo(0, 0)
            }
            // console.log('selectedCustomer', (selectedName !== (invoiceData.customer && invoiceData.customer.customerName)))
            if (selectedId !== (invoiceData.customer && invoiceData.customer._id)) {
              messages[0] = {
                heading: "Customer",
                message: 'An invoice customer cannot be modified after a payment has been made.'
              };
              this.setState({
                showValidation: true,
                messages
              });
              window.scrollTo(0, 0)
            }
            if ((moment(invoiceData.invoiceDate).format('YYYY-MM-DD') === moment(invoiceInput.invoiceDate).format('YYYY-MM-DD'))
              && (invoiceInput.currency.code === invoiceData.currency.code)
              && ((!!selectedCustomer.customer ? selectedCustomer.customer.customerName : selectedCustomer.customerName) === (invoiceData.customer && invoiceData.customer.customerName))) {
              const id = invoiceData._id;
              delete invoiceInput.payments;
              delete invoiceInput.onlinePayments;
              delete invoiceInput.createdAt;
              delete invoiceInput.lastViewedOn;
              invoiceInput.businessId = invoiceInput.businessId._id;
              invoiceInput.userId = typeof invoiceInput.userId === "object" ? invoiceInput.userId._id : invoiceInput.userId;
              delete invoiceInput._id;
              response = await updateInvoice(id, { invoiceInput });
              showSnackbar("Invoice Update Successfully", false);
            }
          } else {
            const id = invoiceData._id;
            delete invoiceInput.payments;
            delete invoiceInput.onlinePayments;
            delete invoiceInput.createdAt;
            delete invoiceInput.lastViewedOn;
            invoiceInput.businessId = invoiceInput.businessId._id;
            invoiceInput.userId = typeof invoiceInput.userId === "object" ? invoiceInput.userId._id : invoiceInput.userId;
            delete invoiceInput._id;
            response = await updateInvoice(id, { invoiceInput });
            showSnackbar("Invoice Update Successfully", false);
          }
        } else {
          invoiceInput.dueAmount = invoiceInput.totalAmount;
          if(option === 'Payment'){
            invoiceInput.status = 'sent'
            invoiceInput.sentVia = 'marked_sent'
          }
          delete invoiceInput.onlinePayments;
          delete invoiceInput.payments;
          delete invoiceInput.createdAt;
          console.log("invoiceInput", invoiceInput)
          response = await addInvoice({ invoiceInput });
          showSnackbar("Invoice created successfully", false);
        }
        if (response) {
          if (option === "Payment") {
            openPayment();
          } else if (option === "Send") {
            openMailBox();
          }
          history.push(`/app/invoices/view/${response.data.invoice._id}`);
        }
      }else{
        showSnackbar('Please select an item to proceed.', true);
      }
    } catch (error) {
      console.error("error in estimate post query", error.message);
      showSnackbar(error.message, true);
    }
  };

  handleTaxChange = (selected, i) => {
    let { invoiceInput } = this.state;
    let selectedTax = selected.map(item => {
      if (item) {
        return item.value
      }
    });
    invoiceInput.items[i].taxes ?
      invoiceInput.items[i].taxes = selectedTax
      : "";
    this.setState({ invoiceInput }, () => this.calculateAmount());
  };

  renderTableRow = () => {
    const { products, taxList, openProduct, type } = this.state;
    const { items, currency } = this.state.invoiceInput;
    return (items.length > 0
      ? items.map((item, i) => {
        return (
          <Fragment>
            {item.item === undefined ?
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
                    onBlur={this.handleItemBlur.bind(this)}
                  />
                </div>
                <div className="py-table__cell">
                    {/* <i className="far fa-trash-alt fa-xs" /> */}
                    <ReactSVG
                    src="/assets/icons/ic_delete.svg"
                    afterInjection={(error, svg) => {
                      if (error) {
                        console.error(error)
                        return
                      }
                      console.log(svg)
                    }}
                    beforeInjection={svg => {
                      svg.classList.add('py-svg-icon')
                    }}
                    renumerateIRIElements={false}
                    className="py-icon py-table__action__danger"
                    onClick={() => this.handleDelete(i)}
                    />
                </div>
              </div>

              :
              <Fragment>
                <div key={i} className="invoice-item-table-body">
                  <div className="py-table__cell all_scroll_effect">
                    <span className="py-icon">
                      <i className="pe pe-7s-keypad"></i>
                    </span>
                  </div>
                  <div className="py-table__cell item-cell">
                    {openProduct && type === "ProductPopup" ?
                      <Input
                        name="column1"
                        className="form-control"
                        placeholder="Enter item name"
                        value={item.column1}
                        onChange={e => this.handleProductValue(e, i)}
                      />
                      :
                      <label>{item.column1}</label>
                    }
                  </div>
                  <div className="py-table__cell detail-cell">
                    <Input
                      type="textarea"
                      name="column2"
                      //   onChange={e => this.onTextChange(e, i)}
                      className="form-focus--expand"
                      placeholder="Enter item description"
                      value={item.column2}
                      onChange={e => this.handleProduct(e, i)}
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
                      onBlur={this._handlePriceBlur.bind(this, i)}
                      value={item.column3}
                    />
                  </div>
                  <div className="py-table__cell price-cell">
                    <Input
                      // type="text"
                      type="number"
                      step="any"
                      className="form-control"
                      name="column4"
                      maxLength={'11'}
                      min={'1'}
                      onChange={e => this.handleProduct(e, i)}
                      value={item.column4}
                      onBlur={this._handlePriceBlur.bind(this, i)}
                    />
                    {
                      this.state.priceError ?
                        <FormText>Please enter a value</FormText>
                        : ""
                    }
                  </div>
                  <div className="py-table__cell amount-cell">
                    {getAmountToDisplay(currency, item.amount)}
                  </div>
                  <div className="py-table__cell">
                      <ReactSVG
                      src="/assets/icons/ic_delete.svg"
                      afterInjection={(error, svg) => {
                        if (error) {
                          console.error(error)
                          return
                        }
                        console.log(svg)
                      }}
                      beforeInjection={svg => {
                        svg.classList.add('py-svg-icon')
                      }}
                      renumerateIRIElements={false}
                      className="py-icon py-table__action py-table__action__danger"
                      onClick={() => this.handleDelete(i)}
                      />
                  </div>
                </div>
                <div className="invoice-item-table-body">
                  <div className="invoice-item-income-account">
                    {/* Edit income account */}
                  </div>
                  <div className="invoice-item-row-tax-section__taxes" style={{ width: "50%" }}>
                    <SingleTax
                      taxValue={item}
                      currencySymbol={currency && currency.symbol}
                      isEditMode={true}
                      index={i}
                      taxList={taxList}
                      multi={false}
                      fetchtaxList={this.fetchtaxList}
                      onChange={this.handleTaxChange}
                    />
                  </div>
                </div>
              </Fragment>}
          </Fragment>
        )
      })
      : ""
    );
  };

  onCustomerChange = () => {
    this.handleCustomer(undefined);
  };

  onPreviewClick = () => {
    let invoiceInput = cloneDeep(this.state.invoiceInput);
    if(!!this.refs.notes){
      invoiceInput.notes = this.refs.notes.innerHTML;
    }
    invoiceInput.notes = invoiceInput.notes == "<br>" ? "" : invoiceInput.notes;
    invoiceInput.dueAmount = invoiceInput.totalAmount
    this.setState({
      invoiceInput,
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
    })
  };

  onEditBusinessClose = async (businessInfo) => {
    this.setState({
      openBusinessPopup: false,
      businessInfo
    })
    // window.reload()
  };

  onImageUpload = async (event) => {
    const file = event.target.files[0];
    let imageUrl;
    if (file) {
      imageUrl = await this.getSignedUrl(file)
      console.log("in ImageUrl",  imageUrl)
      this.onUpdateSettings(event, imageUrl)
    }
  };

  getSignedUrl = async (file) => {
    try {
      const payload = {
        s3Input: {
          contentType: file.type,
          fileName: file.name,
          uploadType: 'logo'
        }
      };
      const response = await fetchSignedUrl(payload);
      const { sUrl, pUrl } = response.data.signedUrl;
      if (sUrl) {
        await uploadImage(sUrl, file, file.type);
        console.log("pUrl", pUrl)
        return pUrl
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
    let settings = !!this.props.userSettings ? this.props.userSettings : {};
    console.log('onUpdateSettings', settings, imageUrl)
    settings.companyLogo = !!imageUrl ? `${imageUrl}` : '';
    delete settings._id;
    delete settings.createdAt;
    delete settings.updatedAt;
    delete settings.__v;
    // delete settings.itemHeading.savedForFuture;
    let salesSettingInput = {
      ...settings
    };
    try {
      let request = await patchSalesSetting({ salesSettingInput });
      !imageUrl && this.removeLogoConfirmation();
      this.props.setUserSettings(request.data.salesSetting);
    } catch (error) {
      this.props.showSnackbar("Something went wrong, please try again", true);
    }
  };

  handleEditCustomer() {
    this.setState({ openPopup: true, type: "CustomerPopup", editCustomer: true })
  }

  handleItemBlur = ({target: {value}}) => {
    let invoiceInput = cloneDeep(this.state.invoiceInput)
    if(!value && invoiceInput.items.length > 0){
      invoiceInput.items = invoiceInput.items.filter(item => {
        return item.item!==undefined
      })
      this.setState({
        invoiceInput,
        hideAddButton: false
      })
    }
  }

  render() {
    const {
      invoiceInput,
      openHeader,
      customers,
      selectedCustomer,
      currencies,
      showExchange,
      showValidation,
      messages,
      showPreview,
      showCustomer,
      openPopup,
      type,
      deleteLogoConfirmation,
      openBusinessPopup,
      loader, businessInfo
    } = this.state;
    const { isEditMode, userSettings, invoiceData } = this.props;
    const { itemHeading } = invoiceInput;
    console.log("in edit", this.state)
    return (
      <Fragment>
        {
          loader ? (<CenterSpinner />)
            : (
              <div className="content-wrapper__main__fixed invoiceWrapper">
                <header className="py-header">
                  <div className="py-header--title">
                    <h2 className="py-heading--title">
                      {isEditMode
                        ? `Edit invoice #${invoiceInput.invoiceNumber}`
                        : "New invoice"}{" "}
                    </h2>
                  </div>

                  <div className="py-header--actions">
                      <Button
                        onClick={this.onPreviewClick}
                        className="btn btn-outline-primary"
                      >
                        {showPreview ? "Edit" : "Preview"}
                      </Button>
                      <div className="btn py-btn__action__primary">
                        <span className="btn" onClick={() => this.onSubmitInvoice()}>
                          {" "}
                          Save and continue{" "}
                        </span>
                        <Dropdown
                          className="py-btn__action"
                          isOpen={this.state.openUpperDropdown}
                          toggle={this.toggleUpperDropdown}
                        >
                          <DropdownToggle caret />
                          <DropdownMenu className="dropdown-menu-right">
                            <div className="dropdown-menu--body">
                              <DropdownItem onClick={this.onSaveAndSend}>
                                Save and send
                              </DropdownItem>
                                <DropdownItem onClick={this.onSaveAndPayment}>
                                  Save and record payment
                              </DropdownItem>
                            </div>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                  </div>
                </header>
                {showPreview ? (
                  <Fragment>
                    <div className="alert-box">
                      <div className={`alert alert-info`}>
                        <i className={"pe-7s-info"} />
                        This is a preview of your invoice. Switch back to Edit if you
                        need to make changes.
                    </div>
                    </div>
                    {
                      userSettings.template === 'modern' ?
                        (<InvoicePreviewModern
                          ref={el => (this.componentRef = el)}
                          invoiceData={invoiceInput}
                          userSettings={userSettings}
                          businessInfo={businessInfo}
                          showPayment={true}
                        />)
                        : userSettings.template === 'classic' ?
                          (<InvoicePreviewClassic
                            ref={el => (this.componentRef = el)}
                            invoiceData={invoiceInput}
                            userSettings={userSettings}
                            businessInfo={businessInfo}
                            showPayment={true}
                          />)
                          : (<InvoicePreview
                            ref={el => (this.componentRef = el)}
                            invoiceData={invoiceInput}
                            userSettings={userSettings}
                            businessInfo={businessInfo}
                            showPayment={true}
                          />)
                    }
                  </Fragment>
                ) : (
                    <div className="content">
                      <div className="invoice-add__body">
                          {
                            showValidation &&
                            <ValidationMessages
                              className="err color-red mrT20"
                              id="invoiceCustomerErr"
                              messages={messages}
                              title="Oops! There was an issue with updating your invoice. Please try again."
                              autoFocus={true}
                            />
                          }
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
                              <Collapse className="py-box" isOpen={this.state.collapse}>
                                  <div className="row">
                                    <Col xs={12} sm={6} md={6} lg={6} >
                                      {userSettings && userSettings.companyLogo !== "" ?
                                        <div className="edit-info info-logo" style={{ color: '#9f55ff', cursor: 'pointer' }}>
                                          <img src={userSettings.companyLogo} alt="" /><br /><br />
                                          <span className="py-text--link" onClick={this.removeLogoConfirmation}>
                                            {" "}
                                            Remove logo{" "}
                                          </span>
                                        </div>
                                        :
                                        <div className="uploader-zone">
                                          <img src="/assets/upload.svg" />
                                          <div className="py-text--browse"> Browse your logo here. </div>
                                          <div className="py-text--hint"> Maximum 10MB in size. <br />JPG, PNG, or GIF formats.</div>
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
                                          <span className="py-text--link" onClick={this.onEditBusiness}>
                                            Edit your business address and contact details{" "}
                                          </span>
                                      </div>
                                    </Col>
                                  </div>
                              </Collapse>
                            </div>
                            <div className="py-box is-highlighted invoice-add__body__center">

                                <div className="row no-gutters justify-content-between">
                                  <Col lg={7}>
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
                                        <div className="my-2 py-text--strong">
                                          <a className="py-text--link" onClick={this.handleEditCustomer.bind(this)}>
                                            {`Edit ${selectedCustomer.customerName}`}
                                          </a>
                                          <span className="py-text--hint d-inline-block mx-2">{" • "}</span>
                                          <a
                                            className="py-text--link"
                                            onClick={this.onCustomerChange}
                                          >{"Choose a different customer"}
                                          </a>
                                        </div>
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
                                                Add a customer
                                        </Button>
                                            ) : (
                                                <SelectBox
                                                  // autoFocus={true}
                                                  autofocus={true}
                                                  openOnFocus={true}
                                                  labelKey={"customerName"}
                                                  valueKey={"_id"}
                                                  value={selectedCustomer}
                                                  onChange={this.handleCustomer}
                                                  options={customers}
                                                  clearable={false}
                                                />
                                              )}
                                          </div>
                                        </Fragment>
                                      )}
                                  </Col>
                                  <Col lg={5}>
                                    <div className="py-form-field--condensed">
                                    <div className="py-form-field py-form-field--inline">
                                      <Label
                                        for="exampleEmail"
                                        className="py-form-field__label" style={{width: '100%'}}>
                                        Invoice number
                                        </Label>
                                      <div className="py-form-field__element">
                                        <Input
                                          type="text"
                                          value={invoiceInput.invoiceNumber}
                                          name="invoiceNumber"
                                          className="py-form__element__small"
                                          onChange={this.handleOnInputChange}
                                        />
                                      </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                      <Label
                                        for="exampleEmail"
                                        className="py-form-field__label" style={{width: '100%'}}
                                      >
                                        P.O./S.O. number
                                       </Label>
                                      <div className="py-form-field py-form-field__element">
                                        <Input
                                          type="Text"
                                          value={invoiceInput.purchaseOrder}
                                          name="purchaseOrder"
                                          className="py-form__element__small"
                                          onChange={this.handleOnInputChange}
                                          id="exampleEmail"
                                        />
                                      </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                      <Label
                                        for="exampleEmail"
                                        className="py-form-field__label" style={{width: '100%'}}
                                      >
                                        Invoice date
                                      </Label>
                                      <div className="py-form-field__element">
                                        <DatepickerWrapper
                                          selected={invoiceInput.invoiceDate}
                                          onChange={date =>
                                            this.handleOnInputChange(
                                              date,
                                              "invoiceDate"
                                            )
                                          }
                                          className="py-form__element__small form-control"
                                        />
                                      </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                      <Label
                                        for="exampleEmail"
                                        className="py-form-field__label" style={{width: '100%'}}>Payment due
                                    </Label>
                                      <div className="py-form-field__element">
                                        <DatepickerWrapper
                                          minDate={invoiceInput.invoiceDate}
                                          selected={invoiceInput.dueDate}
                                          onChange={date =>
                                            this.handleOnInputChange(date, "dueDate")
                                          }
                                          className="py-form__element__small form-control"
                                        />
                                        <span className="py-text--hint"> {invoiceInput.dueDate && invoiceInput.invoiceDate && moment(invoiceInput.dueDate).diff(invoiceInput.invoiceDate, "days") > 1 ? `Within ${invoiceInput.dueDate && invoiceInput.invoiceDate && moment(invoiceInput.dueDate).diff(invoiceInput.invoiceDate, "days")} days` : "On Receipt"} </span>
                                      </div>
                                    </div>
                                    </div>
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
                                    <div className="py-table invoice-item-table">
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
                                    <ReactSVG src="/assets/icons/ic_add.svg"
                                      afterInjection={(error, svg) => {
                                        if (error) {
                                          console.error(error)
                                          return
                                        }
                                        console.log(svg)
                                      }}
                                      beforeInjection={svg => {
                                        svg.classList.add('py-svg-icon')
                                      }}
                                      renumerateIRIElements={false}
                                      className="py-icon mr-1"
                                    />
                                    {" "}Add {itemHeading.column1.name.toLowerCase() === 'items' ? `an ${pluralize.singular(itemHeading.column1.name.toLowerCase())}` : `a ${pluralize.singular(itemHeading.column1.name.toLowerCase())}`}
                                  </button> : ""}
                                  <section className="invoice-add-totals__totals">
                                    <div className="invoice-add-totals__totals__amounts">
                                      <div className="invoice-add-totals__totals__amounts__line">
                                        <div className="invoice-add-totals__totals__amounts__line__label">
                                          Subtotal
                                    </div>
                                        <div className="invoice-add-totals__totals__amounts__line__amount">
                                          {getAmountToDisplay(invoiceInput.currency, invoiceInput.amountBreakup.subTotal)}
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
                                                    {getAmountToDisplay(invoiceInput.currency, item.amount)}
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
                                                value={!!invoiceInput.currency ? !!invoiceInput.currency.code && invoiceInput.currency.code : !!businessInfo.currency && businessInfo.currency.code}
                                                onChange={this.handleCurrency}
                                                options={currencies}
                                                className="d-inline-block ml-3 text-left py-select--medium"
                                                clearable={false}
                                              />


                                        </div>
                                        <div className="invoice-add-totals__totals__amounts__line__amount">
                                          <strong>
                                            {getAmountToDisplay(invoiceInput.currency, invoiceInput.amountBreakup.total)}
                                          </strong>
                                        </div>
                                        {}
                                      </div>
                                      {showExchange && (
                                        <div className="invoice-add-totals__totals__amounts__line">
                                          <div className="">Currency conversion:</div>
                                          <div className="">
                                            {` ${getAmountToDisplay(businessInfo.currency, invoiceInput.totalAmountInHomeCurrency)} (${businessInfo.currency.code}) at ${
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
                                <div
                                  contentEditable="true"
                                  ref="notes"
                                  name="notes"
                                  rows={3}
                                  className="reactStrap-design noBorder p-0 editableDiv"
                                  dangerouslySetInnerHTML={{ __html: invoiceInput.notes }}
                                  onBlur={this.handleOnInputChange}
                                  // onChange={this.handleOnInputChange}
                                ></div>
                                {/* <textarea
                                  type="textarea"
                                  name="notes"
                                  rows={'3'}
                                  value={invoiceInput.notes}
                                  onChange={this.handleOnInputChange}
                                  placeholder="Enter notes that are visible to your customer"
                                  className="reactStrap-design noBorder p-0"
                                /> */}
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
                              <Collapse className="py-box " isOpen={this.state.footerCollapse}>
                                <Input
                                  type="textarea"
                                  value={invoiceInput.footer}
                                  onChange={this.handleOnInputChange}
                                  name="footer"
                                  maxLength={255}
                                  placeholder="Enter a footer for this invoice (e.g. tax information, thank you note)"
                                />
                              </Collapse>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}
                {showPreview ? null : (
                  <footer className="page footer" style={{ marginBottom: "50px" }}>
                    <div className="content clearfix">
                      <div className="pull-right">
                        <Button
                          onClick={this.onPreviewClick}
                          className="btn btn-outline-primary"
                        >
                          Preview
                      </Button>
                        <div className="btn py-btn__action__primary">
                          <span className="btn" onClick={() => this.onSubmitInvoice()}>
                            {" "}
                            Save and continue{" "}
                          </span>
                          <Dropdown
                            className="py-btn__dropdown"
                            isOpen={this.state.openBelowDropdown}
                            toggle={this.toggleBelowDropdown}
                          >
                            <DropdownToggle className="" caret />
                            <DropdownMenu>
                            <div className="dropdown-menu--body">
                              <DropdownItem onClick={this.onSaveAndSend}>
                                Save and send
                            </DropdownItem>
                              <DropdownItem onClick={() => this.onSaveAndPayment()}>
                                Save and record payment
                            </DropdownItem>
                            </div>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </footer>
                )}
              </div>
            )
        }
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
          invoice={invoiceInput}
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
    setUserSettings: (data) => {
      dispatch(setUserSettings(data))
    }
  };
};
export default withRouter(
  connect(
    mapPropsToState,
    mapDispatchToProps
  )(InvoiceForm)
);
