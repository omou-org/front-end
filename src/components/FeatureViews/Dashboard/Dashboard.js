import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './Dashboard.scss';
import Today from './Today';
import UnpaidSessions from './../AdminPortal/UnpaidSessions';
import Loading from "components/OmouComponents/Loading";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import DashboardNotes from './DashboardNotes';
import moment from 'moment';
import Moment from 'react-moment';
import Select from 'react-select';
import { makeStyles } from "@material-ui/styles";
import { DELETE_ENROLLMENT_FAILED } from 'actions/actionTypes';

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
    const {email} = useSelector(({auth}) => auth) || [];
    const emailQuery = { "email": email }
    const USER_QUERY = gql`query userQuery($email: String="") {
        accountSearch(query: $email) {
          results {
            ... on AdminType {
              user {
                email
                firstName
                id
              }
            }
          }
        }
      }
      
      
      
      `;
      
    const user = useQuery(USER_QUERY, { 
        variables: emailQuery, 
    })

    const userFirstName = user?.data?.accountSearch?.results[0]?.user?.firstName;
    const userID = user?.data?.accountSearch?.results[0]?.user?.id;
    const currentDate = moment()
    let isDisabled;

    
    const [currentFilter, setCurrentFilter] = useState({
        showFiltered: false,
        filter: ""
    });


    const handleChange = e => {
        if (e){
            setCurrentFilter({
                filter: e.label,
                showFiltered: true
            })
        }
        else{
            setCurrentFilter({
                filter: "",
                showFiltered: false
            })
        }
    };

    const CATEGORY_QUERY = gql`query categoryQuery {
            sessionSearch(query: "", time: "", sort: "timeAsc") {
              results {
                course {
                  courseCategory {
                    id
                    name
                  }
                }
              }
            }
          }          
          `
    
    const { data, loading, error } = useQuery(CATEGORY_QUERY);

    if (loading) {
        return (
            <Loading/>
        );
    }

    if (error){
        console.error(error);
        return <>There has been an error: {error.message}</>
    }

    const categoryList = data.sessionSearch.results.map(category=> ({
        "label": category.course.courseCategory.name,
        "value": category.course.courseCategory.id
    }));

    if (categoryList.length===0){
        isDisabled=true;
    }

    else if (categoryList.length>0){
        isDisabled=false;
    }

    return(
        <Grid container>
            <Paper className="dashboard-paper" elevation={3}>
                <Grid container justify="space-around">
                    <Grid item xs={9} spacing={2}>
                        <Typography variant="h4" className="dashboard-greeting">
                            Hello {userFirstName}!
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
                                        >View in Scheduler
                                    </Button>
                            </Grid>
                            <Grid item sm={6} md={6} lg={4}>
                                <Select
                                    className="category-options"
                                    closeMenuOnSelect={true}
                                    isClearable={true}
                                    isDisabled={isDisabled}
                                    options={categoryList}
                                    placeholder={'Choose a Category'}
                                    onValueClick={(e) => e.preventDefault()}
                                    onChange={handleChange}
                                    />
                            </Grid>
                            <Grid 
                                container 
                                className="today-container" 
                                wrap = "nowrap"
                                direction = "row">
                                <Today
                                filter = {currentFilter.filter}
                                />
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
                            key = {userID}
                            id={userID}
                            first_name={userFirstName}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
};

export default Dashboard;
