import React, { Component, Fragment } from 'react';
import TimeAgo from 'react-timeago'
import { Button } from 'reactstrap';
import { fetchBankAccounts } from '../../../../../api/DashboardService';
import { toMoney } from '../../../../../utils/GlobalFunctions';


function TimeIcon() {
  return (
    <svg viewBox="0 0 20 20" className="py-icon" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(1 1)">
        <path
          d="M9 18A9 9 0 1 1 9 0a9 9 0 0 1 0 18zm0-2A7 7 0 1 0 9 2a7 7 0 0 0 0 14zm3.215-4.616a1.023 1.023 0 1 1-1.52 1.368L8.24 10.025a1.023 1.023 0 0 1-.263-.684V3.886a1.023 1.023 0 1 1 2.046 0v5.062l2.192 2.436z"
          id="dca" />
      </g>
    </svg>
  );
}

function Amount({ currency = {}, amount }) {
  return (
    <Fragment>
      {currency.code} {currency.symbol}{toMoney(amount)}
    </Fragment>
  );
}

function Account({ displayName, currency, amount }) {
  return (
    <div className="account-container">
      <span className="account--name">{displayName}</span>
      <span className="account--balance"><Amount currency={currency} amount={amount} /></span>
    </div>
  );
}

function Bank({ displayName, lastUpdated, accounts }) {
  return (
    <div className="bank-container">
      <h4 className="bank--name">{displayName}</h4>
      <div className="last-updated-container">
        <TimeIcon />&nbsp;Last updated
        &nbsp;<TimeAgo date={lastUpdated} className="bank--last-updated" />&nbsp;
        <a href="#">Update Now</a>
      </div>
      <div className="accounts-wrapper">
        {accounts.map((account) => (
          <Account {...account} key={account.displayName} />
        ))}
      </div>
    </div>
  );
}

class BankAccounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
    }
  }

  componentWillMount() {
    this.fetchBankAccounts();
  }

  async fetchBankAccounts() {
    this.setState({ loading: true });
    const { statusCode, data } = await fetchBankAccounts(this.props.limit);
    if (statusCode !== 200) {
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: false, data });
  }

  renderOptions() {
    const { data } = this.state;

    if (data && data.length) {
      return (
        <div className="manage-accounts-container">
          <a href="#">View and manage all connected accounts</a>
        </div>
      );
    }

    return (
      <Fragment>
        <div className="or-separator-container">
          <hr />
          <span className="text">or</span>
          <hr />
        </div>
        <div className="statement-link-container">
          <a href="#">Upload a bank statement</a>
        </div>
      </Fragment>
    );
  }

  render() {
    const { data } = this.state;
    return (
      <div className="widget-wrapper bank-widget">
        <div className="title-container">
          <h3 className="widget--title">Bank Accounts & Credit Cards</h3>
        </div>
        <div className="content-container">
          {data.map((row) => (
            <Bank {...row} key={row.displayName} />
          ))}
          <div className="add-bank-account-container">
            <Button className="btn btn-primary">Connect a Bank Account</Button>
          </div>
          {this.renderOptions()}
        </div>
      </div>
    );
  }
}

export default BankAccounts;
