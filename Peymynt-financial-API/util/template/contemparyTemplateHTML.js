import { convertDate } from '../utils';

export const contemparyTemplateHTML = (invoice, user, business, setting, message = "") => {
    let { title, subTitle, currency, uuid, invoiceNumber, amountBreakup, itemHeading, invoiceDate, dueDate, publicView, customer, dueAmount, memo, notes, footer, items } = invoice.data ? invoice.data.invoice : {};
    let { addressLine1 = "", addressLine2 = "", country = "", state = "", city = "", postal } = (business && business.address) || {};
    let { phone = "", fax = "", mobile = "", tollFree = "", website = "" } = (business && business.communication) || {};
    const { customerName, firstName, lastName, addressShipping, addressBilling } = customer;
    const { email } = user;
    let invoiceName = title + " #" + invoiceNumber;
    let fullName = `${firstName} ${lastName}`;
    let from = business.organizationName || "Peymynt";
    let grandTotal = `${currency.symbol} ${amountBreakup ? amountBreakup.total : "0 "}`;
    invoiceDate = convertDate(invoiceDate);
    dueDate = convertDate(dueDate);
    console.log(`${process.env.BASE_URL}/public/invoice/${uuid}`);
    let publicViewUrl = publicView.shareableLinkUrl || `${process.env.BASE_URL}/public/invoice/${uuid}`;
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <table align="center" cellpadding="0" cellspacing="0" border="0" width="650px" style="border:1px solid #ccc;font-family: Arial, Helvetica, sans-serif">
            <tr>
                <td>
                    <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
                       <tr>
                           <td>
                               <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                            <td style="text-align:left;padding:14px">
                                                <img src=${setting.companyLogo} height="200px" width="300px"/>
                                             </td>
                                             <td style="text-align:right;padding:14px">
                                                 <span style="font-size:36px; display:block">${invoiceName}</span>
                                                 <span style="font-size:16px;display:block">${subTitle}</span>
                                                 <span style="font-size:16px;display:block">${business.organizationName}</span>
                                             </td>
                                        </tr>
                               </table>
                           </td>
                       </tr>
                       <tr>
                        <td colspan="2" style="background-color:#ccc;height: 1px;margin:14px 0;display:block;"></td>
                       </tr>
                       
                    <tr> 
                            <td colspan="2" style="padding:20px;">
                                    <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                            <td style="width:20%"> 
                                               <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
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
                                            <td style="width:30%"> 
                                            <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
                                               <tr>
                                               <td style="padding:3px;color:#8C959A;">  Ship To  </td>
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
                                              
                                            </table> 
                                            </td>
                                            <td style="width:50%">
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
                                        </tr>
                                    <table>
                            </td>                      
                       </tr>             
                    </table>               
                </td>
            </tr>
           <tr>
                <td>
                    <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td colspan="4">
                                <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: Arial, Helvetica, sans-serif; font-size:16px">
                                    <thead>
                                        <tr>
                                            <th style="background-color:#333;color:#fff;padding:8px;text-align:left"> ${itemHeading.column1.name} </th>
                                            <th style="background-color:#333;color:#fff;padding:8px"> ${itemHeading.column2.name}</th>
                                            <th style="background-color:#333;color:#fff;padding:8px"> ${itemHeading.column3.name}</th>
                                            <th style="background-color:#333;color:#fff;padding:8px;text-align:right"> ${itemHeading.column4.name}</th>
                                        </tr>
                                    </thead>
                                    <tbody> 
                                        ${items.map(item => {
                                            return `<tr>
                                            <td style="padding:8px;font-size: 14px;">${item.column1}</td>
                                            <td style="padding:8px;font-size: 14px;">${item.column2}</td>
                                            <td style="padding:8px;font-size: 14px;text-align: center">${item.column3}</td>
                                            <td style="padding:8px;font-size: 14px;text-align: right">${currency.symbol}${item.column4}</td>
                                            </tr>`
                                           })}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="margin-top:20px; display:block;padding:14px 8px;">
                                <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="width:60%"> 
        
                                        </td>
                                        <td style="width:40%"> 
                                            <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td style="padding:8px;border-bottom:1px solid #ccc"> <strong>Subtotal :</strong> </td>
                                                    <td style="padding:8px;font-size: 14px;text-align: right;border-bottom:1px solid #ccc">${currency.symbol}${amountBreakup.subTotal}</td>
                                                </tr>

                                                ${amountBreakup.taxTotal.map(tax => {
                                                    return `<tr>
                                                      <td style="padding:8px 5px 10px 5px"> ${tax.taxName.abbreviation}: </td>
                                                      <td style="padding:8px 5px 10px 5px;text-align:right"> ${currency.symbol}${tax.amount.toFixed(2)}</td>
                                                    </tr>`
                                                 })}
                                                <tr>
                                                    <td style="padding:8px;border-bottom:2px solid #ccc"> <strong>Total :</strong> </td>
                                                    <td style="padding:8px;font-size: 14px;text-align: right;border-bottom:2px solid #ccc">${grandTotal}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>                    
                            </td>
                        </tr>
                        <tr>
                        ${ notes ? (`<td> 
                                <strong style="padding:14px 14px 0 14px; font-size:16px">Notes</strong>
                                <span style="display:block;padding:10px 14px 0 14px; font-size:14px">${notes ? notes : ""}</span>
                            </td>`
                        ) : ""}
                        </tr>   
                        <tr>
                            <td style="display:block; margin:100px 0 30px; text-align:center;"> 
                                ${footer ? footer : ""}
                            </td>
                        </tr>                
                    </table>
                </td>
            </tr>
        </table>
    
      </body>
    </html>`

    return html;
}