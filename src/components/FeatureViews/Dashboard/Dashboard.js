import { connect, useSelector } from 'react-redux';
import React, { Component } from 'react';
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

const Dashboard = () => {

    const user = useSelector(({auth}) => auth.first_name) || [];

    return(
        <Paper className="dashboard-paper" elevation={3}>
            <Grid xs={8}>
                <Typography variant="h2" className="dashboard-greeting">
                    Hello {user}!
                </Typography>
                <br/>
                <Typography variant='h4' className="dashboard-date">
                    April 12, 2020
                </Typography>
                    <Paper className="today-paper">
                        <Grid container>
                            <Today/>
                        </Grid>
                    </Paper>
                <Typography variant='h4'>
                    Outstanding Payments
                </Typography>
                <UnpaidSessions/>
            </Grid>
            <Grid xs={3}>
                Notes
            </Grid>
        </Paper>
    )
};

export default Dashboard;
