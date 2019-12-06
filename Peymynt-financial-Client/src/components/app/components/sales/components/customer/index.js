import history from 'customHistory'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { OverlayTrigger, Tooltip} from 'react-bootstrap';

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
import { bindActionCreators } from 'redux'
import { DeleteModal } from 'utils/PopupModal/DeleteModal';
import * as CustomerActions from '../../../../../../actions/CustomerActions';
import { _paymentMethodIcons } from '../../../../../../utils/GlobalFunctions';
import { NoDataMessage } from '../../../../../../global/NoDataMessage';

class Customer extends Component {
  state = {
    openConfimationModal: false,
    selectedDeleteCustomer: {},
    dropdownOpen: false,
    loading: false,
  };
  componentDidMount() {
    const { selectedBusiness } = this.props;
    document.title = selectedBusiness && selectedBusiness.organizationName ? `Peymynt - ${selectedBusiness.organizationName} - Customers` : `Peymynt - Customers`;
    this.fetchCustomers();
  }

  fetchCustomers() {
    setTimeout(this.setState({ loading: true }), 300);
    this.props.actions.fetchCustomers()
      .then(result => {
        // if (result) {
        setTimeout(() => {
          this.props.actions.resetAddCustomer();
        }, 2000);
        this.setState({ loading: false })
        // }
      });

  }
  succesStyle = {
    "background-color": "green"
  };

  onDeleteConfirmation = (event, item) => {
    this.setState({
      openConfimationModal: true,
      selectedDeleteCustomer: item
    });
  };

  onCloseModal = () => {
    this.setState({
      openConfimationModal: false,
      selectedDeleteCustomer: {}
    });
  };

  fetchCustomers() {
    setTimeout(this.setState({ loading: true }), 300);
    this.props.actions.fetchCustomers()
      .then(result => {
        // if (result) {
        setTimeout(() => {
          this.props.actions.resetAddCustomer();
        }, 2000);
        this.setState({ loading: false })
        // }
      });

  }

  onDeleteCall = () => {
    const { selectedDeleteCustomer } = this.state;
    this.deleteCustomer(selectedDeleteCustomer._id)
  };

  deleteCustomer = async (id) => {
    try {
      await this.props.actions.deleteCustomer(id);
      this.fetchCustomers();

    } catch (error) {
      console.error("----------delete customer error", error)
    }
    this.setState({ openConfimationModal: false })
  };

  onEditCustomer = (event, id, payment) => {
    event.preventDefault();
    history.push(`/app/sales/customer/edit/${id}?payment=${payment}`)
  };

  customersInfo() {
    const customers = this.props.customers;
    const { selectedBusiness } = this.props;
    console
    const tableData = customers.length ? customers.map((item, i) => {
      return (
        <tr className="py-table__row" key={i}>
          <td className="py-table__cell">
            {item.customerName}
            <span className="py-text--hint">{item.firstName} {' '} {item.lastName}</span>
          </td>
          <td className="py-table__cell">{item.email}</td>
          <td className="py-table__cell"> {item.communication ? item.communication.phone : ""}</td>
          {/* {selectedBusiness && selectedBusiness.country && selectedBusiness.country.id === 231 && */}
          <td className="py-table__cell">
            {item.cards && item.cards.length > 0 && item.cards.map((method, i) => {
              return (
                <OverlayTrigger
                key={i}
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-edit`}>
                    Ending in {method.cardNumber}
                        </Tooltip>
                }
              >
                <img 
                  src={process.env.WEB_URL.includes('localhost') ? `/${_paymentMethodIcons(method.brand)}` : _paymentMethodIcons(method.brand)}
                  style={{ width: '40px', paddingRight: '5px' }} />
                  </OverlayTrigger>
              )
            })}
          </td>
          {/* } */}
          <td className="py-table__cell__action">
            <div className="d-flex align-items-center">
              <OverlayTrigger
                key="top-edit"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-edit`}>
                    Edit
                        </Tooltip>
                }
              >
                <a onClick={e => this.onEditCustomer(e, item._id, false)}
                  href="javascript:void(0)" className="py-table__action py-icon"
                  data-toggle="tooltip"
                >
                  <svg viewBox="0 0 20 20" id="edit" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 13.836L16.586 6 14 3.414 6.164 11.25l2.586 2.586zm-1.528 1.3l-2.358-2.358-.59 2.947 2.948-.59zm11.485-8.429l-10 10a1 1 0 0 1-.51.274l-5 1a1 1 0 0 1-1.178-1.177l1-5a1 1 0 0 1 .274-.511l10-10a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414z"></path></svg>
                </a>
              </OverlayTrigger>
              {/* {selectedBusiness && selectedBusiness.country && selectedBusiness.country.id === 231 &&
                    ( */}
              <OverlayTrigger
                key="top-save"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-save`}>
                    Add a saved payment method
                        </Tooltip>
                }
              >
                <a onClick={e => this.onEditCustomer(e, item._id, true)}
                  href="javascript:void(0)" className="py-table__action py-icon"
                  data-toggle="tooltip"
                >
                  <svg viewBox="0 0 20 20" id="creditcard" xmlns="http://www.w3.org/2000/svg"><path d="M17 6v-.545A.455.455 0 0 0 16.545 5H3.5a.5.5 0 0 0-.5.5V6h14zm0 2H3v6.545c0 .251.204.455.455.455h13.09a.455.455 0 0 0 .455-.455V8zM3.5 3h13.045A2.455 2.455 0 0 1 19 5.455v9.09A2.455 2.455 0 0 1 16.545 17H3.455A2.455 2.455 0 0 1 1 14.545V5.5A2.5 2.5 0 0 1 3.5 3zM5 13a1 1 0 1 1 0-2h5a1 1 0 1 1 0 2H5z"></path></svg>
                </a>
              </OverlayTrigger>
              {/* )
                    } */}
              <OverlayTrigger
                key="top-delete"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-delete`}>
                   Delete
                  </Tooltip>
                }
              >
                <a href="javascript:void(0)" value={item} className="py-table__action py-table__action__danger  py-icon"
                  onClick={e => this.onDeleteConfirmation(e, item)}
                  data-toggle="tooltip"
                >
                  <svg viewBox="0 0 20 20" id="delete" xmlns="http://www.w3.org/2000/svg"><path d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"></path></svg>
                </a>
              </OverlayTrigger>
            </div>

          </td>
        </tr>
      );
    }) : null;
    return tableData
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  render() {
    const { openConfimationModal, loading } = this.state;
    const { selectedBusiness } = this.props;
    console.log("selectedBusiness", selectedBusiness)
    return (
      <div className="customerWrapper">
        <div className="content-wrapper__main">
          <header className="py-header--page">
            <div className="py-header--title">
              <h2 className="py-heading--title">Customers</h2>
            </div>

            <div className="ml-auto">
              <Dropdown className="d-inline-block mrR10" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle className="btn btn-outline-primary" caret>
                  Import from..
                                    </DropdownToggle>
                <DropdownMenu>
                  <div className="dropdown-menu--body">
                    <DropdownItem onClick={() => history.push('/app/sales/customer/csv')}>CSV</DropdownItem>
                  </div>
                </DropdownMenu>
              </Dropdown>
              <Button onClick={() => history.push('/app/sales/customer/add')} className="btn btn-primary btn-rounded">Add a customer</Button>
            </div>
          </header>
          <div className="content">
            <Card className="shadow-box  card-wizard">
              <CardBody>
                {
                  this.props.customers.length > 0 ?
                    (

                      <div className="table-responsive">
                        <Table className="py-table py-table__hover py-table__v__center">
                          <thead className="py-table__header">
                            <tr className="py-table__row">
                              <th className="py-table__cell">Name</th>
                              <th className="py-table__cell">Email</th>
                              <th className="py-table__cell">Phone</th>
                              {/* {selectedBusiness && selectedBusiness.country && selectedBusiness.country.id === 231 && */}
                              <th className="py-table__cell">Payment methods</th>
                              {/* } */}
                              <th className="py-table__cell__action">Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {
                              loading ?
                                <tr>
                                  <td colSpan='4' style={{ textAlign: 'center' }}>
                                    <Spinner color="primary" size="md" className="loader" />
                                  </td>
                                </tr>
                                :
                                this.customersInfo()
                            }
                          </tbody>


                        </Table>
                      </div>
                    )
                    : (<NoDataMessage
                      secondryMessage="Create a new customer and send them an invoice."
                      title="customer"
                      add={() => history.push('/app/sales/customer/add')}
                      filter={false}
                  />)
                }
              </CardBody>
            </Card>
          </div>
          <DeleteModal
            message={"Are you sure you want to delete this customer?"}
            openModal={openConfimationModal}
            onDelete={this.onDeleteCall}
            onClose={this.onCloseModal}
          />
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    customers: state.customerReducer.customers,
    isCustomerAdd: state.customerReducer.isCustomerAdd,
    isCustomerUpdate: state.customerReducer.isCustomerUpdate,
    selectedBusiness: state.businessReducer.selectedBusiness
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(CustomerActions, dispatch)
  };
};


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Customer)))
