import React from 'react';
import loadingCoursesError from './loadingCoursesError.png';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

function LoadingCoursesError({ error }) {
    return (
        <>
            <img style={{ width: '10%' }} src={loadingCoursesError} />
            <Typography variant='h6'>
                There was an error loading your {error}.
            </Typography>
        </>
    );
}

LoadingCoursesError.propTypes = {
    error: PropTypes.string.isRequired,
};

export default LoadingCoursesError;
