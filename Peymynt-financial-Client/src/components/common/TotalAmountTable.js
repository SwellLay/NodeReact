import React, { Component, Fragment } from 'react'
import { toMoney } from '../../utils/GlobalFunctions';

export default class TotalAmountTable extends Component {
    render() {
        const { invoiceItems, className, sign } = this.props;
        return (
            <div className="amountTable-wrapper">
                <table className={`amountTable-table ${className}`}>
                    <tr>
                        <td><b>Subtotal:</b></td>
                        <td width="125">col2:</td>
                    </tr>
                    {
                        invoiceItems.amountBreakup.taxTotal.map((tax, index) => {
                            return (
                                <Fragment key={`taxtotal${index}`}>
                                    <tr>
                                        <td>{typeof (tax.taxName) === 'object' ?
                                            `${tax.taxName.abbreviation} ${tax.rate}% ${tax.taxName.other.showTaxNumber ? `(${tax.taxName.taxNumber}):`: ':'}`
                                            : `${tax.taxName} ${tax.rate}%`
                                        }</td>
                                        <td>{`${sign}${toMoney(tax.amount)}`}</td>
                                    </tr>
                                </Fragment>
                            )
                        })
                    }

                    <tr>
                        <td>col1:</td>
                        <td>col2:</td>
                    </tr>

                </table>
            </div>
        )
    }
}