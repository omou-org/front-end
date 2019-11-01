import React, { useState } from 'react';
import ReactSelect from 'react-select';
import { Button, Grid, Select } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import { connect } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import "./Search.scss";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";




const Search = () => {
    const [query, setQuery] = useState('');
    const [primaryFilter, setPrimaryFilter] = useState("All");

    const handleFilterChange = (filter) => (e) => {
        setPrimaryFilter(e.target.value);
    };
    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <Grid container
            className={'search'}
        >
            <Grid item xs={1} />
            <Grid item xs={11}>
                <form>
                    <Grid container>
                        <Grid item >
                            <FormControl required variant="outlined" className={"search-selector"}>
                                <Select className={'select-primary-filter'}
                                    // classNamePrefix={''}
                                    disableUnderline
                                    displayEmpty={false}
                                    value={primaryFilter}
                                    onChange={handleFilterChange(primaryFilter)}
                                    inputProps={{
                                        name: 'primary-filter',
                                        id: 'primary-filter',
                                    }}
                                    variant="outlined"
                                >
                                    <MenuItem value={"All"} key={"All"}>
                                        <em>All</em>
                                    </MenuItem>
                                    <MenuItem value={"Accounts"} key={"Accounts"}>
                                        <em>Accounts</em>
                                    </MenuItem>
                                    <MenuItem value={"Courses"} key={"Courses"}>
                                        <em>Courses</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={9} xs={7}>
                            <ReactSelect
                                className={"search-input"}
                                classNamePrefix="main-search"
                            />
                        </Grid>
                        <Grid item>
                            <Button className={"button-background"}> <SearchIcon className={"searchIcon"} /> </Button>
                        </Grid>
                    </Grid>
                </form>
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
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);