import React, { useState, useEffect, useMemo, } from 'react';
import ReactSelect from 'react-select';
import { Grid, Select, Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import { connect, useDispatch, useSelector } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import AccountsCards from "./cards/AccountsCards"
import CoursesCards from "./cards/CoursesCards"
import "./Search.scss";
import axios from "axios"
import { useParams } from "react-router-dom"
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as registrationActions from "../../../actions/registrationActions";
import { truncateStrings } from "../../truncateStrings";
import AccountFilters from "../../FeatureViews/Search/Filters"
import NoResultsPage from './NoResults/NoResultsPage';
import Loading from "../../Loading";
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";

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

    const courses = useSelector(({ "Course": { NewCourseList } }) => NewCourseList);
    const instructors = useSelector(({ "Users": { InstructorList } }) => InstructorList);
    const requestStatus = useSelector(({ RequestStatus }) => RequestStatus);

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
    const [accountResults, setAccountResults] = useState([]);
    const [courseResults, setCourseResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    //Endpoints
    // /search/account/?query=query?profileFilter=profileFilter?gradeFilter=gradeFilter?sortAlpha=asc?sortID=desc
    // /search/courses/?query=query?courseTypeFilter=courseType?availability=availability?dateSort=desc
    const accountSearchURL = `${process.env.REACT_APP_DOMAIN}/search/account/`;
    const courseSearchURL = `${process.env.REACT_APP_DOMAIN}/search/course/`;
    const requestConfig = { params: { query: params.query, page: 1 }, headers: {"Authorization": `Token ${props.auth.token}`,} };

    useEffect(() => {
        props.searchActions.fetchSearchAccountQuery(requestConfig);
        props.searchActions.fetchSearchCourseQuery(requestConfig);
        console.log(params.type)
    }, []);

    const numberOfResults = () =>{
        switch(params.type){
            case "all":{
                return props.search.accounts.length + props.search.courses.length;
            }
            case "account":{
                return props.search.accounts.length;
            }
            case "course":{
                return props.search.courses.length
            }
        }
    }

    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
            <Grid container className={'search-results'} style={{ "padding": "1em" }}>
                { props.search.searchQueryStatus !== "success" ?
                    <Loading/>
                    :  (numberOfResults() !== 0) ?
                    <Grid item xs={12}>
                        <Paper className={'main-search-view'} >
                            <Grid item xs={12} className="searchResults">
                                <Typography variant={"h4"} align={"left"}>
                                <span style={{fontFamily:"Roboto Slab", fontWeight:"500"}}>
                                {numberOfResults()} Search Results for </span>
                                     "{params.query}"
                                     </Typography>
                            </Grid>
                            {params.type === "account" ?
                                <Grid item xs={12}>
                                    <Grid container>
                                        <AccountFilters />
                                    </Grid>
                                </Grid>
                                : ""}
                            <hr />
                            <Grid item xs={12} style={{"position":"relative"}}>
                                <Grid container
                                    justify={"space-between"}
                                    direction={"row"}
                                    alignItems="center">
                                    <Grid item className="searchResults" >
                                        <Typography className={"resultsColor"} align={'left'} gutterBottom>
                                            {props.search.accounts.length > 0 ? "Accounts":""}
                                        </Typography>
                                    </Grid>
                                    {/*<Grid item >*/}
                                    {/*    <Chip label="See All Accounts"*/}
                                    {/*        className="searchChip"*/}
                                    {/*    />*/}
                                    {/*</Grid>*/}
                                </Grid>
                                <Grid container style={{ paddingLeft: 20, paddingRight: 20 }} spacing={16} direction={"row"}>
                                    { props.search.accounts.length > 0 ?
                                        props.search.accounts.slice(0, 4).map((account) => (
                                            <Grid item xs={12}
                                                  sm={3}>
                                                <AccountsCards user={account} key={account.user_id} />
                                            </Grid>))
                                        :
                                        ""
                                    }
                                </Grid>
                                <MoreResultsIcon/>
                            </Grid>
                            {/* </Grid> */}
                            { props.search.accounts.length > 0 ? <hr /> : ""}
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
                            {
                                params.type !== "account" ? <Grid item xs={12}>
                                    <Grid container
                                          justify={"space-between"}
                                          direction={"row"}
                                          alignItems="center">
                                        <Grid item className="searchResults">
                                            <Typography className={"resultsColor"} align={'left'} >
                                                {props.search.courses.length > 0 ?
                                                    "Courses" : ""
                                                }
                                            </Typography>
                                        </Grid>
                                        {/*<Grid item style={{ "paddingRight": "1vh" }}>*/}
                                        {/*    <Chip label="See All Courses"*/}
                                        {/*        className="searchChip"*/}
                                        {/*    />*/}
                                        {/*</Grid>*/}
                                    </Grid>
                                    <Grid container direction={"row"} style={{ paddingLeft: 20, paddingRight: 20 }}>
                                        {props.search.courses.slice(0, 4).map((course) => (
                                            <CoursesCards course={course} key={course.course_id} />)
                                        )}
                                    </Grid>
                                </Grid> : ""
                            }

                        </Paper>
                    </Grid>
                    : <NoResultsPage />}
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
    "search": state.Search,
    "auth": state.auth
});
const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SearchResults);
