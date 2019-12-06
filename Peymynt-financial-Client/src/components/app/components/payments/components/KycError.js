import React from 'react';
import { Row, Col } from 'reactstrap'
export const KycError = props => {
    return (
        <div className="content-wrapper__main__fixed text-center">
            <div className="py-status-page">
            <div className="py-box">
                <div className="py-box--content">
                    <h1 className="py-heading--title">We need to talk</h1>
                    <div className="py-heading--subtitle">
                    Looks like we're having difficulty verifying a few things. 
                    <br/>
                    <br/>
                        You should have received an email from our Account Management Team. The fastest way to resolve this is to respond to that email directly with all of the requested information at your earliest convenience.
                    <br />
                    <br />
                    If you have not yet received an email from our Account Management Team, please reach out to our Peymynt Support Team <a href="javascript: void(0)" className="py-text--link-external">here</a>.
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}