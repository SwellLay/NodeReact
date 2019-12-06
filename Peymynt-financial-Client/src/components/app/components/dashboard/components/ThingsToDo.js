import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class ThingsToDo extends Component {
  render() {
    return (
      <div className="widget-wrapper things-to-do-widget">
        <div className="title-container">
          <h3 className="widget--title">Things You Can Do</h3>
        </div>
        <ul className="todos">
          <li><NavLink to="/app/sales/customer/add">Add a customer</NavLink></li>
          <li><NavLink to="/app/purchase/vendors/add">Add a vendor</NavLink></li>
          <li><NavLink to="/app/setting/invoice-customization">Customize your invoices</NavLink></li>
          <li><NavLink to="#">Invite a guest collaborator</NavLink></li>
        </ul>
      </div>
    );
  }
}

export default ThingsToDo;
