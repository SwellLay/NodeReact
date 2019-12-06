import { getAllBills, recordPayment } from 'actions/billsAction';
import { getAllVendors } from 'actions/vendorsAction';
import RecordPaymentModal from 'components/app/components/purchase/Components/bills/components/RecordPaymentModal';
import history from 'customHistory'
import { isEqual } from 'lodash'
import moment from 'moment';
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import ReactSVG from 'react-svg';
import { Button, Tooltip } from 'reactstrap';
import DataTableWrapper from 'utils/dataTableWrapper/DataTableWrapper';
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import CenterSpinner from '../../../../../../global/CenterSpinner';
import SelectBox from '../../../../../../utils/formWrapper/SelectBox';
import { _documentTitle } from '../../../../../../utils/GlobalFunctions';
import { defaultSorted, getColumns } from './constants/BillTableConst';
import { NoDataMessage } from '../../../../../../global/NoDataMessage';

let query = '';

class Bills extends Component {
  state = {
    query: { vendorId: '', startDate: '', endDate: '' },
    selectedBill: undefined,
    tooltipOpen: false,
  };

  componentDidMount() {
    const { businessInfo } = this.props;
    _documentTitle(businessInfo, "Bills");
    this.props.getAllBills(this.state.query);
    this.props.getAllVendors();
  }

  vendorsOption() {
    const { allVendors = [] } = this.props;
    return allVendors.map(r => ({ id: r.id, value: r.id, label: r.vendorName }));
    // return allVendors.map((vendor) => {
    //   return <option value={vendor.id} key={vendor.id}>{vendor.vendorName}</option>
    // })
  }

  onRowClick = (e, row, rowIndex) => {
    if (['a', 'button', 'svg'].indexOf(e.target.tagName.toLowerCase()) !== -1 || ['a', 'button', 'svg'].indexOf(e.target.parentElement.tagName.toLowerCase()) !== -1 || e.target.onClick) {
      e.stopPropagation();
      return;
    }

    history.push(`${this.props.url}/bills/${row.id}`);
  };

  _filter = (select, from) => {
    let query = { ...this.state.query };
    if (from === 'vendorId') {
      query.vendorId = select;
    } else if (from === 'startDate') {
      query.startDate = moment(select).format('YYYY-MM-DD');
    } else if (from === 'endDate') {
      query.endDate = moment(select).format('YYYY-MM-DD');
    } else {
      query = { startDate: '', endDate: '', vendorId: '' };
    }

    if (isEqual(Object.values(this.state.query), Object.values(query))) {
      return;
    }

    this.setState({ query }, () => {
      let queryString = '';
      if (query.vendorId) {
        queryString += `vendorId=${query.vendorId}&`;
      }
      if (query.startDate) {
        queryString += `startDate=${query.startDate}&`;
      }
      if (query.endDate) {
        queryString += `endDate=${query.endDate}`;
      }
      this.props.getAllBills(queryString)
    });
  };

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  closeRecordPayment = () => {
    this.setState({ selectedBill: undefined });
  };

  openRecordPayment = (bill) => {
    this.setState({ selectedBill: bill });
  };

  columns = getColumns(this.openRecordPayment);

  recordPayment = (payload, callback) => {
    const { selectedBill } = this.state;

    this.props.recordPayment(selectedBill.id, payload, () => {
      this.props.getAllBills();
      callback();
    });
  };

  renderContent() {
    const { loading, success, data = {} } = this.props.getAllBillsState;

    if (loading) {
      return (<CenterSpinner />);
    }

    if (!data || !data.bills || !data.bills.length) {
      return (
        <NoDataMessage
          title="bill"
          add={() => history.push('/app/purchase/bills/add')}
          filter={!data || !data.bills || !data.bills.length}
          secondryMessage="Add new bill which you have received from vendor."
        />
      );
    }

    return (
      <DataTableWrapper
        data={data ? data.bills || [] : []}
        columns={this.columns}
        defaultSorted={defaultSorted}
        hover={true}
        classes="py-table py-table--condensed"
        rowEvents={{ onClick: this.onRowClick }}
      />
    );
  }

  render() {
    const { loading, success, data } = this.props.getAllBillsState;
    const { query: { vendorId, startDate, endDate }, selectedBill } = this.state;

    return (
      <Fragment>
        <div className="content-wrapper__main">
          <header className="py-header--page">
            <div className="py-header--title">
              <h2 className="py-heading--title">Bills</h2>
            </div>

            <div className="py-header--actions">
              <Button onClick={() => history.push(`${this.props.url}/bills/add`)}
                className="btn btn-primary">Create a bill</Button>
            </div>
          </header>
          <div className="content">
            <div className="bill-filter__container">

              <div className="bill-filter__name">
                <SelectBox
                  type="select"
                  name="vendorId"
                  placeholder="All vendors"
                  value={vendorId}
                  onChange={(e) => this._filter(e ? e.value : '', 'vendorId')}
                  options={this.vendorsOption()}
                />
              </div>

              <div className="bill-filter__range">
                <DatepickerWrapper
                  className="form-control py-select--medium"
                  placeholderText='From'
                  name="startDate"
                  maxDate={endDate || undefined}
                  value={startDate}
                  onChange={(date) => this._filter(date, 'startDate')}
                />
                &nbsp;to&nbsp;
                <DatepickerWrapper
                  className="form-control"
                  placeholderText='To'
                  minDate={startDate || undefined}
                  value={endDate}
                  onChange={(date) => this._filter(date, 'endDate')}
                />
                <span className="fillter__action__btn" role="button" id="reset-btn"
                  onClick={() => this._filter(null, 'clear')}>

                    <ReactSVG
                      src="/assets/icons/ic_cancel.svg"
                      afterInjection={(error, svg) => {
                        if (error) {
                          console.error(error);
                          return
                        }
                        console.log(svg)
                      }}
                      beforeInjection={svg => {
                        svg.classList.add('py-icon')
                      }}
                      evalScripts="always"
                      fallback={() => <span>Error!</span>}
                      loading={() => <span>Loading</span>}
                      renumerateIRIElements={false}
                      className="py-icon"
                    />
                        </span>
                <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="reset-btn"
                  toggle={this.toggle}>
                  Reset dates
                </Tooltip>
              </div>
            </div>
            <div className="bill-list">
              {this.renderContent()}
            </div>
          </div>
        </div>
        <RecordPaymentModal onClose={this.closeRecordPayment} bill={selectedBill}
          businessInfo={this.props.businessInfo} recordPayment={this.recordPayment}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  getAllBillsState: state.getAllBills,
  businessInfo: state.businessReducer.selectedBusiness,
  allVendors: state.getAllVendors.data ? state.getAllVendors.data.vendors : [],
});

export default withRouter(connect(mapStateToProps, { getAllBills, getAllVendors, recordPayment })(Bills))
