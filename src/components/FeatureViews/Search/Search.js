import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select/creatable';
import { Button, Grid, Select } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import * as userActions from "../../../actions/userActions";
import { connect } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import "./Search.scss";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { withRouter, Link } from 'react-router-dom';
import axios from "axios";

const Search = (props) => {
    const [query, setQuery] = useState("");
    const [primaryFilter, setPrimaryFilter] = useState("All");
    const [searchSuggestions, setSearchSuggestions] = useState(() => {
        let suggestions = [];
        suggestions = suggestions.concat(Object.values(props.students).map((student) => { return { ...student, type: "student" } }));
        suggestions = suggestions.concat(Object.values(props.parents).map((parent) => { return { ...parent, type: "parent" } }));
        suggestions = suggestions.concat(Object.values(props.instructors).map((instructor) => { return { ...instructor, type: "instructor" } }));
        suggestions = suggestions.concat(Object.values(props.courses));
        return suggestions;
    });

    const searchList = searchSuggestions.map(
        (data) => {
            if (data.gender) {
                return {
                    value: "account_" + data.type + "+" + data.name + "-" + data.user_id,
                    label: data.name
                }
            } else if (data.tuition) {
                return {
                    value: "course_" + data.course_id + "-" + data.title,
                    label: data.title,
                }
            } else {
                return {
                    value: "",
                    label: "",
                }
            }
        }
    );

    const searchFilterChange = (primaryFilter) => () => {
        switch (primaryFilter) {
            case "All":
                let suggestions = [];
                suggestions = suggestions.concat(Object.values(props.students).map((student) => { return { ...student, type: "student" } }));
                suggestions = suggestions.concat(Object.values(props.parents).map((parent) => { return { ...parent, type: "parent" } }));
                suggestions = suggestions.concat(Object.values(props.instructors).map((instructor) => { return { ...instructor, type: "instructor" } }));
                suggestions = suggestions.concat(Object.values(props.courses));
                setSearchSuggestions(suggestions);
                break;
            case "Account":
                let accountSuggestions = [];
                accountSuggestions = accountSuggestions.concat(Object.values(props.students).map((student) => { return { ...student, type: "student" } }));
                accountSuggestions = accountSuggestions.concat(Object.values(props.parents).map((parent) => { return { ...parent, type: "parent" } }));
                accountSuggestions = accountSuggestions.concat(Object.values(props.instructors).map((instructor) => { return { ...instructor, type: "instructor" } }));
                setSearchSuggestions(accountSuggestions);
                break;
            case "Course":
                setSearchSuggestions(Object.values(props.courses));
                break;
            default:
                return

        }
    }

    const customStyles = {
        control: (base, state) => ({
            ...base,
            border: '0 !important',
            // This line disable the blue border
            boxShadow: '0 !important',
            '&:hover': {
                border: '0 !important'
            }
        })
    };

    const handleFilterChange = (filter) => (e) => {
        setPrimaryFilter(e.target.value);
        searchFilterChange(e.target.value)
    };

    const handleSearchChange = () => (e) => {
        if (e) {
            // let value = e.value;
            // let endTypeIndex = value.indexOf("_");
            // let type = value.substring(0,endTypeIndex);
            // switch(type){
            //     case "account":
            //         let startTypeIndex = value.indexOf("_")+1;
            //         endTypeIndex = value.indexOf("+");
            //         let startIDIndex = value.indexOf("-")+1;
            //         type = value.substring(startTypeIndex,endTypeIndex);
            //         let accountID = value.substring(startIDIndex, value.length);
            //         props.history.push("/accounts/"+type+"/"+accountID);
            //         break;
            //     case "course":
            //         let startTitleIndex = value.indexOf("-");
            //         let courseID = value.substring(endTypeIndex+1,startTitleIndex);
            //         let courseTitle = value.substring(startTitleIndex+1, value.length);
            //         props.history.push("/registration/course/"+courseID+"/"+courseTitle);
            // }
            setQuery(e);
        } else {
            setQuery("");
        }

    };

    const handleMenuClick = () => (e) => {
        e.preventDefault();
        let value = query.value;
        let endTypeIndex = value.indexOf("_");
        let type = value.substring(0, endTypeIndex);
        switch (type) {
            case "account":
                let startTypeIndex = value.indexOf("_") + 1;
                endTypeIndex = value.indexOf("+");
                let startIDIndex = value.indexOf("-") + 1;
                type = value.substring(startTypeIndex, endTypeIndex);
                let accountID = value.substring(startIDIndex, value.length);
                props.history.push("/accounts/" + type + "/" + accountID);
                break;
            case "course":
                let startTitleIndex = value.indexOf("-");
                let courseID = value.substring(endTypeIndex + 1, startTitleIndex);
                let courseTitle = value.substring(startTitleIndex + 1, value.length);
                props.history.push("/registration/course/" + courseID + "/" + courseTitle);
        }
    }

    const handleQuery = () => (e) => {
        e.preventDefault();
        props.history.push(`/search/${primaryFilter.toLowerCase()}/${query.label}`);
    };

    const handleOnFocus = (primaryFilter) => (e) => {
        setQuery("");
        switch (primaryFilter) {
            case "All":
                let suggestions = [];
                suggestions = suggestions.concat(Object.values(props.students).map((student) => { return { ...student, type: "student" } }));
                suggestions = suggestions.concat(Object.values(props.parents).map((parent) => { return { ...parent, type: "parent" } }));
                suggestions = suggestions.concat(Object.values(props.instructors).map((instructor) => { return { ...instructor, type: "instructor" } }));
                suggestions = suggestions.concat(Object.values(props.courses));
                setSearchSuggestions(suggestions);
                break;
            case "Accounts":
                let accountSuggestions = [];
                accountSuggestions = accountSuggestions.concat(Object.values(props.students).map((student) => { return { ...student, type: "student" } }));
                accountSuggestions = accountSuggestions.concat(Object.values(props.parents).map((parent) => { return { ...parent, type: "parent" } }));
                accountSuggestions = accountSuggestions.concat(Object.values(props.instructors).map((instructor) => { return { ...instructor, type: "instructor" } }));
                setSearchSuggestions(accountSuggestions);
                break;
            case "Courses":
                setSearchSuggestions(Object.values(props.courses));
                break;
            default:
                return

        }
    }

    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <Grid container
            className={'search'}
        >
            <Grid item xs={2} />
            <Grid item xs={10} >
                <form onSubmit={handleQuery()}>
                    <Grid container >
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
                                >
                                    <MenuItem value={"All"} key={"All"} >
                                        All
                                    </MenuItem>
                                    <MenuItem value={"Account"} key={"Accounts"}>
                                        Account
                                    </MenuItem>
                                    <MenuItem value={"Course"} key={"Courses"}>
                                        Course
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={10} xs={7}>
                            <ReactSelect
                                isClearable
                                className={"search-input"}
                                classNamePrefix="main-search"
                                options={searchList}
                                value={query}
                                onFocus={handleOnFocus(primaryFilter)}
                                onChange={handleSearchChange()}
                                onMenuSelect
                                closeMenuOnScroll={true}
                            />

                        </Grid>
                        <Grid item style={{ paddingTop: "1px" }}>
                            <Button
                                className={"button-background"}
                                component={Link}
                                onClick={handleQuery()}
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
    "course": state.Search.courses,
    "state": state,
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
    "userActions": bindActionCreators(userActions, dispatch)
});

export default withRouter(
    connect(mapStateToProps,
        mapDispatchToProps)
        (Search));