import React, { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import { Grid, Select, Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import AccountsCards from "./cards/AccountsCards"
import BackButton from '../../BackButton';
import Filters from "./Filters"
import "./Search.scss";



const FilterAccountsPage = (props) => {
    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <div>
            <Grid container className={'filtered-accounts'} style={{ "padding": "1em" }}>
                <Paper className={'main-search-view'} >
                    <Grid item style={{ paddingLeft: "25px", paddingTop: "25px" }}>
                        <BackButton />
                    </Grid>
                    <hr />
                    <Grid item xs={12} style={{ "padding": "1em" }}>
                        <Filters />
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container
                            justify={"space-between"}
                            direction={"row"}
                            alignItems="center">
                        </Grid>
                        {/* <Grid container spacing={16} direction={"row"}>
                            {Object.values(props.accounts).map((user) => (
                                <AccountsCards user={user} key={user.user_id} />)
                            )}
                        </Grid> */}
                    </Grid>

                </Paper>
            </Grid>
        </div>
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
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterAccountsPage);