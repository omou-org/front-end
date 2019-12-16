import * as types from './actionTypes';
import axios from "axios";
import {instance, wrapGet, wrapPatch} from "./apiActions";

const accountSearchURL = `/search/account/`;
const courseSearchURL = `/search/course/`;


export const fetchSearchAccountQuery = (searchConfig) => wrapGet(
    accountSearchURL,
    [
        types.GET_ACCOUNT_SEARCH_QUERY_STARTED,
        types.GET_ACCOUNT_SEARCH_QUERY_SUCCESS,
        types.GET_ACCOUNT_SEARCH_QUERY_FAILED,
    ],
    {config:searchConfig}
);

export const fetchSearchCourseQuery = (searchConfig) => wrapGet(
    courseSearchURL,
    [
        types.GET_COURSE_SEARCH_QUERY_STARTED,
        types.GET_COURSE_SEARCH_QUERY_SUCCESS,
        types.GET_COURSE_SEARCH_QUERY_FAILED,
    ],
    {config:searchConfig}
);

export function setSearchQuery(event) {
    return { type: types.SET_SEARCH_QUERY, payload: event}
}

export const updateSearchFilter = (searchType,filter, value) => {
    return {type: types.UPDATE_SEARCH_FILTER, payload: { searchType: searchType, filter: filter, value: value}};
}