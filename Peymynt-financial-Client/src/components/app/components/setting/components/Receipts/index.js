import { fetchReceiptSettings, saveReceiptSettings } from 'actions/receiptSettings';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Card, CardBody, Col, Form, FormGroup } from 'reactstrap';

class Receipts extends Component {
  componentDidMount() {
    this.props.fetchReceiptSettings();

    const { businessInfo } = this.props;
    document.title = businessInfo ? `Peymynt - ${businessInfo.organizationName} - Receipts Settings` : "Peymynt - Receipts Settings";
  }

  handleField = (event) => {
    const { name, checked } = event.target;

    const payload = {
      [name]: checked,
    };

    this.props.saveReceiptSettings(payload);
  };

  render() {
    const { data, loading } = this.props;

    return (
      <div className="py-page__content">
        <div className="py-page__inner">
          <header className="py-header--page">
            <div className="py-header--title">
              <h4 className="py-heading--title">Receipt Settings</h4>
            </div>
          </header>
          <Form>
            <FormGroup>
                <label className="py-switch" htmlFor="upload_via_mail">
                <input
                  id="upload_via_mail"
                  disabled={loading}
                  type="checkbox"
                  className="py-toggle__checkbox"
                  name="upload_via_mail"
                  value="upload_via_mail"
                  onChange={this.handleField}
                  checked={data.upload_via_mail}
                />
                <span className="py-toggle__handle"></span>
                <span className="py-toggle__label">
                      Upload via email
                </span>
                <span className="py-form-field__hint receipts-setting__hint-text">Allow receipts to be sent via email for all businesses.</span>
                </label>
            </FormGroup>
            <FormGroup>

                <label className="py-switch" htmlFor="capture_automatically">
                  <input
                          id="capture_automatically"
                          disabled={loading}
                          type="checkbox"
                          name="capture_automatically"
                          value="capture_automatically"
                          onChange={this.handleField}
                          checked={data.capture_automatically}
                        />
                      <span className="py-toggle__handle"></span>
                  <span className="py-toggle__label">
                      Capture details automatically
                  </span>
                      <span className="py-form-field__hint receipts-setting__hint-text">Automatically read and capture receipt details after taking a photo, uploading, or sending via email.</span>
                </label>
            </FormGroup>
          </Form>
          </div>
      </div>
    )
  }
}

const mapPropsToState = ({ receiptSettings: { data, loading }, snackbar, businessReducer }) => ({
  businessInfo: businessReducer.selectedBusiness,
  data,
});

export default connect(mapPropsToState, { saveReceiptSettings, fetchReceiptSettings })(Receipts)
