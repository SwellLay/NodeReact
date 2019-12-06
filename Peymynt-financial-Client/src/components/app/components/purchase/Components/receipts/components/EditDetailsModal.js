import { fetchCurrencies } from 'api/globalServices';
import taxServices from 'api/TaxServices';
import { cloneDeep, orderBy, uniqBy } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DatepickerWrapper from 'utils/formWrapper/DatepickerWrapper';
import SelectBox from 'utils/formWrapper/SelectBox';

export default class EditDetailsModal extends Component {
    isTaxAdded = (id) => {
        const { data: { amountBreakup: { taxes = [] } = {} } = {} } = {} = this.state;
        const tax = taxes.find(r => r.id === id);
        return !!tax;
    };
    toggleTax = (tax) => {
        const data = cloneDeep(this.state.data || {});

        if (!data.amountBreakup) {
            data.amountBreakup = {};
        }

        if (!data.amountBreakup.taxes) {
            data.amountBreakup.taxes = [];
        }

        const index = data.amountBreakup.taxes.findIndex(r => r.id === tax.id);
        if (index === -1) {
            const amount = Number(tax.rate * Number(data.subTotal || data.amountBreakup.subTotal) / 100).toFixed(2);
            data.amountBreakup.taxes.push({ ...tax, amount })
        } else {
            data.amountBreakup.taxes.splice(index, 1);
        }

        this.setState({ data });
    };
    getTaxAmount = (id) => {
        const data = cloneDeep(this.state.data || {});

        if (!data.amountBreakup) {
            data.amountBreakup = {};
        }

        if (!data.amountBreakup.taxes) {
            data.amountBreakup.taxes = [];
        }

        const tax = data.amountBreakup.taxes.find(r => r.id === id);
        if (!tax) {
            return '';
        }

        return !tax.amount ? '0.00' : tax.amount;
    };
    close = () => {
        this.setState({ data: {} }, this.props.onClose);
    };
    handleChange = ({ target: { name, value } }) => {
        this.setState({ data: { ...this.state.data, [name]: value } });
    };
    onAmountChange = ({ target: { name, value } }) => {
        const newValue = Number(value || 0).toFixed(2);
        this.handleChange({ target: { name, value: newValue } });
    };
    submit = (e) => {
        e.preventDefault();

        const payload = this.getData();

        this.props.editReceipt(this.props.data.id, payload);
    };
    save = (e) => {
        e.preventDefault();

        const payload = this.getData();

        this.props.saveReceipt(this.props.data.id, payload);
    };

    constructor(props) {
        super(props);

        this.state = {
            currencies: [],
            taxes: [],
            data: props.data,
        }
    }

    componentDidMount() {
        this.fetchTaxes();
        this.fetchCurrencies();
    }

    componentWillReceiveProps(props) {
        if (Object.keys(this.state.data || {}).length < 2 && props.data) {
            this.setState({
                data: {
                    ...props.data,
                    totalAmount: Number(props.data.totalAmount || 0).toFixed(2),
                    receiptDate: props.data.receiptDate || moment().format('YYYY-MM-DD'),
                    currency: props.currency,
                    amountBreakup: {
                        ...props.amountBreakup,
                        subTotal: Number(props.data.amountBreakup.subTotal || 0).toFixed(2),
                    }
                }
            });
        }
    }

    async fetchCurrencies() {
        const response = await fetchCurrencies();
        const list = response.map(country => country.currencies[0]);
        const currencies = orderBy(uniqBy(list, "code"), "code", "asc");
        this.setState({ currencies });
    }

    async fetchTaxes() {
        const response = (await taxServices.fetchTaxes()).data.taxes;
        response.forEach(row => {
            row.id = row._id;
            delete row._id;
        });
        this.setState({ taxes: response })
    }

    handleTaxChange(id, amount, blur) {
        const data = cloneDeep(this.state.data || {});

        if (!data.amountBreakup) {
            data.amountBreakup = {};
        }

        if (!data.amountBreakup.taxes) {
            data.amountBreakup.taxes = [];
        }

        const index = data.amountBreakup.taxes.findIndex(r => r.id === id);

        if (index === -1) {
            return;
        }

        data.amountBreakup.taxes[index].amount = blur ? Number(amount).toFixed(2) : amount;
        this.setState({ data });
    }

    getData() {
        const payload = cloneDeep(this.state.data);

        if (!payload.amountBreakup) {
            payload.amountBreakup = {};
        }

        if (payload.subTotal) {
            payload.amountBreakup.subTotal = payload.subTotal;
            delete payload.subTotal;
        }

        delete payload.id;
        delete payload.uuid;
        delete payload.createdAt;
        delete payload.fileUrl;
        delete payload.previewUrl;
        delete payload.status;
        delete payload.source;

        return payload;
    }

    renderMedia() {
        const { data: { fileUrl, previewUrl, source } = {} } = this.props;

        return (
            <div className="preview-section">
                <a target="_blank" href={fileUrl} className="media-wrapper">
                    <img src={previewUrl} alt="receipt preview" className="media" />
                    <span className="py-text--link">View original receipt</span>
                </a>
                <span className="source">Source: {source}</span>
            </div>
        );
    }

    renderTaxes() {
        const { data: { amountBreakup: { taxes = [] } = {} } = {} } = this.props;

        if (!this.state.taxes.length) {
            return null;
        }

        return this.state.taxes.map((tax) => (
            <div className="py-form-field py-form-field--inline" key={tax.id}>
                <div className="py-form-field__blank">

                </div>

                <div className="py-form-field__element">
                    <Label className="d-flex">
                        <div className="checkbox-custom mr-2">
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name={tax.name}
                                    checked={this.isTaxAdded(tax.id)}
                                    value={tax.id}
                                    onChange={() => this.toggleTax(tax)}
                                />
                            </Label>
                        </div>
                        <div className="mr-2">
            <span className="d-block">
              Tax
            </span>
                            <span className="tax-name">
              {tax.name}
            </span>
                        </div>
                        <div className="tax-values">

                            <Label>
                                Amount
                            </Label>
                            <Input
                                type="number"
                                disabled={!this.isTaxAdded(tax.id)}
                                value={this.getTaxAmount(tax.id)}
                                name="subTotal"
                                onChange={(e) => this.handleTaxChange(tax.id, e.target.value)}
                                onBlur={(e) => this.handleTaxChange(tax.id, e.target.value, true)}
                            />
                        </div>
                    </Label>
                </div>
            </div>
        ));
    }

    renderInformation() {
        const { currencies, data: { merchant, receiptDate, notes, subTotal, currency = {}, totalAmount, amountBreakup = {} } = {} } = this.state;
        return (
            <Form onSubmit={e => e.preventDefault()}>
                <div className="py-form-field py-form-field--inline">
                    <Label className="py-form-field__label is-required">
                        Merchant
                    </Label>
                    <div className="py-form-field__element">
                        <Input
                            type="text"
                            value={merchant}
                            name="merchant"
                            className="py-form__element__medium"
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label className="py-form-field__label is-required">
                        Date
                    </Label>
                    <div className="py-form-field__element">
                        <DatepickerWrapper
                            selected={receiptDate || undefined}
                            onChange={date => this.handleChange({ target: { value: date, name: "receiptDate" } })}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label className="py-form-field__label">
                        Notes
                    </Label>
                    <div className="py-form-field__element">
            <textarea
                name="notes"
                rows={2}
                className="form-control py-form__element__medium"
                value={notes}
                onChange={this.handleChange}
            />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label className="py-form-field__label">
                        Subtotal
                    </Label>
                    <div className="py-form-field__element">
                        <Input
                            type="number"
                            value={subTotal || amountBreakup.subTotal}
                            name="subTotal"
                            className=" py-form__element__medium"
                            onChange={this.handleChange}
                            onBlur={this.onAmountChange}
                        />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label className="py-form-field__label is-required">
                        Currency
                    </Label>
                    <div className="py-form-field__element">
                        <SelectBox
                            labelKey={'displayName'}
                            valueKey={'code'}
                            value={currency}
                            onChange={selected => this.handleChange({ target: { name: 'currency', value: selected } })}
                            options={currencies}
                            isClearable={false}
                        />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label className="py-form-field__label is-required">
                        Total
                    </Label>
                    <div className="py-form-field__element">
                        <Input
                            type="number"
                            required
                            value={totalAmount}
                            name="totalAmount"
                            className="py-form__element__medium"
                            onChange={this.handleChange}
                            onBlur={this.onAmountChange}
                        />
                    </div>
                </div>
                {this.renderTaxes()}
            </Form>
        );
    }

    render() {
        const { data } = this.props;
        return (
            <Modal centered isOpen={!!data} className="modal-common receipt-details edit-mode show-overlay">
                <ModalHeader toggle={this.close}>
                    Receipt details
                </ModalHeader>
                <ModalBody>
                    <div className="receipt-container">
                        {this.renderMedia()}
                        <div className="information-section">
                            {this.renderInformation()}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn btn-outline-primary" onClick={this.close}>Cancel</Button>
                    <Button disabled={this.props.updating} className="btn btn-outline-primary"
                        onClick={this.save}>Save</Button>
                    <Button disabled={this.props.updating} className="btn btn-primary"
                        onClick={this.submit}>
                        Post to Accounting
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }
}
