import React, {useEffect, useMemo, useState} from 'react';
import ReactSelect from 'react-select/creatable';
import {components} from 'react-select';
import {Grid, Select} from "@material-ui/core";
import {bindActionCreators} from "redux";
import * as searchActions from "../../../actions/searchActions";
import * as userActions from "../../../actions/userActions";
import {connect, useDispatch, useSelector} from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import "./Search.scss";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import * as apiActions from "../../../actions/apiActions";
import * as registrationActions from "../../../actions/registrationActions";
import windowSize from 'react-window-size';
import {IS_SEARCHING, NOT_SEARCHING} from "../../../actions/actionTypes";

const Search = (props) => {
    const [query, setQuery] = useState("");
    const [primaryFilter, setPrimaryFilter] = useState("All");
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    const [accountRequestConfig, setAccountRequestConfig] = useState({
        params: { query: query.label, page: 1, },
        headers: {"Authorization": `Token ${props.auth.token}`,}
    });
    const [courseRequestConfig, setCourseRequestConfig] = useState({
        params: { query: query.label, page: 1,  },
        headers: {"Authorization": `Token ${props.auth.token}`,}
    });
    const searchState = useSelector(({Search}) => Search);

    const history = useHistory();
    const location = useLocation();

    const [isMobileSearching, setMobileSearching] = useState(false);

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
    const {SearchQuery, "params":{account, course}} = searchState;
    const {profile, gradeFilter, sortAccount, accountPage} = account;
    const {courseType, availability, sortCourse, coursePage} = course;

    useEffect(()=>{
        let prevSearchQuery = sessionStorage.getItem("SearchQuery");
        prevSearchQuery = prevSearchQuery && prevSearchQuery.substr(1, prevSearchQuery.length-2);
        if(SearchQuery !== prevSearchQuery){
            api.setSearchQuery(prevSearchQuery);
        }
    },[]);

    // Fetching account results
    useEffect(()=>{
        if(searchState.SearchQuery && searchState.SearchQuery !== ""){
            let quickQuery = {
                value: searchState.SearchQuery,
                label: searchState.SearchQuery,
            };
            setQuery(quickQuery);
            let baseConfig = {
                ...accountRequestConfig,
                params: {
                    query:SearchQuery,
                    page: accountPage,
                }
            };
            if(profile){
                baseConfig.params["profile"] = profile;
            }
            if(gradeFilter){
                baseConfig.params["grade"] = Number(gradeFilter);
                baseConfig.params["profile"] = "student";
                api.updateSearchParam("account", "profile", "student");
            }
            if(sortAccount){
                baseConfig.params["sort"] = sortAccount;
            }
            setAccountRequestConfig(baseConfig);
            api.updateSearchStatus(NOT_SEARCHING);
            filterSuggestions();
        }
    },[SearchQuery, profile, gradeFilter, sortAccount, accountPage]);

    //Fetch Course results
    useEffect(()=>{
        if(SearchQuery){
            let quickQuery = {
                value: SearchQuery,
                label: SearchQuery,
            };
            setQuery(quickQuery);
            let baseConfig = {
                ...courseRequestConfig,
                params: {
                    query: SearchQuery,
                    page: coursePage,
                }
            };
            if(courseType){
                baseConfig.params["course"] = courseType;
            }
            if(availability){
                baseConfig.params["availability"] = availability;
            }
            if(sortCourse){
                baseConfig.params["sort"] = sortCourse;
            }
            setCourseRequestConfig(baseConfig);
            api.updateSearchStatus(NOT_SEARCHING);
            filterSuggestions();
        }
    },[SearchQuery, courseType, availability, sortCourse, coursePage]);

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

    useEffect(()=>{
        if(query.label!==""){
            filterSuggestions()();
        }
    },[query]);
    useEffect(()=>{
        if(searchState.searchQueryStatus === "success"){
            searchList();
        }
    },[props.search.searchQueryStatus]);

    const handleFilterChange = (filter) => (e) => {
        setPrimaryFilter(e.target.value);
    };

    const handleSearchChange = () => (e) => {
        if(e){
            setQuery(e);
            if(e.value){
                handleQuery();
            }
        }
    };

    const filterSuggestions = ()=> (e)=>{
        // e.preventDefault();
        switch(primaryFilter){
            case "All":{
                api.fetchSearchAccountQuery(accountRequestConfig);
                api.fetchSearchCourseQuery(courseRequestConfig);
                api.fetchInstructors();
                break;
            }
            case "Accounts":{
                api.fetchSearchAccountQuery(accountRequestConfig);
                break;
            }
            case "Courses":{
                api.fetchSearchCourseQuery(courseRequestConfig);
                api.fetchInstructors();
                break;
            }
        }
    }

    const handleQuery = e => {
        if(query.label){
            api.setSearchQuery(query.label);
            api.updateSearchStatus(IS_SEARCHING);
            if(!location.pathname.includes("search")){
                history.push(`/search/`);
            }
        }
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
    };

    useEffect(()=>{
        sessionStorage.setItem("SearchQuery", JSON.stringify(SearchQuery));
    },[SearchQuery]);


    return (
        <Grid container
            className={'search'}
        >
            { !isMobileSearching && <Grid item xs={2} />}
            <Grid item xs={isMobileSearching ? 12 : 10} >
                <form onSubmit={handleQuery}>
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

export default
    withRouter(
    connect(mapStateToProps,
        mapDispatchToProps)
        (windowSize(Search)));