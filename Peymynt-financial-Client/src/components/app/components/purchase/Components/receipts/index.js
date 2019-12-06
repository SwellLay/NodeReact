import {
  deleteReceipt,
  listReceipts,
  moveReceipt,
  patchReceipt,
  updateReceipt,
  uploadReceipt
} from 'actions/recieptActions';
import classnames from 'classnames';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import DataTableWrapper from 'utils/dataTableWrapper/DataTableWrapper';
import { _documentTitle } from 'utils/GlobalFunctions';
import { NoDataMessage } from '../../../../../../global/NoDataMessage';
import EditDetailsModal from './components/EditDetailsModal';
import ViewDetailsModal from './components/ViewDetailsModal';
import { getColumns } from './constants/listConstants';


class Receipts extends PureComponent {
  uploadInput = React.createRef();

  state = {
    viewDetails: undefined,
    editDetails: undefined,
    activeTab: "all",
  };

  componentDidMount() {
    const { businessInfo } = this.props;
    _documentTitle(businessInfo, "Receipts");
    this.fetchReceipts();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  fetchReceipts = () => {
    const { activeTab } = this.state;
    this.props.listReceipts(activeTab === 'all' ? '' : activeTab, this.setTimer);
  };


  handleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  setTimer = (receipts) => {
    const { activeTab } = this.state;
    if ((activeTab === 'Processing' && receipts.length) || (activeTab === 'all' && receipts.find(r => r.status === 'Processing'))) {
      this.timer = setTimeout(this.fetchReceipts, 40000);
      return;
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        invoiceData: []
      }, () => this.fetchReceipts());
    }
  };

  openFilePicker = () => {
    this.uploadInput.current.click();
  };

  startUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    this.props.uploadReceipt(file, this.fetchReceipts);
  };

  closeViewDetails = () => {
    this.setState({ viewDetails: undefined });
  };

  closeEditDetails = () => {
    this.setState({ editDetails: undefined });
  };

  openViewDetails = (row) => {
    this.setState({ viewDetails: row });
  };

  openEditDetails = (row) => {
    this.setState({ editDetails: row });
  };

  editReceipt = (id, payload) => {
    this.props.updateReceipt(id, payload, () => {
      this.fetchReceipts();
      this.closeEditDetails();
    });
  };

  saveReceipt = (id, payload) => {
    this.props.patchReceipt(id, payload, () => {
      this.fetchReceipts();
      this.closeEditDetails();
    });
  };

  deleteReceipt = (id) => {
    this.props.deleteReceipt(id, () => {
      this.fetchReceipts();
    });
  };

  moveReceipt = (id, businessId) => {
    this.props.moveReceipt(id, businessId, () => {
      this.fetchReceipts();
    });
  };

  columns = getColumns(this.openViewDetails, this.openEditDetails, this.deleteReceipt, this.props.businesses, this.moveReceipt);

  renderNoContent() {
    const { activeTab } = this.state;
    return (
      <NoDataMessage
        title="receipt"
        add={this.openFilePicker}
        filter={false}
        secondryMessage="Upload receipt or invoice which you received for your business."
      />
    );
  }

  onRowClick = (e, row, rowIndex) => {
    if (['a', 'button'].indexOf(e.target.tagName.toLowerCase()) !== -1 || ['a', 'button'].indexOf(e.target.parentElement.tagName.toLowerCase()) !== -1 || e.target.onClick) {
      return;
    }

    if (row.status === 'Ready') {
      this.openEditDetails(row);
      return;
    }

    if (row.status === 'Done') {
      this.openViewDetails(row);

    }
  };

  renderContent() {
    const { receipts } = this.props;
    return (
      <div className="receipts-list">
        <DataTableWrapper
          from="receipts"
          data={receipts}
          columns={this.columns}
          rowEvents={{ onClick: this.onRowClick }}
        />
      </div>
    );
  }

  renderTabLink(tabName, label) {
    const { activeTab } = this.state;
    const onClick = () => this.toggleTab(tabName);
    const active = activeTab === tabName;

    return (
      <NavItem>
        <NavLink className={classnames({ active })} onClick={onClick}>
          {label || tabName}
        </NavLink>
      </NavItem>
    );
  }

  renderTabPanel(tabName) {
    const { loading, receipts } = this.props;

    return (
      <TabPane tabId={tabName} className="tab-panel">
        {receipts.length < 1 ? this.renderNoContent() : this.renderContent()}
      </TabPane>
    )
  }

  renderProgressBar() {
    const { uploading, progress } = this.props;
    const classes = ['progress-container'];

    if (uploading) {
      classes.push('show');
    }

    return (
      <div className={classes.join(' ')}>
        <div className="track" />
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
    )
  }

  render() {
    const { viewDetails, editDetails } = this.state;
    const { uploading, updating, businessInfo } = this.props;
    return (
      <Fragment>
        <div className="content-wrapper__main receipts-wrapper">
          <header className="py-header--page">
            <div className="py-header--title">
              <h2 className="py-heading--title">Receipts</h2>
            </div>

            <div className="py-header--actions">
              <Button
                disabled={uploading}
                onClick={this.openFilePicker}
                className="btn btn-primary"
              >
                Upload a receipt
              </Button>

              <input type="file" onChange={this.startUpload} ref={this.uploadInput} style={{ display: 'none' }} />
            </div>
          </header>
          {this.renderProgressBar()}

          <Nav tabs className="py-nav--tabs">
            {this.renderTabLink('all', 'All statuses')}
            {this.renderTabLink('Processing', 'Processing')}
            {this.renderTabLink('Ready', 'Ready')}
            {this.renderTabLink('Done', 'Done')}
          </Nav>
          <TabContent
            className="tab-container p-0"
            activeTab={this.state.activeTab}
          >
            {this.renderTabPanel('all')}
            {this.renderTabPanel('Processing')}
            {this.renderTabPanel('Ready')}
            {this.renderTabPanel('Done')}
          </TabContent>

          <ViewDetailsModal onClose={this.closeViewDetails} data={viewDetails} />
          <EditDetailsModal
            updating={updating}
            data={editDetails}
            currency={businessInfo.currency}
            onClose={this.closeEditDetails}
            editReceipt={this.editReceipt}
            saveReceipt={this.saveReceipt}
          />
        </div>
      </Fragment>
    );
  }
}

const mapPropsToState = ({ snackbar, businessReducer, receipts }) => ({
  updateData: snackbar.updateData,
  businessInfo: businessReducer.selectedBusiness,
  businesses: businessReducer.business,
  loading: receipts.loading,
  uploading: receipts.uploading,
  updating: receipts.updating,
  receipts: receipts.list,
  progress: receipts.progress,
});

export default withRouter(connect(mapPropsToState, {
  uploadReceipt,
  listReceipts,
  updateReceipt,
  patchReceipt,
  deleteReceipt,
  moveReceipt,
})(Receipts));
