import React from "react";
import {sessionPaymentStatus} from "../utils";

export const SessionPaymentStatusChip = ({session, enrollment}) => {
    if(session && enrollment){
        const status = sessionPaymentStatus(session, enrollment);

        return <div className={`sessions-left-chip ${status}`}>
            {status}
        </div>
    }
    return <></>
};