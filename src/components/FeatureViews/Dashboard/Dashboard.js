import { connect, useSelector } from 'react-redux';
import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import './Dashboard.scss';
import Today from './Today';
import RecentUpdate from './RecentUpdate';
import UnpaidSessions from './../AdminPortal/UnpaidSessions';
import Notes from './../Notes/Notes';
import background from "./assets/dashboard-bg.jpg";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import DashboardNotes from './DashboardNotes';
import moment from 'moment';

const Dashboard = () => {

    const user = useSelector(({auth}) => auth) || [];
    const currentDate = moment().format("dddd, DD MMMM")
    
    return(
        <Paper className="dashboard-paper" elevation={3}>
            <Grid container justify="space-around">
                <Grid item xs={9} spacing={2}>
                    <Typography variant="h2" className="dashboard-greeting">
                        Hello {user.first_name}!
                    </Typography>
                    <br/>
                    <Paper className="today-paper" container>
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography variant='h4' className="dashboard-date">
                                    {currentDate}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Button 
                                    variant="contained" 
                                    variant="outlined" 
                                    style={{margin:"5px", float: "right", position: "absolute"}}
                                    component={NavLink}
                                    to='/scheduler'
                                    >View in Scheduler</Button>
                            </Grid>
                        </Grid>
                        <Grid 
                            container 
                            className="today-container" 
                            wrap = "nowrap">
                            <Today/>
                        </Grid>
                    </Paper>
                    <Paper className='OP-paper'>
                    <Typography variant='h4'>
                        Outstanding Payments
                    </Typography>
                    <UnpaidSessions/>
                    </Paper>
                </Grid>
                <Grid item xs={3} spacing={2} className='db-notes-container'>
                    <DashboardNotes
                        key = {user.id}
                        id={user.id}
                        first_name={user.first_name}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
};

export default Dashboard;
