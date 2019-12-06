
import React, { PureComponent } from 'react'
import ProductForm from './ProductForm';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import ProductServices from '../../../../../../api/ProductService';
import * as ProductActions from '../../../../.././../actions/productAction'
import { Card, CardBody } from 'reactstrap';

class EditProduct extends PureComponent {

    componentDidMount() {
        const { selectedBusiness, businessInfo } = this.props;
        console.log('businessInfo', selectedBusiness)
        document.title = selectedBusiness && selectedBusiness.organizationName ? `Peymynt - ${selectedBusiness.organizationName} - Edit a Product or Service` : `Peymynt - Edit a Product or Service`;
        this.fetchProductData()
    }

    fetchProductData() {
        const productId = this.props.match.params.id
        this.props.actions.fetchProductById(productId)
    }

    render() {
        return (
            <div className="content-wrapper__main__fixed productServicesWrapper">
                <header className="py-header--page">
                    <div className="py-header--title">
                        <h2 className="py-heading--title">Edit a Product or Service  </h2>
                        <p className="py-text">Products and services that you buy from vendors are used as items on Bills to record those purchases, and the ones that you sell to customers are used as items on Invoices to record those sales. </p>
                    </div>
                </header>
                
                
                <div className="content">
                    <div className="shadow-box card-wizard">
                        <div>
                            <ProductForm isEditMode={true} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ProductActions, dispatch)
    };
}
const mapStateToProps = state => {
    return {
        selectedBusiness: state.businessReducer.selectedBusiness
    };
};

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(EditProduct)))