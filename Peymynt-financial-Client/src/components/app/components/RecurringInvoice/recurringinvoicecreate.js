import classnames from 'classnames';
import history from "customHistory";
import { cloneDeep } from "lodash";
import React, { Component, Fragment } from 'react';
import { Badge, Button, Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, Spinner } from 'reactstrap';
import DataTableWrapper from "utils/dataTableWrapper/DataTableWrapper";
import customerServices from "../../../../api/CustomerServices";
import { getRecurringInvoices, getRecurringInvoicesCount } from '../../../../api/RecurringService';
import { columns, defaultSorted, draftColumns } from "../../../../constants/recurringConst";

class RecurringInvoiceCreate extends Component {
    render() {
        return (
             <div className="content-wrapper__main__fixed">
               
                <div className="content">
                	<div className="recurring-wrapper">
                    	<div className="py-heading--pre-title"><center>Recurring invoices</center></div>
                    	<div className="py-heading--title"><center>Bill your repeat customers and get paid<br/>without lifting a finger.</center></div>
                    	<div><button className="py-button--primary" onClick={() => history.push('/app/recurring/add')}>Create a recurring invoice</button></div>

                    	<div className="row">
                    		<div className="col-md-4">
                    			<div className="recurring-list">
                    				<span><img src="/assets/icon-a1.png" alt="logo" /></span>
                    				<h2>Automatic payments</h2>
                    				<p>Charge your customer’s saved credit card automatically to get paid instantly.</p>
                    			</div>
                    		</div>
                    		<div className="col-md-4">
                    			<div className="recurring-list">
                    				<span><img src="/assets/icon-a2.png" alt="logo" /></span>
                    				<h2>Flexible scheduling</h2>
                    				<p>Fully customizable so your customers get your invoices exactly when you want.</p>
                    			</div>
                    		</div>
                    		<div className="col-md-4">
                    			<div className="recurring-list">
                    				<span><img src="/assets/icon-a3.png" alt="logo" /></span>
                    				<h2>Professional invoices</h2>
                    				<p>Create beautiful, branded invoices that your customers will love and trust.</p>
                    			</div>
                    		</div>
                    	</div>
                    </div>
                </div>
            </div>
        )
    }
}


export default RecurringInvoiceCreate