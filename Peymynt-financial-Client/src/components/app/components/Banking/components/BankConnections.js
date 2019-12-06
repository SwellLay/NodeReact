import React, { Component } from "react";
import {
  Col,
  Form,
  FormGroup,
  InputGroup,
  Label,
  Collapse,
  Button,
  InputGroupAddon,
  Input,
  Select,
  FormText,
  Spinner,
  Row,
  UncontrolledCollapse,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import SelectBox from "utils/formWrapper/SelectBox";
import "./banking.css";

class BankConnections extends Component {
  render() {
    return (
      <div className="content-wrapper__main estimate">
        

        <div className="py-box py-box--large m-0 no-border">
        <header classNameName="py-header--page">
          <div className="py-header--title mt-2">
            <h1 className="py-heading--title text-center">
              Connect your bank or credit card
            </h1>

            <h2 className="text-center mt-2 py-heading--subtitle">
              Save time by importing transactions automatically.
            </h2>
          </div>
        </header>
          <div
            className="bankPayment-container"
            style={{
              padding: 20
            }}
          >
            <Col xs={12} style={{maxWidth:"1000px"}} className="m-auto">
              <div class="card py-box is-highlighted">
                <div className="card-body" style={{padding:'5px', paddingBottom: '0px' }}>
                  <div className="bankPayment-formExplainer py-text--strong">
                    <h6 className="text-center">
                      <span>
                        Search for your bank or select an option below
                      </span>
                    </h6>
                  </div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text py-input-group-text">
                        <i className="fa fa-search"></i>
                      </span>
                    </div>
                    <Input
                      type="text"
                      className="form-control py-form-control"
                      placeholder="Type a bank name. For example, “US Bank” or “SunTrust”"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </div>

                  <div className="py-bank-list row">
                    <div className="py-bank-list__item-wrapper col-md-3 ">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/chase.svg" alt="Chase" />
                          <span>Chase</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/boi.svg" alt="Bank of America" />{" "}
                          <span>Bank of America</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/wells.svg" alt="Wells Fargo" />{" "}
                          <span>Wells Fargo</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/usaa.svg" alt="USAA" />
                          <span>USAA</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/hsbc.png" alt="HSBC" />
                          <span>HSBC</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/lloyd.png" alt="Lloyds Banking" />
                          <span>Lloyds Banking</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img
                            src="/assets/rbs.png"
                            alt="Royal Bank of Scotland"
                          />
                          <span>Royal Bank of Scotland</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/barclays.png" alt="Barclays" />
                          <span>Barclays</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/citizan.svg" alt="Barclays" />
                          <span>Citizens Bank</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/td.svg" alt="TD" />
                          <span>TD</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/bbt.svg" alt="BB" />
                          <span>BB&T</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-bank-list__item-wrapper col-md-3">
                      <div className="institution-list__display">
                        <div className="intitution-list__item">
                          <img src="/assets/azlo.svg" alt="Azlo" />
                          <span>Azlo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={12} style={{maxWidth:"680px"}} className="m-auto ">
              <h2 className="text-center py-section-title mt-5 mb-3">
                Why you should connect your bank or credit card:{" "}
              </h2>
              <div class="card">
                <div className="card-body">
                  <ul className="py-check-list">
                    <li>
                      <i className="fa fa-check"></i>{" "}
                      <strong>Better accounting.</strong> <span className="py--grey-text">See income and
                      expenses that are always up to date.</span>
                    </li>
                    <li>
                      <i className="fa fa-check"></i>{" "}
                      <strong>Better insights.</strong> <span className="py--grey-text">Stay informed with
                      accurate reporting about your business.</span>
                    </li>
                    <li>
                      <i className="fa fa-lock"></i>{" "}
                      <strong>It's secure.</strong> <span className="py--grey-text">Peymynt uses state of the art
                      security to keep your information safe.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </div>
          <Col xs={12} style={{maxWidth:"1000px"}} className="m-auto">
            <header>
              <div className="py-header--title mt-5">
                <h1 className="py-heading--title">Bank Connections</h1>

                <p className="mt-2 py--grey-text">
                  Manage your bank connections for Accounting and Payments.
                </p>
              </div>
            </header>

            <div className="py-box py-box--large p-4">
              <div className="bank_options">
                <h3 className="py-heading--subtitle-wbtn">Payments</h3>
                <div>
                  <button type="button" class=" btn btn-primary">
                    Edit Bank Profile
                  </button>
                </div>
              </div>

              <div className="py--grey-text">
                Choose where to deposit the payments you collect through Wave.
              </div>
            </div>

            <div className="py-box py-box--large p-4">
              <div className="bank_options">
                <h3 className="py-heading--subtitle-wbtn">Accounting</h3>
                <div>
                  <Button type="button" class=" btn btn-primary">
                    Connect a Bank
                  </Button>
                </div>
              </div>
              <div className="py--grey-text">
                Update, add or delete banks, and configure where transactions
                import.
              </div>
              <Row>
                <Col xs={9}  className="m-auto ">
                  <h3 className="mt-5"> Chase (US)</h3>
                  <div>
                  <span className="py--grey-text"><i class="fa fa-home"></i> Account connected on September 24, 2018 • </span>{" "}
                    <a href="#">Edit bank credentials</a> •{" "}
                    <a href="#">Delete connection</a>
                  </div>
                  <div className="mt-2">
                  <span className="py--grey-text"><i class="fa fa-info-circle"></i> Last updated 21 hours ago •</span> <a href="#">Update now</a>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={9} className="m-auto ">
                  <div class="py-box py-box--large mt-5">
                    <div class="form-group mb-0">
                      <div class="d-flex">
                        <FormGroup className="mb-0 text-center pt-3">
                          <Label className="py-switch m-0 mb-2 py--import-padding" htmlFor="bankaccount">
                            <Input
                              id="bankaccount"
                              disabled="disabled"
                              type="checkbox"
                              className="py-toggle__checkbox"
                              name="bankaccount"
                              value="bankaccount"
                              checked="checked"
                            />

                            <span className="py-toggle__handle text-auto"></span>
                            
                          </Label>
                          <small className="py--grey-text">Importing</small>
                        </FormGroup>
                        <FormGroup className=" py-full ml-3 pt-3">
                        <h4 className="py-toggle__label">CHASE COLLEGE</h4>
                            <span className="py-form-field__hint ml-2 mt-2">
                              xxxx7397 • USD $580.39
                            </span>

                        </FormGroup>
                        <Button
                          className="btn btn-outline-secondary py--btn-edit"
                          id="toggler"
                        >
                          <i className="fa fa-pencil"></i>
                        </Button>
                      </div>
                    </div>

                    <UncontrolledCollapse toggler="#toggler">
                      <div class="py-divider mt-2"></div>

                      <div class="form-group row">
                        <Label
                          for="staticEmail"
                          className="col-sm-4 col-form-label text-right "
                        >
                          Import transactions into business
                        </Label>
                        <div class="col-sm-6">
                          <FormGroup>
                            <Input
                              className="py-select--medium"
                              type="select"
                              name="select"
                              id="exampleSelect"
                            >
                              <option>Meet Logic</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                            </Input>
                          </FormGroup>
                        </div>
                      </div>
                      <div class="form-group row">
                        <Label
                          for="inputPassword"
                          className="col-sm-4 col-form-label text-right"
                        >
                          Import transactions into account
                        </Label>
                        <div class="col-sm-6">
                          <FormGroup>
                            <Input
                              className="py-select--medium"
                              type="select"
                              name="select"
                              id="exampleSelect"
                            >
                              <option>CHASE COLLEGE</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                            </Input>
                          </FormGroup>
                        </div>
                      </div>
                      <div class="form-group row">
                        <div class="col-sm-4 col-form-label text-right"></div>
                        <div class="col-sm-6">
                          <Button className="btn btn-outline-primary mr-2">
                            Cancel
                          </Button>
                          <Button className="btn btn-primary">Save</Button>
                        </div>
                      </div>
                    </UncontrolledCollapse>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col  xs={12} md={9} className="m-auto ">
                <div class="py-box py-box--large mt-2">
                    <div class="form-group mb-0">
                      <div class="d-flex">
                        <FormGroup className="mb-0 text-center pt-3">
                          <Label className="py-switch m-0 mb-2 py--import-padding" htmlFor="bankaccount">
                            <Input
                              id="bankaccount"
                              disabled="disabled"
                              type="checkbox"
                              className="py-toggle__checkbox"
                              name="bankaccount"
                              value="bankaccount"
                              checked=""
                            />

                            <span className="py-toggle__handle text-auto"></span>
                            
                          </Label>
                          <small className="py--grey-text">Save Import</small>
                        </FormGroup>
                        <FormGroup className=" py-full ml-3 pt-3">
                        <h4 className="py-toggle__label">TOTAL CHECKING</h4>
                            <span className="py-form-field__hint ml-2 mt-2">
                            xxxx7397 • USD $580.39
                            </span>

                        </FormGroup>
                        <Button
                          className="btn btn-outline-secondary py--btn-edit"
                          id="toggler"
                        >
                          <i className="fa fa-pencil"></i>
                        </Button>
                      </div>
                    </div>
                  </div>


                </Col>
              </Row>

              <Row>
                <Col  xs={12} md={9} className="m-auto ">
                <div class="py-box py-box--large mt-2">
                    <div class="form-group mb-0">
                      <div class="d-flex">
                        <FormGroup className="mb-0 text-center pt-3">
                          <Label className="py-switch m-0 mb-2 py--import-padding" htmlFor="bankaccount">
                            <Input
                              id="bankaccount"
                              disabled="disabled"
                              type="checkbox"
                              className="py-toggle__checkbox"
                              name="bankaccount"
                              value="bankaccount"
                              checked=""
                            />

                            <span className="py-toggle__handle text-auto"></span>
                            
                          </Label>
                          <small className="py--grey-text">Importing</small>
                        </FormGroup>
                        <FormGroup className=" py-full ml-3 pt-3">
                        <h4 className="py-toggle__label">PREMIER SAVINGS</h4>
                            <span className="py-form-field__hint ml-2 mt-2">
                            xxxx9658 • USD $41,227.64
                            </span>

                        </FormGroup>
                        <Button
                          className="btn btn-outline-secondary py--btn-edit"
                          id="toggler"
                        >
                          <i className="fa fa-pencil"></i>
                        </Button>
                      </div>
                    </div>
                  </div>


                  
                </Col>
              </Row>

              <Row>
                <Col  xs={12} md={9} className="m-auto ">
                <div class="py-box py-box--large mt-2">
                    <div class="form-group mb-0">
                      <div class="d-flex">
                        <FormGroup className="mb-0 text-center pt-3">
                          <Label className="py-switch m-0 mb-2 py--import-padding" htmlFor="bankaccount">
                            <Input
                              id="bankaccount"
                              disabled="disabled"
                              type="checkbox"
                              className="py-toggle__checkbox"
                              name="bankaccount"
                              value="bankaccount"
                              checked="checked"
                            />

                            <span className="py-toggle__handle text-auto"></span>
                            
                          </Label>
                          <small className="py--grey-text">Not Importing</small>
                        </FormGroup>
                        <FormGroup className=" py-full ml-3 pt-3">
                        <h4 className="py-toggle__label">SAPPHIRE CHECKING</h4>
                            <span className="py-form-field__hint ml-2 mt-2">
                            xxxx7323 • USD $5,568.16
                            </span>

                        </FormGroup>
                        <Button
                          className="btn btn-outline-secondary py--btn-edit"
                          id="toggler"
                        >
                          <i className="fa fa-pencil"></i>
                        </Button>
                      </div>
                    </div>
                  </div>

                  
                </Col>
              </Row>
            </div>
          </Col>

          <Col xs={12} style={{maxWidth:"1000px"}} className="m-auto">
            <header className="py-header--page mb-2">
              <div className="py-header--title mt-5">
                <h1 className="py-heading--title mb-3">Connected Accounts</h1>
              </div>
              <div class="py-header--action"><Button color="primary" className="mt-5">Connect Account</Button></div>
            </header>
            <ListGroup>
              <ListGroupItem className="list-group-item-dark">
                <ListGroupItemHeading className="mb-0">
                  <img
                    src="/assets/chase.svg"
                    alt="Chase"
                    style={{
                      width: 50,
                      height: 50
                    }}
                    className="mr-3"
                  />{" "}
                  Chase <i className="fa fa-trash-alt float-right mt-3"></i>
                </ListGroupItemHeading>
              </ListGroupItem>
              <ListGroupItem className="pt-4">
                <ListGroupItemHeading>JLK Checking</ListGroupItemHeading>
                <ListGroupItemText>
                <span  className=" py--grey-text">Checking•••• 510</span>
                  <FormGroup className="mb-0 py-full">
                    <Label className="py-switch" htmlFor="bankaccount">
                      <Input
                        id="bankaccount"
                        disabled="disabled"
                        type="checkbox"
                        className="py-toggle__checkbox"
                        name="bankaccount"
                        value="bankaccount"
                        checked=""
                      />

                      <span className="py-toggle__handle"></span>
                      <span className="pl-4 py--grey-text">
                        Automatically import transactions into Accounting
                      </span>
                      <span className="py-form-field__hint receipts-setting__hint-text"></span>
                    </Label>
                  </FormGroup>
                </ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem className="pt-4">
                <ListGroupItemHeading>TKC Checking</ListGroupItemHeading>
                <ListGroupItemText>
                <span  className=" py--grey-text">Checking•••• 526</span>
                  <FormGroup className="mb-0 py-full">
                    <Label className="py-switch" htmlFor="bankaccount">
                      <Input
                        id="bankaccount"
                        disabled="disabled"
                        type="checkbox"
                        className="py-toggle__checkbox"
                        name="bankaccount"
                        value="bankaccount"
                        checked=""
                      />

                      <span className="py-toggle__handle"></span>
                      <span className="pl-4 py--grey-text">
                        Automatically import transactions into Accounting
                      </span>
                      <span className="py-form-field__hint receipts-setting__hint-text"></span>
                    </Label>
                  </FormGroup>
                </ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem className="pt-4">
                <ListGroupItemHeading>JLK Savings</ListGroupItemHeading>
                <ListGroupItemText>
                <span  className=" py--grey-text">Checking•••• 269</span>
                  <FormGroup className="mb-0 py-full">
                    <Label className="py-switch" htmlFor="bankaccount">
                      <Input
                        id="bankaccount"
                        disabled="disabled"
                        type="checkbox"
                        className="py-toggle__checkbox"
                        name="bankaccount"
                        value="bankaccount"
                        checked="checked"
                      />

                      <span className="py-toggle__handle"></span>
                      <span className="pl-4 py--grey-text">
                        Automatically import transactions into Accounting
                      </span>
                      <span className="py-form-field__hint receipts-setting__hint-text"></span>
                    </Label>
                  </FormGroup>
                </ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem className="pt-4">
                <ListGroupItemHeading>Joint Savings</ListGroupItemHeading>
                <ListGroupItemText>
                  <span  className=" py--grey-text"> Checking•••• 269</span>
                  <FormGroup className="mb-0 py-full">
                    <Label className="py-switch" htmlFor="bankaccount">
                      <Input
                        id="bankaccount"
                        disabled="disabled"
                        type="checkbox"
                        className="py-toggle__checkbox"
                        name="bankaccount"
                        value="bankaccount"
                        checked=""
                      />

                      <span className="py-toggle__handle"></span>
                      <span className="pl-4 py--grey-text">
                        Automatically import transactions into Accounting
                      </span>
                      <span className="py-form-field__hint receipts-setting__hint-text"></span>
                    </Label>
                  </FormGroup>
                </ListGroupItemText>
              </ListGroupItem>
            </ListGroup>
          </Col>


          <Col xs={12} style={{maxWidth:"1000px"}} className="m-auto">
            <header className="py-header--page mb-2">
              <div className="py-header--title mt-5">
                <h1 className="py-heading--title mb-3">Connect your bank account</h1>
              </div>
              
            </header>

            <Col md={7} className="m-auto">
            <p className="py--grey-text"> Enter your credentials below as you would for online banking:</p>
            <div class="py-box py-box--small mt-2 p-4">
                    <h3>Chase (US)</h3>
                    <div className="url mb-3 mt-3">
                    <i className="fa fa-home"></i>{ " " } https://www.chase.com/

                    </div>
                    <div className="url">
                    <i className="fa fa-info-circle"></i>{ " " } This connection supports <strong>Banking, Credit Card, Loan, Mortgage, Investment</strong> accounts

                    </div>

                    <Form>

                    <FormGroup className="mt-3">
                      <Label for="username">Username</Label>
                      <Input type="text" name="username" id="username" />
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input type="password" name="password" id="password" />
                    </FormGroup>
                    <FormGroup className="text-center">
                    <Button color="primary" size="lg"><i className="fa fa-lock"></i> Connect</Button>
                    
                    </FormGroup>
                    <FormGroup className="text-center">
                    <a href="#"> Connect different bank</a>
                    </FormGroup>
                    </Form>
                    

            </div>

            <p className="py--grey-text">By logging in, you are indicating that you have read and agree to our bank data provider's <a href="#"> Terms of Use.</a></p>
          </Col>  
          </Col>



        </div>
      </div>
    );
  }
}
export default BankConnections;
