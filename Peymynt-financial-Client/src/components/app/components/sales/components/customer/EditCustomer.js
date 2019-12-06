import classnames from "classnames";
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { bindActionCreators } from 'redux'
import * as CustomerActions from '../../../../../../actions/CustomerActions';
import { openGlobalSnackbar } from '../../../../../../actions/snackBarAction';

import CustomerForm from './CustomerForm'
import CustomerPayment from './CustomerPayment';

class EditCustomer extends PureComponent{

  state = {
    activeTab: 'personal'
  };

  componentDidMount(){
    const { selectedBusiness, businessInfo, location } = this.props;
    document.title = selectedBusiness && selectedBusiness.organizationName ? `Peymynt - ${selectedBusiness.organizationName} - Edit a customer` : `Peymynt - Edit a customer`;
    // this.fetchCustomerData();
    console.log('this.props.', this.props);
    if (location.search.includes('true')) {
      this.setState({ activeTab: 'payment' });
      this.fetchData('payment')
    } else
      this.fetchData('personal')
  }

  fetchCustomerData=()=>{
    const customerId = this.props.match.params.id;
    this.props.actions.fetchCustomerById(customerId)
  };

  deleteCard = (cardId) => {
    const customerId = this.props.match.params.id;
    this.props.actions.deleteCustomerCard(customerId, cardId)
  };

  fetchCustomerPayments = () => {
    const customerId = this.props.match.params.id;
    this.props.actions.fetchAllCustomerCards(customerId)
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      }, () => this.fetchData(tab));
    }
  };

  fetchData = tab => {
    if (tab === 'personal') {
      this.fetchCustomerData();
    } else {
      this.fetchCustomerPayments()
    }
  };

  render() {
    console.log("all cards", this.props);
    return (
      <div className="content-wrapper__main__fixed">
        <header className="py-header--page">
          <div className="py-header--title">
             <h2 className="py-heading--title">Edit a customer</h2>
          </div>
        </header>
        <div className="content">
          <Nav className="py-nav--tabs" tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "personal"
                })}
                onClick={() => {
                  this.toggleTab("personal");
                }}
                >
                Personal info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "payment"
                })}
                onClick={() => {
                  this.toggleTab("payment");
                }}
              >
                Payment methods
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent
            className="tab-container p-0 mrT30"
            activeTab={this.state.activeTab}
          >
            <TabPane tabId="personal" className="tab-panel">
              <CustomerForm isEditMode={true} {...this.props} />
            </TabPane>
            <TabPane tabId="payment" className="tab-panel">
              <CustomerPayment
                cardsData={this.props.allCards}
                deleteCard={this.deleteCard.bind(this)}
                deleteCardData={this.props.deletedCard}
                showSnackBar={(message, error) => this.props.showSnackbar(message, error)}
                id={this.props.match.params.id}
                fetchCards={() => this.fetchCustomerPayments()}
              />
            </TabPane>
          </TabContent>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(CustomerActions, dispatch),
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    }
  };
};
const mapStateToProps = state => {
  return {
    selectedBusiness: state.businessReducer.selectedBusiness,
    allCards: state.getAllCards,
    deletedCard: state.deleteCards
  };
};


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(EditCustomer)))

