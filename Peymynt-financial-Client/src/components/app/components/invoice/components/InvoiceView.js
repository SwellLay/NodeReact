import React, { PureComponent } from "react";
import jsPDF from "jspdf";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button
} from "reactstrap";
import { PDFExport } from "@progress/kendo-react-pdf";
import ReactToPrint from "react-to-print";
import { fetchEstimateById } from "../../api/EstimateServices";
import { EstimateSpan, EstimateBillToComponent, RenderShippingAddress, EstimateInfoComponent, EstimateItems, EstimateBreakup } from "../app/components/Estimates/components/EstimateInvoiceComponent";
import { openGlobalSnackbar } from "../../actions/snackBarAction";
import { invoiceInput } from "../helpers";
import moment from "moment-timezone";

class InvoiceView extends PureComponent {
  state = {
    openModal: false,
    dropdownOpen: false,
    dropdownOpenMore: false,
    modal: false,
    invoiceModal: false,
    selectedCustomer: null,
    invoiceData: invoiceInput()
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    this.fetchInvoiceData(id);
  }

  fetchInvoiceData = async id => {
    try {
      let response = await fetchEstimateById(id);
      const invoiceData = response.data.estimate;
      this.setState({ invoiceData });
    } catch (error) {
      console.error("error", error);
      if (error.data) {
        this.props.showSnackbar(error.message, true);
        history.push("/app/invoices");
      }
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
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save(`Invoice_${invoiceData.estimateNumber}_${date}.pdf`);
    });
  };

  printPDF = () => {
    window.print();
  };

  render() {
    const { invoiceData } = this.state;
    const { businessInfo } = this.props;
    const sign = invoiceData.currency ? invoiceData.currency.symbol : ''
    return (
      // Add this to the render method
      // Add this to the render method
      <div>
        
        {/* <div style={{ textAlign: 'center', marginBottom: 10 }}><Button onClick={this.printPDF} style={{ margin: 'auto' }}>Print</Button></div> */}

        <PDFExport
          fileName="Estimate_Report.pdf"
          title=""
          subject=""
          keywords=""
          ref={r => (this.resume = r)}
        >
          <div
            id="divIdToPrint"
            style={{
              height: "100%",
              width: "60%",
              padding: "none",
              backgroundColor: "none",
              margin: "auto",
              overflowX: "hidden",
              overflowY: "hidden"
            }}
          >
            <div className="invoice-preview__actions">
          <ReactToPrint
            trigger={() => <Button className="btn-outline-primary"> Print </Button>}
            content={() => this.componentRef}
          />
          <Button className="btn-outline-primary" onClick={this.exportPDF}>
            Download PDF
          </Button>
        </div>
        
            <div ref={el => (this.componentRef = el)}>
              <Container>
                <Row>
                  <Col xs="12">
                    <Card className="border-0 card-invoice">
                      <CardHeader className="text-right">
                        <div className="heading-title">
                          {invoiceData.name.toUpperCase()}
                        </div>
                        <div className="heading-subtitle">
                          {invoiceData.subheading || ""}
                        </div>
                        <div className="heading-subtitle"> </div>
                        <EstimateSpan
                          estimateKey={businessInfo.organizationName}
                        />
                        <div className="info-address">
                          {businessInfo.country
                            ? businessInfo.country.name
                            : ""}
                        </div>
                      </CardHeader>
                      <div className="divider-full-width" />
                      <CardBody>
                        <section className="template-metadata">
                          <div className="template-metadata-customer">
                            <EstimateBillToComponent
                              estimateKeys={invoiceData.customer}
                            />
                            {invoiceData.customer ? (
                              <RenderShippingAddress
                                addressShipping={
                                  invoiceData.customer.addressShipping
                                }
                              />
                            ) : null}
                          </div>
                          <EstimateInfoComponent
                            estimateKeys={invoiceData}
                            sign={sign}
                          />
                        </section>
                        <EstimateItems
                          estimateItems={invoiceData.items}
                          sign={sign}
                        />
                        <div className="template-divider-bold" />
                        <EstimateBreakup
                          estimateInfo={invoiceData}
                          sign={sign}
                        />
                        {invoiceData.memo && (
                          <div className="template-memo">
                            <div>
                              <span
                                style={{ fontWeight: "bold" }}
                                className="text-strong"
                              >
                                Notes
                              </span>
                            </div>
                            <span>{invoiceData.memo}</span>
                          </div>
                        )}
                        <div className="template-footer">
                          <span className="text-fine-print">
                            {invoiceData.footer}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </PDFExport>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  businessInfo: state.businessReducer.selectedBusiness
});

const mapDispatchToProps = (dispatch) => {
  return {
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(InvoiceView);
