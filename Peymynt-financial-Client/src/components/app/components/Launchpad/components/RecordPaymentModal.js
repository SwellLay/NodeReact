import React from "react";
import { NavLink } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function RecordPaymentModal({ isOpen, close }) {
  return (
    <Modal isOpen={isOpen} className="launchpad-modal" toggle={close}>
      <ModalHeader toggle={close}>
        <h3 className="modal-title">Recording a payment</h3>
      </ModalHeader>
      <ModalBody>
        <div className="main-info">
          <p>Every time one of your invoices is paid, there’s just one final step. On the main Invoices page,
            click <strong>“Record a payment”</strong> under the <strong>Actions</strong> column.
          </p>
          <p className="help-block">Note: If you’re accepting payments in Peymynt, we automatically do this step for you
            in Invoicing and Accounting.
          </p>
          <NavLink to="/app/invoices" className="btn btn-primary">Let's go</NavLink>
        </div>
      </ModalBody>
      <ModalFooter>
        <h4 className="footer-heading">Why recording a payment matters</h4>
        <ul>
          <li>It’s essential for bookkeeping and organizing your payments</li>
          <li>It keeps your information accurate for year-end tax filing</li>
        </ul>
      </ModalFooter>
    </Modal>
  );
}
