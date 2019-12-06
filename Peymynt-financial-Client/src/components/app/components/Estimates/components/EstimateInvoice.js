import { PDFExport } from '@progress/kendo-react-pdf';

import history from "customHistory";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import React, { PureComponent } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from "react-redux";
import ReactToPrint from "react-to-print";
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Spinner
} from "reactstrap";
import { DeleteModal } from "utils/PopupModal/DeleteModal";
import { openGlobalSnackbar } from "../../../../../actions/snackBarAction";
import {
  cloneEstimate,
  convertEstimateToInvoice,
  deleteEstimate,
  fetchEstimateById,
  downloadEstimatePdf
} from "../../../../../api/EstimateServices";
import { invoiceSettingPayload } from "../../setting/components/supportFunctionality/helper";
import { estimatePayload, mailMessage } from "./constant";
import EstimateClassicPreview from "./EstimateClassicPreview";
import { EstimateHeader, RenderShippingAddress } from "./EstimateInvoiceComponent";
import EstimateModrenPreview from "./EstimateModrenPreview";
import InvoicePrintComponent from "./InvoicePrintComponent";
import SendMail from "./SendMail";
import { _downloadPDF, _documentTitle } from '../../../../../utils/GlobalFunctions';
import ExportPdfModal from '../../../../../utils/PopupModal/ExportPdfModal';
import MailInvoice from './MailInvoice';
import InvoicePreviewClassic from '../../invoice/components/InvoicePreviewClassic';
import InvoicePreviewModern from '../../invoice/components/InvoicePreviewModern';
import InvoicePreview from '../../invoice/components/InvoicePreview';
import CenterSpinner from '../../../../../global/CenterSpinner';

let link;
class EstimateInvoice extends PureComponent {
  state = {
    openModal: false,
    dropdownOpen: false,
    dropdownOpenMore: false,
    modal: false,
    invoiceModal: false,
    selectedCustomer: null,
    invoiceData: estimatePayload(),
    userSettings: invoiceSettingPayload(),
    loading: false,
    btnLoading: false,
    convertLoader: false
  };

  componentDidMount() {
    const { businessInfo } = this.props;
    _documentTitle(businessInfo, `Estimate`)
    // document.title = businessInfo ? `Peymynt - ${businessInfo.organizationName} - Estimate` : "Peymynt - Estimate";
    const id = this.props.match.params.id;
    this.fetchInvoiceData(id);
  }

  fetchInvoiceData = async id => {
    const { businessInfo } = this.props;
    this.setState({ loading: true });
    try {
      let response = await fetchEstimateById(id);
      const invoiceData = response.data.estimate;
      const userSettings = response.data.salesSetting;
      // document.title = businessInfo ? `Peymynt - ${businessInfo.organizationName} - Estimate ${invoiceData.estimateNumber}` : "Peymynt - Estimate";
      _documentTitle(businessInfo, `${invoiceData.name} ${invoiceData.estimateNumber}`)

      this.setState({ invoiceData, userSettings, loading: false});
    } catch (error) {
      console.error('error', error);
      if (error.data) {
        this.props.showSnackbar(error.message, true);
        history.push("/404")
      }
    }
  };


  handleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  handleDropdownMore = () => {
    this.setState(prevState => ({
      dropdownOpenMore: !prevState.dropdownOpenMore
    }));
  };

  handleModal = (e, refetch) => {
    console.log(e)
    console.log("refetch", refetch)
    if (refetch && refetch._id) {
      this.fetchInvoiceData(refetch._id);
      this.props.showSnackbar("Email sent successfully", false)
    }
    this.setState({
      modal: !this.state.modal
    });
  };

  handleInvoiceModal = () => {
    this.setState({
      invoiceModal: !this.state.invoiceModal
    });
  };

  deleteAlert = () => {
    this.setState({ openModal: true })
  };

  onCloseModal = () => {
    this.setState({ openModal: false })
  };

  onDeleteEstimate = async (e) => {
    e.preventDefault();
    try {
      const estimateId = this.state.invoiceData._id;
      const response = await deleteEstimate(estimateId);
      if (response.statusCode === 200) {
        this.props.showSnackbar(response.message, false);
        history.push("/app/estimates")
      } else {
        this.props.showSnackbar(response.message, false)
      }
    } catch (error) {
      this.props.showSnackbar(error.message, true)
    }
  };

  onEditButton = (e) => {
    e.preventDefault();
    const { invoiceData } = this.state;
    history.push("/app/estimates/edit/" + invoiceData._id)
  };

  onDuplicateClick = async () => {
    const id = this.state.invoiceData._id;
    const response = await cloneEstimate(id);
    const estimateId = response.data.estimateWithLink._id;
    history.push(`/app/estimates/edit/${estimateId}?duplicate=true`);
  };

  sendMailToUser = (e, type) => {

    const { invoiceData } = this.state;
    const businessInfo = this.props.businessInfo;
    const url = mailMessage(invoiceData, type, businessInfo);
    window.open(url)
  };

  renderShipToAddress = (addressShipping) => {
    return <RenderShippingAddress addressShipping={addressShipping} />;
  };

  renderEstimateDropdown = () => {
    const { publicView, uuid, name } = this.state.invoiceData;
    const link = (publicView && publicView.shareableLinkUrl ? publicView.shareableLinkUrl
      : `${process.env.WEB_URL}/api/v1/estimatesharelink${uuid}`);
    return (<div className="dropdown-menu--body">
        <a className="dropdown-item" onClick={this.handleModal}>
          Send with Peymynt
      </a>
      <span className="dropdown-item-divider"></span>
      <span className="dropdown-menu-item--header ">Share URL</span>
      <CopyToClipboard text={link}>
        <li className="dropdown-item">
          <input type="text" onFocus={event=>{event.target.select()}} value={link} className="form-control js-public--link" />
          <div className="py-text--hint copy-helper">
            Press Cmd+C or Ctrl+C to copy to clipboard
          </div>
        </li>
      </CopyToClipboard>
      <span className="dropdown-item-divider"></span>
       <a className="dropdown-item" onClick={this.exportPDF.bind(this, false)}>Export as PDF </a>
        <ReactToPrint
          trigger={() => <a className="dropdown-item">  Print {name} </a>}
          content={() => this.componentRef}
        />

    </div>)
  };

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
        this.props.openGlobalSnackbar("Something went wrong, ", true)
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

  onCloseExport = () => {
    this.setState({ onPrint: false })
  };

  onPrintPDF = async () => {
    const { invoiceData } = this.state;
    const estimateId = invoiceData._id;
    const W = await window.open(`${process.env.API_URL}/api/v1/estimates/${estimateId}/pdf`, '_self');
    W.window.print();
  };

  redirectToEditBusiness = ()=>{
    history.push(`/app/${localStorage.getItem('user.id')}/accounts/business/${localStorage.getItem('businessId')}/edit`)
  };

  onCustomizeClick = () => {
    console.log("in on customize");
    history.push(`/app/setting/invoice-customization`);

  };

  renderEstimateInvoiceDropdwon = () => {

    return <div className="dropdown-menu--body">
      <a className="dropdown-item" onClick={this.onCustomizeClick}>
        Customize & Set Defaults
      </a>
      <a className="dropdown-item" onClick={this.redirectToEditBusiness}>
          Edit Business Information
      </a>
      <span className="dropdown-item-divider"></span>
      <a className="dropdown-item" onClick={this.onDuplicateClick}>
        Duplicate
      </a>
      <a className="dropdown-item"  target={'_blank'}  onClick={this.exportPDF.bind(this, false)}>
         Export as PDF
      </a>
        <ReactToPrint
          trigger={() => <a className="dropdown-item">  Print </a>}
          content={() => this.componentRef}
        />
      <span className="dropdown-item-divider"></span>
      <a className="dropdown-item" onClick={this.deleteAlert}>
        Delete
      </a>
    </div>
  };

  onCustomerViewClick = () => {
    this.props.history.push(`/public/estimate/${this.state.invoiceData.uuid}`)
  };

  renderEstimateHeader = () => {
    const {
      dropdownOpen,
      dropdownOpenMore,
      invoiceData
    } = this.state;
    return <React.Fragment>
      <div>
        <Button className="btn btn-outline-primary mr-2" onClick={this.onEditButton}>Edit</Button>
        <Button
          className="btn btn-outline-primary"
          onClick={this.handleInvoiceModal}
        >
          Convert to Invoice
        </Button>
      </div>
      <div>`
        <button onClick={this.onCustomerViewClick} className="btn btn-outline-primary mr-2">
          Customer view
        </button>
        <Dropdown
          className="mr-2"
          isOpen={dropdownOpen}
          toggle={this.handleDropdown}
          direction={'bottom'}
        >
          <DropdownToggle caret className="btn-primary">
            {invoiceData.status === "sent" || invoiceData.status === "viewed" ? "Resend" : "Send"}
          </DropdownToggle>
          <DropdownMenu className="dropdown-item">
            {this.renderEstimateDropdown(invoiceData)}
          </DropdownMenu>
        </Dropdown>
        <Dropdown
          className=""
          isOpen={dropdownOpenMore}
          toggle={this.handleDropdownMore}
          direction={'bottom'}
        >
          <DropdownToggle caret className="btn-outline-primary">
            More
          </DropdownToggle>
          <DropdownMenu  right={false}>
            {this.renderEstimateInvoiceDropdwon()}
          </DropdownMenu>
        </Dropdown>
      </div>
    </React.Fragment>
  };

  renderTemplates=()=>{
    const { invoiceData } = this.state;
    const { businessInfo, userSettings } = this.props;
    if (userSettings && userSettings.template === "classic") {
      return(<InvoicePreviewClassic
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        showPayment={false}
      />)
    } else if (userSettings && userSettings.template === "modern") {
      return(<InvoicePreviewModern
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        showPayment={false}
      />)
    } else {
      return(<InvoicePreview
        ref={el => (this.componentRef = el)}
        businessInfo={businessInfo}
        invoiceData={invoiceData}
        userSettings={userSettings}
        showPayment={false}
      />)
    }
  };

  convertEstimate = async () => {
    this.setState({convertLoader: true})
    let estimateId = this.state.invoiceData._id;
    const invoiceData = await convertEstimateToInvoice(estimateId);
    const invoiceId = invoiceData.data.invoice._id;
    this.setState({convertLoader: false})
    history.push(`/app/invoices/edit/${invoiceId}`);
  };

  render() {
    const {
      modal,
      invoiceModal,
      invoiceData,
      onPrint,
      loading,
      openExportModal,
      downloadLoading,
      btnLoading
    } = this.state;

    return (
      <div className="container">
        {
          loading ? <Spinner color="primary" size="md" className="loader"/> :
            <div className="content-wrapper__main__fixed">
              <EstimateHeader estimate={invoiceData} handleModal={this.handleModal} />

                <div className="d-flex justify-content-between mb-4">
                  {this.renderEstimateHeader()}
                </div>

              <PDFExport
                fileName="Estimate11111.pdf"
                title=""
                subject=""
                keywords=""
                ref={(r) => this.resume = r}>
                <div
                  id='EstinamateInvoice__Preview'
                  style={{
                    height: `${onPrint ? '100%' : '100%'}`,
                    width: `${onPrint ? '95%' : '100%'}`,
                    padding: 'none',
                    backgroundColor: 'white',
                    margin: 'auto'
                  }}>
                  {this.renderTemplates()}
                </div>
              </PDFExport>
              {/* <SendMail
                mailInfo={invoiceData}
                open={modal}
                handleModal={this.modal}
                showSnackbar={(message, error) => this.props.showSnackbar(message, error)}
              /> */}
              {
                modal && (
                  <MailInvoice
                    openMail={modal}
                    invoiceData={invoiceData}
                    onClose={this.handleModal.bind(this)}
                  />
                )
              }
              <Modal
                isOpen={invoiceModal}
                toggle={this.handleInvoiceModal}
                className="modal-add modal-email"
              >
                <ModalHeader toggle={this.handleInvoiceModal}>
                  Convert an estimate to an invoice
                </ModalHeader>
                <ModalBody>
                  <p className="mrB0">Convert this estimate to a draft invoice?</p>
                </ModalBody>
                <ModalFooter>
                  <FormGroup row className="modal-foo">
                    <Col sm={12}>
                      <Button className="" onClick={this.handleInvoiceModal}>
                        Cancel
                      </Button>{" "}
                      <Button
                        onClick={this.convertEstimate}
                        className="btn btn-accent btn-secondary btn-rounded"
                        disabled={this.state.convertLoader}
                      >
                        Convert { this.state.convertLoader && (<Spinner size="sm" color="light" />) }
                      </Button>{" "}
                      {/* <span className="pdL5 pdR5">or</span> */}

                    </Col>
                  </FormGroup>
                </ModalFooter>
              </Modal>
              <DeleteModal
                message={"Are you sure you want to delete this esitmate?"}
                openModal={this.state.openModal}
                onDelete={this.onDeleteEstimate}
                onClose={this.onCloseModal}
              />
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

const mapStateToProps = state => ({
  businessInfo: state.businessReducer.selectedBusiness,
  userSettings: state.settings.userSettings,
});

const mapDispatchToProps = (dispatch) => {
  return {
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EstimateInvoice);
