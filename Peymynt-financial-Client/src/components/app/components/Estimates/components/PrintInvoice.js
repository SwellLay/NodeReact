import React from 'react';
import InvoicePrintComponent from "./InvoicePrintComponent";
import { PDFExport } from '@progress/kendo-react-pdf';
import { Container, Row, Col } from 'reactstrap';
class PrintInvoice extends React.Component {
    componentDidMount() {
        if (this.props.onPrint) {
            this.resume.save();
            setTimeout(() => {
                this.props.onCloseExport()
            }, 100);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.onPrint !== prevProps.onPrint) {
            if (this.props.onPrint) {
                this.resume.save();
                setTimeout(() => {
                    this.props.onCloseExport()
                }, 100);
            }

        }
    }
    exportPDF = () => {
        this.resume.save();
        setTimeout(() => {
            this.props.onCloseExport()
        }, 100);
    }
    render() {
        return (
            this.props.onPrint ? (

                <div>
                    <PDFExport
                        fileName="Estimate_.pdf"
                        title=""
                        subject=""
                        keywords=""
                        ref={(r) => this.resume = r}>
                        <div
                            style={{
                                height: '100%',
                                width: '60%',
                                padding: 'none',
                                backgroundColor: 'white',
                                boxShadow: '5px 5px 5px black',
                                margin: 'auto',
                                overflowX: 'hidden',
                                overflowY: 'hidden'
                            }}
                        >
                            <Container>
                                <Row>
                                    <Col xs="12">
                                        <InvoicePrintComponent {...this.props} />
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </PDFExport>
                </div >)
                : '')

    }
}

export default PrintInvoice;