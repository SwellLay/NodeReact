import React, { Component } from "react";
import { invoiceInput } from "../../helpers";
import { getInvoice, getInvoiceByUUID } from "../../../../../../api/InvoiceService";
import { Container, Spinner } from 'reactstrap'
import RecieptWrapper from "../../../../../../global/RecieptWrapper";


class ReceiptPreview extends Component {
  state = {
    openModal: false,
    dropdownOpen: false,
    dropdownOpenMore: false,
    modal: false,
    invoiceModal: false,
    selectedCustomer: null,
    invoiceData: invoiceInput(),
    salesSettings: null,
    userInfo: null,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetchInvoiceData(id);
  }

  fetchInvoiceData = async id => {
    try {
      const { receiptId } = this.props.match.params;
      let response;
      if(this.props.location.pathname.includes('readonly')){
        response = await getInvoiceByUUID(id)
      }else{
        response = await getInvoice(id);
      }
      const invoiceData = response.data.invoice;
      let salesSettings = response.data.salesSetting;
      let userInfo = response.data.userInfo;
      const receiptData = response.data.payments.find(o => {
        return o._id === receiptId;
      });
      this.setState({ invoiceData, receiptData, salesSettings, userInfo });
    } catch (error) {
      console.error("error", error);
    }
  };

  render() {
    const { invoiceData, receiptData, salesSettings, userInfo } = this.state;
    const businessInfo = invoiceData.businessId;
    return (
      <div className="receipt-preview">
        {
          invoiceData && businessInfo && userInfo && receiptData ?
          <RecieptWrapper userInfo={userInfo} invoiceData={invoiceData} businessInfo={businessInfo} receiptData={receiptData} salesSettings={salesSettings} {...this.props}/>
          : <Container className="text-center" style={{height: '100vh', width: '100%'}}>
              <Spinner color="primary" size="md" className="loade mrT50" />
            </Container>
        }
        </div>
    );
  }
}

export default ReceiptPreview;
