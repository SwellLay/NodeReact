import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom';
export default class MethodPopup extends Component {
    render() {
        const { modeCard, modeBank } = this.props
        return (
            <Fragment>
                <button className="py-popup-close" onClick={this.props.toggle}>
                <i className="fa fa-close"/></button>
                <div className="py-popup-content-wrapper">
                    <h6>Allow my customer to pay this invoice via:</h6>
                    <div className="payOpt">
                        <div className="row">
                            <div className="toggle-handle">
                                <div className="switch">
                                    <input type="checkbox"
                                        id="card"
                                        name={"modeCard"}
                                        checked={modeCard}
                                        onChange={(e) => this.props.handleChange(e)}
                                    />
                                    <label htmlFor="card"><span className="round-btn"></span></label>
                                </div>
                                <span className="txt">Credit Card</span>
                            </div>
                            <div className="cards">
                                <span className="card visa"></span>
                                <span className="card master"></span>
                                <span className="card american"></span>
                                <span className="card discover"></span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="toggle-handle">
                                <div className="switch">
                                    <input
                                        type="checkbox"
                                        id="bank"
                                        name={"modeBank"}
                                        checked={modeBank}
                                        onChange={(e) => this.props.handleChange(e)}
                                    />
                                    <label htmlFor="bank"><span className="round-btn"></span></label>
                                </div>
                                <span className="txt">Bank Payment (ACH)</span>
                            </div>
                            <div className="py-icons cards">
                                <span className="py-icon bankofamerica card"></span>
                                <span className="py-icon chase card"></span>
                                <span className="py-icon wellsfargo card"></span>
                                <p className="note">and 2,400+ others</p>
                            </div>
                        </div>
                    </div>
                    <div className="changePref">
                        <span>Want to change payment options on future invoices?</span>
                        <NavLink to="/app/setting/payments">Change your preferences.</NavLink>
                    </div>
                </div>
            </Fragment>
        )
    }
}
