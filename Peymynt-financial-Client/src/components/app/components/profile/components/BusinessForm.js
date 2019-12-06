import React from 'react';
import { Form, FormGroup, Label, Col, Input, FormText } from 'reactstrap';

export const BusinessForm = ({handleFormSubmission, handleText}) => (
    <Form onSubmit={e => handleFormSubmission(e)}>
        <FormGroup row>
            <Label for="companyName" className="text-right" xs={12} sm={4} md={3} lg={3}>Company Name <span className="text-danger">*</span></Label>
            <Col xs={12} sm={8} md={8} lg={8}>
                <Input required type="text"
                    value={'userInput.firstName'}
                    name="companyName"
                    onChange={(e) => handleText(e)}
                />
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label for="addressLine1" className="text-right" xs={12} sm={4} md={3} lg={3}>Address Line 1 </Label>
            <Col xs={12} sm={8} md={8} lg={8}>
                <Input type="text"
                    value={'userInput.firstName'}
                    name="addressLine1"
                    onChange={(e) => handleText(e)}
                />
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label for="addressLine2" className="text-right" xs={12} sm={4} md={3} lg={3}>Address Line 2 </Label>
            <Col xs={12} sm={8} md={8} lg={8}>
                <Input type="text"
                    value={'userInput.firstName'}
                    name="addressLine2"
                    onChange={(e) => handleText(e)}
                />
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label for="city" className="text-right" xs={12} sm={4} md={3} lg={3}>City </Label>
            <Col xs={12} sm={8} md={8} lg={8}>
                <Input type="text"
                    value={'userInput.firstName'}
                    name="city"
                    onChange={(e) => handleText(e)}
                />
            </Col>
        </FormGroup>
        <FormGroup row>
                <Label for="country" className="text-right" xs={12} sm={4} md={3} lg={3}>Country  <span className="text-danger">*</span></Label>
                <Col xs={12} sm={6} md={6} lg={6}>
                    <Input
                        type="select"
                        name="country"
                        // value={'userInput.address'.country.id}
                        onChange={(e) => handleText(e)}
                        >
                        <option key={-1} value={""}>
                            {"Select Country"}
                        </option>
                        {/* {setCountries(countries)} */}
                    </Input>
                    <FormText>
                    If you do business in one country but are based in another, choose the country where you file your taxes, or where your business is incorporated.
                    </FormText>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label
                    for="state"
                    className="text-right"
                    xs={12}
                    sm={4}
                    md={3}
                    lg={3}
                >
                    Province/State
                </Label>
                <Col xs={12} sm={6} md={6} lg={6}>
                    <Input
                    type="select"
                    name="state"
                    // value={parseInt('userInput.address'.state.id)}
                    onChange={(e) => handleText(e)}
                    >
                    <option key={-2} value={""}>
                        {"Select State"}
                    </option>
                    {/* {setCountryStates(states)} */}
                    </Input>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="firstName" className="text-right" xs={12} sm={4} md={3} lg={3}>Postal/Zip Code </Label>
                <Col xs={12} sm={6} md={6} lg={4}>
                    <Input type="text"
                        value={'userInput.postal'}
                        name="postal"
                        onChange={(e) => handleText(e)} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="timeZone" className="text-right" xs={12} sm={4} md={3} lg={3}>Time Zone </Label>
                <Col xs={12} sm={8} md={8} lg={8}>
                    <Input type="text"
                        value={'userInput.address'.city}
                        name="timeZone"
                        onChange={(e) => handleText(e)} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="phone" className="text-right" xs={12} sm={4} md={3} lg={3}>Phone </Label>
                <Col xs={12} sm={6} md={6} lg={4}>
                    <Input type="text"
                        value={'userInput.dateOfBirth'}
                        name="phone"
                        onChange={(e) => handleText(e)} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="fax" className="text-right" xs={12} sm={4} md={3} lg={3}>Fax </Label>
                <Col xs={12} sm={6} md={6} lg={4}>
                    <Input type="text"
                        value={'userInput.dateOfBirth'}
                        name="fax"
                        onChange={(e) => handleText(e)} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="mobile" className="text-right" xs={12} sm={4} md={3} lg={3}>Mobile </Label>
                <Col xs={12} sm={6} md={6} lg={4}>
                    <Input  type="text"
                        value={'userInput.dateOfBirth'}
                        name="mobile"
                        onChange={(e) => handleText(e)} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="website" className="text-right" xs={12} sm={4} md={3} lg={3}>Website </Label>
                <Col xs={12} sm={6} md={6} lg={4}>
                    <Input type="text"
                        value={'userInput.dateOfBirth'}
                        name="website"
                        onChange={(e) => handleText(e)} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="website" className="text-right" xs={12} sm={4} md={3} lg={3}>Buisiness Currency </Label>
                <Col xs={12} sm={6} md={6} lg={6}>
                    <Input type="text"
                        value={'userInput.dateOfBirth'}
                        name="website" readOnly/>
                        <FormText className="helpingText no-mg">
                        This is your reporting currency and cannot be changed. You can still send invoices, track expenses and enter transactions in any currency and an exchange rate is applied for you. <a href="javascript: void(0)">Learn more</a>
                        </FormText>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col xs={12} sm={6} md={6} lg={4}  className="btnSave btnWrp">
                    <button className="btn btn-primary"> Save</button>
                </Col>
            </FormGroup>
    </Form>
)