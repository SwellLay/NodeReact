import { fetchVendorBankDetails, getByIdVendor, getVendorBankDetails } from 'actions/vendorsAction';
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import CenterSpinner from '../../../../../../../global/CenterSpinner';
import { _documentTitle } from '../../../../../../../utils/GlobalFunctions';

function maskNumber(number) {
  const length = String(number).length;
  return String(number).substr(length - 3).padStart(length, '*');
}

class EditBankDetails extends Component {
  componentDidMount() {
    const { match: { params }, getByIdVendor, fetchVendorBankDetails, businessInfo } = this.props;
    _documentTitle(businessInfo, "Bank Information");
    if (!!params.id) {
      getByIdVendor(params.id);
      fetchVendorBankDetails(params.id);
    }
  }

  componentWillUnmount() {
    this.props.getVendorBankDetails({});
  }

  renderHeader() {
    const { vendor, loading } = this.props;

    if (loading) {
      return null;
    }

    return (
      <header className="py-header py-header--page">
        <div className="py-header--title">
          <div className="py-heading--title">{vendor.vendorName}</div>
        </div>
        <div className="py-header--actions">
          <NavLink to="/app/purchase/vendors" activeClassName="" className="btn btn-outline-primary">
            Back to vendors list
          </NavLink>
        </div>
      </header>
    )
  }

  renderForm() {
    const { vendor, data } = this.props;
    return (
      <div className="py-box py-box--large py-box--card">
          <div className="py-box--header">
            <div className="py-box--header-title">
              Current Bank Account for Direct Deposit
            </div>
            <div className="py-box--header-actions">
              <NavLink to={`/app/purchase/vendors/${vendor.id}/bank-details/edit`}
                className="btn btn-outline-primary">
                Edit
              </NavLink>
            </div>
          </div>
          <div className="py-box--content">
            <table className="table table-bordered table-fixed-width">
              <tbody>
              <tr>
                <td>Routing Number</td>
                <td>{data.routingNumber}</td>
              </tr>
              <tr>
                <td>Account Number</td>
                <td>{maskNumber(data.accountNumber)}</td>
              </tr>
              <tr>
                <td>Account Type</td>
                <td>personal {data.accountType === 'saving' ? 'savings' : 'checking'}</td>
              </tr>
              </tbody>
            </table>
          </div>
      </div>
    )
  }

  renderContent() {
    const { loading } = this.props;

    return (
      <div className="content">
        {loading ? <CenterSpinner /> : this.renderForm()}
      </div>
    );
  }

  renderBody() {
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderContent()}
      </Fragment>
    )
  }

  render() {
    return (
      <div className="vendorWrapper">
        <div className="content-wrapper__main__fixed view-bank-details">
          {this.renderBody()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ getByIdVendor, vendorBank, businessReducer }) => {
  return {
    businessInfo: businessReducer.selectedBusiness,
    vendor: getByIdVendor.data ? getByIdVendor.data.vendor : {},
    loading: getByIdVendor.loading || vendorBank.loading,
    data: vendorBank.data,
  };
};

export default withRouter(connect(mapStateToProps, {
  getByIdVendor,
  fetchVendorBankDetails,
  getVendorBankDetails,
})(EditBankDetails))
