import { PDFExport } from "@progress/kendo-react-pdf";
import { openGlobalSnackbar } from 'actions/snackBarAction';
import history from 'customHistory';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment-timezone";
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import ReactToPrint from "react-to-print";
import { Button, ButtonDropdown, Container, DropdownItem, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import { getInvoicePayments } from "../../../../../actions/invoiceActions";
import { getInvoiceByUUID, downloadPdf } from "../../../../../api/InvoiceService";
import SnakeBar from "../../../../../global/SnakeBar";
import SweetAlertSuccess from "../../../../../global/SweetAlertSuccess";
import { convertDateToYMD } from "../../../../../utils/common";
import { toMoney, getAmountToDisplay, _downloadPDF } from "../../../../../utils/GlobalFunctions";
import { PoweredBy } from "../../../../common/PoweredBy";
import { invoiceSettingPayload } from "../../setting/components/supportFunctionality/helper";
import { invoiceInput } from "../helpers";
import InvoicePreview from "./InvoicePreview";
import InvoicePreviewClassic from "./InvoicePreviewClassic";
import InvoicePreviewModern from "./InvoicePreviewModern";
import Payout from "./Payout";
import SendReceipt from "./SendReceipt";
import ExportPdfModal from "../../../../../utils/PopupModal/ExportPdfModal";

let link;
class InvoiceViewBrowser extends Component {
  state = {
    openModal: false,
    dropdownOpen: false,
    dropdownOpenMore: false,
    modal: false,
    invoiceModal: false,
    selectedCustomer: null,
    invoiceData: invoiceInput(),
    userSettings: invoiceSettingPayload(),
    loading: false,
    openAlert: false,
    openReceiptMail: false,
    openExportModal: false,
    downloadLoading: false,
    btnLoading: false
  };

  componentDidMount() {
    const { businessInfo } = this.props;
    const { invoiceData } = this.state;
    this.fetchInvoiceData();
    document.title = `Peymynt - ${businessInfo && !!businessInfo.organizationName ? `${businessInfo.organizationName} - ` : ""}Invoice`
  }

  fetchInvoiceData = async () => {
    const id = this.props.match.params.id;
    const { businessInfo } = this.props;
    try {
      this.setState({ loading: true });
      let response = await getInvoiceByUUID(id);
      const invoiceData = response.data.invoice;
      const userSettings = response.data.invoice.businessId;
      const salesSetting = response.data.salesSetting;
      const payments = response.data.payments
      document.title = `Peymynt - ${userSettings && !!userSettings.organizationName ? `${userSettings.organizationName} - ` : ""}Invoice ${invoiceData && invoiceData.invoiceNumber}`;
      if (response.statusCode === 200) {
        this.setState({ invoiceData, userSettings: salesSetting, payments, loading: false });
      } else {
        history.push("/app/404");

      }
      let elem = document.getElementById('divIdToPrint');
      // if (this.props.location.search.includes('download=true')) {
      //   if (!!elem) {
      //     this.exportPDF()
      //     // window.close()
      //   }
      // }
    } catch (error) {
      console.error("error", error);
      if (error.data) {
        this.props.openGlobalSnackbar(error.message, true);
        history.push("/app/404");
      }
    }
  };

  // Add this method to the React
  exportPDF = async (download) => {
    const date = moment().format("YYYY-MM-DD");
    const { invoiceData } = this.state;
    console.log("invoiceData", download)
    this.setState({
      btnLoading: true
    })
    if(!download){
      this.setState({openExportModal: true, downloadLoading: true})
      try{
        link = await _downloadPDF(invoiceData, 'invoices');
      }catch(err){
        console.error("Export Error in invoice Dropdown =>", err)
        this.props.openGlobalSnackbar("Something went wrong, please try again later.", true)
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

  printPDF = () => {
    window.print();
  };

  renderTemplate = () => {
    const { invoiceData, userSettings, payments } = this.state;
    const { allPayments } = this.props;
    const businessInfo = invoiceData ? invoiceData.businessId : {};

    if (userSettings.template === "classic") {
      return (<InvoicePreviewClassic
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        payments={payments}
        showPayment={true}
      />)
    } else if (userSettings.template === "modern") {
      return (<InvoicePreviewModern
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        payments={payments}
        showPayment={true}
      />)
    } else {
      return (<InvoicePreview
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        payments={payments}
        showPayment={true}
      />)
    }
  };

  toggleDropdown = (event) => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });

    if (event && event.target && event.target.innerText != 'Toggle Dropdown') {
      this.saveCheckoutSubMenuAction();
    }
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

  onOpenAlert = (item) => {
    this.setState({
      openAlert: true,
      receiptItem: item
    })
  };

  onCloseAlert = () => {
    this.setState({
      openAlert: false
    })
  };

  render() {
    const { invoiceData, loading, openAlert, receiptIndex, receiptItem, openReceiptMail, payments, openExportModal, downloadLoading, btnLoading } = this.state;
    const businessInfo = invoiceData ? invoiceData.businessId : {};
    return (
      // Add this to the render method
      // Add this to the render method
      <div>
        <SnakeBar />
        {loading ?
          <Container className="text-center" style={{ height: '100vh', width: '100%' }}>
            <Spinner color="primary" size="md" className="loade mrT50" />
          </Container> :
          <Fragment>

              <div className="readonly-payment-information">
                <div className="py-heading--title readonly-payment-information__title">{invoiceData && invoiceData.onlinePayments && invoiceData.onlinePayments.systemEnabled && invoiceData.dueAmount > 0 ? `Request for Payment from ${businessInfo && businessInfo.organizationName}` : `${invoiceData && invoiceData.title} ${invoiceData && invoiceData.invoiceNumber} from ${businessInfo && businessInfo.organizationName}`}</div>
                <div className="invoice-payment-details text-center">
                  <div className="invoice-payment-details__item">
                    {invoiceData && invoiceData.title} {invoiceData && invoiceData.invoiceNumber}
                  </div>
                  <div className="invoice-payment-details__item__seperator"></div>
                  <div className="invoice-payment-details__item">
                    Amount due: {
                      invoiceData ? getAmountToDisplay(invoiceData.currency, invoiceData.dueAmount) : ''
                    }
                  </div>
                  <div className="invoice-payment-details__item__seperator"></div>
                  <div className="invoice-payment-details__item">
                    Due on: {invoiceData && moment(invoiceData.dueDate).format('MMMM Do YYYY')}
                  </div>
                </div>
              </div>

              {
                invoiceData.status !== 'draft' && invoiceData.status !== 'paid' && (invoiceData.onlinePayments && invoiceData.onlinePayments.systemEnabled || invoiceData.onlinePayments && invoiceData.onlinePayments.businessEnabled) ?
                  <Payout onlinePayments={invoiceData && invoiceData.onlinePayments} {...this.props}
                    showSnackbar={(message, err) => this.props.openGlobalSnackbar(message, err)}
                    refreshData={this.fetchInvoiceData}
                    openAlert={this.onOpenAlert}
                  />
                  : ""
              }
              

            <PDFExport
              fileName="Estimate_Report.pdf"
              title=""
              subject=""
              keywords=""
              ref={r => (this.resume = r)}
            >
              <div
                id="divIdToPrint"
                style={{
                  // height: "100%",
                  // width: "60%",
                  padding: "none",
                  margin: "auto",
                  overflowX: "hidden",
                  overflowY: "hidden",
                  width: '820px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
                className="my-3"
              >

              <div className="my-2 d-flex justify-content-between align-items-center">
                <div className="">
                <ReactToPrint
                  trigger={() => <Button className="btn-outline-primary mr-2"> Print </Button>}
                  content={() => this.componentRef}
                />
              <Button className="btn-outline-primary mr-2" onClick={this.exportPDF.bind(this, false)}>
                Download PDF
              </Button>

              {
                payments && payments.length > 0 &&
                (
                  <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                    {/* <Dropdown className="d-inline-block mrR10" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}> */}
                    <DropdownToggle className="btn btn-outline-primary" caret >
                      Reciepts
                    </DropdownToggle>
                    <DropdownMenu>
                      <div className="dropdown-menu--body">
                      {
                        payments.map((item, i) => {
                          return (
                            <DropdownItem key={i} onClick={() => window.open(`${process.env.WEB_URL}/invoice/${invoiceData.uuid}/public/reciept-view/readonly/${item._id}`)}>
                              {convertDateToYMD(item.paymentDate)}
                            </DropdownItem>
                          )
                        })
                      }
                      </div>
                    </DropdownMenu>
                    {/* </Dropdown> */}
                  </ButtonDropdown>
                )
              }
              </div>
              {invoiceData && invoiceData.status === 'paid' &&
                <span className="badge badge-lg badge-success">{'paid'}</span>
              }

              </div>

                <div ref={el => (this.componentRef = el)}>
                  {this.renderTemplate(invoiceData)}
                </div>
              </div>
            </PDFExport>
            <PoweredBy />
          </Fragment>
        }
        <SweetAlertSuccess
          showAlert={openAlert}
          receipt={receiptItem}
          receiptIndex={receiptIndex}
          onConfirm={this.onOpenReceiptMail}
          onCancel={this.onCloseAlert}
          title="Record a payment"
          message="The payment was recorded."
        />
        <SendReceipt
          openRecord={openReceiptMail}
          invoiceData={invoiceData}
          receipt={receiptItem}
          receiptIndex={receiptIndex}
          onClose={this.onCloseReceiptMail}
          showSnackbar={(message, err) => this.props.openGlobalSnackbar(message, err)}
          refreshData={this.fetchInvoiceData}
        />
        <ExportPdfModal
          openModal={openExportModal}
          onClose={() => this.setState({openExportModal: !this.state.openExportModal})}
          onConfirm={this.exportPDF.bind(this, true)}
          loading={downloadLoading}
          from="invoice"
          btnLoading={btnLoading}
        />
      </div>
    );
  }
}
const mapPropsToState = state => ({
  businessInfo: state.businessReducer.selectedBusiness,
  allPayments: state.getAllInvoicePayments
});
export default connect(mapPropsToState, { openGlobalSnackbar, getInvoicePayments })(InvoiceViewBrowser);
