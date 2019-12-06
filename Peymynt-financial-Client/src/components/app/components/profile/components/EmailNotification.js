import profileServices from 'api/profileService';
import MiniSidebar from 'global/MiniSidebar'
import { cloneDeep, set } from 'lodash';
import React, { Component } from 'react'
import { FormGroup, Label, Spinner } from 'reactstrap';
import { openGlobalSnackbar } from '../../../../../actions/snackBarAction';
import { connect } from 'react-redux';

function getUserId() {
  return localStorage.getItem('user.id');
}

function getUserEmail(){
  return localStorage.getItem('user.email');
}

class EmailNotification extends Component {
  state = {
    data: {},
    loading: false,
    saving: false,
    email:getUserEmail()
  };

  componentDidMount() {
    document.title = "Peymynt - Email & Notifications";
  //console.log("useremail", localStorage.getItem(email))
    this.fetchNotifications();
  }

  getData() {
    return this.state.data;
  }

  fetchNotifications = async () => {
    this.setState({ loading: true });
    const { data } = await profileServices.getUserNotifications(getUserId());

    this.setState({ loading: false, data: { ...data.notificationSetting } })
  };

  updateNotifications = async () => {
    this.setState({ saving: true });
    const payload = this.getData();
    const { data, message } = await profileServices.updateUserNotifications(getUserId(), { notificationSettingInput: payload });
    this.props.openGlobalSnackbar(message, false);
    this.setState({ saving: false, data: { ...data.notificationSetting } });
  };

  handleChange = ({ target: { name, checked } = {} } = {}) => {
    const data = cloneDeep(this.state.data);
    set(data, name, checked);
    this.setState({ data });
  };

  render() {
    const { params } = this.props;

    let lists = [
      { name: 'Personal Information', link: `/app/${params.userId}/accounts` },
      { name: 'Emails & Connected Accounts', link: `/app/${params.userId}/accounts/email-connected` },
      { name: 'Password', link: `/app/${params.userId}/accounts/password` },
      { name: 'Email Notification', link: `/app/${params.userId}/accounts/email-notification`, className: "active" },
      { name: 'Businesses', link: `/app/${params.userId}/accounts/business` }
    ];

    const { loading, saving, data, email } = this.state;

    return (
      <div className="py-frame__page has-sidebar">

        <MiniSidebar heading={'Profile'} listArray={lists} />

        <div className="py-page__content">
          <div className="py-page__inner">
            <div className="py-header--page">
              <div className="py-header--title">
                <h2 className="py-heading--title">Email Notifications</h2>
              </div>
            </div>

            <p className="py-text">Peymynt will never share or sell your personally identifiable information or details.
              These emails will be sent to your primary Peymynt email address: <span
                className="py-text--strong">{email}</span>.</p>

            <h2 className="py-heading--section-title">News, education and updates</h2>
            <p className="py-text">We will send you emails to help set up your account, teach you about Peymynt, announce
              new product features, and show you offers from our Peymynt partners. <span className="py-text--strong">You can control these email preferences
              directly from those emails.</span></p>

            <h2 className="py-heading--section-title">Account notifications</h2>
            <p className="py-text">We will send you notifications to inform you of any updates and/or changes as events
              occur for you or your business in Peymynt. Select which notifications you want to receive below:</p>

            <div className="py-notify py-notify--info py-notify--small">
              <div className="py-notify__icon-holder">
                                <span className="py-icon icon-lg">
                                <svg viewBox="0 0 20 20" className="py-svg-icon" id="info"
                                  xmlns="http://www.w3.org/2000/svg"><path
                                  d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
                                </span>
              </div>
              <div className="py-notify__content-wrapper">
                <div className="py-notify__content">
                  <div className="py-notify__message">
                    Some mandatory communications may be sent to you regardless of your custom notification preferences.
                    We are required to inform you of financial service disputes, system notifications, changes to our
                    Terms of Use, etc.
                  </div>
                </div>
              </div>
            </div>


            <fieldset className="py-form-fieldset">
              <FormGroup className="mb-0">
                <label className="py-checkbox">
                  <input type="checkbox" disabled={loading} id="notify_accounting" name="notify_accounting"
                    checked={data.notify_accounting} onChange={this.handleChange} />
                  <span className="py-form__element__faux"></span>
                  <span className="py-form__element__label">Accounting</span>
                </label>
                <span
                  className="py-form-field__hint">When accounting and bookkeeping transactions need your attention.</span>
              </FormGroup>

              <FormGroup className="mb-0">

                <Label className="py-checkbox">
                  <input type="checkbox" disabled={loading} id="notify_sales" name="notify_sales"
                    checked={data.notify_sales} onChange={this.handleChange} />
                  <span className="py-form__element__faux"></span>
                  <span className="py-form__element__label">Sales</span>
                </Label>
                <span className="py-form-field__hint">When relevant sales-related activity occurs such as when an invoice is overdue.</span>
              </FormGroup>

              <FormGroup className="mb-0">
                <label className="py-checkbox">
                  <input type="checkbox" disabled={loading} id="notify_payroll" name="notify_payroll"
                    checked={data.notify_payroll} onChange={this.handleChange} />
                  <span className="py-form__element__faux"></span>
                  <span className="py-form__element__label">Payroll</span>
                </label>
                <span
                  className="py-form-field__hint">When you need to be reminded of upcoming and/or late payrolls.</span>
              </FormGroup>

              <FormGroup className="mb-0">
                <label className="py-checkbox">
                  <input type="checkbox" disabled={loading} id="notify_payment" name="notify_payment"
                    checked={data.notify_payment} onChange={this.handleChange} />
                  <span className="py-form__element__faux"></span>
                  <span className="py-form__element__label">Payments</span>
                </label>
                <span className="py-form-field__hint">When you’ve been paid or need to be notified to keep your Payments by Peymynt operating.</span>
              </FormGroup>

              <FormGroup className="mb-0">
                <label className="py-checkbox">
                  <input type="checkbox" disabled={loading} id="notify_purchase" name="notify_purchase"
                    checked={data.notify_purchase} onChange={this.handleChange} />
                  <span className="py-form__element__faux"></span>
                  <span className="py-form__element__label">Purchases</span>
                </label>
                <span className="py-form-field__hint">When receipt exports are ready and when receipts you’ve emailed to Peymynt need to be posted into accounting.</span>
              </FormGroup>

              <FormGroup className="mb-0">
                <label className="py-checkbox" for="customCheck6">
                  <input type="checkbox" disabled={loading} id="notify_banking" name="notify_banking"
                    checked={data.notify_banking} onChange={this.handleChange} />
                  <span className="py-form__element__faux"></span>
                  <span className="py-form__element__label">Banking</span>
                </label>
                <span className="py-form-field__hint">When there are any issues related to your bank connections.</span>
              </FormGroup>
            </fieldset>

            <button className="btn btn-primary" onClick={this.updateNotifications} disabled={saving}>
             Update {saving && (<Spinner size="sm" color="light" />)}
            </button>
          </div>
        </div>
      </div>

    )
  }
}

export default (connect(null, { openGlobalSnackbar })(EmailNotification))