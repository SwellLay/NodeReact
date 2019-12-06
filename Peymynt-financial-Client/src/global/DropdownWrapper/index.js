import history from "customHistory";
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { DeleteModal } from "utils/PopupModal/DeleteModal";
import { openGlobalSnackbar } from "../../actions/snackBarAction";
import { cloneEstimate, convertEstimateToInvoice, deleteEstimate, downloadEstimatePdf } from "../../api/EstimateServices";
import MailInvoice from '../../components/app/components/Estimates/components/MailInvoice';
import ConfirmationModal from '../ConfirmationModal';
import moment from "moment";
import ExportPdfModal from "../../utils/PopupModal/ExportPdfModal";
import { _downloadPDF } from "../../utils/GlobalFunctions";

let link;
class DropdownWrapper extends Component {
  state = {
    dropdownOpen: false,
    isDelete: false,
    openMail: false,
    confirmConvert: false,
    modalContent: null,
    openExportModal: false,
    downloadLoading: false,
    btnLoading: false,
    convertLoading: false
  };

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };
  onViewClick = () => {
    const id = this.props.row._id;
    history.push("/app/estimates/view/" + id);
  };
  onEditClick = () => {
    const id = this.props.row._id;
    history.push("/app/estimates/edit/" + id);
  };

  onConfirmDelete = () => {
    this.setState({ isDelete: true })
  };

  onCloseModal = () => {
    this.setState({ isDelete: false })
  };

  onDuplicate = async () => {
    const id = this.props.row._id;
    const response = await cloneEstimate(id);
    const estimateId = response.data.estimateWithLink._id;
    history.push(`/app/estimates/edit/${estimateId}?duplicate=true`);
  };

  onDeleteClick = async () => {
    const id = this.props.row._id;
    await deleteEstimate(id);
    location.reload();
  };

  handleMail = (e, refetch) => {
    if (refetch && refetch._id) {
      // this.fetchInvoiceData(refetch._id);
      window.location.reload();
      this.props.showSnackbar("Email sent successfully", false)
    }
    this.setState({
      openMail: !this.state.openMail
    });
    // this.setState({
    //   openMail: !this.state.openMail
    // });
    // if(!!data){
    //   // console.log("data", this.props)
    //   // this.props.refetchList();
    //   this.props.openGlobalSnackbar('Email sent successfully', false);
    //   window.location.reload();
    // }
  };

  exportPDF = async (download) => {
    const invoiceData = this.props.row;
    const date = moment(invoiceData.expiryDate).format("YYYY-MM-DD");
    console.log("invoiceData", )
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
        this.setState({openExportModal: false , btnLoading: false})
        link.download =  `Estimate_${invoiceData.estimateNumber}_${date}.pdf`;
        link.click();
      }
    }else{
      this.setState({ downloadLoading: false})
      this.props.showSnackbar("Failed to download PDF. Please try again after sometime.", true)
    }
  };

  onPrintClick=()=>{
    window.open(`${process.env.WEB_URL}/public/estimate/${this.props.row.uuid}`)
    // window.print()
  };

  convertEstimate = async () => {
    console.log("in confirm");
    this.setState({convertLoading: true})
    let estimateId = this.props.row._id;
    const invoiceData = await convertEstimateToInvoice(estimateId);
    const invoiceId = invoiceData.data.invoice._id;
    this.setState({convertLoading: false})
    history.push(`/app/invoices/edit/${invoiceId}`);
  };

  convertEstimateConfirm = (e) => {
    e.preventDefault();
    let modalContent = {
      heading: 'Convert an estimate to an invoice',
      body: 'Convert this estimate to a draft invioce?'
    };
    this.setState({confirmConvert: true, modalContent})
  };

  render() {
    const { isDelete, dropdownOpen, openMail, modalContent, confirmConvert, openExportModal, downloadLoading, btnLoading } = this.state;

    return (
      <Fragment>
        <Dropdown className="dropdown-circle dropdown-menu-new3" isOpen={dropdownOpen}
          toggle={this.toggle}
          direction={'left'}
        >
          <DropdownToggle className="btn btn-cirle" id="action">
            <i className="fa fa-caret-down" aria-hidden="true" id="dropIcon"></i>
          </DropdownToggle>
          <DropdownMenu>
            <div className="dropdown-menu--body">
              <DropdownItem id="dropItem0" key={0} onClick={this.onViewClick}>View</DropdownItem>
              <DropdownItem id="dropItem1" key={1} onClick={this.onEditClick}>Edit</DropdownItem>
              <DropdownItem id="dropItem9" key={9} onClick={this.onDuplicate}>Duplicate</DropdownItem>
              <DropdownItem id="dropItem2" key={2} onClick={this.onPrintClick} >Print</DropdownItem>
              <div className="dropdown-item-divider"></div>
              <DropdownItem id="dropItem4" key={4} onClick={this.convertEstimateConfirm.bind(this)}>Convert to invoice</DropdownItem>
              <div className="dropdown-item-divider"></div>
              <DropdownItem id="dropItem6" key={6} onClick={this.handleMail} >Send</DropdownItem>
              <DropdownItem id="dropItem7" key={7} onClick={this.exportPDF.bind(this, false)}>Export as PDF</DropdownItem>
              <div className="dropdown-item-divider"></div>
              <DropdownItem id="dropItem8" key={8} onClick={this.onConfirmDelete}>Delete</DropdownItem>
            </div>
          </DropdownMenu>
        </Dropdown>
        <DeleteModal
          message='Are you sure you want to delete this estimate?'
          openModal={isDelete}
          onDelete={this.onDeleteClick}
          onClose={this.onCloseModal}
        />
        {
          openMail && (
            <MailInvoice
              openMail={openMail}
              invoiceData={this.props.row}
              onClose={this.handleMail.bind(this)}
            />
          )
        }
        <ConfirmationModal
          open={confirmConvert}
          text={modalContent}
          onConfirm={this.convertEstimate}
          onClose={() => this.setState({confirmConvert: false})}
          convertLoading={this.state.convertLoading}
        />
        <ExportPdfModal
          openModal={openExportModal}
          onClose={() => this.setState({openExportModal: !this.state.openExportModal})}
          onConfirm={this.exportPDF.bind(this, true)}
          loading={downloadLoading}
          from="estimate"
          btnLoading={btnLoading}
        />
      </Fragment>
    );
  }
}

export default connect(null, {openGlobalSnackbar})(DropdownWrapper)
