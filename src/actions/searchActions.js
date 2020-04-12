import * as types from "./actionTypes";
import {useMemo, wrapGet} from "react";
import {wrapUseEndpoint} from "./hooks";

export const useSearchAccount = (query, page, profile, grade, sort) =>
    wrapUseEndpoint("/search/account/", types.GET_ACCOUNT_SEARCH_QUERY_SUCCESS)(
        null, useMemo(() => ({
            "params": {
                grade,
                page,
                profile,
                query,
                sort,
            },
        }), [page, query, profile, grade, sort])
    );

export const useSearchCourse = (query, page, course, availability, sort) =>
    wrapUseEndpoint("/search/course/", types.GET_COURSE_SEARCH_QUERY_SUCCESS)(
        null, useMemo(() => ({
            "params": {
                availability,
                course,
                page,
                query,
                sort,
            },
        }), [availability, course, page, query, sort])
    );

export const useSearchSession = () =>
    wrapGet("/search/session/?date=today&page=1/", types.GET_SESSION_SEARCH_QUERY_SUCCESS);

