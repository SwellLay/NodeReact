
import React, { PureComponent } from 'react'
import { Button, Col, Row, ListGroup, ListGroupItem, Table, Container } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { convertDate, toDollar, getDateMMddyyyy, getInvoicePublicURL, getInvoicePrivateURL, getCommonFormatedDate } from '../../../../../../utils/common';

class StatementView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            invoicesStatementData: {},
            isShowUndepaid: false,
            filterData: {
                status: "",
                customer: "",
                startDate: new Date(),
                endDate: new Date()
            },
            today: new Date(),
            isPublic: false,
            selectedBusiness: {}
        }
    }

    componentDidMount() {
        // const { invoicesStatementData } = this.props;
        // this.setState({
        //     invoicesStatementData: invoicesStatementData
        // });
    }

    componentDidUpdate(prevProps) {
        const { invoicesStatementData, isShowUndepaid, filterData, isPublic } = this.props;
        this.setState({
            invoicesStatementData: invoicesStatementData,
            isShowUndepaid: isShowUndepaid,
            filterData: filterData,
            isPublic: isPublic
        });

        if (prevProps.invoicesStatementData != invoicesStatementData) {
            this.setState({
                selectedBusiness: invoicesStatementData.business
            });
        }
    }

    renderBusinessDetails = () => {
        const { invoicesStatementData } = this.props;
        const selectedBusiness = invoicesStatementData.business;
        if (!selectedBusiness) {
            return <React.Fragment></React.Fragment>
        } else {
            return <React.Fragment>
                <Row className="no-gutters">

                    <Col md={6}>
                        {
                            (selectedBusiness.setting && selectedBusiness.setting.companyLogo)?
                            <img src={selectedBusiness.setting.companyLogo} className="business-logo img-fluid pull-left" alt="business-logo" /> : ''
                        }
                    </Col>
                    <Col md={6}>

                        <div className="text-right">
                            {
                                (selectedBusiness.organizationName)?
                                <h3 className="m-0">{selectedBusiness.organizationName}</h3> : ''
                            }

                            {
                                (selectedBusiness.address)?
                                <span>
                                    <p class="m-0">{(selectedBusiness.address.addressLine1)? selectedBusiness.address.addressLine1 : ''}</p>
                                    <p class="m-0">{(selectedBusiness.address.addressLine2)? selectedBusiness.address.addressLine2 : ''}</p>
                                    <p class="m-0">{selectedBusiness.address.city} {(selectedBusiness.address.state) ? ', ' + selectedBusiness.address.state.name : ''}</p>
                                    <p class="m-0">{(selectedBusiness.address.postal)? selectedBusiness.address.postal : ''}</p>
                                </span> : ''
                            }

                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        }
    }

    renderBeginEndRow = (item, index) => {
        return <React.Fragment>
            {
                item.type == 'start' || item.type == 'end' ?
                    <tr className="lh1px" key={index} data={item}>
                        <td className="pdT5 pdB5">{getDateMMddyyyy(item.date)}</td>
                        <td className="pdT5 pdB5">
                            {this.renderInvoiceNo(item)}
                        </td>
                        <td className="pdT5 pdB5 text-right">{toDollar(item.amount)}</td>
                        <td className="pdT5 pdB5 text-right">{toDollar(item.amountDue)}</td>
                    </tr>
                    :
                    ""
            }
        </React.Fragment>
    }

    renderInvoiceNo = (item) => {
        const { isShowUndepaid, isPublic } = this.props;

        return <React.Fragment>
                {
                    isShowUndepaid ?

                    <span>
                        <a hidden={item._id}  className="py-text--link" target="blank" href="#">Invoice #{item.invoiceNo}</a>
                        <a hidden={!item._id || item._id == '' || isPublic == true} target="blank" href={`/app/invoices/edit/${item._id}`}>
                            <strong>Invoice #{item.invoiceNo}</strong>
                        </a>
                        <a hidden={!item._id || item._id == '' || isPublic == false} target="blank" href={getInvoicePublicURL(item._id)}>
                            <strong>Invoice #{item.invoiceNo}</strong>
                        </a>
                    </span>
                        :

                    <span>
                            <a hidden={item._id} target="blank" href="#"><strong>Invoice #{item.invoiceNo}</strong> </a>

                            <span hidden={!item._id || item._id == '' || isPublic == true} >
                                <span hidden={item.type != 'payment'}>
                                    Payment to&nbsp;
                                </span>
                                <span hidden={item.type != 'refund'}>
                                    Refund to&nbsp;
                                </span>

                                <a target="blank" href={getInvoicePrivateURL(item._id)}>
                                    <strong>Invoice #{item.invoiceNo}</strong>
                                </a>
                            </span>
                            <span hidden={!item._id || item._id == '' || isPublic == false}>
                                <span hidden={item.type != 'payment'}>
                                    Payment to&nbsp;
                                </span>
                                <span hidden={item.type != 'refund'}>
                                    Refund to&nbsp;
                                </span>
                                <a target="blank" href={getInvoicePublicURL(item._id)}>
                                    <strong>Invoice #{item.invoiceNo}</strong>
                                </a>
                            </span>
                            <span hidden={!item.dueDate}> (due {getDateMMddyyyy(item.dueDate)})</span>
                    </span>
                }
        </React.Fragment>
    }

    render() {
        const { invoicesStatementData, isShowUndepaid, filterData, selectedBusiness, selectedCustomer } = this.props;
        const summary = (invoicesStatementData['summary']) ? invoicesStatementData['summary'] : [];
        const details = (invoicesStatementData['details']) ? invoicesStatementData['details'] : [];
        const total = (invoicesStatementData['total']) ? invoicesStatementData['total'] : {};
        const isLoadingData = this.state.isLoadingData;
        return (


            <div className="container" hidden={!invoicesStatementData}>

                <div className="account-statement-view">
                    <div>
                        <div className="text-center">
                            <div className="py-heading--title">Statement of Account</div>
                            <p>(Generated on {getDateMMddyyyy(new Date())}) </p>
                        </div>
                    </div>
                    {this.renderBusinessDetails()}
                    <div className="py-divider"></div>
                    <Row className="no-gutters" >
                        <Col md="5" className="text-left mr-auto statement-customer-details" hidden={!selectedCustomer}>
                            <p className="detail">Bill to:</p>
                            <h3 className="name">{(selectedCustomer) ? selectedCustomer.customerName : ''}</h3>
                            <p className="detail">{(selectedCustomer) ? selectedCustomer.firstName + ' ' + selectedCustomer.lastName : ''}</p>

                            {
                                (selectedCustomer && selectedCustomer.addressBilling && selectedCustomer.addressBilling.addressLine1)? <p className='detail'>{selectedCustomer.addressBilling.addressLine1}</p> : ''
                            }
                            {
                                (selectedCustomer && selectedCustomer.addressBilling && selectedCustomer.addressBilling.addressLine2)? <p className='detail'>{selectedCustomer.addressBilling.addressLine2}</p> : ''
                            }
                            {
                                (selectedCustomer && selectedCustomer.addressBilling && selectedCustomer.addressBilling.city && selectedCustomer.addressBilling.state)? <p className='detail'>{selectedCustomer.addressBilling.city}, {selectedCustomer.addressBilling.state.name}</p> : ''
                            }
                            {
                                (selectedCustomer && selectedCustomer.addressBilling && selectedCustomer.addressBilling.country)? <p className='detail'>{selectedCustomer.addressBilling.country.name}</p> : ''
                            }

                            <p className="detail">{(selectedCustomer) ? selectedCustomer.email : ''}</p>
                        </Col>
                        <Col  md={4} className="text-right ml-auto">
                            <p>Account Summary</p>

                            <Table className="account-statement__summary">
                            {
                                isShowUndepaid ?
                                    summary.map((item, index) => {
                                        return (

                                            <tr>
                                                <td className="text-right">{item.label}: </td>
                                                <td className="text-right">{item.value}</td>
                                            </tr>
                                        );
                                    }) :


                                    summary.map((item, index) => {

                                        return (
                                            <tr>
                                                <td className="text-right">{item.label}: </td>
                                                <td className="text-right">{item.value}</td>
                                            </tr>
                                        );
                                    })


                            }
                            </Table>

                        </Col>
                    </Row>

                    <div className="py-divider"></div>

                    <div className="py-text--block-label">
                        SHOWING ALL OUTSTANDING INVOICES BETWEEN {getDateMMddyyyy(filterData.startDate)} AND {getDateMMddyyyy(filterData.endDate)}
                    </div>
                    <Row className="mrT20">
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <Table borderless className="statement-invoice-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th hidden={!isShowUndepaid}>Due date</th>
                                        <th>Details</th>
                                        <th className="text-right">Amount</th>
                                        <th className="text-right" hidden={!isShowUndepaid}>Total Paid</th>
                                        <th className="text-right">{(isShowUndepaid) ? 'Amount due' : 'Balance'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        isShowUndepaid ?
                                            details.map((item, index) => {
                                                return (
                                                    <tr className="lh1px" key={index} data={item}>
                                                        <td >{getDateMMddyyyy(item.date)}</td>
                                                        <td >{getDateMMddyyyy(item.dueDate)}</td>
                                                        <td >
                                                            {this.renderInvoiceNo(item)}
                                                        </td>
                                                        <td className="text-right">{toDollar(item.amount)}</td>
                                                        <td className="text-right">{toDollar(item.amountPaid)}</td>
                                                        <td className="text-right">{toDollar(item.amountDue)}</td>
                                                    </tr>
                                                );
                                            }) :

                                            details.map((item, index) => {
                                                return (
                                                    <React.Fragment>
                                                        {
                                                            item.type == "start" || item.type == "end" ?

                                                                <tr className={(item.type == "start") ? 'lh20px' : 'lh1px'} key={index} data={item}>
                                                                    <td >{getCommonFormatedDate(item.date)}</td>
                                                                    <td ><span className="pointer">{item.description}</span></td>
                                                                    <td className=" text-right"></td>
                                                                    <td className=" text-right">{toDollar(item.amount)}</td>
                                                                </tr>
                                                                :
                                                                <tr className="lh1px" hidden={item.type == "start" || item.type == "end"} key={index} data={item}>
                                                                    <td>{getCommonFormatedDate(item.date)}</td>
                                                                    <td>
                                                                        {this.renderInvoiceNo(item)}
                                                                    </td>
                                                                    <td hidden={item.type == 'payment'} className="text-right">{toDollar(item.amount)}</td>
                                                                    <td hidden={item.type != 'payment'} className="text-right">({toDollar(item.amount)})</td>
                                                                    <td className="pdT5 pdB5 text-right">{toDollar(item.balance)}</td>
                                                                </tr>
                                                        }
                                                    </React.Fragment>
                                                );
                                            })
                                    }

                                    {
                                        isShowUndepaid ?
                                            <tr className="">
                                                <td></td>
                                                <td hidden={!isShowUndepaid}></td>
                                                <td></td>
                                                <td className="text-right"><strong>{toDollar(total.totalAmount)}</strong></td>
                                                <td hidden={!isShowUndepaid} className="text-right"><strong>{toDollar(total.totalAmountPaid)}</strong></td>
                                                <td className="text-right"><strong>{toDollar(total.totalAmountDue)}</strong></td>
                                            </tr>
                                            : ''
                                    }

                                    <tr>
                                        <td colSpan="7">
                                            <div className="py-divider"></div>
                                        </td>
                                    </tr>

                                    <tr className="row-amount-due">
                                        <td colSpan="7" className="text-right">
                                            <h4>{(isShowUndepaid) ? 'Total amount due (USD)' : 'Amount due'}</h4>
                                            <h2>{(isShowUndepaid) ? toDollar(total.totalAmountDue) : toDollar(total.totalBalance)}</h2>
                                        </td>
                                    </tr>


                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        selectedBusiness: state.businessReducer.selectedBusiness
    };
};

export default withRouter((connect(mapStateToProps, null)(StatementView)))
