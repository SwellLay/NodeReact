import React, { PureComponent } from 'react'

import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class EditBusinessInformation extends PureComponent {

    componentDidMount(){
        document.title="Peymynt - Edit Business"
    }

    render() {
        return (
            <div className="content-wrapper__main__fixed">
                <header className="py-header--page">
                    <div className="content">
                        <h4 className="mb-0">Edit medical</h4>
                    </div>
                </header>
                <div className="content">
                    <Form>
                        <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Company Name <span className="text-danger">*</span></Label>
                            <Col md={5}>
                                <Input type="text" name="cname" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Address Line 1</Label>
                            <Col md={5}>
                                <Input type="text" name="address1" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Address Line 2</Label>
                            <Col md={5}>
                                <Input type="text" name="address2" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">City</Label>
                            <Col md={5}>
                                <Input type="text" name="city" />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mrB0">
                            <Label for="exampleSelectMulti" md={3} className="text-right">Country <span className="text-danger">*</span></Label>
                            <Col md={4}>
                                <Input type="select" name="country">
                                    <option value="">---------</option>
                                    <option value="IND">India</option>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md={10} className="offset-3">
                                <div className="fnt-13">If you do business in one country but are based in another, choose the<br/> country where you file your taxes, or where your business is incorporated.</div>
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="exampleSelectMulti" md={3} className="text-right">Province/State</Label>
                            <Col md={4}>
                                <Input type="select" name="country">
                                    <option value="">---------</option>
                                    <option value="MP">MP</option>
                                </Input>
                            </Col>
                        </FormGroup>

                         <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Postal/Zip Code</Label>
                            <Col md={3}>
                                <Input type="text" name="zipcode" />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="exampleSelectMulti" md={3} className="text-right">Time Zone</Label>
                            <Col md={4}>
                                <Input type="select" name="tzone">
                                    <option value="">---------</option>
                                    <option value="1">Asia/Koltaka</option>
                                </Input>
                            </Col>
                        </FormGroup>

                         <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Phone</Label>
                            <Col md={3}>
                                <Input type="text" name="phone" />
                            </Col>
                        </FormGroup>

                         <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Fax</Label>
                            <Col md={3}>
                                <Input type="text" name="fax" />
                            </Col>
                        </FormGroup>

                         <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Mobile</Label>
                            <Col md={3}>
                                <Input type="text" name="mobile" />
                            </Col>
                        </FormGroup>

                         <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Toll Free</Label>
                            <Col md={3}>
                                <Input type="text" name="tollfree" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="exampleEmail" md={3} className="text-right">Website</Label>
                            <Col md={5}>
                                <Input type="text" name="website" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label for="exampleEmail" md={3} className="text-right">Business Currency</Label>
                            <Col md={9}>
                                INR - Indian rupee
                                <p>This is your reporting currency and cannot be changed. You can still send invoices, track expenses and enter transactions in any currency and an exchange rate is applied for you.</p>
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col md={10} className="offset-custom">
                                <Button className="btn-primary">Save</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                    <hr className="py-divider"/>
                    <div>
                        <h4 className="mrT25 mrB25">Save Archive This Business</h4>
                        <p>This will hide <strong>medical</strong> from every menu and you will no longer be able to access it. You can always restore this business later.</p>
                        <Button className="btn btn-rounded btn-border" color="primary">Archive medical</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditBusinessInformation