import { convertDate } from '../utils';
import { stat } from 'fs';

export const modernTemplateHTML = (invoice, user, business, setting, message = "") => {
      let { title, subTitle, currency, uuid, invoiceNumber, amountBreakup, notes, itemHeading, invoiceDate, dueDate, publicView, customer, dueAmount, memo, footer, items } = invoice.data ? invoice.data.invoice : {};
      let { addressLine1 = "", addressLine2 = "", country = "", state = "", city = "", postal } = (business && business.address) || {};
      let { phone = "", fax = "", mobile = "", tollFree = "", website = "" } = (business && business.communication) || {};
      const { customerName, firstName, lastName, addressBilling, addressShipping } = customer;
      const { email } = user;
      let invoiceName = title + " #" + invoiceNumber;
      let fullName = `${firstName} ${lastName}`;
      let from = business.organizationName || "Peymynt";
      let grandTotal = `${currency.symbol} ${amountBreakup ? amountBreakup.total : "0 "} `;
      invoiceDate = convertDate(invoiceDate);
      dueDate = convertDate(dueDate);
      console.log(`${process.env.BASE_URL}/public/invoice/${uuid}`);
      let publicViewUrl = publicView.shareableLinkUrl || `${process.env.BASE_URL}/public/invoice/${uuid}`;

      return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Receipt Email</title>
      </head>
       <body>
               <table cellpadding="0" cellspacing="0" border="0" width="600px" align="center" style="font-family: 'Roboto', sans-serif;">
                  <tr>
                     <td> 
                           <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                 <tr>
                                       <td>
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                         <td style="background-color: rgb(68, 68, 68); width:60%; padding:30px; text-align:left;color:#fff;font-size:30px;"> ${title} </td>
                                                            <td style="background-color:rgb(114, 114, 114);width:40%;padding:30px;text-align:center;color:#fff;"> Amount Due (${currency.code}): <br/> ${currency.symbol}${dueAmount} </td>
                                                  </tr>
                                            </table> 
                                       <td>
                                 </tr>
                                 <tr> 
                                       <td>
                                             <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:30px 15px 10px 15px">
                                                  <td style="width:30%">                          	 
                                                         <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
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
                                                         <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
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
                                                  <td style="width:40%">		   	          	  		
                                                          <table cellpadding="0" cellspacing="0" border="0" style="width:100%; font-size:13px">
                                                           <tr>
                                                     <td style="padding:5px;text-align:right;"> <strong> Invoice Number: </strong> </td>
                                                     <td style="padding:5px; text-align:left;"> ${invoiceNumber}</td>
                                                           </tr>
                                                           <tr>
                                                          
                                                           ${ business && business.address && business.address.postal && `<tr>
                                                      <td style="padding:5px;text-align:right;"> <strong>  P.O./S.O. Number: </strong> </td>
                                                      <td style="padding:5px; text-align:left;">${postal}</td>
                                                          </tr>`}

                                                          <tr>
                                                     <td style="padding:5px;text-align:right;"> <strong> Invoice Date: </strong></td>
                                                     <td style="padding:5px 5px 10px 5px;text-align:left;">${invoiceDate}</td>
                                                           </tr>
                                                           <tr>
                                                     <td style="padding:5px;text-align:right;"> <strong> Payment Due :</strong> </td>
                                                     <td style="padding:5px;text-align:left;">${dueDate}</td>
                                                           </tr>
                                                           <tr>
                                                     <td style="padding:5px;text-align:right;"> <strong> Amount Due (${currency.code}): </strong> </td>
                                                     <td style="padding:5px;text-align:left"> <strong> ${currency.symbol}${dueAmount} </strong></td>
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
                                              <th style="text-align:left; padding:8px; border-top:1px solid #ccc;border-bottom:1px solid #ccc;"> ${itemHeading.column1.name}</th>
                                              <th style="text-align:center;padding:8px;border-top:1px solid #ccc;border-bottom:1px solid #ccc;"> ${itemHeading.column2.name}</th>
                                              <th style=" text-align:center;padding:8px;border-top:1px solid #ccc;border-bottom:1px solid #ccc;"> ${itemHeading.column3.name}</th>
                                              <th style="text-align:right;border-top:1px solid #ccc;border-bottom:1px solid #ccc;"> ${itemHeading.column4.name}</th>
                                         </tr>
                                      </thead>
                                      <tbody>
                                          ${items.map(item => {
                                              return `<tr>
                                                <td style="padding:8px;font-size: 13px;">${item.column1}</td>
                                                <td style="padding:8px;font-size: 13px;text-align:center">${item.column2}</td>
                                                <td style="padding:8px;font-size: 13px;text-align: center">${item.column3}</td>
                                                <td style="padding:8px;font-size: 13px;text-align: right">${item.column4}</td>
                                                </tr>`
                                            })}
                                      </tbody>
                                 </table>
                                       </td>
                                 </tr>
                                 <tr>
                             <td colspan="4" style="padding-top:15px;">
                                <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                     <tr>
                                       <td style="width:60%">
                                               &nbsp;
                                       </td>
                                        <td style="width:40%">
                                            <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                                   <tr>
                                             <td style="padding:5px"> <strong> Subtotal: </strong> </td>
                                             <td style="padding:5px; text-align:right"> ${currency.symbol}${amountBreakup.subTotal}</td>
                                                   </tr>
                                              ${amountBreakup.taxTotal.map(tax => {
                                                   return `<tr>
                                             <td style="padding:5px 5px 10px 5px"> ${tax.taxName.abbreviation}: </td>
                                             <td style="padding:5px 5px 10px 5px;text-align:right"> ${tax.amount.toFixed(2)}</td>
                                                   </tr>`
                                                })}
                                                   <tr>
                                             <td style="padding:15px 5px; border-top:2px solid #ccc; border-bottom:2px solid #ccc;"> <strong>Total</strong> </td>
                                             <td style="padding:15px 5px;border-top:2px solid#ccc;border-bottom:2px solid #ccc;text-align:right"> ${grandTotal} </td>
                                                   </tr>
                                                   <tr>
                                             <td style="padding:5px"><strong> Amount Due (${currency.code}) </strong></td>
                                             <td style="padding:5px;text-align:right">  ${currency.symbol}${dueAmount} </td>
                                                   </tr>
                                            </table>
                                        </td>
                                       </tr>
                                 </table>
                             </td>
                                 </tr>
                                 <tr>
                                    ${ notes ? (`<td style="margin-top: 50px;display: block;">
                                          <strong> Note: </strong> 
                                          <p> ${ notes ? notes : ""} </p>
                                    </td>`
                                   ) : ""}
                                  </tr>

                                  <tr> 
                             <td style="text-align:center;margin-top:150px;display: block;">
                                <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                             </td>
                                 </tr>
    
                                 <tr>
                                    <td colsapn="2" style="border-top:1px solid #ccc; margin-top:50px; display:block; padding-top:20px;"> 
                                <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                                       <tr>
                                       <td style="width:30%"> 
                                          <table cellpadding="0" cellspacing="0" border="0" style="width:100%"> 
                                                <tr> 
                                                <td style="text-align:left;padding:14px">
                                                  <img src=${setting.companyLogo} height="150px" width="150px"/>
                                                </td>
                                                </tr>
                                          </table>
                                       </td>

                                       <td style="width:40%"> 
                                          <table cellpadding="0" cellspacing="0" border="0" style="width:100%"> 
                                                <tr> 
                                                  <td> <strong> ${from} </strong> </td>
                                                </tr>
                                                <tr> 
                                                  <td> ${city}, ${state && state.name ? state.name  : ""} ${business && business.address && business.address.postal} </td>
                                                </tr>
                                                <tr> 
                                                  <td> ${country && country.name ? country.name : ""} </td>
                                                </tr>
                                          </table>
                                       </td>
                                       
                                       <td style="width:30%; text-align:right"> 
                                           <table cellpadding="0" cellspacing="0" border="0" style="width:100%"> 
                                                
                                           ${business && business.communication && (phone || fax || mobile || tollFree || website) ? (`<tr> 
                                                  <td><strong> Contact Information </strong></td>
                                                </tr>`) : ""}

                                                ${phone ? (`<tr> 
                                                  <td> Phone: ${phone} </td>
                                                </tr>`) : ""}

                                                ${fax ? (`<tr> 
                                                  <td> Fax: ${fax} </td>
                                                </tr>`) : ""}

                                                ${mobile ? (`<tr> 
                                                    <td> Mobile:: ${mobile} </td>
                                                </tr>`) : ""}

                                                ${tollFree ? (`<tr> 
                                                      <td> Toll Free:: ${tollFree} </td>
                                                  </tr>`) : ""}

                                                ${tollFree ? (`<tr> 
                                                  <td> ${website} </td>
                                              </tr>`) : ""}
                                                
                                                <tr> 
                                                  <td> <strong>${ footer ? footer : "" } </strong> </td>
                                                </tr>
                                          </table>
                                       </td>
                                       </tr>
                                </table>
                                    <td>
                                 </tr>
                           </table>
                     </td> 
                  </tr> 
               </table>
       </body>
    </html>`;
}
