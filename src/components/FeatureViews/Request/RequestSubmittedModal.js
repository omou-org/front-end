import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import PropTypes from 'prop-types';
import { white, omouBlue } from '../../../theme/muiTheme';

const useStyles = makeStyles({
    modalStyle: {
        top: '50%',
        left: `50%`,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        width: '31.8em',
        height: '21em',
        background: white,
        boxShadow: '0px 0px 8px rgba(153, 153, 153, 0.8);',
        borderRadius: '5px',
    },
    modalTypography: {
        marginBottom: '1em',
    },
});

const RequestSubmittedModal = ({ handleModalClose }) => {
    const classes = useStyles();

    return (
        <Grid container className={classes.modalStyle}>
            <Grid item style={{ padding: '2em' }} xs={12}>
                <Typography className={classes.modalTypography} variant='h3'>
                    Request Submitted
                </Typography>
                <Typography
                    className={classes.modalTypography}
                    variant='h6'
                    align='left'
                >
                    REQUEST ID #1234
                </Typography>
                <Typography
                    align='left'
                    className={classes.modalTypography}
                    variant='h6'
                >
                    Your request has been successfully submitted! We will notify
                    you if there’s any updates on your request.
                </Typography>
            </Grid>
            <Grid item style={{ textAlign: 'right' }} xs={11}>
                <ResponsiveButton
                    style={{ color: omouBlue }}
                    onClick={handleModalClose}
                >
                    Done
                </ResponsiveButton>
            </Grid>
        </Grid>
    );
};

export default RequestSubmittedModal;

RequestSubmittedModal.propTypes = {
    handleModalClose: PropTypes.func,
};
