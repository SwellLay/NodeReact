import history from "customHistory";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { DeleteModal } from "utils/PopupModal/DeleteModal";
import { openGlobalSnackbar, updateData } from "../../../../../actions/snackBarAction";
import { cloneRecurringInvoice, deleteInvoice, sendInvoice } from "../../../../../api/RecurringService";
import AlertBox from "../../../../../global/AlertBox";

class RecurringDropDown extends Component {
  state = {
    dropdownOpen: false,
    openReceiptMail: false,
    isDelete: false,
    openMail: false,
    openAlert: false,
  };

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };
  onViewClick = () => {
    const id = this.props.row._id;
    history.push("/app/recurring/view/" + id);
  };
  onEditClick = () => {
    const id = this.props.row._id;
    history.push("/app/recurring/edit/" + id);
  };

  onEnd = () => {
    const id = this.props.row._id;
    history.push("/app/recurring/edit/" + id);
  };

  onConfirmDelete = () => {
    this.setState({ isDelete: true });
  };

  onCloseModal = () => {
    this.setState({ isDelete: false });
  };

  onDuplicate = async () => {
    const id = this.props.row._id;
    const response = await cloneRecurringInvoice(id);
    const invoiceId = response.data.invoice._id;
    history.push(`/app/recurring/view/${invoiceId}?duplicate=true`);
  };

  onDeleteClick = async () => {
    const { row, refreshData, showSnackbar } = this.props
    try {
      await deleteInvoice(row._id);
      await refreshData();
      this.onCloseModal();
      location.reload();
    } catch (error) {
      showSnackbar(error.message, true)
    }
  };

  handleMail = () => {
    this.setState({
      openMail: !this.state.openMail
    });
  };

  exportPDF = () => {
    window.open(`${process.env.WEB_URL}/invoices/readonly/${this.props.row._id}`);
  };

  onPrintClick = () => {
    window.open(`${process.env.WEB_URL}/invoices/readonly/${this.props.row._id}`);
  };

  onRecordClick = () => {
    this.setState({
      onRecordModal: true
    });
  };

  onRecordClose = () => {
    this.setState({
      onRecordModal: false
    });
  };

  onOpenAlert = (item) => {
    this.setState({
      openAlert: true,
      receiptItem: item
    })
    this.onRecordClose()
  }

  updateStatus = async () => {
    const { row, refreshData, showSnackbar } = this.props;
    let payload = {
      invoiceInput: { status: "saved" }
    };
    try {
      await sendInvoice(row._id, payload);
      refreshData();
    } catch (error) {
      showSnackbar(error.message, true)
    }
  };

  renderStatusLabel = () => {
    const { row } = this.props;
    if (row.status === "paid") {
      return <a href={`/app/recurring/view/${row._id}`}>View</a>;
    }
    if (row.status === "saved") {
      return <a onClick={this.handleMail}>Send</a>;
    }
    if (row.status === "draft") {
      return <a onClick={this.updateStatus}>Approve</a>;
    }
    if (row.status === "sent") {
      return (
        <a onClick={this.onRecordClick}>
          Record payment
        </a>
      );
    }
    if (row.status === "overdue" && row.sentDate) {
      return <a onClick={this.openCloseReminder}>Send a reminder</a>;
    } else if (row.status === "overdue") {
      return <a onClick={this.onRecordClick}>Record a payment</a>;
    }

    if (row.status === "partial") {
      return <a onClick={this.onRecordClick}>Record a payment</a>;
    }
  };

  openCloseReminder = () => {
    this.setState({ openReminder: !this.state.openReminder })
  }

  onOpenReceiptMail = (item, index) => {
    this.setState({
      openReceiptMail: true,
      receiptItem: item,
      receiptIndex: index,
      openAlert: false
    })
  }

  onCloseAlert = () => {
    this.setState({
      openAlert: false
    })
  }

  onCloseReceiptMail = () => {
    this.setState({
      openReceiptMail: false
    })
  }

  viewCreated = () => {
    history.push(`/app/invoices?rcId=${this.props.row._id}`)
  }


  render() {
    const {
      onRecordModal,
      isDelete,
      dropdownOpen,
      openReceiptMail,
      openMail,
      openReminder,
      receiptItem,
      openAlert } = this.state;
    let { row, from, index } = this.props;
    console.log('row', row, index);
    return (
      <Fragment>
        <Dropdown
          isOpen={dropdownOpen}
          toggle={this.toggle}
          direction={'right'}
        >
          <DropdownToggle className="btn-icon btn-outline-secondary" id="action">
              <svg viewBox="0 0 20 20" id="dropIcon" xmlns="http://www.w3.org/2000/svg"><path d="M13.84 7.772c.348-.426.175-.772-.376-.772H6.559c-.556 0-.727.342-.377.772l3.2 3.928c.35.426.91.43 1.26 0l3.2-3.928h-.001z"></path></svg>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-right">
            <div className="dropdown-menu--body">
            <DropdownItem id="dropItem0" key={0} onClick={this.onViewClick}>
              View
            </DropdownItem>
            <DropdownItem id="dropItem1" key={1} onClick={this.onEditClick}>
              Edit
            </DropdownItem>
            <DropdownItem id="dropItem8" key={8} onClick={this.onEnd} disabled={from!=='active'}>
              End
            </DropdownItem>
            <div key={5} className="dropdown-item-divider"></div>
            <DropdownItem id="dropItem9" key={9} onClick={this.viewCreated} disabled={from!=='active'}>
              View created invoices
            </DropdownItem>
            <div className="dropdown-item-divider"></div>
            <DropdownItem id="dropItem10" key={10} onClick={this.onDuplicate}>
              Duplicate
            </DropdownItem>
            </div>
          </DropdownMenu>
        </Dropdown>
        <DeleteModal
          message="Are you sure you want to delete this invoice?"
          openModal={isDelete}
          onDelete={this.onDeleteClick}
          onClose={this.onCloseModal}
        />
        <AlertBox
          showAlert={openAlert}
          receipt={receiptItem}
          onConfirm={this.onOpenReceiptMail}
          onCancel={this.onCloseAlert}
        />
      </Fragment>
    );
  }
}

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
  null,
  mapDispatchToProps
)(RecurringDropDown);
