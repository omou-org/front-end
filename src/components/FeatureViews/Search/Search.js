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
import {IS_SEARCHING, NOT_SEARCHING, SEARCH_ACCOUNTS, SEARCH_ALL, SEARCH_COURSES} from "../../../actions/actionTypes";

const Search = (props) => {
    const [query, setQuery] = useState("");
    const [primaryFilter, setPrimaryFilter] = useState(SEARCH_ALL);
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    const [accountRequestConfig, setAccountRequestConfig] = useState({
        params: { query: query.label, page: 1, }
    });
    const [courseRequestConfig, setCourseRequestConfig] = useState({
        params: { query: query.label, page: 1,  }
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
            if(availability && availability !== "both"){
                baseConfig.params["availability"] = availability;
            }
            if(sortCourse && sortCourse !== "relevance"){
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
            case SEARCH_ALL:{
                suggestions = props.search.accounts.concat(props.search.courses);
                break;
            }
            case SEARCH_ACCOUNTS:{
                suggestions = props.search.accounts;
                break;
            }
            case SEARCH_COURSES:{
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
                } else if (data.course_type) {
                    return {
                        value: "course_" + data.id + "-" + data.subject,
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
        // if(newItem){
        //     suggestions.push(newItem);
        // }
        setSearchSuggestions(suggestions);
    };

    useEffect(()=>{
        if(query.label && query.label !== ""){
            if((query.label.length === 1 || query.label.length >= 4)){
                filterSuggestions()();
            }
        }
    },[query]);
    useEffect(()=>{
        if(searchState.searchQueryStatus === "success"){
            searchList();
        }
    },[props.search.searchQueryStatus]);

    const handleFilterChange = (filter) => (e) => {
        setPrimaryFilter(e.target.value);
        api.updatePrimarySearchFilter(e.target.value);
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
            case SEARCH_ALL:{
                api.fetchSearchAccountQuery(accountRequestConfig);
                api.fetchSearchCourseQuery(courseRequestConfig);
                api.fetchInstructors();
                break;
            }
            case SEARCH_ACCOUNTS:{
                api.fetchSearchAccountQuery(accountRequestConfig);
                break;
            }
            case SEARCH_COURSES:{
                api.fetchSearchCourseQuery(courseRequestConfig);
                api.fetchInstructors();
                break;
            }
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        handleQuery();
    };

    const handleQuery = () => {
        if(query.label){
            api.setSearchQuery(query.label);
            api.updateSearchStatus(IS_SEARCHING);

            if(!location.pathname.includes("search")){
                history.push({
                    pathname:'/search/',
                    search: `?query=${SearchQuery}`
                });
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
        api.setSearchQuery(e);
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
                <form onSubmit={handleSubmit}>
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
                                    <MenuItem value={SEARCH_ALL} key={"All"} >
                                        All
                                    </MenuItem>
                                    <MenuItem value={SEARCH_ACCOUNTS} key={"Accounts"}>
                                        Account
                                    </MenuItem>
                                    <MenuItem value={SEARCH_COURSES} key={"Courses"}>
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
