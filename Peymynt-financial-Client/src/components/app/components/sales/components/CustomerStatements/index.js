import React, { PureComponent, Fragment } from "react";
import {
    Badge,
    InputGroup,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    InputGroupAddon,
    Card,
    CardBody,
    Button,
    Col,
    Input,
    Container,
    Label,
    CustomInput,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    ListGroup,
    ListGroupItem,
    Table,
    Alert,
    Spinner,
    Row
} from "reactstrap";
import classnames from "classnames";
import history from 'customHistory'
import { cloneDeep } from "lodash";
import SelectBox from "utils/formWrapper/SelectBox";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import DataTableWrapper from "utils/dataTableWrapper/DataTableWrapper";
import { fetchCustomerStatements } from "../../../../../../api/CustomerStatementServices";
import * as CustomerStatementActions from '../../../../../../actions/CustomerStatementActions';
import { columns, defaultSorted, INVOICE_STATUS_FILTER } from "../../../../../../constants/invoiceConst";
import customerServices from "../../../../../../api/CustomerServices";
import { convertDate, toDollar, getDateMMddyyyy, getDateyyyymmdd, getStatementShareBaseURL, getInvoiceFilterQuery } from '../../../../../../utils/common';
import StatementView from './StatementView';
import MailStatement from "./MailStatement";
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { openGlobalSnackbar } from '../../../../../../actions/snackBarAction';
import { statementMailMessage } from "../helpers";

class CustomerStatements extends PureComponent {

    constructor(props) {
        super(props);

        const today = new Date();
        this.state = {
            customerList: [],
            isLoadingStatement: false,
            isGeneratingPublicUrl: false,
            invoicesStatementData: {},

            selectedCustomer: null,
            selectedStatus: undefined,
            filterData: {
                customer: "",
                startDate: new Date(today.setDate(today.getDate()-30)),
                endDate: new Date()
            },
            dropdownOpen: false,
            visible: true,
            isShowUndepaid: true,
            openMail: false,
            statmentPublicUrl: '',
            selectedBusiness: {},
        };

        this.onDismiss = this.onDismiss.bind(this);
    }


    componentDidMount() {
        const { selectedBusiness } = this.props;

        document.title = selectedBusiness && selectedBusiness.organizationName ? `Peymynt - ${selectedBusiness.organizationName} - Customer Statements` : `Peymynt-Customer Statements`;
        this.fetchCustomersList();
        if (localStorage.getItem('isStatementVisible') === 'No') {
            this.onDismiss();
        }
    }

    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));

        if(this.state.dropdownOpen == false){
            let filterQuery = cloneDeep(this.state.filterData);
            let { startDate, endDate, customer } = filterQuery;
            var filterQueryData = getInvoiceFilterQuery(customer, startDate, endDate, this.state.isShowUndepaid);
            this.generateStatmentPublicUrl(filterQueryData, false);
        }
    }

    toggleShowUnpaidChange = (evt) => {
        const checked = evt.target.checked;
        this.setState({
            isShowUndepaid: checked,
        });
        this.setState({ statmentPublicUrl: '' });
        setTimeout(() => {
            this.filterInvoiceData(checked);
        }, 500);
    }

    onDismiss() {
        localStorage.setItem('isStatementVisible', 'No');
        this.setState({ visible: false });
    }

    generateStatmentPublicUrl = async (filterQueryData, isRedirect) => {
        if(!this.state.statmentPublicUrl){
            const response = await this.props.actions.generateStatement(filterQueryData);
            if(response && response.payload){
                const statement = response.payload.statement;
                this.setState({ statmentPublicUrl: getStatementShareBaseURL() + statement.uuid });

                if(isRedirect){
                    this.setState({isGeneratingPublicUrl: false});
                    window.open(this.state.statmentPublicUrl, '_blank');
                }
            }
        } else if(isRedirect){
            this.setState({isGeneratingPublicUrl: false});
            window.open(this.state.statmentPublicUrl, '_blank');
        }
    }

    goToCustomerView = async () => {
        this.setState({isGeneratingPublicUrl: true});
        let filterQuery = cloneDeep(this.state.filterData);
        let { startDate, endDate, customer } = filterQuery;
        var filterQueryData = getInvoiceFilterQuery(customer, startDate, endDate, this.state.isShowUndepaid);
        this.generateStatmentPublicUrl(filterQueryData, true);
    }

    fetchCustomerStatements = async (filterQueryData) => {
        const response = await this.props.actions.fetchCustomerStatements(filterQueryData);

        if (response, response.payload) {
            this.setState({ invoicesStatementData: response.payload.statement, selectedBusiness: response.payload.statement.business, isLoadingStatement: false });
        }
    };

    fetchCustomersList = async () => {
        const customerList = (await customerServices.fetchCustomers()).data.customers
        this.setState({ customerList })
        if(this.state.customerList && this.props.location.state && this.props.location.state.filterData){
            let filterData = cloneDeep(this.props.location.state.filterData)
            this.setState({
                filterData: {
                    customer: filterData.customerId,
                    startDate: new Date(filterData.startDate),
                    endDate: new Date(filterData.endDate)
                }
            });

            this.setState({
                isShowUndepaid: (filterData.scope == "unpaid")? true : false
            });


            var result = this.state.customerList.filter(obj => {
                return obj._id === filterData.customerId
            });
            if(result && result.length > 0){
                this.handleSelectChange(result[0], 'customer');
            }
        }
    }

    handleSelectChange = (selectedOption, type) => {
        let filterData = cloneDeep(this.state.filterData)
        if (type === 'customer') {
            filterData.customer = selectedOption && selectedOption._id || ''
            this.setState({ selectedCustomer: selectedOption })

        } else if (type.includes("Date")) {
            filterData = {
                ...filterData, [type]: selectedOption
            }
        } else if (type === "invoiceNumber") {
            filterData.invoiceNumver = selectedOption;
        } else {
            filterData.startDate = selectedOption
            filterData.endDate = selectedOption
        }

        if(filterData.startDate <= filterData.endDate){
            this.setState({ statmentPublicUrl: '' });
            this.setState({ filterData },
                () => this.filterInvoiceData(this.state.isShowUndepaid))
        } else {
            this.props.showSnackbar("From date shouldn't be more than to date", true);
        }
    }

    filterInvoiceData = async (isShowUndepaid) => {
        this.setState({isLoadingStatement: true})
        let filterQuery = cloneDeep(this.state.filterData)
        let { startDate, endDate, customer } = filterQuery;

        if (startDate && endDate && customer) {
            var filterQueryData = getInvoiceFilterQuery(customer, startDate, endDate, isShowUndepaid);

            this.fetchCustomerStatements(filterQueryData)
        } else {
            this.setState({ invoicesStatementData: {} });
        }
    }

    isValidFilterForm() {
        let { startDate, endDate, customer } = this.state.filterData;
        return (startDate && endDate && customer);
    }


    openMailBox = () => {
        this.setState({
            openMail: true
        });
    };

    onCloseMail = () => {
        this.setState({
            openMail: false
        });
    };

    handleFocus = (event) => {
        event.preventDefault();
        event.target.select()
    }

    sendMailToUser = (e, type) => {
        const { invoicesStatementData, statmentPublicUrl } = this.state;
        const { selectedBusiness } = this.props;

        if(invoicesStatementData && statmentPublicUrl && selectedBusiness){
            const url = statementMailMessage(invoicesStatementData, statmentPublicUrl, type, selectedBusiness)
            window.open(url)
        }
    }

    render() {
        const { openMail, customerList, selectedCustomer, selectedStatus, filterData, invoiceTotalAmt, invoicesStatementData, isShowUndepaid, statmentPublicUrl, isLoadingStatement, selectedBusiness, isGeneratingPublicUrl } = this.state;
        // const { selectedBusiness } = this.props;
        return (
            <Fragment>
                <MailStatement
                    openMail={openMail}
                    invoicesStatementData={invoicesStatementData}
                    onClose={this.onCloseMail}
                />

                    <div className="content-wrapper__main statement">
                        <header className="py-header--page">
                            <div className="py-header--title">
                                <h1 className="py-heading--title">Customer Statements </h1>
                            </div>
                        </header>
                        <div className="content">
                            <div className="py-notify py-notify--info" isOpen={this.state.visible} toggle={this.onDismiss}>

                                <div class="py-notify__icon-holder">
                                        <svg viewBox="0 0 20 20" className="py-svg-icon icon" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
                                </div>

                                <div className="py-notify__content-wrapper">
                                    <div className="py-notify__content">
                                    <h6>Statements: A clear overview of your customer's invoices and payments</h6>
                                <p className="text-justify">Customer statements allows you to summarize all the invoices and payments for a customer between two dates in a single view. Generate and send a statement to any customer that owes more than one outstanding invoice, or any customer that is requesting all their activity between two dates.</p>
                                    </div>
                                </div>
                            </div>

                                    <div className="py-box py-box--large customer-statements--filter__container">
                                        <div className="py-box--content">
                                            <div className="customer-statements--filter__content">

                                                <div className="py-form-field py-form-field--inline">
                                                <Label for="from" className="py-form-field__label is-required">Select a customer</Label>

                                                <div className="py-form-field__element">
                                                    <SelectBox
                                                        valueKey={'_id'}
                                                        labelKey={'customerName'}
                                                        value={selectedCustomer}
                                                        onChange={cust => this.handleSelectChange(cust, 'customer')}
                                                        options={customerList}
                                                        isClearable
                                                    />
                                                    <label className="py-checkbox">
                                                        <input
                                                        className="py-form__element"
                                                        type="checkbox"
                                                        onChange={this.toggleShowUnpaidChange}
                                                        id="isShowUndepaid" name="isShowUndepaid"
                                                        />
                                                        <span className="py-form__element__faux"></span>
                                                        <span className="py-form__element__label">Show unpaid invoices only</span>
                                                    </label>
                                                    {/* <CustomInput type="checkbox" checked={isShowUndepaid} onChange={this.toggleShowUnpaidChange} id="isShowUndepaid" name="isShowUndepaid" label="Show unpaid invoices only" /> */}
                                                </div>
                                                </div>
                                            </div>

                                            <div className="customer-statements--filter__range">

                                                <div className="d-flex align-items-center mr-3">
                                                    <Label for="from" className="mr-1">From<span className="text-danger">*</span> </Label>
                                                    <DatepickerWrapper
                                                        className="form-control"
                                                        id="from"
                                                        selected={filterData.startDate}
                                                        onChange={date => this.handleSelectChange(date, 'startDate')}
                                                    />

                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <Label for="to" className="mr-1">To<span className="text-danger">*</span> </Label>
                                                    <DatepickerWrapper
                                                        className="form-control"
                                                        id="to"
                                                        selected={filterData.endDate}
                                                        onChange={date => this.handleSelectChange(date, 'endDate')}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                            {
                                (!invoicesStatementData || !invoicesStatementData['summary'] || invoicesStatementData['details'].length <= 0 || isLoadingStatement == true) ? "" :
                            (<div hidden={(!invoicesStatementData || !invoicesStatementData['summary'] || invoicesStatementData['details'].length <= 0 || isLoadingStatement == true)}>
                                <div className="py-action-bar">
                                    <div className="ml-auto text-right">
                                        <button disabled={isGeneratingPublicUrl == true} onClick={this.goToCustomerView} className="btn btn-outline-primary mr-2">Preview the customer view</button>
                                        <Dropdown isOpen={this.state.dropdownOpen} direction={'bottom'} toggle={this.toggleDropdown}>
                                            <DropdownToggle className="btn btn-primary" caret>
                                                Send
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-right" style={{width: '300px'}}>
                                                <div className="dropdown-menu--body">
                                                <DropdownItem onClick={this.openMailBox}>Send with Peymynt</DropdownItem>
                                                <span class="dropdown-item-divider"></span>
                                                <div className="dropdown-menu-item--header"><strong>Send using</strong></div>
                                                <DropdownItem><span className="pointer" onClick={(e) => this.sendMailToUser(e, 'gmail')}>Gmail</span></DropdownItem>
                                                <DropdownItem><span className="pointer" onClick={(e) => this.sendMailToUser(e, 'yahoo')}>Yahoo! Mail</span></DropdownItem>
                                                <DropdownItem><span className="pointer" onClick={(e) => this.sendMailToUser(e, 'outlook')}>Outlook</span></DropdownItem>
                                                <span class="dropdown-item-divider"></span>
                                                <div className="dropdown-menu-item--header"><strong>Share URL</strong></div>
                                                <DropdownItem toggle={false}>
                                                    <Input
                                                    className=""
                                                    type="text"
                                                    name="shareLink"
                                                    onClick={this.handleFocus}
                                                    ref="publicUrl"
                                                    value={statmentPublicUrl} />
                                                    <span className="py-text--small py-text--hint">Press Cmd+C or Ctrl+C to copy to clipboard</span>
                                                </DropdownItem>
                                                </div>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </div>

                                <StatementView isPublic={false} invoicesStatementData={invoicesStatementData} isShowUndepaid={isShowUndepaid} selectedBusiness={selectedBusiness}  selectedCustomer={selectedCustomer} filterData={filterData} {...this.props} />
                            </div>)
                            }

                            { isLoadingStatement == true?
                            (<Container className="mrT50 text-center">
                                <h3>Loading your customer statement...</h3>
                                <Spinner color="primary" size="md" className="loader" />
                            </Container>) : ""
                            }

                            {
                                (invoicesStatementData && invoicesStatementData['summary'] && invoicesStatementData['details'].length > 0) ? "" :
                            (<div className="text-center" >
                                <img src="/assets/images/no-statements-img.PNG" alt="" className="logo" />
                                <p className="py-text">
                                    You haven't generated any statements yet
                                    <br/>
                                    Select a customer to generate a statement
                                </p>

                            </div>)
                            }

                            { this.isValidFilterForm() || !selectedCustomer? "" :
                            (<Row className="mrT50" hidden={this.isValidFilterForm() || !selectedCustomer}>
                                <Col xs={12} sm={12} md={12} lg={12} className="text-center">
                                    <h6>
                                        Please select all filter values
                                    </h6>
                                </Col>
                            </Row>)
                            }
                        </div>
                    </div>
            </Fragment>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        business: state.businessReducer.business,
        selectedBusiness: state.businessReducer.selectedBusiness
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CustomerStatementActions, dispatch),
        showSnackbar: (message, error) => {
            dispatch(openGlobalSnackbar(message, error))
        }
    };
}


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(CustomerStatements)))
// export default CustomerStatements;
