import { convertDate } from "../utils";

export const classicTemplateHTML = (invoice, user, business, setting, message = "") => {
  let {title, subTitle, currency, uuid, invoiceNumber, dueAmount, notes, amountBreakup,itemHeading, invoiceDate, dueDate, publicView,customer, memo, footer, items} = invoice.data ? invoice.data.invoice : {};
  let { addressLine1 = "", addressLine2 = "",country = "", state = "", city = "",  postal } = (business && business.address) || {};
  let { phone = "", fax = "", mobile = "", tollFree = "", website = "" } = (business && business.communication) || {};
  const {
    customerName,
    firstName,
    lastName,
    addressBilling,
    addressShipping
  } = customer;
  const { email } = user;
  let invoiceName = title + " #" + invoiceNumber;
  let fullName = `${firstName} ${lastName}`;
  let from = business.organizationName || "Peymynt";
  let grandTotal = `${currency.symbol} ${
    amountBreakup ? amountBreakup.total : "0 "
  }`;
  invoiceDate = convertDate(invoiceDate);
  dueDate = convertDate(dueDate);
  console.log(`${process.env.BASE_URL}/public/invoice/${uuid}`);
  let publicViewUrl =
    publicView.shareableLinkUrl ||
    `${process.env.BASE_URL}/public/invoice/${uuid}`;
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Classic Email</title>
      </head>
       <body>
          <table cellpadding="0" cellspacing="0" border="0" width="600px" align="center" style="font-family: 'Roboto', sans-serif;padding:16px 15px 20px 15px;border: 10px solid #c70000;">
            <tr>
              <td> 
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                      <td>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:15px 0;">
                            <tr>
                               <td>
                                  <img src=${setting.companyLogo} height="200px" width="300px"/> 
                                </td>
                                <td> 
                                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                    <tr>                                                    
                                        <td style="text-align:right"> 
                                          <strong> ${from} </strong> 
                                        </td>
                                    </tr>
                                    <tr> 
                                      <td style="text-align:right">${country && country.name? country.name: ""}</td>
                                    </tr>
                                  </table>
                                </td>
                            </tr>
                          </table> 
                        </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="width:33%">
                              <hr style="border-width: 2px 0 2px 0;border-style: solid;padding: 2px 0;
                              -webkit-flex-grow: 2;flex-grow: 2;margin: 40px 0;border-color: #c70000;">
                            </td>
                            <td style="width:15%">
                              <p style="display: -webkit-flex;display: flex;-webkit-align-items: center;align-items: center;margin: 0 20px;justify-content: center;"> 
                                <svg height="72" viewBox="0 0 28 72" width="28">
                                  <g fill="none" stroke="#c70000" stroke-width="2">
                                    path d="M183 57.038v-42.076c-.33.025-.664.038-1 .038-7.18 0-13-5.82-13-13 0-.336.013-.67.038-1h-154.076c.025.33.038.664.038 1 0 7.18-5.82 13-13 13-.336 0-.67-.013-1-.038v42.076c.33-.025.664-.038 1-.038 7.18 0 13 5.82 13 13 0 .336-.013.67-.038 1h154.076c-.025-.33-.038-.664-.038-1 0-7.18 5.82-13 13-13 .336 0 .67.013 1 .038z">
                                    </path>
                                    <path d="M177 51.503v-31.007c-.33.024-.664.037-1 .037-7.18 0-13-5.626-13-12.567 0-.325.013-.648.038-.967h-142.076c.025.319.038.641.038.967 0 6.94-5.82 12.567-13 12.567-.336 0-.67-.012-1-.037v31.007c.33-.024.664-.037 1-.037 7.18 0 13 5.626 13 12.567 0 .325-.013.648-.038.967h142.076c-.025-.319-.038-.641-.038-.967 0-6.94 5.82-12.567 13-12.567.336 0 .67.012 1 .037z">
                                    </path>
                                  </g>
                                </svg>
                                <span style="border-width: 2px 0 2px 0;border-style:solid;height:56px;line-height:56px;position: relative;padding: 0 10px;border-color: #c70000;font-size:30px;color:#c70000">
                                   Invoice
                                </span>
                                <svg height="72" viewBox="0 0 28 72" width="28">
                                  <g fill="none" stroke="#c70000" stroke-width="2">
                                      <path d="M27 57.038v-42.076c-.33.025-.664.038-1 .038-7.18 0-13-5.82-13-13 0-.336.013-.67.038-1h-154.076c.025.33.038.664.038 1 0 7.18-5.82 13-13 13-.336 0-.67-.013-1-.038v42.076c.33-.025.664-.038 1-.038 7.18 0 13 5.82 13 13 0 .336-.013.67-.038 1h154.076c-.025-.33-.038-.664-.038-1 0-7.18 5.82-13 13-13 .336 0 .67.013 1 .038z">
                                      </path>
                                      <path d="M21 51.503v-31.007c-.33.024-.664.037-1 .037-7.18 0-13-5.626-13-12.567 0-.325.013-.648.038-.967h-142.076c.025.319.038.641.038.967 0 6.94-5.82 12.567-13 12.567-.336 0-.67-.012-1-.037v31.007c.33-.024.664-.037 1-.037 7.18 0 13 5.626 13 12.567 0 .325-.013.648-.038.967h142.076c-.025-.319-.038-.641-.038-.967 0-6.94 5.82-12.567 13-12.567.336 0 .67.012 1 .037z">
                                      </path>
                                  </g>
                                </svg>
                              </p>
                            </td>
                            <td style="width:33%">
                              <hr style="border-width: 2px 0 2px 0;border-style: solid;padding: 2px 0;
                              -webkit-flex-grow: 2;flex-grow: 2;margin: 40px 0;border-color: #c70000;">
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr> 
                      <td>
                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:30px 0">
                          <td style="width:20%">                          	 
                            <table cellpadding="0" cellspacing="0" border="0" style="width:100% font-size: 12px;">
                              <tr>
                                <td style="padding:3px;color:#8C959A;">  Bill To  </td>
                              </tr>
                              <tr>
                                <td style=""><strong> ${customerName}</strong></td>
                              </tr>
                              ${addressBilling && addressBilling.addressLine1 &&
                                  `<tr>
                                    <td style="font-size:13px"> 
                                    ${addressBilling.addressLine1}
                                    </td>
                                  </tr>`
                              }
                              ${addressBilling && addressBilling.addressLine2 &&
                                `<tr>
                                  <td style="font-size:13px"> 
                                  ${addressBilling.addressLine2}
                                  </td>
                                </tr>`
                              }
                              ${addressBilling &&
                                `<tr>
                                  <td style="font-size:13px"> 
                                   ${addressBilling.city} ${addressBilling.state && addressBilling.state.name} ${addressBilling.postal}
                                  </td>
                                </tr>`
                              }
                              ${addressBilling && addressBilling.country && addressBilling.country.name &&
                                `<tr>
                                  <td style="font-size:13px"> 
                                  ${addressBilling.country.name}
                                  </td>
                                </tr>`
                              }
                                <tr>
                                  <td style="padding:3px;"> ${customer.email} </td>
                                </tr>
                            </table> 
                                   </td>
                                      <td style="width:20%; font-size:12px;">                          	 
                                      <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                           <tr>
                                               <td style="padding:3px;color:#8C959A;">  SHIP TO  </td>
                                            </tr>
                                             <tr>
                                                 <td style=""><strong> ${addressShipping &&
                                                      addressShipping.contactPerson}</strong>
                                                  </td>
                                              </tr>
                                              ${addressShipping && addressShipping.addressLine1 &&
                                                `<tr>
                                                  <td style="font-size:13px"> 
                                                  ${addressShipping.addressLine1}
                                                  </td>
                                                </tr>`
                                            }
                                            ${addressShipping && addressShipping.addressLine2 &&
                                              `<tr>
                                                <td style="font-size:13px"> 
                                                ${addressShipping.addressLine2}
                                                </td>
                                              </tr>`
                                            }
                                            ${addressShipping &&
                                              `<tr>
                                                <td style=" font-size:13px"> 
                                                 ${addressShipping.city} ${addressShipping.state && addressShipping.state.name} ${addressShipping.postal}
                                                </td>
                                              </tr>`
                                            }
                                            ${addressShipping && addressShipping.country && addressShipping.country.name &&
                                              `<tr>
                                                <td style="font-size:13px"> 
                                                ${addressShipping.country.name}
                                                </td>
                                              </tr>`
                                            }
                                                 <tr>
                                                      <td style="padding:3px;"> </td>
                                                  </tr>
                                                  </table> 
                                                  </td>
                                                  <td style="width:60%">		   	          	  		
                                                          <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                                           <tr>
                                                             <td style="padding:5px;text-align:right;font-size:13px"> <strong> Invoice Number: </strong> </td>
                                                             <td style="padding:5px; text-align:left;font-size:13px"> ${invoiceNumber}</td>
                                                           </tr>
                                                    ${business && business.address && business.address.postal && `<tr>
                                                          <td style="padding:5px;text-align:right;font-size:13px"> <strong> P.O./S.O. Number: </strong> </td>
                                                          <td style="padding:5px; text-align:left;font-size:13px"> ${postal}</td>
                                                    </tr>`}
                                                    <tr>
                                                          <td style="padding:5px;text-align:right;font-size:13px"> <strong> Invoice Date:</strong> </td>
                                                          <td style="padding:5px 5px 10px 5px;text-align:left;font-size:13px">${invoiceDate}</td>
                                                    </tr>
                                                    <tr>
                                                          <td style="padding:5px;text-align:right;font-size:13px"> <strong>Payment Due :</strong> </td>
                                                          <td style="padding:5px;text-align:left;font-size:13px">${dueDate}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:5px;text-align:right;font-size:13px"> <strong> Amount Due (${ currency.code }): </strong> </td>
                                                        <td style="padding:5px;text-align:left;font-size:13px">  <strong>${ currency.symbol}${dueAmount}  </strong></td>
                                                   </tr>
                                                </table> 
                                                  </td>
                                             </table>
                                       </td>                          
                                 </tr>
    
                                 <tr>
                                       <td colspan="2">
                                 <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                      <thead>
                                         <tr>
                                              <th style="text-align:left; padding:20px 0; border-top:1px dotted  #ccc;border-bottom:1px dotted #ccc;"> ${
                                                itemHeading.column1.name
                                              }</th>
                                              <th style="text-align:center;padding:8px;border-top:1px dotted  #ccc;border-bottom:1px dotted #ccc;padding:20px 0;"> ${
                                                itemHeading.column2.name
                                              }</th>
                                              <th style=" text-align:center;padding:8px;border-top:1px dotted  #ccc;border-bottom:1px dotted #ccc;padding:20px 0;"> ${
                                                itemHeading.column3.name
                                              }</th>
                                              <th style="text-align:right;border-top:1px dotted #ccc;border-bottom:1px dotted #ccc;padding:20px 0;">  ${
                                                itemHeading.column4.name
                                              }</th>
                                         </tr>
                                      </thead>
                                       <tbody> 
                                            ${items.map(item => {
                                              return `<tr>
                                                <td style="padding:8px;font-size: 13px;">${
                                                  item.column1
                                                }</td>
                                                <td style="padding:8px;font-size: 13px;text-align: center">${
                                                  item.column2
                                                }</td>
                                                <td style="padding:8px;font-size: 13px;text-align: center">${
                                                  item.column3
                                                }</td>
                                                <td style="padding:8px;font-size: 13px;text-align: right">${
                                                  item.column4
                                                }</td>
                                                </tr>`;
                                            })}
                                        </tbody>
                                 </table>
                                       </td>
                                 </tr>
                                 <tr>
                             <td colspan="4" style="padding-top:15px; border-top:1px dotted #ccc;">
                                <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                     <tr>
                                       <td style="width:60%">
                                               &nbsp;
                                       </td>
                                        <td style="width:40%">
                                            <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                                   <tr>
                                             <td style="padding:5px"> <strong> Subtotal: </strong> </td>
                                             <td style="padding:5px; text-align:right"> ${
                                               currency.symbol
                                             }${amountBreakup.subTotal}</td>
                                                   </tr>
                                          ${amountBreakup.taxTotal.map(tax => {
                                            return `<tr>
                                          <td style="padding:5px 5px 10px 5px"> ${
                                            tax.taxName.abbreviation
                                          }: </td>
                                          <td style="padding:5px 5px 10px 5px;text-align:right"> ${
                                            currency.symbol
                                          }${tax.amount.toFixed(2)}</td>
                                                </tr>
                                                <tr>`;
                                          })}
                                             <td style="padding:15px 5px; border-top:1px solid #ccc; border-bottom:medium double #dee1e2;"> <strong>Total</strong> </td>
                                             <td style="padding:15px 5px;border-top:1px solid#ccc;border-bottom:medium double #dee1e2;text-align:right"> ${grandTotal}</td>
                                                   </tr>
                                                   <tr>
                                             <td style="padding:5px"> <strong> Amount Due (${
                                               currency.code
                                             }) </strong> </td>
                                             <td style="padding:5px;text-align:right"> <strong> ${
                                               currency.symbol
                                             }${dueAmount} </strong></td>
                                                   </tr>
                                            </table>
                                        </td>
                                       </tr>
                                 </table>
                             </td>
                                 </tr>
                              <tr>
                              ${
                                notes
                                  ? `<td style="margin-top: 50px;display: block;">
                                    <strong> Note: </strong> 
                                    <p> ${notes} </p>
                              </td>`
                                  : ""
                              }
                              </tr>
    
                                  <tr> 
                             <td style="text-align:center;margin-top:150px;display: block;color: #687578;">
                                
                                <p style="13px;"> ${footer ? footer : ""}</p>
                             </td>
                                 </tr>   	          	  	
                           </table>
                     </td> 
                  </tr> 
               </table>
       </body>
    </html>`;
};
