
import React, { PureComponent } from 'react'
import CheckoutForm from './CheckoutForm';
import { Button, Col, Row, Card, CardHeader, CardBody, CardFooter, CardTitle, CardText, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import history from 'customHistory';
import { _documentTitle } from '../../../../../../utils/GlobalFunctions';

class AddCheckout extends PureComponent {
    constructor() {
        super()
        this.state = {
            dropdownOpen: false,
            isSaveDraft: false,
            isSaveOnline: false,
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
        _documentTitle(selectedBusiness, "")
    }

    render() {
        return (
                <CheckoutForm isEditMode={false} isSaveDraft={this.state.isSaveDraft} isSaveOnline={this.state.isSaveOnline} {...this.props} />
        )
    }
}
const mapStateToProps = state => {
    return {
        selectedBusiness: state.businessReducer.selectedBusiness
    };
};

export default withRouter((connect(mapStateToProps, null)(AddCheckout)))