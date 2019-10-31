import React, { useState } from 'react';
import ReactSelect from 'react-select';
import {Grid, Select} from "@material-ui/core";
import {bindActionCreators} from "redux";
import * as searchActions from "../../../actions/searchActions";
import {connect} from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputBase from "@material-ui/core/InputBase";


const SearchResults = ()=>{
    const [query, setQuery ] = useState('');
    const [primaryFilter, setPrimaryFilter] = useState("All");

    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <Grid container className={'search-results'}>

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
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResults);