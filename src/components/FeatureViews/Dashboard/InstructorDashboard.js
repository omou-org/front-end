import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";

function InstructorDashboard({user}) {
    return (
        <>
            <Grid container spacing={5}>
                <Grid
                    item
                    container
                    justify='space-between'
                    alignItems='flex-end'
                >
                    <Grid item>
                        <Typography variant='h4'>
                            Hello {user.user.firstName}!
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle1'>
                            <Moment format={'LL'} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography>Your Upcoming Session</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant='subtitle1'>
                                    Total Completed Courses
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant='subtitle1'>
                                    Total Students Taught
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant='subtitle1'>
                                    Total Hours Taught
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper>
                        <Grid container direction='column'>
                            <Grid item xs={8}>
                                a
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper>
                        <Grid container direction='column'>
                            <Grid item xs={4}>
                                a
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

InstructorDashboard.propTypes = {
    user: PropTypes.shape({
        user: PropTypes.shape({
            firstName: PropTypes.string,
        })
    }).isRequired
};

export default InstructorDashboard;
