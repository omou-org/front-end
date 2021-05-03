import React from 'react';
import { sessionPaymentStatus } from 'utils';
import { LabelBadge } from '../../theme/ThemedComponents/Badge/LabelBadge';
import PropTypes from 'prop-types';

const SessionPaymentStatusChip = ({ session, enrollment }) => {
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

SessionPaymentStatusChip.propTypes = {
    session: PropTypes.object,
    enrollment: PropTypes.object,
};

export default SessionPaymentStatusChip;
