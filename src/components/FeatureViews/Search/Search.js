import React, {useEffect, useMemo, useState} from 'react';
import ReactSelect from 'react-select/creatable';
import {components} from 'react-select';
import { Button, Grid, Select } from "@material-ui/core";
import { bindActionCreators } from "redux";
import * as searchActions from "../../../actions/searchActions";
import * as userActions from "../../../actions/userActions";
import {connect, useDispatch} from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import "./Search.scss";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { withRouter, Link } from 'react-router-dom';
import axios from "axios";
import * as apiActions from "../../../actions/apiActions";
import * as registrationActions from "../../../actions/registrationActions";
import windowSize from 'react-window-size';

const Search = (props) => {
    const [query, setQuery] = useState("");
    const [primaryFilter, setPrimaryFilter] = useState("All");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const requestConfig = { params: { query: query.label, page: 1,  },
        headers: {"Authorization": `Token ${props.auth.token}`,} };
    const [isMobileSearching, setMobileSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState(false);

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

    const searchList = (newItem) => {
        let suggestions;
        switch(primaryFilter){
            case "All":{
                suggestions = props.search.accounts.concat(props.search.courses);
                break;
            }
            case "Account":{
                suggestions = props.search.accounts;
                break;
            }
            case "Course":{
                suggestions =props.search.courses;
            }
        }
        suggestions = suggestions.map(
            (data) => {
                if (data.user) {
                    return {
                        value: "account_" + data.account_type.toLowerCase() + "+" + data.user.first_name+" "+data.user.last_name + "-" + data.user.id,
                        label: data.user.first_name + " " + data.user.last_name,
                    }
                } else if (data.course_id) {
                    return {
                        value: "course_" + data.course_id + "-" + data.title,
                        label: data.subject,
                    }
                } else {
                    return {
                        value: "",
                        label: "",
                    }
                }
            }
        );
        if(newItem){
            suggestions.push(newItem);
        }
        setSearchSuggestions(suggestions);
    };
    
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

    useEffect(()=>{
        setSearchStatus(false);
        if(query.label!==""){
            filterSuggestions()();
        }
    },[query]);
    useEffect(()=>{
        searchList();
    },[props.search.searchQueryStatus]);

    const handleFilterChange = (filter) => (e) => {
        setPrimaryFilter(e.target.value);
    };

    const handleSearchChange = () => (e) => {
        if(e){
            setQuery(e);
            handleQuery()();
        }
    };

    const filterSuggestions = ()=> (e)=>{
        // e.preventDefault();
        switch(primaryFilter){
            case "All":{
                api.fetchSearchAccountQuery(requestConfig);
                api.fetchSearchCourseQuery(requestConfig);
                break;
            }
            case "Accounts":{
                api.fetchSearchAccountQuery(requestConfig);
                break;
            }
            case "Courses":{
                api.fetchSearchCourseQuery(requestConfig);
                break;
            }
        }
    }

    const handleQuery = () => (e) => {
        // console.log(primaryFilter.toLowerCase(),query.label);
        props.history.push(`/search/${primaryFilter.toLowerCase()}/${query.label}`);
    };

    const handleInputChange = () => (e)=>{
        let input = {
            value: e,
            label: e
        };
        searchList(input);
        setQuery(input);
        if(props.windowWidth < 800 && e !== ""){
            setMobileSearching(true);
            props.onMobile(true);
        } else if(props.windowWidth < 800 && e === ""){
            setMobileSearching(false);
            props.onMobile(false);
        }

    };

    const renderSearchIcon = props =>{
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <SearchIcon className={"search-icon-main"}/>
                </components.DropdownIndicator>
            )
        );
    }

    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <Grid container
            className={'search'}
        >
            { !isMobileSearching && <Grid item xs={2} />}
            <Grid item xs={isMobileSearching ? 12 : 10} >
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
                        <Grid item md={10} xs={isMobileSearching ? 10 : 7}>
                            <ReactSelect
                                className={"search-input"}
                                classNamePrefix="main-search"
                                options={searchSuggestions}
                                value={query}
                                onChange={handleSearchChange()}
                                onInputChange={handleInputChange()}
                                // onCreateOption={handleInputChange()}
                                components={{DropdownIndicator: renderSearchIcon}}
                            />
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
    "search": state.Search,
    "auth": state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    "searchActions": bindActionCreators(searchActions, dispatch),
    "userActions": bindActionCreators(userActions, dispatch)
});

export default windowSize(
    withRouter(
    connect(mapStateToProps,
        mapDispatchToProps)
        (Search)));