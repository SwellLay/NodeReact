import React, { Component,Fragment } from 'react'

export default class PaymentPopover extends Component {
    render() {
        const { invoiceData } = this.props
        return (
            <Fragment>
                <button className="py-popup-close" onClick={this.props.toggle}>
                <i className="fa fa-close"/></button>
                <div className="py-popup-content-wrapper">
                    <div className="changePref">
                        <div className="text-center" style={{padding: '30px 0'}}>
                            <img src="/assets/icon-a1.png"/>
                        </div>
                        <p>{invoiceData && invoiceData.remarks}</p>
                        <p>Online payments can be enabled only for invoices created in USD.</p>
                    </div>
                </div>
            </Fragment>
        )
    }
}
