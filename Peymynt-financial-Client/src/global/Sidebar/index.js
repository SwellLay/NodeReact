import history from 'customHistory'
import React, { PureComponent } from 'react'
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader, Nav, Spinner } from 'reactstrap';
import { bindActionCreators } from "redux";

import * as BusinessAction from "../../actions/businessAction";
import { persistingStore } from "../../client";
import { privacyPolicy, terms } from "../../utils/GlobalFunctions";

let openBlocks = {
    salesOpen: false,
    purchaseOpen: false,
    accountingOpen: false,
    bankingOpen: false,
    payRollOpen: false
};
class Sidebar extends PureComponent {
    state = {
        activeSelected: '',
        modal: false,
        blockOpen: openBlocks,
        loading: false,
        selected: null
    };

    componentDidMount() {
        console.log("this.state", this.state);
        let blockOpen = JSON.parse(localStorage.getItem('sidebarToggleHistory'));
        if (!!blockOpen) {
            this.setState({
                blockOpen
            })
        }
        const { selectedBusiness } = this.props;
        this.fetchBusiness();
        document.title = selectedBusiness ? 'Peymynt -' +
          selectedBusiness.organizationName + '-Products & Services' : "Peymynt"
    }

    componentDidUpdate(nextProps, prevState) {
        // console.log("this.state", this.state, prevState)
    }

    fetchBusiness = async () => {
        let res = await this.props.actions.fetchBusiness();
        this.setState({
            selected: localStorage.getItem('businessId')
        })
    };
    toggle = () => {
        this.setState(prevState => { return { activeSelected: !prevState.activeSelected } });
    };

    sideToggle = () => {
        this.setState(prevState => {
            return { modal: !prevState.modal }
        });
    };

    onSignOut = () => {
        localStorage.clear();
        this.props.actions.logoutAction();
        persistingStore.purge();
        history.push('/login')
    };

    changeBusiness = async (e, business) => {
        this.setState({ loader: true });
        let userId = localStorage.getItem('user.id');
        let res = await this.props.actions.setSelectedBussiness(business);
        if (res.type = 'SELECTED_BUSINESS') {
            this.setState({
                loader: false,
                selected: res.selectedBusiness._id,
                blockOpen: {
                    ...openBlocks
                }
            })
        }
        localStorage.removeItem('sidebarToggleHistory');
        this.sideToggle();
        window.location.href = `${process.env.WEB_URL}/app/dashboard`
    };

    businessItems() {
        const { business, selectedBusiness } = this.props;
        const { selected } = this.state;
        let primary = localStorage.getItem('businessId');
        return business.length && business.map((item, i) => {
            return (
              <li key={'4.' + i} className="is-current" onClick={e => this.changeBusiness(e, item)}>
                  <a href="javascript:void(0)">
                      <span className="">{item.organizationName}</span>
                      {!!selected
                        ? item._id === selected ? <span className="check-icon"><i className="fa fa-check" aria-hidden="true"></i></span> : ""
                        : ""
                      }
                  </a>
              </li>
            );
        });
    }

    createNewBusiness = () => {
        this.sideToggle();
        history.push(`/business/add`)
    };

    _toggle = (from) => {
        console.log('from', from);
        let blockOpen = {
            ...openBlocks,
            [`${from}Open`]: !this.state.blockOpen[`${from}Open`]
        };
        this.setState({
            blockOpen
        });
        localStorage.setItem("sidebarToggleHistory", JSON.stringify(blockOpen))
    };

    _toggleStop = (from) => {
        console.log("stop from", from);
        this.setState({
            blockOpen: {
                ...openBlocks,
                [from]: true
            }
        })
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedBusiness !== nextProps.selectedBusiness) {
            this.setState({ loader: false })
        }
    }

    render() {
        let buildVersion = process.env.BUILD_VERSION || 'dev';
        // console.log("__WEBPACK_BUILD__VERSION__ ", buildVersion);
        const { selectedBusiness, business } = this.props;
        const { salesOpen, purchaseOpen, accountingOpen, bankingOpen, payRollOpen } = this.state.blockOpen;
        let userId = localStorage.getItem("user.id");
        let businessId = localStorage.getItem("businessId");
        let primary = business.length > 0 && business.filter(item => {
            return item._id === businessId
        });
        const businessName = primary.length > 0 ? primary[0].organizationName : "Peymynt";
        let boxClass = ["nav-dropdown-items nav-dropdown"];
        if (this.state.activeSelected) {
            boxClass.push('open');
        }
        return (

          <div className="side-nav">
              <div className="side-toggle" onClick={this.sideToggle} data-backdrop="false">
                  <div className="logo">
                      <img src="/assets/images/logo.png" />
                  </div>
                  <span className="mrL10 brand py-text--strong">{businessName}</span>
                  <span className="right-icon"><i className="fas fa-chevron-right"></i></span>
              </div>

              {
                  this.state.loader ?
                    (<Spinner color="primary" size="md" className="loader" />)
                    : (
                      <Nav>
                          <div className="nav-wrapper">
                              <ul className="nav nav-main">
                                  <li className="nav-item">
                                      <NavLink exact={true} className="nav-link" activeClassName='is-active'
                                        to='/app/launchpad/'>
                                      <svg viewBox="0 0 26 26" className="py-icon--lg" id="nav--launchpad" xmlns="http://www.w3.org/2000/svg"><path d="M3.873 21.287c-.305.293-.629.783-.782 1.622.839-.153 1.329-.477 1.622-.782l-.84-.84zM2 25a1 1 0 0 1-1-1c0-2.989 1.388-4.312 2.553-4.895a1 1 0 0 1 1.154.188l2 2c.305.305.38.77.187 1.154C6.311 23.612 4.989 25 2 25zm14-13a2 2 0 1 0-.001-4A2 2 0 0 0 16 12"></path><path d="M22.44 6.44l-2.88-2.88c1.05-.28 2.19-.47 3.41-.53-.06 1.2-.23 2.33-.53 3.41M8.28 18.86L7.1 17.68c.53-2.1 2.99-10.22 10.36-13.39l4.25 4.25c-2.02 4.64-6.47 8.04-13.43 10.32M24 1C15.08 1 10.18 6.4 7.6 11.09c-.02 0-.03.01-.05.02l-6 3A.989.989 0 0 0 1 15c0 .38.21.72.55.89l3.51 1.76c-.03.1-.04.16-.04.17-.06.32.04.65.27.89l2 2c.19.19.45.29.71.29.1 0 .2-.01.3-.05.02-.01.03-.01.05-.02l1.76 3.52c.17.34.51.55.89.55s.72-.21.89-.55l3-6c.05-.09.08-.2.09-.3C21.64 14.46 25 9.05 25 2c0-.55-.45-1-1-1"></path><path d="M12.5 15a1.5 1.5 0 1 0-.001-3 1.5 1.5 0 0 0 .001 3"></path></svg>
                                          <span className="py-nav__menu__link__text">Launchpad</span>
                                      </NavLink>
                                  </li>
                                  <li className="nav-item">
                                      <NavLink exact={true} className="nav-link" activeClassName='is-active'
                                        to='/app/dashboard'>
                                      <svg viewBox="0 0 26 26" className="py-icon--lg" id="nav--dashboard" xmlns="http://www.w3.org/2000/svg"><path d="M7.343 20A8.962 8.962 0 0 0 13 22c2.143 0 4.112-.75 5.657-2H7.343zm-1.766-1.909A.98.98 0 0 1 5.991 18h14.018a.98.98 0 0 1 .414.091 9 9 0 1 0-14.845 0zM13 24C6.925 24 2 19.075 2 13S6.925 2 13 2s11 4.925 11 11-4.925 11-11 11zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM7.293 9.707a1 1 0 0 1 1.414-1.414l1 1a1 1 0 0 1-1.414 1.414l-1-1zm11.414 0l-1 1a1 1 0 0 1-1.414-1.414l1-1a1 1 0 0 1 1.414 1.414zM12 7a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0V7zm6 8a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2h-2zM6 15a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2H6zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path></svg>
                                          <span className="py-nav__menu__link__text">Dashboard</span>
                                      </NavLink>
                                  </li>
                                  <li className="nav-item">
                                      <a onClick={this._toggle.bind(this, 'sales')} className={salesOpen ? "nav-link selected" : "nav-link"} activeClassName='is-active' href='javascript: void(0)'>
                                      <svg viewBox="0 0 26 26" className="py-icon--lg" id="nav--sales" xmlns="http://www.w3.org/2000/svg"><path d="M23 9.003V7c0-.552-.471-1-1.053-1H4.053C3.47 6 3 6.448 3 7v2h19.913c.03 0 .058.001.087.003zm0 1.994a1.103 1.103 0 0 1-.087.003H3v8c0 .552.471 1 1.053 1h17.894C22.53 20 23 19.552 23 19v-8.003zM4.13 4h17.74C23.598 4 25 5.343 25 7v12c0 1.657-1.402 3-3.13 3H4.13C2.402 22 1 20.657 1 19V7c0-1.657 1.402-3 3.13-3zm7.261 11h8.435a1 1 0 0 1 0 2h-8.435a1 1 0 0 1 0-2z"></path></svg>
                                          <span className="py-nav__menu__link__text">Sales</span>
                                          <span className="arrow">
                                                    <i className={salesOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-up open'}></i>
                                                </span>
                                      </a>
                                      <div style={{ display: salesOpen ? 'block' : 'none' }}>
                                          <ul className="subNav">
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to='/app/estimates'>
                                                      <span className="title">Estimates</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to='/app/invoices'>
                                                      <span className="title">Invoices</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to="/app/recurring">
                                                      <span className="title">Recurring Invoices</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to="/app/sales/checkouts">
                                                      <span className="title">Checkouts</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to="/app/payments">
                                                      <span className="title">Payments</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink exact={true} className="nav-link" activeClassName='is-active' to="/app/sales/customerstatements">
                                                      <span className="title">Customer Statements</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to='/app/sales/customer'>
                                                      <span className="title">Customers</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to='/app/sales/products'>
                                                      <span className="title"> Products & Services</span>
                                                  </NavLink>
                                              </li>
                                          </ul>
                                      </div>
                                  </li>
                                  <li className="nav-item">
                                      <a onClick={this._toggle.bind(this, 'purchase')} className={purchaseOpen ? "nav-link selected" : "nav-link"} activeClassName='is-active' href='javascript: void(0)'>
                                        <svg viewBox="0 0 26 26" className="py-icon--lg" id="nav--purchases" xmlns="http://www.w3.org/2000/svg"><path d="M8.395 15.007h11.793c.413 0 .777-.29.896-.712l2.045-7.288H7.646l.749 8zm-1.18-10H23.13c1.033 0 1.871.896 1.871 2 0 .195-.027.389-.079.575l-2.045 7.287c-.356 1.27-1.449 2.138-2.688 2.138H7.548c-.48 0-.883-.389-.93-.9l-.936-10a1.093 1.093 0 0 1-.003-.032L4.227 4H1.88C1.394 4 1 3.552 1 3s.394-1 .88-1h2.64c.047 0 .092.004.137.012a.934.934 0 0 1 .74.399l1.819 2.596zM10 24a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 2a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path></svg>
                                        <span className="py-nav__menu__link__text">Purchases</span>
                                        <span className="arrow">
                                                    <i className={purchaseOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-up open'}></i>
                                                </span>
                                      </a>
                                      <div style={{ display: purchaseOpen ? 'block' : 'none' }}>
                                          <ul className="subNav" onClick={this._toggleStop.bind(this, 'purchaseOpen')}>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to='/app/purchase/bills'>
                                                      <span className="title">Bills</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active'
                                                    to='/app/purchase/receipts'>
                                                      <span className="title">Receipts</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to="/app/purchase/vendors">
                                                      <span className="title">Vendors</span>
                                                  </NavLink>
                                              </li>
                                              <li className="nav-item">
                                                  <NavLink className="nav-link" activeClassName='is-active' to="/app/purchase/products">
                                                      <span className="title">Products & Services</span>
                                                  </NavLink>
                                              </li>
                                          </ul>
                                      </div>
                                  </li>
                                  {/* <li className="nav-item">
                                        <a onClick={this._toggle.bind(this, 'accounting')} className="nav-link" activeClassName='is-active' href='javascript: void(0)'>
                                            <i className="fa fa-balance-scale balanceIcon"></i>
                                            <span className="py-nav__menu__link__text">Accounting</span>
                                            <span className="arrow">
                                                <i className={accountingOpen ? 'fa fa-chevron-up open' : 'fa fa-chevron-up'}></i>
                                            </span>
                                        </a>
                                        <div style={{display: accountingOpen ? 'block' : 'none'}}>
                                            <ul className="subNav" onClick={this._toggleStop.bind(this, 'accountingOpen')}>
                                                <li className="nav-item">
                                                    <a className="nav-link" activeClassName='is-active' href='javascript:void(0)'>
                                                        <span className="title">Transactions</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a  className="nav-link" activeClassName='is-active' href='javascript:void(0)'>
                                                        <span className="title">Reconciliation</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a  className="nav-link" activeClassName='is-active' href="javascript:void(0)">
                                                        <span className="title">Chart of Accounts</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a  className="nav-link" activeClassName='is-active' href="javascript:void(0)">
                                                        <span className="title">Hire a BookKeeper</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li> */}
                                  <li className="nav-item">
                                      <a onClick={this._toggle.bind(this, 'banking')} className={bankingOpen ? "nav-link selected" : "nav-link"} activeClassName='is-active' href='javascript: void(0)'>
                                      <svg viewBox="0 0 26 26" className="py-icon--lg" id="nav--banking" xmlns="http://www.w3.org/2000/svg"><path d="M18.002 11h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm1 2v7h2v-7h-2zm-8-2h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm1 2v7h2v-7h-2zm-8-2h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm1 2v7h2v-7h-2zm-3.48-4.878l11-6a1 1 0 0 1 .958 0l11 6c.91.496.558 1.878-.478 1.878h-22c-1.036 0-1.389-1.382-.48-1.878zM20.08 8l-7.078-3.86L5.923 8H20.08zm3.922 15a1 1 0 0 1 0 2h-22a1 1 0 0 1 0-2h22z"></path></svg>
                                          <span className="py-nav__menu__link__text">Banking</span>
                                          <span className="arrow">
                                                    <i className={bankingOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-up open'}></i>
                                                </span>
                                      </a>
                                      <div style={{ display: bankingOpen ? 'block' : 'none' }}>
                                          <ul className="subNav" onClick={this._toggleStop.bind(this, 'bankingOpen')}>
                                              <li className="nav-item">
                                                <NavLink className="nav-link" activeClassName='is-active' to="/app/banking/bankconnections">
                                                      <span className="title">Bank Connections</span>
                                                </NavLink>
                                                
                                              </li>
                                              <li className="nav-item">
                                                <NavLink className="nav-link" activeClassName='is-active' to="/app/banking/payouts">
                                                      <span className="title">Payouts</span>
                                                </NavLink>
                                                 
                                              </li>
                                              {/* <li className="nav-item">
                                                  <a className="nav-link" activeClassName='is-active' href="javascript:void(0)">
                                                      <span className="title">Insurance</span>
                                                  </a>
                                              </li> */}
                                          </ul>
                                      </div>
                                  </li>
                                  {/*<li className="nav-item">
                                        <a onClick={this._toggle.bind(this, 'payRoll')} className="nav-link" activeClassName='is-active' href='javascript: void(0)'>
                                            <i className="py-icon pe pe-7s-wallet walletIcon"></i>
                                            <span className="py-nav__menu__link__text">Payroll</span>
                                            <span className="arrow">
                                                <i className={payRollOpen ? 'fa fa-chevron-up open' : 'fa fa-chevron-up'}></i>
                                            </span>
                                        </a>
                                        <div style={{display: payRollOpen ? 'block' : 'none'}}>
                                            <ul className="subNav" onClick={this._toggleStop.bind(this, payRollOpen)}>
                                                <li className="nav-item">
                                                    <a className="nav-link" activeClassName='is-active' href='javascript:void(0)'>
                                                        <span className="title">Run Payroll</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a  className="nav-link" activeClassName='is-active' href='javascript:void(0)'>
                                                        <span className="title">Employees</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a  className="nav-link" activeClassName='is-active' href="javascript:void(0)">
                                                        <span className="title">Timesheets</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a  className="nav-link" activeClassName='is-active' href="javascript:void(0)">
                                                        <span className="title">Taxes</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a  className="nav-link" activeClassName='is-active' href="javascript:void(0)">
                                                        <span className="title">Tax Forms</span>
                                                    </a>
                                                </li><li className="nav-item">
                                                    <a  className="nav-link" activeClassName='is-active' href="javascript:void(0)">
                                                        <span className="title">Direct Deposite</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li> */}
                                  {/* <li className="nav-item">
                                        <a className="nav-link" activeClassName='is-active' to='/app/setting/invoice-customization' href="javascript: void(0)">
                                            <i className="fa fa-signal salesIcon"></i>
                                            <span className="title">Reports</span>
                                        </a>
                                    </li> */}
                                  <div class="py-divider"></div>
                                  {/* <li className="nav-item">
                                            <i className="py-icon pe pe-7s-settings"></i>
                                            <span className="title">Invoice Customization</span>
                                    </li> */}
                                  <li className="nav-item">
                                      <a className="nav-link extra-Link" href="javascript:void(0)">
                                          <span className="title extraLink">Peymynt+</span>
                                      </a>
                                  </li>
                                  <li className="nav-item">
                                      <a className="nav-link extra-Link" href="javascript:void(0)">
                                          <span className="title extraLink">Integrations</span>
                                      </a>
                                  </li>
                                  <li className="nav-item">
                                      <NavLink className="nav-link extra-Link" activeClassName='is-active' to='/app/setting/invoice-customization'>
                                          <span className="title extraLink">Settings</span>
                                      </NavLink>
                                  </li>
                              </ul>
                              <hr></hr>
                              <ul className="nav nav-footer">
                                  <li className="nav-item">
                                     <div className="d-flex justify-content-center align-items-center">
                                      <button className="btn btn-rounded mg-r-l-5 btn-gray-accent btn btn-secondary">
                                          <i className="far fa-question-circle"></i>
                                          Help
                                      </button>
                                      {/* <button className="btn btn-secondary"> */}
                                          {/* <span className="toggleStatus online"></span> */}
                                          {/* <i className="fa fa-circle off"></i>
                                          Live Chat
                                      </button> */}
                                      </div>
                                  </li>
                                  <li className="nav-item">
                                      <div style={{ fontSize: '10px', padding: '2px' }} id='deployDate'>build {buildVersion}</div>
                                  </li>
                              </ul>
                          </div>

                      </Nav>

                    )
              }

              <Modal isOpen={this.state.modal} toggle={this.sideToggle} className="modal-side js-biz-modal-panel">
                  <ModalHeader toggle={this.sideToggle}>
                      <div className="py-biz-switcher--logo">
                        <img src="/assets/images/logo.png" />
                      </div>
                      <div className="pm-biz-switcher--title">
                          Your Peymynt account
                      </div>
                      </ModalHeader>
                  <ModalBody>
                      <div className="menu-content">
                          <ul className="business-menu">

                              {this.businessItems()}
                              {/* <li>
                                    <a href="javascript:void(0)">
                                        <span className="">
                                            Personal
                                </span>
                                    </a>
                                </li> */}
                          </ul>
                          <div className="business-menu-add">
                              <a className="py-text--link" onClick={this.createNewBusiness}>
                                <svg viewBox="0 0 26 26" className="py-icon--lg text-dark mr-2" id="add--large" xmlns="http://www.w3.org/2000/svg"><path d="M13 24C6.925 24 2 19.075 2 13S6.925 2 13 2s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 8a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0V8z"></path><path d="M8 14a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2H8z"></path></svg>

                                  Create a new business </a>
                          </div>
                      </div>
                      <div className="pt-modal-foo">
                          <span className="py-text py-text--small">You're signed in as <span className="py-text--strong">{localStorage.getItem('user.email')}</span></span>
                          <ul className="py-biz-switch__menu">
                              <li className="py-biz-switch__menu-item" key={'3.1'} onClick={this.sideToggle}>
                                  <NavLink className="py-text--link" to={`/app/${userId}/accounts`}>
                                  <svg className="py-icon--lg text-dark mr-2" viewBox="0 0 26 26" id="profile--large" xmlns="http://www.w3.org/2000/svg"><path d="M13 24C6.925 24 2 19.075 2 13S6.925 2 13 2s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M13 14c-2.122 0-4-1.878-4-4s1.878-4 4-4 4 1.878 4 4-1.878 4-4 4zm0-2c1.017 0 2-.983 2-2s-.983-2-2-2-2 .983-2 2 .983 2 2 2zM6.894 20.447l-1.788-.894C6.615 16.535 9.3 15 13 15s6.385 1.535 7.894 4.553l-1.788.894C17.948 18.132 15.967 17 13 17s-4.948 1.132-6.106 3.447z"></path></svg>
                                      Manage your profile
                                  </NavLink>
                              </li>
                              <li className="py-biz-switch__menu-item" key={'3.2'}>
                                  <a className="py-text--link" href="javascript:void(0)" onClick={this.onSignOut}>
                                    <svg className="py-icon--lg text-dark mr-2" viewBox="0 0 26 26" id="logout--large" xmlns="http://www.w3.org/2000/svg"><path d="M11.3 21a1 1 0 0 1 0 2H6.8A2.8 2.8 0 0 1 4 20.2V5.8A2.8 2.8 0 0 1 6.8 3h4.5a1 1 0 1 1 0 2H6.8a.8.8 0 0 0-.8.8v14.4a.8.8 0 0 0 .8.8h4.5zM17.35 10.76a1 1 0 1 1 1.3-1.52l3.6 3.086a1 1 0 0 1 0 1.519l-3.6 3.086a1 1 0 0 1-1.3-1.519l2.713-2.326-2.714-2.327z"></path><path d="M20.8 12a1 1 0 0 1 0 2H10a1 1 0 1 1 0-2h10.8z"></path></svg>
                                    Sign out
                                  </a>
                              </li>
                          </ul>
                      </div>

                  </ModalBody>
                  <ModalFooter className="text-left">
                      <a className="text-muted" onClick={() => terms()} href="#"> Terms </a>
                      <small className="text-muted">•</small>
                      <a className="text-muted" onClick={() => privacyPolicy()} href="#"> Privacy </a>
                  </ModalFooter>
              </Modal>
          </div>


        )
    }
}

const mapStateToProps = state => {
    return {
        business: state.businessReducer.business,
        selectedBusiness: state.businessReducer.selectedBusiness,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(BusinessAction, dispatch)
    };
};


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
);
