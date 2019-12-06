import React, { Component, Fragment } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { DeleteModal } from '../../../../../../../utils/PopupModal/DeleteModal';

class ReceiptsDropdown extends Component {
  state = {
    dropdownOpen: false,
    openReceiptMail: false,
    isDelete: false,
    openMail: false,
    openAlert: false,
    tab: null
  };

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  onConfirmDelete = () => {
    this.setState({ isDelete: true });
  };

  onCloseModal = () => {
    this.setState({ isDelete: false });
  };


  onDeleteClick = async () => {
    this.props.onDelete();
    this.onCloseModal();
  };

  onOpenReceiptMail = (item, index) => {
    this.setState({
      openReceiptMail: true,
      receiptItem: item,
      receiptIndex: index,
      openAlert: false
    })
  };

  onCloseAlert = () => {
    this.setState({
      openAlert: false
    })
  };

  render() {
    const {
      isDelete,
      dropdownOpen,
    } = this.state;
    const { row, onView, onEdit, businesses, onMove } = this.props;

    if (row.status === 'Processing') {
      return null;
    }

    return (
      <Fragment>
        <Dropdown
          isOpen={dropdownOpen}
          toggle={this.toggle}
          direction={'right'}
        >
          <DropdownToggle className="btn btn-icon btn-outline-secondary" id="action">
          <svg viewBox="0 0 20 20" id="dropIcon" xmlns="http://www.w3.org/2000/svg"><path d="M13.84 7.772c.348-.426.175-.772-.376-.772H6.559c-.556 0-.727.342-.377.772l3.2 3.928c.35.426.91.43 1.26 0l3.2-3.928h-.001z"></path></svg>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-right">
            <div className="dropdown-menu--body">
            {row.status === 'Done' && (
              <DropdownItem id="dropItem0" key={0} onClick={onView}>
                View details
              </DropdownItem>
            )}
            {row.status === 'Ready' && (
              <DropdownItem id="dropItem1" key={1} onClick={onEdit}>
                View or edit details
              </DropdownItem>
            )}
            {row.status === 'Ready' && (
              <DropdownItem id="dropItem2" key={2} divider />
            )}
            {row.status === 'Ready' && businesses.map((business, index) => (
              <DropdownItem id={`dropItem${10 + index}`} key={business._id} onClick={() => onMove(business._id)}>
                Move to {business.organizationName}
              </DropdownItem>
            ))}
            <div className="dropdown-item-divider"></div>
            <DropdownItem id="dropItem8" key={8} onClick={this.onConfirmDelete}>
              Delete
            </DropdownItem>
            </div>
          </DropdownMenu>
        </Dropdown>
        <DeleteModal
          message="Are you sure you want to delete this receipt?"
          openModal={isDelete}
          onDelete={this.onDeleteClick}
          onClose={this.onCloseModal}
        />
      </Fragment>
    );
  }
}

export default ReceiptsDropdown;
