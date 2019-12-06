
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { Card, CardBody, Button, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap';
import { cloneDeep } from 'lodash';
import { SketchPicker, ChromePicker } from 'react-color';
import { connect } from 'react-redux';
import SelectBox from "utils/formWrapper/SelectBox";
import { addSalesSetting, fetchSalesSetting } from '../../../../../../api/SettingService'
import { paymentTerms, invoiceSettingPayload } from '../supportFunctionality/helper';
import { setUserSettings } from "../../../../../../actions/loginAction";
import { openGlobalSnackbar, updateData } from "../../../../../../actions/snackBarAction";
import { fetchSignedUrl, uploadImage } from '../../../../../../api/businessService';
import { _documentTitle } from '../../../../../../utils/GlobalFunctions';

const TempalteImageUrl = {
    contemporary: 'https://d3pgswpng8id0l.cloudfront.net/sitestatic/images/invoice-preview-nextcontemporary--06-14-16.png',
    classic: 'https://d3pgswpng8id0l.cloudfront.net/sitestatic/images/invoice-preview-classic--06-14-16.png',
    modern: 'https://d3pgswpng8id0l.cloudfront.net/sitestatic/images/invoice-preview-nextmodern--06-14-16.png'
}

class InvoiceCustomization extends Component {
    state = {
        modal: false,
        removeCompanyLogo: false,
        invoiceSettingsInput: invoiceSettingPayload(),
        loading: false,
        displayColorPicker: false,
        color: '#000',
    }

    componentDidMount() {
        const { businessInfo } = this.props;
        _documentTitle(businessInfo, `Invoice Customization`)
        console.log("businessInfo", businessInfo)
        this.fetchSettingData()
        document.addEventListener('click', this.handleClickOutside.bind(this));

    }


    componentDidUpdate(prevProps) {
        const { refreshData } = this.props
        if (refreshData !== prevProps.refreshData) {
            this.fetchSettingData()
        }
    }
    handleClickOutside(e){
        console.log(e.target.id)
        if(!e.target.id.includes('swatch')){
            this.setState({displayColorPicker: false})
        }
    }

    fetchSettingData = async () => {
        setTimeout(this.setState({ loading: true }), 300);
        try {
            const request = await fetchSalesSetting()
            if (request.data && request.data.salesSetting) {
                this.setState({ invoiceSettingsInput: request.data.salesSetting, loading: false })
            }
        } catch (error) {
            this.props.openGlobalSnackbar("Something went wrong, please try again later.", true)
        }
    }

    handleInvoiceSettings = (event, field) => {
        let invoiceSettingsInput = cloneDeep(this.state.invoiceSettingsInput)
        if (field === "defaultPaymentTerm") {
            invoiceSettingsInput.invoiceSetting[field] = event
        } else {
            const { name, value } = event.target
            invoiceSettingsInput.invoiceSetting[name] = value
        }
        this.setState({
            invoiceSettingsInput
        })
    }

    handleItemHeading = (event, isOther) => {
        console.log("change", event, isOther)
        let updateSettings = cloneDeep(this.state.invoiceSettingsInput)
        const { name, value } = event.target
        console.log("value", name, value)
        if (isOther) {
            updateSettings.itemHeading[name].name = value
        }

        if (name.includes("column")) {
            updateSettings.itemHeading[name].name = value
        } else {
            if (name === "hideDescription") {
                updateSettings.itemHeading["hideItem"] = false
            } else if (name === "hideItem") {
                updateSettings.itemHeading["hideDescription"] = false
            }
            updateSettings.itemHeading[name] = !updateSettings.itemHeading[name]
        }
        this.setState({ invoiceSettingsInput: updateSettings })
    }

    handleEstimateSetting = event => {
        let updateSettings = cloneDeep(this.state.invoiceSettingsInput)
        const { name, value } = event.target
        updateSettings.estimateSetting[name] = value
        this.setState({ invoiceSettingsInput: updateSettings })
    }

    handleField = (event) => {
        let updateSettings = cloneDeep(this.state.invoiceSettingsInput)
        const { name, value } = event.target
        if (name === "removeCompanyLogo") {
            this.setState({ removeCompanyLogo: !this.state.removeCompanyLogo })
        } else {
            if (name === "displayLogo") {
                updateSettings[name] = !updateSettings[name]
            } else {
                updateSettings[name] = value
            }
        }
        this.setState({
            invoiceSettingsInput: updateSettings
        })
    }

    handleModal = (preview) => {
        this.setState({
            modal: !this.state.modal,
            preview
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let invoiceSettingsInput = cloneDeep(this.state.invoiceSettingsInput)
        if (this.state.removeCompanyLogo) {
            invoiceSettingsInput.companyLogo = ""
            invoiceSettingsInput.displayLogo = false
        }
        delete invoiceSettingsInput._id
        delete invoiceSettingsInput.createdAt
        delete invoiceSettingsInput.updatedAt
        delete invoiceSettingsInput.__v
        let salesSettingInput = {
            ...invoiceSettingsInput
        }
        try {
            let request = await addSalesSetting({ salesSettingInput });
            this.props.updateData()
            this.props.setUserSettings(request.data.salesSetting);
            this.props.openGlobalSnackbar("Settings updated sucessfully");
        } catch (error) {
            console.error("error", error);
            this.props.openGlobalSnackbar("Something went wrong, please try again later.", true);
        }
    }

    onImageUpload = async (event) => {
        let updateSettings = cloneDeep(this.state.invoiceSettingsInput)
        const file = event.target.files[0]
        let imageUrl
        if (file) {
            imageUrl = await this.getSignedUrl(file)
        }
        updateSettings["companyLogo"] = file ? imageUrl : undefined
        updateSettings["displayLogo"] = file ? true : false
        this.setState({ invoiceSettingsInput: updateSettings })
    }

    getSignedUrl = async (file) => {
        try {
            const payload = {
                s3Input: {
                    contentType: file.type,
                    fileName: file.name,
                    uploadType: 'logo'
                }
            }
            const response = await fetchSignedUrl(payload)
            const { sUrl, pUrl } = response.data.signedUrl
            if (sUrl) {
                await uploadImage(sUrl, file, file.type)
                return pUrl
            }
        } catch (error) {
            this.props.openGlobalSnackbar("Something went wrong, please try again later.", true);
        }
    }

    showTemplates = () => {
        const preview = this.state.preview
        switch (preview) {
            case 3: return <img src={TempalteImageUrl.modern} className="img-fluid" />
            case 2: return <img src={TempalteImageUrl.classic} className="img-fluid" />
            default: return <img src={TempalteImageUrl.contemporary} className="img-fluid" />
        }

    }

    handleColorPicker = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        console.log("in close")
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState(prevState => ({
            invoiceSettingsInput: {
                ...prevState.invoiceSettingsInput,
                accentColour: color.hex
            }
        }))
    };

    componentWillUnmount(){
        document.removeEventListener('click', this.handleClickOutside.bind(this));
    }

    render() {
        const { modal, invoiceSettingsInput, removeCompanyLogo, preview, loading, displayColorPicker, color } = this.state
        const { invoiceSetting, estimateSetting, itemHeading } = invoiceSettingsInput;
        const { businessInfo } = this.props;
        const colorStyle = {
            width: '16px',
            height: '16px',
            borderRadius: '2px',
            background: `${invoiceSettingsInput.accentColour}`,
        }
        const swatch = {
            padding: '3px',
            background: '#fff',
            borderRadius: '2px',
            border:'1px solid #ADC0C7',
            display: 'inline-block',
            cursor: 'pointer',
            marginLeft: '6px',
            marginTop: '8px'
        }
        const popover = {
            position: 'absolute',
            zIndex: '2',
        }
        const cover = {
            // position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
        return (
            <div className="py-page__content">
                <div className="py-page__inner">
                    <header className="py-header--page">
                        <div className="py-header--title">
                            <h2 className="py-heading--title">Invoice Customization</h2>
                        </div>
                    </header>
                    <p className="py-text"><strong>Tip:</strong> To add or edit your contact information (address, website, etc.) that appears on an invoice, <br />visit <strong><Link className="py-text--link" to={`/business/edit/${businessInfo._id}`}>your profile.</Link></strong></p>


                    {
                        loading ? <div className="spinner-wrapper"><Spinner color="primary" size="md" className="loader" /></div> :
                            <div className="content">

                                <h4 className="py-heading--section-title">General settings</h4>
                                <Form className="py-form-field--condensed">
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="exampleEmail" className="py-form-field__label--align-top">Template</Label>
                                        <div className="py-form-field__element">
                                            <ul className="invoice-template">
                                                <li>
                                                    <a onClick={e => this.handleModal(1)} href="javascript:void(0)" className="invoice-preview">
                                                        <div className="invoice-thumbnail">
                                                            <img className="img-thumbnail" src={TempalteImageUrl.contemporary} />
                                                        </div>
                                                    </a>
                                                    <label htmlFor="id_invoice_template_0" className="py-radio">
                                                        <input
                                                            type="radio"
                                                            name="template"
                                                            value="contemporary"
                                                            id="id_invoice_template_0"
                                                            onChange={this.handleField}
                                                            checked={invoiceSettingsInput.template === "contemporary"}
                                                        />
                                                        <span className="py-form__element__faux"></span>
                                                        <span className="py-form__element__label">Contemporary</span>
                                                    </label>
                                                </li>
                                                <li>
                                                    <a onClick={e => this.handleModal(2)} href="javascript:void(0)" className="invoice-preview">
                                                        <div className="invoice-thumbnail">
                                                            <img className="img-thumbnail" src={TempalteImageUrl.classic} />
                                                        </div>
                                                    </a>
                                                    <label htmlFor="id_invoice_template_1" className="py-radio">
                                                        <input
                                                            name="template"
                                                            type="radio"
                                                            value="classic"
                                                            id="id_invoice_template_1"
                                                            checked={invoiceSettingsInput.template === "classic"}
                                                            onChange={this.handleField}
                                                        />
                                                        <span className="py-form__element__faux"></span>
                                                        <span className="py-form__element__label">Classic</span>
                                                    </label>
                                                </li>
                                                <li>
                                                    <a onClick={e => this.handleModal(3)} href="javascript:void(0)" className="invoice-preview">
                                                        <div className="invoice-thumbnail">
                                                            <img className="img-thumbnail" src={TempalteImageUrl.modern} />
                                                        </div>
                                                    </a>
                                                    <label htmlFor="id_invoice_template_2" className="py-radio">
                                                        <input
                                                            type="radio"
                                                            name="template"
                                                            id="id_invoice_template_2"
                                                            checked={invoiceSettingsInput.template === "modern"}
                                                            value="modern"
                                                            onChange={this.handleField} />
                                                        <span className="py-form__element__faux"></span>
                                                        <span className="py-form__element__label">Modern</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="examplePassword" className="py-form-field__label--align-top">Company logo</Label>
                                        <div className="py-form-field__element">

                                            <div className="image_well">
                                                <span className="image d-flex"
                                                 style={{
                                                    background: `url(${invoiceSettingsInput.companyLogo ? '' : '/assets/icons/no-logo.gif'}) 50% 50% no-repeat`,
                                                    width: `${invoiceSettingsInput.companyLogo ? 'auto' : '77px'} `
                                                 }}>
                                                    {invoiceSettingsInput.companyLogo && <img src={invoiceSettingsInput.companyLogo} height="75" width="auto" />}
                                                </span>
                                                <div className="actions">
                                                    <span className="upload"><input name="companyLogo" type="file" accept="image/*" onChange={this.onImageUpload} /></span>
                                                    {invoiceSettingsInput.companyLogo && <div className="checkbox">
                                                        <label className="py-checkbox remove-logo-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                name={"removeCompanyLogo"}
                                                                value={removeCompanyLogo}
                                                                checked={removeCompanyLogo}
                                                                onChange={this.handleField}
                                                            />
                                                            <span className="py-form__element__faux"></span>
                                                            <span className="py-form__element__label">Remove Logo</span>
                                                        </label>
                                                    </div>}
                                                </div>
                                            </div>
                                            <span className="py-form-field__hint">Upload an image that is less than 10MB in size.</span>
                                            <div className="checkbox">
                                                <label className="py-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name={"displayLogo"}
                                                        value={invoiceSettingsInput.displayLogo}
                                                        checked={invoiceSettingsInput.displayLogo}
                                                        onChange={this.handleField}
                                                        disabled={invoiceSettingsInput.companyLogo === ""}
                                                    />
                                                    <span className="py-form__element__faux"></span>
                                                    <span className="py-form__element__label">Display logo</span>
                                                </label>
                                                {!invoiceSettingsInput.companyLogo && <div className="py-form-field__hint">You must have an uploaded logo to display it</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="examplePassword" className="py-form-field__label">Accent color <span className="text-danger">*</span></Label>
                                        <div classname="py-form-field__element">
                                            <div className="d-flex align-items-center">

                                                <Input type="text"
                                                    name="color"
                                                    className="py-form__element__small"
                                                    value={invoiceSettingsInput.accentColour}
                                                    id="examplePassword" placeholder="password placeholder"
                                                />
                                                <div>
                                                    <div style={swatch} onClick={this.handleClick}>
                                                        <div style={colorStyle} id="swatch-wrap"/>
                                                    </div>
                                                    {displayColorPicker ? <div style={popover} id="swatch" onBlur={this.handleClose}>
                                                        <div style={cover} onClick={this.handleClose} />
                                                        <SketchPicker color={color} onChange={this.handleChange} display={displayColorPicker}/>
                                                    </div> : null}

                                                </div>

                                                {/* <Button
                                                type="button"
                                                    onClick={this.handleColorPicker}
                                                    className="py-form__element__color">color</Button>
                                                    { displayColorPicker ? <div style={ popover }>
                                                    <div style={ cover } onClick={ this.handleColorPickerClose }/>
                                                    <SketchPicker
                                                    onChangeComplete={ this.handleChangeComplete }/>
                                                    </div> : null } */}
                                            </div>
                                            <div className="py-form-field__hint">Choose an accent colour to use in the invoice.</div>
                                        </div>
                                    </div>


                                    <hr />
                                    <h5 className="py-heading--section-title">Invoice settings</h5>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="exampleSelect" className="py-form-field__label">Default payment terms <span className="text-danger">*</span></Label>
                                        <div className="py-form-field__element">
                                            <SelectBox
                                                required
                                                clearable={false}
                                                valueKey={"key"}
                                                labelKey={"value"}
                                                value={invoiceSetting.defaultPaymentTerm}
                                                onChange={item => this.handleInvoiceSettings(item, "defaultPaymentTerm")}
                                                options={paymentTerms}
                                            />
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="title" className="py-form-field__label">Default title <span className="text-danger">*</span></Label>
                                        <div className="py-form-field__element">
                                            <Input type="text" className="py-form__element__medium" name="defaultTitle" value={invoiceSetting.defaultTitle} onChange={this.handleInvoiceSettings} />
                                            <div className="py-form-field__hint">The default title for all invoices. You can change this on each invoice.</div>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="title" className="py-form-field__label">Default subheading</Label>
                                        <div className="py-form-field__element">
                                            <Input type="text" className="py-form__element__medium" name="defaultSubTitle" value={invoiceSetting.defaultSubTitle} onChange={this.handleInvoiceSettings} />
                                            <div className="py-form-field__hint">This will be displayed below the title of each invoice. Useful for things like ABN numbers.</div>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="title" className="py-form-field__label">Default footer</Label>
                                        <div className="py-form-field__element">
                                            <Input type="text" className="py-form__element__medium" name="defaultFooter" value={invoiceSetting.defaultFooter} onChange={this.handleInvoiceSettings} />
                                            <div className="py-form-field__hint">This will be displayed at the bottom of each invoice.</div>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="standard" className="py-form-field__label">Standard memo</Label>
                                        <div className="py-form-field__element">
                                            <Input type="textarea" className="py-form__element__medium" name="defaultMemo" className="textarea-height" value={invoiceSetting.defaultMemo} onChange={this.handleInvoiceSettings} />
                                            <div className="py-form-field__hint">Appears on each invoice. You can choose to override it when you create an invoice.</div>
                                        </div>
                                    </div>
                                    <hr />
                                    <h5 className="py-heading--section-title">Estimate settings</h5>

                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="title" className="py-form-field__label">Default title <span className="text-danger">*</span></Label>
                                        <div className="py-form-field__element">
                                            <Input
                                                required
                                                type="text"
                                                className="py-form__element__medium"
                                                name="defaultTitle"
                                                value={estimateSetting.defaultTitle}
                                                onChange={this.handleEstimateSetting}
                                            />
                                            <div className="py-form-field__hint">The default title htmlFor all estimates. You can change this on each estimate.</div>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="title" className="py-form-field__label">Default subheading</Label>
                                        <div className="py-form-field__element">
                                            <Input
                                                type="text"
                                                name="defaultSubTitle"
                                                className="py-form__element__medium"
                                                value={estimateSetting.defaultSubTitle}
                                                onChange={this.handleEstimateSetting} />
                                            <div className="py-form-field__hint">This will be displayed below the title of each estimate. Useful htmlFor things like ABN numbers.</div>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="title" className="py-form-field__label">Default footer</Label>
                                        <div className="py-form-field__element">
                                            <Input
                                                type="text"
                                                name="defaultFooter"
                                                className="py-form__element__medium"
                                                value={estimateSetting.defaultFooter}
                                                onChange={this.handleEstimateSetting}
                                            />
                                            <div className="py-form-field__hint">This will be displayed at the bottom of each estimate.</div>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="standard" className="py-form-field__label--align-top">Standard memo for new estimates</Label>
                                        <div className="py-form-field__element">
                                            <Input
                                                type="textarea"
                                                name="defaultMemo"
                                                className="py-form__element__medium"
                                                className="textarea-height"
                                                value={estimateSetting.defaultMemo}
                                                onChange={this.handleEstimateSetting}
                                            />
                                            <div className="py-form-field__hint">Appears on each estimate. You can choose to override it when you create an estimate.</div>
                                        </div>
                                    </div>
                                    <hr />
                                    <h5 className="py-heading--section-title">Column header settings</h5>
                                    <p>Edit the titles of the columns of your invoice & estimates:</p>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="exampleText" className="py-form-field__label--align-top">Items</Label>
                                        <div className="py-form-field__element">
                                            <ul className="py-list--small">

                                                {["Items", "Services", "Products", "Other"].map((itemType, index) => {
                                                    return (
                                                        <div key={itemType + index}>
                                                            <li> <label className="py-radio">
                                                                <input type="radio"
                                                                    name="column1"
                                                                    checked={itemHeading.column1.name === itemType || (itemHeading.column1.name !== "Items" && itemHeading.column1.name !== "Services" && itemHeading.column1.name !== "Products")}
                                                                    value={itemType} onChange={this.handleItemHeading} />
                                                                <span className="py-form__element__faux"></span>
                                                                <span className="py-form__element__label">{itemType}
                                                                    <span className="py-form-field__hint py-text__emphasized ml-1">{itemType === "Items" ? "Default" : ""}</span>
                                                                </span>
                                                                {itemType === "Other" ? <Input type="text" name="column1" value={(itemHeading.column1.name !== "Items" && itemHeading.column1.name !== "Services" && itemHeading.column1.name !== "Products") ? itemHeading.column1.name : ""} onChange={e => this.handleItemHeading(e, "Other")} className="py-form__element__small" /> : ""}
                                                            </label>
                                                            </li>
                                                        </div>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="exampleText" className="py-form-field__label--align-top">Units</Label>
                                        <div className="py-form-field__element">
                                            <ul className="py-list--small">
                                                {["Quantity", "Hours", "Other"].map((unitType, index) => {
                                                    return (

                                                        <li key={unitType + index}>
                                                            <label className="py-radio">
                                                                <input type="radio" name="column2" checked={itemHeading.column2.name === unitType || (itemHeading.column2.name !== "Quantity" && itemHeading.column2.name !== "Hours")} value={unitType} onChange={this.handleItemHeading} />
                                                                <span className="py-form__element__faux"></span>
                                                                <span className="py-form__element__label">
                                                                    {unitType} {unitType === "Quantity" ? <span className="py-form-field__hint py-text__emphasized">Default</span> : ""}
                                                                </span>
                                                                {unitType === "Other" ? <Input type="text" name="column2" value={(itemHeading.column2.name !== "Quantity" && itemHeading.column2.name !== "Hours") ? itemHeading.column2.name : ""} onChange={e => this.handleItemHeading(e, "other")} className="py-form__element__small" /> : ""}
                                                            </label>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="exampleText" className="py-form-field__label--align-top">Price</Label>
                                        <div className="py-form-field__element">
                                            <ul className="py-list--small">

                                                {["Price", "Rate", "Other"].map((priceType, index) => {
                                                    return (
                                                        <li key={priceType + index}>
                                                            <label className="py-radio">
                                                                <input type="radio" name="column3" value={priceType} checked={itemHeading.column3.name === priceType || (itemHeading.column3.name !== "Price" && itemHeading.column3.name !== "Rate")} onChange={this.handleItemHeading} />
                                                                <span className="py-form__element__faux"></span>
                                                                <span className="py-form__element__label">{priceType} {priceType === "Price" ? <span className="py-form-field__hint py-text__emphasized">Default</span> : ""}</span>
                                                                {priceType === "Other" ? <Input type="text" name="column3" value={(itemHeading.column3.name !== "Price" && itemHeading.column3.name !== "Rate") ? itemHeading.column3.name : ""} onChange={e => this.handleItemHeading(e, "other")} className="py-form__element__small" /> : ""}
                                                            </label>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>

                                    </div>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="exampleText" className="py-form-field__label--align-top">Amount</Label>
                                        <div className="py-form-field__element">
                                            <ul className="py-list--small">
                                                {["Amount", "Other"].map((amountType, index) => {
                                                    return (
                                                        <li key={amountType + index} className="radio">
                                                            <label className="py-radio">
                                                                <input type="radio" name="column4" value={amountType} checked={itemHeading.column4.name === amountType || itemHeading.column4.name !=='Amount'} onChange={this.handleItemHeading} />

                                                                <span className="py-form__element__faux"></span>
                                                                <span className="py-form__element__label">
                                                                    {amountType} {amountType === "Amount" ? <span className="py-form-field__hint py-text__emphasized">Default</span> : ""}
                                                                </span>
                                                                {amountType === "Other" ? <Input type="text" name="column4" value={itemHeading.column4.name !== "Amount" ? itemHeading.column4.name : ""} onChange={e => this.handleItemHeading(e, "other")} className="py-form__element__small" /> : ""}
                                                            </label>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <p>Choose which columns on your invoices & estimate to hide:</p>
                                    <div className="py-form-field py-form-field--inline">
                                        <Label htmlFor="exampleText" className="py-form-field__label--align-top"></Label>
                                        <div className="py-form-field__element flex-column">
                                            <div className="checkbox">
                                                <label className="py-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name={"hideItem"}
                                                        value={itemHeading.hideItem}
                                                        checked={itemHeading.hideItem}
                                                        onChange={this.handleItemHeading}
                                                    />
                                                    <span className="py-form__element__faux"></span>
                                                    <span className="py-form__element__label">
                                                        Hide item
                                        </span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label className="py-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name={"hideDescription"}
                                                        value={itemHeading.hideDescription}
                                                        checked={itemHeading.hideDescription}
                                                        onChange={this.handleItemHeading}
                                                    />
                                                    <span className="py-form__element__faux"></span>
                                                    <span className="py-form__element__label">Hide description</span>
                                                </label>
                                            </div>
                                            <span className="py-form-field__hint my-2">Your invoice & estimate must show at least one of the above.</span>
                                            <div className="checkbox">
                                                <label className="py-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name={"hideQuantity"}
                                                        value={itemHeading.hideQuantity}
                                                        checked={itemHeading.hideQuantity}
                                                        onChange={this.handleItemHeading}
                                                    />
                                                    <span className="py-form__element__faux"></span>
                                                    <span className="py-form__element__label">Hide quantity</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label className="py-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name={"hidePrice"}
                                                        value={itemHeading.hidePrice}
                                                        checked={itemHeading.hidePrice}
                                                        onChange={this.handleItemHeading}
                                                    />
                                                    <span className="py-form__element__faux"></span>
                                                    <span className="py-form__element__label">Hide price</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label className="py-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name={"hideAmount"}
                                                        value={itemHeading.hideAmount}
                                                        checked={itemHeading.hideAmount}
                                                        onChange={this.handleItemHeading}
                                                    />
                                                    <span className="py-form__element__faux"></span>
                                                    <span className="py-form__element__label">Hide amount</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="py-divider" />

                                    <div className="py-form-field py-form-field--inline">
                                        <div className="py-form-field__label">
                                        </div>
                                        <div className="py-form-field__element">
                                            <Button onClick={this.handleSubmit} className="btn-primary">Save</Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                    }
                    <Modal isOpen={modal} toggle={this.handleModal} className={this.props.className} className="py-modal">
                        <ModalHeader toggle={this.handleModal}>Invoice preview</ModalHeader>
                        <ModalBody>
                            {this.showTemplates()}
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapPropsToState = ({ snackbar, businessReducer }) => ({
    refreshData: snackbar.updateData,
    businessInfo: businessReducer.selectedBusiness
});

export default connect(mapPropsToState, { updateData, setUserSettings, openGlobalSnackbar })(InvoiceCustomization)
