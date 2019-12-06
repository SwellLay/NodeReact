import React, { Fragment } from "react";
import {
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Card,
    Button,
    CardTitle,
    CardText,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Input,
    Spinner
} from "reactstrap";
import { cloneDeep } from "lodash";
import { connect } from "react-redux";

import SelectBox from "utils/formWrapper/SelectBox";
import classnames from "classnames";
// import { sendMail, sendInvoice } from "../../../../../../api/InvoiceService";
import { updateData, openGlobalSnackbar } from "../../../../../../actions/snackBarAction";
import { mailMessage, statementMailMessage } from "../helpers";
import { sendMail, sendInvoice } from "../../../../../../api/InvoiceService";
import moment from "moment";

class MailStatement extends React.Component {
    state = {
        activeTab: "1",
        editSubject: false,
        sentVia: undefined,
        mailStatement: {
            from: "",
            to: [""],
            subject: ``,
            message: "",
            self: false,
            attachPDF: false
        },
        mailFrom: [],
        loading: false,
    };

    componentDidMount() {
        this.setMailStatementObj();
    }

    componentDidUpdate(previousProps) {
        const { invoicesStatementData } = this.props;
        if (previousProps.invoicesStatementData != invoicesStatementData) {
            this.setMailStatementObj();
        }
    }

    setMailStatementObj() {
        const { invoicesStatementData, businessInfo } = this.props;
        let { mailStatement } = this.state;
        mailStatement.subject = `Statement of Account from ${(businessInfo)? businessInfo.organizationName : ''}`;
        mailStatement.from = localStorage.getItem("user.email");
        mailStatement.to = [`${(invoicesStatementData.customer && invoicesStatementData.customer.email) ? invoicesStatementData.customer.email : ""}`]
        this.setState({ mailStatement });
        this.setFromOptions(mailStatement.from);
    }

    setFromOptions(from) {
        let { mailFrom } = this.state;
        if(mailFrom && mailFrom.length <= 0){
            mailFrom.push({
                value: from,
                label: from
            });
            this.setState({ mailFrom });
        }
    }

    toggleTab = tab => {
        let queryString = "";
        if (this.state.activeTab !== tab) {
            queryString = tab !== "all" ? `status=${tab}` : "";
            this.setState({
                activeTab: tab
            });
        }
    };

    addToMailAddress = () => {
        let mailStatement = cloneDeep(this.state.mailStatement);
        mailStatement.to.push("");
        this.setState({ mailStatement });
    };

    removeMailAddress = idx => {
        let mailStatement = cloneDeep(this.state.mailStatement);
        mailStatement.to = mailStatement.to.filter((item, index) => {
            return index !== idx;
        });
        if (mailStatement.to.length <= 0) {
            mailStatement.to.push("");
        }
        this.setState({ mailStatement });
    };

    handleMailInvoice = (event, index) => {
        const { value, name, type } = event.target;
        let mailStatement = this.state.mailStatement;
        if (index !== undefined) {
            mailStatement[name][index] = value;
        } else {
            if (type === "checkbox") {
                mailStatement[name] = !mailStatement[name];
            } else {
                mailStatement[name] = value;
            }
        }
        this.setState({ mailStatement });
    };

    onCancelClick = () => {
        this.setState({
            activeTab: "1",
            editSubject: false,
            mailStatement: {
                from: "",
                to: [""],
                subject: "",
                message: "",
                self: false,
                attachPDF: false
            }
        });
        this.props.on.Close;
    };

    onEditSubject = () => {
        this.setState({
            editSubject: true
        })
    }

    closeMailInvoice = () => {
        const { onClose } = this.props
        this.setState({ sentVia: undefined })
        onClose()
    }

    sendMailToCustomer = async (e) => {
        e.preventDefault();
        const { invoicesStatementData, refreshData, showSnackbar } = this.props
        let { mailStatement, sentVia } = this.state
        let payload
        console.log(' invoicesStatementData ', invoicesStatementData);
        try {
            this.setState({ loading: true });
            if (sentVia) {
                payload = {
                    invoiceInput: {
                        status: 'sent',
                        sentVia: sentVia,
                        sentDate: moment().format('YYYY-MM-DD')
                    }
                };
                await sendInvoice(invoicesStatementData._id, payload)
            } else {
                payload = {
                    emailInput: mailStatement
                }
                await sendMail(invoicesStatementData._id, payload)
            }
            refreshData();
            this.closeMailInvoice()
            this.setState({ loading: false });
        } catch (error) {
            const errorMessage = error.message
            showSnackbar(errorMessage, true);
            this.setState({ loading: false });
        }
    }

    renderSendAddress = () => {
        const to = this.state.mailStatement.to;
        return (
            <FormGroup row style={{marginBottom: '0'}}>
                <Label for="exampleEmail" sm={3} className="text-right pdR0">
                    To
                </Label>
                <Col sm={8}>
                    {to.map((address, index) => {
                        return index === 0 ? (
                            <div key={index} className="group-input" style={{marginBottom: '0'}}>
                                <Input
                                    type="email"
                                    name="to"
                                    value={address}
                                    onChange={e => this.handleMailInvoice(e, index)}
                                />
                                <a onClick={this.addToMailAddress}>
                                    {" "}
                                    <i className="fa fa-plus"></i>
                                </a>
                            </div>
                        ) : (
                                <div key={index} className="group-input">
                                    <Input
                                        type="email"
                                        name="to"
                                        value={address}
                                        onChange={e => this.handleMailInvoice(e, index)}
                                    />
                                    <a onClick={() => this.removeMailAddress(index)}><i className="fa fa-times"></i></a>
                                </div>
                            );
                    })}
                </Col>
            </FormGroup>
        );
    };

    render() {
        const { openMail, businessInfo, invoicesStatementData } = this.props;
        const { mailStatement, editSubject, sentVia, mailFrom, loading } = this.state;

        return (
            <Modal
                isOpen={openMail}
                toggle={this.closeMailInvoice}
                // className="modal-add modal-confirm"
                centered
            >
                <ModalHeader toggle={this.closeMailInvoice}>Send customer statement by email</ModalHeader>
                <ModalBody>
                    
                    {this.renderSendAddress()}
                    <FormGroup check row>
                        <Label for="exampleEmail" sm={3} className="text-right pdR0 pd0" />
                        <Label check sm={9}>
                            <Input
                                name="self"
                                type="checkbox"
                                value={mailStatement.self}
                                checked={mailStatement.self}
                                onChange={this.handleMailInvoice}
                                className="pd0"
                            />{" "}
                            Send a copy to <strong>{localStorage.getItem("user.email")}</strong>
                        </Label>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="exampleEmail" sm={3} className="text-right pdR0">
                            From
                        </Label>
                        <Col sm={8}>

                            <SelectBox
                                className="h-100 select-height"
                                value={mailStatement.from}
                                options={mailFrom}
                                isClearable={false}
                            />

                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="exampleEmail" sm={3} className="text-right pdR0">
                            Subject
                        </Label>

                        <Col sm={8}>
                            <Input
                                type="email"
                                name="from"
                                value={mailStatement.subject}
                                onChange={this.handleMailInvoice}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleEmail" sm={3} className="text-right pdR0">
                            Message
                        </Label>
                        <Col sm={8}>
                            <textarea
                                type="text"
                                name="message"
                                onChange={this.handleMailInvoice}
                                value={mailStatement.message}
                                className="form-control custom-textarea"
                                placeholder={`Enter your message to ${
                                    (businessInfo)? businessInfo.organizationName : ''
                                    }`}
                            />
                        </Col>
                    </FormGroup>

                    <Row>
                        <Col className="pd0" xs={12} sm={12} md={12} lg={12}><hr></hr></Col>
                    </Row>
                    <div>
                        <Button
                            className="btn btn-rounded  btn-gray pull-right btn btn-secondary"
                            onClick={this.closeMailInvoice}
                        >
                            {" "}
                            Cancel{" "}
                        </Button>

                        <Button
                            color="danger"
                            onClick={this.sendMailToCustomer} className="btn btn-rounded btn-accent pull-right btn btn-secondary"
                        >
                            { loading ? <Spinner size="sm" color="light" /> : 'Send'}
                        </Button>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

const mapPropsToState = state => ({
    businessInfo: state.businessReducer.selectedBusiness
});

const mapDispatchToProps = dispatch => {
    return {
        refreshData: () => {
            dispatch(updateData());
        },
        showSnackbar: (message, error) => {
            dispatch(openGlobalSnackbar(message, error));
        }
    };
};

export default connect(
    mapPropsToState,
    mapDispatchToProps
)(MailStatement);
