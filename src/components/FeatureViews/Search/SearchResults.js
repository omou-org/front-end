import React, {useEffect, useMemo, useState} from 'react';
import {Grid, IconButton} from "@material-ui/core";
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
import LessResultsIcon from "@material-ui/icons/KeyboardArrowLeft";
import CourseFilters from "./CourseFilters";
import {SEARCH_ACCOUNTS, SEARCH_ALL, SEARCH_COURSES} from "../../../actions/actionTypes";
import Chip from "@material-ui/core/Chip";
import SearchResultsLoader from "./SearchResultsLoader";

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
    const accountResultsNum = useSelector(({ Search }) => Search.account_num_results);
    const courseResultsNum = useSelector(({ Search }) => Search.course_num_results);
    const { accounts, courses, SearchQuery} = searchState;

    const [currentPage, setCurrentPage] = useState({
        account: 1,
        course: 1,
    });

    const params = useParams();

    useEffect(() => {
        return () => {
            // api.resetSearchParams();
        }
    }, []);

    const numberOfResults = () => {
        switch (searchState.primaryFilter) {
            case SEARCH_ALL: {
                return courseResultsNum + accountResultsNum;
            }
            case SEARCH_ACCOUNTS: {
                return accountResultsNum;
            }
            case SEARCH_COURSES: {
                return courseResultsNum;
            }
        }
    };

    const displayAll = (type) => event => {
        event.preventDefault();
        api.updatePrimarySearchFilter(type);
    };

    if ((searchState.searchQueryStatus.account !== 200 ||
        searchState.searchQueryStatus.course !== 200) && searchState.searchQueryStatus.status) {
        return <SearchResultsLoader
            SearchResults={numberOfResults()}
            accountPage={currentPage.account}
            coursePage={currentPage.course}
            SearchQuery={SearchQuery}/>
    }

    const MAX_PAGE = Math.ceil(numberOfResults() / 8);

    const setPageLimit = (resultsPageNumber) => {
        return resultsPageNumber >= MAX_PAGE;
    };

    const isOdd = (number) => number % 2 !== 0;
    const startPage = (page) => {
        if(searchState.primaryFilter === SEARCH_ALL){
            return isOdd(page) ? 0 : 4;
        } else {
            return 0;
        }

    };
    const endPage = (page) => {
        if(searchState.primaryFilter === SEARCH_ALL){
            return isOdd(page) ? 4 : 8;
        } else {
            return 8;
        }
    };

    const handleMoreResults = (page, resultType) => (e) => {
        e.preventDefault();
        setCurrentPage({
            ...currentPage,
            [resultType] : currentPage[resultType] + 1,
        });

        if(isOdd(page+1) || searchState.primaryFilter !== SEARCH_ALL){
            const page = `${resultType}Page`;
            api.updateSearchParam(resultType, page, Number(searchState.params[resultType][page]) + 1);
        }
    };

    const handleLessResults = (page, resultType) => (e) => {
        e.preventDefault();
        setCurrentPage({
            ...currentPage,
            [resultType] : currentPage[resultType] - 1,
        });

        if(!isOdd(page-1) || searchState.primaryFilter !== SEARCH_ALL){
            const page = `${resultType}Page`;
            const newPage = Number(searchState.params[resultType][page]) !== 1 ?
                Number(searchState.params[resultType][page]) - 1 : 1;
            api.updateSearchParam(resultType, page, newPage);
        }
    };

    if(numberOfResults() === 0 || !numberOfResults()){
        return <NoResultsPage/>
    }

    return (
        <Grid container className={'search-results'} >
            <Grid item xs={12}>

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
                                courseResultsNum && searchState.primaryFilter !== SEARCH_COURSES ? <hr /> :""
                            }

                        <Grid item xs={12}>
                            <Grid container
                                justify={"space-between"}
                                direction={"row"}
                                alignItems="center">
                                <Grid item className="searchResults">
                                    <Typography className={"resultsColor"} align={'left'} gutterBottom>
                                        {accountResultsNum > 0 && searchState.primaryFilter !== SEARCH_COURSES ? "Accounts" : ""}
                                    </Typography>
                                </Grid>
                                {
                                    (accountResultsNum > 0 && searchState.primaryFilter === SEARCH_ALL) &&
                                    <Grid item >
                                        <Chip label="See All Accounts"
                                              className="searchChip"
                                              onClick={displayAll(SEARCH_ACCOUNTS)}
                                        />
                                    </Grid>
                                }
                            </Grid>
                            <Grid container spacing={16} direction={"row"}>
                                {
                                    accountResultsNum > 0 && searchState.primaryFilter !== SEARCH_COURSES ?
                                        accounts.slice(startPage(currentPage.account), endPage(currentPage.account))
                                            .map((account) => {
                                                // console.log(account)
                                               return (
                                                   <Grid item
                                                         key={account.user_id}
                                                         sm={3}>
                                                       <AccountsCards
                                                           isLoading={searchState.searchQueryStatus.account !== 200}
                                                           user={account}
                                                           key={account.user_id} />
                                                   </Grid>
                                               )
                                            }
                                            )
                                        : ""
                                }
                            </Grid>
                            {accountResultsNum > 4 && searchState.primaryFilter !== SEARCH_COURSES?
                                <div className={"results-nav"}>
                                    {
                                         <IconButton disabled={currentPage.account === 1}
                                            className={"less"}
                                            onClick={handleLessResults(currentPage.account, "account")}>
                                            <LessResultsIcon />
                                        </IconButton>
                                    }
                                    {currentPage.account}
                                    {
                                         <IconButton disabled={setPageLimit(currentPage.account)}
                                            className={"more"}
                                            onClick={handleMoreResults(currentPage.account, "account")}>
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
                        {accountResultsNum && courseResultsNum !== 0&&searchState.primaryFilter !== SEARCH_ACCOUNTS? <hr /> : ""}
                        {
                            searchState.primaryFilter !== SEARCH_ACCOUNTS ? <Grid item xs={12}>
                                <Grid container
                                    justify={"space-between"}
                                    direction={"row"}
                                    alignItems="center">
                                    <Grid item className="searchResults">
                                        <Typography className={"resultsColor"} align={'left'} >
                                            {courseResultsNum > 0 && params.type !== "course" ? "Courses" : "" }
                                        </Typography>
                                    </Grid>
                                    {
                                        (courseResultsNum > 0 && searchState.primaryFilter === SEARCH_ALL) &&
                                        <Grid item style={{ "paddingRight": "1vh" }}>
                                            <Chip label="See All Courses"
                                                  className="searchChip"
                                                  onClick={displayAll(SEARCH_COURSES)}
                                            />
                                        </Grid>
                                    }
                                </Grid>
                                <Grid container spacing={8} direction={"row"}>
                                    {courses.slice(startPage(currentPage.course), endPage(currentPage.course))
                                        .map((course) => {
                                        return (
                                            <CoursesCards
                                                isLoading={searchState.searchQueryStatus.course !== 200}
                                                course={course}
                                                key={course.course_id} />
                                        )}
                                    )}
                                </Grid>
                            </Grid> : ""
                        }
                        {courseResultsNum > 4 && searchState.primaryFilter !== SEARCH_ACCOUNTS ?
                            <div className={"results-nav"}>
                                {
                                     <IconButton disabled={currentPage.course == 1}
                                        className={"less"}
                                        onClick={handleLessResults(currentPage.course, "course")}>
                                        <LessResultsIcon/>
                                    </IconButton>
                                }
                                { currentPage.course}
                                {
                                     <IconButton disabled={setPageLimit(currentPage.course)}
                                        className={"more"}
                                        onClick={handleMoreResults(currentPage.course, "course")}>
                                        <MoreResultsIcon />
                                    </IconButton>
                                }

                                </div>
                                : ""
                            }
                        </div>
                    </Paper>
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
