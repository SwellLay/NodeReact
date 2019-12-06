import classnames from 'classnames';
import history from "customHistory";
import { cloneDeep } from "lodash";
import React, { Component, Fragment } from 'react';
import { Badge, Button, Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, Spinner } from 'reactstrap';
// eslint-disable-next-line no-unused-vars
import DataTableWrapper from "utils/dataTableWrapper/DataTableWrapper";
import customerServices from "../../../../api/CustomerServices";
import { getAllRecurringInvoices, getRecurringCounts } from '../../../../actions/recurringInvoiceActions';
import { columns, defaultSorted, draftColumns, columnsAll } from "../../../../constants/recurringConst";
import RecurringInvoiceCreate from "./recurringinvoicecreate";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SelectBox from '../../../../utils/formWrapper/SelectBox';
import CenterSpinner from '../../../../global/CenterSpinner';
import { NoDataMessage } from '../../../../global/NoDataMessage';
import RecurringInIt from './RecurringInIt';

class RecurringInvoice extends Component {
    state = {
        activeTab: 'active',
        tooltipOpen: false,
        dropdownOpen: false,
        limit: 100,
        offset: 0,
        data: [],
        customerList: [],
        selectedCustomer: undefined,
        selectedStatus: undefined,
        invoiceData: [],
        invoiceCount: {
            draft: 0,
            active: 0,
            total: 0
        },
        filterData: {
            status: undefined,
            customer: "",
            startDate: undefined,
            endDate: undefined,
            invoiceNumber: undefined
        },
        loading: false,
        hideEnable: false
    }

    componentWillMount(){
         const { businessInfo } = this.props;
        document.title = businessInfo && businessInfo.organizationName ? `Peymynt - ${businessInfo.organizationName} - Recurring Invoices` : `Peymynt - Recurring Invoices`;

        let queryString = `tab=${this.state.activeTab}`;
        this.fetchInvoices(queryString);
        this.fetchInvoicesCount(queryString);
      this.fetchCustomersList();
    }



    componentDidUpdate(prevProps) {
        const { updateData } = this.props;
        if (prevProps.updateData !== updateData) {
            let queryString = `tab=${this.state.activeTab}`;
            this.fetchInvoices(queryString);
            this.fetchInvoicesCount(queryString);
            this.fetchCustomersList();
        }
    }

    fetchInvoices = async queryString => {
        const { limit, offset } = this.state;
        this.setState({ loading: true })
        this.props.getAllRecurringInvoices(queryString);
        // if(response.data.invoices.length > 0){
        //     this.setState({ invoiceData: response.data.invoices, loading: false });
        // }
    };

    fetchInvoicesCount = async queryString => {
        console.log("In fetch count");
        let { filterData, invoiceCount, activeTab } = this.state;
        this.setState({ loading: true })
        this.props.getRecurringCounts(queryString);
        // const invoiceCountResponse = response.data.invoiceCount;
        // this.setState({ invoiceCount: invoiceCountResponse, loading: false, hideEnable: true });
    };

    fetchCustomersList = async () => {
        this.setState({ loading: true })
        const customerList = (await customerServices.fetchCustomers()).data
            .customers;
        this.setState({ customerList, loading: false });
    };

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                invoiceData: []
            }, () => this.filterInvoiceData(false));
        }
    };

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }


    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    addInvoice = () => {
        history.push("/app/recurring/add");
    };

    handleSelectChange = (selectedOption, type) => {
        let filterData = cloneDeep(this.state.filterData);
        if (type === "customer") {
          filterData.customer = (selectedOption && selectedOption._id) || "";
          this.setState({ selectedCustomer: selectedOption });
        }
        this.setState({ filterData }, () => this.filterInvoiceData(true));
    };

    filterInvoiceData = async (from) => {
        let filterQuery = cloneDeep(this.state.filterData);
        const { activeTab } = this.state;
        let { customer } = filterQuery;
        let queryString = "";
        let countFilter = "";
        if (activeTab) {
          queryString = queryString.length > 0 ? `tab=${activeTab}` : `&tab=${activeTab}`;
        }

        if (customer) {
          queryString +=
            queryString === "" ? `customer=${customer}` : `&customer=${customer}`;
          countFilter +=
            countFilter === "" ? `customer=${customer}` : `&customer=${customer}`;
        }
        this.fetchInvoices(queryString);
        if(from){
            this.fetchInvoicesCount(countFilter);
        }
    };

    render() {
        const { hideEnable, customerList, selectedCustomer, activeTab } = this.state;
        const { invoiceCount, allRecurring } = this.props;
        const { loading, success, data } = allRecurring
        let invoiceData = [];
        if(success){
            invoiceData = data.invoices
        }
        console.log("recurring", invoiceCount)
        if(hideEnable && invoiceCount.total == 0)
        {
            return(
                <div>
                    <RecurringInvoiceCreate/>
                </div>
            )
        }
        else{
            return (
                <div className="content-wrapper__main">
                    {
                        (invoiceData.length <= 0 && invoiceCount.total <= 0) && !loading ?
                        (<RecurringInIt/>)
                        : (
                            <Fragment>

                                <div className="invoice-header">
                                    <header className="py-header--page">
                                        <div className="py-header--title">
                                            <h2 className="py-heading--title"> Recurring invoices </h2>
                                        </div>
                                        <div className="py-header--actions">
                                            <Button onClick={() => history.push('/app/recurring/add')} className="btn btn-primary">Create a recurring invoice</Button>
                                        </div>
                                    </header>
                                </div>

                                <div className="recurring-invoice-list-table-filters--container">
                                    <SelectBox
                                    placeholder="All customers"
                                    valueKey={"_id"}
                                    labelKey={"customerName"}
                                    value={selectedCustomer}
                                    className="py-select--medium"
                                    onChange={cust =>
                                        this.handleSelectChange(cust, "customer")
                                    }
                                    options={customerList}
                                    isClearable
                                    />
                                </div>
                                <div>
                                    <Row>
                                        <Col xs={12}>
                                            <Nav tabs className="py-nav--tabs">
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active: this.state.activeTab === 'active'
                                                        })}
                                                        onClick={() => {
                                                            this.toggleTab('active');
                                                        }}
                                                    >
                                                        Active
                                                        <Badge className="badge-circle">
                                                            {invoiceCount.active}
                                                        </Badge>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: this.state.activeTab === 'draft' })}
                                                        onClick={() => { this.toggleTab('draft'); }}>
                                                        Draft
                                                        <Badge className="badge-circle mrL5">
                                                            {invoiceCount.draft}
                                                        </Badge>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: this.state.activeTab === 'all' })}
                                                        onClick={() => { this.toggleTab('all'); }}>
                                                        All recurring invoices
                                                        <Badge className="badge-circle mrL5">
                                                            {invoiceCount.total}
                                                        </Badge>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                            <TabContent activeTab={this.state.activeTab} className="tab-container pd0" >
                                                <TabPane tabId="active" className="tab-panel">

                                                    <div className="recurring-list-table">
                                                    {invoiceData.length > 0 ? (
                                                        <div className="py-table--condensed">
                                                            <DataTableWrapper
                                                                data={invoiceData}
                                                                columns={columns}
                                                                defaultSorted={defaultSorted}
                                                                from={'recurring'}
                                                            />
                                                        </div>
                                                    ) : loading ?
                                                            (<CenterSpinner color="primary" size="md" className="loader" />) :
                                                            (<NoDataMessage
                                                                title={'recurring invoice'}
                                                                filter = {activeTab!=='active'}
                                                                add={this.addInvoice}
                                                            />) }
                                                            </div>
                                                </TabPane>
                                                <TabPane tabId="draft" className="tab-panel">
                                                    <div className="recurring-list-table">
                                                    {invoiceData.length > 0 ? (<div className="py-table--condensed">
                                                        <DataTableWrapper
                                                            data={invoiceData}
                                                            columns={draftColumns}
                                                            defaultSorted={defaultSorted}
                                                            from='recurring'
                                                        />
                                                    </div>) : (
                                                        loading ?
                                                        (<CenterSpinner color="primary" size="md" className="loader" />) :
                                                        (<NoDataMessage
                                                            title={'recurring invoice'}
                                                            filter = {activeTab!=='active'}
                                                            add={this.addInvoice}
                                                        />)
                                                        )}
                                                        </div>
                                                </TabPane>
                                                <TabPane tabId="all">
                                                    <div className="recurring-list-table">

                                                    {
                                                        invoiceData.length > 0 ? (
                                                            <div className="py-table--condensed">
                                                                <DataTableWrapper
                                                                    data={invoiceData}
                                                                    columns={columnsAll}
                                                                    defaultSorted={defaultSorted}
                                                                    from='recurring'
                                                                />
                                                            </div>
                                                        ):
                                                        loading ?
                                                            (<CenterSpinner color="primary" size="md" className="loader" />) :
                                                            (<NoDataMessage
                                                                title={'recurring invoice'}
                                                                filter = {activeTab!=='active'}
                                                                add={this.addInvoice}
                                                            />)
                                                        }
                                                    </div>
                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                    </Row>
                                </div>
                            </Fragment>
                        )
                    }

                </div>
            )
        }
    }
}

const mapStateToProps = ({ snackbar, settings, businessReducer, getAllRecurring, getAllRecurringCount }) => ({
    businessInfo: businessReducer.selectedBusiness,
    invoiceCount: getAllRecurringCount.success ? getAllRecurringCount.data.invoiceCount : {},
    allRecurring: getAllRecurring
});

export default withRouter(
    connect(
        mapStateToProps,
        {getRecurringCounts, getAllRecurringInvoices}
    )(RecurringInvoice)
);