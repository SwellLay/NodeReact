import { openGlobalSnackbar } from 'actions/snackBarAction';
import profileServices from 'api/profileService';
import classNames from 'classnames';
import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux';
import { DeleteModal } from 'utils/PopupModal/DeleteModal';
import SetPrimaryEmail from 'utils/PopupModal/SetPrimaryEmail';

function Email({ email, status, onSetPrimary, onDelete, onResend }) {
  return (
    <tr className="py-table__row">
      <td className="py-table__cell">{email}</td>
      <td className="py-table__cell">
        <span className={classNames({
          badge: true,
          'badge-info': status === 'Verified',
          'badge-primary': status === 'Primary',
          'badge-warning': status === 'Unverified',
        })}>
          {status}
        </span>
      </td>
      <td className="py-table__cell__action">
        <div className="py-table__cell__action__icons">
          {status === 'Verified' && (
            <div className="py-table__action py-icon" onClick={onSetPrimary}>
              <svg viewBox="0 0 20 20" id="star" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 3.636L8.206 7.229a.817.817 0 0 1-.616.442l-4.013.58 2.903 2.796a.803.803 0 0 1 .236.716L6.03 15.71l3.588-1.865a.827.827 0 0 1 .762 0l3.588 1.865-.685-3.948a.803.803 0 0 1 .236-.716l2.903-2.796-4.013-.58a.817.817 0 0 1-.616-.442L10 3.636zM6.929 6.132l2.337-4.681a.822.822 0 0 1 1.468 0l2.337 4.681 5.228.756c.671.096.938.911.453 1.379l-3.782 3.641.892 5.145c.115.66-.587 1.164-1.187.852L10 15.475l-4.675 2.43c-.6.312-1.302-.192-1.187-.852l.892-5.145-3.782-3.641a.806.806 0 0 1 .453-1.38l5.228-.755z"
                />
              </svg>
            </div>
          )}
          {status === 'Unverified' && (
            <div className="py-table__action" onClick={onResend}>
              <span className="py-text--link">Resend verification</span>
            </div>
          )}
          {status !== 'Primary' && (
            <div className="py-table__action py-table__action__danger py-icon" onClick={onDelete}>
              <svg viewBox="0 0 20 20" id="delete" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"
                />
              </svg>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

class Emails extends PureComponent {
  state = {
    primaryEmail: '',
    deleteEmail: '',
  };

  togglePrimaryPopup = (email) => {
    this.setState({ primaryEmail: email });
  };

  toggleDeletePopup = (email) => {
    this.setState({ deleteEmail: email });
  };

  deleteEmail = async () => {
    const { userId, showSnackbar, callback } = this.props;
    try {
      const { statusCode, message } = await profileServices.deleteConnectedEmail(userId, this.state.deleteEmail);

      if (statusCode === 200 || statusCode === 201) {
        callback();
        showSnackbar(message);
        this.toggleDeletePopup();
        return;
      }

      showSnackbar(message, true);
    } catch (e) {
      showSnackbar(e.message, true);
    }
  };

  resendConfirmation = async (email) => {
    const { userId, showSnackbar } = this.props;
    try {
      const { statusCode, message } = await profileServices.setPrimaryEmail(userId, email);

      if (statusCode === 200 || statusCode === 201) {
        showSnackbar(message);
        return;
      }

      showSnackbar(message, true);
    } catch (e) {
      showSnackbar(e.message, true);
    }
  };

  setEmailPrimary = async () => {
    const { userId, showSnackbar, callback } = this.props;
    try {
      const { statusCode, message } = await profileServices.setPrimaryEmail(userId, this.state.primaryEmail);

      if (statusCode === 200 || statusCode === 201) {
        callback();
        showSnackbar(message);
        this.togglePrimaryPopup();
        return;
      }

      showSnackbar(message, true);
    } catch (e) {
      showSnackbar(e.message, true);
    }
  };

  render() {
    const { emails, userId } = this.props;
    return (
      <Fragment>
        {emails.map(email => (
          <Email
            key={email.email}
            {...email}
            onSetPrimary={() => this.togglePrimaryPopup(email.email)}
            onDelete={() => this.toggleDeletePopup(email.id)}
            onResend={() => this.resendConfirmation(email.email)}
          />
        ))}
        <SetPrimaryEmail
          userId={userId}
          email={this.state.primaryEmail}
          onConfirm={this.setEmailPrimary}
          onClose={() => this.togglePrimaryPopup()}
        />
        <DeleteModal
          message='Are you sure you want to remove this email?'
          openModal={!!this.state.deleteEmail}
          onDelete={this.deleteEmail}
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

export default connect(null, mapDispatchToProps)(Emails);
