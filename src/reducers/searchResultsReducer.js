import initialState from './initialState';
import * as actions from "./../actions/actionTypes";

export default function course(state = initialState.SearchResults, {payload, type}) {
    switch (type) {
        case actions.GET_SEARCH_QUERY_SUCCESSFUL:
            return state;
        case actions.GET_SEARCH_QUERY_FAILED:
            return state;
        case actions.SET_SEARCH_QUERY:
            state["SearchQuery"] = payload;
            return state;
        case actions.GET_ACCOUNT_SEARCH_QUERY_STARTED:
            return {
                ...state,
                "searchQueryStatus":"loading",
            };
        case actions.GET_COURSE_SEARCH_QUERY_STARTED:
            return {
                ...state,
                "searchQueryStatus":"loading",
            }
        case actions.GET_ACCOUNT_SEARCH_QUERY_SUCCESS:
            return handleAccountSearchResults(state, payload);
        case actions.GET_ACCOUNT_SEARCH_QUERY_FAILED:
            return {
                ...state,
                "searchQueryStatus":"failed",
            };
        case actions.GET_COURSE_SEARCH_QUERY_SUCCESS:
            return handleCourseSearchResults(state,payload);
        case actions.GET_COURSE_SEARCH_QUERY_FAILED:
            return {
                ...state,
                "searchQueryStatus":"failed",
            };
        case actions.UPDATE_SEARCH_FILTER:
            return handleSearchFilterChange(state, payload);
        default:
            return state;
    }
}

const handleAccountSearchResults = (state, {response, id}) =>{
    let {data}= response;
    return {
        ...state,
        accounts:data,
        searchQueryStatus: "success"
    }
};

const handleCourseSearchResults = (state, {id, response}) =>{
    let {data} = response;
    return {
        ...state,
        courses:data,
        searchQueryStatus: "success"
    }
};

const handleSearchFilterChange = (state, {searchType, filter, value}) =>{
    let newState = {...state};
    newState.params[searchType][filter] = value;
    if(filter==="grade"){
        newState.params[searchType].profile = "student";
    }
    newState.searchQueryStatus = "";
    return newState
}
