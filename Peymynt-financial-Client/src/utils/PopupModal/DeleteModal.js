import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export const DeleteModal = props => {
  const { openModal, onDelete, onClose, message, number } = props;
    return (
        <Modal isOpen={openModal} toggle={onClose} className="modal-add modal-confirm" centered>
            <ModalHeader className="delete" toggle={onClose}>
              {
                !!number ?
                `Delete Invoice #${number}`
                : "Confirmation"
              }
            </ModalHeader>
            <ModalBody className="text-center">
                {
                  !!number && (
                    <span>{`Invoice #${number}`}<br/></span>
                  )
                }
                {message}
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-outline-primary" onClick={onClose}>Close</button>
                <button className="btn btn-danger" onClick={onDelete}>Delete</button>
            </ModalFooter>
        </Modal>
    )
};

export const PaymentConfirmation = props => {
  const { openModal, onConfirm, onClose, payment, paymentData } = props;
    return (
        <Modal isOpen={openModal} toggle={onClose} className="modal-add modal-confirm" centered>
            <ModalHeader className="delete">Remove invoice payment</ModalHeader>
            <ModalBody className="text-center">
                <strong>
                  Payment for {paymentData.currency ? paymentData.currency.symbol : ''}{payment ? payment.amount : ""} using {payment ? payment.methodToDisplay : ''}.<br/>
                </strong>
                Are you sure you want to remove this invoice payment?
            </ModalBody>
            <ModalFooter>
                <Button className="btn btn-outline-primary" onClick={onClose}>Cancel</Button>
                <Button className="btn btn-rounded" color="danger" onClick={onConfirm}>Remove payment</Button>
            </ModalFooter>
        </Modal>
    )
};

export const PaymentMethodConfirmation = props => {
  const { openModal, onConfirm, onClose, payment, paymentData, cardNumber } = props;
  return (
    <Modal isOpen={openModal} toggle={onClose} className="modal-add modal-confirm" centered>
      <ModalHeader className="delete">Delete credit card</ModalHeader>
      <ModalBody>
        This card will be removed from associated recurring invoice, automatic payments may be affected. Are you sure
        you want to delete this credit card (**** **** **** {cardNumber})
      </ModalBody>
      <ModalFooter>
     
        <Button className="btn btn-primary btn-rounded" onClick={onConfirm}>Yes, delete</Button>
        <Button className="btn btn-outline-primary btn-rounded" onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
};
