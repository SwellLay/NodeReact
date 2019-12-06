import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';

export default class Sidebar extends Component {
  render() {
    return (
      <aside className="py-page__sidebar">
        <div className="py-nav__sidebar">
          <h5 className="py-nav__heading">Settings</h5>
          <ul className="py-nav__section">
            <li className="title">Sales</li>
            <li>
              <NavLink className="nav-link" activeClassName='is-active' to='/app/setting/invoice-customization'>Invoice Customization</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" activeClassName='is-active' to='/app/setting/payments'>Payments</NavLink>
            </li>
          </ul>
          <ul className="py-nav__section">
            <li className="title">Purchases</li>
            <li>
              <NavLink className="nav-link" activeClassName='is-active' to='/app/setting/receipts'>Receipts</NavLink>
            </li>
          </ul>
        </div>

      </aside>
    )
  }
}
