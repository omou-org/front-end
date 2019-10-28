import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function course(state = initialState.SearchResults, {payload, type}) {
    let newState;
    switch (type) {
        case actions.GET_SEARCH_QUERY_SUCCESSFUL:
            return state;
        case actions.GET_SEARCH_QUERY_FAILED:
            return state;
        default:
            return state;
    }
}