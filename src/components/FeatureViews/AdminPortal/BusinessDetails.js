import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { white, omouBlue, darkGrey } from '../../../theme/muiTheme';

const useStyles = makeStyles({
    containerStyles: {
        height: '100vh',
    },
    editButton: {
        marginTop: '1.5rem',
    },
    businessData: {
        marginTop: '2rem',
    },
    businessLabel: {
        color: darkGrey,
        marginBottom: '0.5rem',
        fontSize: '1rem',
    },
});

const bizHours = [
    { day: 'Mon', hours: '9:00 - 5:00 pm' },
    { day: 'Tue', hours: '9:00 - 5:00 pm' },
    { day: 'Wed', hours: '9:00 - 5:00 pm' },
    { day: 'Thu', hours: '9:00 - 5:00 pm' },
    { day: 'Fri', hours: '9:00 - 5:00 pm' },
    { day: 'Sat', hours: '9:00 - 5:00 pm' },
    { day: 'Sun', hours: 'Closed' },
];

const BusinessDetails = () => {
    const classes = useStyles();

    return (
        <Grid
            container
            className={classes.containerStyles}
            justify='flex-start'
            alignContent='flex-start'
        >
            <Grid
                className={classes.editButton}
                justify='flex-start'
                item
                xs={1}
            >
                <ResponsiveButton
                    variant='outlined'
                    // onClick={handleStepChange}
                >
                    edit
                </ResponsiveButton>
            </Grid>

            <Grid
                className={classes.businessData}
                justify='flex-start'
                item
                xs={12}
            >
                <Typography
                    className={classes.businessLabel}
                    align='left'
                    variant='h5'
                >
                    Business Name
                </Typography>
                <Typography align='left' variant='body1'>
                    Bright Stars Academy
                </Typography>
            </Grid>

            <Grid
                className={classes.businessData}
                justify='flex-start'
                item
                xs={12}
            >
                <Typography
                    className={classes.businessLabel}
                    align='left'
                    variant='h5'
                >
                    Business Phone
                </Typography>
                <Typography align='left' variant='body1'>
                    456-456-3577
                </Typography>
            </Grid>

            <Grid
                className={classes.businessData}
                justify='flex-start'
                item
                xs={12}
            >
                <Typography
                    className={classes.businessLabel}
                    align='left'
                    variant='h5'
                >
                    Business Email
                </Typography>
                <Typography align='left' variant='body1'>
                    ask@brightstars.com
                </Typography>
            </Grid>

            <Grid
                className={classes.businessData}
                justify='flex-start'
                item
                xs={12}
            >
                <Typography
                    className={classes.businessLabel}
                    align='left'
                    variant='h5'
                >
                    Business Address
                </Typography>
                <Typography align='left' variant='body1'>
                    123 North Ln San Francisco, CA 94578
                </Typography>
            </Grid>

            <Grid
                className={classes.businessData}
                justify='flex-start'
                item
                xs={12}
            >
                <Typography
                    className={classes.businessLabel}
                    align='left'
                    variant='h5'
                >
                    Business Hours
                </Typography>
                {bizHours.map(({ day, hours }) => (
                    <Typography align='left' variant='body1'>
                        {day}: {hours}
                    </Typography>
                ))}
            </Grid>
        </Grid>
    );
};

export default BusinessDetails;
