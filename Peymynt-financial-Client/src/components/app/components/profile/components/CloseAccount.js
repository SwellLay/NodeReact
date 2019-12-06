import React, { Component } from 'react'
import { Col } from 'reactstrap';
import {NavLink} from 'react-router-dom';

export default class CloseAccount extends Component {
  render() {
    return (
      <div className="closeWrp row">
        <Col xs={12} sm={12} md={12} lg={12}>
            <h3 className="py-heading--section-title">Close Your Account</h3>
            <p  className="py-text">
                Click the button below to delete your entire Peymynt account. 
                <b>This means you will no longer be able to access your businesses, accounting and payroll records, and personal financial information.</b>
                For example, you will lose access to your payroll tax forms and your employees will lose access to pay stubs.
            </p>
            <p>This action cannot be undone.</p>
            <NavLink to="/closeaccount">
              <button className="btn btn-outline-danger ">Close This Peymynt Account</button>
            </NavLink>
        </Col>
      </div>
    )
  }
}
