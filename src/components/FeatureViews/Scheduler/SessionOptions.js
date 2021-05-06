import React from 'react';
import Grid from '@material-ui/core/Grid';
import { NavLink, useParams } from 'react-router-dom';

import { USER_TYPES } from '../../../utils';

import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';


import 'date-fns';


const SessionOptions = () => {

    const { session_id } = useParams();

    return (
        <>
            <Grid container direction='row' justify='flex-end' spacing={1}>
                <Grid item>
                    <AccessControlComponent
                        permittedAccountTypes={[
                            USER_TYPES.admin,
                            USER_TYPES.receptionist,
                            USER_TYPES.instructor,
                        ]}
                    >
                        <ResponsiveButton
                            component={NavLink}
                            to={`/scheduler/session/${session_id}/single-session-edit`}
                            variant='outlined'
                        >
                            edit this session
                        </ResponsiveButton>
                    </AccessControlComponent>
                </Grid>
                <Grid item>
                    <AccessControlComponent
                        permittedAccountTypes={[
                            USER_TYPES.admin,
                            USER_TYPES.receptionist,
                            USER_TYPES.instructor,
                        ]}
                    >
                        <ResponsiveButton
                            component={NavLink}
                            to={`/scheduler/session/${session_id}/all-sessions-edit`}
                            variant='outlined'
                        >
                            edit all sessions
                        </ResponsiveButton>
                    </AccessControlComponent>
                </Grid>
            </Grid>
        </>
    );
};

export default SessionOptions;