import React, { Component, Fragment } from 'react'
import { Col } from 'reactstrap';
import MiniSidebar from 'global/MiniSidebar'
import * as BusinessAction from "../../../../../actions/businessAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import BusinessList from './BusinessList';
import ConfirmPrimary from './ConfirmPrimary';
import profilServices from '../../../../../api/profileService';
import BusinessService from '../../../../../api/businessService';
import { openGlobalSnackbar } from '../../../../../actions/snackBarAction';
import { Spinner } from 'react-bootstrap';
import BusinessArchieveList from './BusinessArchieveList';
import { RestoreConfirmation } from './RestoreConfirmation';

class Business extends Component {
    state={
        primary: false,
        primaryBusiness: '',
        loading: false,
        restoreConfirm: false,
        selectedRestore: null,
        archiveList: []
    }
    componentDidMount() {
        const { selectedBusiness } = this.props;
        this.fetchBusiness();
        this.fetchUser();
        this.fetchArchive();
        document.title = "Peymynt - Your Business"
    }

    fetchBusiness = async () => {
        await this.props.actions.fetchBusiness()
    }

    fetchArchive = async () => {
        const archive = await BusinessService.fetchArchiveBusiness()
        if(!!archive){
            this.setState({
                archiveList: archive.data.businesses ? archive.data.businesses : []
            })
        }
    }

    fetchUser = async () => {
        let id = localStorage.getItem('user.id')
        let response = (await profilServices.getUserById(id)).data.user;
        if(!!response){
            this.setState({primaryBusiness: response.primaryBusiness})
        }

    }

    _handleEdit = (e, id) => {
        e.preventDefault();
        this.props.history.push(`/app/${this.props.params.userId}/accounts/business/${id}/edit`)
        // this.setState({openEdit})
    }

    _handlePrimary = (e, business) => {
        e.preventDefault();
        this.setState({primary: true, business})
        // this.props.history.push(`/app/${this.props.params.userId}/accounts/business/${id}/primary`)
    }

    _setPrimary = async(e, id) => {
        e.preventDefault();
        this.setState({loading: true})
        let userId = this.props.params.userId
        if(!!id){

            let data = {
                userInput:{
                    primaryBusiness: id
                }
            }
            try{
                let response = await profilServices.updateUser(data, userId)
                console.log("response", response)
                if(response.statusCode === 200){
                    // localStorage.setItem('businessId', response.data.user.primaryBusiness)
                    this.setState({primary: false, primaryBusiness: response.data.user.primaryBusiness})
                    // this.fetchBusiness()
                    this.props.openGlobalSnackbar("Business set as primary.", false)
                    this.setState({loading: false})
                    window.location.reload()
                }else{
                    this.setState({loading: false})
                    this.props.openGlobalSnackbar("Something went wrong, please try again later.", true)
                }
            }catch(err){
                this.setState({loading: false})
                this.props.openGlobalSnackbar("Something went wrong, please try again later.", true)
                console.log("error in set primary ===> ", err)
            }
        }

    }

    _toggleRestoreConfrm = e => {
        this.setState({
            restoreConfirm: !this.state.restoreConfirm
        })
    }

    _setRestoreConfrm = (data, e) => {
        this._toggleRestoreConfrm();
        this.setState({
            selectedRestore: data
        })
    }

    _handleRestore = async e => {
        let restore = await BusinessService.restoreBusiness(this.state.selectedRestore.id);
        if(!!restore){
            if(restore.statusCode === 200){
                this.props.openGlobalSnackbar(restore.message, false)
                this._toggleRestoreConfrm();
                this.fetchBusiness();
                this.fetchArchive();
            }else{
                this.props.openGlobalSnackbar(restore.message, true)
            }
        }
    }

  render() {
    const { params, business, selectedBusiness, location } = this.props;
    const { selectedRestore, restoreConfirm, primary, archiveList } = this.state;
    console.log("business", this.props)
    let lists = [
        {name: 'Personal Information', link: `/app/${params.userId}/accounts`},
        {name: 'Emails & Connected Accounts', link: `/app/${params.userId}/accounts/email-connected`},
        {name: 'Password', link: `/app/${params.userId}/accounts/password`},
        {name: 'Email Notification', link: `/app/${params.userId}/accounts/email-notification`},
        {name: 'Businesses', link: `/app/${params.userId}/accounts/business`, className: 'active'}
    ]
    return (
      <div id="business-list-wrap" className="py-frame__page py-frame__settings has-sidebar">

            <MiniSidebar heading={'Profile'} listArray={lists}/>

            <div className="py-page__content">
            <div className="py-page__inner">
                <header className="py-header--page">
                    <div className="py-header--title">
                        <h2 className="py-heading--title">{restoreConfirm ? "Confirm" :"Business"}</h2>
                    </div>

                    <div className="ml-auto">
                        {
                            primary || restoreConfirm ?
                            ""
                            : (
                                <NavLink to={`${location.pathname}/add`}>
                                    <button className="btn btn-primary"> Create a Business</button>
                                </NavLink>
                            )
                        }
                    </div>
                </header>

                {
                    this.state.primary ?
                    (<ConfirmPrimary  {...this.props}
                        info={this.state.business}
                        _cancelPrimary={() => this.setState({primary: false})}
                        _setPrimary = {this._setPrimary.bind(this)}
                    />)
                    :this.state.loading ? (<Spinner color="primary" size="md" className="loader" />)
                    : restoreConfirm ? (
                    <RestoreConfirmation
                        selected={selectedRestore}
                        _toggleRestoreConfrm={this._toggleRestoreConfrm.bind(this)}
                        restore={this._handleRestore.bind(this)}
                    />) :(<Fragment>
                            <BusinessList list={business}
                                selected={selectedBusiness}
                                _handleEdit={this._handleEdit.bind(this)}
                                _handlePrimary={this._handlePrimary.bind(this)}
                                primary={this.state.primaryBusiness}
                                {...this.props}
                            />
                            {
                                archiveList.length > 0 && (
                                    <BusinessArchieveList
                                        _setRestoreConfrm={this._setRestoreConfrm.bind(this)}
                                        archiveList={archiveList}
                                    />
                                )
                            }
                        </Fragment>)
                }

            </div>
            </div>
        </div>
    )
  }
}

const mapStateToProps = state => {
    return {
        business: state.businessReducer.business,
        selectedBusiness: state.businessReducer.selectedBusiness,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(BusinessAction, dispatch),
        openGlobalSnackbar: (message, error) => {
            dispatch(openGlobalSnackbar(message, error));
        }
    };
};


export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Business)
);