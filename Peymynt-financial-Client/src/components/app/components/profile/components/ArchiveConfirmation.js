import React from "react";

export const ArchiveConfirmation = props => (
    <div className="archiveConfrmWrp">
        <div className="archiveCnfrmMsg">
            <h6><i className="fa fa-info-circle"></i> Are you sure you want to archive this business?</h6>
            <p>Taking this action will remove this business from all menus and remove any collaborators. You will always have the ability to restore this business.</p>
        </div>
        <div className="archiveButton">
            <button className="btn btn-rounded btn-primary btn-accent" onClick={(e) => props.archieve(e)}> Yes, archive this business</button>
            <a href="javascript: void(0)" onClick={() => props.closeConfrm()}>Cancel archiving, I changed my mind</a>
        </div>
    </div>
)