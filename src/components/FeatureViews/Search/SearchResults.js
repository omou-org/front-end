import React, { useState, useEffect, } from 'react';
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
import Chip from "@material-ui/core/Chip";
import "./Search.scss";
import axios from "axios"
import { useParams } from "react-router-dom"

const SearchResults = (props) => {
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(true);

    const params = useParams()

    // /search/account/?query=query?profileFilter=profileFilter?gradeFilter=gradeFilter?sortAlpha=asc?sortID=desc
    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get("http://localhost:8000/search/account/", { params: { query: params.query }, "Authorization": `Token ${props.auth.token}`, })
                if (response.data === []) {
                    console.log("hit")
                } else {
                    setData(response.data)
                }

            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        })()

    }, [params.query, props.auth.token])
    console.log(data, "what we're getting from the backend");

    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <div>
            <Grid container className={'search-results'} style={{ "padding": "1em" }}>
                <Paper className={'main-search-view'} >
                    <Grid item xs={12} style={{ "padding": "1em" }}>
                        <Typography variant={"h4"} align={"left"}> {data.length} Search Results for "{params.query}"  </Typography>
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
                                <Chip label="See All Accounts"
                                    className="searchChip"
                                />
                            </Grid>
                        </Grid>
                        {/* <Grid container style={{ paddingLeft: 20, paddingRight: 20 }} direction={"row"}>
                            {data.slice(0, 4).map((data) => (
                                <AccountsCards user={data.user} key={data.user.user_id} />)
                            )} */}
                    </Grid>
                    {/* </Grid> */}
                    <hr />
                    {/* <Grid item xs={12}>
                        <Grid container
                            justify={"space-between"}
                            direction={"row"}
                            alignItems="center">
                            <Grid item style={{ "paddingLeft": "25px" }}>
                                <Typography variant={"h5"} align={'left'} >Upcoming Sessions</Typography>
                            </Grid>
                            <Grid item style={{ "padding": "1vh" }}>
                            <Chip label="See All Upcoming Sessions" 
                                className="searchChip"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} style={{ paddingLeft: 20, paddingRight: 20 }} direction={"row"}>
                            {Object.values(props.instructors).slice(0, 4).map((user) => (
                                <UpcomingSessionCards user={user} key={user.user_id} />)
                            )}
                        </Grid>
                    </Grid>
                    <hr /> */}

                    <Grid item xs={12}>
                        <Grid container
                            justify={"space-between"}
                            direction={"row"}
                            alignItems="center">
                            <Grid item style={{ "paddingLeft": "25px" }}>
                                <Typography variant={"h5"} align={'left'} >Courses</Typography>
                            </Grid>
                            <Grid item style={{ "paddingRight": "1vh" }}>
                                <Chip label="See All Courses"
                                    className="searchChip"
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction={"row"} style={{ paddingLeft: 20, paddingRight: 20 }}>
                            {props.course.slice(0, 4).map((user) => (
                                <CoursesCards user={user} key={user.user_id} />)
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </div >
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
    "course": state.Search.courses,
    "auth": state.auth
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResults);