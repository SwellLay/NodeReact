import React, { Component } from 'react'
import BillForm from './BillForm';

export default class CreateBill extends Component {
  render() {
    const { match: { params } } = this.props;
    return (
      <div className="billsWrapper">
        <BillForm vendorId={params.vendorId || undefined} />
      </div>
    );
  }
}
