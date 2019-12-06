import { openGlobalSnackbar } from 'actions/snackBarAction';
import profileServices from 'api/profileService';
import classNames from 'classnames';
import React, { Fragment, PureComponent } from 'react'
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';
import { Tooltip } from 'reactstrap';
import { DeleteModal } from 'utils/PopupModal/DeleteModal';

function Account({ provider, id, email, isLoginAllowed, showTooltip, onDelete, onTooltip }) {
  return (
    <tr className="py-table__row">
      <td className="py-table__cell">
        <span id={`account-${id}`}>{provider}</span>
        <Tooltip
          placement="right"
          isOpen={showTooltip}
          target={`account-${id}`}
          toggle={onTooltip}>
          {email}
        </Tooltip>
      </td>
      <td className="py-table__cell">
        <span className={classNames({
          'badge-info': status === 'Verified',
          'badge-primary': status === 'Primary',
          'badge-warning': status === 'Unverified',
        })}>
          {isLoginAllowed ? <i className="fa fa-check" /> : <i className="fa fa-close" />}
        </span>
      </td>
      <td className="py-table__cell__action">
        <div className="py-table__cell__action__icons">
          <div className="py-table__action py-table__action__danger py-icon" onClick={onDelete}>
            <svg viewBox="0 0 20 20" id="delete" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"
              />
            </svg>
          </div>
        </div>
      </td>
    </tr>
  );
}

class ConnectedAccounts extends PureComponent {
  state = {
    deleteAccount: '',
    tooltip: '',
    accounts: [],
  };

  componentDidMount() {
    this.fetchConnectedAccounts();
  }

  fetchConnectedAccounts = async () => {
    const { userId: id } = this.props;
    const { data: { accounts } = { accounts: [] } } = await profileServices.getConnectedAccounts(id);
    this.setState({ accounts });
  };

  toggleDeletePopup = (id) => {
    this.setState({ deleteAccount: id });
  };

  toggleTooltip = (id) => {
    this.setState({ tooltip: this.state.tooltip === id ? '' : id });
  };

  deleteAccount = async () => {
    const { userId, showSnackbar, callback } = this.props;
    try {
      const { statusCode, message } = await profileServices.deleteConnectedAccount(userId, this.state.deleteAccount);

      if (statusCode === 200 || statusCode === 201) {
        this.fetchConnectedAccounts();
        showSnackbar(message);
        this.toggleDeletePopup();
        return;
      }

      showSnackbar(message, true);
    } catch (e) {
      showSnackbar(e.message, true);
    }
  };

  googleResponse = async (response) => {
    const { params: { userId: id } } = this.props;

    const payload = {
      accountProfileInput: {
        provider: 'google',
        token: response.accessToken,
        email: response.profileObj.email,
        firstName: response.profileObj.givenName,
        lastName: response.profileObj.familyName,
        name: response.profileObj.name,
      }
    };
    const { data, message, statusCode } = await profileServices.addConnectedAccount(id, payload);
    if (statusCode === 200 || statusCode === 201) {
      this.fetchConnectedAccounts();
      console.log(data);

    }
  };

  render() {
    const { accounts } = this.state;
    return (
      <Fragment>
        <h2 className="py-heading--section-title">Connected Accounts</h2>
        <p className="py-text">Add an account to incorporate your contacts or login with that account.</p>
        <table className="py-table py-table__hover">
          <thead className="py-table__header">
          <tr className="py-table__row">
            <th className="py-table__cell">Account</th>
            <th className="py-table__cell">Login</th>
            <th className="py-table__cell__action">Actions</th>
          </tr>
          </thead>
          <tbody>
          {accounts.map(account => (
            <Account
              key={account.id}
              {...account}
              showTooltip={this.state.tooltip === account.id}
              onDelete={() => this.toggleDeletePopup(account.id)}
              onTooltip={() => this.toggleTooltip(account.id)}
            />
          ))}
          </tbody>
        </table>

        <div className="py-btn-container"
          style={{ marginTop: '1em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <p className="py-text">Connect another account: &nbsp;</p>
          <GoogleLogin
            scope="profile email"
            clientId='648232443420-8s3iosmrcp8jjrf40f5djhulfu7slep3.apps.googleusercontent.com'
            // clientId='38087117284-9nujuvhr24m6p2u65ja9vjfoastanu3g.apps.googleusercontent.com'
            // clientId="644820555038-3qir84bks04qmkf0v45or74bop92cesk.apps.googleusercontent.com"
            // clientId='43c74cd23122682a6ae3e89ebf50e3a7-4836d8f5-89f38845'
            buttonText="Google"
            // responseType="code"
            onSuccess={this.googleResponse}
            onFailure={this.googleResponse}
            className="btn btn-social--google text-center"
          />
          {/*<button className="btn py-btn--yahoo">Yahoo</button>*/}
        </div>

        <DeleteModal
          message='Are you sure you want to delete this account?'
          openModal={!!this.state.deleteAccount}
          onDelete={this.deleteAccount}
          onClose={() => this.toggleDeletePopup()}
        />

      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showSnackbar(message, error) {
      dispatch(openGlobalSnackbar(message, error));
    },
  };
}

export default connect(null, mapDispatchToProps)(ConnectedAccounts);
