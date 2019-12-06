import React, { Component } from 'react'
import { Alert, Button, Table } from 'reactstrap';

export default class CsvPreview extends Component {
  render() {
    const { headings, columns } = this.props;
    console.log(columns);
    return (
      <div>
        <Alert color="secondry" className="csvPreviewAlert mrB20">
                    <span style={{ fontSize: '25px' }}>
                        <strong><i className="pe-7s-info" />&nbsp;</strong>
                    </span>
          <span style={{ display: 'inline' }}>
                        <strong>
                            Showing {columns.length} of {columns.length} entries in the CSV.
                        </strong>
            &nbsp;Does your data look correct?
                    </span>
        </Alert>
        <div style={{ overflowX: 'auto' }}>
          <Table hover className="customerTable">
            <thead className="py-table__header">
            <tr className="py-table__row">
              {
                headings && headings.length > 0 &&
                headings.map((item, i) => {
                  return (
                    <th className="py-table__cell" nowrap key={i}>
                      <span className="text-800">{item}</span>
                    </th>
                  )
                })
              }
            </tr>
            </thead>
            <tbody>
            {
              columns && columns.length > 0 && columns.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item['Company Name'] || item['customerName']}</td>
                    <td>{item['First Name'] || item['firstName']}</td>
                    <td>{item['Last Name'] || item['lastName']}</td>
                    <td>{item['Email'] || item['email']}</td>
                    <td>{item['Phone'] || item['phone']}</td>
                    <td>{item['Address 1'] || item['address1']}</td>
                    <td>{item['Address 2']  || item['address2']}</td>
                    <td>{item['City'] || item['city']}</td>
                    <td>{item['Postal Code'] || item['postalCode']}</td>
                    <td>{item['Country'] || item['country']}</td>
                    <td>{item['Currency'] || item['currency']}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </Table>
        </div>
        <div className="mrT10">
          <Button
            className="btn btn-primary mr-2"
            onClick={this.props.onSubmit}
          >
            Yes, proceed with import
          </Button>

          <Button
            className="btn btn-outline-primary"
            onClick={this.props.onCancel}
          >
            No, try again
          </Button>
        </div>
      </div>
    )
  }
}
