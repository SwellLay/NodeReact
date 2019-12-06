import { cloneDeep } from 'lodash';
import React, { Component, Fragment } from 'react';
import { Input, Popover, PopoverContent } from 'reactstrap';

export default class TaxOverride extends Component {
    onToggleTaxOverride = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.setState({ show: !this.state.show });
    };
    onClose = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.setState({ show: false });
    };
    getCurrentRowOverride = (id) => {
        return this.state.overrides.find(r => r.id === id) || undefined;
    };
    onSave = (e) => {
        e.preventDefault();

        const payload = this.getData();

        this.props.onSave(payload);
        this.onClose(e);
    };

    constructor() {
        super();

        this.state = {
            show: false,
            overrides: [],
        };
    }

    componentWillReceiveProps(props) {
        if (props.item.taxOverrides) {
            this.setState({ overrides: props.item.taxOverrides });
        }
    }

    onChange(id, name, value) {
        const overrides = cloneDeep(this.state.overrides);
        const index = overrides.findIndex(r => r.id === id);

        console.log(id, index);

        if (index !== -1) {
            overrides[index][name] = value || '';
        } else {
            overrides.push({ id, value: '', type: 'fixed', [name]: value });
        }

        this.setState({ overrides });
    }

    getApplicableTaxes() {
        const { taxList, item } = this.props;

        return taxList.filter(r => item.taxes.indexOf(r._id) !== -1);
    }

    getData() {
        return this.state.overrides;
    }

    renderTaxOptions() {
        const taxes = this.getApplicableTaxes();
        const { currency } = this.props;

        return taxes.map((tax, i) => {
            const override = this.getCurrentRowOverride(tax._id) || {};
            return (
                <div className="tax-row" key={tax._id}>
                    <span className="label">{tax.abbreviation}</span>

                    <Input type="number" value={override.value}
                        onChange={e => this.onChange(tax._id, 'value', Number(e.target.value))} />

                    <Input type="select" value={override.type}
                        onChange={e => this.onChange(tax._id, 'type', e.target.value)}>
                        <option value="fixed">{currency.symbol}</option>
                        <option value="percent">%</option>
                    </Input>

                </div>
            );
        });
    }

    renderContent() {
        const { item } = this.props;

        if (!item.taxes || !item.taxes.length) {
            return (
                <div className="no-content">
                    No taxes added yet
                </div>
            );
        }

        return (
            <Fragment>
                <div className="help-block">Customize the specific tax amounts for this line item here</div>
                <div className="taxes-container">
                    {this.renderTaxOptions()}
                </div>
                <div className="btn-container">
                    <button className="btn btn-accent btn-rounded" type="button" onClick={this.onSave}>
                        Save
                    </button>
                    <span className="btn-separator">or</span>
                    <a href="javascript:void(0)" onClick={this.onToggleTaxOverride}>cancel</a>
                </div>
            </Fragment>
        );
    }

    render() {
        const { item, index } = this.props;
        return (
            <Fragment>
        <span onClick={this.onToggleTaxOverride} id={`tax-${item.id || index}`}>
          <i className="fas fa-pencil-alt fa-xs" style={{ fontSize: '16px' }} />
        </span>

                <Popover trigger="legacy" placement="top" target={`tax-${item.id || index}`} className="tax-popover"
                    isOpen={this.state.show}
                    toggle={this.onClose}>
                    <PopoverContent>
                        <div className="popover-title">Tax override</div>
                        {this.renderContent()}
                    </PopoverContent>
                </Popover>
            </Fragment>
        )
    }
}
