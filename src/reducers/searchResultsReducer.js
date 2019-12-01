import initialState from './initialState';
import * as actions from "./../actions/actionTypes";

export default function course(state = initialState.SearchResults, {payload, type}) {
    switch (type) {
        case actions.GET_SEARCH_QUERY_SUCCESSFUL:
            return state;
        case actions.GET_SEARCH_QUERY_FAILED:
            return state;
        case actions.SET_SEARCH_QUERY:
            console.log(payload);
            state["SearchQuery"] = payload;
            return state;
        case actions.GET_ACCOUNT_SEARCH_QUERY_STARTED:
            console.log("search account query loading...");
            return {
                ...state,
                "searchQueryStatus":"loading",
            };
        case actions.GET_COURSE_SEARCH_QUERY_STARTED:
            console.log("search course query loading...");
            return {
                ...state,
                "searchQueryStatus":"loading",
            }
        case actions.GET_ACCOUNT_SEARCH_QUERY_SUCCESS:
            // console.log("search account query success!");
            return handleAccountSearchResults(state, payload);
        case actions.GET_ACCOUNT_SEARCH_QUERY_FAILED:
            // console.log("search account query fail!");
            return {
                ...state,
                "searchQueryStatus":"failed",
            };
        case actions.GET_COURSE_SEARCH_QUERY_SUCCESS:
            // console.log("search course query success!");
            return handleCourseSearchResults(state,payload);
        case actions.GET_COURSE_SEARCH_QUERY_FAILED:
            // console.log("search course query fail!");
            return {
                ...state,
                "searchQueryStatus":"failed",
            }
        default:
            return state;
    }
}

const handleAccountSearchResults = (state, {id, response}) =>{
    let {data} = response;
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