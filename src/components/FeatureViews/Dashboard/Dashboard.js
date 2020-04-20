import { useSelector } from 'react-redux';
import React from 'react';
import {NavLink} from 'react-router-dom';
import './Dashboard.scss';
import Today from './Today';
import UnpaidSessions from './../AdminPortal/UnpaidSessions';
import Select from 'react-select';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import DashboardNotes from './DashboardNotes';
import moment from 'moment';
import * as hooks from "actions/hooks";
import Loading from "components/Loading";


const Dashboard = () => {

    const user = useSelector(({auth}) => auth) || [];
    const currentDate = moment().format("dddd, MMMM DD")
    const categories = useSelector(({Course}) => Course.CourseCategories);
    let categoryList = [];
    if (categories.length>0) {
        categoryList = categories.map(({name}) => JSON.parse(JSON.stringify(({
            "value": name,
            "label": name,
        }))));
    }

    const categoryStatus = hooks.useCategory();

    if(hooks.isLoading(categoryStatus)) {
        return (
            <Loading
                loadingText = "DASHBOARD IS LOADING"
            />
        )
    }

    console.log(categoryList);

    return(
        <Paper className="dashboard-paper" elevation={3}>
            <Grid container justify="space-around">
                <Grid item xs={9} spacing={2}>
                    <Typography variant="h4" className="dashboard-greeting">
                        Hello {user.first_name}!
                    </Typography>
                    <br/>
                    <Paper className="today-paper" container>
                        <Grid container style={{width: "100%", justifyContent:"space-between"}}>
                                <Typography variant='h5' className="dashboard-date">
                                    {currentDate}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    variant="outlined" 
                                    style={{margin:"5px", float: "right"}}
                                    component={NavLink}
                                    to='/scheduler'
                                    >View in Scheduler</Button>
                        </Grid>
                        <Grid 
                            container 
                            className="today-container" 
                            wrap = "nowrap">
                            <Today/>
                        </Grid>
                        <Select
                            className="category-options"
                            closeMenuOnSelect={true}
                            options={categoryList}
                            placeholder={'Choose a Category'}
                        />
                    </Paper>
                    <Paper className='OP-paper'>
                    <Typography variant='h5' className="OP-label">
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
