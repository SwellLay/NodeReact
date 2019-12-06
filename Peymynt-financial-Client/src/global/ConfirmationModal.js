import React, { Component } from 'react'
import {  Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from 'reactstrap';

export default class ConfirmationModal extends Component {
    render() {
        const { onClose, onConfirm, open, text, convertLoading } = this.props
        return (
            <Modal isOpen={open} toggle={onClose} className="modal-add modal-common confirmModal-wrppr" centered>
                <ModalHeader toggle={onClose} className="confirmModal-header">
                    <h4>{!!text ? text.heading && text.heading : ""}</h4>
                </ModalHeader>
                <ModalBody className="confirmModal-body">
                    {!!text ? text.body && text.body : ""}
                </ModalBody>
                <ModalFooter className="confirmModal-footer">
                    <Button color="primary" disabled={convertLoading} className="btn btn-rounded btn-3 confirm" onClick={onConfirm}>Convert {convertLoading && (<Spinner size="sm" color="light" />)}</Button>{' '}
                    <Button onClick={onClose} className="btn btn-gray-accent cancel">or <span>Cancel</span></Button>
                </ModalFooter>
            </Modal>
        )
    }
}
