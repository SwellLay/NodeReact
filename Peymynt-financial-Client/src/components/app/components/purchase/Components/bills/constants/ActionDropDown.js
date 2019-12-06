import { duplicateBill } from 'actions/billsAction';
import { openGlobalSnackbar } from "actions/snackBarAction";
import { deleteBill } from 'api/billsService';
import history from "customHistory";
import ConfirmationModal from 'global/ConfirmationModal';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { DeleteModal } from "utils/PopupModal/DeleteModal";

class DropdownWrapper extends Component {
  state = {
    dropdownOpen: false,
    isDelete: false,
    openMail: false,
    confirmConvert: false,
    modalContent: null
  };

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  onEditClick = () => {
    const id = this.props.row.id;
    history.push("/app/purchase/bills/" + id);
  };

  onConfirmDelete = () => {
    this.setState({ isDelete: true })
  };

  onCloseModal = () => {
    this.setState({ isDelete: false })
  };

  onDuplicate = async () => {
    const { row: { id }, duplicateBill } = this.props;
    duplicateBill(id, (bill) => {
      history.push(`/app/purchase/bills/${bill.id}?duplicate=true`);
    });
  };

  onDeleteClick = async () => {
    const id = this.props.row.id;
    await deleteBill(id);
    location.reload();
  };


  render() {
    const { row: { status } } = this.props;
    const { isDelete, dropdownOpen, openMail, modalContent, confirmConvert } = this.state;

    return (
      <Fragment>
        <Dropdown isOpen={dropdownOpen}
          toggle={this.toggle}
          direction={'left'}
        >
          <DropdownToggle className="btn-icon btn-outline-secondary" id="action">
            <svg viewBox="0 0 20 20" id="dropIcon" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.84 7.772c.348-.426.175-.772-.376-.772H6.559c-.556 0-.727.342-.377.772l3.2 3.928c.35.426.91.43 1.26 0l3.2-3.928h-.001z"
              />
            </svg>
          </DropdownToggle>
          <DropdownMenu>
            <div className="dropdown-menu--body">
              <DropdownItem id="dropItem0" key={0} onClick={this.props.onRecord}>Record payment</DropdownItem>
              <DropdownItem id="dropItem1" key={1} onClick={this.onEditClick}>
                {status !== 'paid' ? 'View/Edit' : 'View'}
              </DropdownItem>
              <DropdownItem id="dropItem9" key={9} onClick={this.onDuplicate}>Duplicate</DropdownItem>
              {status !== 'paid' && (
                <Fragment>
                  <div className="dropdown-item-divider" />
                  <DropdownItem id="dropItem8" key={8} onClick={this.onConfirmDelete}>Delete</DropdownItem>
                </Fragment>
              )}
            </div>
          </DropdownMenu>
        </Dropdown>
        <DeleteModal
          message='Are you sure you want to delete this bill?'
          openModal={isDelete}
          onDelete={this.onDeleteClick}
          onClose={this.onCloseModal}
        />
        <ConfirmationModal
          open={confirmConvert}
          text={modalContent}
          onConfirm={this.convertEstimate}
          onClose={() => this.setState({ confirmConvert: false })}
        />
      </Fragment>
    );
  }
}

export default connect(null, { openGlobalSnackbar, duplicateBill })(DropdownWrapper)
