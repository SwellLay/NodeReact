

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export const PaymentConfirmation = props => {
    const { openModal, onConfirm, onClose, payment, paymentData } = props
    return (
        <Modal isOpen={openModal} toggle={onClose} className="modal-add modal-confirm" centered>
            <ModalHeader>Remove invoice payment</ModalHeader>
            <ModalBody>
              <strong>
                  Payment for {paymentData.currency ? paymentData.currency.symbol : ''}{payment ? payment.amount : ""} using {payment ? payment.method : ''} <br/>
                  </strong>  
                Are you sure you want to remove this invoice payment?
            </ModalBody>
            <ModalFooter>
                <Button className="btn btn-accent btn-rounded" onClick={onClose}>Cancel</Button>
                <Button className="btn btn-rounded" color="danger" onClick={onConfirm}>Remove payment</Button>
            </ModalFooter>
        </Modal>
    )
}