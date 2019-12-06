import { getBillById } from 'actions/billsAction';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import CenterSpinner from '../../../../../../../global/CenterSpinner';
import BillForm from './BillForm';

class EditBill extends Component {
  componentDidMount() {
    const { match: { params: { id } }, getBillById } = this.props;
    if (!!id) {
      getBillById(id);
    }
  }

  render() {
    const { loading, bill } = this.props;

    return (
      <div className="billsWrapper">
        {loading ? < CenterSpinner /> : <BillForm selectedBill={bill} isEditMode />}
      </div>
    );
  }
}

function mapStateToProps({ bills }) {
  return {
    bill: bills.data,
    loading: bills.loading,
  };
}

export default connect(mapStateToProps, { getBillById })(EditBill)
