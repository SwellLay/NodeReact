import MiniSidebar from 'global/MiniSidebar';
import { find } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setCountrytStates } from '../../../../../actions/CustomerActions';
import { updateUser } from '../../../../../actions/profileActions';
import { openGlobalSnackbar } from '../../../../../actions/snackBarAction';
import { fetchStatesByCountryId } from "../../../../../api/CustomerServices";
import { fetchCountries } from '../../../../../api/globalServices';
import profileServices from '../../../../../api/profileService';
import CloseAccount from './CloseAccount';
import EditProfileForm from './EditProfileForm';

class Profile extends Component {
    state = {
        userInput: {}
    };

    componentWillMount() {
        const { businessInfo } = this.props;
        document.title = "Peymynt - Your Profile";
        console.log("businessinfo", this.props);
        this._fetchFormData();
        this._fetchStates(businessInfo.country.id);
        this.setState({
            userInput: {
                ...this.state.userInput,
                address: {
                    ...this.state.userInput.address,
                    country: businessInfo.country,
                    state: this._fetchStates(businessInfo.country.id)
                }
            }
        })

    }

    _fetchFormData = async () => {
        const countries = (await fetchCountries()).countries;
        let userInput = (await profileServices.getUserById(this.props.params.userId)).data.user;
        console.log("response", userInput);
        this._fetchStates(userInput.address.country.id);
        this.setState({
            countries,
            userInput
        })
    };

    _fetchStates = async (id) => {
        const states = await fetchStatesByCountryId(id);
        console.log("states", states);
        this.setState({
            states: states.states
        });
        this.props.setCountrytStates(states);
        return parseInt(states.states[0])
    };

    _handleText = async (e) => {
        const { name, value } = e.target;
        if (name === 'state') {
            let setValue = this.mapWithStates(value);
            this.setState({
                userInput: {
                    ...this.state.userInput,
                    address: {
                        ...this.state.userInput.address,
                        [name]: setValue
                    }
                }
            })
        } else if (name === 'country') {
            let setValue = this.mapWithCountry(value);
            let states = await this._fetchStates(value);
            console.log("states", states);
            this.setState({
                userInput: {
                    ...this.state.userInput,
                    address: {
                        ...this.state.userInput.address,
                        [name]: setValue,
                        state: {}
                    }
                }
            })
        } else if (name === 'postal' || name === 'city') {
            this.setState({
                userInput: {
                    ...this.state.userInput,
                    address: {
                        ...this.state.userInput.address,
                        [name]: value
                    }
                }
            })
        } else if (name === 'dateOfBirth') {
            let date = new Date(value);
            date = moment(date).format('YYYY-MM-DD');
            this.setState({
                userInput: {
                    ...this.state.userInput,
                    [name]: date
                }
            })
        } else {
            this.setState({
                userInput: {
                    ...this.state.userInput,
                    [name]: value
                }
            })
        }
    };

    mapWithCountry = id => {
        let countries = this.state.countries;
        if (countries && countries.length > 0) {
            let countryObject = find(countries, { 'id': parseInt(id) });
            let countryObj = {
                name: countryObject.name,
                id: countryObject.id,
                sortname: countryObject.sortname ? countryObject.sortname : ''
            };
            return countryObj;
        }
        return {};
    };


    mapWithStates = (id, addressType) => {

        let countryStates = this.props.selectedCountryStates;
        if (countryStates && countryStates.length > 0) {
            let selectedState = countryStates.filter(item => {
                return item.id === id
            });
            let stateObject = selectedState[0];
            console.log("state", stateObject, selectedState);
            return stateObject;

        }
        return {};
    };

    _handleFormSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, dateOfBirth, address, _id } = this.state.userInput;
        if (!firstName) {
            this.props.openGlobalSnackbar("First name is required", true);
        } else if (!lastName) {
            this.props.openGlobalSnackbar("Last name is required", true);
        } else {

            let userInput = {
                firstName,
                lastName,
                dateOfBirth,
                address
            };
            let response;
            try {
                response = await this.props.updateUser({ userInput: userInput });
                if (!!response) {
                    this.props.openGlobalSnackbar("Customer updated successfully", false);
                } else {
                    this.props.openGlobalSnackbar(response.message, true);
                }
            } catch (error) {
                console.log('error===>', error);
                this.props.openGlobalSnackbar("Something went wrong, please try again later.", true);
            }
        }
    };

    render() {
        let { params } = this.props;
        let lists = [
            { name: 'Personal Information', link: `/app/${params.userId}/accounts`, className: "active" },
            { name: 'Emails & Connected Accounts', link: `/app/${params.userId}/accounts/email-connected` },
            { name: 'Password', link: `/app/${params.userId}/accounts/password` },
            { name: 'Email Notification', link: `/app/${params.userId}/accounts/email-notification` },
            { name: 'Businesses', link: `/app/${params.userId}/accounts/business` }
        ];
        const { states, countries, userInput } = this.state;
        return (
            <div className="py-frame__page has-sidebar">
                <MiniSidebar heading={'Profile'} listArray={lists} />
                <div className="py-page__content">
                    <div className="py-page__inner">
                        <div className="py-header--page">
                            <div className="py-header--title">
                                <h2 className="py-heading--title">Personal Information</h2>
                            </div>
                        </div>

                        <p className="py-text">
                            Provide as much or as little information as you’d like. Peymynt will never share or sell individual personal information or personally identifiable details.
                        </p>
                    
                        <EditProfileForm
                            handleText={this._handleText.bind(this)}
                            handleFormSubmission={this._handleFormSubmit.bind(this)}
                            states = {states}
                            countries={countries}
                            userInput={userInput}
                        />
                        <hr className="py-divider"/>
                        <CloseAccount/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    updateUser: state.updateUser,
    businessInfo: state.businessReducer.selectedBusiness,
    selectedCustomer: state.customerReducer.selectedCustomer,
    selectedCountryStates: state.customerReducer.selectedCountryStates,
});

export default withRouter((connect(mapStateToProps, { updateUser, setCountrytStates, openGlobalSnackbar })(Profile)));

