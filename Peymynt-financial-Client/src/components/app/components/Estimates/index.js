
import history from 'customHistory';
import { cloneDeep } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Form, Tooltip, Label, Spinner } from 'reactstrap';
import DataTableWrapper from 'utils/dataTableWrapper/DataTableWrapper';
import DatepickerWrapper from 'utils/formWrapper/DatepickerWrapper';
import SelectBox from 'utils/formWrapper/SelectBox';
import { openGlobalSnackbar } from '../../../../actions/snackBarAction';
import CustomerServices from '../../../../api/CustomerServices';
import { fetchEstimates } from '../../../../api/EstimateServices';
import { columns, defaultSorted, FILTER_CONST } from '../../../../constants/EstimateConst';
import moment from "moment";
import AddCustomerPopup from '../RecurringInvoice/AddCustomerPopup';
import { NoDataMessage } from '../../../../global/NoDataMessage';
require('react-dom');
window.React2 = require('react');
console.log("+++++++++++++++++++++++++++++", window.React1 === window.React2);
class Estimates extends Component {
    state = {
        selectedOption: null,
        showFilter: false,
        data: [],
        customerList: [],
        selectedStatus: undefined,
        selectedCustomer: undefined,
        filterData: {
            status: "",
            customer: "",
            startDate: undefined,
            endDate: undefined
        },
        loading: false,
        showPopup: false,
        search: false
    }

    componentDidMount() {
        const { businessInfo } = this.props;
        document.title = businessInfo && businessInfo.organizationName ? `Peymynt - ${businessInfo.organizationName} - Estimates` : `Peymynt - Estimates`;
        this.fetchEstimateInvoice()
        this.fetchCustomersList()
    }

    fetchEstimateInvoice = async (filter) => {
        this.setState({ loading: true });
        const response = await fetchEstimates(filter)
        if (response.data.estimates.length == 0) {
            this.setState({ showPopup: true })
        } else {
            this.setState({ showPopup: false })
        }
        this.setState({ data: response.data.estimates, loading: false })
    }

    fetchCustomersList = async () => {
        this.setState({ loading: true });
        const customerList = (await CustomerServices.fetchCustomers()).data.customers
        this.setState({ customerList, loading: false })
    }

    handleSelectChange = (selectedOption, type) => {
        let filterData = cloneDeep(this.state.filterData)
        if (type === 'status') {
            filterData.status = selectedOption && selectedOption.value || ''
            this.setState({ selectedStatus: selectedOption, search: true })
        } else if (type === 'customer') {
            filterData.customer = selectedOption && selectedOption._id || ''
            this.setState({ selectedCustomer: selectedOption, search: true })
        } else if (type.includes("Date")) {
            filterData = {
                ...filterData, [type]: selectedOption ? moment(selectedOption).format("YYYY-MM-DD") : null
            }
        } else {
            filterData.startDate = selectedOption
            filterData.endDate = selectedOption
        }
        this.setState({ filterData, search: true },
            () => this.filterEstimateData())

    }

    filterEstimateData = async () => {
        let filterQuery = cloneDeep(this.state.filterData)
        let { startDate, endDate, customer, status } = filterQuery
        let queryString = ""
        if (status) {
            queryString += queryString === '' ? `status=${status}` : `&&status=${status}`
        }
        if (customer) {
            queryString += queryString === '' ? `customer=${customer}` : `&&customer=${customer}`
        }
        if (startDate) {
            queryString += queryString === '' ? `startDate=${startDate}` : `&startDate=${startDate}`
        }
        if (endDate) {
            queryString += queryString === '' ? `endDate=${endDate}` : `&endDate=${endDate}`
        }
        this.fetchEstimateInvoice(queryString)
    }

    onFilterClick = () => {
        this.setState(prevState => {
            if(prevState.showFilter){
                this.fetchEstimateInvoice('')
            }
            return {
                showFilter: !prevState.showFilter,
                search: !prevState.search
            }
        })
    }

    toggle = (id) => {
        const isOpen = this.state.tooltipOpen === id;
        this.setState({
          tooltipOpen: isOpen ? null : id,
        });
      };

    render() {
        const { customerList, selectedCustomer, selectedStatus, showFilter, data, filterData, loading, search } = this.state
        return (
            <div className="content-wrapper__main estimate">
                <header className="py-header--page">
                    <div className="py-header--title">
                        <h1 className="py-heading--title">Estimates </h1>
                    </div>

                    <div className="ml-auto">
                        <Button onClick={() => history.push('/app/estimates/add')} className="btn btn-primary">Create an estimate</Button>
                    </div>
                </header>

                    <div className="content">
                        <div className="estimate__filter__container">
                            <Button className="btn-outline-primary" onClick={this.onFilterClick} >Filter</Button>
                                {showFilter &&
                                    <div className="py-box py-box--gray">
                                        <div className="py-box--content form-horizontal py-3">
                                            <div row>
                                                <Col md={8}>
                                                    <div className="py-form-field py-form-field--inline">
                                                        <Label for="exampleEmail" className="py-form-field__label">Status:</Label>
                                                        <div className="py-form-field__element">
                                                            <SelectBox
                                                                value={selectedStatus}
                                                                onChange={(status) => this.handleSelectChange(status, 'status')}
                                                                options={FILTER_CONST}
                                                                isClearable
                                                                placeholder="All statuses"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="py-form-field py-form-field--inline">
                                                        <Label for="exampleEmail" className="py-form-field__label">Customer: </Label>
                                                        <div className="py-form-field__element">
                                                            <SelectBox
                                                                valueKey={'_id'}
                                                                labelKey={'customerName'}
                                                                value={selectedCustomer}
                                                                onChange={cust => this.handleSelectChange(cust, 'customer')}
                                                                options={customerList}
                                                                placeholder="All customers"
                                                                isClearable
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="py-form-field py-form-field--inline">
                                                        <Label for="exampleEmail" className="py-form-field__label">Date: </Label>
                                                        <div className="py-form-field__element d-flex align-items-center">
                                                            <DatepickerWrapper
                                                                selected={filterData.startDate}
                                                                onChange={date => this.handleSelectChange(date, 'startDate')}
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                className="py-form__element__small form-control"
                                                                dropdownMode="select"
                                                            />
                                                            <span className="mx-2">to</span>
                                                            <DatepickerWrapper
                                                                selected={filterData.endDate}
                                                                onChange={date => this.handleSelectChange(date, 'endDate')}
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                className="py-form__element__small form-control"
                                                                dropdownMode="select"
                                                            />
                                                                <Tooltip placement="top" isOpen={this.state.tooltipOpen === `reset`}
                                                                    target={`reset`}
                                                                    toggle={() => this.toggle(`reset`)}>
                                                                    Reset dates
                                                                </Tooltip>

                                                            <a className="btn-close icon ml-2" href="javascript:void(0)" id="reset" onClick={() => this.handleSelectChange(undefined, 'clear')}>
                                                            <svg viewBox="0 0 20 20" className="py-svg-icon" id="cancel" xmlns="http://www.w3.org/2000/svg"><path d="M11.592 10l5.078 5.078a1.126 1.126 0 0 1-1.592 1.592L10 11.592 4.922 16.67a1.126 1.126 0 1 1-1.592-1.592L8.408 10 3.33 4.922A1.126 1.126 0 0 1 4.922 3.33L10 8.408l5.078-5.078a1.126 1.126 0 0 1 1.592 1.592L11.592 10z"></path></svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    <div className="estimate-list-table mt-3">
                        {
                            loading ?
                            <Spinner color="primary" size="md" className="loader" /> :
                            this.state.showPopup ?
                            (<NoDataMessage
                                title="estimate"
                                add={() => history.push('/app/estimates/add')}
                                filter={search}
                                secondryMessage="Create a new estimate and send it to customer."
                            />)
                            :(<DataTableWrapper
                            data={data || []}
                            columns={columns}
                            defaultSorted={defaultSorted}
                            classes="py-table py-table--hover py-table--condensed"
                            from="estimateList"
                            hover={true}
                        />)
                        }
                    </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    businessInfo: state.businessReducer.selectedBusiness
});

const mapDispatchToProps = dispatch => {
    return {
        showSnackbar: (message, error) => {
            dispatch(openGlobalSnackbar(message, error));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Estimates);
