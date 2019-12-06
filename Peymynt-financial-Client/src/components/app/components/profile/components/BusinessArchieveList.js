import React, { Component, Fragment } from 'react'
import { Table, Tooltip } from 'reactstrap';
import { RestoreConfirmation } from './RestoreConfirmation';

export default class BusinessArchieveList extends Component {
    render() {
        const { archiveList } = this.props
        return (
            <div>
                <Fragment>
                    <div className="py-heading--section-title">Archived Businesses</div>
                    <Table hover responsive className="table-business-list py-table mg-top-32">
                        <thead classNam="py-table__header">
                            <tr className="py-table__row">
                                <th className="py-table__cell" colSpan="8">Name</th>
                                <th className="py-table__cell__action text-right" colSpan="4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                archiveList.map((item, i) => {
                                    return (
                                    <tr key={i}>
                                        <td colSpan="8">{item.organizationName}</td>
                                        <td colSpan="4" className="PaymentRecords-tableColumn-102 payTableCol text-right">
                                            <a href="javascript:void(0)" className="py-text--link" onClick={() => this.props._setRestoreConfrm(item)}>Restore</a>
                                        </td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Fragment>
            </div>
        )
    }
}
