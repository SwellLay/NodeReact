import { PDFExport } from "@progress/kendo-react-pdf";
import history from "customHistory";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { cloneDeep, groupBy } from "lodash";
import moment from "moment";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Popover, PopoverBody,Spinner } from "reactstrap";
import { changePriceFormat } from "utils/GlobalFunctions";
import { DeleteModal } from "utils/PopupModal/DeleteModal";
import { closeMailBox, closePayment } from "../../../../actions";
import { openGlobalSnackbar, updateData } from "../../../../actions/snackBarAction";
import { cloneRecurringInvoice, deleteInvoice, getRecurringInvoice, removePayment, sendInvoice, updateRecurringInvoice } from "../../../../api/RecurringService";
import AlertBox from "../../../../global/AlertBox";
import { convertDateToYMD, getCommonFormatedDate, toDisplayDate } from "../../../../utils/common";
import GetAShareLink from "../invoice/components/InvoiceForm/GetAShareLink";
import MailInvoice from "../invoice/components/InvoiceForm/MailInvoice";
import SendAReminder from "../invoice/components/InvoiceForm/SendAReminder";
import InvoicePayment, { PAYMENT_METHOD } from "../invoice/components/InvoicePayment";
import InvoicePreview from "../invoice/components/InvoicePreview";
import InvoicePreviewClassic from "../invoice/components/InvoicePreviewClassic";
import InvoicePreviewModern from "../invoice/components/InvoicePreviewModern";
import SendReceipt from "../invoice/components/SendReceipt";
import { invoiceInput, setStartDate } from "./helpers";
import RecurringStep2 from "./helpers/RecurringStep2";
import RecurrintStep3 from "./helpers/RecurringStep3";
import RecurringStep4 from "./helpers/RecurringStep4";
import RecurringStep5 from "./helpers/RecurringStep5";
import { fetchSalesSetting } from "../../../../api/SettingService";
import { invoiceSettingPayload } from "../setting/components/supportFunctionality/helper";
import { toMoney, _documentTitle } from "../../../../utils/GlobalFunctions";
import CenterSpinner from "../../../../global/CenterSpinner";

class RecurringInvoiceView extends Component {
  state = {
    dropdownOpen: false,
    openReminder: false,
    popoverOpen: false,
    openModal: false,
    stepTwoEdit: false,
    stepThreeEdit: false,
    stepFourEdit: false,
    dropdownOpenMore: false,
    onRecordModal: false,
    modal: false,
    invoiceModal: false,
    selectedCustomer: null,
    invoiceData: invoiceInput(null, this.props.businessInfo),
    onPrint: false,
    openMail: false,
    openAlert: false,
    openReceiptMail: false,
    isDelete: false,
    paymentMethods: PAYMENT_METHOD,
    userSettings: invoiceSettingPayload(),
    loading: false,
    isDuplicate: false,
  };

  componentDidMount = () => {
    const { businessInfo } = this.props;
    _documentTitle(businessInfo, "")
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

  fetchInvoiceData = async id => {
    try {
       this.setState({ loading: true })
      const {
        closePayment,
        closeMailBox,
        isPayment,
        isMailBox,
      } = this.props;
      let response = await getRecurringInvoice(id);
      console.log("response", response)
      const settingRequest = await fetchSalesSetting()
      const invoiceData = response.data.invoice;
      const userSettings = settingRequest.data.salesSetting
      this.setState({
        invoiceData,
        userSettings,
        loading:false
      }, () => {
        if (isMailBox) {
          this.openMailBox();
          closeMailBox();
        } else if (isPayment) {
          this.onRecordClick();
          closePayment();
        }
      });
    } catch (error) {
      console.log("error", error);
      if (error.data) {
        this.props.showSnackbar(error.message, true);
        history.push("/app/recurring");
      }
    }
  };

  handleEditMode = (type) => {
    let {
      stepTwoEdit,
      stepThreeEdit,
      stepFourEdit
    } = this.state
    switch (type) {
      case 'step2': stepTwoEdit = !stepTwoEdit
        break;
      case 'step3': stepThreeEdit = !stepThreeEdit
        break;
      case 'step4': stepFourEdit = !stepFourEdit
        break;
    }
    this.setState({
      stepTwoEdit,
      stepThreeEdit,
      stepFourEdit
    })
  }

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

  onCloseMail = () => {
    this.setState({
      openMail: false
    });
  };

  openMailBox = () => {
    this.setState({
      openMail: true
    });
  };

  scheduleRecurringInvoice = async (step, mode) => {
    const invoiceData = cloneDeep(this.state.invoiceData)
    let {
      stepTwoEdit,
      stepThreeEdit,
      stepFourEdit
    } = this.state
    const id = invoiceData._id
    if (step === "step2") {
      stepTwoEdit = false
      invoiceData.recurrence.isSchedule = true
    } else if (step === 'step3') {
      stepThreeEdit = false
      invoiceData.paid.isPaid = true
      invoiceData.paid.manualPayment = true
    } else if (step === 'step4') {
      stepFourEdit = false
      invoiceData.sendMail.isSent = true
    }
    else if (step === 'approve') {
      invoiceData.status = 'active'
    }
    invoiceData.businessId = typeof (invoiceData.businessId) === 'object' ? invoiceData.businessId._id : invoiceData.businessId
    invoiceData.customer = invoiceData.customer._id
    invoiceData.userId = typeof (invoiceData.userId) === 'object' ? invoiceData.userId._id : invoiceData.userId
    delete invoiceData._id
    delete invoiceData.createdAt
    delete invoiceData.updatedAt
    delete invoiceData.__v
    await updateRecurringInvoice(id, { invoiceInput: invoiceData })
    this.setState({
      stepTwoEdit,
      stepThreeEdit,
      stepFourEdit
    })
    this.props.refreshData()
  }

  addRecipientAddress = () => {
    const invoiceData = cloneDeep(this.state.invoiceData)
    invoiceData.sendMail.to.push("")
    this.setState({ invoiceData })
  }

  removeRecipientAddress = idx => {
    let invoiceData = cloneDeep(this.state.invoiceData);
    invoiceData.sendMail.to = invoiceData.sendMail.to.filter((item, index) => {
      return index !== idx;
    });
    if (invoiceData.sendMail.to.length <= 0) {
      invoiceData.sendMail.to.push("");
    }
    this.setState({ invoiceData });
  };

  onOpenReceiptMail = (item, index) => {
    this.setState({
      openReceiptMail: true,
      receiptItem: item,
      receiptIndex: index,
      openAlert: false
    })
  }

  onCloseReceiptMail = () => {
    this.setState({
      openReceiptMail: false
    })
  }

  onRecordClick = (item, index) => {
    if (index !== null) {
      this.setState({
        onRecordModal: true,
        receiptItem: item,
        receiptIndex: index
      })
    } else {
      this.setState({
        onRecordModal: true
      });
    }
  };

  onRecordClose = () => {
    this.setState({
      onRecordModal: false,
    });
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
      refreshData();
      this.onCloseModal();
      history.push("/app/recurring");
    } catch (error) {
      showSnackbar(error.message, true)
    }
  };

  onOpenAlert = (item) => {
    this.setState({
      openAlert: true,
      receiptItem: item
    })
    this.onRecordClose()
  }

  onCloseAlert = () => {
    this.setState({
      openAlert: false
    })
  }


  onShareLink = () => {
    this.setState({
      openShareLink: !this.state.openShareLink
    })
  }

  openPopup = () => {
    const { openMail, openShareLink, openAlert, invoiceData, receiptItem, receiptIndex, onRecordModal, openReminder, openReceiptMail, isDelete } = this.state;
    return (
      <Fragment>
        <MailInvoice
          openMail={openMail}
          invoiceData={invoiceData}
          onClose={this.onCloseMail}
        />
        <GetAShareLink
          openShareLink={openShareLink}
          onClose={this.onShareLink}
          invoiceData={invoiceData}
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
        />
        <DeleteModal
          message={"Are you sure you want to delete this invoice?"}
          openModal={isDelete}
          onDelete={this.onDeleteClick}
          onClose={this.onCloseModal}
          refreshData={this.props.refreshData}
        />
        <AlertBox
          showAlert={openAlert}
          receipt={receiptItem}
          receiptIndex={receiptIndex}
          onConfirm={this.onOpenReceiptMail}
          onCancel={this.onCloseAlert}
        />
      </Fragment>
    );
  };

  onUpdateStatusCall = async status => {
    const invoiceData = this.state.invoiceData;
    if (invoiceData.items.length > 0) {
      try {
        let payload = {};
        if (status === "approve") {
          payload.invoiceInput = { status: "saved" }
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
        this.setState({ invoiceData: response.data.invoice });
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
      return "badge badge-primary";
    } else if (invoiceData.status === "draft") {
      return "badge badge-secondary";
    } else if (invoiceData.status === "paid") {
      return "badge badge-success";
    } else if (invoiceData.status === "partial") {
      return "badge badge-primary";
    } else if (invoiceData.status === "active") {
      return "badge badge-info";
    } else {
      return "";
    }
  };

  exportPDF = async () => {
    this.setState({ onPrint: true });
    let date = moment().format("YYYY-MM-DD");
    const input = document.getElementById("printInvoice");
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 325);
      pdf.save(`Invoice_${invoiceData.estimateNumber}_${date}.pdf`);
    });
    setTimeout(() => {
      this.setState({ onPrint: false });
    }, 100);
  };

  onDuplicate = async () => {
    const id = this.state.invoiceData._id;
    const response = await cloneRecurringInvoice(id);
    // console.log("response", response)
    // this.setState({isDuplicate: true, invoiceData: response.data.invoice})
    const invoiceId = response.data.invoice._id;
    this.fetchInvoiceData(invoiceId)
    history.push(`/app/recurring/view/${invoiceId}?duplicate=true`);
  };

  onCustomerViewClick = () => {
    window.open(`${process.env.WEB_URL}/invoices/readonly/${this.state.invoiceData._id}`)
  }

  onRemovePayment = async (item) => {
    const id = this.state.invoiceData._id;
    await removePayment(id, item._id)
    this.props.refreshData()
  }

  handleScheduler = (event, name, index) => {
    let updateInvoice = cloneDeep(this.state.invoiceData)
    if (name === 'unit') {
      updateInvoice.recurrence = this.setSchedulePaylaod(event.target.value, updateInvoice.recurrence)
    } else if (name === 'subUnit') {
      updateInvoice.recurrence = this.setSubUnitInPayload(event.target.value, updateInvoice.recurrence)

    } else if (name === 'type') {
      updateInvoice.recurrence = this.setEndDate(updateInvoice.recurrence, event.target.value)
    } else if (name === 'isSchedule') {
      updateInvoice.recurrence[name] = false
    }
    else if (name.includes('Date')) {
      updateInvoice.recurrence[name] = moment(event).format('YYYY-MM-DD')
    } else if (name === 'dayofMonth') {
      updateInvoice.recurrence['startDate'] = setStartDate(event.target.value, 'monthly')
      updateInvoice.recurrence[name] = event.target.value
    } else if (name === 'dayOfWeek') {
      updateInvoice.recurrence['startDate'] = setStartDate(event.target.value, 'weekly')
      updateInvoice.recurrence[name] = event.target.value
    }
    else if (name === 'timezone') {
      updateInvoice.recurrence[name] = {
        name: event.value,
        offSet: parseInt(moment.tz(new Date, event.value).format('Z')),
        zoneAbbr: moment.tz(new Date, event.value).format('z')
      }
    } else if (name === 'autoSendEnabled') {
      updateInvoice.sendMail[name] = event
      // updateInvoice.sendMail["to"] = [""]
    } else if (name === 'sendMail') {
      if (['copyMyself', 'attachPdf'].includes(event.target.name)) {
        updateInvoice.sendMail[event.target.name] = !updateInvoice.sendMail[event.target.name]
      } else if (event.target.name === 'to') {
        updateInvoice.sendMail[event.target.name][index] = event.target.value
      }

      else {
        updateInvoice.sendMail[event.target.name] = event.target.value
      }
    }
    else {
      updateInvoice.recurrence[name] = event.target ? event.target.value : event.value
    }
    this.setState({ invoiceData: updateInvoice })
  }

  setSubUnitInPayload = (value, recurrence) => {
    switch (value) {
      case 'Day(s)': return {
        isSchedule: recurrence.isSchedule,
        type: recurrence.type,
        interval: recurrence.inter,
        unit: recurrence.unit,
        subUnit: value,
        startDate: recurrence.startDate,
        timezone: recurrence.timezone
      }
      case 'Year(s)': return {
        isSchedule: recurrence.isSchedule,
        subUnit: value,
        type: recurrence.type,
        interval: recurrence.interval,
        unit: recurrence.unit,
        startDate: recurrence.startDate,
        dayofMonth: recurrence.dayofMonth,
        monthOfYear: recurrence.monthOfYear,
        timezone: recurrence.timezone
      }
      case 'Month(s)': return {
        isSchedule: recurrence.isSchedule,
        subUnit: value,
        type: recurrence.type,
        interval: recurrence.interval,
        unit: recurrence.unit,
        startDate: recurrence.startDate,
        timezone: recurrence.timezone,
        dayofMonth: recurrence.dayofMonth,
      }
      case 'Week(s)': return {
        isSchedule: recurrence.isSchedule,
        type: recurrence.type,
        subUnit: value,
        interval: recurrence.interval,
        unit: recurrence.unit,
        dayOfWeek: recurrence.dayOfWeek,
        startDate: recurrence.startDate,
        timezone: recurrence.timezone
      }
    }
  }

  setSchedulePaylaod = (value, recurrence) => {
    switch (value) {
      case 'daily': return {
        isSchedule: recurrence.isSchedule,
        type: recurrence.type,
        interval: recurrence.interval,
        unit: value,
        subUnit: recurrence.subUnit,
        startDate: recurrence.startDate,
        timezone: recurrence.timezone
      }
      case 'weekly': return {
        isSchedule: recurrence.isSchedule,
        type: recurrence.type,
        subUnit: undefined,
        interval: recurrence.interval,
        unit: value,
        dayOfWeek: moment().format('dddd'),
        startDate: recurrence.startDate,
        timezone: recurrence.timezone
      }
      case 'monthly': return {
        isSchedule: recurrence.isSchedule,
        subUnit: undefined,
        type: recurrence.type,
        interval: recurrence.interval,
        unit: value,
        startDate: recurrence.startDate,
        timezone: recurrence.timezone,
        dayofMonth: recurrence.dayofMonth
      }
      case 'yearly': return {
        isSchedule: recurrence.isSchedule,
        subUnit: undefined,
        type: recurrence.type,
        interval: recurrence.interval,
        unit: value,
        startDate: recurrence.startDate,
        dayofMonth: parseInt(moment().format('DD')),
        monthOfYear: moment().format('MMMM'),
        timezone: recurrence.timezone
      }
      case 'custom': return {
        isSchedule: recurrence.isSchedule,
        type: recurrence.type,
        interval: recurrence.interval,
        unit: value,
        subUnit: 'Year(s)',
        dayofMonth: recurrence.dayofMonth,
        monthOfYear: recurrence.monthOfYear,
        startDate: recurrence.startDate,
        timezone: recurrence.timezone
      }
    }
  }

  setEndDate = (recurrence, type) => {
    let updateData = cloneDeep(recurrence)
    updateData.type = type
    switch (type) {
      case 'after':
        delete updateData.endDate
        updateData["maxInvoices"] = 0
        return updateData
      case 'on':
        delete updateData.maxInvoices
        updateData["endDate"] = moment().format('YYYY-MM-DD')
        return updateData
      default:
        delete updateData.endDate
        delete updateData.maxInvoices
        return updateData
    }
  }

  renderInvoicePreview = (invoiceData) => {
    const { userSettings } = this.state
    if (userSettings.template === "classic") {
      return (<InvoicePreviewClassic
        ref={el => (this.componentRef = el)}
        invoiceData={invoiceData}
        userSettings={userSettings}
      />)
    } else if (userSettings.template === "modern") {
      return (<InvoicePreviewModern
        ref={el => (this.componentRef = el)}
        invoiceData={invoiceData}
        userSettings={userSettings}
      />)
    } else {
      return (<InvoicePreview
        ref={el => (this.componentRef = el)}
        invoiceData={invoiceData}
        userSettings={userSettings}
      />)
    }
  }

  render() {
    const { businessInfo } = this.props
    const { invoiceData, onPrint, paymentMethods, stepTwoEdit, stepThreeEdit, stepFourEdit , loading } = this.state;
    let pMethods = groupBy(paymentMethods, "value");
    const isSendMailToCust =
      invoiceData.status !== "draft" && invoiceData.skipped;
    const todayDate = moment();
    const dueDate = moment(invoiceData.dueDate);
    const dateDiffrence = dueDate.diff(todayDate, "days");
    const { customer, payments } = invoiceData;
    return (
      <Fragment>
        <div>
          <div className="content-wrapper__main__fixed">
            <div className="invoice-view-header">
            <header className="py-header--page">
              <div className="py-header--title">
                <h2 className="py-heading--title">Recurring invoice</h2>
              </div>

              <div className="py-header--content ml-auto">
                  <Dropdown
                    className="d-inline-block mrR10"
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggleDropdown}
                    >
                    <DropdownToggle className="btn btn-outline-primary btn-rounded" caret>
                      {" "}
                      More actions{" "}
                    </DropdownToggle>
                    <DropdownMenu>
                      <div className="dropdown-menu--body">
                        <DropdownItem key={2} onClick={""}>
                          View created invoice
                        </DropdownItem>
                        <DropdownItem key={1} onClick={this.onDuplicate}>
                          Duplicate
                        </DropdownItem>
                        <DropdownItem key={3} onClick={this.exportPDF}>
                          End
                        </DropdownItem>
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                  <Button
                    onClick={() => history.push("/app/recurring/add")}
                  className="btn btn-outline-primary"
                  >
                  Create another recurring invoice
                  </Button>
                </div>
            </header>
            </div>
            <div>
              {
              loading ?
              <CenterSpinner />
              :
              <div>
                <div className="shadow-box border-0 card-wizard card">
                  <div className="invoice-view__body">
                    <div className="invoice-view-summary">
                      <div className="invoice-view-summary__status">
                        <div className="block-label"> Status</div>
                        <div className={this.setCSSClass()}>
                          {" "}
                          {invoiceData.status === "saved"
                          ? "Unsent"
                          : invoiceData.status}{" "}
                        </div>
                      </div>
                      <div className="invoice-view-summary__customer">
                        <div className="block-label"> Customer</div>
                        <div className="summary__customer__name">
                          <Button id="Popover1" type="button" onClick={this.toggle}>
                          {" "}
                          {customer && customer.customerName}{" "}
                          <i className="fa fa-info-circle"/>
                          </Button>
                        </div>
                      </div>
                      <div className="invoice-view-summary__amount">
                        <div className="block-label"> Invoice amount</div>
                        <div className="summary__Amount__value">
                          {" "}
                          {`${(invoiceData.currency && invoiceData.currency.symbol) ||
                          ""}${toMoney(invoiceData.totalAmount)}`}
                        </div>
                      </div>
                      <div className="invoice-view-summary__due-date">
                        <div className="block-label">Created to date</div>
                        <div className="summary__amount__datevalue ">
                          {" "}
                          {invoiceData.invoiceCount > 0
                          ? `${invoiceData.invoiceCount} invoices `
                          : "0 invoices"}{" "}
                        </div>
                      </div>
                    </div>

                    <div className="recurring-invoice-view__body">
                    <div className="py-box py-box--large">
                      <div className="invoice-steps-card__options">
                        <div className="invoice-step-card__header recurring-invoice-card__header">

                          <div className={`step-indicate`}>
                            <div className="step-done-mark">
                              {" "}
                              <img src="/assets/check-mark-fill.svg" />
                            </div>
                          </div>
                          <div className="py-heading--subtitle">Create invoice</div>
                          <div className="step-btn-box">
                            <Button
                              onClick={() =>
                            history.push(`/app/recurring/edit/${invoiceData._id}`)
                            }
                            className="btn-outline-primary"
                            >
                            Edit
                            </Button>
                          </div>
                          </div>
                      </div>

                      <div className="invoice-steps-card__content">
                        <div className="invoice-create-info">
                          <strong> Created On:</strong>
                          <span>{toDisplayDate(invoiceData.createdAt, false, 'MMMM Do YYYY')}</span>
                        </div>
                        <div className="invoice-create-info">
                          <strong>Payment terms:</strong>
                          <span> {invoiceData.notifyStatus && invoiceData.notifyStatus.value && invoiceData.notifyStatus.value}</span>
                        </div>
                      </div>
                    </div>

                    <div className="invoice-view__body__vertical-line"></div>

                    <RecurringStep2
                      editMode={stepTwoEdit}
                      handleEditMode={this.handleEditMode}
                      invoiceData={invoiceData}
                      handleScheduler={this.handleScheduler}
                      scheduleRecurringInvoice={this.scheduleRecurringInvoice}
                      />
                      <div className="invoice-view__body__vertical-line"></div>
                    <RecurrintStep3
                      editMode={stepThreeEdit}
                      handleEditMode={this.handleEditMode}
                      invoiceData={invoiceData}
                      handleGetPaid={this.scheduleRecurringInvoice}
                      />
                      <div className="invoice-view__body__vertical-line"></div>
                    <RecurringStep4
                      editMode={stepFourEdit}
                      handleEditMode={this.handleEditMode}
                      invoiceData={invoiceData}
                      handleSendMail={this.scheduleRecurringInvoice}
                      addRecipientAddress={this.addRecipientAddress}
                      removeRecipientAddress={this.removeRecipientAddress}
                      handleScheduler={this.handleScheduler}
                      />
                    {invoiceData.recurrence.isSchedule &&
                    invoiceData.paid.isPaid &&
                    invoiceData.sendMail.isSent &&
                    invoiceData.status !== 'active' &&
                    <RecurringStep5
                      invoiceData={invoiceData}
                      approveRecurringInvoice={this.scheduleRecurringInvoice}
                      />
                    }
                  </div>
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
                    className="recurring-invoice__preview"
                    style={{
                    height: `${onPrint ? "100%" : "100%"}`,
                    width: `${onPrint ? "95%" : "100%"}`,
                    padding: "none",
                    backgroundColor: "white",
                    margin: "auto",
                    overflowX: "hidden",
                    overflowY: "hidden",
                    // width: '210mm',
                    minHeight: '297mm',
                    marginLeft: 'auto',
                    padding: '.2rem',
                    marginRight: 'auto'
                    }}
                    >
                    {this.renderInvoicePreview(invoiceData)}
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
                    <strong> {customer && customer.customerName} </strong>
                    <div className="address-box">
                      {customer && customer.firstName && (
                      <span> {`${customer.firstName} ${customer.lastName}`} </span>
                      )}
                      {customer && customer.email && <span>{customer.email}</span>}
                      <span>&nbsp;</span>
                      {customer && customer.communication && customer.communication.phone && (
                      <span> {`Tel: ${customer.communication.phone}`}</span>
                      )}
                      {customer && customer.communication && customer.communication.mobile && (
                      <span> {`Mobile: ${customer.communication.mobile}`}</span>
                      )}
                      {customer && customer.communication && customer.communication.website && (
                      <span>{`Website: ${customer.communication.website}`}</span>
                      )}
                      {/* <span>Notes: Create first user</span> */}
                    </div>
                    <div className="invoice-view-summary__customer__edit">
                      <a href="#">Edit customer information</a>
                    </div>
                  </PopoverBody>
                </Popover>
                </div>
              </div>
              }
          </div>
          
        </div>
        </div> 
      </Fragment>
    );
  }
}

const mapPropsToState = ({ snackbar, settings, businessReducer }) => ({
  updateData: snackbar.updateData,
  isPayment: settings.isPayment,
  isMailBox: settings.isMailBox,
  businessInfo: businessReducer.selectedBusiness,
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
    }
  };
};

export default withRouter(
  connect(
    mapPropsToState,
    mapDispatchToProps
  )(RecurringInvoiceView)
);