import { capitalize } from 'lodash';
import Papa from 'papaparse';
import React, { Fragment, PureComponent } from 'react'
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Button, Col, Collapse, Container, FormGroup, Input, Row } from 'reactstrap';
import { openGlobalSnackbar } from '../actions/snackBarAction';
import customerServices from '../api/CustomerServices';
import { fetchCountries, fetchCurrencies } from '../api/globalServices';
import vendorServices from '../api/vendorsService';
import history from '../customHistory';
import CenterSpinner from './CenterSpinner';
import CsvPreview from './CsvPreview';
import SweetAlertSuccess from './SweetAlertSuccess';

const headings = ["Company Name", "First Name", "Last Name", "Email", "Phone", "Address 1", "Address 2", "City", "Postal/Zip Code", "Country", "Currency"];

class ImportCsv extends PureComponent {
  state = {
    collapse: false,
    selectedFile: null, loaded: 0,
    isUpload: false,
    isPreview: false,
    csvData: null,
    countries: [],
    currencies: [],
    results: undefined,
  };

  componentDidMount() {
    const { businessInfo } = this.props;
    document.title = businessInfo && businessInfo.organizationName ? `Peymynt-${businessInfo.organizationName}-Import CSV Customer` : `Peymynt-Import CSV Customer`;
    this.loadInitialData();
  }

  loadInitialData = async () => {
    const [currencies, countries] = await Promise.all([this.fetchCurrencies(), this.fetchCountries()]);

    this.setState({ currencies, countries });
  };

  fetchCurrencies = async () => {
    const countries = await fetchCurrencies();
    return countries.map(c => c.currencies[0]);
  };

  fetchCountries = async () => {
    const { countries } = await fetchCountries();
    return countries;
  };

  findCountry(code) {
    const country = this.state.countries.find(row => row.iso2 === code);
    return country || undefined;
  }

  findCurrency(code) {
    const currency = this.state.currencies.find(row => row.code === code);
    return currency || undefined;
  }

  toggleInstruction = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  _validateCsv = result => {
    const data = result.data.filter(row => Object.values(row).filter(r => r.trim().length).length);
    if (!data.length) {
      this.props.showSnackbar("Please Upload CSV with Data", true);
      return;
    }
    this.setState({
      isPreview: true,
      csvData: data,
    })
  };

  formatDataForCustomers() {
    const { csvData } = this.state;
    console.log("csvData", csvData);
    if (!csvData || !csvData.length) {
      return [];
    } else {
      return csvData.map((row) => ({
        customerName: row['customerName'] || row['Company Name'],
        firstName: row['firstName'] || row['First Name'],
        lastName: row['lastName'] || row['Last Name'],
        email: row['email'] || row['Email'],
        phone: row['phone'] || row['Phone'],
        country: !!row['country'] ? this.findCountry(row['country']) : {},
        city: row['city'] || "",
        addressLine1: row['address1'] || "",
        addressLine2: row['address2'] || "",
        postal: row['postalCode'] || "",
        currency: !!row['currency'] ? this.findCurrency(row['currency']) : {},
      }));
    }
  }

  formatDataForVendors() {
    const { csvData } = this.state;
    if (!csvData || !csvData.length) {
      return [];
    }

    return csvData.map((row) => ({
      vendorType: 'regular',
      vendorName: row['Company Name'],
      firstName: row['firstName'] || row['First Name'],
      lastName: row['lastName'] || row['Last Name'],
      email: row['email'] || row['Email'],
      phone: row['phone'] || row['Phone'],
      communication: {
        phone: row['Phone'],
      },
      address: {
        country: this.findCountry(row['country'] || row['Country']),
        city: row['city'] || row['City'],
        addressLine1: row['address1'] || row['Address 1'],
        addressLine2: row['address2'] || row['Address 2'],
        postal: row['postalCode'] || row['Postal Code'],
      },
      currency: this.findCurrency(row['currency'] || row['Currency']),
    }));
  }

  submitForVendorUpload = async (e) => {
    e.preventDefault();
    const from = this.props.location.pathname.includes('vendor') ? 'vendors' : 'customers';
    let mapData = [];
    let response;
    this.setState({ loading: true, isPreview: false });
    if (from === 'vendors') {
      mapData = this.formatDataForVendors();
      if (!mapData.length) {
        this.setState({ loading: false });
        this.props.showSnackbar('CSV is empty.', true);
        return;
      }
      try {
        response = await vendorServices.csvUpload({ vendorImport: mapData });
        if (response.statusCode === 200 || response.statusCode === 201) {
          this.setState({ success: true, loading: false, results: {} });
        } else {
          this.setState({ success: false, loading: false, message: response.message, results: undefined });
        }
      } catch (e) {
        console.log("in error", e);
        this.setState({ success: false, loading: false, message: e.message, results: undefined });
      }
    } else {
      mapData = this.formatDataForCustomers();
      if (!mapData.length) {
        this.setState({ loading: false });
        this.props.showSnackbar('CSV is empty.', true);
        return;
      }
      try {
        response = await customerServices.csvUploadForCustomers({ customerImport: mapData });
        console.log("mapData", response);
        if (response.statusCode === 200 || response.statusCode === 201) {
          this.setState({ success: true, loading: false })
        } else {
          this.setState({ success: false, message: response.message, loading: false });
        }
      } catch (e) {
        console.log("in error", e);
        this.setState({ success: false, message: e.message, loading: false });
      }
    }

  };

  handleUpload = async () => {
    if (!!this.state.selectedFile) {
      Papa.parse(this.state.selectedFile, {
        complete: this._validateCsv,
        header: true
      });
    } else {
      this.props.showSnackbar("Please Upload CSV", true);
    }
  };

  handleSelectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  };

  onCancel = () => {
    this.setState({ isPreview: false, csvData: [], results: undefined });
  };

  renderContent() {
    const { collapse, isPreview, csvData, loading, results } = this.state;

    const element = this.props.location.pathname.includes('vendor') ? 'vendors' : 'customers';

    if (loading) {
      return (
        <CenterSpinner />
      );
    }

    if (results) {
      return (
        <div className="import-successful">
          <div className="check-container">
            <img src={'/assets/images/checkmark.png'} alt="check" />
          </div>
          <div className="info-container">
            <h4>Imported {results.successful} {element} successfully!</h4>
            {results.errors && results.errors.length ? (
              <p className="errors text-danger">
                Could not import rows {results.errors.map(r => r.index + 1).join(', ')}
              </p>
            ) : null}
          </div>
          <NavLink to={element === 'vendors' ? '/app/purchase/vendors' : '/app/sale/customers'}
            className="btn btn-gray btn-rounded">
            View {element}
          </NavLink>
        </div>
      );
    }

    if (isPreview) {
      return (
        <CsvPreview
          headings={headings}
          columns={csvData}
          onCancel={this.onCancel}
          onSubmit={this.submitForVendorUpload}
        />
      );
    }

    return (
      <Fragment>
        <FormGroup>
          <Input type="file"
            name="upload"
            required
            accept={'.csv'}
            onChange={this.handleSelectedFile} />
          {this.state.isUpload ?
            <div className='alert-success success'>File Uploaded successfully</div> : null}

        </FormGroup>
        <FormGroup className="text-center">
          <Button
            className="btn-primary"
            disabled={this.state.errorMessage}
            onClick={this.handleUpload}>
            Upload and preview {element}
          </Button>
        </FormGroup>
        <div className="py-divider" />
        <span className="text-muted">Maximum 10MB file size. CSV file type only.</span>
      </Fragment>
    );
  }

  render() {
    const { collapse, success } = this.state;
    const { pathname } = this.props.location;

    let text = 'customers',
        url = '/app/sales/customer';

    if (pathname.includes('vendor')) {
      text = 'vendors';
        url = '/app/purchase/vendors';
    }

    return (
      <div className="content-wrapper__main import-wrapper">
        <header className="py-header--page">
          <div className="py-header--title">
            <h2 className="py-heading--title">
              {/* <small>
                              <NavLink
                                  to={url}><i className="text-muted fa fa-chevron-left" style={{}}></i></NavLink> </small> */}
              Import {text} from CSV
            </h2>
          </div>
        </header>

        <p>A CSV (comma-separated values) file is a spreadsheet file that is used by Peymynt to
          import {text} information into your business.</p>
        <div className="shadow-box border-0 mt-4">
          <div>
            <div className="py-box py-box--large">
              {this.renderContent()}
            </div>
            <div>
              {/*<span> <object data="assets/icons/ic_question.svg" type="image/svg+xml" /></span>*/}
              Need help creating your CSV file? {' '}
              <a onClick={this.toggleInstruction} href="javascript:void(0)"><strong>View Instructions <i
                className="fa fa-chevron-down" aria-hidden="true"></i></strong></a>
            </div>
            <hr />
            <Collapse isOpen={collapse}>
              <h4 className="py-heading--subtitle"><span style={{ textTransform: 'capitalize' }}
                className="color-less-muted">{text}</span> CSV template file</h4>
              <p className="py-text--body">
                <a href="https://s3.ap-south-1.amazonaws.com/peymynt-dev/pdf/Peymynt+-+Contacts+Sample.csv"
                  download>
                  <strong>Download and view our {text} CSV template.</strong>
                </a> You can use this as a template for creating your CSV file.
              </p>
              <h4 className="py-heading--subtitle">File format</h4>
              <p>The first line of your {text} CSV <strong>must include all of the headers</strong> listed below,
                which are included in the <a
                  href="https://s3.ap-south-1.amazonaws.com/peymynt-dev/pdf/Peymynt+-+Contacts+Sample.csv"
                  download><strong>{text} CSV template.</strong></a></p>
              <div className="py-box py-box--large py-box--gray">
                <div className="box-head">
                  <p>
                    <svg viewBox="0 0 20 20" className="py-svg-icon mr-2" id="info" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path>
                    </svg>
                    <strong>Reminder: </strong> All CSV file headers are case-sensitive.
                  </p>
                </div>
                <hr />
                <div className="box-body">
                  <Container>
                    <Row className="no-gutters">
                      <Col md={4}>
                        <strong> Company Name</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The name of the company. If blank, it will default to the {text}'s first and last names.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> First Name</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The first name of your {text}.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> Last Name</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The last name of your {text}.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> Email</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The email address of your {text}.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> Phone</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The {text}'s phone number.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> Address 1</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The first line of the {text}'s address.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> Address 2</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The second line of the {text}'s address.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> City</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The city the {text} is in.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> Postal Code</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The ZIP or postal code for the {text}'s address.
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> Country</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The {text}'s <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2"
                          target="_blank"><strong>country ISO code.</strong></a>
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row className=" no-gutters">
                      <Col md={4}>
                        <strong> Currency</strong>
                      </Col>
                      <Col md={8}>
                        <div className="">
                          The <a href="https://en.wikipedia.org/wiki/ISO_4217" target="_blank"><strong>currency ISO
                          code</strong></a>{' '}
                          for the {text}. If not specified, it will default to your business currency.
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>

              </div>
              <h4 className="py-heading--subtitle">Exporting your CSV file from Excel or other software</h4>
              <p>
                <svg viewBox="0 0 20 20" className="py-svg-icon mr-2" id="info" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path>
                </svg>
                <strong>Reminder: </strong>When
                importing {text} information, your CSV file must be in UTF-8 format.
              </p>
              <p>You can convert an Excel worksheet (such as the {text} CSV template) to a text file by using the
                Save
                As command. In the Save as type… box, choose the CSV (Comma delimited) text file format for the
                worksheet.</p>
              <p>Most spreadsheet applications have the ability to save CSV files in UTF-8 format with the Save
                As...
                or Export command, depending on the program. </p>
            </Collapse>
          </div>
        </div>
        <SweetAlertSuccess
          onCancel={() => {
            history.push(url);
            this.setState({ success: false })
          }}
          message={`${capitalize(text)} are uploaded.`}
          showAlert={success}
          title="CSV Upload Success"
          from="invoice"
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error))
    }
  };
};

export default connect(null, mapDispatchToProps)(ImportCsv);
