
import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import history from 'customHistory';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { cloneDeep } from 'lodash'
import { Row, Col, Card, CardHeader, CardBody, CardFooter, Table, CardTitle, CardText, Button, Form, FormGroup, Label, Input, CustomInput, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ButtonGroup, ButtonDropdown } from 'reactstrap';

import * as CheckoutActions from '../../../../../../actions/CheckoutActions';
import taxServices from '../../../../../../api/TaxServices'
import { CreateAccountModal } from '../supportComponent/CreateAccountModal';
import { changePriceFormat } from '../../../../../../utils/GlobalFunctions';
import Taxes from '../Taxes';
import { openGlobalSnackbar } from '../../../../../../actions/snackBarAction';
import { convertDate, toDollar, getDateMMddyyyy, convertToPrice, getBadgeByStatus } from '../../../../../../utils/common';
import Badge from '../../../../../../global/Badge';
import { updateCheckoutById, addCheckout } from "../../../../../../api/CheckoutService";

const getTaxes = (taxes) => {
    let _taxes = [];
    if (taxes) {
        taxes.forEach((tax) => {
            if (typeof tax == 'string') {
                _taxes.push(tax);
            } else {
                _taxes.push(tax.id);
            }
        });
    }
    return _taxes;
}

const initialCheckout = (state, isEditMode) => {
    let data = {
        id: state && state._id || '',
        // uuid: state && state.uuid || '',
        currency: state && state.currency ? state.currency : "",
        userId: state && state.userId || localStorage.getItem('user.id'),
        businessId: state && state.businessId || localStorage.getItem('businessId'),
        // business: state && state.business || {},
        itemName: state && state.itemName || '',
        message: {
            success: state && state.message.success || "",
            failure: state && state.message.failure || ""
        },
        price: state && state.price || 0.00,
        total: state && state.total || 0,
        fields: state ? state.fields : { phone: false, address: false, email: true },
        status: state && state.status || '',
        taxes: state && isEditMode && getTaxes(state.taxes) || state && !isEditMode && state.taxes || []
    }
    if (!isEditMode) {
        delete data.id
    }

    return data
}

class CheckoutForm extends Component {
    constructor() {
        super()
        this.state = {
            dropdownOpen: false,
            modal: false,
            errorMessage: '',
            activeTab: '3',
            collapse: false,
            checkoutModel: initialCheckout(),
            isSaveDraft: false,
            isSaveOnline: false,
            isSavingData: false,
            selectedTaxes: [],
            totalAmt: 0,
            allTaxes: [],
            priceLess: false
        }
    }
    fetchtaxList=async()=>{
        let taxResponse = (await taxServices.fetchTaxes()).data.taxes;
        this.setState({
            allTaxes: taxResponse
        })
    }
    componentDidMount = async () => {
        await this.fetchtaxList();
        const { isEditMode, selectedCheckout, errorMessage, selectedBusiness } = this.props
        console.log("selectedBusiness ", selectedBusiness);

        const addCheckoutDetails = (this.props.location && this.props.location.state && this.props.location.state.addCheckoutDetails) ? this.props.location.state.addCheckoutDetails : null;


        const onSelect = isEditMode ? selectedCheckout : addCheckoutDetails;
        const formatedData = initialCheckout(onSelect, isEditMode)
        formatedData.currency = selectedBusiness.currency;
        this.setState({
            checkoutModel: formatedData
        });

        if (addCheckoutDetails && addCheckoutDetails.taxes) {
            let filteredTaxes = this.state.allTaxes.filter((el) => {
                return (addCheckoutDetails.taxes.indexOf(el._id) != -1);
            });

            let taxArray = []
            filteredTaxes.map(item => {
                taxArray.push({
                    value: item._id,
                    label: `${item.abbreviation}  ${item.rate}%`,
                    rate: item.rate
                })
            })

            this.handleSelectChange(taxArray);
        }
    }

    componentDidUpdate = (prevProps) => {
        const { isEditMode, selectedCheckout, isSaveDraft, isSaveOnline } = this.props
        if (prevProps.selectedCheckout != selectedCheckout) {
            const onSelect = isEditMode ? selectedCheckout : null
            const formatedData = initialCheckout(onSelect, isEditMode)
            this.setState({
                checkoutModel: formatedData
            })
        }
    }

    toggleDropdown = (event) => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });

        if (event && event.target && (event.target.innerText === 'Save and turn off' || event.target.innerText === 'Save as draft' || event.target.innerText === 'Save and share')) {
            this.saveCheckoutSubMenuAction();
        }
    }

    handleModalToggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleTabToggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    handleText = (event) => {
        const target = event.target;
        const { name, value } = event.target;
        let modal = this.state.checkoutModel;
        if (target.type === 'checkbox') {
            if (name === "phone") {
                modal.fields.phone = !modal.fields.phone
            } else {
                modal.fields.address = !modal.fields.address
            }
            this.setState({
                checkoutModel: modal
            })
        } else if (name === "taxes") {
            modal.taxes.push(value);
        } else if (name === "message") {
            modal.message.success = value;
            this.setState({
                checkoutModel: modal
            })
        }
        else {

            this.setState({
                checkoutModel: { ...this.state.checkoutModel, [name]: value }
            })
        }
    }

    convertToDecimal = (event) => {
        const { value } = event.target;
        if (value > 0) {
            const price = convertToPrice(value);
            const priceLess = price < 0.51 ? true : false;
            this.setState({
                checkoutModel: { ...this.state.checkoutModel, price },
                priceLess
            })
        }
    }

    handleSelectChange = (selectedOption) => {
        this.setState({
            selectedTaxes: selectedOption
        });

        let checkoutModel = this.state.checkoutModel;
        let selectedTax = selectedOption.map(item => {
            return item.value
        });
        checkoutModel.taxes = selectedTax;
        this.setState({ checkoutModel });
    }

    calculateTotalUSD = () => {
        let totalAmt = this.state.checkoutModel.price;
        if (!this.state.selectedTaxes) {
            return totalAmt;
        }

        this.state.checkoutModel.taxes.forEach((taxId) => {
            this.getTaxRateById(taxId, (rate) => {
                // taxAmt = (this.state.checkoutModel.price * rate)/100;

                let taxAmt = (this.state.checkoutModel.price * rate) / 100;
                totalAmt = parseFloat(totalAmt) + parseFloat(taxAmt);

            });
        });

        // this.state.allTaxes.forEach((tax) => {
        //     let taxAmt = (this.state.checkoutModel.price * tax.rate)/100;
        //     totalAmt = parseFloat(totalAmt) + parseFloat(taxAmt);
        // });

        if (this.state.checkoutModel.total != totalAmt) {
            this.setState({
                checkoutModel: { ...this.state.checkoutModel, 'total': totalAmt }
            })
        }

        return totalAmt;
    }

    calculateTaxById = (taxId) => {
        let taxAmt = 0;
        if (this.state.selectedTaxes) {
            this.getTaxRateById(taxId, (rate) => {
                taxAmt = (this.state.checkoutModel.price * rate) / 100;
            });
            return toDollar(taxAmt);
        } else {
            return toDollar(taxAmt);
        }
    }

    getTaxRateById(taxId, callback) {
        this.state.allTaxes.forEach((tax) => {
            if (tax._id === taxId) {
                callback(tax.rate);
            }
        });
    }

    saveCheckoutMenuAction = () => {
        this.checkoutFormSumbit(1);
    }

    saveCheckoutSubMenuAction = () => {
        this.checkoutFormSumbit(2);
    }

    checkoutFormSumbit = (flag) => {
            const { isEditMode, selectedCheckout } = this.props
            let isShare = false;
            let checkoutObj = this.state.checkoutModel;
            let status = (checkoutObj.status) ? checkoutObj.status : 'Online';

            if (isEditMode === false) {
                status = (flag === 1) ? 'Online' : 'Draft';
            } else {
                if (checkoutObj.status === 'Online' && flag === 2) {
                    status = 'Offline';
                } else if ((checkoutObj.status === 'Draft') || (checkoutObj.status === 'Offline' && flag === 1)) {
                    status = 'Online';
                }
            }
            if ((status === 'Offline' && flag === 2) || (status === 'Online' && flag === 1)) {
                isShare = true;
            }
            isShare = (checkoutObj.status === 'Draft' && flag === 1) ? false : (checkoutObj.status === 'Draft' && flag === 2) ? true : isShare;


            checkoutObj.status = status;
            checkoutObj.message = checkoutObj.message;
            const checkoutId = checkoutObj.id;
            delete checkoutObj.id;
            let payload = {
                checkoutInput: checkoutObj
            }
            this.saveCheckout(payload, checkoutId, status, isShare);

    }

    saveCheckout = async (payload, checkoutId, status, isShare) => {
        let checkoutInput = payload['checkoutInput'];
        let _data = payload;

        this.toggleIsSavingStatus();
        checkoutInput['status'] = status;
        if (!checkoutInput['itemName'] || !checkoutInput['price']) {
            this.props.showSnackbar("Please enter service name and price.", true);
            this.state.checkoutModel.status = '';
        }else if(checkoutInput['price'] < 0.51){
            this.props.showSnackbar("Minimum price should be 0.51.", true);
            this.state.checkoutModel.status = '';
        } else {
            const { isEditMode, actions, type, updateList } = this.props
            try {
                let _price = parseFloat(_data.checkoutInput.price).toFixed(2);
                delete _data.checkoutInput.total;
                delete _data.checkoutInput.price;
                _data.checkoutInput['price'] = parseFloat(_price);
                if (isEditMode) {
                    await updateCheckoutById(checkoutId, _data)
                    this.toggleIsSavingStatus();
                    this.props.showSnackbar("Checkout updated successfully", false);
                    if (isShare === true && checkoutId) {
                        history.push('/app/sales/checkouts/share/' + checkoutId);
                    } else {
                        history.push('/app/sales/checkouts');
                    }
                } else {
                    let response = await actions.addCheckout(_data);
                    this.toggleIsSavingStatus();
                    this.props.showSnackbar("Checkout added successfully", false);
                    if (isShare === true && response && response._id) {
                        history.push('/app/sales/checkouts/share/' + response._id);
                    } else {
                        history.push('/app/sales/checkouts');
                    }
                }

            } catch (error) {
                this.toggleIsSavingStatus();
                this.state.checkoutModel.status = '';
                this.props.showSnackbar(error.message, true)
            }
        }
    }

    toggleIsSavingStatus = () => {
        this.setState({
            isSavingData: !this.state.isSavingData
        })
    }

    goToPreview = () => {
        history.push({
            pathname: '/app/sales/checkouts/preview',
            search: '',
            state: { detail: this.state.checkoutModel }
        })
    }

    renderHeader() {
        const { checkoutModel } = this.state;
        const { isEditMode } = this.props
        return <React.Fragment>
            <div className="py-header--title">

                <h4 className="py-heading--title">{(isEditMode === false) ? 'New Checkout' : checkoutModel.status === 'Draft'? checkoutModel.itemName:'Edit a checkout'}</h4>
                {
                    (isEditMode === true) ?
                        <div className="mt-1"><Badge status={checkoutModel.status} /></div> : ''
                }
            </div>
        </React.Fragment>
    }

    render() {
        const { isEditMode, flag, selectedBusiness } = this.props
        const { activeTab, collapse, modal, addNewIncome, checkoutModel, allTaxes, priceLess } = this.state
        const _currency = (selectedBusiness && selectedBusiness.currency) ? selectedBusiness.currency.code : 'USD';
        console.log("in form", checkoutModel)
        return (
            <Fragment>
                <div className="content-wrapper__main__fixed checkout">
                    <header className="py-header py-header--page">
                        {this.renderHeader()}
                        <div className="py-header--actions">
                            <Button onClick={this.goToPreview} className="btn-outline-primary mr-2">Preview</Button>
                            <div className="btn py-btn__action__primary">
                                <span onClick={this.saveCheckoutMenuAction} className="btn">{(checkoutModel.status === 'Online') ? 'Save and share' : 'Save and turn on'}</span>
                                <Dropdown className="py-btn__action" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown} direction="bottom-left">
                                    {/* <Dropdown className="d-inline-block mrR10" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}> */}
                                    <DropdownToggle className="btn" caret >
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <div className="dropdown-menu--body">
                                            <DropdownItem key={0}>
                                                {(isEditMode === false) ? 'Save as draft' : ((checkoutModel.status === 'Online') ? 'Save and turn off' : 'Save and share')}
                                            </DropdownItem>
                                        </div>
                                    </DropdownMenu>
                                    {/* </Dropdown> */}
                                </Dropdown>
                            </div>
                        </div>
                    </header>
                        <div className="checkouts-add">
                            <div className="checkouts-add__body">
                                <div className="py-table--form">
                                    <div className="py-table__header">
                                        <Row className="py-table__row">
                                            <Col className="py-table__cell" md={8}>
                                                <strong>Product or service</strong>
                                            </Col>
                                            <Col className="py-table__cell-amount" md={2}>
                                                <strong>Price</strong>
                                            </Col>
                                            <Col className="py-table__cell-amount" md={2}>
                                                <strong>Amount</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="py-form--body">
                                        <Row className="py-table__row no-gutters">
                                            <Col className="py-table__cell pr-0" md={7}>
                                                <Input
                                                    required
                                                    type="text"
                                                    name="itemName"
                                                    className="d-block"
                                                    placeholder="What product or service will you be providing?"
                                                    value={checkoutModel.itemName}
                                                    onChange={this.handleText} />
                                            </Col>

                                            <Col className="py-table__cell" md={3}>
                                                <Input
                                                    type="number"
                                                    step='any'
                                                    name="price"
                                                    className={"text-right " + (priceLess ? 'less-price' : '')}
                                                    value={checkoutModel.price}
                                                    onChange={this.handleText}
                                                    onBlur={this.convertToDecimal} />
                                            </Col>
                                            <Col className="py-table__cell-amount" md={2}>
                                                {toDollar(checkoutModel.price)}
                                            </Col>
                                        </Row>

                                        <Row className="py-table__row py-table__row--taxes align-items-center">
                                            <Col className="text-right pr-0" md={7}>
                                                <Label htmlFor="taxes2" className="invoice-item-row-tax-section__tax__add__label">Taxes</Label>
                                            </Col>
                                            <Col md={3} className="pr-0">
                                                <div className="checkout-item-row-tax-section__taxes">
                                                    <div className="invoice-item-row-tax-section__tax__add">
                                                        <Taxes
                                                            fetchtaxList={this.fetchtaxList}
                                                            taxList={allTaxes}
                                                            taxValue={checkoutModel}
                                                            isEditMode={isEditMode}
                                                            onChange={this.handleSelectChange}
                                                            placeholder="Add tax"
                                                        />
                                                    </div>
                                                </div>

                                            </Col>

                                            <Col md={2} className="p-0">
                                                <div className="checkout-item-row-tax-section__tax__amount">
                                                    <ul className="list-unstyled w-100 m-0">
                                                        <li>
                                                            {
                                                                checkoutModel['taxes'].length > 0 ?
                                                                    checkoutModel['taxes'].map((item, index) => {
                                                                        return (
                                                                            <div htmlFor="taxes" className="py-text" key={index} data={item}>{this.calculateTaxById(item)}</div>
                                                                        );
                                                                    }) : <div htmlFor="taxes" className="py-text">—</div>
                                                            }
                                                        </li>
                                                    </ul>

                                                </div>
                                            </Col>


                                        </Row>

                                        <Row className="py-table__row--total">
                                            <Col className="py-table__cell-amount" md={10}>
                                                <Label htmlFor="taxes" className="text-right"><strong>Total ({_currency})</strong></Label>
                                            </Col>
                                            <Col className="py-table__cell-amount" md={2}>
                                                <Label htmlFor="taxes" className="text-right"><strong>{toDollar(this.calculateTotalUSD())}</strong></Label>
                                            </Col>
                                        </Row>

                                        <div className="py-table__row request-address-and-phone-row">
                                            <div class="py-table__cell">
                                                <label htmlFor="card" className="py-switch">
                                                    <span className="py-toggle__label mr-2">Request phone number</span>
                                                    <input type="checkbox"
                                                        id="card"
                                                        name="phone"
                                                        className="py-toggle__checkbox"
                                                        checked={checkoutModel.fields && checkoutModel.fields.phone}
                                                        onChange={this.handleText}
                                                    />
                                                    <span className="py-toggle__handle"></span>
                                                </label>
                                            </div>

                                            <div className="py-table__cell">
                                                <label htmlFor="address" className="py-switch">
                                                    <span className="py-toggle__label">Request address</span>
                                                    <input
                                                        type="checkbox"
                                                        id="address"
                                                        name="address"
                                                        className="py-toggle__checkbox"
                                                        checked={checkoutModel.fields && checkoutModel.fields.address}
                                                        onChange={this.handleText}
                                                    />
                                                    <span className="py-toggle__handle"></span>
                                                </label>
                                            </div>
                                        </div>

                                        <Row className="py-table__row">
                                            <Col md={12} className="py-table__cell">
                                                <Label htmlFor="message" className="mt-2">After successful payment, display the following message:</Label>
                                                <Input
                                                    type="textarea"
                                                    id="message"
                                                    className="message-textarea"
                                                    name="message"
                                                    placeholder="e.g. Thank you for your payment."
                                                    value={checkoutModel.message.success}
                                                    onChange={this.handleText} />
                                            </Col>
                                        </Row>

                                    </div>
                                </div>
                            </div>
                        </div>

                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedCheckout: state.checkoutReducer.selectedCheckout,
        selectedBusiness: state.businessReducer.selectedBusiness,
        errorMessage: state.checkoutReducer.errorMessage
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CheckoutActions, dispatch),
        showSnackbar: (message, error) => {
            dispatch(openGlobalSnackbar(message, error))
        }
    };
}

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(CheckoutForm)))
