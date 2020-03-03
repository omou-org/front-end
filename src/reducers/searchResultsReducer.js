import initialState from './initialState';
import * as actions from "./../actions/actionTypes";
import {SEARCH_ALL} from "../actions/actionTypes";

export default function course(state = initialState.SearchResults, { payload, type }) {
    let status = 1;
    if(payload){
        if( payload.response && Object.keys(payload.response).length > 0 && payload.response.status){
            status = payload.response.status;
        } else if(payload.status){
            status = payload.status;
        }
    }

    switch (type) {
        case actions.GET_SEARCH_QUERY_SUCCESSFUL:
            return state;
        case actions.GET_SEARCH_QUERY_FAILED:
            return state;
        case actions.SET_SEARCH_QUERY:
            state["SearchQuery"] = payload;
            return state;
        case actions.GET_ACCOUNT_SEARCH_QUERY_STARTED:
            return handleSearchStatus(state, "account", status);
        case actions.GET_COURSE_SEARCH_QUERY_STARTED:
            return handleSearchStatus(state, "course", status);
        case actions.GET_ACCOUNT_SEARCH_QUERY_SUCCESS:
            return handleAccountSearchResults(state, payload, status);
        case actions.GET_ACCOUNT_SEARCH_QUERY_FAILED:
            return handleSearchStatus(state, "account", status);
        case actions.GET_COURSE_SEARCH_QUERY_SUCCESS:
            return handleCourseSearchResults(state, payload, status);
        case actions.GET_COURSE_SEARCH_QUERY_FAILED:
            return handleSearchStatus(state, "course", status);
        case actions.UPDATE_SEARCH_FILTER:
            return handleSearchFilterChange(state, payload);
        case actions.UPDATE_SEARCH_STATUS:
            return {
                ...state,
                searchQueryStatus: {
                    ...state.searchQueryStatus,
                    status: payload,
                }
            };
        case actions.UPDATE_PRIMARY_SEARCH_FILTER:
            return {
                ...state,
                primaryFilter: payload,
            };
        case actions.RESET_SEARCH_PARAMS:
            return {
                ...state,
                params: {
                    account: {
                        profile: "",
                        gradeFilter: "",
                        sortAccount: "",
                        accountPage: 1,
                    },
                    course: {
                        courseType: "",
                        availability: "",
                        sortCourse: "",
                        coursePage: 1,
                    }
                },
                primaryFilter: SEARCH_ALL,
            }
        default:
            return state;
    }
}

const handleAccountSearchResults = (state, payload, status) => {
    let { response } = payload;
    let { data } = response;

    // you can get page and count
    return {
        ...state,
        accounts:data.results,
        account_num_results:data.count,
        searchQueryStatus: {
            ...state.searchQueryStatus,
            account: status,
        },
        params: {
            account: {
                ...state.params.account,
                accountPage: data.page,
            },
            course: {
                ...state.params.course,
            }
        },
    }
};

const handleCourseSearchResults = (state, { id, response }, status) => {
    let { data } = response;
    return {
        ...state,
        courses: data.results,
        course_num_results: data.count,
        searchQueryStatus: {
            ...state.searchQueryStatus,
            course: status,
        },
        params: {
            account: {
                ...state.params.account,
            },
            course: {
                ...state.params.course,
                coursePage: data.page,
            }
        },
    }
};

const handleSearchFilterChange = (state, { searchType, filter, value }) => {
    let newState = { ...state };
    newState.params[searchType][filter] = value;
    if (filter === "grade") {
        newState.params[searchType].profile = "student";
    }
    newState.searchQueryStatus = "";
    return newState
};

const handleSearchStatus = (state, searchType, status) => {
    return {
        ...state,
        searchQueryStatus: {
            ...state.searchQueryStatus,
            [searchType]: status,
        }
    }
}
