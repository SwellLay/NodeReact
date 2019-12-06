import React from 'react';

export const Message = props => {
    return (
        <div className={`inner-alert step-msg message ${props.className}`}>
            <span className="symbol">! </span>
            <span className="text">{props.text}</span>
        </div>
    )
}

export const ValidationMessages = ({title, messages, className, id, autoFocus}) => (
    <div className={`w-100 ${className}`} id={id} autoFocus={autoFocus}>
        <div className="w-100 alert alert-danger" role="alert">
            <div className="">
            <div className="py-text--strong d-flex mb-3 align-items-center">
            <svg classNamew="py-icon mr-2" viewBox="0 0 20 20" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>            
            {title}</div>
            <ul>
                {
                    messages && messages.length > 0 && messages.map(({heading, message}, i) => {
                        return (
                            <li>{heading && <strong>{heading}:&nbsp;</strong>}{message}</li>
                        )
                    })
                }
            </ul>
        </div>
        </div>
    </div>
)