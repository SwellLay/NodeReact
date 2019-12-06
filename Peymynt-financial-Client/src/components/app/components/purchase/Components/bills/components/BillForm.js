import { deletePayment, fetchPayments } from 'actions/billsAction';
import { openGlobalSnackbar } from "actions/snackBarAction";
import { addBill, deleteBill, updateBill } from "api/billsService";
import { currentExchangeRate } from "api/globalServices";
import taxServices from "api/TaxServices";
import vendorServices from 'api/vendorsService';
import Taxes from "components/app/components/sales/components/Taxes";
import history from "customHistory";
import { cloneDeep, get, startCase, sumBy } from "lodash";
import moment from 'moment';
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactSVG from 'react-svg'
import { Col, Form, FormGroup, Input, Label, Spinner, Table } from "reactstrap";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import SelectBox from "utils/formWrapper/SelectBox";
import { _documentTitle, toMoney } from "utils/GlobalFunctions";
import { DeleteModal } from 'utils/PopupModal/DeleteModal';
import {
  billPayload,
  billProductObject,
  calculateTaxes,
  getSelectedCurrency,
  getSelectedVendor,
  setFormData
} from "../constants/BillFormConstants";
import Popup from "./Popup";
import TaxOverride from './TaxOverride';
import VendorModal from './VendorModal';

// @Todo: Vendor Popup
// @Todo: Tax Override

const sampleProduct = {
  item: "",
  description: "",
  quantity: 1,
  price: undefined,
  taxes: [],
};

class BillForm extends Component {
  state = {
    showExchange: false,
    selectedVendor: {},
    currencies: [],
    billPayload: billPayload(this.props.selectedBill, this.props.businessInfo, this.props.vendorId),
    vendors: [],
    products: [],
    currency: "",
    taxList: [],
    payments: [],
    openPopup: false,
    type: "All",
    billNumber: 0,
    isBillNumberExist: false,
    minDate: new Date(),
    loader: false,
    vendorModal: false,
    deleteModal: false,
  };

  componentDidMount() {
    const { isEditMode, selectedBill, businessInfo } = this.props;
    _documentTitle(businessInfo, "Bills");

    let formattedData = this.state.billPayload;
    if (isEditMode) {
      let showExchange = selectedBill !== undefined && (selectedBill.currency && selectedBill.vendor.currency && selectedBill.currency.code !== selectedBill.vendor.currency.code);
      formattedData = billPayload(selectedBill, businessInfo, this.props.vendorId);
      this.setState({ billPayload: formattedData, showExchange, loader: true });
      this.getPayments();
      this.handleCurrency(selectedBill.currency);
    }

    this.fetchTaxList();
    this.fetchFormData(formattedData);
  }

  componentDidUpdate(prevProps) {
    const { selectedBill, businessInfo } = this.props;

    if (prevProps.selectedBill !== selectedBill) {
      let showExchange = selectedBill !== undefined && (selectedBill.currency.code !== selectedBill.vendor.currency.code);
      let formattedData = billPayload(selectedBill, businessInfo, this.props.vendorId);
      this.setState({ billPayload: formattedData, showExchange });
      this.fetchFormData(formattedData);
    }
  }

  onDeleteClick = async () => {
    const id = this.props.selectedBill.id || this.props.selectedBill._id;
    const response = await deleteBill(id);
    if ([200, 201].indexOf(response.statusCode) !== -1) {
      history.push('/app/purchase/bills');
      this.props.showSnackbar(response.message);
      return;
    }

    this.props.showSnackbar(response.message, true);
  };

  onCloseDelete = () => {
    this.setState({ deleteModal: false })
  };

  fetchTaxList = async () => {
    const response = (await taxServices.fetchTaxes()).data.taxes;
    this.setState({ taxList: response })
  };

  getPayments = () => {
    this.props.fetchPayments(this.props.selectedBill.id, ({ payments }) => {
      this.setState({ payments });
    });
  };

  fetchFormData = async (formattedData) => {
    let stateData = {
      currencies: this.state.currencies,
      vendors: this.state.vendors,
      products: this.state.products
    };
    const listData = await setFormData(stateData, "all");
    this.setState(listData);
    // await this.calculateAmount()
    await this.setFormData(listData, formattedData)
  };

  setFormData = async (listData, data) => {
    const { businessInfo } = this.props;
    const currencyValue = data.currency || businessInfo.currency;
    const selectedVendor = await getSelectedVendor(listData.vendors, data.vendor, businessInfo);
    const selectedCurrency = await getSelectedCurrency(listData.currencies, currencyValue);
    this.setState({ selectedVendor, selectedCurrency, loader: false });
    this.handleVendor(selectedVendor);
  };

  updateList = async (fetch, data) => {
    let stateData = {
      currencies: this.state.currencies,
      vendors: this.state.vendors,
      products: this.state.products
    };
    let { billPayload, selectedVendor, prodIndex } = this.state;

    if (fetch === 'VendorPopup') {
      billPayload.vendor = data;
      selectedVendor = data
    } else {
      billPayload.items[prodIndex] = data;
      billPayload.items[prodIndex]['amount'] = billPayload.items[prodIndex]['quantity'] * billPayload.items[prodIndex]['price'];

    }
    const listData = await setFormData(stateData, fetch);
    this.setState(listData);
    this.setState({ openPopup: false, billPayload, selectedVendor });
    this.calculateAmount()
  };

  onPopupClose = async type => {
    let stateData = {
      currencies: this.state.currencies,
      vendors: this.state.vendors,
      products: this.state.products
    };
    const data = await setFormData(stateData, type);
    this.setState(data);
    this.setState({ openPopup: false });
  };

  handleExchangeRate = async (currencyCode) => {
    let { billPayload } = this.state;
    const { businessInfo } = this.props;

    try {
      const { data } = await currentExchangeRate(currencyCode, businessInfo.currency.code);
      billPayload.exchangeRate = data.exchangeRate;
      this.setState({ billPayload });
    } catch (error) {
      console.error("error", error);
      return error;
    }
  };

  handleVendor = async (selected) => {
    if (selected && selected.id === "Add new vendor") {
      this.setState({ vendorModal: true });
    } else {
      let { billPayload, selectedCurrency, currencies, showExchange } = this.state;
      const { businessInfo } = this.props;
      billPayload.vendor = selected;
      billPayload.currency = (selected ? selected.currency : businessInfo && businessInfo.currency);
      if (!selected) {
        showExchange = false
      }
      showExchange = (selected.currency.code !== businessInfo.currency.code);

      if (showExchange) {
        this.handleExchangeRate(selected.currency.code);
      }
      selectedCurrency = getSelectedCurrency(
        currencies,
        (selected && selected.currency) || null
      );
      this.setState({
        selectedCurrency,
        selectedVendor: { ...selected, currency: businessInfo && businessInfo.currency },
        billPayload,
        showExchange
      });
    }
  };

  setData = data => {
    let { billPayload, selectedCurrency, currencies, showExchange } = this.state;
    const { businessInfo } = this.props;
    billPayload.vendor = data;
    billPayload.currency = (data ? data.currency : businessInfo && businessInfo.currency);
    if (data === null) {
      showExchange = false
    }
    selectedCurrency = getSelectedCurrency(
      currencies,
      (data && data.currency) || null
    );
    this.setState({
      selectedCurrency,
      selectedVendor: data,
      billPayload,
      showExchange
    });
  };

  handleCurrency = async selected => {
    let { billPayload, selectedVendor, selectedCurrency } = this.state;
    // if(!!selec)
    let showExchange = (selected.code !== this.props.businessInfo.currency.code);
    billPayload.currency = selected;
    if (showExchange) {
      try {
        const { data } = await currentExchangeRate(selected.code, this.props.businessInfo.currency.code);
        billPayload.exchangeRate = data.exchangeRate;
      } catch (error) {
        return error;
      }
    }
    this.setState({ showExchange, selectedCurrency: selected, billPayload },
      () => this.calculateAmount());
  };

  handleProduct = (selected, i) => {
    let { billPayload } = this.state;
    if (selected && selected.target) {
      const { name, value } = selected.target;
      let { items } = billPayload;
      items[i][name] = value;
      if (['price', 'quantity'].includes(name)) {
        items[i]['amount'] = items[i]['quantity'] * items[i]['price'];
      }
    } else {
      if (selected && selected.item === "Add new product") {
        this.setState({ openPopup: true, type: "ProductPopup", prodIndex: i });
      } else {
        if (selected) {
          billPayload.items[i] = selected;
          billPayload.items[i].taxes = selected.taxes.map(r => r._id);
        } else {
          billPayload.items[i] = sampleProduct;
        }
        billPayload.items[i]['amount'] = billPayload.items[i]['quantity'] * billPayload.items[i]['price'];
      }
    }
    this.setState({ billPayload }, this.calculateAmount);
  };

  calculateAmount = async () => {
    let { showExchange, taxList } = this.state;
    let billPayload = cloneDeep(this.state.billPayload);
    let result = await calculateTaxes(this.state.billPayload.items, taxList);

    billPayload.amountBreakup = {
      subTotal: result.sumAmount,
      taxes: result.taxesTotal,
      total: result.amount
    };
    billPayload.totalAmount = result.amount;
    billPayload.totalAmountInHomeCurrency = showExchange ? billPayload.exchangeRate * result.amount : 0;

    this.setState({ billPayload });
  };

  handleBill = async (e, fieldName) => {
    if (fieldName && fieldName.includes("Date")) {
      this.setState({
        billPayload: { ...this.state.billPayload, [fieldName]: e }
      });
      if (fieldName === 'billDate') {
        this.setState({
          minDate: e,
          billPayload: { ...this.state.billPayload, expiryDate: e, [fieldName]: e }

        })
      }
    } else {
      const { name, value } = e.target;
      this.setState({
        billPayload: { ...this.state.billPayload, [name]: value }
      }, () => {
        if (name === "exchangeRate") {
          this.calculateAmount();
        }
      });
    }
  };

  handleTaxChange = (selected, i) => {
    let { billPayload } = this.state;
    billPayload.items[i].taxes = selected.map(item => {
      return item.value;
    });

    this.setState({ billPayload });
    this.calculateAmount();
  };

  addALine = () => {
    let billPayload = cloneDeep(this.state.billPayload);
    const addItem = billProductObject();
    billPayload.items.push(addItem);
    this.setState({ billPayload });
  };

  handleDelete = idx => {
    let billPayload = this.state.billPayload;
    billPayload.items = billPayload.items.filter((s, index) => {
      return !(index === idx);
    });
    if (billPayload.items.length === 0) {
      this.addALine();
    } else {
      this.setState({ billPayload });
    }
    this.calculateAmount()
  };

  billFormSubmit = async (e) => {
    const { showSnackbar, selectedBill, isEditMode } = this.props;
    e.preventDefault();
    try {
      let billPayload = cloneDeep(this.state.billPayload);
      billPayload.businessId = typeof billPayload.businessId === "object" ? billPayload.businessId._id : billPayload.businessId;
      billPayload.vendor = typeof billPayload.vendor === "object" ? billPayload.vendor.id || billPayload.vendor._id : billPayload.vendor;

      if (!billPayload.items.length) {
        showSnackbar('You must have at least one bill item', true);
        return;
      }

      billPayload.amountBreakup.taxes = billPayload.amountBreakup.taxes.map(r => ({
        rate: r.rate,
        amount: r.amount,
        name: r.taxName ? r.taxName.name : r.name,
        abbreviation: r.taxName ? r.taxName.abbreviation : (r.abbreviation || r.name),
        _id: r.taxName ? r.taxName._id : r._id || r.id,
        id: r.taxName ? r.taxName._id : r._id || r.id,
      }));

      const payload = {
        billInput: billPayload
      };
      this.setState({ loading: true });
      let response;
      if (isEditMode) {
        const id = selectedBill.id;
        response = await updateBill(id, payload);
        showSnackbar("Bill Update Successfully", false);
      } else {
        response = await addBill(payload);
        showSnackbar("Bill Added Successfully", false);
      }
      this.setState({ loading: false });
      if (response) {
        history.push(`/app/purchase/bills`);
      }
    } catch (error) {
      this.setState({ loading: false });
      console.error("error in bill post query", error);
      showSnackbar(error.message || "Something went wrong", true);
    }
  };

  onTextChange = (event, i) => {
    let { billPayload } = this.state;
    const { name, value } = event.target;
    let { items } = billPayload;
    items[i][name] = value;
    this.setState({ billPayload });
  };

  onDeletePayment = (e, id) => {
    e.target.disabled = true;
    this.props.deletePayment(id, (error) => {
      this.getPayments();
    })
  };

  onVendorClose = () => {
    this.setState({ vendorModal: false });
  };

  addVendor = async (payload, callback) => {
    try {
      const response = await vendorServices.addVendor({ vendorInput: payload });
      if (response.statusCode === 200 || response.statusCode === 201) {
        this.handleVendor(response.data.vendor);
        if (callback) {
          callback(response.data.vendor);
        }
      } else {
        this.props.showSnackbar(response.message, true);
      }
    } catch (e) {
      this.props.showSnackbar(e.message, true);
      console.error(e)
    }
  };

  handleDeleteBill = (e) => {
    e.preventDefault();

    this.setState({ deleteModal: true });
  };

  onSaveTaxOverrides = (index, overrides) => {
    const billPayload = cloneDeep(this.state.billPayload);
    billPayload.items[index].taxOverrides = overrides || [];

    this.setState({ billPayload }, () => this.calculateAmount());
  };

  taxListForItem = (item) => {
    const { taxList } = this.state;
    const { taxOverrides = [] } = item;
    return taxList.map((row) => {
      if (taxOverrides.find(r => r.id === row._id)) {
        row.className = "has-tax-override";
      }

      return row;
    })
  };

  itemsHtml = (currencySymbol) => {
    const { billPayload, taxList, products } = this.state;

    if (!billPayload.items || !billPayload.items.length) {
      return (
        <tr>
          <td colSpan={7}>
            <div className="py-notify py-notify--warning">
              <div className="py-notify__icon-holder">
                <ReactSVG
                  src="/assets/icons/ic_info.svg"
                  beforeInjection={svg => {
                    svg.classList.add('py-icon');
                  }}
                  evalScripts="always"
                  fallback={() => <span>Error!</span>}
                  loading={() => <span>Loading</span>}
                  renumerateIRIElements={false}
                  wrapper="span"
                />
              </div>
              <div className="py-notify__content-wrapper">
                <div className="py-notify__content">
                  <Fragment>You need to <a href="javascript:void(0);" onClick={this.addALine}>add</a> at least one
                    line.</Fragment>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return billPayload.items.map((item, i) => {
      return (
        <tr key={i}>
          <td>
            <SelectBox
              placeholder="Choose"
              valueKey={"item"}
              labelKey={"name"}
              className="h-100 select-height select-40"
              value={item.item ? item : ""}
              onChange={item => this.handleProduct(item, i)}
              options={products}
              isClearable={false}
              required
            />
          </td>
          <td>
            <textarea className="larger form-control"
              type="textarea"
              name="description"
              onChange={e => this.onTextChange(e, i)}
              value={item.description}
            />
          </td>
          <td>
            <Input
              type="text"
              name="quantity"
              pattern="\d*"
              maxlength={10}
              onChange={e => this.handleProduct(e, i)}
              value={parseFloat(item.quantity) || ""}
            />
          </td>
          <td>
            <Input
              type="number"
              name="price"
              max={9999999999}
              maxlength={10}
              step="any"
              onChange={e => this.handleProduct(e, i)}
              value={item.price}
            />
          </td>
          <td className="select-40 select-tax-cell">
            <div className="select-tax-container">
              <Taxes
                taxList={this.taxListForItem(item)}
                taxValue={item}
                className="h-100 select-height select-40"
                isEditMode={true}
                index={i}
                onChange={this.handleTaxChange}
                fetchtaxList={this.fetchTaxList}
              />
              <TaxOverride
                item={item}
                index={i}
                taxList={taxList}
                currency={billPayload.currency}
                onSave={(overrides) => this.onSaveTaxOverrides(i, overrides)}
              />
            </div>
          </td>

          <td style={{ maxWidth: '100px', textAlign: 'right', verticalAlign: 'middle' }}>
            <span style={{ wordBreak: 'break-all' }}>
            {`${currencySymbol}${toMoney(item.amount)}`}
            </span>
          </td>
          <td className="py-table__cell__action" style={{ width: '50px' }}>
            <span className="py-table__action py-table__action__danger py-icon" onClick={() => this.handleDelete(i)}>
              <svg viewBox="0 0 20 20" id="delete" xmlns="http://www.w3.org/2000/svg"><path
                d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"></path></svg>
            </span>
          </td>
        </tr>
      );
    });
  };

  renderPaymentTotals() {
    const { isEditMode } = this.props;
    const { payments, billPayload: { currency = {}, amountBreakup = {} } } = this.state;

    const totalPaid = sumBy(payments, 'amount');
    const toPay = amountBreakup.total || 0;

    if (!isEditMode) {
      return null;
    }

    return (
      <Fragment>
        <tr className="totalSection">
          <td className="label">
            <span>{`Total Paid (${currency.code || ''})`}:</span>
          </td>
          <td className="amount">
            {`${currency.symbol || ''}${toMoney(totalPaid)}`}
          </td>
        </tr>
        <tr className="totalSection">
          <td className="label">
            <span>{`Amount Due (${currency.code || ''})`}:</span>
          </td>
          <td className="amount">
            {`${currency.symbol || ''}${toMoney(toPay - totalPaid)}`}
          </td>
        </tr>
      </Fragment>
    );
  }

  renderPaymentsTable() {
    const { businessInfo: { currency }, isEditMode } = this.props;
    const { payments } = this.state;

    if (!isEditMode) {
      return null;
    }

    return (
      <div className="py-box no-border py-box--small">
        <Table className="table-no-border" required>
          <thead className="py-table__header">
          <tr className="py-table__row">
            <th className="py-table__cell" style={{ width: '200px' }}>Payment Date</th>
            <th className="py-table__cell" style={{ width: '250px' }}>Payment Method</th>
            <th className="py-table__cell-amount" style={{ width: '200px' }}>Amount</th>
            <th className="py-table__cell__action" style={{ width: '50px' }}>Actions</th>
          </tr>
          </thead>
          <tbody>
          {!payments.length && (
            <tr>
              <td className="no-payments">No payments yet.</td>
              <td />
              <td />
              <td />
            </tr>
          )}
          {payments.map((payment) => (
            <tr>
              <td>{moment(payment.paymentDate).format('YYYY-MM-DD')}</td>
              <td>{startCase(payment.paymentMethod)}</td>
              <td>
                <span style={{ display: 'block', textAlign: 'right' }}>
                  {payment.currency.symbol}{toMoney(payment.amount)} {payment.currency.code}
                </span>
                {payment.exchangeRate !== 1 && (
                  <span style={{ display: 'block', textAlign: 'right' }}>
                    {currency.symbol}{toMoney(payment.amountInHomeCurrency)} {currency.code} @ {payment.exchangeRate}
                  </span>
                )}
              </td>
              <td className="py-table__cell__action">
                <a href="javascript:void(0);" className="py-table__action py-icon py-table__action__danger"
                  onClick={(e) => this.onDeletePayment(e, payment.id)}>
                  <svg viewBox="0 0 20 20" id="delete" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"></path>
                  </svg>
                </a>
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>
    )
  }

  renderVendorInfo = () => {
    const {
      vendor: {
        firstName,
        lastName,
        address: {
          addressLine1,
          addressLine2,
          state,
          city,
          postal,
          country,
        } = {},
        communication: { phone } = {},
        email,
      } = {}
    } = this.state.billPayload;

    if (!this.props.isEditMode || !this.state.billPayload.vendor) {
      return null;
    }


    return (
      <span className="py-text--hint text-capitalize mt-2">
            {firstName || lastName ? (<span> {`${firstName || ''} ${lastName || ''}`.trim()}</span>) : null}
        {addressLine1 && addressLine1.length ? (<div><span> {`${addressLine1 || ''}`}</span></div>) : null}
        {addressLine2 && addressLine2.length > 0 ? (<div><span> {`${addressLine2 || ''}`}</span></div>) : null}
        {city || state || postal ? (
          <div><span> {`${city || ''} ${state.name || ''} ${postal || ''}`.trim()}</span></div>) : null}
        {country ? (<div><span> {`${country.name || ''}`}</span></div>) : null}
        {phone ? (<div><span>{`${phone || ''}`}</span></div>) : null}
        <span> {`${email || ''}`}</span>
      </span>
    )
  };

  render() {
    const {
      billPayload,
      openPopup,
      type,
      vendors,
      selectedVendor,
      currencies,
      showExchange,
      payments,
      loading,
      deleteModal,
    } = this.state;
    const { isEditMode, businessInfo } = this.props;

    const currencySymbol = (billPayload.currency && billPayload.currency.symbol) || businessInfo.currency.code;

    return (
      <div className="content-wrapper__main bill-form">
        <header className="py-header--page">
          <div className="py-header--title">
            <h2 className="py-heading--title">{isEditMode ? "Edit" : "Add"} bill </h2>
          </div>

          <div className="py-header--actions">
            {isEditMode ? (
              <a className="btn btn--narrow btn-outline-danger" href="javascript:void(0);"
                onClick={this.handleDeleteBill}>
                <svg viewBox="0 0 20 20" className="py-icon" id="delete" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"></path>
                </svg>
              </a>
            ) : null}
          </div>
        </header>
        <div className="content">
          {this.state.loader ?
            <div className="d-flex justify-content-center"><Spinner color="primary" size="md" className="loader" />
            </div> : (
              <Form className="bill-create__container" onSubmit={this.billFormSubmit.bind(this)}>
                <FormGroup row className="no-gutters">
                  <Col sm={4}>
                    <FormGroup row>
                      <Label for="exampleEmail" className="text-right" sm={4}>
                        Vendor <span className="text-danger">*</span>
                      </Label>
                      <Col sm={8}>
                        <SelectBox
                          placeholder="Choose"
                          style={{ marginBottom: '5px' }}
                          labelKey={'vendorName'}
                          valueKey={'id'}
                          value={billPayload.vendor}
                          onChange={this.handleVendor}
                          options={vendors}
                          required
                          clearable={false}
                          disabled={!!payments.length}
                        />
                        {this.renderVendorInfo()}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label for="exampleEmail" className="text-right" sm={4}>
                        Currency{" "}
                      </Label>
                      <Col sm={8}>
                        <SelectBox
                          labelKey={'displayName'}
                          valueKey={'code'}
                          value={billPayload.currency}
                          onChange={this.handleCurrency}
                          options={currencies}
                          clearable={false}
                          disabled={!!payments.length}
                        />
                      </Col>
                    </FormGroup>
                    {showExchange && (
                      <FormGroup row>
                        <Label for="exampleEmail" className="text-right" sm={4}>
                          Exchange Rate
                        </Label>
                        <Col sm={8}>
                          <Input
                            type="number"
                            value={billPayload.exchangeRate}
                            name="exchangeRate"
                            disabled={!!payments.length}
                            onChange={this.handleBill}
                          />
                          <div className="py-text--hint">Exchange rate at bill date is from
                            openexhangerates.org
                          </div>
                        </Col>
                      </FormGroup>
                    )}
                  </Col>
                  <Col sm={4}>
                    <FormGroup row>
                      <Label for="exampleEmail" className="text-right" sm={4}>
                        Date
                      </Label>
                      <Col sm={8}>
                        <DatepickerWrapper
                          selected={billPayload.billDate}
                          onChange={date =>
                            this.handleBill(date, "billDate")
                          }
                          disabled={!!payments.length}
                          className="form-control"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="exampleEmail" className="text-right" sm={4}>
                        Due Date{" "}
                      </Label>
                      <Col sm={8}>
                        <DatepickerWrapper
                          selected={billPayload.expiryDate}
                          onChange={date =>
                            this.handleBill(date, "expiryDate")
                          }
                          minDate={this.state.minDate}
                          className="form-control"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="exampleEmail" className="text-right" sm={4}>
                        P.O./S.O.{" "}
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          value={billPayload.purchaseOrder}
                          onChange={this.handleBill}
                          name="purchaseOrder"
                          className="po-field"
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col sm={4} className="notes-column">
                    <FormGroup row>
                      <Label for="exampleEmail" className="text-right" sm={4}>
                        Bill #
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="text"
                          value={billPayload.billNumber}
                          onChange={this.handleBill}
                          name="billNumber"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="exampleEmail" className="text-right" sm={4}>
                        Notes{" "}
                      </Label>
                      <Col sm={8}>
                        <textarea
                          name="notes"
                          rows={5}
                          className="form-control"
                          value={billPayload.notes}
                          onChange={this.handleBill}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </FormGroup>

                <div className="py-box py-box--small">
                  <Table hover className="table-no-border" required>
                    <thead className="py-table__header">
                    <tr className="py-table__row">
                      <th className="py-table__cell" style={{ width: '200px' }}>Item</th>
                      <th className="py-table__cell" style={{ width: '200px' }}>Description</th>
                      <th className="py-table__cell" style={{ width: '60px' }}>Quantity</th>
                      <th className="py-table__cell" style={{ width: '140px' }}>Price</th>
                      <th className="py-table__cell" style={{ width: '200px' }}>Tax</th>
                      <th className="py-table__cell-amount" style={{ width: '126px' }}>Amount</th>
                      <th className="py-table__cell" style={{ width: '50px' }} />
                    </tr>
                    </thead>
                    <tbody>{this.itemsHtml(currencySymbol)}</tbody>
                  </Table>
                  <div className="table-footer-container">
                    <a onClick={this.addALine} href="javascript:void(0);" className="add-icon py-text--link">
                      <svg viewBox="0 0 20 20" className="py-icon" id="add" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm1-10V5.833c0-.46-.448-.833-1-.833s-1 .373-1 .833V9H5.833C5.373 9 5 9.448 5 10s.373 1 .833 1H9v3.167c0 .46.448.833 1 .833s1-.373 1-.833V11h3.167c.46 0 .833-.448.833-1s-.373-1-.833-1H11zm-1 8c4.067 0 7-2.933 7-7s-2.933-7-7-7-7 2.933-7 7 2.933 7 7 7z"></path>
                      </svg>
                      <span>Add a line</span>
                    </a>
                    <Table className="table-no-border tableCalculation">
                      <tbody>
                      <tr>
                        <td className="label"><span>Subtotal:</span></td>
                        <td className="amount"><span>
                            {`${currencySymbol}${toMoney(billPayload.amountBreakup.subTotal)}`}
                          </span></td>
                      </tr>
                      {billPayload.amountBreakup.taxes.length ?
                        billPayload.amountBreakup.taxes.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="label">
                                  <span>
                                    {typeof (item.taxName) === 'object' ?
                                      `${item.taxName.abbreviation}:`
                                      : `${item.abbreviation || item.name}:`
                                    }
                                  </span>
                              </td>
                              <td className="amount">
                                  <span>
                                    {`${currencySymbol}${toMoney(item.amount)}`}
                                  </span>
                              </td>
                            </tr>
                          )
                        }) : null
                      }
                      <tr className="totalSection">
                        <td className="label">
                          <span>{`Total (${billPayload.currency && billPayload.currency.code})`}:</span>
                        </td>
                        <td className="amount">
                          <span>
                            {`${currencySymbol}${toMoney(billPayload.amountBreakup.total)}`}
                          </span>
                        </td>
                      </tr>
                      {this.renderPaymentTotals()}
                      {showExchange && (<tr className="totalSection">
                        <td className="label">
                          <span><small>{`Total (${selectedVendor ? selectedVendor.currency ? get(selectedVendor, 'currency.code') : get(businessInfo, 'currency.code') : get(businessInfo, 'currency.code')} at ${billPayload.exchangeRate})`}:</small></span>
                        </td>
                        <td className="amount">
                          <span>
                            <small>{`${selectedVendor ? selectedVendor.currency ? get(selectedVendor, 'currency.symbol') : businessInfo.currency.symbol : businessInfo.currency.symbol}${toMoney(billPayload.totalAmountInHomeCurrency)}`}</small>
                          </span>
                        </td>
                      </tr>)}
                      </tbody>
                    </Table>
                  </div>
                </div>
                {this.renderPaymentsTable()}
                <div className="text-right pdT20 pdB20">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={this.props.history.goBack}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading}
                    style={{ marginLeft: '8px' }}
                    // onClick={this.billFormSubmit}
                  >
                    {loading && (
                      <Spinner color="white" size="sm" className="loader" style={{ marginRight: '10px' }} />
                    )}
                    Save
                  </button>
                </div>
                {/* </FormGroup> */}
              </Form>
            )}
          <VendorModal
            isOpen={this.state.vendorModal}
            currency={businessInfo.currency}
            onClose={this.onVendorClose}
            addVendor={this.addVendor}
          />
          <Popup
            type={type}
            openPopup={openPopup}
            onClosePopup={this.onPopupClose}
            updateList={this.updateList}
            setData={this.setData.bind(this)}
          />
          <DeleteModal
            message='Are you sure you want to delete this bill?'
            openModal={deleteModal}
            onDelete={this.onDeleteClick}
            onClose={this.onCloseDelete}
          />
        </div>
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
    fetchPayments(id, callback) {
      dispatch(fetchPayments(id, callback));
    },
    deletePayment(id, callback) {
      dispatch(deletePayment(id, callback));
    },
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    }
  };
};

export default withRouter(connect(mapPropsToState, mapDispatchToProps)(BillForm));
