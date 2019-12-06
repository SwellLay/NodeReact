import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import InvoiceForm from ".";
import { getInvoice } from "../../../../../../api/InvoiceService";
import { _documentTitle } from "../../../../../../utils/GlobalFunctions";

class EditInvoice extends React.Component {
  state = {
    invoiceData: undefined
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    this.fetchInvoiceInfo(id);
  }

  fetchInvoiceInfo = async id => {
    try {
      const response = await getInvoice(id);
      if (response.statusCode === 200) {
        console.log('response', response)
        _documentTitle(response.data.invoice.businessId, "")
        this.setState({ invoiceData: response.data.invoice });
      } else {
        this.props.showSnackbar("Invoice does not exists any more", false);
        this.props.history("/app/invoices");
      }
    } catch (error) {
      console.error("-----------error-----------", error);
      this.props.showSnackbar("Something  went wrong", true);
    }
  };

  render() {
    const { invoiceData } = this.state;
    return <InvoiceForm invoiceData={invoiceData} isEditMode={true} />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error));
    }
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(EditInvoice)
);
