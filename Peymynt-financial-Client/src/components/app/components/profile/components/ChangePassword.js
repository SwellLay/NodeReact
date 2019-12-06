import React, { Component } from 'react'
import { Col, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import MiniSidebar from 'global/MiniSidebar';
import { openGlobalSnackbar } from '../../../../../actions/snackBarAction';
import { changePass } from '../../../../../actions/profileActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ChangePassword extends Component {
    state= {
        currentPassword: '',
        newPassword: '',
        confNewPassword: '',
        inputType: true,
        passWordError: 'At least 6 characters, but longer is better.',
        confError: 'Password must match with New Password'
    }

    componentDidMount(){
        document.title = "Peymynt - Change Password";
    }

    _handleText(e){
        const { name, value } = e.target;
        this.setState({[name]: value});
    }

    _showPass(e){
        this.setState({inputType: !this.state.inputType})
    }

    _handleForm = async(e) => {
        e.preventDefault();
        const { newPassword, confNewPassword, currentPassword } = this.state;
        if(newPassword.length >= 6){
            this.setState({disabled: false, passWord: false})
            if(newPassword === confNewPassword){
                this.setState({disabled: false, confError: "", confPassword: false})
                let response = await this.props.changePass({newPassword, currentPassword})
                console.log('response', response)
                this.props.openGlobalSnackbar("Password changed successfully!", false);
            }else{
                this.setState({disabled: true, confPassword: true, confError: "Password Should match with New Password"})
            }
        }else{
            this.setState({passWordError: "Uh oh, this password isn't strong enough.", disabled: true, passWord: true})
            if(newPassword === confNewPassword){
                this.setState({disabled: false, confError: "", confPassword: false})
                // let response = await this.props.changePass({newPassword, currentPassword})
                console.log('response', response)
                this.props.openGlobalSnackbar("Your password has been successfully changed.", false);
            }else{
                this.setState({disabled: true, confPassword: true, confError: "Password Should match with New Password"})
            }
        }
    }

  render() {
    const { params } = this.props;
    const { oldPassword, newPassword, confNewPassword, inputType, passWordError, passWord, confPassword, confError } = this.state;
    let lists = [
        {name: 'Personal Information', link: `/app/${params.userId}/accounts`},
        {name: 'Emails & Connected Accounts', link: `/app/${params.userId}/accounts/email-connected`},
        {name: 'Password', link: `/app/${params.userId}/accounts/password`, className: "active"},
        {name: 'Email Notification', link: `/app/${params.userId}/accounts/email-notification`},
        {name: 'Businesses', link: `/app/${params.userId}/accounts/business`}
    ]
    return (
        <div className="py-frame__page py-frame__settings has-sidebar">
            <MiniSidebar heading={'Profile'} listArray={lists}/>

            <div className="py-page__content">
                <div className="py-page__inner">
                    <div className="py-header--page">
                        <div className="py-header--title">
                    <h2 className="py-heading--title">Change Your Password</h2>
                    </div>
                    </div>
                    <Form className="py-form-field--condensed" onSubmit={this._handleForm.bind(this)}>
                        <div className="py-form-field py-form-field--inline">
                            <Label for="oldPassword" className="py-form-field__label is-required">Old Password </Label>
                            <div className="py-form-field__element">
                                <Input required type="password"
                                    value={oldPassword}
                                    type="password"
                                    required
                                    name="currentPassword"
                                    placeholder="Password"
                                    minLength="6"
                                    onChange={this._handleText.bind(this)} />
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                            <Label for="newPassword" className="py-form-field__label is-required">New Password </Label>
                            <div className="py-form-field__element">
                                <Input required type={inputType ? 'password': "text"}
                                    value={newPassword} required
                                    name="newPassword"
                                    placeholder="Password"
                                    className={passWord ? "color-red err" : "muted"}
                                    minLength="6"
                                    onChange={this._handleText.bind(this)} id="newPass" />
                                    <div className={passWord ? "text-danger" : "d-flex justify-content-between py-text--small w-100"}>
                                        <span className="py-text--hint">{passWordError}</span>
                                        <a className="text-right py-text--link" onClick={this._showPass.bind(this)}>
                                            <b>{inputType ? 'Show' : 'Hide'}</b>
                                        </a>
                                    </div>
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                            <Label for="newPassword" className="py-form-field__label is-required">Confirm New Password</Label>
                            <div className="py-form-field__element">
                                <Input required type="password"
                                    value={confNewPassword} required
                                    name="confNewPassword"
                                    placeholder="Password"
                                    type="password"
                                    className={confPassword ? "color-red err" : "muted"}
                                    minLength="6"
                                    onChange={this._handleText.bind(this)} />
                                    {
                                        !!confError ?
                                        (<FormText className={confPassword ? "color-red err" : "muted"}>
                                            {confError}.
                                        </FormText>)
                                        : ""
                                    }
                            </div>
                        </div>
                        <div className="py-form-field py-form-field--inline">
                            <div className="py-form-field__label"></div>
                            <div className="py-form-field__element">
                                    <button className="btn btn-primary"> Save</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    changePassword: state.changePass
})

export default withRouter((connect(mapStateToProps, { changePass, openGlobalSnackbar })(ChangePassword)))