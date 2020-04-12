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
            <Grid container style={{height: "100%"}}>
                <Paper className="today-paper">
                    <Typography className="dashboard-greeting">
                        Hello {user}!
                    </Typography>
                    <Grid container>
                        <Today/>
                    </Grid>
                </Paper>
                <br/>
                <Paper className="recent-update-paper">
                    <RecentUpdate/>
                </Paper>
                {/* <Grid item> */}
                    {/* <Notes/>
                    <br/> */}
                    <UnpaidSessions/>
                {/* </Grid> */}
            </Grid>
        </Paper>
    )
};

export default Dashboard;
