import { parse } from 'query-string';
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { _documentTitle } from 'utils/GlobalFunctions';
import BankAccounts from './BankAccounts';
import CashFlow from './CashFlow';
import ExpenseBreakdown from './ExpenseBreakdown';
import NetIncome from './NetIncome';
import Overdue from './Overdue';
import PayableOwing from './PayableOwing';
import ProfitLoss from './ProfitLoss';
import ThingsToDo from './ThingsToDo';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      limit: this.parseLimit(props),
    };
  }

  componentWillReceiveProps(props) {
    let limit = this.parseLimit(props);

    if (this.state.limit !== limit) {
      this.setState({ limit });
    }
  }

  componentDidMount() {
    const { businessInfo } = this.props;
    _documentTitle(businessInfo, 'Dashboard');
  }

  parseLimit(props) {
    const { location: { search } } = props;
    const params = parse(search.substring(1));
    let limit = parseInt(params.limit || 'a');

    if (isNaN(limit)) {
      limit = undefined;
    }

    return limit;
  }

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  render() {
    const { limit } = this.state;
    return (
      <Fragment>
        <div className="content-wrapper__main dashboard-wrapper">
          <header className="py-header--page">
            <div className="py-header--title">
              <h2 className="py-heading--title">Dashboard</h2>
            </div>

            <div className="py-header--actions">
              <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle caret className="btn btn-primary">
                  Create a new
                </DropdownToggle>
                <DropdownMenu>
                  <div className="dropdown-menu--body">
                  <DropdownItem><NavLink to="/app/estimates/add">Estimate</NavLink></DropdownItem>
                  <DropdownItem><NavLink to="/app/invoices/add">Invoice</NavLink></DropdownItem>
                  <DropdownItem><NavLink to="/app/recurring/add">Recurring Invoice</NavLink></DropdownItem>
                  <DropdownItem><NavLink to="/app/purchase/bills/add">Bill</NavLink></DropdownItem>
                  <DropdownItem><NavLink to="/app/sales/customer/add">Customer</NavLink></DropdownItem>
                  <DropdownItem><NavLink to="/app/purchase/vendors/add">Vendor</NavLink></DropdownItem>
                  <DropdownItem><NavLink to="/app/sales/products/add">Product or Service</NavLink></DropdownItem>
                  </div>
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </header>
          <div className="content">
            <div className="activity-wrapper">
              <Overdue limit={limit} />
              <BankAccounts limit={limit} />
              <ThingsToDo limit={limit} />
            </div>
            <div className="financial-wrapper">
              <CashFlow limit={limit} />
              <ProfitLoss limit={limit} />
              <PayableOwing limit={limit} />
              <NetIncome limit={limit} />
              <ExpenseBreakdown limit={limit} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    businessInfo: state.businessReducer.selectedBusiness
  };
};

// export default Home
//  withStyles(styles)(Home);

// const mapDispatchToProps = (dispatch) => {
//     return {
//         actions: bindActionCreators(CustomerActions, dispatch)
//     };
// }

export default withRouter((connect(mapStateToProps, null)(Home)))
