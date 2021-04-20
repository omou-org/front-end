import React from 'react';
import Box from '@material-ui/core/Box';
import { capitalizeString } from '../../utils';
import { Typography } from '@material-ui/core';

const StatusBadge = (actionType, title) => {
    const actionTypeColor = {
        grn: '#6CE086',
        red: '#FF6766',
        yel: '',
        gry: '#C4C4C4',
    };

    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    return (
        <Box
            style={{
                backgroundColor: actionTypeColor[actionType],
                textAlign: 'center',
                borderRadius: '2px',
                padding: '3px',
                width: '75px',
                height: '24px',
            }}
        >
            <Typography variant='body1'>{capitalize(title)} </Typography>
        </Box>
    );
};

export default StatusBadge;
