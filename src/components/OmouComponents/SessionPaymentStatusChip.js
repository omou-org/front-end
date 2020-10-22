import React from "react";
import {sessionPaymentStatus} from "utils";
import {LabelBadge} from "../../theme/ThemedComponents/Badge/LabelBadge";

const SessionPaymentStatusChip = ({session, enrollment, setPos, style}) => {
    if (!session || !enrollment) {
        return (
            <LabelBadge label="Loading..." variant="outline-gray"/>
        );
    }
    const status = sessionPaymentStatus(session, enrollment);
    
    const badgeVariant = (paymentStatus) => ({
        "Paid": "status-positive",
        "Partial": "status-warning",
        "Unpaid": "status-negative",
        "NA": "outline-gray",
    }[paymentStatus]);
    
    return (
        <LabelBadge label={status} variant={badgeVariant(status)}/>
    );
};

export default SessionPaymentStatusChip;
