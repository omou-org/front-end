import React from 'react';
import { sessionPaymentStatus } from 'utils';
import { LabelBadge } from '../../theme/ThemedComponents/Badge/LabelBadge';

const SessionPaymentStatusChip = ({ session, enrollment, setPos, style }) => {
    if (!session || !enrollment) {
        return <LabelBadge variant='outline-gray'>Loading...</LabelBadge>;
    }
    const status = sessionPaymentStatus(session, enrollment);

    const badgeVariant = (paymentStatus) =>
        ({
            Paid: 'status-positive',
            Partial: 'status-warning',
            Unpaid: 'status-negative',
            NA: 'outline-gray',
        }[paymentStatus]);

    return <LabelBadge variant={badgeVariant(status)}>{status}</LabelBadge>;
};

export default SessionPaymentStatusChip;
