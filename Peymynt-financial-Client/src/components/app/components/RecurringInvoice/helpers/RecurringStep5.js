import React from 'react';
import moment from "moment-timezone";

const RecurringStep5 = props =>{
    const {approveRecurringInvoice, invoiceData} = props
    return (
        <div className="py-box py-box--large is-highlighted">
                  <div className="recurring-invoice-view-activate-section">
                    <div className="recurring-invoice-view-activate-section__box__title pt-2 pb-2">
                      <div className="py-heading--title">You're almost set! </div>
                    </div>
                    <div className="recurring-invoice-view-activate-section__box__subtitle pt-2 pb-2">
                      <div className="py-heading--subtitle">
                        Review the details of your recurring invoice above and approve it when you're ready
                      </div>
                    </div>
                    <div className="pt-2 pb-2">
                      <strong className="py-text--strong">{`Once approved, your first invoice will be created ${moment(invoiceData.recurrence.startDate).format("MMMM Do YYYY")}.`}</strong>
                    </div>
                    <div className="recurring-invoice-view-activate-section__start-button">
                      <button type="button" onClick={e=>approveRecurringInvoice('approve')} className="btn btn-rounded btn-accent">Approve and start recurring invoice</button>
                    </div>
                  </div>
                </div>
    )
}

export default RecurringStep5;