import React from "react";
import {sessionPaymentStatus} from "../utils";

export const SessionPaymentStatusChip = ({session, enrollment, setPos, style}) => {
    if(!session || !enrollment) {
        return <div
            style={style}
            className={`sessions-left-chip NA ${setPos && "set-pos"}`}>
            Loading...
        </div>
    } else if(session && enrollment){
        const status = sessionPaymentStatus(session, enrollment);

        return <div
            style={style}
            className={`sessions-left-chip ${setPos && "set-pos"} ${status}`}>
            {status}
        </div>
    }
    return <div>hi</div>
};