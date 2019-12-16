import * as types from "./actionTypes";
import {instance, MISC_FAIL, REQUEST_ALL, REQUEST_STARTED} from "./apiActions";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";

export const isFail = (...statuses) =>
    statuses.some((status) => status && status !== REQUEST_STARTED && (status < 200 || status >= 300));

export const isLoading = (...statuses) =>
    statuses.some((status) => !status || status === REQUEST_STARTED) && !isFail(...statuses);

export const isSuccessful = (...statuses) =>
    statuses.every((status) => status && (status >= 200 && status < 300));

/**
 * Wrapper for hooks to use certain GET endpoints
 * For the function used by the components:
 * @param {Number} id Single ID to fetch, array of IDs to fetch data for, or undefined/null/falsey to fetch all (see second parameter)
 * @param {Boolean} noFetchOnUndef If true, undefined/null/falsey does NOT fetch all (nothing is fetched). Useful with an ID that may be undefined until some other data comes in, in order to avoid a fetch all being called (Optimization).
 * @returns {Number} status of the request (null if not started/canceled)
 */
export const wrapUseEndpoint = (endpoint, successType) => (id, noFetchOnUndef) => {
    const token = useSelector(({auth}) => auth.token);
    const [status, setStatus] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        let aborted = false;
        if (!id) {
            if (!noFetchOnUndef) {
                (async () => {
                    try {
                        setStatus(REQUEST_STARTED);
                        const response = await instance.get(
                            endpoint,
                            {
                                "headers": {
                                    "Authorization": `Token ${token}`,
                                },
                            }
                        );
                        if (!aborted) {
                            dispatch({
                                "type": successType,
                                "payload": {
                                    "id": REQUEST_ALL,
                                    response,
                                },
                            });
                            setStatus(response.status);
                        }
                    } catch (err) {
                        if (!aborted) {
                            setStatus((err && err.response && err.response.status) || MISC_FAIL);
                        }
                    }
                })();
            }
        } else if (!Array.isArray(id)) {
            (async () => {
                try {
                    setStatus(REQUEST_STARTED);
                    const response = await instance.get(
                        `${endpoint}${id}/`,
                        {
                            "headers": {
                                "Authorization": `Token ${token}`,
                            },
                        }
                    );
                    if (!aborted) {
                        dispatch({
                            "type": successType,
                            "payload": {
                                id,
                                response,
                            },
                        });
                        setStatus(response.status);
                    }
                } catch (err) {
                    if (!aborted) {
                        setStatus((err && err.response && err.response.status) || MISC_FAIL);
                    }
                }
            })();
        } else if (id.length > 0) {
            (async () => {
                try {
                    setStatus(REQUEST_STARTED);
                    const response = await Promise.all(id.map(
                        (individual) => instance.get(
                            `${endpoint}${individual}/`,
                            {
                                "headers": {
                                    "Authorization": `Token ${token}`,
                                },
                            }
                        )
                    ));
                    if (!aborted) {
                        dispatch({
                            "type": successType,
                            "payload": {
                                id,
                                response,
                            },
                        });
                        setStatus(response[0].status);
                    }
                } catch (err) {
                    if (!aborted) {
                        setStatus((err && err.response && err.response.status) || MISC_FAIL);
                    }
                }
            })();
        }
        return () => {
            setStatus(null);
            aborted = true;
        };
    }, [dispatch, id, token, noFetchOnUndef]);
    return status;
};

export const useStudent = wrapUseEndpoint(
    "/account/student/",
    types.FETCH_STUDENT_SUCCESSFUL
);

export const useParent = wrapUseEndpoint(
    "/account/parent/",
    types.FETCH_PARENT_SUCCESSFUL
);

export const useInstructor = wrapUseEndpoint(
    "/account/instructor/",
    types.FETCH_INSTRUCTOR_SUCCESSFUL
);

export const useCourse = wrapUseEndpoint(
    "/course/catalog/",
    types.FETCH_COURSE_SUCCESSFUL
);

export const useEnrollmentByCourse = (courseID) => {
    const token = useSelector(({auth}) => auth.token);
    const [status, setStatus] = useState(REQUEST_STARTED);
    const dispatch = useDispatch();
    useEffect(() => {
        let aborted = false;
        (async () => {
            try {
                const response = await instance.get(
                    "/course/enrollment/",
                    {
                        "headers": {
                            "Authorization": `Token ${token}`,
                        },
                        "params": {
                            "course_id": courseID,
                        },
                    }
                );
                if (!aborted) {
                    setStatus(response.status);
                    dispatch({
                        "type": types.FETCH_ENROLLMENT_SUCCESSFUL,
                        "payload": {
                            "id": courseID || REQUEST_ALL,
                            response,
                        },
                    });
                }
            } catch (err) {
                if (!aborted) {
                    setStatus((err && err.response && err.response.status) || MISC_FAIL);
                }
            }
        })();
        return () => {
            aborted = true;
        };
    }, [dispatch, courseID, token]);
    return status;
};
