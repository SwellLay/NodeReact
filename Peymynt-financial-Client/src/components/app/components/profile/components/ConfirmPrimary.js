import React, { Component } from 'react'
import { Col } from 'reactstrap';
import MiniSidebar from 'global/MiniSidebar'
import { NavLink } from 'react-router-dom';

export default class ConfirmPrimary extends Component {
  render() {
    const { params, info, _cancelPrimary, _setPrimary } = this.props;
        let lists = [
            {name: 'Personal Information', link: `/app/${params.userId}/accounts`},
            {name: 'Emails & Connected Accounts', link: `/app/${params.userId}/accounts/email-connected`},
            {name: 'Password', link: `/app/${params.userId}/accounts/password`},
            {name: 'Email Notification', link: `/app/${params.userId}/accounts/email-notification`},
            {name: 'Businesses', link: `/app/${params.userId}/accounts/business`, className: 'active'}
    ]
    return (
        <div className="row">
            <Col sm={12}>
                <p>Are you sure you want to set <b>{info.organizationName}</b> as your default business?</p>
            </Col>
            <Col sm={12}>
                <button className="btn btn-primary"
                    onClick={e => _setPrimary(e, info._id)}
                > Yes, Make it the default business</button>
                <a className="ml-2 py-text--link" href="javascript: void(0)" onClick={e => _cancelPrimary(e)}>No, Cancel</a>
            </Col>
        </div>
    )
  }
}
