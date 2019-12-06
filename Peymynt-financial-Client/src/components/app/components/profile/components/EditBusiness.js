import React, { Component } from 'react'
import { Form, FormGroup, Label, Col, Input, FormText } from 'reactstrap';
import { BusinessForm } from './BusinessForm';
import MiniSidebar from 'global/MiniSidebar'
import EditBusinessInfo from '../../BusinessInfo/EditBussiness'
export default class EditBusiness extends Component {
  render() {
    const { params } = this.props
    let lists = [
        {name: 'Personal Information', link: `/app/${params.userId}/accounts`},
        {name: 'Emails & Connected Accounts', link: `/app/${params.userId}/accounts/email-connected`},
        {name: 'Password', link: `/app/${params.userId}/accounts/password`},
        {name: 'Email Notification', link: `/app/${params.userId}/accounts/email-notification`},
        {name: 'Businesses', link: `/app/${params.userId}/accounts/business`, className:"active"}
    ]
    return (
        <div id="business-wrap" className="py-frame__page py-frame__settings has-sidebar">

                <MiniSidebar heading={'Profile'} listArray={lists}/>
            
                <div className="py-page__content">
                    <EditBusinessInfo {...this.props} />
                </div>
        </div>
    )
  }
}
