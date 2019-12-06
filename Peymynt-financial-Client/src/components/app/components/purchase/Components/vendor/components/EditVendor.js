import { getByIdVendor } from 'actions/vendorsAction';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CenterSpinner from '../../../../../../../global/CenterSpinner';
import VendorForm from './VendorForm';

class EditVendor extends Component {
  componentDidMount() {
    console.log('this.props', this.props);
    const { params } = this.props.match;
    if (!!params.id) {
      this.props.getByIdVendor(params.id)
    }
  }

  render() {
    const { loading, success, data } = this.props.getByIdVendorState;
    return (
      <div className="vendorWrapper">
        <div className="content-wrapper__main__fixed">
          <header className="py-header--page">
            <div className="py-header--title">
              <h2 className="py-heading--title">Edit a vendor</h2>
            </div>
          </header>
          <div className="content">
            {
              loading ? (<CenterSpinner />)
                : success ? (<VendorForm isEdit isEditMode vendorInput={data.vendor} />) : ""
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ getByIdVendor }) => {
  return {
    getByIdVendorState: getByIdVendor
  }
};
export default withRouter(connect(mapStateToProps, { getByIdVendor })(EditVendor))
