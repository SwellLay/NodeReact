import React from 'react';
import classnames from 'classnames';
import { Collapse, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export const CreateAccountModal = props => {
    const { toggleModal, tabToggle, collapseToggle, addNewIncome, modal, activeTab } = props
    return (
        <Modal isOpen={modal} toggle={toggleModal} className="modal-add">
            <ModalHeader toggle={toggleModal}>Create a new account</ModalHeader>
            <ModalBody>
                <p className="mrB5">Search for an account, or browse the account categories.</p>
                <Form>
                    <FormGroup row>
                        <Col sm={12}><Label for="exampleEmail">Search by account name</Label></Col>
                        <Col sm={6}>
                            <Input required type="text" name="email" />
                        </Col>
                    </FormGroup>
                </Form>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '1' })}
                        //onClick={() => { tabToggle('1'); }}
                        >
                            Assets
                                    </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '2' })}
                        //onClick={() => { tabToggle('1'); }}
                        >
                            Liability/Credit Card
                                    </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '3' })}
                            onClick={() => { tabToggle('3'); }}
                        >
                            Income
                                 </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '4' })}
                        //onClick={() => { tabToggle('1'); }}
                        >
                            Expense
                                    </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '5' })}
                        //onClick={() => { tabToggle('1'); }}
                        >
                            Equity
                                    </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="12">
                                <h4>Tab 1 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="12">
                                <h4>Tab 1 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row>
                            <Col sm="12">
                                <ul className="folder-list">
                                    {addNewIncome.map(incomeList => {
                                        return (<li>
                                            <a onClick={e => collapseToggle(incomeList, "mainList")}><i className="fa fa-folder pdR5" aria-hidden="true"></i>{incomeList.title}</a>

                                            <Collapse isOpen={incomeList.incomeShowMore}>
                                                {incomeList.content.map(contentList => {
                                                    return (
                                                        <ul className="sub-folder-list">
                                                            <li>
                                                                <a onClick={e => collapseToggle(incomeList, "subList", contentList.title)}>
                                                                    <i className="fa fa-folder pdR5" aria-hidden="true"></i>
                                                                    {contentList.title}</a>
                                                                <Collapse isOpen={contentList.showMore}>
                                                                    <ul className="sub-link">
                                                                        {contentList.contentData.map(data => {
                                                                            return (
                                                                                <li>
                                                                                    <a>{data} </a>
                                                                                </li>
                                                                            )
                                                                        })}
                                                                    </ul>
                                                                </Collapse>
                                                            </li>
                                                        </ul>

                                                    )
                                                })}
                                            </Collapse>
                                        </li>)
                                    })}
                                </ul>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="4">
                        <Row><Col sm="12">Expense</Col></Row>
                    </TabPane>
                    <TabPane tabId="5">
                        <Row><Col sm="12">Equity</Col></Row>
                    </TabPane>
                </TabContent>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={toggleModal}>Close</Button>
            </ModalFooter>
        </Modal>
    )
}