import React, { Component } from 'react'
import VendorForm from './VendorForm';

export default class AddVendor extends Component {
  render() {
    return (
      <div className="vendorWrapper">
        <div className="content-wrapper__main__fixed">
          <header className="py-header--page">
            <div className="content">
              <h2 className="py-heading--title">Add a vendor</h2>
              <div className="clearfix" />
            </div>
          </header>
          <div className="content">
            <VendorForm isEdit={false} />
          </div>
        </div>
      </div>
    );
  }
}
