import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Card, CardBody } from 'reactstrap';

import CustomerForm from './CustomerForm'

class AddCustomer extends PureComponent {

    componentDidMount() {
        const { selectedBusiness, businessInfo } = this.props;
      document.title = selectedBusiness && selectedBusiness.organizationName ? `Peymynt - ${selectedBusiness.organizationName} - Add a customer` : `Peymynt - Add a customer`;
    }
    render() {
        return (
            <div className="content-wrapper__main__fixed">
                <header className="py-header--page">
                    <div className="content">
                        <h2 className="mb-0 py-text--strong">Add a customer</h2>
                    </div>
                </header>
                <div className="content">
                    <Card className="shadow-box card-wizard">
                        <CardBody>
                            <CustomerForm isEditMode={false} {...this.props} />
                        </CardBody>
                    </Card>
                </div>
            </div>

        )
    }
}
const mapStateToProps = state => {
    return {
        selectedBusiness: state.businessReducer.selectedBusiness
    };
};

export default withRouter((connect(mapStateToProps, null)(AddCustomer)))


// export default AddCustomer
