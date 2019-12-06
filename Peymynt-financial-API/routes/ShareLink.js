const express = require("express");
const router = express.Router();

import { fetchEstimateByUUID } from "../services/EstimateService";
import { OrganizationModel } from "../models/organization.model";
import { EstimateModel } from "../models/estimate.model";
import { convertDate } from "../util/utils";

router.get("/:uuid", async (req, res) => {
    let uuid = req.params.uuid;
    res.writeHead(200, { "Content-Type": "text/html" });
    if (!uuid) {
        res.write("<h1>Estimate not found for this Id </h1>");
        res.end();
        return res;
    } else {
        let estimate = await EstimateModel.findOne({ uuid, isActive: true, isDeleted: false }).populate("customer").populate("businessId");
        if (estimate) {
            let business = estimate.businessId;
            let customer = estimate.customer;
            const html = `<!doctype html>
                    <html lang="en">
                    <head>
                        <!-- Required meta tags -->
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

                        <!-- Bootstrap CSS -->
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                            <style> 

                            .btn-box {
                                margin-left: 124px;
                                margin-top: 30px;
                                margin-bottom: 15px;
                            }

                            .btn-box .btn-simple {
                                color: #4d6575;
                                background: rgba(0,0,0,0);
                                border: 1px solid #b2c2cd;
                            border-radius:50px;
                            padding:8px 30px;
                            }

                            .estimate-main {
                                width: 860px;
                                margin: 0 auto;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.2);               
                            }

                            .estimate-header{
                                border-bottom: 1px solid #ececec;
                                padding:30px 50px;
                            }

                            .estimate-header h1{
                                text-transform:uppercase
                            }

                            .estimate-header span{
                                display: block
                            }
                            .text-bold
                            {
                                font-weight:600;
                            }       
                            

                                .estimate-info {
                                padding: 30px 50px;
                                }

                            .info-lft{  
                                    width: 60%;
                                    display: inline-block;
                                    vertical-align: top;
                            }

                                .info-lft span {
                                display: block;
                            }

                            .info-rigt .table tbody tr td {
                                    padding: 5px;
                                }

                                .info-rigt .table tbody tr td:last-child {
                            text-align: left;
                            }

                            .info-lft .text-light {
                                color: #8C959A !important;
                            }

                                .info-rigt {
                                    
                                display: inline-block;
                                width:39%;
                                }


                                .estimate-total {
                                    text-align: right;
                                    width: 268px;
                                    float: right;
                                }

                                .total div:first-child, .G-total div:first-child {   
                                    display: inline-block;
                                    padding: 15px;
                                }

                                .total{ 
                                    border-bottom:2px solid #ececec;
                                }

                                .total div, .G-total .amount {
                                        display: inline-block;
                                    }

                                .estimate-total {
                                    text-align: right;
                                    width: 268px;
                                    float: right;
                                    padding-right: 50px;
                                }

                                .gry-bg {
                                        background: #f4f5f5;
                                    }


                                .estimate-detail-table .table .thead-dark th,
                                .estimate-detail-table .table tbody td {
                                        padding-left: 30px;
                                    }


                                .estimate-detail-table .table .thead-dark th:last-child,
                                .estimate-detail-table .table tbody td:last-child {
                                        text-align: right;
                                        padding-right: 50px;
                                }

                                .estimate-detail-table .table .thead-dark th:nth-child(2),
                                .estimate-detail-table .table tbody td:nth-child(2) {
                                            text-align: center;
                                }

                                .estimate-detail-table .table .thead-dark th:nth-child(3),
                                .estimate-detail-table .table tbody td:nth-child(3) {
                                            text-align: center;
                                }

                                .template-footer{
                                    margin: 0 30px 15px 30px;
                                    text-align: center;
                                    line-height: 16px;
                                    position: absolute;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    white-space: pre-wrap;
                                }

                                .text-fine-print{
                                    font-size: 13px;
                                    color: #687578;
                                }

                                .text-strong{
                                    font-size: 13px;
                                    font-weight: 600;
                                }

                                .template-memo{
                                    margin: 0 0 35px 0;
                                    word-wrap: break-word;
                                }

                            </style>
                        <title>Estimate</title>
                    </head>
                    <body>

                        <section class="main-wrapper">           
                        <div class="container">         
                            <div class="btn-box"> 
                                <button class="btn btn-simple">  Print</button>
                                <button class="btn btn-simple">  Download PDF </button>
                            </div>

                            <div class="estimate-main">               
                                <div class="estimate-header text-right">
                                        <h1> ${estimate.name} </h1>
                                        <span>${estimate.subheading || ""}</span>
                                        <span class="text-bold">${business.organizationName || ""}</span>
                                        <span>${business.country.name || ""}</span>
                                </div>
                                <div class="estimate-body">
                                    <div class="estimate-info"> 
                                            <div class="info-lft"> 
                                                <span class="text-light"> Bill To</span>
                                                <span class="text-bold">${estimate.customer.customerName}</span>
                                            </div>
                                            <div class="info-rigt text-right"> 
                                                    <table class="table table-borderless">
                                                            <tbody>
                                                                <tr>
                                                            <td>
                                                                <strong >Estimate Number :</strong>
                                                            </td>
                                                            <td>
                                                                <span>${estimate.estimateNumber}</span>
                                                            </td>
                                                            </tr>
                                                            
                                                            <tr class="wv-table__row">
                                                            <td class="wv-table__cell">
                                                                <strong class="wv-text--strong">Estimate Date :</strong>
                                                            </td>
                                                            <td class="wv-table__cell">
                                                                <span>${convertDate(estimate.estimateDate)}</span>
                                                            </td>
                                                            </tr>
                                                            <tr class="wv-table__row">
                                                            <td class="wv-table__cell">
                                                                <strong class="wv-text--strong">Expires On :</strong>
                                                            </td>
                                                            <td class="wv-table__cell">
                                                                <span>${convertDate(estimate.expiryDate)}</span>
                                                            </td>
                                                            </tr>
                                                            <tr class="gry-bg">
                                                            <td class="wv-table__cell">
                                                            <span class="wv-text--strong">
                                                                Grand Total (${estimate.currency.code}) :
                                                            </span>
                                                            </td>
                                                            <td class="wv-table__cell">
                                                                <span class="wv-text--strong">
                                                                
                                                                    ${estimate.totalAmount}
                                                                
                                                                </span>
                                                            </td>
                                                            </tr>
                                                        </tbody></table>
                                                
                                            </div>
                                    </div>
                                    <div class="estimate-detail-table clearfix"> 
                                        <table class="table table-hover">
                                            
                                                    <thead class="thead-dark"> 
                                                        <tr>
                                                            <th> Items</th>
                                                            <th> Quantity</th>
                                                            <th> Price</th>
                                                            <th> Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${estimate.items.map(o=> {
                                                            return(`<tr>
                                                                <td>
                                                                    ${o.name}
                                                                </td>
                                                                <td>${o.quantity}</td>
                                                                <td> <span> RS</span> <span> ${o.price}</span> </td>
                                                                <td> <span> RS</span> <span> ${o.price} </span> </td>
                                                            </tr>`)
                                                        })
                                                        }
                                                    </tbody>
                                            
                                        </table>
                                        <div class="estimate-total">
                                        <div class="total"> 
                                            <div class="text-bold"> Total </div>
                                            <div class="text-normal amount"> <span> RS</span> <span>${estimate.totalAmount}</span> </div>
                                        </div>
                                        <div class="G-total"> 
                                                <div class="text-bold"> Grand Total </div>
                                                <div class="text-normal amount"> <span> RS</span> <span class="amount">${estimate.totalAmount}</span> </div>
                                            </div>
                                        </div>
                                    </div>
                                    /* ********************************* */
                                        <div className="template-memo">
                                            <div>
                                                <span className="text-strong">Notes</span>
                                            </div>
                                                <span>${estimate.memo}</span>
                                        </div>
                                        <div className="template-footer">
                                            <span className="text-fine-print">${estimate.footer}</span>
                                        </div>
                                        /* ********************************* */
                                </div>
                            </div>
                        </div>
                        </section>
                        
                        

                        <!-- Optional JavaScript -->
                        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
                        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
                        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
                    </body>
                    </html>`;
            res.write(html);
            res.end();
            return res;
        } else {
            res.write("<h1>Estimate not found for this Id </h1>");
            res.end();
            return res;
        }
    }
});

module.exports = router;
