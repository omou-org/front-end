import * as types from "./actionTypes";
import {instance, MISC_FAIL, REQUEST_ALL, REQUEST_STARTED} from "./apiActions";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";

export const isFail = (...statuses) =>
    statuses.some((status) =>
        status && status !== REQUEST_STARTED &&
        (status < 200 || status >= 300));

export const isLoading = (...statuses) =>
    statuses.some((status) => !status || status === REQUEST_STARTED) &&
    !isFail(...statuses);

export const isSuccessful = (...statuses) =>
    statuses.every((status) => status && (status >= 200 && status < 300));

/**
 * Wrapper for hooks to use certain GET endpoints
 * config is optional object passed to the request
 * For the function used by the components:
 * @param {Number} id Single ID to fetch, array of IDs to fetch data for,
 * or undefined/null/falsey to fetch all (see second parameter)
 * @param {Boolean} noFetchOnUndef If true, undefined/null/falsey does NOT
 * fetch all (nothing is fetched). Useful with an ID that may be undefined
 * until some other data comes in, in order to avoid a fetch all being called
 * (Optimization).
 * @returns {Number} status of the request (null if not started/canceled)
 */
export const wrapUseEndpoint = (endpoint, successType) =>
    (id, config, noFetchOnUndef) => {
        const [status, setStatus] = useState(null);
        const dispatch = useDispatch();

        const handleError = useCallback((error) => {
            if (error && error.response && error.response.status) {
                setStatus(error.response.status);
            } else {
                setStatus(MISC_FAIL);
                console.error(error);
            }
        }, []);

        useEffect(() => {
            let aborted = false;
            // no id passed
            if (typeof id === "undefined" || id === null) {
            // if not to be optimized (i.e. a request_all is wanted)
                if (!noFetchOnUndef) {
                    (async () => {
                        try {
                            setStatus(REQUEST_STARTED);
                            const response = await instance.get(
                                endpoint,
                                config
                            );
                            if (!aborted) {
                                dispatch({
                                    "payload": {
                                        "id": REQUEST_ALL,
                                        response,
                                    },
                                    "type": successType,
                                });
                                setStatus(response.status);
                            }
                        } catch (error) {
                            if (!aborted) {
                                handleError(error);
                            }
                        }
                    })();
                }
            } else if (!Array.isArray(id)) {
            // standard single item request
                (async () => {
                    try {
                        setStatus(REQUEST_STARTED);
                        const response = await instance.get(
                            `${endpoint}${id}/`,
                            config
                        );
                        if (!aborted) {
                            dispatch({
                                "payload": {
                                    id,
                                    response,
                                },
                                "type": successType,
                            });
                            setStatus(response.status);
                        }
                    } catch (error) {
                        if (!aborted) {
                            handleError(error);
                        }
                    }
                })();
            } else if (id.length > 0) {
            // array of IDs to request (list of results requested)
                (async () => {
                    try {
                        setStatus(REQUEST_STARTED);
                        const response = await Promise.all(id.map(
                            (individual) => instance.get(
                                `${endpoint}${individual}/`,
                                config
                            )
                        ));
                        if (!aborted) {
                            dispatch({
                                "payload": {
                                    id,
                                    response,
                                },
                                "type": successType,
                            });
                            setStatus(response.reduce((finalStatus, {status}) =>
                                isFail(status) ? status
                                    : isFail(finalStatus) ? finalStatus
                                        : isLoading(status) ? status
                                            : finalStatus, 200));
                        }
                    } catch (error) {
                        if (!aborted) {
                            handleError(error);
                        }
                    }
                })();
            }
            // if something about request changed (item to request, settings, etc.)
            // discard old results and make new request
            return () => {
                setStatus(null);
                aborted = true;
            };
        }, [config, dispatch, id, noFetchOnUndef, handleError]);
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

export const useAdmin = wrapUseEndpoint(
    "/account/admin/",
    types.FETCH_ADMIN_SUCCESSFUL
);

export const useNote = wrapUseEndpoint(
    "/account/note",
    types.FETCH_ACCOUNT_NOTE_SUCCESSFUL    
);

export const useCourse = wrapUseEndpoint(
    "/course/catalog/",
    types.FETCH_COURSE_SUCCESSFUL
);

export const useEnrollment = wrapUseEndpoint(
    "/course/enrollment/",
    types.FETCH_ENROLLMENT_SUCCESSFUL,
);

export const useCategory = wrapUseEndpoint(
    "/course/categories/",
    types.GET_CATEGORY_SUCCESS,
);

export const usePriceRules = wrapUseEndpoint(
    "/pricing/rule/",
    types.GET_PRICE_RULE_SUCCESS,
);

export const useOutOfOffice = wrapUseEndpoint(
    "/account/instructor-out-of-office/",
    types.FETCH_OOO_SUCCESS,
);

export const useSession = wrapUseEndpoint(
    "/scheduler/session/",
    types.GET_SESSIONS_SUCCESS,
);

export const useEnrollmentByCourse = (courseID) => wrapUseEndpoint(
    "/course/enrollment/",
    types.FETCH_ENROLLMENT_SUCCESSFUL,
)(null, useMemo(() => ({
    "params": {
        "course_id": courseID,
    },
}), [courseID]));

export const useEnrollmentByStudent = (studentID) => wrapUseEndpoint(
    "/course/enrollment/",
    types.FETCH_ENROLLMENT_SUCCESSFUL,
)(null, useMemo(() => ({
    "params": {
        "user_id": studentID,
    },
}), [studentID]));

export const usePaymentByParent = (parentID) => wrapUseEndpoint(
    "/payment/payment/",
    types.GET_PAYMENT_PARENT_SUCCESS,
)(null, useMemo(() => ({
    "params": {
        "parent": parentID,
    },
}), [parentID]));

export const usePaymentByEnrollment = (enrollmentID) => wrapUseEndpoint(
    "/payment/payment/",
    types.GET_PAYMENT_ENROLLMENT_SUCCESS
)(null, useMemo(() => ({
    "params": {
        "enrollment": enrollmentID,
    },
}), [enrollmentID]));

export const useClassSessionsInPeriod = (time_frame, time_shift) =>
    wrapUseEndpoint(
        "/scheduler/session/",
        types.GET_SESSIONS_SUCCESS,
    )(null, useMemo(() => ({
        "params": {
            time_frame,
            time_shift,
            "view_option": "class",
        },
    }), [time_frame, time_shift]));

export const useTutoringSessionsInPeriod = (time_frame, time_shift) =>
    wrapUseEndpoint(
        "/scheduler/session/",
        types.GET_SESSIONS_SUCCESS,
    )(null, useMemo(() => ({
        "params": {
            time_frame,
            time_shift,
            "view_option": "tutoring",
        },
    }), [time_frame, time_shift]));

export const useSessionsInPeriod = (time_frame, time_shift) =>
    wrapUseEndpoint(
        "/scheduler/session/",
        types.GET_SESSIONS_SUCCESS
    )(null, useMemo(() => ({
        "params": {
            time_frame,
            time_shift,
        },
    }), [time_frame, time_shift]));

export const useInstructorAvailability = (instructorID) =>
    wrapUseEndpoint(
        "/account/instructor-availability/",
        types.FETCH_INSTRUCTOR_AVAILABILITY_SUCCESS
    )(null, useMemo(() => ({
        "params": {
            "instructor_id": instructorID,
        },
    }), [instructorID]));

export const useUnpaidSessions = wrapUseEndpoint(
    "/payment/unpaid-sessions/",
    types.GET_UNPAID_SUCCESS
);

export const useSessionSearchQuery = wrapUseEndpoint(
    "/search/session/?date=today&page=1/",
    types.GET_SESSION_SEARCH_QUERY_SUCCESS
)

// Hook
export const usePrevious = (value) => {
    // The ref object is a generic container whose current property is mutable
    // and can hold any value, similar to an instance property on a class
    const ref = useRef();

    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]);

    // Return previous value (happens before update in useEffect above)
    return ref.current;
};

export const useSearchParams = () => {
    const {search} = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
};
