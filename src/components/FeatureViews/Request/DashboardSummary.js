import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import UserAvatar from 'components/FeatureViews/Accounts/UserAvatar';
import { makeStyles } from '@material-ui/core/styles';
import LargeStatusIndicator from './LargeStatusIndicator';

const useStyles = makeStyles({
    infoRow: {
        marginBottom: '40px',
    },
    infoLabel: {
        marginBottom: '11px',
    },
    userAvatar: {
        marginLeft: '10px',
    },
});

const DashboardSummary = ({
    request: { status, dates, times, subject, instructor, student },
}) => {
    const classes = useStyles();

    return (
        <Grid>
            <Grid>
                <LargeStatusIndicator status={status} />
            </Grid>
            <Grid>
                <Grid
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                    className={classes.infoRow}
                >
                    <Grid sm={4}>
                        <Typography className={classes.infoLabel} variant='h5'>
                            DATE
                        </Typography>
                        <Typography variant='body'>{dates}</Typography>
                    </Grid>
                    <Grid>
                        <Typography className={classes.infoLabel} variant='h5'>
                            DAY & TIME
                        </Typography>
                        <Typography variant='body'>{times}</Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                    className={classes.infoRow}
                >
                    <Grid sm={2}>
                        <Typography className={classes.infoLabel} variant='h5'>
                            SUBJECT
                        </Typography>
                        <Typography variant='body'>{subject}</Typography>
                    </Grid>
                    <Grid sm={2}>
                        <Typography className={classes.infoLabel} variant='h5'>
                            INSTRUCTOR
                        </Typography>
                        <Grid container direction='row' alignItems='center'>
                            <UserAvatar
                                name={instructor}
                                size={24}
                                fontSize={12}
                            />
                            <Typography
                                variant='body'
                                className={classes.userAvatar}
                            >
                                {instructor}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Typography className={classes.infoLabel} variant='h5'>
                            STUDENT
                        </Typography>
                        <Grid container direction='row' alignItems='center'>
                            <UserAvatar
                                name={student}
                                size={24}
                                fontSize={12}
                            />
                            <Typography
                                variant='body'
                                className={classes.userAvatar}
                            >
                                {student}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DashboardSummary;
