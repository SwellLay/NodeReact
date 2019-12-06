import React, { Component, Fragment } from 'react';
import { fetchOwingBills, fetchPayableInvoices } from '../../../../../api/DashboardService';
import { toMoney } from '../../../../../utils/GlobalFunctions';

function Amount({ currency = {}, amount }) {
  return (
    <Fragment>
      {currency.symbol}{toMoney(amount)}
    </Fragment>
  );
}

class PayableOwing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      payables: [],
      owings: [],
    }
  }

  componentWillMount() {
    this.fetchPayables();
    this.fetchOwings();
  }

  async fetchPayables() {
    this.setState({ loading: true });
    const { statusCode, data: { data } } = await fetchPayableInvoices(this.props.limit);
    if (statusCode !== 200) {
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: false, payables: data });
  }

  async fetchOwings() {
    this.setState({ loading: true });
    const { statusCode, data: { data } } = await fetchOwingBills(this.props.limit);
    if (statusCode !== 200) {
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: false, owings: data });
  }

  renderPayable() {
    const { payables } = this.state;

    return (
      <table>
        <thead>
        <tr>
          <th colSpan={2}>Invoices payable to you</th>
        </tr>
        </thead>
        <tbody>
        {payables.map((row, i) => (
          <tr key={row.displayName}>
            <td>{row.displayName}</td>
            <td><Amount currency={row.currency} amount={row.amount} /></td>
          </tr>
        ))}
        </tbody>
      </table>
    )
  }

  renderOwings() {
    const { owings } = this.state;

    return (
      <table>
        <thead>
        <tr>
          <th colSpan={2}>Bills you owe</th>
        </tr>
        </thead>
        <tbody>
        {owings.map((row, i) => (
          <tr key={row.displayName}>
            <td>{row.displayName}</td>
            <td><Amount currency={row.currency} amount={row.amount} /></td>
          </tr>
        ))}
        </tbody>
      </table>
    )
  }

  render() {
    if (!this.state.payables.length && !this.state.owings.length) {
      return null;
    }
    return (
      <div className="widget-wrapper payable-owing-widget">
        <div className="title-container">
          <h3 className="widget--title">Payable & Owing</h3>
        </div>
        <div className="tables-container">
          {this.renderPayable()}
          {this.renderOwings()}
        </div>
      </div>
    );
  }
}

export default PayableOwing;
