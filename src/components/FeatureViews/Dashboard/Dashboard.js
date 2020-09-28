import {useSelector} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
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
import {makeStyles} from "@material-ui/styles";
import { ThemeButton } from '../../OmouComponents/ThemeComponents/ThemeButton';

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
}));

const Dashboard = () => {
    const classes = useStyles();
    const {email} = useSelector(({auth}) => auth) || [];
    const [currentFilter, setCurrentFilter] = useState({
        showFiltered: false,
        filter: ""
    });

    const emailQuery = {"email": email};

    const DASHBOARD_QUERY = gql`query DashboardQuery($email: String="") {
        sessionSearch(query: "", time: "today", sort: "timeAsc") {
          results {
            course {
              courseCategory {
                id
                name
              }
            }
          }
        }
        accountSearch(query: $email) {
          total
          results {
            ... on AdminType {
              userUuid
              birthDate
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
     
    const { data, loading, error } = useQuery(DASHBOARD_QUERY, {
        variables: emailQuery
    });

    if (loading) {
        return (
            <Loading/>
        );
    }

    if (error){
        console.error(error);
        return <>There has been an error: {error.message}</>
    }

    const { firstName, id } = data.accountSearch.results[0].user;
    const currentDate = moment();
    let isDisabled;

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

    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    };

    const categoryList = data.sessionSearch.results.map(category=> ({
        "label": category.course.courseCategory.name,
        "value": category.course.courseCategory.id
    }));

    const uniqueCategoryList = categoryList.filter( onlyUnique );
    if (uniqueCategoryList.length===0){
        isDisabled=true;
    }

    else if (uniqueCategoryList.length>0){
        isDisabled=false;
    }

    return(
        <Grid container>
            <Paper className="dashboard-paper" elevation={3}>
                <Grid container justify="space-around">
                {/* <Grid item xs={3}>
                    <ThemeButton variant='contained' label={`contained`}></ThemeButton>
                </Grid>
                <Grid item xs={3}>
                    <ThemeButton variant='outlined' label={`outlined`}></ThemeButton>
                </Grid>
                <Grid item xs={3}>
                    <ThemeButton  variant = 'outlined' label={`disabled`} disabled></ThemeButton>
                </Grid> */}
                    <Grid item xs={9} >
                        <Typography variant="h4" className="dashboard-greeting">
                            Hello {firstName}!
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
                                    options={uniqueCategoryList}
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
                    <Grid item xs={3} className={`db-notes-container ${classes.root}`}>
                        <DashboardNotes
                            key = {id}
                            id={id}
                            first_name={firstName}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
};

export default Dashboard;
