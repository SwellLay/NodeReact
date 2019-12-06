import React, {PureComponent} from 'react'
import { Row, Col, Button, Form, FormGroup, Label, Input, Card, CardHeader, CardBody, CardFooter, CardTitle, CardText, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import CheckoutForm from './CheckoutForm'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as CheckoutActions from '../../../../../../actions/CheckoutActions';
import {Helmet} from 'react-helmet'

class EditCheckout extends PureComponent{
    constructor(){
        super()
        this.state = {
            dropdownOpen: false,
            isSaveDraft: false,
            isSaveOnline: false,
            selectedCheckout: null
        }
    
        this.isSaveDraft = this.isSaveDraft.bind(this);
        this.isSaveOnline = this.isSaveOnline.bind(this);
    }


    isSaveDraft =()=> {
        this.setState({
            isSaveDraft: !this.state.isSaveDraft
        })
    }
    
    isSaveOnline =()=> {
        this.setState({
            isSaveOnline: !this.state.isSaveOnline
        })
    }

    toggleDropdown =()=> {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
    }

    componentDidMount(){
        const { selectedBusiness } = this.props;
        this.fetchCheckoutData();
    }
    
    fetchCheckoutData=()=>{
        const checkoutId = this.props.match.params.id;
        this.props.actions.fetchCheckoutById(checkoutId).then(result => {
            this.setState({ checkoutData: result.payload });
        });
    }

    showPreview=()=>{
        () => history.push('/app/sales/checkouts/preview')
        history.push('/app/sales/checkouts');
    }

    render() {
        const { selectedBusiness } = this.props
        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Peymynt {selectedBusiness && !!selectedBusiness.organizationName && `- ${selectedBusiness.organizationName}`}</title>
                </Helmet>
                <CheckoutForm isEditMode={true} isSaveDraft={this.state.isSaveDraft} isSaveOnline={this.state.isSaveOnline} {...this.props} />
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
        selectedBusiness: state.businessReducer.selectedBusiness,
        selectedCheckout: state.checkoutReducer.selectedCheckout,
    };
};


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(EditCheckout)))

