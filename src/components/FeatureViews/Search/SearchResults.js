import React, { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import { Grid, Select, Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import { connect } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import AccountsCards from "./cards/AccountsCards"
import UpcomingSessionCards from './cards/UpcomingSessionCards'
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import CoursesCards from "./cards/CoursesCards"
import "./Search.scss";


const SearchResults = (props) => {


    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <div>
            <Grid container className={'search-results'} style={{ "padding": "1em" }}>
                <Paper className={'main-search-view'} >
                    <Grid item xs={12} style={{ "padding": "1em" }}>
                        <Typography variant={"h4"} align={"left"}> "15" Search Results for "Search Result"  </Typography>
                    </Grid>
                    <hr />
                    <Grid item xs={12}>
                        <Grid container
                            justify={"space-between"}
                            direction={"row"}
                            alignItems="center">
                            <Grid item style={{ "paddingLeft": "25px" }}>
                                <Typography variant={"h5"} align={'left'} gutterBottom>Accounts</Typography>
                            </Grid>
                            <Grid item >
                                <Fab size="small" variant="extended" className={""}>
                                    See All Accounts
                                    </Fab>
                            </Grid>
                        </Grid>
                        <Grid container style={{paddingLeft:20, paddingRight:20}} direction={"row"}>
                            {props.accounts.slice(0, 4).map((user) => (
                                <AccountsCards user={user} key={user.user_id} />)
                            )}
                        </Grid>
                    </Grid>
                    <hr />
                    <Grid item xs={12} style={{paddingLeft:20, paddingRight:20}}>
                        <Grid container
                            justify={"space-between"}
                            direction={"row"}
                            alignItems="center">
                            <Grid item style={{}}>
                                <Typography variant={"h5"} align={'left'} >Upcoming Sessions</Typography>
                            </Grid>
                            <Grid item style={{ "padding": "1vh" }}>
                                <Fab size="small" variant="extended" className={""}>
                                    See All Upcoming Session
                                    </Fab>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} direction={"row"}>
                            {Object.values(props.instructors).slice(0, 4).map((user) => (
                                <UpcomingSessionCards user={user} key={user.user_id} />)
                            )}
                        </Grid>
                    </Grid>
                    <hr />
                    <Grid item xs={12}>
                        <Grid container
                            justify={"space-between"}
                            direction={"row"}
                            alignItems="center">
                            <Grid item style={{ "paddingLeft": "25px" }}>
                                <Typography variant={"h5"} align={'left'} >Courses</Typography>
                            </Grid>
                            <Grid item style={{ "paddingRight": "1vh" }}>
                                <Fab size="small" variant="extended" className={""}>
                                    See All Courses
                                    </Fab>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} direction={"row"}>
                            {props.course.slice(0, 4).map((user) => (
                                <CoursesCards user={user} key={user.user_id} />)
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </div>
    )
};


const mapStateToProps = (state) => ({
    "courses": state.Course["NewCourseList"],
    "courseCategories": state.Course["CourseCategories"],
    "students": state.Users["StudentList"],
    "instructors": state.Users["InstructorList"],
    "parents": state.Users["ParentList"],
    "courseRoster": state.Course["CourseRoster"],
    "enrollments": state.Enrollments,
    "accounts": state.Search.accounts,
    "course": state.Search.courses
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResults);