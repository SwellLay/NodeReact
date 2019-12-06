import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import { StripeProvider, Elements } from 'react-stripe-elements';
import Button from '@material-ui/core/Button';

import { getInvoiceByUUID } from "../../../../../../api/InvoiceService";
import InjectedPayoutForm from './cardPayoutForm';
import BankPayoutForm from './bankPayoutForm'
import { convertDate, toDollar, getDateMMddyyyy, getStripeKey } from '../../../../../../utils/common';
import InvoicePreview from "../InvoicePreview";
import ReactToPrint from "react-to-print";
import { PDFExport } from "@progress/kendo-react-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment-timezone";
import InvoiceViewBrowser from '../InvoiceViewBrowser';

const styles = theme => ({
	body: {
		backgroundColor: '#f4f5f5'
	},
	subHeaderBar: {
		minWidth: '820px',
	    background: '#FFF',
	    borderTop: '1px solid #D0DBE1',
	    borderBottom: '1px solid #D0DBE1',
	    lineHeight: '50px',
	    textAlign: 'center',
	    marginBottom: '30px',
    	fontSize: '16px',
    	color: '#6C90A2'
	},
	button: {
		color: 'grey',
	    background: '#fff',
	    border: '1px solid grey',
	    padding: '10px 20px',
		textAlign: 'center',
		minWidth: '100px',
		borderRadius: '500px',
		display: 'inline-block',
		boxSizing: 'border-box',
		verticalAlign: 'middle',
		outline: 0,
		margin: '5px',
		'&:hover': {
			color: '#0b59b1',
	    	border: '1px solid #0b59b1',
	    	background: '#fff',
	    }
	}
})

class PublicPayout extends PureComponent {

	state = {
		invoiceData: null
	}

	componentDidMount() {
		const id = this.props.match.params.id;
		console.log('this.props', this.props.match)
		this.fetchInvoiceData(id);
	}

	fetchInvoiceData = async id => {
		try {
		  let response = await getInvoiceByUUID(id);
		  const invoiceData = response.data.invoice;
		  this.setState({ invoiceData });
		} catch (error) {
		  console.log("error", error);
		  // if (error.data) {
		  //   this.props.showSnackbar(error.message, true);
		  // }
		}
	};

	// Add this method to the React
	exportPDF = () => {
		// const input = this.resume;
		const { invoiceData } = this.state;
    const date = moment().format("YYYY-MM-DD");
		const input = document.getElementById("divIdToPrint");
		html2canvas(input).then(canvas => {
		  const imgData = canvas.toDataURL("image/png");
		  const pdf = new jsPDF();
		  pdf.addImage(imgData, "PNG", 0, 0, 210, 325);
		  pdf.save(`Invoice_${invoiceData.invoiceNumber}_${date}.pdf`);
		});
	};

	_setAmount = e => {
		const { name, value } = e.target;
		this.setState({
			invoiceData: {...this.state.invoiceData,
				dueAmount: parseFloat(value).toFixed(2)
			}
		})
	  }

	render() {
		const { classes } = this.props;
		const { invoiceData } = this.state;
		console.log('classes', invoiceData);
		if(invoiceData) {
			return (

				<Row className="justify-content-center no-gutters">
					{/* <Row style={{textAlign: 'center'}}>
					  <span style={{width: '100%', fontWeight: 'bold', fontSize: '30px', padding: '25px'}}>
						Request for Payment from {invoiceData.businessId.organizationName}
					  </span>
					</Row>
					<Row className={classes.subHeaderBar}>
						<span style={{width: '100%'}}>
							Invoice { invoiceData.invoiceNumber }<i className="fas fa-circle" style={{fontSize: '7px', padding: '12px'}}/>
							Amount due: { invoiceData.currency.symbol + invoiceData.amountBreakup.total }<i className="fas fa-circle" style={{fontSize: '7px', padding: '12px'}}/>
							Due on: { getDateMMddyyyy(invoiceData.dueDate) }
						</span>
					</Row>
						<Row style={{marginBottom: '24px'}}> */}
						<Col md={6} className="my-4">
							<Tabs bsPrefix="nav" defaultActiveKey={invoiceData && invoiceData.onlinePayments.modeCard ? 'card' : 'bank'} id="uncontrolled-tab-payment" className="payment-view__tabs">
								{
									invoiceData && invoiceData.onlinePayments.modeCard && (
										<Tab eventKey="card" title="Credit Card Payment" className="text-center payment-view__tabs__content">
											<StripeProvider apiKey={getStripeKey()}>
												<Elements>
													<InjectedPayoutForm invoiceData={invoiceData}
														showSnackbar={(message, err) => this.props.showSnackbar(message, err)}
														refreshData={() => this.props.refreshData()}
														openAlert={(item) => this.props.openAlert(item)}
														_setAmount={this._setAmount.bind(this)}
													/>
												</Elements>
											</StripeProvider>
										</Tab>
									)
								}
								{
									invoiceData && invoiceData.onlinePayments.modeBank && (
										<Tab eventKey="bank" title="Bank Payment (ACH)" className="payment-view__tabs__content pb-0">
												<BankPayoutForm invoiceData={invoiceData}
													refreshData = {() => this.props.refreshData()}
													showSnackbar={(message, err) => this.props.showSnackbar(message, err)}
													openAlert={(item) => this.props.openAlert(item)}
													/>
										</Tab>
									)
								}
							</Tabs>
						</Col>
						{/* </Row> */}
				</Row>
			)
		}
		else {
			return (<div> </div>)
		}
	}

}

const mapStateToProps = state => {
    return {
        payoutInfo: state
    };
};

export default withStyles(styles)(PublicPayout);