import React from 'react';
import {
  Button,
} from "reactstrap";

const RecurrintStep3 = props => {
  const { handleGetPaid, invoiceData, editMode, handleEditMode } = props
  return (
    <div className="py-box py-box--large">
      <div className="invoice-steps-card__options">
        <div className="invoice-step-card__header recurring-invoice-card__header mb-4">
        <div className="step-indicate">
          {invoiceData.paid.isPaid ? (
            <div className="step-done-mark">
              {" "}
              <img src="/assets/check-mark-fill.svg" />
            </div>
          ) : (
              <div className="step-name">3</div>
            )}
        </div>
        <div className="py-heading--subtitle">Get Paid </div>
        {invoiceData.recurrence.isSchedule &&
          <div className="step-btn-box">
            {editMode && <Button
              onClick={e => handleEditMode('step3')}
              className="btn-outline-primary mr-2"
            >
              Cancel
          </Button>}
            <Button
              onClick={e => editMode || !invoiceData.paid.isPaid ? handleGetPaid('step3') : handleEditMode('step3')}
              className="btn-primary"
            >
              {invoiceData.paid.isPaid ? 'Edit' : 'Next'}
            </Button>
          </div>}
        </div>
        
      </div>
      {editMode || !invoiceData.paid.isPaid ?
        <div className="invoice-steps-card__content">
          {invoiceData.currency.code !== 'USD' && <div className="py-notify py-notify--warning">
            <div className="py-notify__icon-holder">
              <img src="/assets/r-warning.svg" />
            </div>
            <div className="py-notify__content-wrapper">
              <div className="py-notify__content">
              <div className="py-text--strong py-text--capitalize">Credit Card payment not accepted</div>
              <p>This invoice currency <span className="py-text--strong">({invoiceData.currency.code})</span> does not match your business currency <span className="py-text--strong">(USD)</span>.</p>
              <p>Credit card payments can be enabled only for invoices created in USD.</p>
              </div>
            </div>
          </div>}
          <div className="py-box is-active">
            <div className="d-flex align-items-center">
                <div className="py-decor-icon">
                <svg viewBox="0 0 80 80" id="decor--payments-manual" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle cx="40" cy="40" r="38" fill="#442F8C" fill-rule="nonzero"></circle><path fill="#FFF" d="M70.659 40.39c-1.206-1.666-2.206-2.063-6.395.124l-10.103 6.04c-.944.469-3.43 1.304-6.28 1.446H34v-1.047c0-.526.427-.953.962-.953H46c1.443 0 2.615-1.949 1.88-3.037-1.351-2.005-3.685-3.116-6.114-3.116h-3.754c-2.188 0-4.346-.672-6.093-1.98C27.842 34.815 20 40.803 20 40.803V58h13.472c1.921 0 3.841-.144 5.74-.43l12.543-1.895c.428 0 .844-.05 1.246-.138 1.034-.144 1.962-.655 2.703-1.359l14.623-11.306a1.83 1.83 0 0 0 .332-2.481z"></path><rect width="5" height="24" x="15" y="37" fill="#7FB2FF" rx="2"></rect><path fill="#7FB2FF" fill-rule="nonzero" d="M50.345 38.82a.67.67 0 0 1-.196-.483v-1.885a9.28 9.28 0 0 1-3.338-1.052 5.575 5.575 0 0 1-2.067-1.884 4.798 4.798 0 0 1-.744-2.38.52.52 0 0 1 .166-.4.594.594 0 0 1 .413-.168h3.493c.183-.01.364.03.527.116.16.099.303.223.424.369a3.082 3.082 0 0 0 2.986 1.473 4.476 4.476 0 0 0 2.191-.442c.469-.22.77-.695.775-1.22a1.188 1.188 0 0 0-.413-.917 3.616 3.616 0 0 0-1.323-.6 23.87 23.87 0 0 0-2.5-.631 10.597 10.597 0 0 1-4.734-1.937 4.567 4.567 0 0 1-1.54-3.747 4.97 4.97 0 0 1 1.54-3.663 7.112 7.112 0 0 1 4.134-1.884v-1.821A.659.659 0 0 1 50.8 15h2.274a.634.634 0 0 1 .475.19c.124.125.19.296.186.474v1.926c1.06.173 2.075.56 2.987 1.137a6.25 6.25 0 0 1 1.932 1.873c.413.604.659 1.309.713 2.042a.596.596 0 0 1-.155.41.513.513 0 0 1-.393.18h-3.658a.967.967 0 0 1-.889-.484 1.643 1.643 0 0 0-.826-.948 3.68 3.68 0 0 0-3.318 0 1.323 1.323 0 0 0-.61 1.18c.011.523.317.994.786 1.21.93.422 1.91.723 2.914.894 1.35.21 2.673.58 3.938 1.106 1.825.69 2.98 2.528 2.831 4.505a4.977 4.977 0 0 1-1.695 3.863 8.187 8.187 0 0 1-4.547 1.905v1.863a.66.66 0 0 1-.187.483.635.635 0 0 1-.474.19H50.81a.655.655 0 0 1-.465-.178z"></path></g></svg>
                </div>
                <div className="pl-2">
                  <strong className="py-text--strong">Manual payments </strong>
                  <p className="m-0"> Your customer will have to pay for each invoice manually.</p>
                </div>
              </div>
          </div>
        </div>
        :
        <div className="invoice-steps-card__content">
          <div className="pz-text-strong">
            <strong className="py-text--strong">Manual payments:</strong> Your customer will manually pay each recurring invoice.
                      <br />
            <strong className="py-text--strong">Credit Card Payments:</strong> Disabled
                  </div>
        </div>}
    </div>
  )
}

export default RecurrintStep3