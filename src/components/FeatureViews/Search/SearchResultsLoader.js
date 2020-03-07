import React from 'react';
import {Grid, IconButton} from "@material-ui/core";
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import AccountsCards from "./cards/AccountsCards"
import CoursesCards from "./cards/CoursesCards"
import "./Search.scss";
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";
import LessResultsIcon from "@material-ui/icons/KeyboardArrowLeft";
import Chip from "@material-ui/core/Chip";

const SearchResultsLoader = ({SearchResults,SearchQuery, accountPage, coursePage}) => {
    return (
        <Grid container className={'search-results'} >
            <Grid item xs={12}>
                    <Paper className={'main-search-view'} >
                        <Grid item xs={12} className="searchResults">
                            <Typography
                                className={"search-title"}
                                variant={"h3"}
                                align={"left"}>
                                {SearchResults } Search Results for "{SearchQuery}"
                        </Typography>
                        </Grid>
                        <div className="account-results-wrapper">
                        <Grid item xs={12}>
                            <hr/>
                            <Grid container
                                justify={"space-between"}
                                direction={"row"}
                                alignItems="center">
                                <Grid item className="searchResults">
                                    <Typography className={"resultsColor"} align={'left'} gutterBottom>
                                        Accounts
                                    </Typography>
                                </Grid>
                                <Grid item >
                                    <Chip label="See All Accounts"
                                          className="searchChip"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={16} direction={"row"}>
                                {
                                    [1,2,3,4].map((account) => {
                                                // console.log(account)
                                               return (
                                                   <Grid item
                                                         key={account}
                                                         sm={3}>
                                                       <AccountsCards
                                                           isLoading={true}
                                                           key={account} />
                                                   </Grid>
                                               )
                                            })
                                }
                            </Grid>
                            <div className={"results-nav"}>
                                {
                                    <IconButton disabled className={"less"}>
                                        <LessResultsIcon />
                                    </IconButton>
                                }
                                {accountPage}
                                {
                                    <IconButton disabled className={"more"}>
                                        <MoreResultsIcon />
                                    </IconButton>
                                }

                            </div>
                        </Grid>
                    </div>
                    <div className={"course-results-wrapper"}>
                        <hr/>
                        <Grid item xs={12}>
                            <Grid container
                                  justify={"space-between"}
                                  direction={"row"}
                                  alignItems="center">
                                <Grid item className="searchResults">
                                    <Typography className={"resultsColor"} align={'left'} >
                                       Courses
                                    </Typography>
                                </Grid>
                                <Grid item style={{ "paddingRight": "1vh" }}>
                                    <Chip label="See All Courses"
                                          className="searchChip"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={8} direction={"row"}>
                                {[1,2,3,4].map((course) => {
                                        return (
                                            <CoursesCards
                                                isLoading={true}
                                                key={course} />
                                        )}
                                    )}
                            </Grid>
                        </Grid>
                        <div className={"results-nav"}>
                            <IconButton disabled className={"less"}>
                                <LessResultsIcon/>
                            </IconButton>
                            {coursePage}
                            <IconButton disabled className={"more"}>
                                <MoreResultsIcon />
                            </IconButton>
                        </div>
                        </div>
                    </Paper>
            </Grid>
        </Grid>
    )
};

export default SearchResultsLoader;
