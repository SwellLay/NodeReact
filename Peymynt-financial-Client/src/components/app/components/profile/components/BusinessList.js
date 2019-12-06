import React, { Component } from 'react'
import { Table, Tooltip } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default class BusinessList extends Component {
    state ={
        tooltipOpen: false
    }

    toggle() {
        this.setState({
          tooltipOpen: !this.state.tooltipOpen
        });
    }
  render() {
    const { list, _handlePrimary, _handleEdit, params, primary } = this.props;
    return (
        <Table hover responsive className="table-business-list py-table mg-top-32">
            <thead classNam="py-table__header">
                <tr className="py-table__row">
                    <th className="py-table__cell" colSpan="4">Name</th>
                    <th className="py-table__cell" colSpan="4"></th>
                    <th className="py-table__cell__action" colSpan="4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    !!list && list.length > 0 ?
                        list.map((item, i) => {
                            return (
                                <tr key={i}>
                                    <td colSpan="4"><NavLink className="py-text--strong py-text--link-dark" to={`/app/${params.userId}/accounts/business/${item._id}/edit`}>{item.organizationName}</NavLink></td>
                                    <td colSpan="4" className="PaymentRecords-tableColumn-102 payTableCol">
                                        {item.isPrimary ?
                                            (<div className="statusSuccess">Default</div>)
                                         : ""}
                                    </td>
                                    <td className="py-table__cell__action" colSpan="1">
                                        <div className="py-table__cell__action__icons">

                                        <span className="py-icon" id={'Tooltip-' + i}
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            className="py-table__action py-icon"
                                            title="Set as primary business!"
                                            onClick={e => _handlePrimary(e, item)}
                                        >
                                            {
                                                item.isPrimary ? "" : (
                                                <svg viewBox="0 0 20 20" className="py-svg-icon" id="star" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.636L8.206 7.229a.817.817 0 0 1-.616.442l-4.013.58 2.903 2.796a.803.803 0 0 1 .236.716L6.03 15.71l3.588-1.865a.827.827 0 0 1 .762 0l3.588 1.865-.685-3.948a.803.803 0 0 1 .236-.716l2.903-2.796-4.013-.58a.817.817 0 0 1-.616-.442L10 3.636zM6.929 6.132l2.337-4.681a.822.822 0 0 1 1.468 0l2.337 4.681 5.228.756c.671.096.938.911.453 1.379l-3.782 3.641.892 5.145c.115.66-.587 1.164-1.187.852L10 15.475l-4.675 2.43c-.6.312-1.302-.192-1.187-.852l.892-5.145-3.782-3.641a.806.806 0 0 1 .453-1.38l5.228-.755z"></path></svg>
                                                    )
                                            }
                                        </span>
                                        <span className="py-icon"
                                            data-toggle="tooltip" data-placement="top"
                                            title="Edit"
                                            className="py-table__action py-icon"
                                            onClick={e => _handleEdit(e, item._id)}
                                        >
                                            <svg viewBox="0 0 20 20" className="py-svg-icon" id="edit" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 13.836L16.586 6 14 3.414 6.164 11.25l2.586 2.586zm-1.528 1.3l-2.358-2.358-.59 2.947 2.948-.59zm11.485-8.429l-10 10a1 1 0 0 1-.51.274l-5 1a1 1 0 0 1-1.178-1.177l1-5a1 1 0 0 1 .274-.511l10-10a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414z"></path></svg>
                                        </span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    : ""
                }
            </tbody>
        </Table>
    )
  }
}
