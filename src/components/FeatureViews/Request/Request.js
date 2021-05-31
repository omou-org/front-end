import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

const Request = () => {
    return(
        <>
        <Typography>
            Chicken Nuggets
        </Typography>
        <ResponsiveButton
            variant='outlined'
            value='cancel'
            component={NavLinkNoDup}
            to={`/manage-tutoring-requests/schedule`}
        >
            Schedule
        </ResponsiveButton>

        </>
    );
};

export default Request;