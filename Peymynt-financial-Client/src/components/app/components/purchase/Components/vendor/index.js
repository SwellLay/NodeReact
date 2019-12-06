import { openGlobalSnackbar } from 'actions/snackBarAction';
import { deleteVendor, getAllVendors } from 'actions/vendorsAction'
import history from "customHistory";
import { StatusBadge } from 'global/StatusBadge';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  Table
} from 'reactstrap';
import { _documentTitle } from 'utils/GlobalFunctions';
import { DeleteModal } from 'utils/PopupModal/DeleteModal';
import ActionDropDown from '../../constants/ActionDropDown';
import { NoDataMessage } from '../../../../../../global/NoDataMessage';


class Vendor extends Component {
  state = {
    dropdownOpen: false,
    openConfirmationModal: false,
    selectedDeleteVendor: {},
  };

  componentDidMount() {
    const { businessInfo, getAllVendors } = this.props;
    getAllVendors();
    _documentTitle(businessInfo, "Vendors")
  }

  onDeleteConfirmation = (event, item) => {
    this.setState({
      openConfirmationModal: true,
      selectedDeleteVendor: item
    });
  };

  onCloseModal = () => {
    this.setState({
      openConfirmationModal: false,
      selectedDeleteVendor: {}
    });
  };

  onDeleteCall = () => {
    const { selectedDeleteVendor } = this.state;
    this.deleteVendor(selectedDeleteVendor.id)
  };

  deleteVendor = async (id) => {
    try {
      await this.props.deleteVendor(id);
      this.onCloseModal();
    } catch (err) {
      console.log("err delete vendor===>", err)
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.deleteVendorState !== nextProps.deleteVendorState) {
      if (nextProps.deleteVendorState.success) {
        this.props.getAllVendors();
        this.props.openGlobalSnackbar(nextProps.deleteVendorState.message, false)
      } else if (nextProps.deleteVendorState.error) {
        this.props.openGlobalSnackbar(nextProps.deleteVendorState.message, true)
      }
    }
  }

  onRowClick = (e, row, rowIndex) => {
    if (['a', 'button', 'svg'].indexOf(e.target.tagName.toLowerCase()) !== -1 || ['a', 'button', 'svg'].indexOf(e.target.parentElement.tagName.toLowerCase()) !== -1 || e.target.onClick) {
      e.stopPropagation();
      return;
    }

    history.push(`${this.props.url}/vendors/edit/${row.id}`);
  };

  vendorInfo(data) {
    const { nonUSBusiness } = this.props;
    const tableData = data.vendors.length ? data.vendors.map((item, i) => {
      return (
        <tr className="py-table__row" key={i} onClick={e => this.onRowClick(e, item, i)}>
          {nonUSBusiness ? null : (<td className="py-table__cell" style={{ textAlign: 'center' }}>
            <StatusBadge
              text={_.includes(item.vendorType, 'contractor') ? '1099 Contractor' : 'Vendor'}
              bgColor={_.includes(item.vendorType, 'contractor') ? '#b3e4f5' : "#c7d3dc"}
              textColor={_.includes(item.vendorType, 'contractor') ? '#11637e' : "#395260"}
              className="vendorStatus"
            />
          </td>)}
          <td className="py-table__cell">
            {item.vendorName}
            <br />
            <span className="py-text--hint">{item.firstName} {item.lastName}</span>
          </td>
          <td className="py-table__cell">{item.email}</td>
          {nonUSBusiness ? <td className="py-table__cell" style={{ width: '200px' }}>{item.phone}</td> : (
            <td className="py-table__cell" style={{ width: '200px' }}>
              {
                _.includes(item.vendorType, 'contractor') ?
                  item.isAccountAdded ?
                    <NavLink className="py-text--link"
                      to={`/app/purchase/vendors/${item.id}/bank-details`}>View bank details</NavLink> :
                    <NavLink className="py-text--link"
                      to={`/app/purchase/vendors/${item.id}/bank-details/edit`}>Add bank details</NavLink>
                  : <span className="py-text--hint">Not available</span>
              }
            </td>
          )}
          <td className="py-table__cell__action" style={{ width: '160px', whiteSpace: 'nowrap', textAlign: 'right' }}>
            <NavLink to={`/app/purchase/bills/add/${item.id}`} className="py-text--link">
              Create bill
            </NavLink>
            <ActionDropDown
              url={this.props.url}
              data={item}
              deleteVendor={this.onDeleteConfirmation}
            />
          </td>
        </tr>
      );
    }) : null;
    return tableData
  }

  renderVendors() {
    const { url, allVendors, nonUSBusiness } = this.props;
    const { loading, success, error, data } = allVendors;

    if (loading) {
      return (<div className="spinner-wrapper"><Spinner color="primary" size="md" className="loader" /></div>);
    }

    if (!success) {
      return null;
    }

    if (!data.vendors.length) {
      return (
        <NoDataMessage
          title="vendor"
          add={() => history.push('/app/purchase/vendors/add')}
          filter={false}
          secondryMessage="Create a new vendor, such as internet or utility providers, or independent contractors, and track their bills."
        />
        // <div className="text-center" style={{ marginTop: '10px' }}>
        //   <div className="py-heading--section-title">
        //     You do not have any vendors.
        //   </div>
        //   {!nonUSBusiness && (
        //     <p className="lead">Add vendors here, such as internet or utility providers, or independent contractors that
        //       require a 1099 tax form.</p>
        //   )}
        //   <NavLink to="/app/purchase/vendors/add" className="btn btn-primary mr-2">
        //     Add a Vendor
        //   </NavLink>
        // </div>
      );
    }

    return (
      <div className="vendor-list-table">
        <Table className="py-table py-table__hover py-table__v__center table-clean">
          <thead className="py-table__header">
          <tr className="py-table__row">
            {nonUSBusiness ? null : <th style={{ width: '156px' }}>Type</th>}
            <th className="py-table__cell">Name</th>
            <th className="py-table__cell">Email</th>
            {nonUSBusiness ? <th className="py-table__cell">Phone</th> :
              <th className="py-table__cell">Direct deposit</th>}
            <th className="py-table__cell__action">Actions</th>
          </tr>
          </thead>

          <tbody>
          {this.vendorInfo(data)}
          </tbody>
        </Table>
      </div>
    )
  }

  render() {
    const { url, allVendors, nonUSBusiness } = this.props;
    const { loading, success, error, data } = allVendors;

    return (
      <div className="content-wrapper__main vendorWrapper">
        <header className="py-header--page">
          <div className="py-header--title">
            <h2 className="py-heading--title">Vendors</h2>
          </div>

          <div className="py-header--actions ">
            <Dropdown className="mr-2" isOpen={this.state.dropdownOpen}
              toggle={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })}>
              <DropdownToggle className="btn btn-outline-primary" caret>
                Import from..
              </DropdownToggle>
              <DropdownMenu>
                <div className="dropdown-menu--body">
                  <DropdownItem onClick={() => history.push(`${url}/vendors/import-csv`)}>CSV</DropdownItem>
                </div>
              </DropdownMenu>
            </Dropdown>
            <Button onClick={() => history.push(`${url}/vendors/add`)} className="btn btn-primary">Add a
              vendor</Button>
          </div>
        </header>
        <div className="content">
          <Card className="shadow-box card-wizard">
            <CardBody>
              {this.renderVendors()}
            </CardBody>
          </Card>
        </div>
        <DeleteModal
          message={"Are you sure you want to delete this vendor?"}
          openModal={this.state.openConfirmationModal}
          onDelete={this.onDeleteCall}
          onClose={this.onCloseModal}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nonUSBusiness: state.businessReducer.selectedBusiness.country.id.toString() !== '231',
    allVendors: state.getAllVendors,
    businessInfo: state.businessReducer.selectedBusiness,
    deleteVendorState: state.deleteVendor,
  }
};

export default withRouter(connect(mapStateToProps, { getAllVendors, deleteVendor, openGlobalSnackbar })(Vendor))
