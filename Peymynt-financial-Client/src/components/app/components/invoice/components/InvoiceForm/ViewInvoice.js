import { PDFExport } from "@progress/kendo-react-pdf";
import history from "customHistory";
import OnlinePaymentWrapper from 'global/OnlinePaymentWrapper';
import * as PaymentIcon from 'global/PaymentIcon';
import { cloneDeep } from "lodash";
import moment from "moment";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import ReactToPrint from 'react-to-print';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Popover, PopoverBody } from "reactstrap";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import { DeleteModal, PaymentConfirmation } from "utils/PopupModal/DeleteModal";
import { getAmountToDisplay, _showPaymentText, _showExchangeRate, _showAmount, _calculateExchangeRate, _downloadPDF } from "../../../../../../utils/GlobalFunctions";
import { closeMailBox, closePayment } from "../../../../../../actions";
import { getInvoicePayments } from "../../../../../../actions/invoiceActions";
import { openGlobalSnackbar, updateData } from "../../../../../../actions/snackBarAction";
import ReactSVG from 'react-svg';
import {
  cloneInvoice,
  deleteInvoice,
  getInvoice,
  patchInvoice,
  removePayment,
  sendInvoice,
  downloadPdf
} from "../../../../../../api/InvoiceService";
import { fetchSalesSetting } from '../../../../../../api/SettingService';
import CenterSpinner from "../../../../../../global/CenterSpinner";
import SweetAlertSuccess from "../../../../../../global/SweetAlertSuccess";
import { convertDateToYMD } from "../../../../../../utils/common";
import {
  _dueText,
  _paymentMethodDisplay,
  _prettyDateTime,
  changePriceFormat,
} from "../../../../../../utils/GlobalFunctions";
import Popup from "../../../Estimates/components/Popup";
import { invoiceSettingPayload } from "../../../setting/components/supportFunctionality/helper";
import { invoiceInput } from "../../helpers";
// import customStrings from "../../../../../constants/invoiceConst";
import strings from '../../helpers/InvoiceDueFormatter';
import InvoicePayment, { ACCOUNT } from "../InvoicePayment";
import InvoicePreview from "../InvoicePreview";
import InvoicePreviewClassic from "../InvoicePreviewClassic";
import InvoicePreviewModern from "../InvoicePreviewModern";
import SendReceipt from "../SendReceipt";
import GetAShareLink from "./GetAShareLink";
import MailInvoice from "./MailInvoice";
import SendAReminder from "./SendAReminder";
import ExportPdfModal from "../../../../../../utils/PopupModal/ExportPdfModal";

const formatter = buildFormatter(strings);
let link;
class ViewInvoice extends Component {
  state = {
    dropdownOpen: false,
    openReminder: false,
    popoverOpen: false,
    openModal: false,
    dropdownOpenMore: false,
    onRecordModal: false,
    modal: false,
    openPaymentConfirm: false,
    invoiceModal: false,
    selectedCustomer: null,
    invoiceData: invoiceInput(),
    onPrint: false,
    openMail: false,
    openAlert: false,
    openReceiptMail: false,
    isDelete: false,
    paymentMethods: ACCOUNT,
    userSettings: invoiceSettingPayload(),
    loading: false,
    openPopup: false,
    type: 'CustomerPopup',
    editCustomer: false,
    newSentState: new Date(),
    recordStep: '',
    editRecord: false,
    allPayments: null,
    alertTitle: "",
    alertMsg: "",
    from: "",
    paymentIsEdit: false,
    openExportModal: false,
    downloadLoading: false,
    btnLoading: false,
  };

  componentDidMount = () => {
    const { businessInfo } = this.props;
    document.title =
      businessInfo && businessInfo.organizationName
        ? `Peymynt - ${businessInfo.organizationName} - Invoices`
        : `Peymynt - Invoices`;
    const id = this.props.match.params.id;
    this.fetchInvoiceData(id);
  };

  componentDidUpdate(prevProps) {
    const { updateData } = this.props;
    if (prevProps.updateData !== updateData) {
      const id = this.props.match.params.id;
      this.fetchInvoiceData(id);
    }
  }

  fetchInvoiceData = async () => {
    const id = this.props.match.params.id;

    try {
      this.setState({ loading: true });
      const {
        closePayment,
        closeMailBox,
        isPayment,
        isMailBox,
        businessInfo
      } = this.props;
      let response = await getInvoice(id);
      const settingRequest = await fetchSalesSetting();
      this.props.getInvoicePayments(id);
      const userSettings = response.data.salesSetting;
      const invoiceData = invoiceInput(response.data.invoice, businessInfo, userSettings);
      this.setState({ invoiceData, userSettings, loading: false, newSentState: invoiceData.lastSent }, () => {
        if (isMailBox) {
          this.openMailBox();
          closeMailBox();
        } else if (isPayment) {
          this.onRecordClick();
          closePayment();
        }
      });
    } catch (error) {
      console.error("error", error);
      if (error.data) {
        this.props.showSnackbar(error.message, true);
        history.push("/app/invoices");
      }
    }
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  onCloseMail = (status, alertTitle, alertMsg, from) => {
    this.setState({
      openMail: false,
    });
    if (status === true) {
      this.onOpenAlert(this.state.receiptItem, alertTitle, alertMsg, from)
      this.fetchInvoiceData()
    }
  };

  openMailBox = () => {
    this.setState({
      openMail: true
    });
  };

  onOpenReceiptMail = (item, index) => {
    this.setState({
      openReceiptMail: true,
      receiptItem: item,
      receiptIndex: index,
      openAlert: false
    })
  };

  onCloseReceiptMail = () => {
    this.setState({
      openReceiptMail: false
    })
  };

  onRecordClick = (item, index, recordStep, edit, isEdit) => {
    if (index !== null) {
      this.setState({
        onRecordModal: true,
        receiptItem: item,
        receiptIndex: index,
        recordStep,
        editRecord: edit === true ? true : false,
        paymentIsEdit: isEdit
      })
    } else {
      this.setState({
        onRecordModal: true,
        editRecord: edit === true ? true : false,
        recordStep,
        receiptIndex: index,
        receiptItem: item,
        paymentIsEdit: isEdit
      });
    }
  };

  onRecordClose = (refresh) => {
    console.log("in close", this.state.onRecordModal)
    this.setState({
      onRecordModal: false,
    });
    if(refresh === true){
      this.fetchInvoiceData()
    }
  };

  setReminder = e => {
    const { name, value } = e.target;
    let invoiceData = cloneDeep(this.state.invoiceData);
    invoiceData = {
      ...this.state.invoiceData,
      [name]: {
        ...this.state.invoiceData[name],
        enable: !this.state.invoiceData[name].enable
      }
    };
    const remiderCheck = ["beforeFourteen", "beforeSeven", "beforeThree", "onDueDate", "afterThree", "afterSeven", "afterFourteen"];
    const isReminder = remiderCheck.filter(item => {
      return invoiceData[item].enable === true
    });
    invoiceData.isReminder = isReminder.length > 0;
    switch (name) {
      case "beforeFourteen":
        invoiceData[name].notifyDate = moment(
          moment().subtract(14, "d")
        ).format("YYYY-MM-DD");
        break;
      case "beforeSeven":
        invoiceData[name].notifyDate = moment(moment().subtract(7, "d")).format(
          "YYYY-MM-DD"
        );
        break;
      case "beforeThree":
        invoiceData[name].notifyDate = moment(moment().subtract(3, "d")).format(
          "YYYY-MM-DD"
        );
        break;
      case "onDueDate":
        invoiceData[name].notifyDate = moment().format("YYYY-MM-DD");
        break;
      case "afterThree":
        invoiceData[name].notifyDate = moment(moment().add(3, "d")).format(
          "YYYY-MM-DD"
        );
        break;
      case "afterSeven":
        invoiceData[name].notifyDate = moment(moment().add(7, "d")).format(
          "YYYY-MM-DD"
        );
        break;
      case "afterFourteen":
        invoiceData[name].notifyDate = moment(moment().add(14, "d")).format(
          "YYYY-MM-DD"
        );
        break;
    }
    this.setState(
      {
        invoiceData
      },
      () => {
        this.addReminder();
      }
    );
  };

  addReminder = async () => {
    try {
      let invoice = invoiceInput(this.state.invoiceData);
      const id = invoice._id;
      delete invoice._id;
      delete invoice.onlinePayments
      invoice.customer;
      invoice.businessId = typeof invoice.businessId === "object" ? invoice.businessId._id : invoice.businessId;
      await patchInvoice(id, { invoiceInput: invoice });
    } catch (error) {
      console.error("errrorrrrr============>", error);
      // alert("error");
      this.props.showSnackbar(error.message, true);
    }
  };

  openCloseReminder = () => {
    this.setState(prevState => ({
      openReminder: !prevState.openReminder
    }));
  };

  onConfirmDelete = () => {
    this.setState({ isDelete: true });
  };

  onCloseModal = () => {
    this.setState({ isDelete: false });
  };

  onDeleteClick = async () => {
    const { refreshData, showSnackbar } = this.props;
    const { invoiceData } = this.state;
    try {
      await deleteInvoice(invoiceData._id);
      // refreshData();
      this.onCloseModal();
      history.push("/app/invoices");
    } catch (error) {
      showSnackbar(error.message, true)
    }
  };

  onOpenAlert = (item, title, msg, from) => {
    this.setState({
      openAlert: true,
      receiptItem: item,
      alertTitle: title,
      alertMsg: msg,
      from
    });
    this.onRecordClose()
  };

  onCloseAlert = () => {
    this.setState({
      openAlert: false
    })
  };


  onShareLink = () => {
    this.setState({
      openShareLink: !this.state.openShareLink
    })
  };

  openPopup = () => {
    const { openMail, openPaymentConfirm, openShareLink, openAlert, invoiceData, receiptItem, receiptIndex, onRecordModal, openReminder, openReceiptMail, isDelete, editRecord,
    alertMsg, alertTitle, from, paymentIsEdit, openExportModal, downloadLoading, btnLoading } = this.state;
    return (
      <Fragment>
        <MailInvoice
          openMail={openMail}
          invoiceData={invoiceData}
          onClose={this.onCloseMail.bind(this)}
        />
        <GetAShareLink
          openShareLink={openShareLink}
          onClose={this.onShareLink}
          invoiceData={invoiceData}
          copyMarkSent={() => this._markAsSent(new Date())}
        />
        <SendReceipt
          openRecord={openReceiptMail}
          invoiceData={invoiceData}
          receipt={receiptItem}
          receiptIndex={receiptIndex}
          onClose={this.onCloseReceiptMail}
          showSnackbar={this.props.showSnackbar}
          refreshData={this.props.refreshData}
        />
        <SendAReminder
          openReminder={openReminder}
          invoiceData={invoiceData}
          onClose={this.openCloseReminder}
        />
        <InvoicePayment
          openRecord={onRecordModal}
          paymentData={invoiceData}
          receipt={receiptItem}
          receiptIndex={receiptIndex}
          onClose={this.onRecordClose}
          openAlert={this.onOpenAlert}
          showSnackbar={this.props.showSnackbar}
          refreshData={this.props.refreshData}
          recordStep={this.state.recordStep}
          onOpenReceiptMail={this.onOpenReceiptMail}
          edit={editRecord}
          isEdit={paymentIsEdit}
        />
        <PaymentConfirmation
          openModal={openPaymentConfirm}
          paymentData={invoiceData}
          payment={receiptItem}
          onConfirm={this.onRemovePayment}
          onClose={this.onPaymentClick}
        />
        <DeleteModal
          message={"Are you sure you want to delete this invoice?"}
          openModal={isDelete}
          onDelete={this.onDeleteClick}
          onClose={this.onCloseModal}
          refreshData={this.props.refreshData}
          number={invoiceData.invoiceNumber}
        />
        <SweetAlertSuccess
          showAlert={openAlert}
          receipt={receiptItem}
          receiptIndex={receiptIndex}
          onConfirm={this.onOpenReceiptMail}
          onCancel={this.onCloseAlert}
          title={alertTitle}
          message={alertMsg}
          from={from}
        />
        <ExportPdfModal
          openModal={openExportModal}
          onClose={() => this.setState({openExportModal: !this.state.openExportModal})}
          onConfirm={this.exportPDF.bind(this, true)}
          loading={downloadLoading}
          from="invoice"
          btnLoading={btnLoading}
        />
      </Fragment>
    );
  };

  onEditOnlinePayment = async (e) => {
    let invoiceData = invoiceInput(this.state.invoiceData);
    const id = invoiceData._id;
    const { name, value } = e.target;
    invoiceData = {
      ...this.state.invoiceData,
      onlinePayments: {
        ...this.state.invoiceData.onlinePayments,
        [name]: !this.state.invoiceData.onlinePayments[name]
      }
    };
    this.setState({ invoiceData });
    try {
      delete invoiceData._id;
      // invoiceData.businessId = typeof invoiceData.businessId === "object" ? invoiceData.businessId._id : invoiceData.businessId;
      let res = await sendInvoice(id, { invoiceInput: { onlinePayments: { modeCard: invoiceData.onlinePayments.modeCard, modeBank: invoiceData.onlinePayments.modeBank } } });
      if (res.statusCode === 200) {
        this.setState({ invoiceData: res.data.invoice })
      }
    } catch (error) {
      console.error("errrorrrrr============>", error);
      // alert("error");
      this.props.showSnackbar(error.message, true);
    }

  };

  onUpdateStatusCall = async status => {
    const invoiceData = this.state.invoiceData;
    if (invoiceData.items.length > 0) {
      try {
        let payload = {};
        if (status === "approve") {
          payload.invoiceInput = { status: "saved" }
          // if(invoiceData.customer.email ===""){
          //   // this.props.showSnackbar("customer email is required", true);
          //   // return
          // }else{
          // payload = {
          //   invoiceInput: { status: "saved" }
          // };}
        } else {
          if (invoiceData.skipped) {
            payload = {
              invoiceInput: {
                sentVia: "marked_sent",
                lastSent: new Date(),
                skipped: false,
                skippedDate: new Date()
              }
            };

            if (invoiceData.status != "overdue") {
              payload.invoiceInput.status = "sent";
            }
          } else {
            payload = {
              invoiceInput: {
                skipped: true,
                skippedDate: new Date()
              }
            };
          }
        }
        let response = await sendInvoice(invoiceData._id, payload);
        this.setState({ invoiceData: response.data.invoice, openShareLink: false });
      } catch (error) {
        this.props.showSnackbar(error.message, true);
      }
    } else {
      this.props.showSnackbar(
        "A non-draft invoice must have one or more items",
        true
      );
    }
  };

  _markAsSent = async (date) => {
    const invoiceData = this.state.invoiceData;
    if (invoiceData.items.length > 0) {
      try {
        let payload = {};
        if (status === "approve") {
          payload.invoiceInput = { status: "saved" }
        } else {
          payload = {
            invoiceInput: {
              sentVia: "marked_sent",
              lastSent: new Date(date),
              skipped: false,
              skippedDate: new Date()
            }
          };

          if (invoiceData.status != "overdue") {
            payload.invoiceInput.status = "sent";
          }
        }
        let response = await sendInvoice(invoiceData._id, payload);
        this.setState({ invoiceData: response.data.invoice, openShareLink: false, newSentState: response.data.invoice.lastSent, editDate: false });
      } catch (error) {
        this.props.showSnackbar(error.message, true);
      }
    } else {
      this.props.showSnackbar(
        "A non-draft invoice must have one or more items",
        true
      );
    }
  };

  setCSSClass = () => {
    const { invoiceData } = this.state;
    if (invoiceData.status === "overdue") {
      return "badge badge-danger";
    } else if (invoiceData.status === "saved") {
      return "badge badge-secondary";
    } else if (invoiceData.status === "draft") {
      return "badge badge-secondary";
    } else if (invoiceData.status === "paid") {
      return "badge badge-success";
    } else if (invoiceData.status === "partial") {
      return "badge badge-warning";
    } else if (invoiceData.status === "sent") {
      return "badge badge-info";
    } else if (invoiceData.status === "viewed") {
      return "badge badge-info";
    } else {
      return "";
    }
  };


  /**
   * This code can be get rid of
   */
  // printToPdf = () => {
  //   const input = document.getElementById("printInvoice");

  //   const printContents = input.innerHTML;
  //   const originalContents = document.body.innerHTML;

  //   document.body.innerHTML = printContents;

  //   window.print();

  //   document.body.innerHTML = originalContents;

  //   location.reload();
  // };

  exportPDF = async (download) => {
    const date = moment().format("YYYY-MM-DD");
    const { invoiceData } = this.state;
    this.setState({
      btnLoading: true
    })
    if(!download){
      this.setState({openExportModal: true, downloadLoading: true})
      try{
        link = await _downloadPDF(invoiceData, 'invoices');
      }catch(err){
        console.error("Export Error in invoice Dropdown =>", err)
        this.props.showSnackbar("Something went wrong.", true)
        this.setState({openExportModal: false})
      }
    }
    if(!!link){
      this.setState({downloadLoading: false, btnLoading: false})
      if(download){
        this.setState({openExportModal: false, btnLoading: false})
        link.download =  `Invoice_${invoiceData.invoiceNumber}_${date}.pdf`;
        link.click();
      }
    }else{
      this.setState({ downloadLoading: false})
      this.props.showSnackbar("Failed to download PDF. Please try again after sometime.", true)
    }
  };

  onDuplicate = async () => {
    const id = this.state.invoiceData._id;
    const response = await cloneInvoice(id);
    const invoiceId = response.data.invoice._id;
    history.push(`/app/invoices/edit/${invoiceId}`);
  };

  onCustomerViewClick = () => {
    history.push(`/public/invoice/${this.state.invoiceData.uuid}`)
  };

  onRemovePayment = async () => {
    const { invoiceData, receiptItem } = this.state;
    try {
      let response = await removePayment(invoiceData._id, receiptItem._id);
      if (response.statusCode === 200) {
        this.props.refreshData();
        this.onPaymentClick(undefined)
      } else {
        this.props.showSnackbar(response.message, true)
      }
    }
    catch (err) {
      this.props.showSnackbar(err.message, true)
    }
  };

  onPaymentClick = (item) => {
    this.setState(prevState => ({
      openPaymentConfirm: !prevState.openPaymentConfirm,
      receiptItem: item
    }));
  };

  renderInvoiceReceipt = (invoiceData, payments) => {
    const { userSettings } = this.state;
    if (userSettings && userSettings.template === "classic") {
      return (<InvoicePreviewClassic
        ref={el => (this.componentRef = el)}
        invoiceData={invoiceData}
        userSettings={userSettings}
        payments={payments}
        showPayment={true}
      />)
    } else if (userSettings && userSettings.template === "modern") {
      return (<InvoicePreviewModern
        ref={el => (this.componentRef = el)}
        invoiceData={invoiceData}
        userSettings={userSettings}
        payments={payments}
        showPayment={true}
      />)
    } else {
      return (<InvoicePreview
        ref={el => (this.componentRef = el)}
        invoiceData={invoiceData}
        userSettings={userSettings}
        payments={payments}
        showPayment={true}
      />)
    }
  };

  createRecurringFromInvoice = () => {
    history.push("/app/invoices/add");
  };

  _handleEditCustomer(e) {
    e.preventDefault();
    this.setState({ openPopup: true, editCustomer: true });
    this.toggle();
  }

  onPopupClose = async type => {
    this.setState({ openPopup: !this.state.openPopup });
  };
  setData = (selected) => {
    const { businessInfo } = this.props;
    let { invoiceData, selectedCurency, currencies } = this.state;
    invoiceData.customer = (selected) || "";
    this.setState({
      invoiceData,
    });
  };

  render() {
    let { businessInfo, allPayments } = this.props;
    const { invoiceData, onPrint, userSettings, loading, type, openPopup, paymentIsEdit } = this.state;
    const { currency } = invoiceData;
    let paymentsInvoice = [];
    if (!!allPayments && allPayments.success) {
      if (allPayments.data && allPayments.data.payments) {
        if (allPayments.data.payments.length > 0) {
          paymentsInvoice = allPayments.data.payments
        }
      }
    }

    console.log("paymentsInvoice", invoiceData)

    if (paymentsInvoice.length > 0) {
      paymentsInvoice.map(item => {
        item.text = '<span>';
        if (item.method === 'manual') {
          item.text += (
            `${_showPaymentText(item.paymentDate, currency, item.type, item.amount)}
            ${_showExchangeRate(businessInfo.currency, currency, item.exchangeRate) ? `(${getAmountToDisplay(businessInfo.currency, _calculateExchangeRate(item.exchangeRate, item.amount))} ${businessInfo.currency.code} @ ${item.exchangeRate})` : ""} was made${_paymentMethodDisplay(item.methodToDisplay)}.`
          )
        } else if (item.method === 'card') {
          item.text += (
            `${_showPaymentText(item.paymentDate, currency, item.type, item.amount)}
            ${_showExchangeRate(businessInfo.currency, currency, item.exchangeRate) ? `(${getAmountToDisplay(businessInfo.currency, _calculateExchangeRate(item.exchangeRate, item.amount))} ${businessInfo.currency.code} @ ${item.exchangeRate})` : ""} was made using
            <img
              src=${process.env.WEB_URL.includes('localhost') ? `/${PaymentIcon[item.card.type]}` : `${PaymentIcon[item.card.type]}`}
              style='height:24px; width:38px; vertical-align:sub' /> ending in ${item.card.number}.`
          )
        } else if (item.method === 'bank') {
          item.text += (
            `${_showPaymentText(item.paymentDate, currency, item.type, item.amount)}
            ${_showExchangeRate(businessInfo.currency, currency, item.exchangeRate) ? `(${getAmountToDisplay(businessInfo.currency, _calculateExchangeRate(item.exchangeRate, item.amount))} ${businessInfo.currency.code} @ ${item.exchangeRate})` : ""} was made using
            <img
              src=${process.env.WEB_URL.includes('localhost') ? `/${PaymentIcon['bank']}` : `${PaymentIcon['bank']}`} style="height:24px; width:38px; vertical-align:sub"/> (${item.bank && item.bank.name && item.bank.name} ••• ${item.bank && item.bank.number && item.bank.number}):`
          )
        }
        item.text += `<div><small className="color-muted">${!!item.memo ? item.memo : ""}</small></div></span>`
        return item;
      })
    }
    const isSendMailToCust =
      invoiceData.status !== "draft" && invoiceData.skipped;
    const todayDate = moment();
    const dueDate = moment(invoiceData.dueDate);
    const dateDiffrence = dueDate.diff(todayDate, "days");
    const { customer, payments } = invoiceData;
    console.log("check 2", isSendMailToCust, dateDiffrence)

    return (
      <Fragment>
        <div className="content-wrapper__main__fixed invoiceWrapper">
          {
            loading ?
              <CenterSpinner />
              : (
                <Fragment>

                  <div className="invoice-view">
                    <div className="invoice-view-header">
                      <header className="py-header--page">
                        <div className="py-header--title">
                          <h2 className="py-heading__title">
                            {" "}
                            {invoiceData.title} #{invoiceData.invoiceNumber}{" "}
                          </h2>
                        </div>

                      <div className="py-header--actions">
                          <OnlinePaymentWrapper
                            status={invoiceData && invoiceData.onlinePayments.businessEnabled}
                            offScreen={invoiceData && invoiceData.onlinePayments && invoiceData.onlinePayments.systemEnabled}
                            handleChangeMode={e => this.onEditOnlinePayment(e)}
                            invoiceData={invoiceData.onlinePayments}
                          />
                          <Dropdown
                            isOpen={this.state.dropdownOpen}
                            toggle={this.toggleDropdown}
                            className="mx-2"
                          // onSelect={() => null}
                          >
                            <DropdownToggle className="btn btn-outline-primary" caret>
                              More actions{" "}
                            </DropdownToggle>
                            <DropdownMenu>

                              <div className="dropdown-menu--body">
                              <DropdownItem key={1} onClick={this.onDuplicate}>
                                Duplicate
                            </DropdownItem>
                              <DropdownItem key={2} onClick={this.createRecurringFromInvoice}>
                                Make recurring
                            </DropdownItem>
                              <div className="dropdown-item-divider"></div>
                              <DropdownItem key={3} onClick={this.exportPDF.bind(this, false)}>Export as PDF </DropdownItem>
                              {/* content={() => this.componentRef}
                            /> */}
                              <DropdownItem key={4} onClick={this.onShareLink} >Get share link</DropdownItem>
                              <DropdownItem key={5}>
                                <ReactToPrint
                                  trigger={() => <a className="print"> Print </a>}
                                  content={() => this.componentRef}
                                />
                              </DropdownItem>
                              <div className="dropdown-item-divider"></div>
                              <DropdownItem key={6} onClick={() => history.push('/app/setting/invoice-customization')}>Customize</DropdownItem>
                              <DropdownItem key={7} onClick={this.onCustomerViewClick} >Preview as customer</DropdownItem>
                              <div className="dropdown-item-divider"></div>
                              <DropdownItem key={8} onClick={this.onConfirmDelete}>
                                Delete
                            </DropdownItem>
                              </div>

                            </DropdownMenu>
                          </Dropdown>
                          <Button
                            onClick={() => history.push("/app/invoices/add")}
                            className="btn btn-outline-primary"
                          >
                            Create another invoice
                        </Button>
                      </div>
                    </header>
                  </div>


                        <div className="invoice-view__body">
                          <div className="invoice-view-summary">
                            <div className="invoice-view-summary__status">
                              <div className="block-label"> Status</div>
                              <div style={{marginTop: '8px'}} className={this.setCSSClass()}>
                                {" "}
                                {invoiceData.status === "saved"
                                  ? "Unsent"
                                  : invoiceData.status}{" "}
                              </div>
                            </div>
                            <div className="invoice-view-summary__customer">
                              <div className="block-label"> Customer</div>
                              <div className="summary__customer__name">
                                <button id="Popover1" type="button" onClick={this.toggle}>
                                  {" "}
                                  {invoiceData.customer.customerName}{" "}
                                  <i className="fa fa-info-circle" />
                                  {/* <span className="fa-stack fa-sm">
                                  <i className="fa fa-circle-o fa-stack-1x"></i>
                                  <i className="fa fa-info fa-stack-1x"></i>
                                </span> */}
                                </button>
                              </div>
                            </div>
                            <div className="invoice-view-summary__amount">
                              <div className="block-label"> Amount due</div>
                              <div className="summary__Amount__value">
                                {" "}
                                {
                                  invoiceData ? getAmountToDisplay(invoiceData.currency, invoiceData.dueAmount) : ''
                                }
                              </div>
                            </div>
                            <div className="invoice-view-summary__due-date">
                              <div className="block-label">{_dueText(invoiceData.dueDate)}</div>
                              <div className="summary__amount__datevalue">
                                {" "}
                                {invoiceData.dueAmount > 0
                                  ? _prettyDateTime(invoiceData.dueDate, false, 'MMMM D, YYYY')
                                  : "--"}{" "}
                              </div>
                            </div>
                          </div>
                          <div className="py-box py-box--large">
                            {
                              invoiceData.status.toLowerCase() === 'draft' ?
                                (<div className={`py-notify py-notify--sm py-notify--info invoice-state-${invoiceData.status.toLowerCase()}`}>

                                  <ReactSVG
                                  src="/assets/icons/ic_info.svg"
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
                                  className="py-notify__icon-holder"
                                  />
                                  <div className="py-notify__content-wrapper">
                                    <div className="py-notify__content">
                                     This is a{" "} <span className="py-text--strong py-text--uppercase">draft</span> invoice. You can take further actions once you approve it.
                                    </div>
                                </div>
                                </div>)
                                : ""
                            }
                            <div className="invoice-steps-card__options">
                              <div className="invoice-step-card__header">
                                <div className="step-indicate">
                                  {invoiceData.status === "draft" ? (
                                    <div className="step-name">1</div>
                                  ) : (
                                      <div className="step-done-mark">
                                        {" "}
                                        <img src="/assets/check-mark-fill.svg" />
                                      </div>
                                    )}
                                </div>

                                <div className="py-heading--subtitle">Create</div>
                                <div className="invoice-step-card__actions">
                                  {invoiceData.status === "draft" && (
                                    <Button
                                      onClick={() => this.onUpdateStatusCall("approve")}
                                      className="btn-primary"
                                    >
                                      Approve draft
                                  </Button>
                                  )}
                                  <Button
                                    onClick={() =>
                                      history.push(`/app/invoices/edit/${invoiceData._id}`)
                                    }
                                    className="btn btn-outline-primary"
                                  >
                                    {invoiceData.status === "draft"
                                      ? `Edit draft`
                                      : `Edit invoice`}
                                  </Button>

                                </div>
                              </div>
                            </div>
                            <div className="invoice-steps-card__content">
                              <div className="invoice-create-info ">
                                <span className="py-text--strong">Created on:</span>
                                <span>{_prettyDateTime(invoiceData.createdAt, true, "lll", true, 'ha z')} {invoiceData.isRecurring ? <span>from a <NavLink to={`recurring/view/${'5cc4a012fe5cbf100cef6ed6'}`} className="py-text--strong">recurring invoice</NavLink></span> : ""}</span>
                              </div>
                            </div>
                          </div>

                          <div class="invoice-view__body__vertical-line"></div>

                          <div className={invoiceData.status === 'draft' ? "py-box py-box--large disabled" : "py-box py-box--large"}>
                            <div className="invoice-steps-card__options">
                              <div className="invoice-step-card__header">
                              <div
                                className={`${
                                  invoiceData.skipped || invoiceData.status === 'draft'
                                    ? "step-indicate de-activate"
                                    : "step-indicate"
                                  }`}
                              >
                                {(["sent", "partial", "paid"].includes(invoiceData.status) && invoiceData.skipped) ||
                                  invoiceData.sentVia === "marked_sent" ? (
                                    <div className="step-done-mark">
                                      {" "}
                                      <img src="/assets/check-mark-fill.svg" />
                                    </div>
                                  ) : (
                                    <div className={"step-name"}>2</div>
                                  )}
                              </div>
                              <div className="py-heading--subtitle">Send</div>
                              {((["sent", "partial", "overdue"].includes(invoiceData.status)) && !invoiceData.skipped) &&
                                !!invoiceData.sentVia ? (
                                  <div className="invoice-step-card__actions">
                                    <Button
                                      onClick={this.openMailBox}
                                      className={!!invoiceData.sentVia ? "btn btn-outline-primary" : "btn-primary"}
                                    >
                                      Resend invoice
                                  </Button>
                                    <Button
                                      onClick={this.onShareLink}
                                      className="btn btn-outline-primary"
                                    >
                                      Get share link
                                  </Button>
                                  </div>
                                ) : (
                                  invoiceData.status !== "draft" && (
                                    <div className="invoice-step-card__actions">
                                      <Button
                                        onClick={this.openMailBox}
                                        className={invoiceData.sentVia === "" ? "btn btn-outline-primary" : "btn-primary"}
                                      >
                                        Send invoice
                                  </Button>
                                      {
                                        invoiceData.status !== 'draft'
                                          ? <Button
                                            onClick={this.onShareLink}
                                            className="btn btn-outline-primary"
                                          >
                                            Get share link
                                        </Button>
                                          : <Button
                                            onClick={this.onUpdateStatusCall}
                                            className="btn btn-outline-primary"
                                          >
                                            {invoiceData.skipped
                                              ? `Mark as sent`
                                              : `Skip Sending`}
                                          </Button>
                                      }
                                    </div>
                                  )
                                )}
                                </div>
                            </div>
                            <div className="invoice-steps-card__content">
                              {invoiceData.skipped ? (
                                <div className="invoice-create-info">
                                  {/* <strong>Skipped:</strong> */}
                                  <span> {`This invoice was marked as sent.`} </span>
                                </div>
                              ) : (
                                  <div className="invoice-create-info mt-3">
                                    <div className="">
                                    <span className="py-text--strong">Last sent:&nbsp;</span>
                                    <Fragment>
                                      {!!invoiceData.sentVia
                                        ? invoiceData.lastSent
                                          ? (<span style={{ left: '10px' }}>
                                            Marked as sent {_prettyDateTime(invoiceData.lastSent, true, "lll", true, "ha z")}.{" "}
                                            {
                                              this.state.editDate ?
                                                (
                                                  <Fragment>
                                                    &nbsp;<DatepickerWrapper
                                                      selected={this.state.newSentState}
                                                      onChange={date => {
                                                        this.setState({
                                                          newSentState: date
                                                        })
                                                      }
                                                      }
                                                      className="mrT10 form-control"
                                                      style={{ width: '140px', marginTop: '10px' }}
                                                    />&nbsp;
                                                    <a
                                                      href="javascript: void(0)"
                                                      className="py-text--strong"
                                                      onClick={() => { this._markAsSent(this.state.newSentState) }}
                                                    >Save</a>
                                                    &nbsp;or&nbsp;
                                                    <a
                                                      href="javascript: void(0)"
                                                      className="py-text--strong"
                                                      onClick={() => { this.setState({ editDate: false }) }}
                                                    >Cancel</a>
                                                  </Fragment>
                                                )
                                                : (<a
                                                  href="javascript: void(0)"
                                                  className="py-text--strong"
                                                  onClick={() => { this.setState({ editDate: true }) }}
                                                >
                                                  Edit date
                                                </a>)
                                            }
                                          </span>)
                                          : <span>Never — <a href="javascript: void(0)" className="py-text--strong" onClick={() => this._markAsSent(new Date())}>Mark as sent</a> to set up reminders</span>
                                        : invoiceData.status === 'draft'
                                          ? 'Never'
                                          : <span>Never — <a href="javascript: void(0)" className="py-text--strong" onClick={() => this._markAsSent(new Date())}>Mark as sent</a> to set up reminders</span>}{" "}
                                    </Fragment>
                                    </div>
                                    {invoiceData.lastViewedOn &&
                                      <span>
                                        <strong>Last viewed by customer: </strong>
                                        <span>{_prettyDateTime(invoiceData.lastViewedOn, true, 'on lll', true, "ha z")}</span>
                                      </span>
                                    }
                                  </div>

                                )}
                            </div>
                          </div>
                          <div class="invoice-view__body__vertical-line"></div>
                          {((invoiceData.status === "draft" || invoiceData.sentVia === "")) ?
                            <div className={invoiceData.status === 'draft' || invoiceData.sentVia === "" ? "py-box py-box--large disabled" : "py-box py-box--large"}>
                              <div className="invoice-steps-card__options">

                                <div className="invoice-step-card__header">
                                  <div className={invoiceData.status === 'draft' ? "step-indicate de-activate" : "step-indicate"}>
                                    <div className="step-name">3</div>
                                  </div>
                                  <div className="py-heading--subtitle">Get Paid</div>
                                <div className="invoice-step-card__actions">
                                  {!invoiceData.status.includes("draft") && invoiceData.dueAmount > 0 && (
                                    <Fragment>
                                      {
                                        invoiceData.onlinePayments.systemEnabled ?
                                          (
                                            <Button
                                              onClick={() => this.onRecordClick(null, null, 1)}
                                              className="btn-primary"
                                              disabled={invoiceData.sentVia === ""}
                                            >
                                              Charge a credit card
                                        </Button>
                                          )
                                          : ""
                                      }
                                    </Fragment>
                                  )}
                                </div>
                                </div>
                              </div>

                              <div className="invoice-steps-card__content">
                                <div className="invoice-create-info">
                                  <span className="py-text--strong">Amount due: <span className="py-text--normal">{invoiceData ? getAmountToDisplay(invoiceData.currency, invoiceData.dueAmount) : ''}</span></span>
                                  <span>
                                     <a href="javascript: void(0)" onClick={invoiceData.status === 'draft' || invoiceData.sentVia === "" ? console.log('') : () => this.onRecordClick(null, null, 2)} className="py-text--strong">Record a payment</a> manually
                                  </span>
                                </div>
                              </div>
                            </div>
                            :
                            <div className={invoiceData.sentVia === "" ? "py-box py-box--large disabled" : "py-box py-box--large"}>
                              <div className="invoice-steps-card__options">
                                <div className="invoice-step-card__header">
                                <div className="step-indicate">
                                  {invoiceData.status === "paid" ? (
                                    <div className="step-done-mark">
                                      {" "}
                                      <img src="/assets/check-mark-fill.svg" />
                                    </div>
                                  ) : (
                                      <div className="step-name">3</div>
                                    )}
                                </div>
                                <div className="py-heading--subtitle">Get Paid</div>
                                <div className="invoice-step-card__actions">
                                  {!invoiceData.status.includes("draft") && invoiceData.dueAmount > 0 && (
                                    <Fragment>
                                      {
                                        invoiceData.onlinePayments.systemEnabled ?
                                          (
                                            <Button
                                              onClick={() => this.onRecordClick(null, null, 1)}
                                              className="btn-primary"
                                              disabled={invoiceData.sentVia === ""}
                                            >
                                              Charge a credit card
                                          </Button>
                                          )
                                          : ""
                                      }
                                      <Button
                                        onClick={() => this.onRecordClick(null, null, 2)}
                                        className={invoiceData.currency.code === businessInfo.currency.code ? "btn btn-outline-primary" : "btn-primary"}
                                        disabled={invoiceData.sentVia === ""}
                                      >
                                        Record payment
                                      </Button>
                                    </Fragment>
                                  )}
                                  {/* <Button onClick={() => history.push('/app/sales/customer/add')} className="btn btn-rounded btn-gray">Skip Sending</Button> */}
                                </div>
                                </div>
                              </div>
                              <div className="invoice-steps-card__content">
                                <div className="invoice-create-info d-flex justify-content-between">
                                  <div style={{ fontSize: '19px' }}>
                                      <span className="py-text--strong"> Amount due:</span>
                                    <span style={{ fontSize: '19px' }}>
                                      {
                                        invoiceData ? getAmountToDisplay(invoiceData.currency, invoiceData.dueAmount) : ''
                                      }
                                    </span>
                                  </div>
                                  <span className="invoice-view-payment-section__content__info__status">
                                    <span className="py-text--strong">Status:</span>

                                  {invoiceData.status === 'paid'
                                      ? "Your invoice is paid in full"
                                      : invoiceData.status === 'partial' ? "Your invoice is partially paid" : "Your invoice is awaiting payment"}
                                  </span>
                                </div>
                              </div>

                              {invoiceData.status !== "paid" && !!invoiceData.sentVia ? (
                                <div className="if-scheduling">
                                  <div className="invoice-view-payment-section__content">
                                    <div className="invoice-payment-reminders">
                                      <div className="invoice-payment-reminders__description-header">
                                        <strong className="py-text--strong">
                                          Get paid on time by scheduling payment reminders for
                                          your customer:
                                    </strong>
                                      </div>
                                      {isSendMailToCust && (
                                        <Fragment>
                                          <br />
                                          <div className={`alert alert-warning`}>
                                            <i className="fas fa-exclamation-triangle" />
                                            &nbsp;&nbsp; To schedule payment reminders for
                                            your customer, you must first send the invoice or
                                            mark it as sent.
                                      </div>
                                        </Fragment>
                                      )}
                                      {!invoiceData.customer.email &&
                                        <Fragment>
                                          <br />
                                          <div className={`alert alert-warning`}>
                                            <i className="fas fa-exclamation-triangle" />
                                            &nbsp;&nbsp; Reminders are disabled, because
                                            your customer doesn't have an email address on file.
                                      </div>
                                        </Fragment>
                                      }
                                      <div
                                        className={`invoice-payment-reminders__reminders invoice-payment-reminders__reminders--disabled`}
                                      >
                                        <div className="invoice-payment-reminders__reminders__row invoice-payment-reminders__reminders__header">
                                          <div className="invoice-payment-reminders__reminders__row__item mrB0">
                                            <span className=" fs-med color-muted">
                                              Remind before due date
                                        </span>
                                          </div>
                                          <div className="invoice-payment-reminders__reminders__row__item mrB0">
                                            <span className=" fs-med color-muted">
                                              Remind on due date
                                        </span>
                                          </div>
                                          <div className="invoice-payment-reminders__reminders__row__item mrB0">
                                            <span className=" fs-med color-muted">
                                              Remind after due date
                                        </span>
                                          </div>
                                        </div>
                                        <div className="invoice-payment-reminders__reminders__row">
                                          <div className="invoice-payment-reminders__reminders__row__item mrT0">
                                            <div className="invoice-payment-reminders__reminders__row__item__reminder">
                                              <div
                                                className={isSendMailToCust || !(dateDiffrence >= 14) || invoiceData.dueAmount === 0 || !invoiceData.customer.email ? "checkbox disable" : "checkbox"}
                                                disabled={
                                                  isSendMailToCust ||
                                                  !(dateDiffrence >= 14) ||
                                                  invoiceData.dueAmount === 0 ||
                                                  !invoiceData.customer.email
                                                }
                                              >
                                                <label className="py-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    className="py-form__element"
                                                    name={"beforeFourteen"}
                                                    onChange={this.setReminder}
                                                    checked={
                                                      invoiceData.beforeFourteen &&
                                                      invoiceData.beforeFourteen.enable
                                                    }
                                                    disabled={
                                                      isSendMailToCust ||
                                                      !(dateDiffrence >= 14) ||
                                                      invoiceData.dueAmount === 0 ||
                                                      !invoiceData.customer.email
                                                    }
                                                  />
                                                  <span className="py-form__element__faux"></span>
                                                  <span className="py-form__element__label">14 days before</span>
                                            </label>
                                              </div>
                                            </div>
                                            <div className="invoice-payment-reminders__reminders__row__item__reminder">
                                              <div
                                                className={isSendMailToCust || !(dateDiffrence >= 7) || invoiceData.dueAmount === 0 || !invoiceData.customer.email ? "checkbox disable" : "checkbox"}
                                                disabled={
                                                  isSendMailToCust ||
                                                  !(dateDiffrence >= 7) ||
                                                  invoiceData.dueAmount === 0 ||
                                                  !invoiceData.customer.email
                                                }
                                              >
                                                <label className="py-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name={"beforeSeven"}
                                                    className="py-form__element"
                                                    onChange={this.setReminder}
                                                    checked={
                                                      invoiceData.beforeSeven &&
                                                      invoiceData.beforeSeven.enable
                                                    }
                                                    disabled={
                                                      isSendMailToCust ||
                                                      !(dateDiffrence >= 7) ||
                                                      invoiceData.dueAmount === 0 ||
                                                      !invoiceData.customer.email
                                                    }
                                                  />
                                                  <span className="py-form__element__faux"></span>
                                                  <span className="py-form__element__label">7 days before</span>
                                            </label>
                                              </div>
                                            </div>
                                            <div className="invoice-payment-reminders__reminders__row__item__reminder">
                                              <div
                                                className={isSendMailToCust || !(dateDiffrence >= 3) || invoiceData.dueAmount === 0 || !invoiceData.customer.email ? "checkbox disable" : "checkbox"}
                                                disabled={
                                                  isSendMailToCust ||
                                                  !(dateDiffrence >= 3) ||
                                                  invoiceData.dueAmount === 0 ||
                                                  !invoiceData.customer.email
                                                }
                                              >
                                                <label className="py-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name={"beforeThree"}
                                                    onChange={this.setReminder}
                                                    checked={
                                                      invoiceData.beforeThree &&
                                                      invoiceData.beforeThree.enable
                                                    }
                                                    disabled={
                                                      isSendMailToCust ||
                                                      !(dateDiffrence >= 3) ||
                                                      invoiceData.dueAmount === 0 ||
                                                      !invoiceData.customer.email
                                                    }
                                                  />
                                                  <span className="py-form__element__faux"></span>
                                                  <span className="py-form__element__label">3 days before</span>
                                            </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="invoice-payment-reminders__reminders__row__item mrT0">
                                            <div className="invoice-payment-reminders__reminders__row__item__reminder">
                                              <div
                                                className={isSendMailToCust || !(dateDiffrence > 0) || invoiceData.dueAmount === 0 || !invoiceData.customer.email ? "checkbox disable" : "checkbox"}
                                                disabled={
                                                  isSendMailToCust ||
                                                  !(dateDiffrence > 0) ||
                                                  invoiceData.dueAmount === 0 ||
                                                  !invoiceData.customer.email
                                                }
                                              >
                                                <label className="py-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name={"onDueDate"}
                                                    onChange={this.setReminder}
                                                    checked={
                                                      invoiceData.onDueDate &&
                                                      invoiceData.onDueDate.enable
                                                    }
                                                    disabled={
                                                      isSendMailToCust ||
                                                      !(dateDiffrence > 0) ||
                                                      invoiceData.dueAmount === 0 ||
                                                      !invoiceData.customer.email
                                                    }
                                                  />

                                                  <span className="py-form__element__faux"></span>
                                                  <span className="py-form__element__label"> On due date</span>

                                            </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="invoice-payment-reminders__reminders__row__item mrT0">
                                            <div className="invoice-payment-reminders__reminders__row__item__reminder">
                                              <div
                                                className={isSendMailToCust || !(dateDiffrence >= -2) || invoiceData.dueAmount === 0 || !invoiceData.customer.email ? "checkbox disable" : "checkbox"}
                                                disabled={
                                                  isSendMailToCust ||
                                                  !(dateDiffrence >= -2) ||
                                                  invoiceData.dueAmount === 0 ||
                                                  !invoiceData.customer.email
                                                }
                                              >
                                                <label className="py-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name={"afterThree"}
                                                    onChange={this.setReminder}
                                                    checked={
                                                      invoiceData.afterThree &&
                                                      invoiceData.afterThree.enable
                                                    }
                                                    disabled={
                                                      isSendMailToCust ||
                                                      !(dateDiffrence >= -2) ||
                                                      invoiceData.dueAmount === 0 ||
                                                      !invoiceData.customer.email
                                                    }
                                                  />

                                                  <span className="py-form__element__faux"></span>
                                                  <span className="py-form__element__label">3 days after</span>

                                            </label>
                                              </div>
                                            </div>
                                            <div className="invoice-payment-reminders__reminders__row__item__reminder">
                                              <div
                                                className={isSendMailToCust || !(dateDiffrence >= -2) || invoiceData.dueAmount === 0 || !invoiceData.customer.email ? "checkbox disable" : "checkbox"}
                                                disabled={
                                                  isSendMailToCust ||
                                                  !(dateDiffrence >= -2) ||
                                                  invoiceData.dueAmount === 0 ||
                                                  !invoiceData.customer.email
                                                }
                                              >
                                                <label className="py-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name={"afterSeven"}
                                                    onChange={this.setReminder}
                                                    checked={
                                                      invoiceData.afterSeven &&
                                                      invoiceData.afterSeven.enable
                                                    }
                                                    disabled={
                                                      isSendMailToCust ||
                                                      !(dateDiffrence >= -2) ||
                                                      invoiceData.dueAmount === 0 ||
                                                      !invoiceData.customer.email
                                                    }
                                                  />
                                                  <span className="py-form__element__faux"></span>
                                                  <span className="py-form__element__label">7 days after</span>

                                            </label>
                                              </div>
                                            </div>
                                            <div className="invoice-payment-reminders__reminders__row__item__reminder">
                                              <div
                                                className={isSendMailToCust || !(dateDiffrence >= -2) || invoiceData.dueAmount === 0 || !invoiceData.customer.email ? "checkbox disable" : "checkbox"}
                                                disabled={
                                                  isSendMailToCust ||
                                                  !(dateDiffrence >= -2) ||
                                                  invoiceData.dueAmount === 0 ||
                                                  !invoiceData.customer.email
                                                }
                                              >
                                                <label className="py-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name={"afterFourteen"}
                                                    onChange={this.setReminder}
                                                    checked={
                                                      invoiceData.afterFourteen &&
                                                      invoiceData.afterFourteen.enable
                                                    }
                                                    disabled={
                                                      isSendMailToCust ||
                                                      !(dateDiffrence >= -2) ||
                                                      invoiceData.dueAmount === 0 ||
                                                      !invoiceData.customer.email
                                                    }
                                                  />

                                                  <span className="py-form__element__faux"></span>
                                                  <span className="py-form__element__label">14 days after</span>

                                            </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              ) : ""}
                              <div className="if-paid">
                                <div className="invoice-view-payment-section__content">
                                  {invoiceData.dueAmount > 0 && (<Fragment>
                                    <span>
                                      <a
                                        className="py-text--link "
                                        onClick={() =>
                                          window.open(
                                            `${process.env.WEB_URL}/invoices-preview/${
                                            invoiceData._id
                                            }`
                                          )
                                        }
                                      >
                                        {"See a preview "}
                                      </a>
                                      of the reminder email
                                    {
                                        invoiceData.customer && typeof invoiceData.customer === 'object' && invoiceData.customer.customerEmail &&
                                        (
                                          <Fragment>
                                            ,or <a onClick={this.openCloseReminder} className="">
                                              {" "}
                                              send a reminder
                                          </a>
                                            &nbsp;now.
                                        </Fragment>
                                        )
                                      }
                                    </span>
                                    <br />
                                    {/* <span>
                                    3 reminders were sent for this invoice. The last
                                    reminder was sent yesterday.
                                  </span> */}
                                  </Fragment>)}
                                  {allPayments && allPayments.success && allPayments.data && allPayments.data.payments && allPayments.data.payments.length > 0 && (
                                    // invoiceData.payments.map((item, index) => {
                                    //   return (
                                    <div className="invoice-view-payment-section__content__payment-details">
                                      <div className="py-divider">
                                        {" "}
                                      </div>
                                      <div>
                                        <strong className="py-text--strong">
                                          Payments received:
                                          </strong>
                                      </div>
                                      {
                                        allPayments.data.payments.map((item, index) => {
                                          return (
                                            <div
                                              className="invoice-view-payment-section__content__payment-details__description"
                                              key={index}
                                            >
                                              <div
                                                dangerouslySetInnerHTML={{ __html: item.text }}
                                              />
                                              <div
                                                className="invoice-view-payment-section__content__payment-details__actions">
                                                <a
                                                  onClick={() => this.onOpenReceiptMail(item, index)}
                                                  className="py-text--link "
                                                >
                                                  Send a receipt
                                              </a>
                                                <span className="bullet-divider">·</span>
                                                <a
                                                  className="py-text--link "
                                                  onClick={() => this.onRecordClick(item, index, 2, item.method !== 'manual', true)}
                                                >
                                                  Edit payment
                                              </a>
                                                <span>
                                                  <span className="bullet-divider">·</span>
                                                  {
                                                    item.method === 'manual' ?
                                                      (<a onClick={() => this.onPaymentClick(item)}
                                                        className="py-text--link ">
                                                        Remove Payment
                                                    </a>)
                                                      : (<a
                                                        onClick={() => window.open(`${process.env.WEB_URL}/app/payments/${item.type === 'refund' ? 'view-refund' : 'view-payment'}/${item._id}`)}
                                                        className="py-text--link-external">
                                                        View Details
                                                    </a>)

                                                  }
                                                  {/* <Button onClick={() => this.onPaymentClick(item)} className="py-text--link">
                                                      Remove payment
                                                    </Button> */}
                                                </span>
                                              </div>
                                            </div>
                                          )
                                        })
                                      }
                                    </div>

                                  )}
                                </div>
                              </div>
                            </div>
                          }

                          {this.openPopup()}
                          <PDFExport
                            fileName="_____.pdf"
                            title=""
                            subject=""
                            keywords=""
                            ref={r => (this.resume = r)}
                          >
                            <div
                              id="printInvoice"
                              style={{
                                height: `${onPrint ? "100%" : "100%"}`,
                                width: `${onPrint ? "90%" : "100%"}`,
                                padding: "none",
                                backgroundColor: "white",
                                margin: "auto",
                                /*  overflowX: "hidden",
                                overflowY: "hidden", */
                                // width: '210mm',
                                // minHeight: '297mm',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                              }}
                              ref={el => (this.componentRef = el)}
                            >
                              {this.renderInvoiceReceipt(invoiceData, paymentsInvoice)}

                            </div>
                          </PDFExport>
                        </div>
                      <Popover
                        placement="bottom"
                        isOpen={this.state.popoverOpen}
                        target="Popover1"
                        toggle={this.toggle}
                      >
                        <PopoverBody className="popover__panel">
                          <i className="fa fa-close pull-right" onClick={this.toggle} />
                          <strong> {customer.customerName} </strong>
                          <div className="address-box">
                            {customer.firstName && (
                              <span> {`${customer.firstName} ${customer.lastName}`} </span>
                            )}
                            {customer.email && <span>{customer.email}</span>}
                            <span>&nbsp;</span>
                            {customer.communication && customer.communication.phone && (
                              <span> {`Tel: ${customer.communication.phone}`}</span>
                            )}
                            {customer.communication && customer.communication.mobile && (
                              <span> {`Mobile: ${customer.communication.mobile}`}</span>
                            )}
                            {customer.communication && customer.communication.website && (
                              <span>{`Website: ${customer.communication.website}`}</span>
                            )}
                            {/* <span>Notes: Create first user</span> */}
                          </div>
                          <div className="invoice-view-summary__customer__edit">
                            <a className="py-text--link" href="#" onClick={this._handleEditCustomer.bind(this)}>Edit customer information</a>
                          </div>
                        </PopoverBody>
                      </Popover>
                    </div>
                  <Popup
                    type={type}
                    openPopup={openPopup}
                    onClosePopup={this.onPopupClose.bind(this)}
                    setData={this.setData.bind(this)}
                    isEditMode={this.state.editCustomer}
                    customer={customer}
                  />

                </Fragment>
              )
          }
        </div>
      </Fragment>
    );
  }
}

const mapPropsToState = ({ snackbar, settings, businessReducer, getAllInvoicePayments }) => ({
  updateData: snackbar.updateData,
  isPayment: settings.isPayment,
  isMailBox: settings.isMailBox,
  businessInfo: businessReducer.selectedBusiness,
  allPayments: getAllInvoicePayments
});

const mapDispatchToProps = dispatch => {
  return {
    refreshData: () => {
      dispatch(updateData());
    },
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error));
    },
    closePayment: () => {
      dispatch(closePayment());
    },
    closeMailBox: () => {
      dispatch(closeMailBox());
    },
    getInvoicePayments: (id) => {
      dispatch(getInvoicePayments(id))
    }
  };
};

export default withRouter(
  connect(
    mapPropsToState,
    mapDispatchToProps
  )(ViewInvoice)
);
