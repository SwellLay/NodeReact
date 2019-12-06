import React from "react";

export const RestoreConfirmation = props => (
    <div className="archiveConfrmWrp">
        <div className="mrB20 mrT20">
            <div>Are you sure you want to restore <strong>{props.selected.organizationName}</strong>?</div>
        </div>
        <div className="archiveButton">
            <button className="btn btn-primary" onClick={(e) => props.restore(e)}> Yes, restore my business</button>
            <button className="btn-outline-primary btn btn-secondary" onClick={() => props._toggleRestoreConfrm()}>No, cancel</button>
        </div>
    </div>
)