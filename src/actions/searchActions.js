import * as types from "./actionTypes";
import {useMemo} from "react";
import {wrapUseEndpoint} from "./hooks";

export const useSearchAccount = (query, page, size, profile, grade, sort) =>
	wrapUseEndpoint("/search/account/", types.GET_ACCOUNT_SEARCH_QUERY_SUCCESS)(
		null,
		useMemo(
			() => ({
				params: {
					grade,
					page,
					size,
					profile,
					query,
					sort,
				},
			}),
			[page, query, profile, grade, sort]
		)
	);

export const useSearchCourse = (query, page, size, course, availability, sort) =>
	wrapUseEndpoint("/search/course/", types.GET_COURSE_SEARCH_QUERY_SUCCESS)(
		null,
		useMemo(
			() => ({
				params: {
					availability,
					course,
					page,
					size,
					query,
					sort,
				},
			}),
			[availability, course, page, query, sort]
		)
	);
