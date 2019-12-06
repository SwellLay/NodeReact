import React, { PureComponent, Fragment } from "react";
import jsPDF from "jspdf";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import {
    Button,
    Spinner
} from "reactstrap";
import { PDFExport } from "@progress/kendo-react-pdf";
import ReactToPrint from "react-to-print";
import { getInvoice } from "../../../../../api/InvoiceService";
import { openGlobalSnackbar } from "../../../../../actions/snackBarAction";
import { invoiceInput } from "../helpers";
import InvoicePreview from "../components/InvoicePreview";
import InvoicePreviewClassic from "./InvoicePreviewClassic";
import InvoicePreviewModern from "./InvoicePreviewModern";
import { invoiceSettingPayload } from "../../setting/components/supportFunctionality/helper";
import { fetchSalesSetting } from "../../../../../api/SettingService";
import moment from "moment-timezone";
import { PoweredBy } from "../../../../common/PoweredBy";
import CenterSpinner from "../../../../../global/CenterSpinner";

class InvoiceCustomerView extends PureComponent {
    resume;
    state = {
        openModal: false,
        dropdownOpen: false,
        dropdownOpenMore: false,
        modal: false,
        invoiceModal: false,
        selectedCustomer: null,
        invoiceData: invoiceInput(),
        userSettings: invoiceSettingPayload(),
        loading: true,
        print: false
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        this.fetchInvoiceData(id);
    }

    fetchInvoiceData = async id => {
        try {
            let invoiceResponse = await getInvoice(id);
            const settingResponse = await fetchSalesSetting()
            const invoiceData = invoiceResponse.data.invoice;
            const userSettings = settingResponse.data.salesSetting
            this.setState({ invoiceData, userSettings, loading: false });
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
        this.setState({ print: true })
        this.resume.save();
    };

    printPDF = () => {
        window.print();
    };

    renderInvoiceReceipt = () => {
        const { invoiceData, userSettings } = this.state;
        if (userSettings.template === "classic") {
            return (<InvoicePreviewClassic
                ref={el => (this.componentRef = el)}
                invoiceData={invoiceData}
                userSettings={userSettings}
            />)
        } else if (userSettings.template === "modern") {
            return (<InvoicePreviewModern
                ref={el => (this.componentRef = el)}
                invoiceData={invoiceData}
                userSettings={userSettings}
            />)
        } else {
            return (<InvoicePreview
                ref={el => (this.componentRef = el)}
                invoiceData={invoiceData}
                userSettings={userSettings}
            />)
        }
    }

    render() {
        const {loading} = this.state;
        return (
            <Fragment>
                {loading ? <CenterSpinner /> : 
                    <div>
                        
                        <PDFExport
                            fileName="Invoice_Report.pdf"
                            title=""
                            subject=""
                            keywords=""
                            ref={r => (this.resume = r)}
                        >


                            <div
                                id="divIdToPrint"
                                style={{
                                    // height: "100%",
                                    width: this.state.print ? "60%" : '100%',
                                    padding: "none",
                                    margin: "auto",
                                    overflowX: "hidden",
                                    overflowY: "hidden",
                                    minHeight: '297mm',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                            >

                                <div>

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
                                        {this.renderInvoiceReceipt()}
                                    </div>
                                </div>
                            </div>
                        </PDFExport>
                        <PoweredBy />
                    </div>
                }
            </Fragment>
        );
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceCustomerView);
