import React, { Component } from 'react'
import { Col, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default class ConfirmationPopup extends Component {
  render() {
    const { open, closeModal, confirmClose, id, handleText } = this.props;
    return (
      <div>
        <Modal isOpen={open} toggle={closeModal} className="modal-add modal-common" centered>
          <ModalHeader toggle={closeModal}>Password Confirmation</ModalHeader>
          <ModalBody>
            Please enter password for your account!
            <form>
              <FormGroup row>
                <Label for="password" className="text-right" xs={12} sm={4} md={3} lg={3}>Password </Label>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Input type="text"
                    name="password"
                    onChange={(e) => handleText(e)} />
                </Col>
              </FormGroup>
            </form>
            {/* <= */}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={confirmClose}>Yes</Button>{' '}
            <NavLink to={`/app/${id}/accounts`} className="btn btn-rounded btn-gray btn btn-primary">
                <Button color="secondary" onClick={closeModal}>No</Button>
            </NavLink>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
