import { currentExchangeRate } from 'api/globalServices';
import { cloneDeep, set } from 'lodash';
import React, { Component, Fragment } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import DatepickerWrapper from 'utils/formWrapper/DatepickerWrapper';
import { toMoney } from 'utils/GlobalFunctions';

const ACCOUNTS = [
  {
    id: -1,
    label: "Select a payment method",
    value: "",
    disabled: true,
  },
  {
    id: 0,
    label: "Bank payment",
    value: "bank_payment"
  },
  {
    id: 1,
    label: "Cash",
    value: "cash"
  },
  {
    id: 2,
    label: "Cheque",
    value: "check"
  },
  {
    id: 3,
    label: "Credit Card",
    value: "credit_card"
  },
  {
    id: 4,
    label: "PayPal",
    value: "paypal"
  },
  {
    id: 5,
    label: "Other",
    value: "other"
  }
];

export default class RecordPaymentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      errors: {},
    };
  }

  componentWillReceiveProps(props) {
    if (!this.props.bill && props.bill) {
      this.findExchangeRate(props.bill);
      this.setState({
        data: {
          amount: Number(props.bill.dueAmount || 0).toFixed(2),
          paymentDate: new Date(),
        },
        errors: {}
      });
    }
  }

  async findExchangeRate(bill) {
    const { businessInfo } = this.props;
    if (!bill) {
      return;
    }

    const { data } = await currentExchangeRate(bill.currency.code, businessInfo.currency.code);
    this.handleChange({ target: { name: 'exchangeRate', value: data.exchangeRate } });
  }

  handleChange = ({ target: { name, value } = {} } = {}) => {
    const data = cloneDeep(this.state.data);
    console.log(name, value);
    set(data, name, value);

    this.setState({ data });
  };

  onAmountChange = ({ target: { name, value } = {} } = {}) => {
    const newValue = Number(value || 0).toFixed(2);
    this.handleChange({ target: { name, value: newValue } });
  };

  close = () => {
    this.setState({ data: {}, bill: undefined });
    this.props.onClose();
  };

  getData = () => {
    const { data } = this.state;

    return {
      paymentMethod: data.method,
      amount: data.amount,
      exchangeRate: data.exchangeRate,
      amountInHomeCurrency: data.exchangeRate * data.amount,
      paymentDate: data.paymentDate,
      memo: data.memo,
    };
  };

  validateData = (data) => {
    const errors = {};
    if (!data.paymentMethod) {
      errors.paymentMethod = "This field is required";
    }
    this.setState({ errors });
    return !Object.keys(errors).length;
  };

  submit = (e) => {
    e.preventDefault();
    const payload = this.getData();

    if (!this.validateData(payload)) {
      return;
    }

    this.props.recordPayment(payload, this.close);
  };

  renderExchangeRate() {
    const { businessInfo, bill } = this.props;
    const { data = {} } = this.state;

    if (!bill) {
      return null;
    }

    if (bill.currency.code === businessInfo.currency.code) {
      return null;
    }

    return (
      <Fragment>
        <div className="py-form-field py-form-field--inline">
          <Label for="amount" className="py-form-field__label">Exchange Rate</Label>
          <div className="py-form-field__element">
            <Input
              type="number"
              className="py-form__element__medium"
              required
              value={data.exchangeRate}
              name="exchangeRate"
              onChange={this.handleChange}
            />
            <div className="help-block">{bill.currency.code} to {businessInfo.currency.code}</div>
          </div>
        </div>
        <div className="py-form-field py-form-field--inline">
          <Label className="py-form-field__label">Amount in</Label>
          <div className="py-form-field__element">
            <div className="py-text--strong">{toMoney(data.exchangeRate * data.amount)}</div>
            <span className="py-text--hint">{businessInfo.currency.code}</span>
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    const { data = {}, errors = {} } = this.state;
    const { bill } = this.props;
    return (
      <Modal centered isOpen={!!bill} className="modal-common purchase-record-payment">
        <ModalHeader toggle={this.close}>
          Record payment for this bill
        </ModalHeader>
        <ModalBody>
          <Form className="py-form-field--condensed" onSubmit={this.submit}>
            <div className="py-form-field py-form-field--inline">
              <Label for="paymentMethod" className="py-form-field__label">Payment Method</Label>
              <div className="py-form-field__element">
                <div className="py-select--native">
                  <Input
                    type="select"
                    className={`py-form__element${errors.paymentMethod ? ' has-errors' : ''}`}
                    placeholder="Select a payment method"
                    value={data.method}
                    onChange={this.handleChange}
                    name="method"
                  >
                    {ACCOUNTS.map((row) => (
                      <option key={row.id} value={row.value}>{row.label}</option>
                    ))}
                  </Input>
                  {errors.paymentMethod && (<span className="input-error-text">{errors.paymentMethod}</span>)}

                </div>
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              
                <Label for="amount" className="py-form-field__label">Amount</Label>
                <div className="py-form-field__element">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend" className="prependAddon-input-card">
                        {bill && bill.currency && bill.currency.symbol}
                      </InputGroupAddon>
                      {"   "}
                      <Input
                        type="number"
                        required
                        value={data.amount}
                        name="amount"
                        className="py-form__element__small"
                        onChange={this.handleChange}
                        onBlur={this.onAmountChange}
                      />
                    </InputGroup>
                  </div>
            </div>
            {this.renderExchangeRate()}
            <div className="py-form-field py-form-field--inline">
              <Label for="amount" className="py-form-field__label">Payment Date</Label>
              <div className="py-form-field__element">
                <DatepickerWrapper
                  selected={data.paymentDate || undefined}
                  onChange={date => this.handleChange({ target: { value: date, name: "paymentDate" } })}
                  className="form-control"
                />
              </div>
            </div>
            <div className="py-form-field py-form-field--inline">
              <Label for="amount" className="py-form-field__label">Memo</Label>
              <div className="py-form-field__element">
                <textarea
                  name="memo"
                  rows={4}
                  className="form-control py-form__element__medium"
                  value={data.memo}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-outline-primary" onClick={this.close}>Cancel</Button>
          <Button disabled={this.props.updating} className="btn btn-primary"
            onClick={this.submit}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}
