import React, { Fragment } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input
} from "reactstrap";
import { connect } from "react-redux";

import { updateData, openGlobalSnackbar } from "../../../../../../actions/snackBarAction";

class GetAShareLink extends React.PureComponent {
    componentDidMount(){
        let elem = document.getElementById('shareLink');
        if(!!elem){
            elem.focus();
            elem.select();
        }
    }

    componentDidUpdate(){
        let elem = document.getElementById('shareLink');
        if(!!elem){
            elem.focus();
            elem.select();
        }
    }
    render() {
        const {invoiceData
            , openShareLink
            , onClose,
            copyMarkSent
        } = this.props
        return (
            <Modal
                isOpen={openShareLink}
                toggle={onClose}
                className="reminder-modal share-link"
                centered
            >
                <ModalHeader toggle={onClose}>Get share link</ModalHeader>
                <ModalBody>
                    <div className="reminder-modal">
                        <div className="text-center">
                            Your customer can view the invoice at this link:
                        <div className="text-center">
                                <div className="py-form-email mrT18">
                                    <Input id="shareLink" type='text' value={`${process.env.WEB_URL}/public/invoice/${invoiceData.uuid}`}/>
                                </div>
                            </div>
                        </div>
                        <div className="remainder-body mrT18">
                            <p className="text-center share-text"> Copy the link and share it with your customer.</p>
                            <center><a className="py-text--link-external" href={`${process.env.WEB_URL}/public/invoice/${invoiceData.uuid}`} target="_blank" > Preview in new window</a></center>

                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn btn-outline-primary"
                    onClick={onClose}
                    >Cancel</Button>
                    <CopyToClipboard text={`${process.env.WEB_URL}/public/invoice/${invoiceData.uuid}`}>
                        <Button
                            onClick={onClose}
                            className="btn btn-outline-primary">Copy link</Button>
                    </CopyToClipboard>
                    <CopyToClipboard text={`${process.env.WEB_URL}/public/invoice/${invoiceData.uuid}`}>
                        <button
                            onClick={copyMarkSent}
                            className="btn btn-primary"
                        >Copy, and mark invoice as sent </button>
                    </CopyToClipboard>
                </ModalFooter>
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
)(GetAShareLink);

