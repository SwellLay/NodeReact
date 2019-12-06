import React, { Component } from 'react'
import CustomerForm from '../../sales/components/customer/CustomerForm';
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';
import ProductForm from '../../sales/components/productServices/ProductForm';
import AddCustomerPopup from '../../RecurringInvoice/AddCustomerPopup';
class Popup extends Component {
    onClose = () => {
        const { onClosePopup, type } = this.props
        onClosePopup(type)
    }

    updateList = (data) => {
        const { updateList, type } = this.props
        updateList(type, data)
    }

    onCloseCustomer = (data) => {
        const { onClosePopup, setData, type } = this.props
        onClosePopup(type)
        console.log("data", data)
        {
            !!data &&
            setData(data, 0)
        }
    }

    render() {
        const { openPopup, onClose, type, isEditMode, customer, invoice, invoiceData } = this.props
        return (
            <Modal isOpen={openPopup} toggle={onClose} className="modal-add modal-common" centered>
                <ModalHeader toggle={onClose}>Add {type=== "ProductPopup" ? " product" : "a customer"}</ModalHeader>
                <ModalBody>
                    {type === 'ProductPopup' ?
                        (< ProductForm
                            flag={true}
                            onClose={this.onClose}
                            updateList={this.updateList}
                        />) :
                        (
                            <AddCustomerPopup
                                type={""}
                                open={openPopup}
                                closeModal={this.onCloseCustomer.bind(this)}
                                isEditMode={isEditMode || false}
                                customer={customer || null}
                                invoice={invoice}
                                invoiceData={invoiceData}
                            />
                        )}
                </ModalBody>
            </Modal>
        )
    }
}

export default Popup