import * as types from "./actionTypes";

import axios from "axios";

const instance = axios.create({
    "baseURL": "http://localhost:8000",
});

export const REQUEST_ALL = -1;

export const REQUEST_STARTED = 1;
export const REQUEST_SUCCESS = 2;
export const REQUEST_FAILED = 3;

const wrapGet = (endpoint, [startType, successType, failType], id) =>
    (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    "id": id || REQUEST_ALL,
                    response,
                },
            });
        };

        // request starting
        newAction(startType, {});

        return instance
            .request({
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                    // "month": month
                },
                "method": types.GET,
                "url": endpoint,
            })
            .then((response) => {
                // succesful request
                newAction(successType, response);
            })
            .catch((error) => {
                // failed request
                newAction(failType, error.response);
            });
    };

export const fetchCourses = (id) =>
    wrapGet(
        "/courses/catalog/",
        [
            types.FETCH_COURSES_STARTED,
            types.FETCH_COURSES_SUCCESSFUL,
            types.FETCH_COURSES_FAILED,
        ],
        id,
    );

export const fetchInstructors = (id) =>
    wrapGet(
        "/account/instructor/",
        [
            types.FETCH_INSTRUCTORS_STARTED,
            types.FETCH_INSTRUCTORS_SUCCESSFUL,
            types.FETCH_INSTRUCTORS_FAILED,
        ],
        id,
    );
