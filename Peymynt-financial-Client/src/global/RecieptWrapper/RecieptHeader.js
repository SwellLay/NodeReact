import React from 'react';
import { NavLink } from 'react-router-dom';

export const RecieptHeader = ({invoiceData}) => (
    <header>
        <div className="container">
            <span className="txt">You are previewing your customer's receipt for payment on {invoiceData && invoiceData.invoiceNumber !== 0 && <strong>Invoice {invoiceData && invoiceData.invoiceNumber}.</strong>}</span>
            <span className="goBack"><NavLink to="/">Go back to Peymynt</NavLink></span>
        </div>
    </header>
)