import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchOverdueBills, fetchOverdueInvoices } from '../../../../../api/DashboardService';
import { toMoney } from '../../../../../utils/GlobalFunctions';

function Amount({ currency = {}, amount }) {
  return (
    <Fragment>
      {currency.symbol}{toMoney(amount)}
    </Fragment>
  );
}

class Overdue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      bills: [],
      invoices: [],
    }
  }

  componentWillMount() {
    this.fetchBills();
    this.fetchInvoices();
  }

  async fetchBills() {
    this.setState({ loading: true });
    const { statusCode, data } = await fetchOverdueBills(this.props.limit);
    if (statusCode !== 200) {
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: false, bills: data });
  }

  async fetchInvoices() {
    this.setState({ loading: true });
    const { statusCode, data } = await fetchOverdueInvoices(this.props.limit);
    if (statusCode !== 200) {
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: false, invoices: data });
  }

  renderBills() {
    const { bills } = this.state;
    if (!bills.length) {
      return null;
    }
    return (
      <div className="list-container">
        <h5 className="list-title">Overdue Bills</h5>
        <ul className="list">
          {bills.map((bill) => (
            <li><NavLink to={`/app/purchase/bills/${bill.idToOpen}`}>{bill.displayName}</NavLink>, <Amount
              currency={bill.currency} amount={bill.amount} /></li>
          ))}
        </ul>
        <div className="see-all-container">
          <NavLink to="/app/purchase/bills">See all bills</NavLink>
        </div>
      </div>
    )
  }

  renderInvoices() {
    const { invoices } = this.state;
    if (!invoices.length) {
      return null;
    }
    return (
      <div className="list-container">
        <h5 className="list-title">Overdue Invoices</h5>
        <ul className="list">
          {invoices.map((invoice) => (
            <li><NavLink to={`/app/purchase/bills/${invoice.idToOpen}`}>{invoice.displayName}</NavLink>, <Amount
              currency={invoice.currency} amount={invoice.amount} /></li>
          ))}
        </ul>
        <div className="see-all-container">
          <NavLink to="/app/invoices">See all overdue invoices</NavLink>
        </div>
      </div>
    )
  }


  render() {
    const { invoices, bills } = this.state;
    if (!(invoices.length + bills.length)) {
      return null;
    }

    return (
      <div className="widget-wrapper overdue-widget">
        <div className="title-container">
          <h3 className="widget--title">Overdue Invoices & Bills</h3>
        </div>
        <div className="content-container">
          {this.renderInvoices()}
          <hr />
          {this.renderBills()}
        </div>
      </div>
    );
  }
}

export default Overdue;
