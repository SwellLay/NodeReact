import React, { Fragment } from 'react';
import moment from "moment-timezone";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  InputGroup,
  Input,
  Col, FormText
} from "reactstrap";
import SelectBox from "utils/formWrapper/SelectBox";
import { REAPAT_INVOICE, monthlyList, INVOICE_END, WEEKLY_LIST, MONTH_YEAR, SUB_UNIT } from "../../../../../constants/recurringConst";
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";

const RecurringStep2 = props => {
  const { invoiceData, editMode, scheduleRecurringInvoice, handleScheduler, handleEditMode } = props
  const { isSchedule, subUnit, unit, dayOfWeek, monthOfYear, dayofMonth, startDate, interval, endDate, type, maxInvoices, timezone } = invoiceData.recurrence
  const timeznList = timeZoneList()
  console.log('let someData= moment.startOf("day").format()', timezone, unit)
  return (
    <div className="py-box py-box--large is-highlighted">
      <div className="invoice-steps-card__options">
        <div className="invoice-step-card__header recurring-invoice-card__header">
        <div
          className={`${
            invoiceData.skipped
              ? "step-indicate de-activate"
              : "step-indicate"
            }`}
        >
          {isSchedule ? (
            <div className="step-done-mark">
              {" "}
              <img src="/assets/check-mark-fill.svg" />
            </div>
          ) : (
              <div className={"step-name"}>2</div>
            )}
        </div>
        <div className="py-heading--subtitle">Set schedule</div>
        <div className="step-btn-box">
         {editMode && <Button
            onClick={e => handleEditMode('step2')}
            className="btn-outline-primary mr-2"
            disabled={isSchedule && !invoiceData.paid.isPaid}>
            Cancel
          </Button>}
          <Button
            onClick={e => scheduleRecurringInvoice('step2')}
            className="btn-primary"
            disabled={isSchedule && !invoiceData.paid.isPaid}>
            {!isSchedule ?  'Next'  : editMode?  'Save' : 'Edit'}
          </Button>
        </div>
        </div>
      </div>
      {editMode || !isSchedule ?
        <div className="invoice-steps-card__content">
          <div className="">
            {/* <Card> */}
              <Form className="recurring__schedule__container">
                <FormGroup className="py-box py-box--card">
                  <div className="py-box--header">
                    <div className="py-box--header-title">
                      Repeat this invoice
                    </div>
                  </div>
                  <div className="py-box--content">
                    <div className="schedule-settings-container__row__content">
                    <div className="py-select--native  py-form__element__small">
                      <Input
                        value={unit}
                        className="py-form__element"
                        onChange={e => handleScheduler(e, "unit")}
                        type='select'
                      >
                        {REAPAT_INVOICE.map((item, index) => {
                          return <option key={index} value={item.value}>{item.label}</option>
                        })}
                      </Input>
                      </div>

                      
                      {unit === 'custom' &&

                      <div className="recurring__schedule__content-joined">
                            <Input
                              value={interval}
                              className="py-form__element__xsmall"
                              onChange={e => handleScheduler(e, "interval")}
                            />


                            <div className="py-select--native py-form__element__small">
                            <Input
                              value={subUnit}
                              onChange={e => handleScheduler(e, "subUnit")}
                              type='select'
                              className="py-form__element"
                            >
                              {SUB_UNIT.map((item, index) => {
                                return <option key={index} value={item.value}>{item.label}</option>
                              })}
                            </Input>
                           </div>
                          </div>
                        }
                        {/* {unit === 'custom' &&
                       
                      } */}
                  {(unit === 'weekly' || subUnit === 'Week(s)') &&
                    <Fragment>
                      <span className="py-text">every</span>

                      <div className="py-select--native py-form__element__small">
                        <Input
                          value={dayOfWeek}
                          onChange={e => handleScheduler(e, "dayOfWeek")}
                          type='select'
                          className="py-form__element"
                        >
                          {WEEKLY_LIST.map((item, index) => {
                            return <option key={index} value={item.value}>{item.label}</option>
                          })}
                        </Input>
                        
                        </div>

                    </Fragment>
                  }
                  {(unit === 'yearly' || (unit === 'custom' && subUnit === 'Year(s)')) &&
                    <Fragment>
                      <span className="py-text">every</span>

                      <div className="py-select--native py-form__element__small">
                        <Input
                          value={monthOfYear}
                          className="py-form__element"
                          onChange={e => handleScheduler(e, "monthOfYear")}
                          type='select'
                        >
                          {MONTH_YEAR.map((item, index) => {
                            return <option key={index} value={item.value}>{item.label}</option>
                          })}
                        </Input>
                        </div>

                    </Fragment>
                  }
                  {(["monthly", "yearly"].includes(unit) || (unit === "custom" && ['Month(s)', 'Year(s)'].includes(subUnit))) &&
                    <Fragment>
                      <span className="py-text">on the </span>

                      <div className="py-select--native py-form__element__xsmall">
                      <Input
                          value={dayofMonth}
                          onChange={e => handleScheduler(e, "dayofMonth")}
                          type='select'
                          className="py-form__element"
                        >
                          {monthlyList.map((item, index) => {
                            return <option key={index} value={item.value}>{item.label}</option>
                          })}
                        </Input>
                        </div>

                      <span className="py-text">day of the month</span>
                    </Fragment>
                  }
                  </div>
                  </div>

                </FormGroup>
                <div className="py-box py-box--card">
                  <div className="py-box--header">
                    <div className="py-box--header-title">
                      Create first invoice on 
                    </div>
                  </div>


                    <div className="py-box--content">
                      <div className="schedule-settings-container__row__content">
                        <div className="">
                          <DatepickerWrapper
                            minDate={new Date()}
                            selected={startDate}
                            onChange={date => handleScheduler(date, "startDate")}
                            className="form-control py-form__element__small"
                          />
                        </div>
                        <span className="py-text">and end</span>

                        <div className="recurring__schedule__content-joined">
                        <div className="py-select--native  py-form__element__small">
                            <Input
                              value={type}
                              className="py-form__element"
                              onChange={e => handleScheduler(e, "type")}
                              type='select'
                            >
                          {INVOICE_END.map((item, index) => {
                            return <option key={index} value={item.value}>{item.label}</option>
                          })}
                        </Input>
                        </div>

                        {type === 'after' ?
                      <div>
                        <Input
                          value={maxInvoices}
                          onChange={e => handleScheduler(e, "maxInvoices")}
                          options={INVOICE_END}
                          className="py-form__element__small"
                          clearable={false}
                        />
                        invoices
                        </div>
                      : type === 'on' &&
                        <DatepickerWrapper
                          minDate={startDate}
                          selected={endDate}
                          onChange={date => handleScheduler(date, "endDate")}
                          className="form-control py-form__element__small"
                        />

                      }
                    </div>

                      </div>

                      </div>
                      {/* end::settings */}
                </div>
                <div className="py-box py-box--card">
                  <div className="py-box--header">
                    <div className="py-box--header-title">Choose a timezone</div>
                    <p>Set a time zone to ensure invoice delivery in the morning
                        based on the recipient's time zone.</p>
                  </div>
                  <div className="py-box--content">
                      <div className="mb-1">Time zone</div>
                        <SelectBox
                          value={!!timezone && !!timezone.name && timezone.name}
                          onChange={e => handleScheduler(e, "timezone")}
                          options={timeznList}
                          clearable={false}
                          className="py-form__element__medium"
                        />
                    </div>
                </div>
              </Form>
            {/* </Card> */}
          </div>
        </div>
        :
        <div className="invoice-steps-card__content">
          <div className="pz-text-strong">
            <strong className="py-text--strong">Repeat {unit}:</strong> {showRepeatOn(invoiceData.recurrence)}
            <br />
            <strong className="py-text--strong">Dates:</strong> {showCreateDate(invoiceData.recurrence)}
            <br />
            <strong className="py-text--strong">Time zone:</strong> {invoiceData.recurrence.timezone.name}
            </div>
        </div>}
    </div>

  )

}

const timeZoneList = () => {
  let listOfTimeZone = moment.tz.names()
  const list = listOfTimeZone.map(item => {
    return {
      label: item,
      value: item
    }
  })

  return list
}

const showRepeatOn =data=>{
  switch (data.unit){
    case 'daily':
    return 'Every day of the week'
    case 'weekly':
      return `Every ${data.dayOfWeek}`
    case 'monthly':
    return `On the ${data.dayofMonth} day of each month`
    case 'yearly':
    return `Every ${data.monthOfYear} on the ${data.dayofMonth} day of the month`
    case 'custom':
    return `Every ${data.interval} ${data.subUnit} in ${data.monthOfYear} on the ${data.dayofMonth} day of the month`
  }
}

const showCreateDate = data =>{
  switch (data.type){
    case 'after' : return `Create first invoice on ${moment(data.startDate).format("MMMM Do YYYY")},end after ${data.maxInvoices} invoice`
    case 'on': return `Create first invoice on ${moment(data.startDate).format("MMMM Do YYYY")},end on ${moment(data.endDate).format("MMMM Do YYYY")}`
    case 'never' : return `Create first invoice on ${moment(data.startDate).format("MMMM Do YYYY")},and end never`
  }
}

export default RecurringStep2