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
  Row,
  Spinner
} from "reactstrap";
import classnames from "classnames";
import history from "customHistory";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import SelectBox from "utils/formWrapper/SelectBox";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import DataTableWrapper from "utils/dataTableWrapper/DataTableWrapper";
import {
  getInvoices,
  getInvoicesCount,
  getInvoiceDashboardCount
} from "../../../../api/InvoiceService";
import {
  columns,
  defaultSorted,
  INVOICE_STATUS_FILTER,
  draftColumns,
  allColumns
} from "../../../../constants/invoiceConst";
import customerServices from "../../../../api/CustomerServices";
import moment from "moment";
import Loader from "../../../common/Loader";
import { toMoney, _prettyDate } from "../../../../utils/GlobalFunctions";
import { CalendarContainer } from 'react-datepicker';
import TimeAgo from 'react-timeago'
import CenterSpinner from "../../../../global/CenterSpinner";
import InvoiceOnboarding from "./components/InvoiceOnboarding";
import { NoDataMessage } from "../../../../global/NoDataMessage";
import queryString from 'query-string'
class Invoice extends PureComponent {
  state = {
    modal: false,
    activeTab: "unpaid",
    limit: 100,
    offset: 0,
    data: [],
    customerList: [],
    selectedCustomer: undefined,
    selectedStatus: undefined,
    invoiceData: [],
    invoiceCount: {
      draft: 0,
      unpaid: 0,
      total: 0
    },
    invoiceDashboardData: {
      currency: {
        code: "",
        symbol: ""
      },
      overdue: 0,
      due: 0,
      paidThisMonth: 0
    },
    filterData: {
      status: undefined,
      customer: "",
      startDate: undefined,
      endDate: undefined,
      invoiceNumber: undefined
    },
    loading: false,
    refreshData: false,
    isOnBoard: false
  };

  componentDidMount() {
    console.clear();
    const { businessInfo, location } = this.props;
    const { search } = location;
    document.title = businessInfo && businessInfo.organizationName ? `Peymynt - ${businessInfo.organizationName} - Invoices` : `Peymynt - Invoices`;
    const { selectedBusiness:{ meta:{ invoice } } } = JSON.parse(localStorage.getItem('reduxPersist:businessReducer'))
    let queryData;
    if(search.includes('rcId')){
      const {rcId} = queryString.parse(search);
      queryData = `recurringInvoiceId=${rcId}`

    }else{
      queryData = `tab=${this.state.activeTab}`;
    }
    this.fetchInvoices(queryData);
    this.fetchInvoicesCount(queryData);
    this.fetchCustomersList();
    this.fetchInvoiceDashboardCount();
    if(search.includes('pre=true')){
      this.setState({
        isOnBoard: invoice.firstVisit
      })
    }else if(businessInfo.meta.invoice.firstVisit){
      history.push('/app/invoices/start')
    }
    // if(search.includes('post=true')){
    //   history.push('/app/invoices/start')
    // }
  }

  componentDidUpdate(prevProps) {
    const { updateData } = this.props;
    const { filterData } = this.state;
    if (prevProps.updateData !== updateData) {
      console.log("")
      // let queryData = `tab=${this.state.activeTab}`;
      // this.fetchInvoices(queryData);
      // this.fetchInvoicesCount(queryData);
      this.filterInvoiceData()
      this.fetchCustomersList();
      this.fetchInvoiceDashboardCount();
    }
  }

  fetchInvoices = async queryData => {
    const { limit, offset } = this.state;
    this.setState({ loading: true })
    const response = await getInvoices(queryData);
    this.setState({ invoiceData: response.data.invoices, loading: false });
  };

  fetchInvoicesCount = async queryData => {
    let { filterData, invoiceCount, activeTab } = this.state;
    const response = await getInvoicesCount(queryData);
    const invoiceCountResponse = response.data.invoiceCount;
    // if(filterData.status) {
    //   invoiceCount[activeTab] = invoiceCountResponse[activeTab];
    // } else {
    //   invoiceCount = invoiceCountResponse;
    // }
    this.setState({ invoiceCount: invoiceCountResponse });
  };

  onRefreshClick = async () => {
    // let queryData = `tab=${this.state.activeTab}`;
    // this.fetchInvoices(queryData);
    // this.fetchInvoicesCount(queryData);
    this.fetchInvoiceDashboardCount();
    this.setState({refreshData: true})
  };

  fetchCustomersList = async () => {
    const customerList = (await customerServices.fetchCustomers()).data
      .customers;
    this.setState({ customerList });
  };

  fetchInvoiceDashboardCount = async () => {
    let invoiceDashboardData = (await getInvoiceDashboardCount()).data
      .invoiceDashboardData;
    this.setState({ invoiceDashboardData, refreshData: false });
  };

  handleSelectChange = (selectedOption, type) => {
    let filterData = cloneDeep(this.state.filterData);
    if (type === "status") {
      filterData.status = (selectedOption && selectedOption.value) || "";
      this.setState({ selectedStatus: selectedOption });
    } else if (type === "customer") {
      filterData.customer = (selectedOption && selectedOption._id) || "";
      this.setState({ selectedCustomer: selectedOption });
    } else if (type.includes("Date")) {
      filterData = {
        ...filterData,
        [type]: selectedOption ? moment(selectedOption).format("YYYY-MM-DD") : null
      };
    }
    this.setState({ filterData }, () => this.filterInvoiceData());
  };

  filterInvoiceData = async () => {
    let filterQuery = cloneDeep(this.state.filterData);
    const { activeTab } = this.state;
    let { startDate, endDate, customer, status, invoiceNumber } = filterQuery;
    let queryData = "";
    let countFilter = "";
    if (activeTab) {
      queryData = queryData.length > 0 ? `tab=${activeTab}` : `&tab=${activeTab}`;
    }

    if (status) {
      queryData = queryData === "" ? `status=${status}` : `&status=${status}`;
      countFilter = countFilter.length > 0 ? `status=${status}` : `&status=${status}`;
    }

    if (customer) {
      queryData +=
        queryData === "" ? `customer=${customer}` : `&customer=${customer}`;
      countFilter +=
        countFilter === "" ? `customer=${customer}` : `&customer=${customer}`;
    }

    if (startDate) {
      queryData +=
        queryData === ""
          ? `startDate=${startDate}`
          : `&startDate=${startDate}`;
      countFilter +=
        countFilter === ""
          ? `startDate=${startDate}`
          : `&startDate=${startDate}`;
    }

    if (endDate) {
      queryData +=
        queryData === ""
          ? `endDate=${endDate}`
          : `&endDate=${endDate}`;
      countFilter +=
        countFilter === ""
          ? `endDate=${endDate}`
          : `&endDate=${endDate}`;
    }

    if (invoiceNumber) {
      queryData +=
        queryData === "" ? `invoiceNumber=${invoiceNumber}` : `&invoiceNumber=${invoiceNumber}`;
      countFilter +=
        countFilter === "" ? `invoiceNumber=${invoiceNumber}` : `&invoiceNumber=${invoiceNumber}`;
    }
    console.log("=======", queryData);
    this.fetchInvoices(queryData);
    this.fetchInvoicesCount(countFilter);
  };

  onFilterClick = () => {
    this.setState(prevState => {
      return {
        showFilter: !prevState.showFilter
      };
    });
  };

  handleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        invoiceData: []
      }, () => this.filterInvoiceData());
    }
  };

  addInvoice = () => {
    history.push("/app/invoices/add");
  };

  MyContainer = (e, type) => {
    console.log("name", e, type)
    let className = e.className,
        children = e.children
    return (
      <div className="row datePickerWrapper">
        <CalendarContainer className={className}>
          <div style={{ position: 'relative', display: 'inline-block', float: 'left' }}>
            {children}
          </div>
          <div className="calendar-custome-days">
            <ul>
              <li onClick={this.setDate.bind(this, "30", 'days', type)}><a href="javascript: void(0)">30 Days Ago</a></li>
              <li onClick={this.setDate.bind(this, "60", 'days', type)}><a href="javascript: void(0)">60 Days Ago</a></li>
              <li onClick={this.setDate.bind(this, "90", 'days', type)}><a href="javascript: void(0)">90 Days Ago</a></li>
              <li onClick={this.setDate.bind(this, "6", 'months', type)}><a href="javascript: void(0)">6 Months Ago</a></li>
              <li onClick={this.setDate.bind(this, "1", 'year', type)}><a href="javascript: void(0)">1 Year Ago</a></li>
            </ul>
          </div>
        </CalendarContainer>
      </div>
    );
  }

  setDate = (no, day, type, e) => {
    let prevDate = moment().subtract(no, day).format("YYYY-MM-DD")
    let filterData = {
      ...this.state.filterData,
      [type]: prevDate ? moment(prevDate).format("YYYY-MM-DD") : null
    };
    console.log("elem", filterData, type)
    this.setState({filterData})
    let elem = document.getElementsByClassName('react-datepicker-popper');
    elem[0].style.display = 'none';
  }

  _setFirstVisit = e => {
    const { search } = this.props.match
    console.log("this.props", this.props)
    this.setState({
      isOnBoard: false
    })
  }

  render() {
    let search = false;
    const {
      invoiceData,
      customerList,
      selectedCustomer,
      selectedStatus,
      filterData,
      invoiceDashboardData,
      loading,
      refreshData,
      isOnBoard
    } = this.state;
    if(!!filterData.customer || !!filterData.startDate || !!filterData.endDate || !!filterData.invoiceNumber || !!filterData.status){
      search = true;
    }
    console.log("invoice", filterData)
    return (
      <div className="content-wrapper__main invoiceWrapper">
        <InvoiceOnboarding
          openModal={isOnBoard}
          setFirstVisit={this._setFirstVisit.bind(this)}
        />
        <div className="invoice-header">
          <header className="py-header--page">
          <div className="py-header--title">
            <h2 className="py-heading--title">Invoices </h2>
          </div>

          <div className="py-header--action">
            <Button
                onClick={this.addInvoice}
                color={'primary'}>
                Create an invoice
              </Button>
          </div>
        </header>
        </div>
              <div className="invoice-insights__content py-box py-box--large">
                  <div className="invoice-insights__content-row">
                      <div className="invoice-insights-content__column">
                        <div className="py-text--block-label">Overdue</div>
                        <div className="py-text py-text--large">
                          <span className="invoice-insights-content__column-value">
                            {invoiceDashboardData && invoiceDashboardData.currency &&
                              invoiceDashboardData.currency.symbol}{toMoney(invoiceDashboardData.overdue)}
                          </span>
                          <span className="invoice-insights-content__column-unit">
                            <span className="py-text--small">
                              {invoiceDashboardData && invoiceDashboardData.currency &&
                                invoiceDashboardData.currency.code}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="invoice-insights-content__column d-flex flex-column align-items-center">
                        <div className="py-text--block-label">
                          Due within 30 days
                        </div>
                        <div className="py-text py-text--large">
                          <span className="invoice-insights-content__column-value">
                            {invoiceDashboardData && invoiceDashboardData.currency &&
                              invoiceDashboardData.currency.symbol}
                            {toMoney(invoiceDashboardData.due)}
                          </span>
                          <span className="invoice-insights-content__column-unit">
                            <span className="py-text--small unit-value">
                              {invoiceDashboardData && invoiceDashboardData.currency &&
                                invoiceDashboardData.currency.code}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="invoice-insights-content__column d-flex flex-column align-items-end">
                        <div className="py-text--block-label">
                          Received this month
                        </div>
                        <div className="py-text py-text--large">
                          <span className="invoice-insights-content__column-value">
                            {invoiceDashboardData && invoiceDashboardData.currency &&
                              invoiceDashboardData.currency.symbol}
                            {toMoney(invoiceDashboardData.paidThisMonth)}
                          </span>
                          <span className="invoice-insights-content__column-unit">
                            <span className="py-text--small unit-value">
                              {invoiceDashboardData && invoiceDashboardData.currency &&
                                invoiceDashboardData.currency.code}
                            </span>
                          </span>
                        </div>
                      </div>
                  </div>
                  <div className="invoice-insights__content__row bottom-row">
                      <div className="py-text py-text--hint d-flex align-items-center">
                        <span className="mr-1">{`Last updated `}<TimeAgo date={moment().format('LLL')} minPeriod="30"/>.</span>
                        <span
                          role="button"
                          onClick={this.onRefreshClick}

                          className="filter__action"
                        >
                          <svg className="py-icon" viewBox="0 0 20 20" id="refresh" xmlns="http://www.w3.org/2000/svg"><path d="M5.346 7H7.5a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1V3.5a1 1 0 1 1 2 0v1.989c.157-.191.389-.473.48-.581C6.137 2.933 7.741 2 10.5 2c3.03 0 5.507 1.524 7.348 4.47a1 1 0 1 1-1.696 1.06C14.66 5.142 12.803 4 10.5 4c-2.09 0-3.178.633-4.49 2.194-.12.143-.538.655-.62.752L5.347 7zm9.308 6H12.5a1 1 0 0 1 0-2H17a1 1 0 0 1 1 1v4.5a1 1 0 0 1-2 0v-1.989c-.157.192-.389.474-.48.581C13.863 17.068 12.259 18 9.5 18c-3.03 0-5.507-1.524-7.348-4.47a1 1 0 1 1 1.696-1.06C5.34 14.858 7.197 16 9.5 16c2.09 0 3.178-.633 4.49-2.194.12-.143.539-.655.62-.752l.044-.054z"></path></svg>
                        </span>
                      </div>
                  </div>
                </div>
              <div className="invoice-list-table-filters-container mrB30">
                  <div className="invoice-filter--customer">
                    <SelectBox
                      placeholder="All customers"
                      valueKey={"_id"}
                      labelKey={"customerName"}
                      value={selectedCustomer}
                      onChange={cust =>
                        this.handleSelectChange(cust, "customer")
                      }
                      options={customerList}
                      isClearable
                    />
                  </div>
                  <div className="invoice-filter--status">
                    <SelectBox
                      placeholder="All statuses"
                      value={selectedStatus}
                      disabled={this.state.activeTab === "draft"}
                      onChange={status =>
                        this.handleSelectChange(status, "status")
                      }
                      options={INVOICE_STATUS_FILTER(this.state.activeTab)}
                      isClearable
                    />
                  </div>
                  <div className="invoice-filter--date">

                    <div className="py-datepicker--range">
                    <DatepickerWrapper
                      isClearable={true}
                      placeholderText="From"
                      className="form-control py-datepicker--range-from"
                      selected={filterData.startDate}
                      onChange={date =>
                        this.handleSelectChange(date, "startDate")
                      }
                      name="startdate"
                      // calendarContainer = {(e) => this.MyContainer(e, 'startDate')}
                    />
                    <DatepickerWrapper
                      minDate={filterData.startDate}
                      isClearable={true}
                      placeholderText="To"
                      className="form-control py-datepicker--range-to"
                      selected={filterData.endDate}
                      onChange={date =>
                        this.handleSelectChange(date, "endDate")
                      }
                      // calendarContainer = {(e) => this.MyContainer(e, 'endDate')}
                    />
                    </div>
                  </div>
                  <div className="invoice-filter--search">
                    <InputGroup className="btn-search">
                      <Input
                        placeholder={'Enter invoice #'}
                        value={filterData.invoiceNumber}
                        onChange={e => {
                          const { value } = e.target
                          let filterData = cloneDeep(this.state.filterData);
                          filterData.invoiceNumber = isNaN(value) ? "" : value;
                          this.setState({ filterData });
                        }}
                      />
                      <InputGroupAddon addonType="append">
                        <Button
                          onClick={invoiceNumber =>
                            this.handleSelectChange(
                              invoiceNumber,
                              "invoiceNumber"
                            )
                          }
                        >
                          <i className="fa fa-search" aria-hidden="true" />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
              </div>

              <Nav tabs className="py-nav--tabs">
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "unpaid"
                    })}
                    onClick={() => {
                      this.toggleTab("unpaid");
                    }}
                  >
                    Unpaid
                    <Badge className="badge-circle mrL5">
                      {this.state.invoiceCount.unpaid}
                    </Badge>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "draft"
                    })}
                    onClick={() => {
                      this.toggleTab("draft");
                    }}
                  >
                    Draft{" "}
                    <Badge className="badge-circle mrL5">
                      {this.state.invoiceCount.draft}
                    </Badge>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "all"
                    })}
                    onClick={() => {
                      this.toggleTab("all");
                    }}
                  >
                    All invoices{" "}
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent
                className="tab-container p-0"
                activeTab={this.state.activeTab}
              >
                <TabPane tabId="unpaid" className="tab-panel">
                  {invoiceData.length > 0 ? (
                    <div className="invoice-list-table tab-unpaid">
                        <DataTableWrapper
                          from="invoiceList"
                          data={invoiceData}
                          columns={columns}
                          classes= {'py-table py-table--condensed'}
                          // rowClasses={"py-table__row"}
                          defaultSorted={defaultSorted}
                        />
                    </div>
                  ) :

                    loading ?
                      ((<CenterSpinner />)) :
                      search ?
                      (<Fragment>
                        <div className="text-center">
                          <i className="fa fa-search mt-5 color-muted" style={{fontSize: '40px'}}/>
                            <div className="py-heading--section-title mt-3">No invoices found for your current filters.</div>

                          <p classNameName="lead">Verify your filters and try again.</p>
                        </div>
                      </Fragment>) :
                      this.state.invoiceCount.draft > 0 ?
                      (<Fragment>
                        <div className="text-center">
                          <div className="py-heading--section-title">
                            You have no unpaid invoices.
                        </div>
                          <p className="lead">
                            You have <span className="py-text--strong">{this.state.invoiceCount.draft}</span> draft invoices. What
                            will you like to do next?
                        </p>
                          <button
                            onClick={this.addInvoice}
                            className="btn btn-primary mr-2"
                          >
                            Create a new Invoice
                        </button>
                          <button className="btn btn-outline-primary"
                            onClick={() => {
                              let { filterData } = this.state;
                              filterData.status = "draft";
                              this.setState({ activeTab: "draft", filterData });
                              this.fetchInvoices
                            }
                            }
                          >
                            View drafts
                        </button>
                        </div>
                      </Fragment>)
                       : <NoDataMessage
                            title="invoice"
                            add={this.addInvoice}
                            filter={search}
                            secondryMessage="Create your first invoice and get paid for your excellent work."
                       />
                  }
                </TabPane>
                <TabPane tabId="draft" className="tab-panel">
                  {invoiceData.length > 0 ? (<div className="invoice-list-table tab-draft">
                    <DataTableWrapper
                      from="invoiceList"
                      data={invoiceData}
                      classes="py-table py-table--condensed"
                      columns={draftColumns}
                      defaultSorted={defaultSorted}
                    />
                    </div>) :
                    loading ?
                    ((<CenterSpinner />)) :
                    (<NoDataMessage
                      title="invoice"
                      add={this.addInvoice}
                      filter={search}
                      secondryMessage="Create your first invoice and get paid for your excellent work."
                    />)
                  }
                </TabPane>
                <TabPane tabId="all" className="tab-panel">
                {invoiceData.length > 0 ? (
                    <div className="invoice-list-table tab-all">
                      <DataTableWrapper
                        from="invoiceList"
                        data={invoiceData}
                        classes="py-table py-table--condensed"
                        columns={allColumns}
                        defaultSorted={defaultSorted}
                      />
                    </div>
                  ) :

                    loading ?
                      (<CenterSpinner />) :
                      (<NoDataMessage
                        title="invoice"
                        add={this.addInvoice}
                        filter={search}
                        secondryMessage="Create your first invoice and get paid for your excellent work."
                      />)
                  }
                </TabPane>
              </TabContent>
      </div>
    );
  }
}

const mapPropsToState = ({ snackbar, businessReducer }) => ({
  updateData: snackbar.updateData,
  businessInfo: businessReducer.selectedBusiness

});

export default withRouter(connect(mapPropsToState)(Invoice));
