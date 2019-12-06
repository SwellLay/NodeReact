import { PDFExport } from "@progress/kendo-react-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import ReactToPrint from "react-to-print";
import { Button } from "reactstrap";
import { openGlobalSnackbar } from "../../actions/snackBarAction";
import { fetchEstimateById } from "../../api/EstimateServices";
import { fetchSalesSetting } from "../../api/SettingService";
import { estimatePayload } from "../app/components/Estimates/components/constant";
import EstimateClassicPreview from "../app/components/Estimates/components/EstimateClassicPreview";
import EstimateModrenPreview from "../app/components/Estimates/components/EstimateModrenPreview";
import InvoicePrintComponent from "../app/components/Estimates/components/InvoicePrintComponent";
import moment from "moment-timezone";
import { invoiceSettingPayload } from "../app/components/setting/components/supportFunctionality/helper";
import {privacyPolicy , terms ,getstarted} from "../../utils/GlobalFunctions";

class ViewEstimate extends PureComponent {
  state = {
    openModal: false,
    dropdownOpen: false,
    dropdownOpenMore: false,
    modal: false,
    invoiceModal: false,
    selectedCustomer: null,
    invoiceData: estimatePayload(),
    userSettings: invoiceSettingPayload()
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    this.fetchInvoiceData(id);
  }

  fetchInvoiceData = async id => {
    try {
      let response = await fetchEstimateById(id);
      const invoiceData = response.data.estimate;
      const settingResponse = await fetchSalesSetting();
      const userSettings = settingResponse.data.salesSetting;
      this.setState({ invoiceData, userSettings });
    } catch (error) {
      console.error("error", error);
      if (error.data) {
        this.props.showSnackbar(error.message, true);
        history.push("/app/estimates");
      }
    }
  };

  // Add this method to the React
  exportPDF = () => {
    // const input = this.resume;
    const { invoiceData } = this.state;
    const date = moment().format("YYYY-MM-DD");
    const input = document.getElementById("divIdToPrint");
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save(`Estimate_${invoiceData.estimateNumber}_${date}.pdf`);
    });
    // this.resume.save();
  };

  printPDF = () => {
    window.print();
  };

  renderTemplate=() => {
    const { invoiceData, userSettings } = this.state;
    const businessInfo = invoiceData.businessId;
    if (userSettings.template === "classic") {
      return(<EstimateClassicPreview
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
      />)
    } else if (userSettings.template === "modern") {
      return(<EstimateModrenPreview
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
      />)
    } else {
      return(<InvoicePrintComponent
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
      />)
    }
  }

  render() {
    const { invoiceData } = this.state;
    const { businessInfo } = this.props;
    const sign = invoiceData.currency ? invoiceData.currency.symbol : ''
    return (
      // Add this to the render method
      // Add this to the render method
      <Fragment>
       

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
              height: "100%",
              width: "60%",
              padding: "none",
              backgroundColor: "none",
              margin: "auto",
              overflowX: "hidden",
              overflowY: "hidden"
            }}
          >

      <div className="invoice-preview__actions">
          <ReactToPrint
            trigger={() => <Button className="btn-outline-primary"> Print </Button>}
            content={() => this.componentRef}
          />
          <Button className="btn-outline-primary" onClick={this.exportPDF}>
            Download PDF
          </Button>
        </div>
        
            <div ref={el => (this.componentRef = el)}>
            {this.renderTemplate()}
            </div>
            </div>
            <div className="readonly_footer">
              <div> 
                <a className="py-logo--powered-by py-logo--small"> 
                  Powered By  <span><img style={{width:"40px"}} src="/assets/images/logo.png"/> </span>
                </a>
              </div>
              <div className="track-and-get-started"> 
                 Get paid, track expenses, and manage your money with Peymynt. <a onClick={() => getstarted()} href="#">Get Started </a> 
              </div>
              <div className="footer_menu">
                 © 2010-2019 Peymynt Financial Inc. <a onClick={() => privacyPolicy()} href="#">Privacy Policy</a> • <a onClick={() => terms()} href="#">Security</a>
              </div>
            </div>
        </PDFExport>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  businessInfo: state.businessReducer.selectedBusiness
});

const mapDispatchToProps = (dispatch) => {
  return {
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewEstimate);
