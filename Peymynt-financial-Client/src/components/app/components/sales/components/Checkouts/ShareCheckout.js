
import React, { PureComponent } from 'react'
import CheckoutPreviewForm from './CheckoutPreviewForm';
import { Button, Col, Row, Card, CardHeader, CardBody, CardFooter, CardTitle, CardText, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Spinner, Container, Alert } from 'reactstrap';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as CheckoutActions from '../../../../../../actions/CheckoutActions';
import { getShareLink, getEncryptedString, getDecryptedString, getCheckoutShareBaseURL} from '../../../../../../utils/common';
import { openGlobalSnackbar } from '../../../../../../actions/snackBarAction';
import Badge from '../../../../../../global/Badge';
import history from 'customHistory';
import { updateCheckoutById } from "../../../../../../api/CheckoutService";

const getTaxes = (taxes) => {
    let _taxes = [];
    if(taxes){
        taxes.forEach((tax) => {
            if(typeof tax == 'string'){
                _taxes.push(tax);
            } else {
                _taxes.push(tax.id);
            }
        });
    }
    return _taxes;
}

const getCheckout = (checkout) => {
    let data = {
        userId: checkout && checkout.userId || localStorage.getItem('user.id'),
        businessId: checkout && checkout.businessId || localStorage.getItem('businessId'),
        itemName: checkout && checkout.itemName || '',
        message: checkout && checkout.message || "",
        price: checkout && checkout.price || 0.00,
        total: checkout && checkout.total || 0,
        fields: checkout ? checkout.fields : { phone: false, address: false, email: true },
        status: checkout && checkout.status || '',
        taxes: checkout && getTaxes(checkout.taxes) || []
    }
    return data
}

class ShareCheckout extends PureComponent {
    constructor() {
        super()
        this.state = {
            dropdownOpen: false,
            selectedCheckout: {},
            isLoadingData: true,
            shareLink: "",
            isTextCopied: false
        };
    }

    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    componentDidMount() {
        const { selectedBusiness } = this.props;
        document.title = selectedBusiness && selectedBusiness.organizationName ? `Peymynt - ${selectedBusiness.organizationName} - Checkout detail` : `Peymynt - Checkout detail`;
        const checkoutId = this.props.match.params.id;
        this.setState({
            shareLink: getShareLink(checkoutId)
        });
        this.fetchCheckoutData();
    }

    fetchCheckoutData = () => {
        const checkoutId = this.props.match.params.id;
        const uuid = this.props.match.params.uuid;
        if(checkoutId){
            this.props.actions.fetchCheckoutById(checkoutId).then(result => {
                if (result) {
                    this.setState({ selectedCheckout: result.selectedCheckout, isLoadingData: false });
                } else {
                    this.redirectToCheckouts();
                }
            });
        } else if(uuid){
                this.props.actions.fetchCheckoutByUUID(checkoutId).then(result => {
                    if (result) {
                        this.setState({ selectedCheckout: result.selectedCheckout, isLoadingData: false });
                    } else {
                        this.redirectToCheckouts();
                    }
                });
        } else {
            this.redirectToCheckouts();
        }
    }

    saveCheckout = async() => {
        let selectedCheckout = getCheckout(this.state.selectedCheckout);
        let _checkoutId = this.state.selectedCheckout._id;
        selectedCheckout['status'] = 'Online';
        let _data = {
            checkoutInput: selectedCheckout
        }
        console.log(' selectedCheckout', selectedCheckout);
        if(!selectedCheckout['itemName'] || !selectedCheckout['price']){
            this.props.showSnackbar("Please enter service name and price.", true);
            this.state.checkoutModel.status = '';
        } else {
            try {
                let _price = parseFloat(_data.checkoutInput.price).toFixed(2);
                delete _data.checkoutInput.total; 
                delete _data.checkoutInput.price; 
                _data.checkoutInput['currency']=this.props.selectedBusiness.currency;
                _data.checkoutInput['price'] = parseFloat(_price); 
                console.log(' _data.checkoutInput ', (_data.checkoutInput));
                await updateCheckoutById(_checkoutId, _data)
                this.props.showSnackbar("Checkout updated successfully", false);
                this.fetchCheckoutData();
            } catch (error) {
                this.props.showSnackbar(error.message, true)
            }
        }
    }

    getShareLink(){
        return (this.state.selectedCheckout && this.state.selectedCheckout.uuid)? getCheckoutShareBaseURL() + this.state.selectedCheckout.uuid : '';
    }

    copyText = () => {
        this.refs.input.select();
        document.execCommand('copy');
        this.setState({
            isTextCopied: true
        });
        setTimeout(() => {
            this.setState({
                isTextCopied: false
            });
        }, 2000);
        return false;
    }

    redirectToCheckouts(){
        history.push('/app/sales/checkouts');
    }

    render() {
        const { text, isTextCopied, isLoadingData } = this.state;
        console.log(' selectedCheckout ', this.state.selectedCheckout);
        return (
            <div className="checkoutWrapper">
                    {
                        isLoadingData ?
                        <Container className="mrT50 text-center">
                            <Spinner color="primary" size="md" className="loader" />
                        </Container> : 
                        <div className="content-wrapper__main__fixed">

                            <div className="checkouts-share__header">
                            <header className="py-header--page">
                                {
                                    (this.state.selectedCheckout._id)?
                                    <div className="py-header--title">
                                            <h4 className="py-heading--title"> <strong> {this.state.selectedCheckout.itemName} </strong> </h4>
                                            {
                                                (this.state.selectedCheckout)?
                                                <Badge status={this.state.selectedCheckout.status} /> : ''
                                            }
                                            
                                    </div>  : ''
                                }

                                    <div className="py-header--actions">
                                            <Button onClick={() => history.push('/app/sales/checkouts/edit/' + this.state.selectedCheckout._id)} className="btn btn-outline-primary">Edit</Button>
                                            {
                                                (this.state.selectedCheckout && this.state.selectedCheckout.status == "Offline")?
                                                <Button onClick={this.saveCheckout} color="primary" className="btn btn-primary">Turn On</Button>
                                                :
                                                <Button onClick={() => history.push('/app/sales/checkouts/add')} className="btn btn-outline-primary">Create another checkout</Button>
                                            }
                                        </div>
                            </header>
                            </div>
                            <div className="checkouts-share__body">
                                {
                                    (this.state.selectedCheckout && this.state.selectedCheckout.status == "Offline")?
                                    <div className="py-notify py-notify--warning">
                                        <div className="py-notify__icon-holder">
                                        <svg viewBox="0 0 20 20" className="py-icon" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
                                        </div>
                                        <div className="py-notify__content-wrapper">
                                            <div className="py-notify__content">
                                            This checkout is turned off. Turn on this checkout to receive payments.
                                            </div>
                                        </div>
                                    </div> : ''
                                }
                                
                                <div className="py-box py-box--card">
                                    <div className="py-box--header">
                                    <h5 className="h4">Share a direct link</h5>
                                        <p className="py-text m-0">Copy this link and share it with your customers to get paid instantly.</p>
                                    </div>
                                    <div className="py-box--content">
                                                <span id="shareLink" className="py-text--link-share">{this.getShareLink()}</span>

                                                <Button onClick={ this.copyText } className="btn-primary" disabled={isTextCopied == true}>
                                                    { text }
                                                    <input
                                                        ref="input"
                                                        type="text"
                                                        defaultValue={ this.getShareLink() }
                                                        style={{ position: 'fixed', top: '-1000px' }} />
                                                        {(isTextCopied == false)? 'Copy to clipboard' : 'Copied'}
                                                </Button>

                                            <div className="py-divider"></div>
                                            
                                            <div className="checkouts-share__helpful-links">
                                                <h5 className="py-heading--section-title mt-0">Link from your website</h5>
                                                <p className="py-text checkouts-share__subtitle">Read our guide on how to embed your checkout on your website.</p>

                                                <div className="checkouts-share__help-article-container">
                                                    <div className="checkouts-share__help-article">
                                                        <img src="../../../../assets/images/wordpress.PNG" className="logo img-fluid pull-left mrR15" alt="" />
                                                        <div>
                                                           <strong>Wordpress</strong>
                                                            {/* <a className="py-text--link-external d-block" href="https://support.waveapps.com/hc/en-us/articles/115005498066" target="blank">Read more
                                                            </a> */}
                                                        </div> 
                                                    </div>

                                                    <div className="checkouts-share__help-article">
                                                    <img src="../../../../assets/images/wix.PNG" className="logo img-fluid pull-left mrR15" alt="" />
                                                    <div>
                                                        <strong>Wix</strong>
                                                        {/* <a className="py-text--link-external d-block" href="https://support.waveapps.com/hc/en-us/articles/115005498086" target="blank">Read more
                                                        </a> */}
                                                    </div>
                                                    </div>

                                                    <div className="checkouts-share__help-article">
                                                    <img src="../../../../assets/images/squarespace.PNG" className="logo img-fluid pull-left mrR15" alt="" />
                                                    <div>
                                                        <strong>Squarespace</strong>
                                                        {/* <a className="py-text--link-external d-block" href="https://support.waveapps.com/hc/en-us/articles/115005498106" target="blank">Read more
                                                        </a> */}
                                                    </div>
                                                </div>
                                                </div>
                                            </div>  
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CheckoutActions, dispatch),
        showSnackbar: (message, error) => {
            dispatch(openGlobalSnackbar(message, error))
        }
    };
}
const mapStateToProps = state => {
    return {
        selectedBusiness: state.businessReducer.selectedBusiness,
        selectedCheckout: state.checkoutReducer.selectedCheckout,
    };
};


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(ShareCheckout)))