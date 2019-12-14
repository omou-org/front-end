import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { useParams } from "react-router-dom"
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as registrationActions from "../../../actions/registrationActions";
import { truncateStrings } from "../../truncateStrings";
import AccountFilters from "../../FeatureViews/Search/AccountFilters"
import NoResultsPage from './NoResults/NoResultsPage';
import Loading from "../../Loading";
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";
import { Link, useRouteMatch } from "react-router-dom";

const SearchResults = (props) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(searchActions, dispatch),
        }),
        [dispatch]
    );

    const [data, setData] = useState("");
    const [accountResults, setAccountResults] = useState([]);
    const [courseResults, setCourseResults] = useState([]);
    const { "params": { query } } = useRouteMatch();
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    const params = useParams();

    //Endpoints
    // /search/account/?query=query?profileFilter=profileFilter?gradeFilter=gradeFilter?sortAlpha=asc?sortID=desc
    // /search/courses/?query=query?courseTypeFilter=courseType?availability=availability?dateSort=desc

    const requestConfig = { params: { query: params.query, page: currentPage }, headers: { "Authorization": `Token ${props.auth.token}`, } };

    useEffect(() => {
        api.fetchSearchAccountQuery(requestConfig);
        api.fetchSearchCourseQuery(requestConfig);
        api.fetchInstructors();
        api.fetchStudents();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        api.fetchCourses();
        setAccountResults(props.search.accounts);
        setCourseResults(props.search.courses);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {

        console.log("updated filter", props.search.filter)
    }, [props.search.filter]);

    const numberOfResults = () => {
        switch (params.type) {
            case "all": {
                return accountResults.length + courseResults.length;
            }
            case "account": {
                return accountResults.length;
            }
            case "course": {
                return courseResults.length
            }
        }
    };


    const displayMoreResults = () => (e) => {
        e.preventDefault()
        setStart(4);
        setEnd(8);
        if (end === 8) {
            setCurrentPage(currentPage + 1);
            api.fetchSearchAccountQuery(requestConfig);
            setAccountResults(props.search.accounts);
            setStart(0)
            setEnd(4);
        }
    };


    /*
        first : 0
        second : 4
        page : 1 
        user presses ">" button
            setFirst = 4
            setSecond = * 2

        // display next 4 results when user presses button
        // set slice to (4,8) when pressed 
        // if the second page === 16
        // make a call to the api and check for more results
        // if more results set account results to new results  
        // reset slice to (0,4)
        // if not return 
    */
    return (
        <Grid container className={'search-results'} style={{ "padding": "1em" }}>
            {props.search.searchQueryStatus !== "success" ?
                <Loading />
                : (numberOfResults() !== 0) ?
                    <Grid item xs={12}>
                        <Paper className={'main-search-view'} >
                            <Grid item xs={12} className="searchResults">
                                <Typography variant={"h4"} align={"left"}>
                                    <span style={{ fontFamily: "Roboto Slab", fontWeight: "500" }}>
                                        {numberOfResults()} Search Results for </span>
                                    "{query}"
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
                            <Grid item xs={12} style={{ "position": "relative" }}>
                                <Grid container
                                    justify={"space-between"}
                                    direction={"row"}
                                    alignItems="center">
                                    <Grid item className="searchResults">
                                        <Typography className={"resultsColor"} align={'left'} gutterBottom>
                                            {accountResults.length > 0 ? "Accounts" : ""}
                                        </Typography>
                                    </Grid>
                                    {/*<Grid item >*/}
                                    {/*    <Chip label="See All Accounts"*/}
                                    {/*        className="searchChip"*/}
                                    {/*    />*/}
                                    {/*</Grid>*/}
                                </Grid>
                                <Grid container style={{ paddingLeft: 20, paddingRight: 20 }} spacing={16} direction={"row"}>
                                    {params.type === "account" ?
                                        accountResults.map((account) => (
                                            <Grid item
                                                sm={3}>
                                                <AccountsCards user={account} key={account.user_id} />
                                            </Grid>
                                        ))
                                        :
                                        accountResults.length > 0 ?
                                            accountResults.slice(start, end).map((account) => (
                                                <Grid item
                                                    sm={3}>
                                                    <AccountsCards user={account} key={account.user_id} />
                                                </Grid>
                                            ))
                                            :
                                            ""}
                                    <Grid >
                                        {accountResults.length > 6 ?
                                            <div onClick={displayMoreResults()}>
                                                <MoreResultsIcon />
                                            </div>
                                            : ""
                                        }
                                    </Grid>

                                </Grid>


                            </Grid>
                            {/* </Grid> */}
                            {accountResults.length ? <hr /> : ""}
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
                                        {courseResults.slice(0, 4).map((course) => (
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
