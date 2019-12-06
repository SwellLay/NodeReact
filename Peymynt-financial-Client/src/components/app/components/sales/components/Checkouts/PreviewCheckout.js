
import React, { PureComponent } from 'react'
import CheckoutPreviewForm from './CheckoutPreviewForm';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CheckoutActions from '../../../../../../actions/CheckoutActions';
import { bindActionCreators } from 'redux'

class PreviewCheckout extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false
        };
        
    }

    toggleDropdown =()=> {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    // componentDidMount(){
    //     const { selectedBusiness } = this.props;
    // }
    
    render() {
        const checkoutDetails = this.props.location.state.detail;
        console.log("this.props",this.props);
        return (
            <div className="checkoutWrapper">
                <CheckoutPreviewForm isPublic={false} isEditMode={true} {...this.props} />
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CheckoutActions, dispatch)
    };
}

const mapStateToProps = state => {
    return {
        selectedBusiness: state.businessReducer.selectedBusiness
    };
};

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(PreviewCheckout)))
