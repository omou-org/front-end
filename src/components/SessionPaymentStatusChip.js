import React from "react";
import {sessionPaymentStatus} from "utils";

const SessionPaymentStatusChip = ({session, enrollment, setPos, style}) => {
    if (!session || !enrollment) {
        return (
            <div
                className={`sessions-left-chip NA ${setPos && "set-pos"}`}
                style={style}>
                Loading...
            </div>
        );
    }
    const status = sessionPaymentStatus(session, enrollment);
    return (
        <div
            className={`sessions-left-chip ${setPos && "set-pos"} ${status}`}
            style={style}>
            {status}
        </div>
    );
};

export default SessionPaymentStatusChip;
