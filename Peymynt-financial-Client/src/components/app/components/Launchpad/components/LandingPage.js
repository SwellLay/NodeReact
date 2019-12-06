import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class LandingPage extends Component {
  render() {
    return (
      <div className="launchpad-wrapper">
        <div className="content-wrapper__main__fixed">
          <div className="page-header">
            <h2 className="heading">What do you want to achieve today?</h2>
            <h3 className="sub-heading">Choose a starting point and we’ll guide you through the best steps to take.</h3>
          </div>

          <div className="content">
            <NavLink to="/app/launchpad/invoicing" className="item">
              <img src={`${process.env.CDN_URL}/static/web-assets/launchpad_invoice.svg`} />
              <span className="label">Professional invoicing</span>
              <span className="description">Create customizable documents that get you paid faster</span>
            </NavLink>

            <NavLink to="/app/launchpad/bookkeeping" className="item">
              <img src={`${process.env.CDN_URL}/static/web-assets/launchpad_accounting.svg`} />
              <span className="label">Better bookkeeping</span>
              <span className="description">Automatically sync transactions for deeper insights</span>
            </NavLink>

            <NavLink to="/app/launchpad/payroll" className="item">
              <img src={`${process.env.CDN_URL}/static/web-assets/launchpad_payroll.svg`} />
              <span className="label">Reliable payroll</span>
              <span className="description">Pay employees and payroll taxes without complications</span>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}
