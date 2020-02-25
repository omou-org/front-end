import React, { useEffect, useMemo, useState } from 'react';
import { Grid, IconButton } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import { connect, useDispatch, useSelector } from "react-redux";
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import AccountsCards from "./cards/AccountsCards"
import CoursesCards from "./cards/CoursesCards"
import "./Search.scss";
import { useParams } from "react-router-dom"
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as registrationActions from "../../../actions/registrationActions";
import AccountFilters from "../../FeatureViews/Search/AccountFilters"
import NoResultsPage from './NoResults/NoResultsPage';
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";
import LessResultsIcon from "@material-ui/icons/KeyboardArrowLeft";
import CourseFilters from "./CourseFilters";
import Loading from "../../Loading";
import { SEARCH_ACCOUNTS, SEARCH_ALL, SEARCH_COURSES } from "../../../actions/actionTypes";
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
    const searchState = useSelector(({ Search }) => Search);
    const { accounts, courses, SearchQuery, course_num_results, account_num_results, page, count } = searchState;

    const [start, setStart] = useState({
        account: 0,
        course: 0,
    });
    const [end, setEnd] = useState({
        account: 4,
        course: 4,
    });
    const [currentPage, setCurrentPage] = useState({
        account: page,
        course: page,
    });

    const [moreResults, setMoreResults] = useState("");
    const [lessResults, setLessResults] = useState("");

    const params = useParams();



    useEffect(() => {
        return () => {
            api.resetSearchParams();
        }
    }, []);

    const numberOfResults = () => {
        switch (searchState.primaryFilter) {
            case SEARCH_ALL: {
                return course_num_results + account_num_results;
            }
            case SEARCH_ACCOUNTS: {
                return account_num_results;
            }
            case SEARCH_COURSES: {
                return course_num_results;
            }
        }
    };


    const displayResults = (moreOrLess, searchType) => (e) => {
        e.preventDefault();
        let maxPage = Math.ceil(count / 8);
        if (maxPage > currentPage) {
            setMoreResults(true);
        }

        if (maxPage >= currentPage && currentPage !== 1) {
            setLessResults(true)
        }
        switch (moreOrLess) {
            case "more": {

                setStart({
                    ...start,
                    [searchType]: 4,
                });
                setEnd({
                    ...end,
                    [searchType]: 8,
                });

                setCurrentPage({
                    ...currentPage,
                    [searchType]: currentPage[searchType] + 1
                });

                if (end[searchType] === 8) {
                    setCurrentPage({
                        ...currentPage,
                        [searchType]: currentPage[searchType] + 1
                    });
                    api.updateSearchParam(searchType, `${searchType}Page`, currentPage[searchType] + 1);
                    setStart({
                        ...start,
                        [searchType]: 0,
                    });
                    setEnd({
                        ...end,
                        [searchType]: 4,
                    });
                }
                break;
            }
            case "less": {
                setStart({
                    ...start,
                    [searchType]: 0,
                });
                setEnd({
                    ...end,
                    [searchType]: 4,
                });

                setCurrentPage({
                    ...currentPage,
                    [searchType]: currentPage[searchType] - 1
                });

                if (start[searchType] === 0) {
                    setCurrentPage({
                        ...currentPage,
                        [searchType]: currentPage[searchType] - 1
                    });
                    api.updateSearchParam(searchType, `${searchType}Page`, currentPage[searchType] - 1);
                    setStart(0);
                    setEnd(4);
                }
            }
        }

    };

    const displayAll = (type) => event => {
        event.preventDefault();
        api.updatePrimarySearchFilter(type);
    };

    if ((searchState.searchQueryStatus.account !== 200 ||
        searchState.searchQueryStatus.course !== 200) && searchState.searchQueryStatus.status) {
        return <Loading />
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
                        <div className="account-results-wrapper">
                            {searchState.primaryFilter === SEARCH_ACCOUNTS ?
                                <Grid item xs={12}>
                                    <Grid container>
                                        <AccountFilters />
                                    </Grid>
                                </Grid>
                                : ""}
                            {
                                course_num_results && searchState.primaryFilter !== SEARCH_COURSES ? <hr /> :""
                            }

                        <Grid item xs={12}>
                            <Grid container
                                justify={"space-between"}
                                direction={"row"}
                                alignItems="center">
                                <Grid item className="searchResults">
                                    <Typography className={"resultsColor"} align={'left'} gutterBottom>
                                        {account_num_results > 0 && searchState.primaryFilter !== SEARCH_COURSES ? "Accounts" : ""}
                                    </Typography>
                                </Grid>
                                {
                                    (account_num_results > 0 && searchState.primaryFilter === SEARCH_ALL) &&
                                    <Grid item >
                                        <Chip label="See All Accounts"
                                              className="searchChip"
                                              onClick={displayAll(SEARCH_ACCOUNTS)}
                                        />
                                    </Grid>
                                }
                            </Grid>
                            <Grid container spacing={16} direction={"row"}>
                                {searchState.primaryFilter === SEARCH_ACCOUNTS ?
                                    accounts.map((account) => (
                                        <Grid item
                                              key={account.user_id}
                                            sm={3}>
                                            <AccountsCards user={account} key={account.user_id} />
                                        </Grid>
                                    ))
                                    :
                                    account_num_results > 0 && searchState.primaryFilter !== SEARCH_COURSES?
                                        accounts.slice(start["account"], end["account"]).map((account) => (
                                            <Grid item
                                                  key={account.user_id}
                                                sm={3}>
                                                <AccountsCards user={account} key={account.user_id} />
                                            </Grid>
                                        ))
                                        :
                                        ""}
                            </Grid>
                            {account_num_results > 4 ?
                                <div className={"results-nav"}>
                                    {
                                         <IconButton disabled={lessResults !== 1}
                                            className={"less"}
                                            onClick={displayResults("less", SEARCH_ACCOUNTS)}>
                                            <LessResultsIcon />
                                        </IconButton>
                                    }
                                    {searchState.params.account.accountPage}
                                    {
                                         <IconButton disabled={moreResults}
                                            className={"more"}
                                            onClick={displayResults("more", SEARCH_ACCOUNTS)}>
                                            <MoreResultsIcon />
                                        </IconButton>
                                    }

                                </div>
                                : ""
                            }
                        </Grid>
                    </div>
                    <div className={"course-results-wrapper"}>
                        {
                            searchState.primaryFilter === SEARCH_COURSES?
                                <Grid item xs={12}>
                                    <Grid container>
                                        <CourseFilters />
                                    </Grid>
                                </Grid> : ""
                        }
                        {account_num_results && course_num_results !== 0&&searchState.primaryFilter !== SEARCH_ACCOUNTS? <hr /> : ""}
                        {
                            searchState.primaryFilter !== SEARCH_ACCOUNTS ? <Grid item xs={12}>
                                <Grid container
                                    justify={"space-between"}
                                    direction={"row"}
                                    alignItems="center">
                                    <Grid item className="searchResults">
                                        <Typography className={"resultsColor"} align={'left'} >
                                            {course_num_results > 0 && params.type !== "course" ? "Courses" : "" }
                                        </Typography>
                                    </Grid>
                                    {
                                        (course_num_results > 0 && searchState.primaryFilter === SEARCH_ALL) &&
                                        <Grid item style={{ "paddingRight": "1vh" }}>
                                            <Chip label="See All Courses"
                                                  className="searchChip"
                                                  onClick={displayAll(SEARCH_COURSES)}
                                            />
                                        </Grid>
                                    }
                                </Grid>
                                <Grid container direction={"row"}>
                                    {courses.slice(start.course, end.course).map((course) => (
                                            <CoursesCards course={course} key={course.course_id} />
                                        )
                                    )}
                                </Grid>
                            </Grid> : ""
                        }
                        {course_num_results > 4 ?
                            <div className={"results-nav"}>
                                {
                                     <IconButton disabled={currentPage.course === 1}
                                        className={"less"}
                                        onClick={displayResults("less", SEARCH_COURSES)}>
                                        <LessResultsIcon/>
                                    </IconButton>
                                }
                                {currentPage.course}
                                {
                                     <IconButton disabled={course_num_results > 7}
                                        className={"more"}
                                        onClick={displayResults("more", SEARCH_COURSES)}>
                                        <MoreResultsIcon />
                                    </IconButton>
                                }

                                </div>
                                : ""
                            }
                        </div>
                    </Paper> :
                    <NoResultsPage />}
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
