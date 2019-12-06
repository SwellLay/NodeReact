import React, { Fragment } from "react";
import { Alert } from 'reactstrap';
class ReminderPreview extends React.Component {
   componentDidMount(){
      document.title = 'Peymynt'
   }
  render() {
    return <Fragment>
    <div className="invoice-reminder-email-preview">
      <Alert color="primary" className="alertReciept preview-notification-banner" style={{margin: '15px auto', display: 'flex', width: '750px', alignItems: 'center'}}>
         <i className="pe-7s-info fa-2x"/>&nbsp;
         <span>This is a preview of the email for the payment reminder that your customer will see.</span>
         <button
            onClick={() => {
               window.close();
            }}
            className="btn btn-default btn-rounded pull-right btn-close-tab"
         >
            Close this tab
         </button>
      </Alert>
      <div className="invoice-reminder-email-preview__preview-img">
         <img src="/assets/unpaid.png"/>
      </div>
   </div>
</Fragment>
    ;
  }
}

export default ReminderPreview;
