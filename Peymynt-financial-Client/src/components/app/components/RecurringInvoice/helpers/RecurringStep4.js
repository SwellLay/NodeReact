import React, { Fragment } from 'react';
import { connect } from "react-redux";
const RecurringStep4 = props => {
  const { invoiceData, editMode, handleEditMode, handleScheduler, handleSendMail, addRecipientAddress, removeRecipientAddress } = props
  const { sendMail } = invoiceData
  console.log('sendMail.to', sendMail, invoiceData)
  return (
    <div className="py-box py-box--large">
      <div className="invoice-steps-card__options">
        <div className="invoice-step-card__header recurring-invoice-card__header mb-3">
        <div className="step-indicate">
          {invoiceData.status === "active" ? (
            <div className="step-done-mark">
              {" "}
              <img src="/assets/check-mark-fill.svg" />
            </div>
          ) : (
              <div className="step-name">4</div>
            )}
        </div>
        <div className="py-heading--subtitle">Send</div>
        {sendMail.autoSendEnabled === null ? '' : sendMail.isSent ?
          <div className="step-btn-box">
            {editMode ?
              <Fragment>
                <button onClick={e => handleEditMode('step4')} type="button" className="btn btn-outline-primary">Cancel</button>
                <button onClick={e => handleScheduler(!sendMail.autoSendEnabled, 'autoSendEnabled')} type="button" className="btn btn-outline-primary">{`Switch to ${sendMail.autoSendEnabled ? 'manual' : 'automatic'} sending`}</button>
                <button onClick={e => handleSendMail('step4')} type="button" className="btn btn-primary">Save</button>
              </Fragment>
              : <button onClick={e => handleEditMode('step4')} type="button" className="btn btn-primary">Edit</button>}
          </div>
          :
          <div className="step-btn-box">
            <button onClick={e => handleScheduler(!sendMail.autoSendEnabled, 'autoSendEnabled')} type="button" className="btn btn-outline-primary">{`Switch to ${sendMail.autoSendEnabled ? 'manual' : 'automatic'} sending`}</button>
            <button onClick={e => handleSendMail('step4')} type="button" className="btn btn-primary">Next</button>
          </div>}
        </div>
      </div>
      <div className="invoice-steps-card__content">
        {sendMail.isSent && !editMode ?
          <div>
            {sendMail.autoSendEnabled !== null && sendMail.autoSendEnabled ?
              <Fragment>
                <strong className="py-text--strong">Automatic sending: </strong>
                <span className="py-text py-text--body">Email the invoice automatically to {localStorage.getItem('user.email')} when the invoice is generated.</span>
              </Fragment>
              :
              <Fragment>
                <strong className="py-text--strong">Manual sending: </strong>
                <span className="py-text py-text--body">I will send each invoice to my customer.</span>
              </Fragment>}
          </div>
          : sendMail.autoSendEnabled === null ?
            <div className="py-content--narrow-send-type">
              <button onClick={e => handleScheduler(true, 'autoSendEnabled')} className="py-button--secondary">
                <div className="py-decor-icon">
                  <img src="/assets/paper_plane.svg" />
                </div>
                <div className="pt-2 pb-2"> <strong className="py-text--strong">Automatic sending</strong> </div>
                <span> Each invoice will be automatically emailed to your customer. </span>
              </button>
              <button onClick={e => handleScheduler(false, 'autoSendEnabled')} className="py-button--secondary">
                <div className="py-decor-icon">
                  <img src="/assets/open_envelope.svg" />
                </div>
                <div className="pt-2 pb-2"> <strong className="py-text--strong">Manual sending</strong> </div>
                <span> I will manually send each invoice to my customer. </span>
              </button>
            </div>
            : <Fragment>
              {!sendMail.autoSendEnabled ? <div className="py-box is-active">
                <div className="d-flex align-items-center">
                <div className="py-decor-icon">
                  <img src="/assets/open_envelope.svg" />
                </div>
                <div className="pl-2">
                  <strong className="py-text--strong">Manual sending </strong>
                  <p className="m-0"> I will manually send each invoice to my customer..</p>
                </div>
                </div>
              </div> :
                <Fragment>
                  <div className="py-box is-active">
                    <div className="d-flex align-items-center">
                      <div className="py-decor-icon">
                      <svg viewBox="0 0 80 80" id="decor--paperplane" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="nonzero"><circle cx="40" cy="40" r="38" fill="#442F8C"></circle><path fill="#7FB2FF" d="M23.503 45.935l2.923 11.106L67 26l-5.021 1.172L23.5 44.938z"></path><path fill="#FFF" d="M32.638 52.26l-6.249 4.834 3.571-7.014-.016-.013L67 26 48.29 65zM9 34.578l14.5 11.32L67 26z"></path></g></svg>
                      </div>
                      <div className="pl-2">
                        <span className="py-text--strong">Automatic sending </span>
                        <p className="py-text m-0"> The invoice will be automatically emailed to your customer.</p>
                      </div>
                    </div>
                  </div>

                  <div className="recurring-invoice-view-send-auto-section__form">
                    <div className="send-with-py py-box py-box--card">
                      <div className="py-box--header">
                        <div className="py-box--header-title">Send with Peymynt</div>
                      </div>
                      <div className="py-box--content">
                      <div className="py-form-field py-form-field--inline">
                        <label htmlFor="exampleEmail" className="py-form-field__label">Send</label>
                        <div className="py-form-field__element">
                          <strong className="py-text--strong">Invoice only</strong>
                          <div className="py-text--hint">Will be sent when the invoice is generated.</div>
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <label htmlFor="exampleEmail" className="py-form-field__label">From</label>
                        <div className="py-form-field__element">
                          <input required="" name="from" type="email" className="form-control py-form__element__medium" value={sendMail.from} onChange={e => handleScheduler(e, 'sendMail')} />
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <label htmlFor="exampleEmail" className="py-form-field__label">To</label>
                        <div className="py-form-field__element">
                          {sendMail.to.map((address, index) => {
                            return index === 0 ? (
                              <div key={index} className="multirecipient">
                                <input
                                  required
                                  name="to"
                                  type="email"
                                  className="form-control py-form__element__medium"
                                  value={address}
                                  onChange={e => handleScheduler(e, 'sendMail', index)} />
                                <a className="multirecipient__icon py-text--link"  onClick={addRecipientAddress}>
                                <svg viewBox="0 0 26 26" className="py-icon" id="add--large" xmlns="http://www.w3.org/2000/svg"><path d="M13 24C6.925 24 2 19.075 2 13S6.925 2 13 2s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 8a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0V8z"></path><path d="M8 14a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2H8z"></path></svg>
                                </a>
                              </div>
                            ) :
                              (<div key={index} className="multirecipient">
                                <div>
                                  <input
                                    required
                                    name="to"
                                    type="email"
                                    className="form-control py-form__element__medium"
                                    value={address}
                                    onChange={e => handleScheduler(e, 'sendMail', index)} />
                                </div>
                                <a className="multirecipient__icon py-text--link" onClick={() => removeRecipientAddress(index)}>
                                <svg viewBox="0 0 20 20" className="py-icon" id="cancel" xmlns="http://www.w3.org/2000/svg"><path d="M11.592 10l5.078 5.078a1.126 1.126 0 0 1-1.592 1.592L10 11.592 4.922 16.67a1.126 1.126 0 1 1-1.592-1.592L8.408 10 3.33 4.922A1.126 1.126 0 0 1 4.922 3.33L10 8.408l5.078-5.078a1.126 1.126 0 0 1 1.592 1.592L11.592 10z"></path></svg>
                                </a>
                              </div>)
                          })}
                          <span className="py-text--hint"> An email address is required for automatic sending.</span>
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <label htmlFor="exampleEmail" className="py-form-field__label">Custom Message</label>
                        <div className="py-form-field__element">
                          <textarea type="text" name="message" value={sendMail.message} onChange={e => handleScheduler(e, 'sendMail')} style={{height: '148px'}} className="form-control py-form__element__medium" placeholder="Enter your message to Information Entertainment"></textarea>
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <label htmlFor="exampleEmail" className="py-form-field__label"></label>
                        <div className="py-form-field__element">
                          <a target="_blank" className="py-text--link-external" href={`${process.env.WEB_URL}/invoices/${invoiceData._id}/mail-preview`} >Preview email</a>
                        </div>
                      </div>
                      <div className="py-form-field py-form-field--inline">
                        <div htmlFor="exampleEmail" className="py-form-field__label"></div>

                        <div className="py-form-field__element">
                          <label className="py-checkbox">
                            <input name="attachPdf" type="checkbox" onChange={e => handleScheduler(e, 'sendMail')} className="py-form__element" checked={sendMail.attachPdf} value={sendMail.attachPdf} />
                            <span className="py-form__element__faux"></span>
                            <span className="py-form__element__label">Attach PDF of the invoice to the email sent to the customer</span>
                          </label>

                          <label className="py-checkbox">
                            <input name="copyMyself" onChange={e => handleScheduler(e, 'sendMail')} type="checkbox" className="py-form__element" checked={sendMail.copyMyself} value={sendMail.copyMyself} />
                            <span className="py-form__element__faux"></span>
                            <span className="py-form__element__label">Email a copy of each invoice to myself</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </Fragment>
              }
            </Fragment>
        }
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  businessInfo: state.businessReducer.selectedBusiness
});

const mapDispatchToProps = dispatch => {
  return {
    refreshData: () => {
      dispatch(updateData())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(RecurringStep4);