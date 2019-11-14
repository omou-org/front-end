import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import * as userActions from "../../../actions/userActions";
import { Link } from "react-router-dom"



const Search = (props) => {
    const [query, setQuery] = useState("");
    const [primaryFilter, setPrimaryFilter] = useState("All");
    const [searchResult, setSearchResult] = useState("")

    useEffect(() => {
        // props.userActions.fetchStudents()

    })


    const getAllData = () => {
        let accounts = [props.students, props.instructors, props.parents]
        console.log(accounts)
    }

    getAllData()

    // const searchList = searchResult.map((data) => {

    //     return {
    //         value: data.first_name,
    //         label: data.first_name
    //     }
    // })


    const searchFilterChange = (primaryFilter) => {
        switch (primaryFilter) {
            case "All":
                //set the state to accounts & course array
                break;
            case "Accounts":
                setSearchResult(props.accounts);
                break;
            case "Courses":
                setSearchResult(props.course);
                break;
            default:
                return

        }
    }

    const onQueryChange = (e) => {
        setQuery(e)
    }

    const handleFilterChange = (filter) => (e) => {

        setPrimaryFilter(e.target.value);
        searchFilterChange(e.target.value)
    };
    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (

        <Grid container
            className={'search'}
        >
            <Grid item xs={2} />
            <Grid item xs={10}>
                <form>
                    <Grid container>
                        {/* <Grid item  >
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
                                >
                                    <MenuItem value={"All"} key={"All"} >
                                        All
                                    </MenuItem>
                                    <MenuItem value={"Accounts"} key={"Accounts"}>
                                        Account
                                    </MenuItem>
                                    <MenuItem value={"Courses"} key={"Courses"}>
                                        Courses
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid> */}
                        <Grid item md={9} xs={7}>
                            <ReactSelect
                                className={"search-input"}
                                classNamePrefix="main-search"
                                value={query}
                                // options={searchList}
                                onChange={onQueryChange}
                                openMenuOnClick={false}
                            />
                        </Grid>
                        <Grid item style={{ paddingTop: "1px" }}>
                            <Button
                                className={"button-background"}
                                component={Link}
                                to={`/search/${query.value}/`}
                            > <SearchIcon className={"searchIcon"} /> </Button>
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
    "accounts": state.Search.accounts,
    "course": state.Search.courses
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
    "userActions": bindActionCreators(userActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);