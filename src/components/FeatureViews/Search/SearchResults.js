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
import AccountsCards from "./AccountsCards"
import UpcomingSessionCards from './UpcomingSessionCards'
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import CoursesCards from "./CoursesCards"


const SearchResults = (props) => {
    const [query, setQuery] = useState('');
    const [primaryFilter, setPrimaryFilter] = useState("All");
    const [showItems, setShowItems] = useState(2)
    const [userList, setUserList] = useState(props.instructors)





    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <div>
            <Grid container className={'search-results'} style={{ "padding": "1em" }}>
                <Paper className={'main-search-view'} >
                    <Grid item xs={12} style={{ "padding": "1em" }}>
                        <Typography variant={"h4"} align={"left"}> "15" Search Resuts for "Search Result"  </Typography>
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
                            <Grid item>
                                <Fab size="small" variant="extended" className={""}>
                                    See All Accounts
                                    </Fab>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} direction={"row"}>
                            {Object.values(props.parents).map((user) => (
                                <AccountsCards user={user} key={user.user_id} />)
                            )}
                        </Grid>
                    </Grid>
                    <hr />
                    <Grid item xs={12} >
                        <Grid container
                            justify={"space-between"}
                            direction={"row"}
                            alignItems="center">
                            <Grid item style={{ "paddingLeft": "25px" }}>
                                <Typography variant={"h5"} align={'left'} gutterBottom>Upcoming Session</Typography>
                            </Grid>
                            <Grid item style={{ "padding": "1em" }}>
                                <Fab size="small" variant="extended" className={""}>
                                    See All Upcoming Session
                                    </Fab>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} direction={"row"}>
                            {Object.values(props.instructors).map((user) => (
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
                                <Typography variant={"h5"} align={'left'} gutterBottom>Courses</Typography>
                            </Grid>
                            <Grid item style={{ "paddingRight": "1em" }}>
                                <Fab size="small" variant="extended" className={""}>
                                    See All Courses
                                    </Fab>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} direction={"row"}>
                            {Object.values(props.students).map((user) => (
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
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResults);