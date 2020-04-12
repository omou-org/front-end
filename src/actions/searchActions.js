import * as types from "./actionTypes";
import {useMemo} from "react";
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
    wrapUseEndpoint("/search/session/?time=today", types.GET_SESSION_SEARCH_QUERY_SUCCESS);