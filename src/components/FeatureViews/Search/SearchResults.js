import React, {useMemo, useState} from 'react';
import {Grid} from "@material-ui/core";
import {bindActionCreators} from "redux";
import * as searchActions from "../../../actions/searchActions";
import {connect, useDispatch, useSelector} from "react-redux";
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import AccountsCards from "./cards/AccountsCards"
import CoursesCards from "./cards/CoursesCards"
import "./Search.scss";
import {useParams} from "react-router-dom"
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as registrationActions from "../../../actions/registrationActions";
import AccountFilters from "../../FeatureViews/Search/AccountFilters"
import NoResultsPage from './NoResults/NoResultsPage';
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";
import CourseFilters from "./CourseFilters";
import Loading from "../../Loading";
import {SEARCH_ACCOUNTS, SEARCH_ALL, SEARCH_COURSES} from "../../../actions/actionTypes";
import Chip from "@material-ui/core/Chip";

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

    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    const params = useParams();

    const { accounts, courses, SearchQuery } = searchState;

    const numberOfResults = () => {
        switch (searchState.primaryFilter) {
            case SEARCH_ALL: {
                return accounts.length + courses.length;
            }
            case SEARCH_ACCOUNTS: {
                return accounts.length;
            }
            case SEARCH_COURSES: {
                return courses.length
            }
        }
    };


    const displayMoreResults = () => (e) => {
        e.preventDefault();
        setStart(4);
        setEnd(8);
        if (end === 8) {
            setCurrentPage(currentPage + 1);
            // api.fetchSearchAccountQuery(searchConfig);
            setStart(0);
            setEnd(4);
        }
    };

    const displayAll = (type) => event => {
        event.preventDefault();
        api.updatePrimarySearchFilter(type);
    };

    if((searchState.searchQueryStatus.account !== 200 ||
        searchState.searchQueryStatus.course !== 200) && searchState.searchQueryStatus.status){
        return <Loading/>
    }

    return (
        <Grid container className={'search-results'} >
            <Grid item xs={12}>
                {(numberOfResults() !== 0) ?
                <Paper className={'main-search-view'} >
                    <Grid item xs={12} className="searchResults">
                        <Typography
                            className={"search-title"}
                            variant={"h3"}
                            align={"left"}>
                            {numberOfResults()} Search Results for "{SearchQuery}"
                        </Typography>
                    </Grid>
                    <>
                    {searchState.primaryFilter === SEARCH_ACCOUNTS ?
                        <Grid item xs={12}>
                            <Grid container>
                                <AccountFilters />
                            </Grid>
                        </Grid>
                        : ""}
                        {
                            courses.length && searchState.primaryFilter !== SEARCH_COURSES ? <hr /> :""
                        }

                    <Grid item xs={12} style={{ "position": "relative" }}>
                        <Grid container
                            justify={"space-between"}
                            direction={"row"}
                            alignItems="center">
                            <Grid item className="searchResults">
                                <Typography className={"resultsColor"} align={'left'} gutterBottom>
                                    {accounts.length > 0 && searchState.primaryFilter !== SEARCH_COURSES ? "Accounts" : ""}
                                </Typography>
                            </Grid>
                            {
                                (courses.length > 0 && searchState.primaryFilter === SEARCH_ALL) &&
                                <Grid item >
                                    <Chip label="See All Accounts"
                                          className="searchChip"
                                          onClick={displayAll(SEARCH_ACCOUNTS)}
                                    />
                                </Grid>
                            }
                        </Grid>
                        <Grid container style={{ paddingLeft: 20, paddingRight: 20 }} spacing={16} direction={"row"}>
                            {searchState.primaryFilter === SEARCH_ACCOUNTS ?
                                accounts.map((account) => (
                                    <Grid item
                                          key={account.user_id}
                                        sm={3}>
                                        <AccountsCards user={account} key={account.user_id} />
                                    </Grid>
                                ))
                                :
                                accounts.length > 0 && searchState.primaryFilter !== SEARCH_COURSES?
                                    accounts.slice(start, end).map((account) => (
                                        <Grid item
                                              key={account.user_id}
                                            sm={3}>
                                            <AccountsCards user={account} key={account.user_id} />
                                        </Grid>
                                    ))
                                    :
                                    ""}
                            <Grid >
                                {accounts.length > 6 ?
                                    <div onClick={displayMoreResults()}>
                                        <MoreResultsIcon />
                                    </div>
                                    : ""
                                }
                            </Grid>

                        </Grid>


                    </Grid>
                    {
                        searchState.primaryFilter === SEARCH_COURSES?
                            <Grid item xs={12}>
                                <Grid container>
                                    <CourseFilters />
                                </Grid>
                            </Grid> : ""
                    }
                    {accounts.length && searchState.primaryFilter !== SEARCH_ACCOUNTS? <hr /> : ""}
                    {
                        searchState.primaryFilter !== SEARCH_ACCOUNTS ? <Grid item xs={12}>
                            <Grid container
                                justify={"space-between"}
                                direction={"row"}
                                alignItems="center">
                                <Grid item className="searchResults">
                                    <Typography className={"resultsColor"} align={'left'} >
                                        {courses.length > 0 && params.type !== "course" ? "Courses" : "" }
                                    </Typography>
                                </Grid>
                                {
                                    (courses.length > 0 && searchState.primaryFilter === SEARCH_ALL) &&
                                    <Grid item style={{ "paddingRight": "1vh" }}>
                                        <Chip label="See All Courses"
                                              className="searchChip"
                                              onClick={displayAll(SEARCH_COURSES)}
                                        />
                                    </Grid>
                                }
                            </Grid>
                            <Grid container direction={"row"} style={{ paddingLeft: 20, paddingRight: 20 }}>
                                {courses.slice(0, 4).map((course) => (
                                    <CoursesCards course={course} key={course.course_id} />)
                                )}
                            </Grid>
                        </Grid> : ""
                    }
                    </>
                </Paper>:
                        <NoResultsPage /> }
            </Grid>
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
