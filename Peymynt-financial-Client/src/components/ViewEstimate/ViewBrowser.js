import { PDFExport } from "@progress/kendo-react-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment-timezone";
import React, { PureComponent } from "react";
import ReactToPrint from "react-to-print";
import { Button, Container, Spinner } from "reactstrap";
import { fetchEstimateByUUID, downloadEstimatePdf } from "../../api/EstimateServices";
import { estimatePayload } from "../app/components/Estimates/components/constant";
import { fetchSalesSetting } from "../../api/SettingService";
import { invoiceSettingPayload } from "../app/components/setting/components/supportFunctionality/helper";
import EstimateClassicPreview from "../app/components/Estimates/components/EstimateClassicPreview";
import EstimateModrenPreview from "../app/components/Estimates/components/EstimateModrenPreview";
import InvoicePrintComponent from "../app/components/Estimates/components/InvoicePrintComponent";
import { PoweredBy } from "../common/PoweredBy";
import _ from 'lodash';
import history from 'customHistory'
import { _documentTitle, _downloadPDF } from "../../utils/GlobalFunctions";
import ExportPdfModal from "../../utils/PopupModal/ExportPdfModal";
import InvoicePreviewClassic from "../app/components/invoice/components/InvoicePreviewClassic";
import InvoicePreviewModern from "../app/components/invoice/components/InvoicePreviewModern";
import InvoicePreview from "../app/components/invoice/components/InvoicePreview";

let link;
class ViewBrowser extends PureComponent {
  resume;
  state = {
    openModal: false,
    dropdownOpen: false,
    dropdownOpenMore: false,
    modal: false,
    invoiceModal: false,
    selectedCustomer: null,
    invoiceData: estimatePayload(),
    userSettings: invoiceSettingPayload(),
    print: false,
    loading: false,
    openExportModal: false,
    downloadLoading: false,
    btnLoading: false
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    this.fetchInvoiceData(id);
  }

  fetchInvoiceData = async id => {
    this.setState({ loading: true });
    try {
      const response = await fetchEstimateByUUID(id);
      const settingRequest = response;
      const invoiceData = response.data.estimate;
      const userSettings = settingRequest.data.salesSetting
      _documentTitle(invoiceData.businessId, "")
      this.setState({ invoiceData, userSettings, loading: false });
      let elem = document.getElementById('divIdToPrint')
      if(_.includes(this.props.location.search, 'download=true')){
        if(!!elem){
          this.resume.save();
          window.close()
        }
      }else if(_.includes(this.props.location.search, 'print=true')){
        _documentTitle(invoiceData.businessId, `Estimate ${invoiceData.estimateNumber}`)
        // window.print();
      }
    } catch (error) {
      console.error("error", error);
      if (error.data) {
        // this.props.showSnackbar(error.message, true);
        history.push("/app/404");
      }
    }
  };

  // Add this method to the React
  exportPDF = async (download) => {
    const {invoiceData} = this.state;
    const date = moment(invoiceData.expiryDate).format("YYYY-MM-DD");
    this.setState({
      btnLoading: true
    })
    if(!download){
      this.setState({openExportModal: true, downloadLoading: true})
      try{
        link = await _downloadPDF(invoiceData, 'estimates');
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
        link.download =  `Estimate_${invoiceData.estimateNumber}_${date}.pdf`;
        link.click();
      }
    }else{
      this.setState({ downloadLoading: false})
      this.props.showSnackbar("Failed to download PDF. Please try again after sometime.", true)
    }
  };

  printPDF = () => {
    const {invoiceData} = this.state
    window.open(`${process.env.WEB_URL}/public/estimate/${invoiceData.uuid}?print=true`)
  }
  renderTemplate = () => {
    const { invoiceData, userSettings } = this.state
    const businessInfo  = invoiceData.businessId;
    if (userSettings.template === "classic") {
      return (<InvoicePreviewClassic
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        showPayment={false}
      />)
    } else if (userSettings.template === "modern") {
      return (<InvoicePreviewModern
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        showPayment={false}
      />)
    } else {
      return (<InvoicePreview
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        showPayment={false}
      />)
    }
  }

  render() {
    const { invoiceData, loading, openExportModal, downloadLoading, btnLoading } = this.state;
    return (
      // Add this to the render method
      // Add this to the render method
      <div>
        {loading ? <div className="spinner-wrapper"><Spinner color="primary" size="md" className="loader" /></div> :
          <div>

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
                  padding: "none",
                  backgroundColor: "none",
                  margin: "auto",
                  height: '100%',
                  width: this.state.print ? "60%" : "auto",
                  overflowX: "hidden",
                  overflowY: "hidden"
                }}
              >


                <div style={{width: '820px', margin: '24px auto'}}>
                  <div className="mb-4">
                    <ReactToPrint
                      trigger={() => <Button className="btn-outline-primary mr-2">Print </Button>}
                      content={() => this.componentRef}
                    />
                    <Button className="btn-outline-primary" onClick={this.exportPDF.bind(this, false)}>
                      Download PDF
                    </Button>
                  </div>
                  <div ref={el => (this.componentRef = el)}>
                    {this.renderTemplate(invoiceData)}
                  </div>
                </div>
              </div>
            </PDFExport>
            <PoweredBy />
            <ExportPdfModal
              openModal={openExportModal}
              onClose={() => this.setState({openExportModal: !this.state.openExportModal})}
              onConfirm={this.exportPDF.bind(this, true)}
              loading={downloadLoading}
              from="estimate"
              btnLoading={btnLoading}
            />
          </div>
        }
      </div>
    );
  }
}

export default ViewBrowser;
