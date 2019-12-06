import React, { Fragment } from 'react';

export const NoDataMessage = ({title, add, filter, secondryMessage}) => {
    return(
        <Fragment>
            <div className="text-center">
                {!filter ? (
                    <Fragment>
                        <div className="py-heading--section-title">
                            You haven't created any {title}s yet.
                        </div>
                        <p>{secondryMessage}</p>
                        <button
                            onClick={add}
                            className="btn-outline-primary btn btn-secondary"
                            >
                            Create a new {title}
                        </button>
                    </Fragment>)
                : (
                    <Fragment>
                        <i className="fa fa-search mt-5 color-muted" style={{fontSize: '40px'}}/>
                        <div className="py-heading--section-title">
                            No {title}s found for your current filters.
                        </div>
                        <p className="lead">Verify your filters and try again.</p>
                    </Fragment>)
                }
            </div>
        </Fragment>
    )
}