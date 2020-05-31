import { useSelector } from 'react-redux';
import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import './Dashboard.scss';
import Today from './Today';
import UnpaidSessions from './../AdminPortal/UnpaidSessions';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import DashboardNotes from './DashboardNotes';
import moment from 'moment';
import Moment from 'react-moment';
import TodayFiltered from "./TodayFiltered";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('md')]: {
            padding: "0px"
        }
    },
    date: {
        [theme.breakpoints.down('md')]: {
            fontSize: "20px"
        }
    },
    todayCard: {
        [theme.breakpoints.down('md')]: {
            fontSize: "6px"
        }
    }
}))

const Dashboard = () => {
    const classes = useStyles();
    const user = useSelector(({auth}) => auth) || [];
    const currentDate = moment()
    let location = useLocation();
    console.log(location.pathname);

    return(
        <Grid container>
            <Paper className="dashboard-paper" elevation={3}>
                <Grid container justify="space-around">
                    <Grid item xs={9} spacing={2}>
                        <Typography variant="h4" className="dashboard-greeting">
                            Hello {user.first_name}!
                        </Typography>
                        <br/>
                        <Paper className="today-paper" container>
                            <Grid container className="today-header-container">
                                    <Grid item xs={7}>
                                    <Moment 
                                        className={`dashboard-date ${classes.date}`}
                                        format="dddd, MMMM DD">
                                        {currentDate}
                                    </Moment>
                                    </Grid>
                                    <Button 
                                        variant="outlined" 
                                        style={{margin:"5px", float: "right"}}
                                        component={Link}
                                        to={{
                                            pathname: "/scheduler",
                                            state: { isDashboard: true}
                                        }}
                                        // to='/scheduler'
                                        >View in Scheduler
                                    </Button>
                            </Grid>
                            <Grid item sm={6} md={6} lg={4}>
                                <TodayFiltered/>
                            </Grid>
                            <Grid 
                                container 
                                className="today-container" 
                                wrap = "nowrap"
                                direction = "row">
                                <Today/>
                            </Grid>
                        </Paper>
                        <Paper className='OP-paper'>
                            <Typography variant='h5' className="OP-label">
                                Outstanding Payments
                            </Typography>
                            <Grid
                                container
                                className="unpaid-container"
                                wrap = "nowrap">
                                <UnpaidSessions/>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3} spacing={2} className={`db-notes-container ${classes.root}`}>
                        <DashboardNotes
                            key = {user.id}
                            id={user.id}
                            first_name={user.first_name}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
};

export default Dashboard;
