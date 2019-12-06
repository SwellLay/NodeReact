import React, { Component, Fragment } from 'react'
import { RecieptHeader } from './RecieptHeader';
import { RecieptFooter } from './RecieptFooter';
import { RecieptPreview } from './RecieptPreview';

import { Alert, Row, Col } from 'reactstrap';
import { RecieptWebPreview } from './RecieptWebPreview';
export default class RecieptWrapper extends Component {
    componentDidMount(){
        const { invoiceData: {businessId} } = this.props
        console.log("busin", businessId)
        document.title = `Peymynt - ${businessId && businessId.organizationName} - Receipt`
    }
    render() {
        const { pathname } = this.props.location
        console.log("propr", this.props)
        return (
            <div className="reciept-container Receipt">
                { pathname.includes('readonly') ?
                    <RecieptHeader {...this.props}/> :
                    <Row className="justify-content-center no-gutters mt-5">
                        <Col md={6}>
                        <div className="py-notify py-notify--info m-0">
                            <div className="py-notify__icon-holder">
                                <svg className="py-icon" viewBox="0 0 20 20" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
                            </div>
                            <div className="py-notify__content-wrapper">
                                <div className="py-notify__content">
                                    This is a preview of the email that your customer will see.
                                </div>    
                                <div className="py-notify__action">
                                    <button
                                    onClick={() => {
                                    window.close();
                                    }}
                                    className="btn">
                                    {" "}
                                    Close this tab{" "}
                                </button>
                                </div>
                            </div>
                        </div>
                        </Col>
                    </Row>
                }
                {
                    pathname.includes('readonly') ?
                    <RecieptPreview {...this.props}/>
                    : <RecieptWebPreview {...this.props}/>
                }
                <RecieptFooter {...this.props}/>
            </div>
        )
    }
}
