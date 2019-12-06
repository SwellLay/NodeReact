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
    Spinner,
    Alert,
    Row
} from "reactstrap";
import classnames from "classnames";
import history from 'customHistory'
import { cloneDeep } from "lodash";
import SelectBox from "utils/formWrapper/SelectBox";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import DataTableWrapper from "utils/dataTableWrapper/DataTableWrapper";
import { getInvoices, getInvoicesCount, getInvoiceDashboardCount } from "../../../../../../api/InvoiceService";
import { columns, defaultSorted, INVOICE_STATUS_FILTER } from "../../../../../../constants/invoiceConst";
import customerServices from "../../../../../../api/CustomerServices";
import { convertDate, toDollar, getDateMMddyyyy } from '../../../../../../utils/common';
import StatementView from './StatementView';
import * as CustomerStatementActions from '../../../../../../actions/CustomerStatementActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import MailStatement from "./MailStatement";
import { statementMailMessage } from "../helpers";
class StatementPreview extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            invoicesStatementData: {},
            filterData: {
                status: "",
                customer: "",
                startDate: new Date(),
                endDate: new Date()
            },
            isShowUndepaid: false,
            selectedCustomer:{},
            statmentPublicUrl: window.location.href,
            isLoadingData: true,
            openMail: false
        };
    }


    componentDidMount() {
        document.title = `Customer Statements`;
        let { uuid } = this.props.match.params;
        this.getPublicStatement(uuid);
    }

    toggleDropdown =()=> {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    getPublicStatement = async (uuid) => {

        this.setState({ isLoadingData: true });
        const response = await this.props.actions.getPublicStatement(uuid);
        if(response){
            this.setState({ invoicesStatementData: response.payload.statement, isLoadingData: false });
            if(this.state.invoicesStatementData && this.state.invoicesStatementData.filter){
                const filter = this.state.invoicesStatementData.filter;
                const customer = this.state.invoicesStatementData.customer;
                this.setState(prevState => ({
                    selectedCustomer: customer,
                    filterData: filter
                }));
                this.setState(prevState => ({
                    isShowUndepaid: (filter.scope == "unpaid")? true : false
                }));
            }
        }
    };

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

    sendMailToUser = (e, type) => {
        const { invoicesStatementData, statmentPublicUrl } = this.state;
        const selectedBusiness = (invoicesStatementData)? invoicesStatementData.business : {};

        if(invoicesStatementData && statmentPublicUrl && selectedBusiness){
            const url = statementMailMessage(invoicesStatementData, statmentPublicUrl, type, selectedBusiness)
            window.open(url)
        }
    }

    handleFocus = (event) => {
        event.target.select()
        // this.setState({dropdownOpen: true})
    }

    render() {
        const { openMail, filterData, invoicesStatementData, isShowUndepaid, selectedCustomer, statmentPublicUrl, isLoadingData } = this.state;
        const { selectedBusiness } = this.props;
        return (
            <div className="back-white statement-preview">
                {
                    (isLoadingData)?
                    <Container className="mrT50 text-center">
                        <h3>Loading your customer statement...</h3>
                        <Spinner color="primary" size="md" className="loader" />
                    </Container>
                    : ''
                }

                {
                    (invoicesStatementData && invoicesStatementData['summary'])?
                        <React.Fragment>
                            <MailStatement
                                openMail={openMail}
                                invoicesStatementData={invoicesStatementData}
                                statmentPublicUrl={statmentPublicUrl}
                                onClose={this.onCloseMail}
                            />

                            <Container fluid className="d-flex justify-content-between shadow">
                                <div className="py-text"><span className="pull-left pd10">You are previewing your customer's copy of their statement.</span></div>

                                <div className="py-header--actions">
                                    <div onClick={() => history.push({ pathname: '/app/sales/customerstatements', search: '', state: { filterData: filterData }})}>Go back to Peymynt</div>
                                    <span className="pull-right pd10"> or </span>

                                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                            <DropdownToggle className="btn btn-accent btn-rounded" caret>
                                                Send
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-left" x-placement="left" style={{width: '300px'}}>
                                                <div className="dropdown-menu--body">
                                                <DropdownItem onClick={this.openMailBox}>Send with Peymynt</DropdownItem>
                                                <span className="dropdown-item-divider" />
                                                <Label className="mrL20"><strong>Send using</strong></Label>
                                                <DropdownItem onClick={(e) => this.sendMailToUser(e, 'gmail')}>Gmail</DropdownItem>
                                                <DropdownItem onClick={(e) => this.sendMailToUser(e, 'yahoo')}>Yahoo! Mail</DropdownItem>
                                                <DropdownItem onClick={(e) => this.sendMailToUser(e, 'outlook')}>Outlook</DropdownItem>
                                                <span className="dropdown-item-divider" />
                                                <Label className="dropdown-menu-item--header">Share URL</Label>
                                                <DropdownItem toggle={false}>
                                                    <Input
                                                        type="text"
                                                        name="shareLink"
                                                        onClick={this.handleFocus}
                                                        ref="publicUrl"
                                                        value={statmentPublicUrl} />
                                                </DropdownItem>
                                                <span className="py-text--hint py-text--small">Press Cmd+C or Ctrl+C to copy to clipboard</span>
                                                </div>
                                            </DropdownMenu>
                                        </Dropdown>
                                </div>
                            </Container>

                            <div className="content-wrapper__main__fixed back-white pd10 mrT10">
                                <div className="container">
                                    <Container>
                                        <StatementView isPublic={true} invoicesStatementData={invoicesStatementData} isShowUndepaid={isShowUndepaid} selectedBusiness={selectedBusiness} selectedCustomer={selectedCustomer} filterData={filterData} {...this.props} />
                                    </Container>
                                </div>
                            </div>
                        </React.Fragment>
                    :
                    ''
                }
            </div>
        );
    }
}

// export default StatementPreview;

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CustomerStatementActions, dispatch)
    };
}

const mapStateToProps = state => {
    return {
    };
};

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(StatementPreview)))
