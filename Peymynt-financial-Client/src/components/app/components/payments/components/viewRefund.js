import React, { PureComponent, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link, browserHistory } from 'react-router-dom';
import compose from 'recompose/compose';
import { connect } from "react-redux";
import moment from 'moment';
import { Container, Row, Col, Tabs, Tab, InputGroup, Form, FormControl, Modal } from 'react-bootstrap';
import Cards from 'global/Card';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import * as PaymentIcon from 'global/PaymentIcon';
import { getRefundById, getRefundByPaymentId } from '../../../../../actions/paymentAction';
import { toMoney, getAmountToDisplay } from "../../../../../utils/GlobalFunctions";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { PaymentDetails } from "./PaymentDetails";
import { toDisplayDate } from "../../../../../utils/common";


const styles = theme => ({
  statusSUCCESS: {
    padding: '3px',
    color: 'white',
    backgroundColor: '#23c770',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: '12px',
    borderRadius: '3px',
    maxWidth: '125px',
  },
  statusDECLINED: {
    padding: '3px',
    color: 'white',
    backgroundColor: '#dac521',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: '12px',
    borderRadius: '3px',
    maxWidth: '125px',
  },
  statusREFUNDED: {
    padding: '3px',
    color: 'white',
    backgroundColor: '#23c770',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: '12px',
    borderRadius: '3px',
    maxWidth: '125px',
  },
  paymentExpandableBodySuccess: {
    padding: '14px',
    background: '#fcfbe3'
  },
  paymentExpandableBodyDeclined: {
    padding: '14px',
    background: '#fcfbe3'
  },
  viewInvoiceButton: {
    color: '#fff',
    background: '#136acd',
    border: '1px solid transparent',
    padding: '6px 20px',
    textAlign: 'center',
    minWidth: '100px',
    borderRadius: '500px',
    display: 'inline-block',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
    outline: 0,
    margin: '10px',
    '&:hover': {
      background: '#0b59b1',
    }
  },
  refundButton: {
    color: '#136acd',
    background: '#fff',
    border: '1px solid transparent',
    padding: '6px 20px',
    textAlign: 'center',
    minWidth: '100px',
    borderRadius: '500px',
    display: 'inline-block',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
    outline: 0,
    margin: '10px',
    '&:hover': {
      border: '1px solid #136acd',
    }
  },
  paymentFooter: {
    width: '100%',
    textAlign: 'right'
  },
  expandableHeader: {
    fontSize: '20px',
    fontWeight: '600',
    paddingBottom: '10px'
  },
  expandableSubHeader: {
    marginBottom: '27px',
    color: 'dimgrey',
    whiteSpace: 'initial'
  },
  myAccount: {
    width: '260px',
    height: '150px',
    background: 'linear-gradient(25deg, #013aff, #7f92ff)',
    borderRadius: '16px',
    textAlign: 'left',
    paddingTop: '18%',
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    paddingLeft: '22px'
  },
  dropDownItems: {
    fontSize: '14px',
    whiteSpace: 'pre-line',
    padding: '5px'
  },
  refundDialog: {
    maxWidth: '610px'
  },
  editAmount: {
    maxWidth: '70px',
    marginTop: '-2px',
    marginRight: '4px',
    marginLeft: '4px',
    maxHeight: '28px',
    '&:disabled': {
      border: '0px',
      width: '50px',
      backgroundColor: 'transparent',
      marginTop: '-2px'
    }
  }
})

class ViewRefund extends PureComponent {

  state = {
    modal_0: false,
    editMountRefund: true
  }

  componentDidMount() {
    this.props.getRefundByPaymentId(this.props.match.params.id);
  }

  isPaymentListExpandable = (row) => {
		return true;
  }

  refundListExpandableComponent = (row) => {
		const { classes } = this.props;
		let currency = row.currency.symbol;
		let account = row.ownAccount.accountNumber.split('');
		account.splice(0, account.length - 3, 'xxxx');
		account = account.join('');
		return (
			<div className={classes.paymentExpandable}>
				<div className={row.status == 'SUCCESS' ? classes.paymentExpandableBodySuccess : classes.paymentExpandableBodyDeclined}>
					<div>
						<div className={`${classes.expandableHeader} expandHeader`}>
							Refunded for&nbsp;
							{
								row.paymentType.toLowerCase() == "invoice" ?
								<Fragment>
									<Link style={{color: '#0a7d4e'}} to={"/app/invoices/view/" + row.invoiceId}>{`Invoice #${row.other ? row.other.invoiceNo : ''}`}</Link>
								</Fragment> :
								<Fragment>
									<Link style={{color: '#0a7d4e'}} to={"/app/sales/checkouts/edit/" + row.checkoutId}>{`${row.other ? row.other.checkoutName : ''}`}</Link>
								</Fragment>
							}
							<span>&nbsp;due to {row.reason}</span>
							 {/* <Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>{`${row.paymentType} #${row.other.invoiceNo}`}</Link> {row.reason ? 'due to ' + row.reason : ''} */}
						</div>
						<div className={`${classes.expandableSubHeader} expandSubHeader`}>
							<i className="fas fa-info-circle" /> Refund on {moment.parseZone(row.date).format("MMMM DD, YYYY")}
						</div>
					</div>
					{/* {
						this.getHeaderOfExpandable(row)
					} */}
					<PaymentDetails row={row} {...this.props} account={account} />
				</div>
				<div className="d-flex justify-content-end py-3">
					<Link to={'/app/payments/view-payment/' + row.paymentId}>
						<button className="btn btn-outline-primary mr-2">
							View Original Payment
						</button>
					</Link>
					<Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.invoiceId : '/app/sales/checkouts/edit/' + row.checkoutId}>
						<button className="btn btn-primary">
							View {row.paymentType}
						</button>
					</Link>
				</div>
			</div>
		)
	}

  refunds = (props) => {
		let { classes } = props;
		let data = [];
		if (props.refundList) {
			props.refundList.map((d, i) => {
				data.push({
					id: d.id,
					status: d.status,
					method: d.paymentIcon,
					date: d.refundDate,
					customer: `${d.customer.firstName} ${d.customer.lastName}`,
					amount: d.amount,
					account: d.account,
					paymentType: d.paymentType,
					linkId: d[d.paymentType.toLowerCase()],
					ownAccount: d.ownAccount,
					index: i,
					// refund: d.refund.id,
					card: d.card,
					bank: d.bank,
					invoiceId: d.invoiceId,
					checkoutId: d.checkoutId,
					account: d.account,
					reason: d.reason,
					paymentId: d.payment.id,
					currency: d.currency,
					other: d.other
				})
			})
		}
		return (
			<BootstrapTable className={`${classes.table}`} data={data} bordered={false}
				expandableRow={this.isPaymentListExpandable}
				trClassName={"py-table__row"}
				classes={'py-table--condensed'}
				expandComponent={this.refundListExpandableComponent} pagination>

				<TableHeaderColumn dataField='id' isKey hidden>Id</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='status' dataFormat={(cell, row) => {
					return (<div className={classes['status' + cell]}>{cell}</div>)
				}} width="200px">Status</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='method' dataFormat={(cell, row) => {
					let icon = PaymentIcon[cell] ? PaymentIcon[cell] : cell;
					// console.log("icon", cell)
					return (<img src={icon} width='35px' />)
				}} width="120px">Method</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='date' dataFormat={(cell, row) => {
					return toDisplayDate(cell, true, "MMM D, YYYY @ HH:mm A")
				}}>Refund Date</TableHeaderColumn>

				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell`} dataField='customer'>Customer</TableHeaderColumn>
				<TableHeaderColumn columnClassName={`${classes.tableColumn} py-table__cell`} className={`py-table__cell-amount text-right`} dataField='totalAmount' dataFormat={(cell, row) => {
					let currency = row.currency
					return (<div className={`${classes.payments} color-default`} style={{ textAlign: 'right' }}>{getAmountToDisplay(currency, row.amount)}</div>)
				}}>Refund Amount</TableHeaderColumn>

			</BootstrapTable>
		)
	}

  render() {
    let row = null;
    const { classes, refundInfo } = this.props;
    let currency = '$';
    let account = null;
    let Refunds = this.refunds
    if (refundInfo) {
      row = {
        id: refundInfo.id,
        status: refundInfo.status,
        // method: refundInfo.account.type.toLowerCase(),
        date: refundInfo.refundDate,
        customer: refundInfo.customer.firstName + ' ' + refundInfo.customer.lastName,
        account: refundInfo.account,
        totalAmount: refundInfo.amount,
        paymentType: refundInfo.paymentType,
        linkId: refundInfo.id,
        ownAccount: refundInfo.ownAccount,
        reason: refundInfo.reason
      }
      account = row.ownAccount.accountNumber.split('');
      account.splice(0, account.length - 3, 'xxxx');
      account = account.join('');
    }
    console.log("refundList", this.props.refundList)
    // if (row) {
      return (
        <div style={{
          minWidth: '950px',
          marginRight: 'auto',
          marginLeft: 'auto',
          padding: '10px',
          boxShadow: '1px 2px 5px lightgrey'
        }}>
          <h1>Payment details</h1>
          {/* <div className={classes.paymentExpandable}>
            <div className={row.status == 'SUCCESS' ? classes.paymentExpandableBodySuccess : classes.paymentExpandableBodyDeclined}>
              <div>
                <div className={classes.expandableHeader}>
                  Refunded payment for <Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>{row.paymentType}</Link> {row.reason ? 'due to ' + row.reason : ''}
                </div>
                <div className={classes.expandableSubHeader}>
                  <i className="fas fa-info-circle" /> Refund on {moment.parseZone(row.date).format("MMMM DD, YYYY")}
                </div>
              </div>
              <Container>
                <Row>
                  <Col xs={4}>
                    <Row style={{
                      borderTop: '1px',
                      borderTopColor: 'black',
                      borderTopStyle: 'solid',
                      padding: '10px'
                    }}>
                      <Col style={{ textAlign: 'left' }}>Your customer gets</Col>
                      <Col style={{ textAlign: 'right' }}>{currency + toMoney(row.totalAmount)}</Col>
                    </Row>
                  </Col>
                  <Col style={{ marginLeft: '50px' }}>
                    <Row>
                      <Col style={{
                        paddingLeft: '0px',
                        paddingRight: '0px',
                        marginRight: '0px'
                      }}>
                        <Row style={{
                          marginBottom: '10px',
                          color: 'darkgrey',
                          fontWeight: '600',
                          fontSize: '12px'
                        }}>
                          Your customer's credit card
                    </Row>
                        <Row>
                          <Cards
                            number={row.account.number + ''}
                            name={row.customer}
                            issuer={row.account.type.toLowerCase()}
                            preview={true}
                          />
                        </Row>
                      </Col>

                      <Col>

                      </Col>

                      <Col>
                        <Row style={{
                          marginBottom: '10px',
                          color: 'darkgrey',
                          fontWeight: '600',
                          fontSize: '12px'
                        }}>
                          Your account
                    </Row>
                        <Row>
                          <div className={classes.myAccount} >
                            <div style={{ margin: 'auto' }}>
                              <Row>
                                <Col xs={3}>
                                  <i className="fas fa-university" style={{ fontSize: '50px' }}></i>
                                </Col>
                                <Col xs={5}>
                                  <div style={{ fontSize: '18px', fontWeight: '200' }}>{row.ownAccount.bankName}</div>
                                  <div>{account}</div>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="d-flex justify-content-end py-3">
              <Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>
                <Button className="btn btn-outline-primary mr-2">
                  View Original Payment
            </Button>
              </Link>
              <Link to={row.paymentType.toLowerCase() == "invoice" ? "/app/invoices/view/" + row.linkId : '/app/sales/checkouts/edit/' + row.linkId}>
                <Button className="btn btn-primary">
                  View {row.paymentType}
                </Button>
              </Link>
            </div>
          </div> */}
          <Refunds {...this.props}/>
        </div>
      )
  }

}

const mapStateToProps = (state) => {
  return {
    refundInfo: state.paymentReducer.refundInfo,
    refundList: state.paymentReducer.refundList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRefundByPaymentId: (body) => {
      dispatch(getRefundByPaymentId(body))
    }
  }
}

export default compose(
  withStyles(styles, { name: 'Refunds' }),
  connect(mapStateToProps, mapDispatchToProps)
)(ViewRefund);