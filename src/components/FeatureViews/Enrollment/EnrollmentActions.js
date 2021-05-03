import { Grid } from '@material-ui/core';
import AddSessions from 'components/OmouComponents/AddSessions';
import React from 'react';
import UnenrollButton from './UnenrollButton';
import PropTypes from 'prop-types';

const EnrollmentActions = ({ enrollment }) => {
    const { student } = enrollment;

    return (
        <Grid container direction='row' spacing={2}>
            <Grid item>
                <AddSessions
                    componentOption='button'
                    enrollment={enrollment}
                    parentOfCurrentStudent={student.parent}
                />
            </Grid>
            <Grid item>
                <UnenrollButton enrollment={enrollment} />
            </Grid>
        </Grid>
    );
};

EnrollmentActions.propTypes = {
    enrollment: PropTypes.shape({
        student: PropTypes.shape({
            parent: PropTypes.object,
        }),
    }).isRequired,
};

export default EnrollmentActions;
