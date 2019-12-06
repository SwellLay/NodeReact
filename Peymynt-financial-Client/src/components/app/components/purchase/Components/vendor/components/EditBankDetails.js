import {
  fetchVendorBankDetails,
  getByIdVendor,
  getVendorBankDetails,
  saveVendorBankDetails
} from 'actions/vendorsAction';
import history from 'customHistory'
import CenterSpinner from 'global/CenterSpinner';
import { cloneDeep, pick, set } from 'lodash';
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Card, CardBody, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { _documentTitle } from 'utils/GlobalFunctions';

class EditBankDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        accountNumber: props.data.accountNumber || '',
        routingNumber: props.data.routingNumber || '',
        accountType: props.data.accountType || 'checking',
      }
    }
  }

  componentDidMount() {
    const { match: { params }, getByIdVendor, fetchVendorBankDetails, businessInfo } = this.props;
    _documentTitle(businessInfo, "Bank Information");
    if (!!params.id) {
      getByIdVendor(params.id);
      fetchVendorBankDetails(params.id);
    }
  }

  componentWillUnmount() {
    this.props.getVendorBankDetails({});
  }

  handleChange(field, value) {
    const data = cloneDeep(this.state.data);

    set(data, field, value);
    this.setState({ data });
  }

  submit = (e) => {
    e.preventDefault();

    const data = pick(this.state.data, ['accountNumber', 'accountType', 'routingNumber']);
    const { match: { params }, saveVendorBankDetails } = this.props;
    saveVendorBankDetails(params.id, data, () => {
      history.push(`/app/purchase/vendors/${params.id}/bank-details`);
    });
  };

  renderHeader() {
    const { vendor, loading } = this.props;

    if (loading) {
      return null;
    }

    return (
      <header className="py-header--page">
        <div className="py-header--title">
          <h2 className="py-heading--title">{vendor.vendorName}</h2>
        </div>

        <div className="py-header--actions">
          <NavLink to="/app/purchase/vendors" activeClassName="" className="btn btn-outline-primary">
              Back to vendors list
            </NavLink>
        </div>
      </header>
    )
  }

  renderForm() {
    const { data } = this.state;
    return (
      <Card className="shadow-box border-0 card-wizard">
        <CardBody className="py-est">
          <Form className="bank-form" onSubmit={this.submit}>
            <FormGroup row>
              <Label for="routingNumber" className="text-right label" sm={4}>
                Routing number<span className="required">*</span>
              </Label>
              <Col sm={8} className="p-0">
                <Input
                  type="number"
                  required
                  value={data.routingNumber}
                  onChange={e => this.handleChange('routingNumber', e.target.value)}
                  name="routingNumber"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="accountNumber" className="text-right label" sm={4}>
                Account number<span className="required">*</span>
              </Label>
              <Col sm={8} className="p-0">
                <Input
                  type="number"
                  value={data.accountNumber}
                  required
                  onChange={e => this.handleChange('accountNumber', e.target.value)}
                  name="accountNumber"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="accountType" className="text-right label" sm={4}>
                Bank account type<span className="required">*</span>
              </Label>
              <Col sm={8} className="p-0 radio-container">
                <div className="py-form-field__element" style={{ paddingTop: '6px' }}>
                  <Label className="py-radio">
                    <Input
                      type="radio"
                      value="checking"
                      checked={data.accountType === 'checking'}
                      onChange={e => e.target.checked && this.handleChange('accountType', e.target.value)}
                      name="accountType"
                    />{' '}
                    <span className="py-form__element__faux" />
                    <span className="py-form__element__label">Checking</span>
                  </Label>
                </div>
                <div className="py-form-field__element">
                  <Label className="py-radio">
                    <Input
                      type="radio"
                      value="saving"
                      checked={data.accountType === 'saving'}
                      onChange={e => e.target.checked && this.handleChange('accountType', e.target.value)}
                      name="accountType"
                    />{' '}
                    <span className="py-form__element__faux" />
                    <span className="py-form__element__label">Savings</span>
                  </Label>
                </div>
              </Col>
            </FormGroup>
            <FormGroup row className="btn-container">
              <Col sm={{ size: 8, offset: 4 }} className="p-0">
                <button type="submit" className="btn btn-primary">Save</button>
              </Col>
            </FormGroup>
            <div className="information-section">
              <img
                src={`${process.env.CDN_URL}/static/web-assets/vendor-payment-check.svg`}
                alt="Check"
              />
            </div>
          </Form>
        </CardBody>
      </Card>
    )
  }

  renderContent() {
    const { loading } = this.props;

    return (
      <div className="content">
        {loading ? <CenterSpinner /> : this.renderForm()}
      </div>
    );
  }

  renderBody() {
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderContent()}
      </Fragment>
    )
  }

  render() {
    return (
      <div className="vendorWrapper">
        <div className="content-wrapper__main__fixed add-bank-details">
          {this.renderBody()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ getByIdVendor, vendorBank, businessReducer }) => {
  return {
    businessInfo: businessReducer.selectedBusiness,
    vendor: getByIdVendor.data ? getByIdVendor.data.vendor : {},
    loading: getByIdVendor.loading || vendorBank.loading,
    data: vendorBank.data,
  };
};

export default withRouter(connect(mapStateToProps, {
  getByIdVendor,
  fetchVendorBankDetails,
  saveVendorBankDetails,
  getVendorBankDetails,
})(EditBankDetails))
