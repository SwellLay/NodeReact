import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


export default function SetPrimaryEmail({ email, onConfirm, onClose }) {
  return (
    <Modal isOpen={!!email} toggle={onClose} id="setPrimaryEmailModal" className="modal-add modal-confirm"
      centered>
      <ModalHeader toggle={onClose}>Set primary email</ModalHeader>
      <ModalBody>
        <p className="text-center">
          Are you sure you want to set <strong>{email}</strong> as your primary email address?
        </p>
      </ModalBody>
      <ModalFooter>
        <Button className="btn-outline-primary" onClick={onClose}>Cancel</Button>
        <Button className="btn btn-primary" onClick={onConfirm}>Confirm</Button>
      </ModalFooter>
    </Modal>
  );
}
