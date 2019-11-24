import React, {useState, useEffect, useMemo,} from 'react';
import ReactSelect from 'react-select';
import { Grid, Select, Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import {connect, useDispatch, useSelector} from "react-redux";
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
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as registrationActions from "../../../actions/registrationActions";


const SearchResults = (props) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);

    useEffect(() => {
        api.fetchCourses();
        api.fetchInstructors();
        api.fetchStudents();
    }, [api]);

    useEffect(() => {
        api.fetchCourses();
        api.fetchInstructors();
        api.fetchStudents();
    }, [api]);

    const [data, setData] = useState("");
    const [accountResults, setAccountResults ] = useState([]);
    const [courseResults, setCourseResults ] = useState([]);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    //Endpoints
    // /search/account/?query=query?profileFilter=profileFilter?gradeFilter=gradeFilter?sortAlpha=asc?sortID=desc
    // /search/courses/?query=query?courseTypeFilter=courseType?availability=availability?dateSort=desc
    const accountSearchURL = "http://localhost:8000/search/account/";
    const courseSearchURL = "http://localhost:8000/search/courses/";
    // const accountSearchURL = "http://api.omoulearning.com:8000/search/account/";
    // const courseSearchURL = "http://api.omoulearning.com:8000/search/courses/";
    const requestConfig = { params: { query: params.query }, headers: {"Authorization": `Token ${props.auth.token}`,} };

    useEffect(() => {
        (async () => {
            try {
                const accountResponse = await axios.get(accountSearchURL, requestConfig);
                axios.interceptors.request.use(function(config){
                    setLoading(true);
                    return config
                }, (error) => {
                    return Promise.reject(error);
                });

                if (accountResponse.data === []) {
                    console.log("account hit")
                } else {
                    let rawAccountResults = accountResponse.data;
                    let accountResults = rawAccountResults.map((rawAccountResult) =>{
                        return {user: rawAccountResult, type:"user", user_id: rawAccountResult.user.id}
                    });
                    setAccountResults(accountResults);
                }
                const courseResponse = await axios.get(courseSearchURL,requestConfig);
                if (courseResponse.data === []){
                    console.log("course hit");
                } else {
                    setCourseResults(courseResponse.data)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        })()
    }, [params.query, props.auth.token]);

    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
            <Grid container className={'search-results'} style={{ "padding": "1em" }}>
                { loading ?
                    <h2>Loading...</h2>
                    :
                    <Grid item xs={12}>
                        <Paper className={'main-search-view'} >
                            <Grid item xs={12} style={{ "padding": "1em" }}>
                                <Typography variant={"h4"} align={"left"}> {accountResults.length + courseResults.length} Search Results for "{params.query}"  </Typography>
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
                                    {/*<Grid item >*/}
                                    {/*    <Chip label="See All Accounts"*/}
                                    {/*        className="searchChip"*/}
                                    {/*    />*/}
                                    {/*</Grid>*/}
                                </Grid>
                                <Grid container style={{ paddingLeft: 20, paddingRight: 20 }} direction={"row"}>
                                    { accountResults.length > 0 ?
                                        accountResults.slice(0, 4).map((account) => (
                                            <AccountsCards user={account.user} key={account.user_id} />))
                                        :
                                        ""
                                    }
                                </Grid>
                            </Grid>
                            {/* </Grid> */}
                            <hr />
                            {/*<Grid item xs={12}>*/}
                            {/*    <Grid container*/}
                            {/*        justify={"space-between"}*/}
                            {/*        direction={"row"}*/}
                            {/*        alignItems="center">*/}
                            {/*        <Grid item style={{ "paddingLeft": "25px" }}>*/}
                            {/*            <Typography variant={"h5"} align={'left'} >Upcoming Sessions</Typography>*/}
                            {/*        </Grid>*/}
                            {/*        /!*<Grid item style={{ "padding": "1vh" }}>*!/*/}
                            {/*        /!*<Chip label="See All Upcoming Sessions"*!/*/}
                            {/*        /!*    className="searchChip"*!/*/}
                            {/*        /!*    />*!/*/}
                            {/*        /!*</Grid>*!/*/}
                            {/*    </Grid>*/}
                            {/*    <Grid container spacing={16} style={{ paddingLeft: 20, paddingRight: 20 }} direction={"row"}>*/}
                            {/*        {Object.values(props.instructors).slice(0, 4).map((user) => (*/}
                            {/*            <UpcomingSessionCards user={user} key={user.user_id} />)*/}
                            {/*        )}*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}
                            {/*<hr />*/}

                            <Grid item xs={12}>
                                <Grid container
                                      justify={"space-between"}
                                      direction={"row"}
                                      alignItems="center">
                                    <Grid item style={{ "paddingLeft": "25px" }}>
                                        <Typography variant={"h5"} align={'left'} >Courses</Typography>
                                    </Grid>
                                    {/*<Grid item style={{ "paddingRight": "1vh" }}>*/}
                                    {/*    <Chip label="See All Courses"*/}
                                    {/*        className="searchChip"*/}
                                    {/*    />*/}
                                    {/*</Grid>*/}
                                </Grid>
                                <Grid container direction={"row"} style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    {courseResults.slice(0, 4).map((course) => (
                                        <CoursesCards course={course} key={course.course_id} />)
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                }
            </Grid>
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

export default connect(
    mapStateToProps
)(SearchResults);