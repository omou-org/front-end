import * as types from "./actionTypes";
import {instance, REQUEST_ALL, REQUEST_STARTED} from "./apiActions";
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";

/**
 * Get a student and status of the request
 * @param {*} studentID ID of student to fetch, empty to fetch all, or can be an array of IDs to fetch
 * @returns status
 */
export const useStudent = (studentID) => {
    const token = useSelector(({auth}) => auth.token);
    const [status, setStatus] = useState(REQUEST_STARTED);
    const dispatch = useDispatch();
    useEffect(() => {
        let aborted = false;
        if (!Array.isArray(studentID)) {
            (async () => {
                const requestURL = studentID ? `/account/student/${studentID}/` : "/account/student/";

                try {
                    const response = await instance.get(requestURL, {
                        "headers": {
                            "Authorization": `Token ${token}`,
                        },
                    });
                    if (!aborted) {
                        setStatus(response.status);
                        dispatch({
                            "type": types.FETCH_STUDENT_SUCCESSFUL,
                            "payload": {
                                "id": studentID || REQUEST_ALL,
                                response,
                            },
                        });
                    }
                } catch (err) {
                    if (!aborted) {
                        setStatus((err && err.response && err.response.status) || 600);
                    }
                }
            })();
        } else {
            (async () => {
                // creates a new action based on the response given
                const newAction = (type, response) => {
                    dispatch({
                        type,
                        "payload": {
                            "id": studentID || REQUEST_ALL,
                            response,
                        },
                    });
                };

                try {
                    const response = await Promise.all(studentID.map((student) =>
                        instance.get(`/account/student/${student}/`, {
                            "headers": {
                                "Authorization": `Token ${token}`,
                            },
                        })
                    ));
                    if (!aborted) {
                        setStatus(response[0].status);
                        dispatch({
                            "type": types.FETCH_STUDENT_SUCCESSFUL,
                            "payload": {
                                "id": studentID,
                                response,
                            },
                        });
                        newAction(types.FETCH_STUDENT_SUCCESSFUL, response);
                    }
                } catch (err) {
                    if (!aborted) {
                        setStatus((err && err.response && err.response.status) || 600);
                    }
                }
            })();
        }

        return () => {
            aborted = true;
        };
    }, [dispatch, studentID, token]);

    return status;
};
