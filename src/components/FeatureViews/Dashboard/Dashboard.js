import { connect } from 'react-redux';
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

    // const user = useSelector(({Auth}) => Authentication)
    // console.log(user)

    return(
        <Paper elevation={3} style={{backgroundImage: `url(${background}`, backgroundSize: "100%", margin: "20px", padding: "20px", width: "90%", height: "90%"}}>
            <Grid container style={{height: "100%"}}>
                <Paper style={{width: "60%", height: "60%"}}>
                    <Today/>
                </Paper>
                <br/>
                <Paper style={{width: "50%", height: "20%"}}>
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
