import React from 'react';
import {privacyPolicy , terms ,getstarted, security} from "../../utils/GlobalFunctions";
import { NavLink } from 'react-router-dom';

export const PoweredByLogo = props => (
        <div className="py-logo--powered-by--mono py-logo">
            <span className="py-logo--powered-by py-logo--small">
                Powered By  <NavLink to="/" className="font-bold">Peymynt</NavLink>
            </span>
        </div>
)

export const PoweredBy = props => (
    <div className="readonly_footer">
        <PoweredByLogo/>
        <div className="py-text py-text--small">
            Accounting Invoicing, and Payments for Entrepreneurs. <a onClick={() => getstarted()} href="#">Get Started </a>
        </div>
        <div className="py-text--hint">
            © 2019 Peymynt Financial Inc. <a onClick={() => privacyPolicy()} href="#">Privacy Policy</a> • <a onClick={() => terms()} href="#">Terms</a> • <a onClick={() => security()} href="#">Security</a>
        </div>
    </div>
)

export const PoweredByTerms = props => (
    <div className="public-checkout__footer">
        <PoweredByLogo/>
        <div className="ml-auto">
            <ul className="nav">
                <li className="nav-item">
                    <a onClick={() => terms()} href="#" className="nav-link py-text--link">Terms of Use
                        </a>
                </li>
                <li className="nav-item">
                    <span className="py-text--hint">.</span>
                </li>
                <li className="nav-item">
                    <a onClick={() => privacyPolicy()} href="#" className="nav-link  py-text--link">Privacy Policy</a>
                </li>
            </ul>
        </div>
    </div>
)