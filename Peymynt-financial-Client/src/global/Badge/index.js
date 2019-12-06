import React, { Component, Fragment, PureComponent } from 'react';
import { getStatusClassName } from '../../utils/common';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

class Badge extends PureComponent {
    
    render() {
        const { status } = this.props;
        const commonClasses = "badge";
        return (
            <Fragment>
                {
                    (status)? 
                    <span className={getStatusClassName(status, commonClasses)}>{status}</span> : ''
                }
            </Fragment>
        );
    }
}

export default Badge;