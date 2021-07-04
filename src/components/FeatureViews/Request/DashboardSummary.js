import React from "react";
import {Grid, Typography } from '@material-ui/core';
import UserAvatar from 'components/FeatureViews/Accounts/UserAvatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    infoRow: {
        marginBottom: '40px'
    }
})

const DashboardSummary = ({request: {status, dates, times, subject, instructor, student}}) => {


    const classes = useStyles();

    return (
        <Grid>
            <Grid>
                {/* Status Bar */}
                <Typography>{status}</Typography>
            </Grid>
            {/* Info Section */}
            <Grid>
                {/* Row 1 */}
                <Grid 
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >
                    {/* Date */}
                    <Grid sm={4}>
                        <Typography variant='h5'>DATE</Typography>
                        <Typography variant='body'>{dates}</Typography>
                    </Grid>
                    {/* Times */}
                    <Grid>
                        <Typography variant='h5'>DAY & TIME</Typography>
                        <Typography variant='body'>{times}</Typography>
                    </Grid>
                </Grid>
                {/* Row 2 */}
                <Grid 
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >
                    {/* Subject */}
                    <Grid sm={2}>
                        <Typography variant='h5'>SUBJECT</Typography>
                        <Typography variant='body'>{subject}</Typography>
                    </Grid>
                    {/* Instructor */}
                    <Grid sm={2}>
                        <Typography variant='h5'>INSTRUCTOR</Typography>
                        <Grid container direction='row' alignItems='center'>
                            <UserAvatar name={instructor} size={24} fontSize={12}/>
                            <Typography variant='body'>{instructor}</Typography>
                        </Grid>
                    </Grid>
                    {/* Student */}
                    <Grid>
                        <Typography variant='h5'>STUDENT</Typography>
                        <Grid container direction='row' alignItems='center'>
                            <UserAvatar name={student} size={24} fontSize={12}/>
                            <Typography variant='body'>{student}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default DashboardSummary;