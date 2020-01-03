import React, { useState, useEffect, useMemo } from 'react';
import { Grid } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import { connect, useDispatch, useSelector } from "react-redux";
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import AccountsCards from "./cards/AccountsCards"
import CoursesCards from "./cards/CoursesCards"
import "./Search.scss";
import { useParams} from "react-router-dom"
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as registrationActions from "../../../actions/registrationActions";
import AccountFilters from "../../FeatureViews/Search/AccountFilters"
import NoResultsPage from './NoResults/NoResultsPage';
import Loading from "../../Loading";
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";
import {usePrevious} from "../../../actions/hooks";

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
    const searchState = useSelector(({Search}) => Search);
    const {profile, gradeFilter, sortAlpha} = searchState.params.account;
    const {course, availability, sort, } = searchState.params.course;
    const [accountResults, setAccountResults] = useState([]);
    const [courseResults, setCourseResults] = useState([]);

    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchConfig, setSearchConfig] = useState({ params: { query: "", page: 1, profile: "", gradeFilter: "", sortAlpha: "" }, headers: "" });
    const params = useParams();
    const {query} = params;
    const prevParams = usePrevious(params);


    //Endpoints
    // /search/account/?query=query?profileFilter=profileFilter?gradeFilter=gradeFilter?sortAlpha=asc?sortID=desc
    // /search/courses/?query=query?courseTypeFilter=courseType?availability=availability?dateSort=desc

    const { accounts, courses } = searchState;

    useEffect(()=>{
        let requestConfig;
        // there's a valid query and the searchQueryStatus is an empty string
        if(params.query && !searchState.searchQueryStatus) {
            requestConfig = {
                params: {
                    query: params.query,
                    profile: profile && profile.toLowerCase(),
                    gradeFilter: gradeFilter,
                },
                headers: {"Authorization": `Token ${props.auth.token}`,}
            };
            api.fetchSearchAccountQuery(requestConfig);
        }
    },[profile, gradeFilter, sortAlpha, course, availability, sort]);

    useEffect(() => {
        if(searchState.searchQueryStatus === "success" &&
            (prevParams !== params || profile || gradeFilter || sortAlpha)
        ){
            setAccountResults(accounts);
            setCourseResults(courses);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params,searchState.searchQueryStatus, profile, gradeFilter, sortAlpha, course, availability, sort]);

    if(searchState.searchQueryStatus !== "success" &&
        prevParams !== params){
        return <Loading/>;
    }

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
        e.preventDefault();
        setStart(4);
        setEnd(8);
        if (end === 8) {
            setCurrentPage(currentPage + 1);
            api.fetchSearchAccountQuery(searchConfig);
            setAccountResults(props.search.accounts);
            setStart(0);
            setEnd(4);
        }
    };

    return (
        <Grid container className={'search-results'} style={{ "padding": "1em" }}>
            {(numberOfResults() !== 0) ?
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
