import React, { Component } from 'react'
import { Spinner } from 'reactstrap';

export default class CenterSpinner extends Component {
    render() {
        return (
            <div className="spinner-wrapper">
                <Spinner  color="primary" size={"md"} className="loader"/>
            </div>
        )
    }
}
