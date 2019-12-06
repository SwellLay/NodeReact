
import React, { PureComponent } from 'react'
import ProductForm from './ProductForm';
import { Card, CardBody } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


class AddProduct extends PureComponent {
    componentDidMount(){
        const { selectedBusiness, businessInfo } = this.props;
        console.log('businessInfo', businessInfo)
        document.title = selectedBusiness && selectedBusiness.organizationName ? `Peymynt - ${selectedBusiness.organizationName} - Add a Product or Service` : `Peymynt - Add a Product or Service`;
    }
    render() {
        return (
            <div className="content-wrapper__main__fixed productServicesWrapper">
                <header className="py-header--page">
                    <div className="py-header--title">
                        <h2 className="py-heading--title">Add a Product or Service  </h2>
                        <p className="py-text">Products and services that you buy from vendors are used as items on Bills to record those purchases, and the ones that you sell to customers are used as items on Invoices to record those sales. </p>
                    </div>
                </header>
                <div className="content">
                    <ProductForm isEditMode={false} {...this.props} />
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

export default withRouter((connect(mapStateToProps, null)(AddProduct)))

// export default AddProduct