import React, { PureComponent } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { isEmail } from '../GlobalFunctions';
import profileServices from '../../api/profileService';


export class AddNewEmail extends PureComponent {
  state = {
    email: '',
    loading: false,
  };

  close = () => {
    this.setState({ email: '', loading: false });
    this.props.onClose();
  };

  handleInputChange = (email) => {
    this.setState({ email });
  };

  validateData() {
    if (!isEmail(this.state.email)) {
      return false;
    }

    return true;
  }

  save = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!this.validateData()) {
      return;
    }

    const payload = { emailProfileInput: { email: this.state.email } };

    const { statusCode } = await profileServices.addConnectedEmail(this.props.userId, payload);

    if (statusCode === 200 || statusCode === 201) {
      this.props.callback();
    }

    this.close();
  };

  render() {
    const { openModal } = this.props;
    return (
      <Modal isOpen={openModal} toggle={this.close} id="addEmailModal" className="modal-add modal-confirm" centered>
        <ModalHeader>Add Another Email Address</ModalHeader>
        <ModalBody>
          <form onSubmit={this.save}>
            <label className="py-form-field__label is-required">New Email Address</label>
            <input
              required
              type="email"
              className="form-control"
              onChange={e => this.handleInputChange(e.target.value)}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button className="btn-outline-primary" onClick={this.close}>Cancel</Button>
          <Button className="btn btn-primary" onClick={this.save}>Add email address</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
