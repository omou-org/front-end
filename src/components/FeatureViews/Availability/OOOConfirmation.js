import React from 'react';
import checkMarkIcon from 'components/FeatureViews/Scheduler/icons/bluecheckmark.svg';
import { Grid, Typography } from '@material-ui/core/';
import { omouBlue } from '../../../theme/muiTheme';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    messageSent: {
        fontSize: '30px',
        color: omouBlue,
        fontWeight: 'bold',
    },
    messageContext: {
        fontSize: '16px',
    },
    cancelbutton: {
        backgroundColor: '#FFFFFF',
    },
}));

function OOOConfirmation(props) {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12}>
                <img
                    src={checkMarkIcon}
                    style={{
                        paddingTop: '2em',
                        paddingBottom: '2em',
                    }}
                />
            </Grid>
            <Grid item xs={12} alignItems='center'>
                <Typography className={classes.messageSent}>
                    Your notice has been sent{' '}
                </Typography>
                <Typography variant='h6'>
                    You will recieve a confirmation of your OOO request
                </Typography>
            </Grid>

            <Grid item xs={12} alignItems='center' style={{ marginTop: '5vh' }}>
                <ResponsiveButton
                    className={classes.cancelbutton}
                    variant='outlined'
                    onClick={props.handleClose}
                >
                    Close
                </ResponsiveButton>
            </Grid>
        </Grid>
    );
}

OOOConfirmation.propTypes = {
    handleClose: PropTypes.func,
};

export default OOOConfirmation;
