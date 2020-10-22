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
    const badgeVariant = (paymentStatus) => {
        switch (paymentStatus) {
            case "Paid": 
                return "status-positive";
            case "Partial":
                return "status-warning";
            case "Unpaid":
                return "status-negative";
            default:
                return "outline-gray";
        }
    }
    return (
        <LabelBadge label={status} variant={badgeVariant(status)}/>
    );
};

export default SessionPaymentStatusChip;
