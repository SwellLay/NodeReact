
import React, { PureComponent } from 'react'
import CheckoutPreviewForm from './CheckoutPreviewForm';
import { Spinner, Container } from 'reactstrap';
import checkoutServices from '../../../../../../api/CheckoutService'
import * as CheckoutActions from '../../../../../../actions/CheckoutActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { openGlobalSnackbar } from '../../../../../../actions/snackBarAction';
import { Snackbar } from '@material-ui/core';
import SnakeBar from '../../../../../../global/SnakeBar';

class PublicCheckout extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            selectedCheckout: null,
            isLoadingData: true
        };
    }

    toggleDropdown =()=> {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    componentDidMount(){
        const { selectedCheckout } = this.state;
        const { selectedBusiness } = (selectedCheckout && selectedCheckout.business)? selectedCheckout.business : {};

        let { uuid } = this.props.match.params;
        this.fetchCheckoutData(uuid);
    }

    fetchCheckoutData = async (uuid)=>{
        if(uuid){
            this.setState({ isLoadingData: true });
            const response = await this.props.actions.fetchCheckoutByUUID(uuid)
            if(response){
                this.setState({ selectedCheckout: response.payload.checkout });
            }
            this.setState({ isLoadingData: false });
            console.log('****************selectedCheckout => ', this.state.selectedCheckout);
        }
    }

    render() {
        const { selectedCheckout, isLoadingData } = this.state;
        return (
            <div className={(isLoadingData) ? "back-white" : "back-white accent-bar"}>
                <SnakeBar isAuth={false}/>
                {
                    isLoadingData ?
                    <div className="mrT50 text-center">
                        <h3>Loading public checkout...</h3>
                        <Spinner color="primary" size="md" className="loader" />
                    </div> :
                    <div className="">
                        <CheckoutPreviewForm hidden={selectedCheckout == null} publicCheckout={selectedCheckout} isPublic={true} isEditMode={false} {...this.props} />
                    </div>
                }

            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CheckoutActions, dispatch),
        openGlobalSnackbar: bindActionCreators(openGlobalSnackbar, dispatch)
    };
}

const mapStateToProps = state => {
    return {
        selectedBusiness: state.businessReducer.selectedBusiness
    };
};

export default withRouter((connect(mapStateToProps, mapDispatchToProps)(PublicCheckout)))

// const mapStateToProps = state => {
//     return {
//         selectedBusiness: state.businessReducer.selectedBusiness
//     };
// };

// export default withRouter((connect(mapStateToProps, null)(PublicCheckout)))
