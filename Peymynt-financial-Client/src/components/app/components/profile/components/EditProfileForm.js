import React, { Component } from 'react'
import { Form, FormGroup, Label, Col, Input } from 'reactstrap';
import moment from 'moment';
import DatepickerWrapper from "utils/formWrapper/DatepickerWrapper";
import { _documentTitle } from '../../../../../utils/GlobalFunctions';


export default class EditProfileForm extends Component {
    componentDidMount(){
        _documentTitle({}, "Your Profile")
    }


  render() {
    const { handleText, countries, states, userInput, handleFormSubmission } = this.props;
    console.log("edit", this.props)
    return (
            <Form className="py-form-field--condensed" onSubmit={e => handleFormSubmission(e)}>
                <div className="py-form-field py-form-field--inline">
                    <Label for="firstName" className="py-form-field__label">First Name  <span className="text-danger">*</span></Label>
                    <div className="py-form-field__element">
                        <Input type="text"
                            value={userInput.firstName}
                            name="firstName"
                            onChange={(e) => handleText(e)} />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label for="lastName" className="py-form-field__label">Last Name <span className="text-danger">*</span></Label>
                    <div className="py-form-field__element">
                        <Input type="text"
                            value={userInput.lastName}
                            name="lastName"
                            onChange={(e) => handleText(e)} />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label for="country" className="py-form-field__label">Country  <span className="text-danger">*</span></Label>
                    <div className="py-form-field__element">
                        <div className="py-select--native">
                        <Input
                            type="select"
                            name="country"
                            className="py-form__element"
                            value={!!userInput.address ? userInput.address.country.id : ""}
                            onChange={(e) => handleText(e)}
                            >
                            <option key={-1} value={""}>
                                {"Select Country"}
                            </option>
                            {setCountries(countries)}
                        </Input>
                        </div>
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">

                    <Label
                        for="state"
                        className="py-form-field__label"
                    >
                        Province/State
                    </Label>
                    <div className="py-form-field__element">
                         <div className="py-select--native">
                            <Input
                            type="select"
                            required
                            className="py-form__element"
                            name="state"
                            value={!!userInput.address ? parseInt(userInput.address.state.id) : ""}
                            onChange={(e) => handleText(e)}
                            >
                            <option key={-2} value={""}>
                                {"Select State"}
                            </option>
                            {setCountryStates(states)}
                            </Input>
                        </div>
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label for="lastName" className="py-form-field__label">City </Label>
                    <div className="py-form-field__element">
                        <Input type="text"
                            value={!!userInput.address ? userInput.address.city : ""}
                            name="city"
                            onChange={(e) => handleText(e)} />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label for="firstName" className="py-form-field__label">Postal/Zip Code </Label>
                    <div className="py-form-field__element">
                        <Input type="text"
                            value={!!userInput.address ? userInput.address.postal : ""}
                            name="postal"
                            onChange={(e) => handleText(e)} />
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <Label for="firstName" className="py-form-field__label">Date Of Birth </Label>
                    <div className="py-form-field__element">
                        <DatepickerWrapper
                         
                          selected={!!userInput.dateOfBirth ? userInput.dateOfBirth : ''}
                          onChange={date =>
                            handleText({target:{value:date, name: 'dateOfBirth'}})
                          }
                          onSelect={date =>
                            handleText({target:{value:date, name: 'dateOfBirth'}})
                        } 
                          className="form-control"
                        />
                        {/* <Input type="date"
                            format="YYYY-MM-DD"
                            separator="-"
                            value={!!userInput.dateOfBirth ? moment(userInput.dateOfBirth).format('YYYY-MM-DD') : ''}
                            name="dateOfBirth"
                            placeholder="yyyy-mm-dd"
                            onChange={(e) => handleText(e)} /> */}
                    </div>
                </div>
                <div className="py-form-field py-form-field--inline">
                    <div className="py-form-field__label">
                    </div>

                    <div className="py-form-field__element">
                    <div  className="btnSave">
                        <button className="btn btn-primary"> Save</button>
                    </div>
                    </div>
                </div>
            </Form>
    )
  }
}

    const setCountries = countries => {
        return countries && countries.length ? (
        countries.map((item, i) => {
            return (
            <option key={i} value={item.id}>
                {" "}
                {item.name}
            </option>
            );
        })
        ) : (
        <option key={-1} value={0}>
            {" "}
            {"None"}
        </option>
        );
    };

    const setCountryStates = countryStates => {
        return countryStates && countryStates.length ? (
        countryStates.map((item, i) => {
            return (
            <option key={i} value={item.id}>
                {item.name}
            </option>
            );
        })
        ) : (
        <option key={-1} value={0} disabled>
            {"None"}
        </option>
        );
    };
