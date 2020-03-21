import React, {useEffect, useMemo, useState} from "react";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import LessResultsIcon from "@material-ui/icons/KeyboardArrowLeft";
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import "./Search.scss";
import {isLoading, useSearchParams} from "actions/hooks";
import {useSearchAccount, useSearchCourse} from "actions/searchActions";
import AccountFilters from "./AccountFilters";
import AccountsCards from "./cards/AccountsCards";
import CourseFilters from "./CourseFilters";
import CoursesCards from "./cards/CoursesCards";
import NoResultsPage from "./NoResults/NoResultsPage";
import SearchResultsLoader from "./SearchResultsLoader";

const toAPIPage = (page) => Math.floor((page + 1) / 2);

const getDisplay = (results, page) => {
    const selection = results[toAPIPage(page)];
    if (!selection) {
        // return dummy array
        return [];
    }
    if (page % 2 === 1) {
        return selection.slice(0, 4);
    }
    return selection.slice(4, 8);
};

const changePage = (setter, delta) => () => {
    setter((prevVal) => prevVal + delta);
};

const SearchResults = () => {
    const history = useHistory();
    const {accounts, accountResultsNum, courses, courseResultsNum} =
        useSelector(({Search}) => Search);
    const [accountsPage, setAccountsPage] = useState(1);
    const [coursePage, setCoursePage] = useState(1);

    const searchParams = useSearchParams();
    const filter = searchParams.get("filter"),
        query = searchParams.get("query"),
        sort = searchParams.get("sort");
    const accountStatus = useSearchAccount(query, toAPIPage(accountsPage),
        searchParams.get("profile"), searchParams.get("grade"), sort);
    const courseStatus = useSearchCourse(query, toAPIPage(coursePage),
        searchParams.get("course"), searchParams.get("availability"), sort);

    // go back to 1st page on query change
    useEffect(() => {
        setAccountsPage(1);
        setCoursePage(1);
    }, [query]);

    const goToFilter = (type) => () => {
        history.push({
            "pathname": "/search/",
            "search": `?query=${query}&filter=${type}`,
        });
    };

    const numResults = useMemo(() => {
        switch (filter) {
            case "account":
                return accountResultsNum;
            case "course":
                return courseResultsNum;
            default:
                return accountResultsNum + courseResultsNum;
        }
    }, [filter, accountResultsNum, courseResultsNum]);

    const statuses = useMemo(() => {
        switch (filter) {
            case "account":
                return accountStatus;
            case "course":
                return courseStatus;
            default:
                return [accountStatus, courseStatus];
        }
    }, [filter, accountStatus, courseStatus]);

    const renderAccounts = useMemo(() => {
        if (accountResultsNum === 0) {
            return <></>;
        }
        const accToDisplay = getDisplay(accounts, accountsPage);
        if (accToDisplay.length === 0) {
            return Array(4).fill(null)
                .map((_, index) => (
                    <Grid
                        item
                        key={index}
                        sm={3}>
                        <AccountsCards isLoading />
                    </Grid>
                ));
        }
        return accToDisplay.map((account) => (
            <Grid
                item
                key={account.user.id}
                sm={3}>
                <AccountsCards user={account} />
            </Grid>
        ));
    }, [accountResultsNum, accounts, accountsPage]);

    const renderCourses = useMemo(() => {
        if (courseResultsNum === 0) {
            return <></>;
        }
        const courseToDisplay = getDisplay(courses, coursePage);
        if (courseToDisplay.length === 0) {
            return Array(4).fill(null)
                .map((_, index) => (
                    <CoursesCards
                        isLoading
                        key={index} />
                ));
        }
        return courseToDisplay.map((course) => (
            <CoursesCards
                course={course}
                key={course.course_id} />
        ));
    }, [courses, coursePage, courseResultsNum]);

    if (isLoading(statuses)) {
        return (
            <SearchResultsLoader
                accountPage={accountsPage}
                coursePage={coursePage}
                numResults={numResults}
                query={query} />
        );
    }

    if (numResults === 0) {
        return <NoResultsPage />;
    }

    return (
        <Grid
            className="search-results"
            container>
            <Grid
                item
                xs={12}>
                <Paper elevation={2} className="main-search-view">
                    <Grid
                        className="searchResults"
                        item
                        xs={12}>
                        <Typography
                            align="left"
                            className="search-title"
                            variant="h3">
                            {numResults} Search Result{numResults !== 1 && "s"} for {filter} "{query}"
                        </Typography>
                    </Grid>
                    {
                        filter !== "course" &&
                        <div className="account-results-wrapper">
                            {
                                filter === "account" &&
                                <Grid
                                    item
                                    xs={12}>
                                    <Grid container>
                                        <AccountFilters />
                                    </Grid>
                                </Grid>
                            }
                            {accountResultsNum !== 0 && <hr />}
                            <Grid
                                item
                                xs={12}>
                                <Grid
                                    alignItems="center"
                                    container
                                    direction="row"
                                    justify="space-between">
                                    <Grid
                                        className="searchResults"
                                        item>
                                        <Typography
                                            align="left"
                                            className="resultsColor"
                                            gutterBottom>
                                            {accountResultsNum > 0 && "Accounts"}
                                        </Typography>
                                    </Grid>
                                    {
                                        accountResultsNum > 0 && filter !== "account" &&
                                        <Grid item >
                                            <Chip
                                                className="searchChip"
                                                label="See All Accounts"
                                                onClick={goToFilter("account")} />
                                        </Grid>
                                    }
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    spacing={16}>
                                    {
                                        renderAccounts
                                    }
                                </Grid>
                                {accountResultsNum > 4 &&
                                    <div className="results-nav">
                                        {
                                            <IconButton
                                                className="less"
                                                disabled={accountsPage === 1}
                                                onClick={changePage(setAccountsPage, -1)}>
                                                <LessResultsIcon />
                                            </IconButton>
                                        }
                                        {accountsPage}
                                        {
                                            <IconButton
                                                className="more"
                                                disabled={accountsPage * 4 >= accountResultsNum}
                                                onClick={changePage(setAccountsPage, 1)}>
                                                <MoreResultsIcon />
                                            </IconButton>
                                        }
                                    </div>
                                }
                            </Grid>
                        </div>
                    }
                    {
                        filter !== "account" &&
                        <div className="course-results-wrapper">
                            {
                                filter === "course" &&
                                <Grid
                                    item
                                    xs={12}>
                                    <Grid container>
                                        <CourseFilters />
                                    </Grid>
                                </Grid>
                            }
                            {courseResultsNum !== 0 && <hr />}
                            <Grid
                                item
                                xs={12}>
                                <Grid
                                    alignItems="center"
                                    container
                                    direction="row"
                                    justify="space-between">
                                    <Grid
                                        className="searchResults"
                                        item>
                                        <Typography
                                            align="left"
                                            className="resultsColor">
                                            {courseResultsNum > 0 && filter !== "course" && "Courses"}
                                        </Typography>
                                    </Grid>
                                    {
                                        courseResultsNum > 0 && filter !== "course" &&
                                            <Grid
                                                item
                                                style={{"paddingRight": "1vh"}}>
                                                <Chip
                                                    className="searchChip"
                                                    label="See All Courses"
                                                    onClick={goToFilter("course")} />
                                            </Grid>
                                    }
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    spacing={8}>
                                    {renderCourses}
                                </Grid>
                            </Grid>
                            {
                                courseResultsNum > 4 &&
                                <div className="results-nav">
                                    <IconButton
                                        className="less"
                                        disabled={coursePage === 1}
                                        onClick={changePage(setCoursePage, -1)}>
                                        <LessResultsIcon />
                                    </IconButton>
                                    {coursePage}
                                    <IconButton
                                        className="more"
                                        disabled={coursePage * 4 >= courseResultsNum}
                                        onClick={changePage(setCoursePage, 1)}>
                                        <MoreResultsIcon />
                                    </IconButton>
                                </div>
                            }
                        </div>
                    }
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SearchResults;
